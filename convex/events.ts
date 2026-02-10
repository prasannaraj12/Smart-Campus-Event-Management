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
    teamSize: v.optional(v.number()),
    requirements: v.optional(v.string()),
    organizerName: v.optional(v.string()),
    organizerEmail: v.optional(v.string()),
    organizerPhone: v.optional(v.string()),
    organizerRole: v.optional(v.string()),
    showContactInfo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.organizerId);

    if (!user || user.role !== "organizer") {
      console.error("Unauthorized: User is not an organizer", args.organizerId);
      throw new Error("Only organizers can create events");
    }

    // EDGE CASE SAFETY: If not a team event, force teamSize to null
    let finalTeamSize = args.teamSize;
    if (!args.isTeamEvent) {
      finalTeamSize = undefined;
    }

    // Validate team event requirements
    if (args.isTeamEvent && (!finalTeamSize || finalTeamSize < 2)) {
      throw new Error("Team events must have a team size of at least 2");
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
      teamSize: finalTeamSize,
      requirements: args.requirements,
      organizerName: args.organizerName,
      organizerEmail: args.organizerEmail,
      organizerPhone: args.organizerPhone,
      organizerRole: args.organizerRole,
      showContactInfo: args.showContactInfo,
    });

    console.log("Event created:", eventId, "isTeamEvent:", args.isTeamEvent);
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

// Delete event functionality removed as per requirements

// Temporary mutation to fix event ownership mismatch
export const reassignOrganizer = mutation({
  args: {
    eventId: v.id("events"),
    newOrganizerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    await ctx.db.patch(args.eventId, {
      organizerId: args.newOrganizerId,
    });

    console.log(`Reassigned event ${args.eventId} to organizer ${args.newOrganizerId}`);
    return { success: true };
  },
});

// Update event mutation
export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
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
    isTeamEvent: v.boolean(),
    teamSize: v.optional(v.number()),
    requirements: v.optional(v.string()),
    organizerName: v.optional(v.string()),
    organizerEmail: v.optional(v.string()),
    organizerPhone: v.optional(v.string()),
    organizerRole: v.optional(v.string()),
    showContactInfo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    await ctx.db.patch(args.eventId, {
      title: args.title,
      description: args.description,
      date: args.date,
      time: args.time,
      location: args.location,
      category: args.category,
      maxParticipants: args.maxParticipants,
      isTeamEvent: args.isTeamEvent,
      teamSize: args.isTeamEvent ? args.teamSize : undefined,
      requirements: args.requirements,
      organizerName: args.organizerName,
      organizerEmail: args.organizerEmail,
      organizerPhone: args.organizerPhone,
      organizerRole: args.organizerRole,
      showContactInfo: args.showContactInfo,
    });

    console.log("Event updated:", args.eventId);
    return { success: true };
  },
});

// Delete event mutation
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

    // Verify the user is an organizer
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "organizer") {
      throw new Error("Only organizers can delete events");
    }

    // Delete all registrations for this event
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const reg of registrations) {
      await ctx.db.delete(reg._id);
    }

    // Delete the event
    await ctx.db.delete(args.eventId);

    console.log("Event deleted:", args.eventId);
    return { success: true };
  },
});
