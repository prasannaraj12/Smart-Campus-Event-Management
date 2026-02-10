# Dashboard Fix - Attendance Count

## Issue
Dashboard was trying to access `registration.attended` which no longer exists after migrating to the new attendance system.

## Solution
Created a new query `getMyAttendanceCount` that properly counts attendance from the new `attendance` table.

## Changes Made

### 1. Backend - convex/registrations.ts
Added new query:
```typescript
export const getMyAttendanceCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all registrations for this user
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Count how many have attendance records
    let attendedCount = 0;
    for (const reg of registrations) {
      const attendance = await ctx.db
        .query("attendance")
        .withIndex("by_registration", (q) => q.eq("registrationId", reg._id))
        .first();
      
      if (attendance) {
        attendedCount++;
      }
    }

    return attendedCount;
  },
});
```

### 2. Frontend - src/pages/Dashboard.tsx
Updated to use new query:
```typescript
const myAttendanceCount = useQuery(
  api.registrations.getMyAttendanceCount,
  user?.role === 'participant' && user?.userId ? { userId: user.userId } : 'skip'
)

// Display in stats
<p className="text-4xl font-black mb-1">{myAttendanceCount || 0}</p>
<p className="font-bold">Events Attended</p>
```

## Result
✅ Dashboard now works correctly
✅ Shows accurate attendance count for participants
✅ No more references to old `attended` field

## Testing
1. Start the app: `npm run dev`
2. Login as participant
3. Dashboard should load without errors
4. "Events Attended" stat shows correct count based on attendance table
