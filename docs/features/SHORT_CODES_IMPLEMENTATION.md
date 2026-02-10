# Short Registration Codes Implementation

## ✅ What Changed

Instead of long Convex IDs like `jd73mae203x5466e1svr6x4vn980pn5f`, participants now get **short, memorable codes** like:

- `REG-A1B2C3`
- `REG-K7M9P2`
- `REG-X4Y8Z1`

## 🎯 Code Format

**Format:** `REG-XXXXXX` (6 characters)
- Uses only clear characters (no 0, O, 1, I to avoid confusion)
- Easy to type and share
- Unique per registration

## 📁 Files Modified

### Backend

1. **convex/schema.ts**
   - Added `registrationCode: v.string()` field
   - Added `by_code` index for fast lookups

2. **convex/utils.ts** (NEW)
   - `generateRegistrationCode()` - Creates REG-XXXXXX codes
   - Uses clear characters only (A-Z, 2-9, no confusing chars)

3. **convex/registrations.ts**
   - Updated `register` mutation to generate unique codes
   - Returns `registrationCodes` array
   - Added `getRegistrationByCode` query

### Frontend

4. **src/components/QRScanner.tsx**
   - Accepts short codes (REG-A1B2C3)
   - Accepts full URLs
   - Accepts registration IDs (backward compatible)

5. **src/pages/Ticket.tsx**
   - Handles both codes and IDs
   - Shows code prominently
   - QR contains just the code

6. **src/components/event-detail/EventSidebar.tsx**
   - QR code contains short code
   - Displays code prominently

7. **src/components/TeamTicketsDialog.tsx**
   - Shows codes for each team member
   - QR contains short codes

8. **src/components/RegistrationForm.tsx**
   - Redirects using codes
   - Passes codes to team dialog

## 🎫 How It Works

### Registration Flow

```
User registers → System generates REG-A1B2C3 → QR contains code → Saved to database
```

### Scanning Flow

```
Organizer scans QR → Gets REG-A1B2C3 → System looks up by code → Marks attendance
```

### Manual Entry

Organizers can type:
- `REG-A1B2C3` ✅
- `A1B2C3` ✅ (auto-adds REG-)
- Full URL ✅
- Registration ID ✅ (backward compatible)

## 📊 Database Structure

```typescript
registrations {
  _id: "jd73mae..." // Internal Convex ID
  registrationCode: "REG-A1B2C3" // User-facing code
  participantName: "John Doe"
  // ... other fields
}
```

## 🔍 Lookup Methods

1. **By Code** (Primary)
   ```typescript
   getRegistrationByCode({ code: "REG-A1B2C3" })
   ```

2. **By ID** (Fallback)
   ```typescript
   getRegistrationById({ registrationId: "jd73mae..." })
   ```

## 🎨 UI Display

### Participant View
```
┌─────────────────────┐
│  Your Ticket        │
├─────────────────────┤
│   REG-A1B2C3       │ ← Big, bold, blue
│   [QR CODE]         │
│   Show at event     │
└─────────────────────┘
```

### Organizer Scanner
```
┌─────────────────────┐
│  Scan QR Code       │
├─────────────────────┤
│  Enter code:        │
│  [REG-A1B2C3]      │
│  [Mark Attendance]  │
└─────────────────────┘
```

## ✨ Benefits

1. **Easy to Share** - "My code is REG-A1B2C3"
2. **Easy to Type** - Only 6 characters + prefix
3. **No Confusion** - Clear characters only
4. **Professional** - Looks clean and organized
5. **Unique** - System ensures no duplicates

## 🧪 Testing

### Test Registration
1. Register for event
2. See code: `REG-XXXXXX`
3. QR contains just the code
4. Code displayed prominently

### Test Scanning
1. Login as organizer
2. Click "Scan QR Code"
3. Enter: `REG-A1B2C3`
4. Attendance marked ✓

### Test Team Event
1. Register team of 4
2. See 4 codes:
   - `REG-A1B2C3` (Leader)
   - `REG-K7M9P2` (Member 1)
   - `REG-X4Y8Z1` (Member 2)
   - `REG-P3Q5R7` (Member 3)
3. Each has own QR with code

## 🔄 Migration

**For existing data:**
Run the migration script to add codes to old registrations:

```typescript
// In Convex dashboard, run:
migration:addCodesToExistingRegistrations
```

Or delete old data and start fresh (recommended for development).

## 📝 Code Examples

### Generate Code
```typescript
import { generateRegistrationCode } from "./utils";

const code = generateRegistrationCode();
// Returns: "REG-A1B2C3"
```

### Lookup by Code
```typescript
const registration = await ctx.db
  .query("registrations")
  .withIndex("by_code", (q) => q.eq("registrationCode", "REG-A1B2C3"))
  .first();
```

### Display Code
```tsx
<p className="text-4xl font-black text-blue-600">
  {registration.registrationCode}
</p>
```

## 🎉 Result

Participants now get clean, memorable codes like **REG-A1B2C3** instead of long IDs!

Perfect for:
- Sharing with friends
- Manual entry
- Phone calls
- Text messages
- Professional appearance

---

**Ready to use!** Just restart Convex dev server to deploy the changes.
