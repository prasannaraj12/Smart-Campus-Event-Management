import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get overall analytics summary for an organizer
 */
export const getOrganizerAnalytics = query({
    args: { organizerId: v.id("users") },
    handler: async (ctx, args) => {
        // Get all events by this organizer
        const events = await ctx.db
            .query("events")
            .withIndex("by_organizer", (q) => q.eq("organizerId", args.organizerId))
            .collect();

        if (events.length === 0) {
            return {
                totalEvents: 0,
                totalRegistrations: 0,
                totalAttendance: 0,
                attendanceRate: 0,
                upcomingEvents: 0,
            };
        }

        const eventIds = events.map((e) => e._id);
        const now = new Date();

        // Count upcoming events
        const upcomingEvents = events.filter((e) => new Date(e.date) >= now).length;

        // Get all registrations for organizer's events
        let totalRegistrations = 0;
        let totalAttendance = 0;

        for (const eventId of eventIds) {
            const registrations = await ctx.db
                .query("registrations")
                .withIndex("by_event", (q) => q.eq("eventId", eventId))
                .collect();

            totalRegistrations += registrations.length;

            const attendance = await ctx.db
                .query("attendance")
                .withIndex("by_event", (q) => q.eq("eventId", eventId))
                .collect();

            totalAttendance += attendance.length;
        }

        const attendanceRate =
            totalRegistrations > 0
                ? Math.round((totalAttendance / totalRegistrations) * 100)
                : 0;

        return {
            totalEvents: events.length,
            totalRegistrations,
            totalAttendance,
            attendanceRate,
            upcomingEvents,
        };
    },
});

/**
 * Get registration trends over the last 30 days
 */
export const getRegistrationTrends = query({
    args: { organizerId: v.id("users") },
    handler: async (ctx, args) => {
        // Get all events by this organizer
        const events = await ctx.db
            .query("events")
            .withIndex("by_organizer", (q) => q.eq("organizerId", args.organizerId))
            .collect();

        if (events.length === 0) {
            return [];
        }

        const eventIds = events.map((e) => e._id);

        // Get all registrations for these events
        const allRegistrations: { _creationTime: number }[] = [];
        for (const eventId of eventIds) {
            const registrations = await ctx.db
                .query("registrations")
                .withIndex("by_event", (q) => q.eq("eventId", eventId))
                .collect();
            allRegistrations.push(...registrations);
        }

        // Group by date for last 30 days
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const dailyCounts: Record<string, number> = {};

        // Initialize all 30 days with 0
        for (let i = 0; i < 30; i++) {
            const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
            const dateKey = date.toISOString().split("T")[0];
            dailyCounts[dateKey] = 0;
        }

        // Count registrations per day
        for (const reg of allRegistrations) {
            const date = new Date(reg._creationTime);
            if (date >= thirtyDaysAgo) {
                const dateKey = date.toISOString().split("T")[0];
                if (dailyCounts[dateKey] !== undefined) {
                    dailyCounts[dateKey]++;
                }
            }
        }

        // Convert to array sorted by date
        return Object.entries(dailyCounts)
            .map(([date, count]) => ({
                date,
                count,
                label: new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    },
});

/**
 * Get event and registration counts by category
 */
export const getCategoryStats = query({
    args: { organizerId: v.id("users") },
    handler: async (ctx, args) => {
        const events = await ctx.db
            .query("events")
            .withIndex("by_organizer", (q) => q.eq("organizerId", args.organizerId))
            .collect();

        if (events.length === 0) {
            return [];
        }

        const categories = [
            "Workshop",
            "Seminar",
            "Sports",
            "Cultural",
            "Technical",
            "Social",
        ];

        const categoryStats: {
            category: string;
            eventCount: number;
            registrationCount: number;
            color: string;
        }[] = [];

        const colors: Record<string, string> = {
            Workshop: "#8B5CF6",
            Seminar: "#3B82F6",
            Sports: "#10B981",
            Cultural: "#F59E0B",
            Technical: "#EF4444",
            Social: "#EC4899",
        };

        for (const category of categories) {
            const categoryEvents = events.filter((e) => e.category === category);
            let registrationCount = 0;

            for (const event of categoryEvents) {
                const regs = await ctx.db
                    .query("registrations")
                    .withIndex("by_event", (q) => q.eq("eventId", event._id))
                    .collect();
                registrationCount += regs.length;
            }

            if (categoryEvents.length > 0 || registrationCount > 0) {
                categoryStats.push({
                    category,
                    eventCount: categoryEvents.length,
                    registrationCount,
                    color: colors[category],
                });
            }
        }

        return categoryStats;
    },
});

/**
 * Get attendance rate per event
 */
export const getAttendanceRates = query({
    args: { organizerId: v.id("users") },
    handler: async (ctx, args) => {
        const events = await ctx.db
            .query("events")
            .withIndex("by_organizer", (q) => q.eq("organizerId", args.organizerId))
            .collect();

        if (events.length === 0) {
            return [];
        }

        const eventStats: {
            eventId: string;
            title: string;
            registrations: number;
            attendance: number;
            rate: number;
            date: string;
        }[] = [];

        for (const event of events) {
            const registrations = await ctx.db
                .query("registrations")
                .withIndex("by_event", (q) => q.eq("eventId", event._id))
                .collect();

            const attendance = await ctx.db
                .query("attendance")
                .withIndex("by_event", (q) => q.eq("eventId", event._id))
                .collect();

            const rate =
                registrations.length > 0
                    ? Math.round((attendance.length / registrations.length) * 100)
                    : 0;

            eventStats.push({
                eventId: event._id,
                title: event.title,
                registrations: registrations.length,
                attendance: attendance.length,
                rate,
                date: event.date,
            });
        }

        // Sort by date descending (most recent first)
        return eventStats.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    },
});

/**
 * Get peak registration times (hourly distribution)
 */
export const getPeakRegistrationTimes = query({
    args: { organizerId: v.id("users") },
    handler: async (ctx, args) => {
        const events = await ctx.db
            .query("events")
            .withIndex("by_organizer", (q) => q.eq("organizerId", args.organizerId))
            .collect();

        if (events.length === 0) {
            return [];
        }

        const eventIds = events.map((e) => e._id);

        // Get all registrations
        const allRegistrations: { _creationTime: number }[] = [];
        for (const eventId of eventIds) {
            const registrations = await ctx.db
                .query("registrations")
                .withIndex("by_event", (q) => q.eq("eventId", eventId))
                .collect();
            allRegistrations.push(...registrations);
        }

        // Count by hour (0-23)
        const hourlyCounts: number[] = new Array(24).fill(0);

        for (const reg of allRegistrations) {
            const date = new Date(reg._creationTime);
            const hour = date.getHours();
            hourlyCounts[hour]++;
        }

        const maxCount = Math.max(...hourlyCounts, 1);

        return hourlyCounts.map((count, hour) => ({
            hour,
            count,
            label: `${hour.toString().padStart(2, "0")}:00`,
            percentage: Math.round((count / maxCount) * 100),
        }));
    },
});
