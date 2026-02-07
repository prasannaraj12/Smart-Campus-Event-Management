# CampusConnect - Quick Reference

## 🚀 Start the App (2 Commands)

```bash
# Terminal 1 - Backend
npx convex dev

# Terminal 2 - Frontend  
npm run dev
```

Then open: http://localhost:5173

## 📋 Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npx convex dev` | Start Convex backend (development) |
| `npm run dev` | Start React frontend |
| `npm run build` | Build for production |
| `npx convex deploy` | Deploy backend to production |

## 🎭 User Roles

### Participant (Anonymous)
- ✅ Browse events
- ✅ Register for events
- ✅ Get QR code tickets
- ✅ View registration history
- ❌ Cannot create events

### Organizer (Email Auth)
- ✅ All participant features
- ✅ Create events
- ✅ View participants
- ✅ Mark attendance
- ✅ Manage own events

## 🎨 Event Categories

1. **Workshop** - Yellow
2. **Seminar** - Blue
3. **Sports** - Green
4. **Cultural** - Pink
5. **Technical** - Purple
6. **Social** - Orange

## 📁 Key Files

### Backend (convex/)
- `schema.ts` - Database tables
- `events.ts` - Event operations
- `registrations.ts` - Registration logic
- `users.ts` - User management
- `auth.ts` - OTP authentication

### Frontend (src/)
- `main.tsx` - App entry point
- `pages/` - Route components
- `components/` - Reusable UI
- `hooks/use-auth.ts` - Authentication hook
- `lib/utils.ts` - Helper functions

## 🔑 Authentication Flow

### Organizer Sign In
1. Enter email
2. Receive OTP (displayed on screen in dev)
3. Enter OTP
4. Authenticated ✓

### Participant Sign In
1. Click "Participant"
2. Automatically signed in anonymously ✓

## 📊 Database Schema

### users
- email (optional)
- role: "organizer" | "participant"
- isAnonymous: boolean
- name (optional)

### events
- title, description
- date, time, location
- category
- maxParticipants
- organizerId
- teamSize (optional)
- requirements (optional)

### registrations
- eventId, userId
- participantName, participantEmail, participantPhone
- college, year
- teamName, teamMembers (optional)
- attended, attendedAt

### otpCodes
- email, code
- expiresAt

## 🎯 Feature Checklist

- [x] Landing page
- [x] Role selection
- [x] Organizer authentication (OTP)
- [x] Anonymous participant access
- [x] Event creation
- [x] Event listing with filters
- [x] Event detail page
- [x] Event countdown timer
- [x] Registration form
- [x] Team registration support
- [x] QR code ticket generation
- [x] Participant list (organizers)
- [x] Attendance marking
- [x] Real-time updates
- [x] Neo Brutalism design
- [x] Responsive layout
- [x] Smooth animations

## 🎨 Design System

### Colors
- Primary: Black borders
- Background: White/Off-white
- Accents: Category-based vibrant colors

### Borders
- Standard: 4px (`neo-brutal`)
- Large: 6px (`neo-brutal-lg`)
- Small: 2px (`neo-brutal-sm`)

### Shadows
- Standard: `4px 4px 0px 0px rgba(0,0,0,1)`
- Large: `6px 6px 0px 0px rgba(0,0,0,1)`
- Small: `2px 2px 0px 0px rgba(0,0,0,1)`

## 🔧 Customization Points

### Add Event Category
1. Edit `convex/schema.ts` - add to category union
2. Edit `src/lib/utils.ts` - add color mapping
3. Edit `src/pages/Dashboard.tsx` - add to categories array
4. Edit `src/components/CreateEventDialog.tsx` - add to categories array

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  border: "hsl(0 0% 0%)",
  background: "hsl(0 0% 100%)",
  foreground: "hsl(0 0% 0%)",
}
```

### Add Registration Fields
1. Edit `convex/schema.ts` - add to registrations table
2. Edit `src/components/RegistrationForm.tsx` - add form fields
3. Edit `convex/registrations.ts` - update register mutation

## 🐛 Debugging Tips

### Check Convex Dashboard
https://dashboard.convex.dev
- View all data in real-time
- See function logs
- Monitor queries

### Browser Console
- Check for errors
- View Convex query results
- Debug authentication

### Common Issues
1. **No events showing**: Check Convex dev is running
2. **Can't create event**: Verify user role is "organizer"
3. **Registration fails**: Check max participants limit
4. **OTP not working**: Check console for generated code

## 📱 Testing Checklist

### As Participant
- [ ] Sign in anonymously
- [ ] View events list
- [ ] Filter by category
- [ ] View event details
- [ ] Register for event
- [ ] View QR ticket
- [ ] Download ticket
- [ ] Cancel registration

### As Organizer
- [ ] Sign in with email/OTP
- [ ] Create new event
- [ ] View created events
- [ ] View event participants
- [ ] Mark attendance
- [ ] See real-time registration updates

## 🚢 Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Run `npx convex deploy`
- [ ] Set `VITE_CONVEX_URL` in hosting provider
- [ ] Test production build locally (`npm run preview`)
- [ ] Deploy frontend to hosting
- [ ] Test all features in production
- [ ] Set up email service for OTP (production)

## 📚 Resources

- [Convex Docs](https://docs.convex.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Hook Form](https://react-hook-form.com)

## 💡 Pro Tips

1. Keep Convex dashboard open while developing
2. Use multiple browser windows to test real-time updates
3. Test on mobile devices for responsive design
4. Use browser dev tools for debugging
5. Check network tab for API calls
6. Use React DevTools for component inspection

---

Need more help? Check `SETUP.md` for detailed setup instructions or `README.md` for full documentation.
