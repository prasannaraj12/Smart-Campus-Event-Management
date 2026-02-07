import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTP = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const code = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Delete any existing OTP for this email
    const existing = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Store new OTP
    await ctx.db.insert("otpCodes", {
      email: args.email,
      code,
      expiresAt,
    });

    // In production, send email here
    console.log(`OTP for ${args.email}: ${code}`);
    
    return { success: true, code }; // Remove code in production
  },
});

export const verifyOTP = mutation({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const otpRecord = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!otpRecord) {
      throw new Error("No OTP found for this email");
    }

    if (otpRecord.expiresAt < Date.now()) {
      await ctx.db.delete(otpRecord._id);
      throw new Error("OTP has expired");
    }

    if (otpRecord.code !== args.code) {
      throw new Error("Invalid OTP");
    }

    // Delete used OTP
    await ctx.db.delete(otpRecord._id);

    return { success: true };
  },
});
