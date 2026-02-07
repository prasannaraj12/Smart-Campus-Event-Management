# CampusConnect - App Structure Guide

## 🗺️ Application Flow

```
┌─────────────┐
│   Landing   │  Public home page
│   Page      │  "Get Started" button
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Role     │  Choose user type
│  Selection  │  Participant or Organizer
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ Anonymous   │   │    Auth     │
│  Sign In    │   │   (OTP)     │
│(Participant)│   │ (Organizer) │
└──────┬──────┘   └──────┬──────┘
       │                 │
       └────────┬────────┘
                │
                ▼
        ┌─────────────┐
        │  Dashboard  │  Event hub
        │             │  Browse & filter
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │Event Detail │  Full event info
        │             │  Register/Manage
        └─────────────┘
```

## 📁 File Organization

### Backend (convex/)
```
convex/
├── schema.ts           # Database tables definition
│   ├── users          # User accounts
│   ├── events         # Campus events
│   ├── registrations  # Event registrations
│   └── otpCodes       # Auth codes
│
├── users.ts           # User operations
│   ├── createAnonymousUser()
│   ├── createOrganizerUser()
│   ├── getUser()
│   └── getUserByEmail()
│
├── events.ts          # Event operations
│   ├── createEvent()
│   ├── getAllEvents()
│   ├── getEventById()
│   ├── getEventsByOrganizer()
│   └── deleteEvent()
│
├── registrations.ts   # Registration operations
│   ├── register()
│   ├── cancelRegistration()
│   ├── isRegistered()
│   ├── getEventRegistrations()
│   ├── myRegistrations()
│   └── markAttendance()
│
└── auth.ts           # Authentication
    ├── sendOTP()
    └── verifyOTP()
```

### Frontend (src/)
```
src/
├── main.tsx                    # App entry, routing setup
├── index.css                   # Global styles, Tailwind
│
├── pages/                      # Route components
│   ├── Landing.tsx            # Home page
│   ├── RoleSelection.tsx      # Role chooser
│   ├── Auth.tsx               # Organizer sign in
│   ├── Dashboard.tsx          # Event hub
│   ├── EventDetail.tsx        # Event details
│   └── NotFound.tsx           # 404 page
│
├── components/                 # Reusable UI
│   ├── EventCard.tsx          # Event preview card
│   ├── CreateEventDialog.tsx  # Event creation modal
│   ├── EventRegistrationDialog.tsx  # Registration modal
│   ├── RegistrationForm.tsx   # Registration form
│   │
│   └── event-detail/          # Event detail components
│       ├── EventInfo.tsx      # Event information
│       ├── EventSidebar.tsx   # Actions & participants
│       └── EventCountdown.tsx # Countdown timer
│
├── hooks/                      # Custom React hooks
│   └── use-auth.ts            # Authentication hook
│
└── lib/                        # Utilities
    └── utils.ts               # Helper functions
```

## 🎭 Component Hierarchy

### Dashboard Page
```
Dashboard
├── Header
│   ├── Logo
│   └── Logout Button
├── Welcome & Stats Section
│   ├── Welcome Message
│   └── Stats Cards (3)
├── Category Filter
│   └── Category Buttons (7)
├── Create Event Button (Organizers only)
└── Events Grid
    └── EventCard (multiple)
        ├── Category Badge
        ├── Days Until Badge
        ├── Event Info
        └── View Details Overlay
```

### Event Detail Page
```
EventDetail
├── Back Button
├── EventCountdown
│   └── Countdown Units (4)
├── Main Content (2 columns)
│   ├── EventInfo (left)
│   │   ├── Category Badge
│   │   ├── Title
│   │   ├── Details (date, time, location, etc.)
│   │   ├── Description
│   │   └── Requirements
│   │
│   └── EventSidebar (right)
│       ├── Participant View
│       │   ├── Registration Status
│       │   ├── QR Code Ticket
│       │   └── Register/Cancel Button
│       │
│       └── Organizer View
│           └── Participants List
│               └── Participant Cards
│                   ├── Details
│                   ├── Team Info
│                   └── Attendance Toggle
```

## 🔄 Data Flow

### Event Creation Flow
```
User Input (CreateEventDialog)
        ↓
Form Validation (React Hook Form + Zod)
        ↓
Convex Mutation (events.createEvent)
        ↓
Database Insert (events table)
        ↓
Real-time Update (Convex subscription)
        ↓
UI Update (Dashboard re-renders)
```

### Registration Flow
```
User Input (RegistrationForm)
        ↓
Form Validation
        ↓
Check Availability (max participants)
        ↓
Convex Mutation (registrations.register)
        ↓
Database Insert (registrations table)
        ↓
Generate QR Code (react-qr-code)
        ↓
Display Ticket (EventSidebar)
```

### Real-time Updates
```
Database Change (any table)
        ↓
Convex Detects Change
        ↓
Push to All Subscribers
        ↓
React Query Updates
        ↓
Components Re-render
        ↓
UI Shows New Data
```

## 🎨 Styling Architecture

### Tailwind Layers
```
Base Layer (index.css)
├── Reset styles
├── Font settings
└── Body defaults

Components Layer
├── .neo-brutal (4px border + shadow)
├── .neo-brutal-lg (6px border + shadow)
└── .neo-brutal-sm (2px border + shadow)

Utilities Layer
└── Tailwind utility classes
```

### Color System
```
Base Colors
├── border: Black (#000000)
├── background: White (#FFFFFF)
└── foreground: Black (#000000)

Category Colors
├── Workshop: Yellow (#FACC15)
├── Seminar: Blue (#60A5FA)
├── Sports: Green (#4ADE80)
├── Cultural: Pink (#F472B6)
├── Technical: Purple (#A78BFA)
└── Social: Orange (#FB923C)

Semantic Colors
├── Success: Green
├── Error: Red
├── Warning: Yellow
└── Info: Blue
```

## 🔐 Authentication Flow

### Organizer Authentication
```
1. Enter Email
   ↓
2. Generate OTP (6 digits)
   ↓
3. Store in otpCodes table (10 min expiry)
   ↓
4. Display OTP (dev) / Send Email (prod)
   ↓
5. User Enters OTP
   ↓
6. Verify OTP
   ↓
7. Create/Get User
   ↓
8. Store in localStorage
   ↓
9. Redirect to Dashboard
```

### Participant Authentication
```
1. Click "Participant"
   ↓
2. Create Anonymous User
   ↓
3. Store in localStorage
   ↓
4. Redirect to Dashboard
```

## 📊 State Management

### Local State (useState)
- Form inputs
- Dialog open/close
- Loading states
- Error messages

### Global State (localStorage)
- User authentication
- User role
- User ID

### Server State (Convex)
- Events data
- Registrations data
- Users data
- Real-time updates

## 🎯 Key Features Map

### For Participants
```
Dashboard
├── Browse Events
├── Filter by Category
├── View Event Details
└── My Registrations

Event Detail
├── View Full Info
├── Register for Event
├── View QR Ticket
└── Cancel Registration
```

### For Organizers
```
Dashboard
├── All Participant Features
├── Create Events
├── View My Events
└── Event Statistics

Event Detail
├── All Participant Features
├── View Participants List
├── Mark Attendance
└── Real-time Updates
```

## 🔧 Configuration Files

```
Root Directory
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite bundler
├── tailwind.config.js    # Tailwind CSS
├── postcss.config.js     # PostCSS
├── convex.json           # Convex config
├── .env.local            # Environment vars (created by Convex)
└── .gitignore            # Git ignore rules
```

## 🚀 Build Process

### Development
```
Source Files (src/, convex/)
        ↓
Vite Dev Server (Hot reload)
        ↓
Convex Dev Server (Real-time sync)
        ↓
Browser (http://localhost:5173)
```

### Production
```
Source Files
        ↓
TypeScript Compilation
        ↓
Vite Build (Optimization)
        ↓
Static Files (dist/)
        ↓
Deploy to Hosting
        ↓
Convex Deploy (Backend)
        ↓
Production App
```

## 📱 Responsive Breakpoints

```
Mobile First Approach

sm:  640px   # Small tablets
md:  768px   # Tablets
lg:  1024px  # Laptops
xl:  1280px  # Desktops
2xl: 1536px  # Large screens
```

## 🎨 Animation System

### Framer Motion Patterns
```
Page Transitions
├── initial: { opacity: 0, y: 20 }
├── animate: { opacity: 1, y: 0 }
└── exit: { opacity: 0, y: -20 }

Button Interactions
├── whileHover: { scale: 1.05 }
└── whileTap: { scale: 0.95 }

Neo Brutal Hover
├── hover:translate-x-1
├── hover:translate-y-1
└── hover:shadow-none
```

## 🔍 Debug Points

### Check These When Debugging
```
1. Browser Console
   └── Errors, warnings, logs

2. Convex Dashboard
   └── Data tables, function logs

3. Network Tab
   └── API calls, responses

4. React DevTools
   └── Component tree, props

5. localStorage
   └── User data, auth state
```

---

This structure provides a complete, scalable foundation for your event management system. Each piece is modular and can be extended independently! 🚀
