import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Upload a photo (stores metadata, actual file uploaded separately)
export const uploadPhoto = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
    userName: v.string(),
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const photoId = await ctx.db.insert("photos", {
      eventId: args.eventId,
      uploadedByUserId: args.userId,
      uploadedByName: args.userName,
      storageId: args.storageId,
      caption: args.caption,
      uploadedAt: Date.now(),
      likes: 0,
    });

    return { success: true, photoId };
  },
});

// Get all photos for an event
export const getEventPhotos = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Sort by upload time (newest first)
    return photos.sort((a, b) => b.uploadedAt - a.uploadedAt);
  },
});

// Get photo URL from storage
export const getPhotoUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Like/unlike a photo
export const toggleLike = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if already liked
    const existingLike = await ctx.db
      .query("photoLikes")
      .withIndex("by_photo_and_user", (q) => 
        q.eq("photoId", args.photoId).eq("userId", args.userId)
      )
      .first();

    const photo = await ctx.db.get(args.photoId);
    if (!photo) {
      throw new Error("Photo not found");
    }

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.photoId, {
        likes: Math.max(0, (photo.likes || 0) - 1),
      });
      return { success: true, liked: false };
    } else {
      // Like
      await ctx.db.insert("photoLikes", {
        photoId: args.photoId,
        userId: args.userId,
        likedAt: Date.now(),
      });
      await ctx.db.patch(args.photoId, {
        likes: (photo.likes || 0) + 1,
      });
      return { success: true, liked: true };
    }
  },
});

// Check if user liked a photo
export const hasLiked = query({
  args: {
    photoId: v.id("photos"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("photoLikes")
      .withIndex("by_photo_and_user", (q) => 
        q.eq("photoId", args.photoId).eq("userId", args.userId)
      )
      .first();

    return !!like;
  },
});

// Delete a photo (uploader or organizer only)
export const deletePhoto = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId);
    if (!photo) {
      throw new Error("Photo not found");
    }

    const user = await ctx.db.get(args.userId);
    
    // Check if user is uploader or organizer
    if (photo.uploadedByUserId !== args.userId && user?.role !== "organizer") {
      throw new Error("You can only delete your own photos");
    }

    // Delete all likes first
    const likes = await ctx.db
      .query("photoLikes")
      .withIndex("by_photo", (q) => q.eq("photoId", args.photoId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // Delete the photo from storage
    await ctx.storage.delete(photo.storageId);

    // Delete the photo metadata
    await ctx.db.delete(args.photoId);

    return { success: true };
  },
});

// Generate upload URL for photo
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
