import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const register = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
    participantName: v.string(),
    participantEmail: v.string(),
    participantPhone: v.string(),
    college: v.string(),
    year: v.string(),
    teamName: v.optional(v.string()),
    teamMembers: v.optional(v.array(v.object({
      name: v.string(),
      email: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    // Check if already registered
    const existing = await ctx.db
      .query("registrations")
      .withIndex("by_event_and_user", (q) => 
        q.eq("eventId", args.eventId).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      throw new Error("Already registered for this event");
    }

    // Check max participants and event rules
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const isTeamEvent = event.isTeamEvent ?? !!event.teamSize; // backwards compatible

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    if (registrations.length >= event.maxParticipants) {
      throw new Error("Event is full");
    }

    // Enforce team vs individual rules
    const hasTeamData =
      !!args.teamName ||
      (args.teamMembers !== undefined && args.teamMembers.length > 0);

    if (!isTeamEvent && hasTeamData) {
      throw new Error("This event does not support team registration");
    }

    if (isTeamEvent) {
      const requiredSize = event.teamSize!;
      const memberCount = args.teamMembers?.length ?? 0;
      const totalPeople = 1 + memberCount; // leader + members

      if (totalPeople !== requiredSize) {
        throw new Error(
          `This event requires teams of exactly ${requiredSize} participants`
        );
      }
    }

    const registrationId = await ctx.db.insert("registrations", {
      eventId: args.eventId,
      userId: args.userId,
      participantName: args.participantName,
      participantEmail: args.participantEmail,
      participantPhone: args.participantPhone,
      college: args.college,
      year: args.year,
      teamName: args.teamName,
      teamMembers: args.teamMembers,
      attended: false,
    });

    return registrationId;
  },
});

export const cancelRegistration = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_event_and_user", (q) => 
        q.eq("eventId", args.eventId).eq("userId", args.userId)
      )
      .first();

    if (!registration) {
      throw new Error("Registration not found");
    }

    await ctx.db.delete(registration._id);
    return { success: true };
  },
});

export const isRegistered = query({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_event_and_user", (q) => 
        q.eq("eventId", args.eventId).eq("userId", args.userId)
      )
      .first();

    return registration;
  },
});

export const getEventRegistrations = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});

export const myRegistrations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("registrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const markAttendance = mutation({
  args: {
    registrationId: v.id("registrations"),
    attended: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.registrationId, {
      attended: args.attended,
      attendedAt: args.attended ? Date.now() : undefined,
    });

    return { success: true };
  },
});
