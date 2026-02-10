# 🚀 CampusConnect - Quick Start Guide

## Run the App in 3 Steps:

### Option 1: Use the Batch File (Easiest - Windows)
```bash
start-dev.bat
```
This will automatically open two terminal windows for you!

### Option 2: Manual Start (All Platforms)

**Step 1: Install Dependencies** (First time only)
```bash
npm install
```

**Step 2: Start Backend** (Terminal 1)
```bash
npx convex dev
```
- Opens browser to Convex dashboard
- Sign in (free account)
- Keep this terminal open!

**Step 3: Start Frontend** (Terminal 2 - New Window)
```bash
npm run dev
```

**Step 4: Open App**
```
http://localhost:5173
```

---

## ✅ What's Working:

### Features Implemented:
- ✅ **Dual Roles**: Organizer & Participant
- ✅ **Event Management**: Create, view, edit events
- ✅ **Smart Registration**: 
  - Individual events (workshops) - no team required
  - Team events - enforces exact team size
- ✅ **QR Tickets**: Download and use for check-in
- ✅ **Attendance Tracking**: Mark attendance with one click
- ✅ **CSV Export**: Export participant data (organizers only)
- ✅ **Landing Page Countdown**: Next event countdown with gradient
- ✅ **Neo Brutalism Design**: Bold, vibrant, modern UI

### Key Logic:
1. **Team Events**: Only validate team size when `isTeamEvent = true`
2. **Workshops/Solo**: Completely bypass team validation
3. **Countdown**: Shows on Landing page only (not Dashboard)
4. **CSV Export**: Name, Email, Department, Year, Event Name, Date

---

## 🎯 Test the App:

### As Organizer:
1. Click "Get Started" → "Organizer"
2. Enter email: `test@example.com`
3. Click "Send OTP" (code shows on screen)
4. Copy the 6-digit code and verify
5. Create an event:
   - Workshop (no team) ✅
   - Team event (requires team size) ✅

### As Participant:
1. Click "Get Started" → "Participant"
2. Browse events
3. Register for events
4. Download QR ticket
5. View countdown on landing page

---

## 📁 Key Files:

### Backend (convex/):
- `schema.ts` - Database structure with `isTeamEvent` flag
- `registrations.ts` - Team validation logic
- `events.ts` - Event CRUD operations
- `auth.ts` - OTP authentication

### Frontend (src/):
- `pages/Landing.tsx` - Countdown section
- `pages/Dashboard.tsx` - Event list (no countdown)
- `components/CreateEventDialog.tsx` - Team event toggle
- `components/RegistrationForm.tsx` - Conditional team fields
- `components/event-detail/EventSidebar.tsx` - CSV export

---

## 🔧 Troubleshooting:

**"VITE_CONVEX_URL not defined"**
→ Make sure `npx convex dev` is running first

**"Port already in use"**
→ Kill the process or use: `npm run dev -- --port 3000`

**"Module not found"**
→ Run: `npm install`

---

## 📚 Full Documentation:

- `SETUP.md` - Complete setup guide
- `APP_STRUCTURE.md` - Architecture overview
- `PROJECT_SUMMARY.md` - Feature summary
- `TROUBLESHOOTING.md` - Common issues

---

## 🎉 You're Ready!

Your CampusConnect app is fully functional and ready for demos or hackathons!

**Need to make changes?** Both frontend and backend hot-reload automatically.

**View data?** Go to https://dashboard.convex.dev → Your Project → Data
