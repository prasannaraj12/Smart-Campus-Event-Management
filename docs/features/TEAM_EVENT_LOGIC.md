# Team Event Logic - Complete Implementation ✅

## 🎯 Final Rule (One-Liner)
**Team size validation applies ONLY when the event is explicitly marked as a Team Event. Workshops and solo events completely bypass team logic.**

## 🔐 Event Types → Required Behavior

| Event Type | isTeamEvent | teamSize | Team Validation |
|------------|-------------|----------|-----------------|
| Workshop | ❌ false | null | ❌ NOT applied |
| Solo Event | ❌ false | null | ❌ NOT applied |
| Team Event | ✅ true | number | ✅ MUST apply |

## 🧱 Event Creation (Non-Negotiable)

### Workshop / Solo Event
```typescript
{
  isTeamEvent: false,
  teamSize: null  // 🚫 Never store teamSize if isTeamEvent === false
}
```

### Team Event
```typescript
{
  isTeamEvent: true,
  teamSize: 4  // example
}
```

## 🛠 Backend: ONLY Validate When Required

### ✅ CORRECT registrations.ts Logic

```typescript
// 🔐 TEAM VALIDATION: ONLY WHEN isTeamEvent === true
if (event.isTeamEvent === true) {
  // This is a team event - enforce team size
  if (!event.teamSize) {
    throw new Error("Team event is missing team size configuration");
  }

  const totalParticipants = 1 + (args.teamMembers?.length ?? 0);
  
  if (totalParticipants !== event.teamSize) {
    throw new Error(
      `This event requires teams of exactly ${event.teamSize} participants`
    );
  }

  if (!args.teamName || args.teamName.trim().length === 0) {
    throw new Error("Team name is required for team events");
  }
}
// ✅ Workshops and solo events completely bypass team logic
```

**Result:**
- ✔ Workshops bypass this completely
- ✔ Solo events bypass this completely
- ✔ No accidental enforcement

### ❌ WHAT YOU MUST NEVER DO

```typescript
// ☠ This breaks workshops & solo events
if (teamMembers.length !== event.teamSize) {
  throw new Error(...)
}
```

## 🖥 Frontend: Conditional Team UI

### Event Creation (CreateEventDialog.tsx)

```typescript
// Team Event Toggle
<input
  type="checkbox"
  checked={formData.isTeamEvent}
  onChange={(e) => setFormData({
    ...formData,
    isTeamEvent: e.target.checked,
    teamSize: e.target.checked ? formData.teamSize : undefined
  })}
/>

// Team Size Input (only if isTeamEvent)
{formData.isTeamEvent && (
  <input
    type="number"
    required={formData.isTeamEvent}
    min="2"
    value={formData.teamSize || ''}
    onChange={(e) => setFormData({
      ...formData,
      teamSize: e.target.value ? parseInt(e.target.value) : undefined
    })}
  />
)}
```

### Registration (RegistrationForm.tsx)

```typescript
const isTeamEvent = event.isTeamEvent === true

// Team Section - ONLY if isTeamEvent === true
{isTeamEvent && (
  <div className="neo-brutal bg-blue-100 p-6">
    <h3>Team Details</h3>
    {/* Team name and members inputs */}
  </div>
)}

// When submitting
await register({
  // ... participant details
  teamName: isTeamEvent ? formData.teamName : undefined,
  teamMembers: isTeamEvent ? formData.teamMembers : undefined,
})
```

## 🧪 Edge Case Safety

### In Event Creation (events.ts)

```typescript
// EDGE CASE SAFETY: If not a team event, force teamSize to null
let finalTeamSize = args.teamSize;
if (!args.isTeamEvent) {
  finalTeamSize = undefined;
}

// Validate team event requirements
if (args.isTeamEvent && (!finalTeamSize || finalTeamSize < 2)) {
  throw new Error("Team events must have a team size of at least 2");
}
```

**Prevents bad data forever.**

## 🧠 Simple Mental Model

```
Event → isTeamEvent?
      ├── YES → enforce teamSize
      └── NO  → ignore teamSize entirely
```

## ✅ Result After Fix

### Workshop Registration Flow
1. User clicks "Register Now"
2. Form shows: Name, Email, Phone, College, Year
3. **NO team fields** (isTeamEvent = false)
4. Submit → Backend checks: already registered? event full?
5. **NO team validation** → Registration succeeds ✅

### Team Event Registration Flow
1. User clicks "Register Now"
2. Form shows: Name, Email, Phone, College, Year
3. **PLUS team fields** (isTeamEvent = true)
   - Team Name
   - Team Members (teamSize - 1)
4. Submit → Backend checks: already registered? event full?
5. **Team validation applied** → Checks team size matches
6. Registration succeeds if team size correct ✅

## 📊 Implementation Status

### ✅ Backend (Convex)

**convex/schema.ts**
```typescript
events: defineTable({
  // ...
  isTeamEvent: v.boolean(),
  teamSize: v.optional(v.number()),
})

registrations: defineTable({
  // ...
  teamName: v.optional(v.string()),
  teamMembers: v.optional(v.array(v.object({
    name: v.string(),
    email: v.string(),
  }))),
})
```

**convex/events.ts**
- ✅ Accepts `isTeamEvent` and `teamSize`
- ✅ Forces `teamSize = undefined` if `isTeamEvent = false`
- ✅ Validates team size >= 2 if team event

**convex/registrations.ts**
- ✅ Checks `event.isTeamEvent === true` before validation
- ✅ Validates team size ONLY for team events
- ✅ Workshops bypass all team logic
- ✅ Stores team data only if team event

### ✅ Frontend (React)

**CreateEventDialog.tsx**
- ✅ Checkbox for "This is a Team Event"
- ✅ Team size input appears only if checked
- ✅ Sends `isTeamEvent: false` for workshops
- ✅ Sends `teamSize: undefined` for non-team events

**RegistrationForm.tsx**
- ✅ Checks `event.isTeamEvent === true`
- ✅ Shows team fields ONLY for team events
- ✅ Sends team data ONLY for team events
- ✅ Workshops show simple form

## 🧪 Test Scenarios

### Scenario 1: Create Workshop
1. Create event
2. Leave "This is a Team Event" unchecked
3. Submit
4. **Result**: `isTeamEvent: false`, `teamSize: null` ✅

### Scenario 2: Register for Workshop
1. Click "Register Now"
2. Fill: Name, Email, Phone, College, Year
3. **No team fields shown**
4. Submit
5. **Result**: Registration succeeds, no team validation ✅

### Scenario 3: Create Team Event
1. Create event
2. Check "This is a Team Event"
3. Enter team size: 4
4. Submit
5. **Result**: `isTeamEvent: true`, `teamSize: 4` ✅

### Scenario 4: Register for Team Event
1. Click "Register Now"
2. Fill: Name, Email, Phone, College, Year
3. **Team fields shown**: Team Name + 3 members
4. Fill all team details
5. Submit
6. **Result**: Registration succeeds if team size = 4 ✅

### Scenario 5: Register for Team Event (Wrong Size)
1. Click "Register Now"
2. Fill personal details
3. Fill team name but only 2 members (need 3)
4. Submit
5. **Result**: Error "This event requires teams of exactly 4 participants" ✅

## 🎯 Success Criteria

- ✔ Workshops register smoothly (no team validation)
- ✔ Solo events register smoothly (no team validation)
- ✔ Team events enforce exact size
- ✔ No Convex runtime errors
- ✔ Clean, predictable system
- ✔ Frontend matches backend logic
- ✔ Edge cases handled

## 📝 Files Modified

1. **convex/schema.ts** - Added `isTeamEvent` field
2. **convex/events.ts** - Edge case safety, team validation
3. **convex/registrations.ts** - Conditional team validation
4. **src/components/CreateEventDialog.tsx** - Team event toggle
5. **src/components/RegistrationForm.tsx** - Conditional team UI

## 🚀 How to Test

1. **Start the app**:
   ```bash
   npm install
   npx convex dev  # Terminal 1
   npm run dev     # Terminal 2
   ```

2. **Test Workshop**:
   - Create event (Workshop category)
   - Leave "Team Event" unchecked
   - Register as participant
   - Should work without team fields ✅

3. **Test Team Event**:
   - Create event
   - Check "This is a Team Event"
   - Set team size to 4
   - Register as participant
   - Fill team details (3 members)
   - Should work with team validation ✅

4. **Test Wrong Team Size**:
   - Try registering with only 2 members
   - Should show error ✅

## 🎉 Final Result

**System now works exactly as specified:**
- Workshops = individual registration (no teams)
- Team events = enforced team size
- Clean separation of logic
- No accidental validation
- Predictable behavior

---

**Implementation complete!** 🚀

The system now properly handles both individual and team events with the `isTeamEvent` flag controlling all team-related logic.
