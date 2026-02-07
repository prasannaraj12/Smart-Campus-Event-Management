# 🚀 Get Started with CampusConnect

## Welcome! 👋

You now have a **complete, working event management system**. This guide will get you up and running in **5 minutes**.

## ⚡ Quick Start (3 Commands)

```bash
# 1. Install dependencies (one time only)
npm install

# 2. Start backend (keep this running)
npx convex dev

# 3. Start frontend (new terminal, keep this running)
npm run dev
```

**That's it!** Open http://localhost:5173 in your browser.

### 🪟 Windows Users
Just double-click `start-dev.bat` - it will open both servers automatically!

## 🎯 First Steps

### 1. Create Your First Event (2 minutes)

1. Click **"Get Started"**
2. Select **"Organizer"**
3. Enter any email (e.g., `test@example.com`)
4. Click **"Send OTP"**
5. **Copy the 6-digit code** shown on screen
6. Paste it and click **"Verify & Sign In"**
7. Click **"Create New Event"**
8. Fill in the form and submit

🎉 **You just created your first event!**

### 2. Register as Participant (1 minute)

1. Open a **new incognito window** (or sign out)
2. Click **"Get Started"**
3. Select **"Participant"**
4. Click on your event
5. Click **"Register Now"**
6. Fill in the form and submit

🎫 **You now have a QR code ticket!**

### 3. Mark Attendance (30 seconds)

1. Go back to your organizer window
2. Click on your event
3. See the registered participant
4. Click the **check button** to mark attendance

✅ **Attendance marked!**

## 📚 What to Read Next

### Essential Reading (5 minutes)
- **PROJECT_SUMMARY.md** - Overview of what you have
- **QUICK_REFERENCE.md** - Command cheat sheet

### When You Need It
- **SETUP.md** - Detailed setup instructions
- **README.md** - Full documentation
- **TROUBLESHOOTING.md** - Fix common issues

## 🎨 Customize It

### Change Colors (1 minute)
Edit `tailwind.config.js`:
```javascript
colors: {
  border: "hsl(0 0% 0%)",      // Black borders
  background: "hsl(0 0% 100%)", // White background
  foreground: "hsl(0 0% 0%)",   // Black text
}
```

### Add Event Category (2 minutes)
1. Edit `convex/schema.ts` - add to category union
2. Edit `src/lib/utils.ts` - add color
3. Edit `src/pages/Dashboard.tsx` - add to array

### Add Registration Field (3 minutes)
1. Edit `convex/schema.ts` - add to registrations
2. Edit `src/components/RegistrationForm.tsx` - add input
3. Edit `convex/registrations.ts` - update mutation

## 🚢 Deploy It

### Deploy Backend (1 minute)
```bash
npx convex deploy
```

### Deploy Frontend (5 minutes)
1. Build: `npm run build`
2. Upload `dist/` folder to:
   - Vercel (recommended)
   - Netlify
   - GitHub Pages
3. Set environment variable:
   ```
   VITE_CONVEX_URL=your-production-convex-url
   ```

## 💡 Pro Tips

1. **Keep Convex Dashboard Open**
   - https://dashboard.convex.dev
   - Watch data update in real-time
   - Debug issues easily

2. **Test with Multiple Windows**
   - Open 2-3 browser windows
   - See real-time synchronization
   - Test different user roles

3. **Use Browser DevTools**
   - F12 to open
   - Check Console for errors
   - Use Network tab for API calls

4. **Check localStorage**
   ```javascript
   // In browser console
   JSON.parse(localStorage.getItem('campusconnect_user'))
   ```

## 🆘 Need Help?

### Something Not Working?
1. Check **TROUBLESHOOTING.md**
2. Restart both servers
3. Clear browser cache
4. Check browser console

### Want to Learn More?
1. Read **README.md** for full docs
2. Check **SETUP.md** for details
3. Visit [Convex Docs](https://docs.convex.dev)

## 🎯 What You Can Do Now

### Immediate
- ✅ Create events
- ✅ Register for events
- ✅ Get QR tickets
- ✅ Mark attendance
- ✅ Filter by category
- ✅ View real-time updates

### Next Steps
- 🎨 Customize colors
- 📝 Add more fields
- 🚀 Deploy to production
- 📧 Add email notifications
- 📊 Add analytics

## 🎊 You're Ready!

Everything is set up and working. Now:

1. **Explore** - Click around, test features
2. **Customize** - Make it yours
3. **Deploy** - Share with your campus
4. **Extend** - Add new features

## 📖 Documentation Index

| File | Purpose | Read When |
|------|---------|-----------|
| **GET_STARTED.md** | Quick start (this file) | Right now! |
| **PROJECT_SUMMARY.md** | What you have | Next (5 min) |
| **QUICK_REFERENCE.md** | Command cheat sheet | Keep handy |
| **README.md** | Full documentation | When needed |
| **SETUP.md** | Detailed setup | If stuck |
| **TROUBLESHOOTING.md** | Fix issues | When errors occur |

## 🚀 Ready to Start?

```bash
npm install
npx convex dev  # Terminal 1
npm run dev     # Terminal 2
```

Then open: **http://localhost:5173**

---

**Have fun building! 🎉**

Questions? Check the docs above or the browser console for hints.
