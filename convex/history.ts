import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get participant's complete attendance history with event details
 */
export const getMyAttendanceHistory = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        // Get all registrations for this user
        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        if (!registrations || registrations.length === 0) {
            return [];
        }

        // For each registration, get event details and attendance status
        const historyItems = [];

        for (const reg of registrations) {
            // Get event details
            const event = await ctx.db.get(reg.eventId);
            if (!event) continue;

            // Check attendance
            const attendance = await ctx.db
                .query("attendance")
                .withIndex("by_registration", (q) => q.eq("registrationId", reg._id))
                .first();

            historyItems.push({
                registrationId: reg._id,
                registrationCode: reg.registrationCode,
                eventId: event._id,
                eventTitle: event.title,
                eventDate: event.date,
                eventTime: event.time,
                eventLocation: event.location,
                eventCategory: event.category,
                isTeamEvent: event.isTeamEvent,
                teamName: reg.teamName,
                isTeamLeader: reg.isTeamLeader,
                attended: !!attendance,
                attendedAt: attendance?.markedAt || null,
            });
        }

        // Sort by event date descending (most recent first)
        return historyItems.sort(
            (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
    },
});

/**
 * Get attendance statistics for a participant
 */
export const getMyStats = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        let attendedCount = 0;
        const categories: Record<string, number> = {};

        for (const reg of registrations) {
            const event = await ctx.db.get(reg.eventId);
            if (!event) continue;

            const attendance = await ctx.db
                .query("attendance")
                .withIndex("by_registration", (q) => q.eq("registrationId", reg._id))
                .first();

            if (attendance) {
                attendedCount++;
                categories[event.category] = (categories[event.category] || 0) + 1;
            }
        }

        // Find most attended category
        const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

        return {
            totalRegistrations: registrations.length,
            totalAttended: attendedCount,
            attendanceRate: registrations.length > 0
                ? Math.round((attendedCount / registrations.length) * 100)
                : 0,
            topCategory: topCategory ? topCategory[0] : null,
            categoryCounts: categories,
        };
    },
});
