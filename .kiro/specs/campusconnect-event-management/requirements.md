---
title: CampusConnect - Smart Campus Event Management System
version: 1.0.0
status: ready_for_design
created: 2026-02-06
---

# CampusConnect - Smart Campus Event Management System

## Overview
CampusConnect is a Smart Campus Event Management system featuring Neo Brutalism design. It enables event organization, anonymous participant registration, attendance tracking via QR codes, event countdowns, and ticket generation.

## Target Users
- **Organizers**: Campus clubs, student organizations, faculty who create and manage events
- **Participants**: Students and campus community members who discover and register for events

## Core Features

### 1. User Management & Authentication

#### User Story 1.1: Role Selection
**As a** campus user  
**I want to** choose my role (Organizer or Participant)  
**So that** I can access appropriate features for my needs

**Acceptance Criteria:**
- Landing page provides clear entry point to role selection
- Role selection page displays two distinct options: Organizer and Participant
- Visual feedback on hover/selection with Neo Brutalism styling
- Smooth animations using framer-motion
- Error handling with user-friendly messages
- Loading states during role processing

#### User Story 1.2: Organizer Authentication
**As an** organizer  
**I want to** sign in/sign up with email and OTP  
**So that** I can securely manage my events

**Acceptance Criteria:**
- Email-based authentication with OTP verification
- Sign-up flow for new organizers
- Sign-in flow for returning organizers
- Session persistence across browser refreshes
- Secure token management
- Error handling for invalid credentials
- Loading states during authentication

#### User Story 1.3: Anonymous Participant Access
**As a** participant  
**I want to** access events without creating an account  
**So that** I can quickly browse and register for events

**Acceptance Criteria:**
- Anonymous sign-in flow with minimal friction
- Temporary user session creation
- Basic profile information collection (name, email, phone) during registration
- Error propagation with appropriate delays
- Enhanced error logging for debugging

### 2. Event Discovery & Dashboard

#### User Story 2.1: Event Dashboard
**As a** user  
**I want to** view all available events in an organized layout  
**So that** I can discover events that interest me

**Acceptance Criteria:**
- Grid layout displaying event cards with consistent heights
- Neo Brutalism UI design with bold borders and shadows
- Loading skeletons during data fetch
- Empty state when no events exist
- Responsive design for mobile and desktop
- Smooth page transitions and animations

#### User Story 2.2: Welcome & Stats Section
**As a** user  
**I want to** see personalized welcome message and key metrics  
**So that** I understand my activity at a glance

**Acceptance Criteria:**
- Role-specific welcome message (Organizer vs Participant)
- For Organizers: Total events created, total registrations, upcoming events count
- For Participants: Registered events count, upcoming events, events attended
- Animated counters for statistics
- Neo Brutalism card design

#### User Story 2.3: Category Filtering
**As a** user  
**I want to** filter events by category  
**So that** I can find relevant events quickly

**Acceptance Criteria:**
- Interactive category filter buttons (All, Workshop, Seminar, Sports, Cultural, Technical, Social)
- Active state indication on selected category
- Real-time filtering without page reload
- Smooth transitions when filtering
- Event count per category (optional)

#### User Story 2.4: Event Cards
**As a** user  
**I want to** see event preview information on cards  
**So that** I can quickly assess if an event interests me

**Acceptance Criteria:**
- Display: Event title, date, time, location, category, participant count
- Animated badge showing "TODAY!" or "X DAYS LEFT" for upcoming events
- Hover effects revealing "View Details" button
- Consistent card height in grid layout
- Category color coding
- Neo Brutalism styling with bold borders

### 3. Event Creation & Management

#### User Story 3.1: Create Event
**As an** organizer  
**I want to** create new events with detailed information  
**So that** participants can discover and register for my events

**Acceptance Criteria:**
- Dialog-based event creation form
- Required fields: Title, description, date, time, location, category, max participants
- Optional fields: Team size, requirements
- Date/time validation (no past dates)
- Real-time form validation with Zod
- Minimized, interactive UI with framer-motion animations
- Neo Brutalism form styling
- Success/error feedback on submission
- Automatic redirect to event detail page after creation

#### User Story 3.2: View My Events (Organizer)
**As an** organizer  
**I want to** see all events I've created  
**So that** I can manage them effectively

**Acceptance Criteria:**
- Separate "My Events" view or filter on dashboard
- Quick access to edit/delete actions
- Visual indication of event status (upcoming, ongoing, completed)
- Participant count and registration status

#### User Story 3.3: Role-Based Event Visibility
**As a** system  
**I want to** enforce role-based access control  
**So that** only authorized users can perform certain actions

**Acceptance Criteria:**
- Organizers can create, edit, delete their own events
- Participants can only view and register for events
- Backend validation of user roles
- Enhanced error logging for debugging access issues

### 4. Event Details & Registration

#### User Story 4.1: View Event Details
**As a** user  
**I want to** see comprehensive event information  
**So that** I can decide whether to register

**Acceptance Criteria:**
- Modular layout with EventInfo, EventSidebar, EventCountdown components
- EventInfo displays: Title, description, organizer, date, time, location, category, requirements
- EventCountdown shows: Days, hours, minutes, seconds until event
- Real-time countdown updates
- Participant count display
- Neo Brutalism design consistency

#### User Story 4.2: Event Registration
**As a** participant  
**I want to** register for events  
**So that** I can attend and receive a ticket

**Acceptance Criteria:**
- Registration dialog with form
- Collect: Name, email, phone, college/department, year
- Team participation option (if event supports teams)
- Dynamic team member fields based on team size
- Zod validation for all fields
- Prevent duplicate registrations
- Check max participant limit before registration
- Success feedback with QR code generation
- Error handling for failed registrations

#### User Story 4.3: QR Code Ticket
**As a** registered participant  
**I want to** receive a QR code ticket  
**So that** I can use it for event check-in

**Acceptance Criteria:**
- QR code generated immediately after registration
- QR code contains: Registration ID, participant name, event ID
- Display QR code in EventSidebar for registered users
- Downloadable/shareable QR code
- QR code visible on return visits to event detail page

#### User Story 4.4: Cancel Registration
**As a** registered participant  
**I want to** cancel my registration  
**So that** I can free up my spot if I can't attend

**Acceptance Criteria:**
- Cancel button visible for registered participants
- Confirmation dialog before cancellation
- Update participant count after cancellation
- Remove QR code access after cancellation
- Success feedback

### 5. Attendance Tracking

#### User Story 5.1: Mark Attendance (Organizer)
**As an** organizer  
**I want to** mark participant attendance using QR codes  
**So that** I can track who attended my event

**Acceptance Criteria:**
- Organizer view shows list of registered participants
- QR code scanner integration (or manual attendance marking)
- Mark/unmark attendance toggle
- Real-time attendance count update
- Visual indication of attended vs not attended
- Attendance timestamp recording

#### User Story 5.2: View Participants (Organizer)
**As an** organizer  
**I want to** see all registered participants  
**So that** I can manage attendance and communicate with them

**Acceptance Criteria:**
- Participant list in EventSidebar (organizer view only)
- Display: Name, email, phone, team info, attendance status
- Search/filter participants
- Export participant list (optional)

### 6. Navigation & Error Handling

#### User Story 6.1: Landing Page
**As a** visitor  
**I want to** understand what CampusConnect offers  
**So that** I can decide to use the platform

**Acceptance Criteria:**
- Hero section with clear value proposition
- Feature highlights
- Call-to-action to get started
- Neo Brutalism design
- Responsive layout

#### User Story 6.2: 404 Not Found
**As a** user  
**I want to** see a helpful error page when I navigate to invalid URLs  
**So that** I can return to valid pages

**Acceptance Criteria:**
- Custom 404 page with Neo Brutalism design
- Clear message about page not found
- Navigation back to dashboard or home
- Consistent branding

## Technical Requirements

### Frontend
- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with Neo Brutalism design system
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **QR Codes**: react-qr-code library
- **State Management**: Convex real-time queries

### Backend
- **Platform**: Convex (serverless backend)
- **Database**: Convex built-in database
- **Authentication**: Custom email OTP via Convex
- **Real-time**: Convex subscriptions for live updates

### Data Schema

#### Users
- `_id`: Unique identifier
- `email`: String (for organizers)
- `role`: "organizer" | "participant"
- `isAnonymous`: Boolean
- `createdAt`: Timestamp

#### Events
- `_id`: Unique identifier
- `title`: String
- `description`: String
- `date`: String (ISO format)
- `time`: String
- `location`: String
- `category`: "Workshop" | "Seminar" | "Sports" | "Cultural" | "Technical" | "Social"
- `maxParticipants`: Number
- `organizerId`: Reference to Users
- `teamSize`: Number (optional)
- `requirements`: String (optional)
- `createdAt`: Timestamp

#### Registrations
- `_id`: Unique identifier
- `eventId`: Reference to Events
- `userId`: Reference to Users (for authenticated) or anonymous identifier
- `participantName`: String
- `participantEmail`: String
- `participantPhone`: String
- `college`: String
- `year`: String
- `teamName`: String (optional)
- `teamMembers`: Array of objects (optional)
- `attended`: Boolean
- `attendedAt`: Timestamp (optional)
- `registeredAt`: Timestamp

### Performance Requirements
- Page load time < 2 seconds
- Real-time updates within 500ms
- Smooth animations at 60fps
- Responsive on mobile devices (320px+)

### Security Requirements
- Email OTP verification for organizers
- Role-based access control on all mutations
- Input validation on frontend and backend
- XSS protection via React's built-in escaping
- CSRF protection via Convex authentication

## Design System

### Neo Brutalism Principles
- Bold, thick borders (4-6px)
- High contrast colors
- Hard shadows (no blur)
- Geometric shapes
- Minimal rounded corners
- Vibrant accent colors
- Brutalist typography

### Color Palette
- Primary: Bold black borders
- Background: Off-white or light colors
- Accents: Vibrant colors per category (yellow, pink, blue, green, etc.)
- Text: High contrast black on light backgrounds

### Typography
- Headings: Bold, sans-serif fonts
- Body: Clean, readable sans-serif
- Consistent hierarchy

## Success Metrics
- Event creation rate by organizers
- Registration conversion rate
- Attendance rate (registered vs attended)
- User engagement (return visits)
- Average time on platform
- Mobile vs desktop usage

## Future Enhancements (Out of Scope for v1.0)
- Push notifications for event reminders
- Event feedback and ratings
- Calendar integration (Google Calendar, iCal)
- Advanced analytics dashboard
- Social sharing features
- Event recommendations based on interests
- Multi-language support
- Dark mode

## Constraints & Assumptions
- Campus network availability for QR scanning
- Users have modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-first approach for participants
- Desktop-optimized for organizers
- Single campus deployment initially

## Risks & Mitigations
- **Risk**: Anonymous users losing registration data
  - **Mitigation**: Email confirmation with registration details
- **Risk**: QR code scanning reliability
  - **Mitigation**: Manual attendance marking fallback
- **Risk**: Concurrent registration exceeding max participants
  - **Mitigation**: Backend validation with transaction handling
- **Risk**: Poor mobile experience
  - **Mitigation**: Mobile-first design and testing

## Dependencies
- Convex account and project setup
- Email service for OTP delivery
- Domain and hosting for deployment
- QR code scanning capability (camera access)

## Timeline Estimate
- Setup & Configuration: 1 day
- User Management & Auth: 2-3 days
- Event Management: 3-4 days
- Registration & QR Codes: 2-3 days
- Attendance Tracking: 2 days
- UI/UX Polish & Animations: 2-3 days
- Testing & Bug Fixes: 2-3 days
- **Total**: 14-18 days

## Acceptance Criteria for Completion
- [ ] All user stories implemented and tested
- [ ] Neo Brutalism design consistently applied
- [ ] Responsive on mobile and desktop
- [ ] No critical bugs or errors
- [ ] Authentication flows working correctly
- [ ] QR code generation and scanning functional
- [ ] Real-time updates working via Convex
- [ ] Performance metrics met
- [ ] Code documented and clean
- [ ] Deployment successful
