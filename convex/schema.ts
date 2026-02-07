import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.optional(v.string()),
    role: v.union(v.literal("organizer"), v.literal("participant")),
    isAnonymous: v.boolean(),
    name: v.optional(v.string()),
  }).index("by_email", ["email"]),

  events: defineTable({
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
    // Team configuration – controls whether registration has team details
    isTeamEvent: v.optional(v.boolean()),
    teamSize: v.optional(v.number()),
    requirements: v.optional(v.string()),
  }).index("by_organizer", ["organizerId"]),

  registrations: defineTable({
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
    attended: v.boolean(),
    attendedAt: v.optional(v.number()),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_and_user", ["eventId", "userId"]),

  otpCodes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
  }).index("by_email", ["email"]),
});
