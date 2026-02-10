# 🔄 Migration Guide - QR Attendance System

## What Changed?

The attendance system has been completely redesigned to use **individual QR codes per participant** with automatic marking via organizer scans.

---

## 🗄️ Database Changes

### Schema Updates

**registrations table - ADDED FIELDS:**
```typescript
teamId: v.optional(v.string())           // Links team members
isTeamLeader: v.optional(v.boolean())    // Identifies team leader
```

**registrations table - REMOVED FIELDS:**
```typescript
attended: v.boolean()                    // ❌ Moved to attendance table
attendedAt: v.optional(v.number())       // ❌ Moved to attendance table
```

**NEW TABLE: attendance**
```typescript
attendance: defineTable({
  registrationId: v.id("registrations"),
  participantName: v.string(),
  eventId: v.id("events"),
  teamId: v.optional(v.string()),
  markedByOrganizerId: v.id("users"),
  markedAt: v.number(),
  status: v.literal("Present"),
})
```

---

## 🔧 Backend Changes

### convex/schema.ts
- Added `teamId` and `isTeamLeader` to registrations
- Removed `attended` and `attendedAt` from registrations
- Added new `attendance` table
- Added index `by_team` to registrations
- Added indexes to attendance table

### convex/registrations.ts

**register mutation - MAJOR CHANGE:**
- Now creates **multiple registrations** for team events
- Each team member gets their own registration record
- Returns object with `allRegistrationIds` array
- Generates unique `teamId` for team linking

**markAttendance mutation - COMPLETE REWRITE:**
- Now requires `organizerId` parameter
- Creates record in `attendance` table
- Validates organizer role
- Prevents duplicate marking
- Returns detailed response object

**NEW QUERIES:**
- `getAttendance(registrationId)` - Get attendance for one registration
- `getEventAttendance(eventId)` - Get all attendance for event

**REMOVED:**
- Old `markAttendance` with `attended` boolean parameter

---

## 🎨 Frontend Changes

### New Components

**src/pages/Ticket.tsx** (NEW)
- Role-based ticket page
- Participant view: Shows ticket details
- Organizer view: Auto-marks attendance
- Handles `/ticket/:registrationId` route

**src/components/TeamTicketsDialog.tsx** (NEW)
- Shows all QR codes for team registrations
- Displays after team registration
- Individual ticket links for each member

**src/components/QRScanner.tsx** (NEW)
- Organizer QR scanning interface
- Manual input for registration ID
- Opens ticket page for marking

### Updated Components

**src/components/RegistrationForm.tsx**
- Handles new registration response format
- Shows TeamTicketsDialog for team events
- Redirects to ticket page for solo events

**src/components/event-detail/EventSidebar.tsx**
- Fetches attendance from new table
- Displays attendance status per registration
- Shows team leader badge
- Removed manual attendance toggle
- Updated QR code to use ticket URL

**src/pages/Dashboard.tsx**
- Added "Scan QR Code" button for organizers
- Opens QRScanner component

**src/main.tsx**
- Added `/ticket/:registrationId` route

---

## 🚀 Migration Steps

### Step 1: Update Schema
```bash
# The schema changes will auto-deploy when you run:
npx convex dev
```

Convex will automatically:
- Add new fields to registrations
- Create attendance table
- Add new indexes

### Step 2: Handle Existing Data

**Option A: Fresh Start (Recommended for Development)**
```
1. Go to Convex Dashboard
2. Delete all data from registrations table
3. Restart with new system
```

**Option B: Migrate Existing Data (Production)**
```typescript
// Run this migration script in Convex Dashboard
// This converts old attendance data to new format

import { mutation } from "./_generated/server";

export const migrateAttendance = mutation({
  handler: async (ctx) => {
    const registrations = await ctx.db.query("registrations").collect();
    
    for (const reg of registrations) {
      // If old registration had attended=true, create attendance record
      if (reg.attended) {
        await ctx.db.insert("attendance", {
          registrationId: reg._id,
          participantName: reg.participantName,
          eventId: reg.eventId,
          teamId: reg.teamId,
          markedByOrganizerId: reg.userId, // Fallback
          markedAt: reg.attendedAt || Date.now(),
          status: "Present",
        });
      }
      
      // Remove old fields (Convex will handle this automatically)
    }
    
    return { migrated: registrations.length };
  },
});
```

### Step 3: Test the System

1. **Test Solo Registration:**
   - Register for workshop
   - Verify single QR generated
   - Test organizer scan

2. **Test Team Registration:**
   - Register team of 4
   - Verify 4 QRs generated
   - Test scanning each QR
   - Verify individual marking

3. **Test Attendance Display:**
   - Check event detail page
   - Verify attendance shows correctly
   - Test CSV export

---

## ⚠️ Breaking Changes

### API Changes

**register mutation response:**
```typescript
// OLD
return registrationId: Id<"registrations">

// NEW
return {
  success: true,
  leaderRegistrationId: Id<"registrations">,
  allRegistrationIds: Id<"registrations">[],
  teamId?: string,
  message: string
}
```

**markAttendance mutation:**
```typescript
// OLD
markAttendance({
  registrationId: Id<"registrations">,
  attended: boolean
})

// NEW
markAttendance({
  registrationId: Id<"registrations">,
  organizerId: Id<"users">
})
```

### Component Props

**EventSidebar:**
- No longer needs `markAttendance` mutation
- Now uses `getEventAttendance` query
- Attendance display is read-only

---

## 🐛 Troubleshooting

### Issue: "attended field not found"
**Solution:** The field was removed. Use the attendance table instead.
```typescript
// OLD
const isPresent = registration.attended

// NEW
const attendance = await ctx.db
  .query("attendance")
  .withIndex("by_registration", q => q.eq("registrationId", regId))
  .first()
const isPresent = !!attendance
```

### Issue: "Registration returns object instead of ID"
**Solution:** Update code to use new response format.
```typescript
// OLD
const regId = await register(...)

// NEW
const result = await register(...)
const regId = result.leaderRegistrationId
```

### Issue: "Team members not getting QR codes"
**Solution:** Check that TeamTicketsDialog is being shown.
```typescript
if (result.allRegistrationIds.length > 1) {
  setShowTeamTickets(true)
}
```

---

## ✅ Verification Checklist

After migration, verify:

- [ ] Schema updated in Convex Dashboard
- [ ] Attendance table exists
- [ ] New registrations create multiple records for teams
- [ ] QR codes open `/ticket/:regId` URLs
- [ ] Organizer scan marks attendance
- [ ] Participant view is read-only
- [ ] Duplicate scans prevented
- [ ] Team info displays correctly
- [ ] CSV export works
- [ ] No console errors

---

## 📞 Support

If you encounter issues:

1. Check Convex Dashboard for errors
2. Verify schema matches new structure
3. Clear browser cache
4. Restart Convex dev server
5. Check browser console for errors

---

## 🎉 Benefits of New System

- ✅ Individual tracking for all participants
- ✅ Automatic attendance via QR scan
- ✅ Better security (organizer-only marking)
- ✅ Handles team no-shows gracefully
- ✅ Audit trail (who marked, when)
- ✅ Scalable for large teams
- ✅ Real-world accurate workflow

---

## 📝 Next Steps

1. Run `npx convex dev` to deploy schema changes
2. Test registration flow
3. Test attendance marking
4. Update any custom code that uses old API
5. Train organizers on new QR scanning process

**The system is now ready for production use!** 🚀
