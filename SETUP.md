# CampusConnect Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Convex
```bash
npx convex dev
```

This command will:
1. Open your browser to https://dashboard.convex.dev
2. Ask you to sign in (or create a free account)
3. Create a new Convex project
4. Generate your deployment URL
5. Start the Convex development server

**Important**: Keep this terminal window open!

### Step 3: Configure Environment
The Convex CLI will automatically create a `.env.local` file with your deployment URL. If not, create it manually:

```bash
# Create .env.local file
echo "VITE_CONVEX_URL=<your-convex-url>" > .env.local
```

Replace `<your-convex-url>` with the URL from the Convex dashboard.

### Step 4: Start the Frontend
Open a **new terminal window** and run:

```bash
npm run dev
```

### Step 5: Open the App
Navigate to: http://localhost:5173

🎉 **You're ready to go!**

## First Time Usage

### Testing as a Participant
1. Click "Get Started"
2. Select "Participant"
3. You'll be automatically signed in anonymously
4. Browse events (create some as an organizer first!)

### Testing as an Organizer
1. Click "Get Started"
2. Select "Organizer"
3. Enter any email address (e.g., `test@example.com`)
4. Click "Send OTP"
5. **The OTP will be displayed on screen** (in production, it would be emailed)
6. Copy the 6-digit code and paste it
7. Click "Verify & Sign In"
8. Create your first event!

## Development Workflow

### Running the App
You need **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
npx convex dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Making Changes

#### Frontend Changes
- Edit files in `src/`
- Changes hot-reload automatically
- No restart needed

#### Backend Changes
- Edit files in `convex/`
- Convex automatically redeploys
- Changes apply instantly

### Viewing Data
1. Go to https://dashboard.convex.dev
2. Select your project
3. Click "Data" to see all tables
4. View users, events, registrations in real-time

## Common Issues & Solutions

### Issue: "VITE_CONVEX_URL is not defined"
**Solution**: Make sure `.env.local` exists with your Convex URL:
```bash
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### Issue: "Failed to connect to Convex"
**Solution**: Ensure `npx convex dev` is running in a separate terminal

### Issue: "Module not found" errors
**Solution**: Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

### Issue: Port 5173 already in use
**Solution**: Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

## Project Structure Overview

```
campusconnect/
├── convex/              # Backend (Convex functions)
│   ├── schema.ts        # Database schema
│   ├── users.ts         # User management
│   ├── events.ts        # Event CRUD operations
│   ├── registrations.ts # Registration logic
│   └── auth.ts          # OTP authentication
│
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components (routes)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── main.tsx        # App entry point
│
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
└── tsconfig.json       # TypeScript config
```

## Testing the Full Flow

### 1. Create an Event (as Organizer)
- Sign in as organizer
- Click "Create New Event"
- Fill in event details
- Submit

### 2. Register for Event (as Participant)
- Sign out (or open incognito window)
- Sign in as participant
- Find the event on dashboard
- Click "View Details"
- Click "Register Now"
- Fill in registration form
- Submit

### 3. View QR Ticket
- After registration, QR code appears
- Download the ticket
- This would be scanned at the event

### 4. Mark Attendance (as Organizer)
- Sign in as organizer
- Go to your event
- See list of registered participants
- Click the check button to mark attendance

## Building for Production

### 1. Build Frontend
```bash
npm run build
```

### 2. Deploy Convex Backend
```bash
npx convex deploy
```

### 3. Deploy Frontend
Upload the `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

### 4. Update Environment
Set `VITE_CONVEX_URL` to your production Convex URL in your hosting provider's dashboard.

## Tips for Development

1. **Use the Convex Dashboard**: It's incredibly helpful for debugging
2. **Check Browser Console**: Errors and logs appear here
3. **Hot Reload**: Both frontend and backend support hot reloading
4. **Real-time Updates**: Open multiple browser windows to see real-time sync
5. **Mobile Testing**: Use your phone on the same network (use your local IP)

## Next Steps

- Customize the design colors in `tailwind.config.js`
- Add more event categories in `convex/schema.ts`
- Implement email sending for OTP (use SendGrid, Resend, etc.)
- Add more fields to registration form
- Implement QR code scanning for attendance

## Need Help?

- Convex Docs: https://docs.convex.dev
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion

Happy coding! 🚀
