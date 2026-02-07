import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    category: v.union(
      v.literal("Workshop"),
      v.literal("Seminar"),
      v.literal("Sports"),
      v.literal("Cultural"),
      v.literal("Technical"),
      v.literal("Social")
    ),
    maxParticipants: v.number(),
    organizerId: v.id("users"),
    isTeamEvent: v.boolean(),
    teamSize: v.optional(v.number()), // Fixed team size when isTeamEvent = true
    requirements: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.organizerId);
    
    if (!user || user.role !== "organizer") {
      console.error("Unauthorized: User is not an organizer", args.organizerId);
      throw new Error("Only organizers can create events");
    }

    // Category-specific validation for requirements only
    if (args.category === "Workshop" || args.category === "Technical") {
      if (!args.requirements || args.requirements.trim().length === 0) {
        throw new Error("Requirements are required for Workshop and Technical events");
      }
    }

    // Team-event rules
    if (args.isTeamEvent) {
      if (args.teamSize === undefined || args.teamSize < 2) {
        throw new Error("Team size (at least 2) is required for team events");
      }
    } else {
      // Non-team event: ignore any accidental teamSize value
      args.teamSize = undefined;
    }

    const eventId = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      date: args.date,
      time: args.time,
      location: args.location,
      category: args.category,
      maxParticipants: args.maxParticipants,
      organizerId: args.organizerId,
      isTeamEvent: args.isTeamEvent,
      teamSize: args.teamSize,
      requirements: args.requirements,
    });

    console.log("Event created:", eventId);
    return eventId;
  },
});

export const getAllEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    console.log("Fetched events:", events.length);
    return events;
  },
});

export const getEventById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.eventId);
  },
});

export const getEventsByOrganizer = query({
  args: { organizerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizerId", args.organizerId))
      .collect();
  },
});

export const deleteEvent = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.organizerId !== args.userId) {
      throw new Error("Only the organizer can delete this event");
    }

    await ctx.db.delete(args.eventId);
    return { success: true };
  },
});
