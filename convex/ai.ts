import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Internal queries for AI context building (must be defined before they're used)
export const getEventForAI = internalQuery({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.eventId);
    },
});

export const getQAForAI = internalQuery({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const questions = await ctx.db
            .query("discussions")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .filter((q) => q.eq(q.field("type"), "question"))
            .collect();

        // Get answers for each question
        const qaWithAnswers = await Promise.all(
            questions.map(async (q) => {
                const comments = await ctx.db
                    .query("comments")
                    .withIndex("by_discussion", (c) => c.eq("discussionId", q._id))
                    .filter((c) => c.eq(c.field("isAnswer"), true))
                    .first();

                return {
                    ...q,
                    answer: comments?.message || null,
                };
            })
        );

        return qaWithAnswers.slice(0, 10); // Limit to 10 most recent
    },
});

export const getAnnouncementsForAI = internalQuery({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("announcements")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();
    },
});

// Generate event description using AI
export const generateDescription = action({
    args: {
        title: v.string(),
        category: v.string(),
    },
    handler: async (_ctx, args) => {
        const apiKey = process.env.GEMINI_API_KEY;

        console.log("----------------------------------------");
        console.log("🚀 AI Action Triggered");
        console.log("ARGS:", args);
        console.log("API Key present:", !!apiKey);
        if (apiKey) console.log("API Key starts with:", apiKey.substring(0, 4));
        console.log("----------------------------------------");

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const prompt = `Write a short, engaging, and professional event description for a college event titled "${args.title}" which is a "${args.category}" event. Keep it under 100 words.`;

                console.log("📝 Sending prompt to Gemini:", prompt);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                console.log("✅ Gemini Response received:", text);

                return text;
            } catch (error) {
                console.error("❌ Gemini API CRITICAL ERROR:", error);
                // Fallback to mock if API fails
            }
        } else {
            console.log("⚠️ No API Key found. Using mock.");
        }

        // Mock Fallback (if no key or API error)
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

        const mockDescriptions: Record<string, string> = {
            Workshop: `Join us for an interactive ${args.title} workshop! Learn practical skills, network with peers, and enhance your knowledge in this hands-on session. Perfect for beginners and enthusiasts alike.`,
            Seminar: `Don't miss this insightful seminar on ${args.title}. Industry experts will share their knowledge and discuss the latest trends. A great opportunity for learning and professional growth.`,
            Sports: `Get ready for action at the ${args.title}! Come cheer for your teams or participate in this exciting sports event. Energy, competition, and fun guaranteed!`,
            Cultural: `Experience the vibrant culture at ${args.title}. Enjoy performances, art, and creativity that showcase our diverse talent. A celebration you won't want to miss!`,
            Technical: `Dive deep into technology with ${args.title}. Explore cutting-edge innovations, participate in challenges, and connect with tech enthusiasts.`,
            Social: `Come hang out at ${args.title}! A perfect chance to relax, meet new people, and make lasting memories. Good vibes only!`,
        };

        return (
            mockDescriptions[args.category] ||
            `Join us for ${args.title}! This exciting event promises to be a highlight of the semester. Don't miss out on the fun and learning!`
        );
    },
});

/**
 * AI-powered Q&A Answer Generator
 * Analyzes event context and existing Q&A to suggest answers before posting
 */
export const generateQAAnswer = action({
    args: {
        eventId: v.id("events"),
        userQuestion: v.string(),
    },
    handler: async (ctx, args): Promise<{ success: boolean; answer: string }> => {
        const apiKey = process.env.GEMINI_API_KEY;

        // Fetch event details
        const event = await ctx.runQuery(internal.ai.getEventForAI, { eventId: args.eventId });
        if (!event) {
            return { success: false, answer: "Event not found." };
        }

        // Fetch existing Q&A for this event
        const existingQA = await ctx.runQuery(internal.ai.getQAForAI, { eventId: args.eventId });

        // Fetch event announcements
        const announcements = await ctx.runQuery(internal.ai.getAnnouncementsForAI, { eventId: args.eventId });

        // Build context from ONLY these sources (prevents hallucination)
        let context = `
Event Details:
- Title: ${event.title}
- Description: ${event.description}
- Date: ${event.date} at ${event.time}
- Location: ${event.location}
- Category: ${event.category}
- Max Participants: ${event.maxParticipants}
- Team Event: ${event.isTeamEvent ? `Yes, team size of ${event.teamSize}` : 'No, individual participation'}
- Requirements: ${event.requirements || 'None specified'}
`;

        if (existingQA.length > 0) {
            context += `\nPrevious Q&A:\n`;
            for (const qa of existingQA) {
                context += `Q: ${qa.title || qa.message}\n`;
                if (qa.answer) {
                    context += `A: ${qa.answer}\n`;
                }
                context += `\n`;
            }
        }

        if (announcements.length > 0) {
            context += `\nOrganizer Announcements:\n`;
            for (const ann of announcements) {
                context += `- ${ann.title}: ${ann.message}\n`;
            }
        }

        context += `\nUser Question: ${args.userQuestion}`;

        // Strict AI prompt to prevent hallucination
        const prompt = `You are an assistant for a campus event platform.

Answer the user's question ONLY using the provided context.
If the answer is not available in the context, respond with exactly:
"I'm not sure based on the available information. Please ask the organizer."

Do NOT make up information. Do NOT guess. Only use facts from the context.

Context:
${context}

Answer in 2-3 clear, helpful sentences.`;

        console.log("🤖 AI Q&A Request for event:", event.title);

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const answer = response.text();

                console.log("✅ AI Q&A Answer generated");
                return { success: true, answer };
            } catch (error) {
                console.error("❌ Gemini API error:", error);
                return {
                    success: false,
                    answer: "I'm having trouble generating a response. Please ask the organizer directly."
                };
            }
        }

        // Mock fallback if no API key
        return {
            success: true,
            answer: `Based on the event details, "${event.title}" is a ${event.category} event scheduled for ${event.date}. ${event.isTeamEvent ? `Teams of ${event.teamSize} are required.` : 'This is an individual participation event.'} Please check the event description or ask the organizer for more specific details.`
        };
    },
});
