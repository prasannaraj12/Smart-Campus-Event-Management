# CampusConnect (Smart Campus Event Manager)

Neo‑Brutalism smart campus event management webapp: event creation, anonymous participant registration, attendance tracking, countdowns, and QR-code tickets.

## Run (UI only)

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npm run dev
```

## Run with Convex backend (recommended)

This project uses Convex for data + auth OTP logic.

1. Create/configure a Convex project (one-time)

```bash
npx convex dev
```

2. In a new terminal, run the frontend

```bash
npm run dev
```

3. Set `VITE_CONVEX_URL` in `.env.local` (Convex prints it in the terminal). Example:

```bash
VITE_CONVEX_URL="https://<your-deployment>.convex.cloud"
```

After Convex is configured, it will regenerate `convex/_generated/*` automatically.

# CampusConnect - Smart Campus Event Management

A modern, Neo Brutalism-styled event management system for campus events with real-time updates, QR code tickets, and attendance tracking.

## Features

- 🎨 **Neo Brutalism Design** - Bold, modern UI with thick borders and vibrant colors
- 👥 **Dual User Roles** - Organizers and Participants with role-specific features
- 📅 **Event Management** - Create, browse, and manage campus events
- 🎫 **QR Code Tickets** - Digital tickets with QR codes for seamless check-in
- ⏱️ **Live Countdown** - Real-time countdown to event start
- 📊 **Attendance Tracking** - Mark and track participant attendance
- 🔐 **Email OTP Authentication** - Secure organizer authentication
- 🚀 **Real-time Updates** - Powered by Convex for instant data synchronization
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- ✨ **Smooth Animations** - Framer Motion for delightful interactions

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Convex (serverless)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **QR Codes**: react-qr-code
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd campusconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   - This will open your browser to create a Convex account (if you don't have one)
   - Create a new project
   - Copy the deployment URL

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your Convex deployment URL:
   ```
   VITE_CONVEX_URL=https://your-deployment-url.convex.cloud
   ```

5. **Start the development server**
   
   Open two terminal windows:
   
   **Terminal 1 - Convex Backend:**
   ```bash
   npx convex dev
   ```
   
   **Terminal 2 - React Frontend:**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Start using CampusConnect!

## Usage

### For Participants

1. Click "Get Started" on the landing page
2. Select "Participant" role
3. Browse available events on the dashboard
4. Click on an event to view details
5. Register for events you're interested in
6. Receive a QR code ticket for check-in
7. Show your QR code at the event for attendance marking

### For Organizers

1. Click "Get Started" on the landing page
2. Select "Organizer" role
3. Sign in with your email (OTP will be displayed in console/UI)
4. Create new events with the "Create New Event" button
5. View all events and your created events on the dashboard
6. Click on your events to:
   - View registered participants
   - Mark attendance using the check button
   - See real-time registration updates

## Project Structure

```
campusconnect/
├── src/
│   ├── components/
│   │   ├── event-detail/
│   │   │   ├── EventCountdown.tsx
│   │   │   ├── EventInfo.tsx
│   │   │   └── EventSidebar.tsx
│   │   ├── CreateEventDialog.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventRegistrationDialog.tsx
│   │   └── RegistrationForm.tsx
│   ├── hooks/
│   │   └── use-auth.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EventDetail.tsx
│   │   ├── Landing.tsx
│   │   ├── NotFound.tsx
│   │   └── RoleSelection.tsx
│   ├── index.css
│   └── main.tsx
├── convex/
│   ├── auth.ts
│   ├── events.ts
│   ├── registrations.ts
│   ├── schema.ts
│   └── users.ts
└── ...config files
```

## Key Features Explained

### Neo Brutalism Design
- Bold 4-6px borders
- Hard shadows (no blur)
- High contrast colors
- Vibrant category-based color coding
- Geometric shapes and minimal rounded corners

### Real-time Updates
- Convex provides automatic real-time synchronization
- Event registrations update instantly across all clients
- Attendance marking reflects immediately

### QR Code System
- Generated upon registration
- Contains registration ID, event ID, and participant name
- Downloadable as PNG image
- Used for quick check-in at events

### Role-Based Access
- Participants: Browse, register, view tickets
- Organizers: All participant features + create events, manage attendance

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npx convex dev` - Start Convex backend in development mode

### Environment Variables

- `VITE_CONVEX_URL` - Your Convex deployment URL (required)

## Deployment

### Deploy Frontend (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

3. Set environment variable `VITE_CONVEX_URL` in your hosting dashboard

### Deploy Backend (Convex)

1. Deploy to production:
   ```bash
   npx convex deploy
   ```

2. Use the production URL in your frontend environment variables

## Future Enhancements

- Push notifications for event reminders
- Event feedback and ratings
- Calendar integration (Google Calendar, iCal)
- Advanced analytics dashboard
- Social sharing features
- Event recommendations
- Multi-language support
- Dark mode

## License

MIT License - feel free to use this project for your campus!

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for campus communities
