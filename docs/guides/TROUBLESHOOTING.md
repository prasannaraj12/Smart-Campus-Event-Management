# CampusConnect - Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Installation Issues

#### Issue: `npm install` fails
**Symptoms**: Error messages during installation

**Solutions**:
1. Check Node.js version (need 18+):
   ```bash
   node --version
   ```
2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```
3. Delete node_modules and try again:
   ```bash
   rmdir /s /q node_modules
   npm install
   ```

#### Issue: `npx convex dev` fails
**Symptoms**: "Command not found" or connection errors

**Solutions**:
1. Ensure you're in the project directory
2. Check internet connection
3. Try with sudo/admin (if permission error):
   ```bash
   npx convex dev
   ```
4. Clear npx cache:
   ```bash
   npx clear-npx-cache
   npx convex dev
   ```

### Runtime Issues

#### Issue: "VITE_CONVEX_URL is not defined"
**Symptoms**: App won't load, console error about missing URL

**Solutions**:
1. Check if `.env.local` exists in project root
2. Create it if missing:
   ```bash
   echo VITE_CONVEX_URL=your-url-here > .env.local
   ```
3. Get URL from Convex dashboard: https://dashboard.convex.dev
4. Restart dev server after creating .env.local

#### Issue: "Failed to connect to Convex"
**Symptoms**: App loads but no data, connection errors

**Solutions**:
1. Ensure `npx convex dev` is running in separate terminal
2. Check Convex dashboard for deployment status
3. Verify VITE_CONVEX_URL is correct
4. Check firewall/antivirus isn't blocking connection
5. Try restarting both servers

#### Issue: Events not showing on dashboard
**Symptoms**: Dashboard loads but shows "No events"

**Solutions**:
1. Check Convex dev server is running
2. Open Convex dashboard → Data → events table
3. Create an event as organizer first
4. Check browser console for errors
5. Verify user is logged in (check localStorage)

#### Issue: Can't create events
**Symptoms**: "Only organizers can create events" error

**Solutions**:
1. Verify you're logged in as organizer (not participant)
2. Check localStorage for user data:
   ```javascript
   // In browser console
   JSON.parse(localStorage.getItem('campusconnect_user'))
   ```
3. Sign out and sign in again as organizer
4. Check Convex dashboard → Data → users table for your user

#### Issue: Registration fails
**Symptoms**: Error when trying to register for event

**Solutions**:
1. Check if event is full (max participants reached)
2. Verify you're not already registered
3. Check browser console for specific error
4. Ensure all required fields are filled
5. For team events, verify team size matches requirement

#### Issue: QR code not showing
**Symptoms**: Registered but no QR code appears

**Solutions**:
1. Refresh the page
2. Check if registration was successful in Convex dashboard
3. Verify you're viewing the correct event
4. Check browser console for errors
5. Try re-registering (cancel first if needed)

### Development Issues

#### Issue: Hot reload not working
**Symptoms**: Changes don't appear without manual refresh

**Solutions**:
1. Check if Vite dev server is running
2. Restart dev server:
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check for syntax errors in code

#### Issue: TypeScript errors
**Symptoms**: Red squiggly lines, type errors

**Solutions**:
1. Run TypeScript check:
   ```bash
   npx tsc --noEmit
   ```
2. Restart VS Code TypeScript server:
   - Ctrl+Shift+P → "TypeScript: Restart TS Server"
3. Check if types are installed:
   ```bash
   npm install --save-dev @types/react @types/react-dom
   ```

#### Issue: Tailwind classes not working
**Symptoms**: Styles not applying

**Solutions**:
1. Verify Tailwind is configured in `tailwind.config.js`
2. Check `postcss.config.js` exists
3. Restart dev server
4. Ensure classes are in content paths:
   ```javascript
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
   ```

### Authentication Issues

#### Issue: OTP not appearing
**Symptoms**: Clicked "Send OTP" but no code shown

**Solutions**:
1. Check browser console - OTP is logged there
2. Look for green box on screen with OTP
3. Check Convex dashboard → Data → otpCodes table
4. Verify email is valid format
5. Try different email address

#### Issue: OTP verification fails
**Symptoms**: "Invalid OTP" error

**Solutions**:
1. Ensure you're entering the exact 6-digit code
2. Check if OTP expired (10 minute limit)
3. Request new OTP
4. Copy-paste code instead of typing
5. Check for extra spaces

#### Issue: User logged out unexpectedly
**Symptoms**: Redirected to role selection

**Solutions**:
1. Check localStorage wasn't cleared
2. Verify browser isn't in incognito mode
3. Check for JavaScript errors
4. Re-login and test again

### UI/UX Issues

#### Issue: Layout broken on mobile
**Symptoms**: Elements overlapping or cut off

**Solutions**:
1. Check viewport meta tag in index.html
2. Test responsive breakpoints
3. Use browser DevTools mobile view
4. Check for fixed widths in custom CSS

#### Issue: Animations not smooth
**Symptoms**: Janky or stuttering animations

**Solutions**:
1. Check browser performance (close other tabs)
2. Disable browser extensions
3. Update graphics drivers
4. Reduce animation complexity in code

#### Issue: Images/icons not loading
**Symptoms**: Broken image icons

**Solutions**:
1. Check Lucide React is installed:
   ```bash
   npm install lucide-react
   ```
2. Verify import statements
3. Check for typos in icon names

### Build Issues

#### Issue: `npm run build` fails
**Symptoms**: Build errors, process exits

**Solutions**:
1. Fix all TypeScript errors first
2. Check for unused imports
3. Verify all dependencies installed
4. Try clean build:
   ```bash
   rmdir /s /q dist
   npm run build
   ```

#### Issue: Build succeeds but app doesn't work
**Symptoms**: Production build has errors

**Solutions**:
1. Test with preview:
   ```bash
   npm run preview
   ```
2. Check environment variables are set
3. Verify Convex is deployed:
   ```bash
   npx convex deploy
   ```
4. Check browser console for errors

### Deployment Issues

#### Issue: Deployed app shows blank page
**Symptoms**: White screen, no content

**Solutions**:
1. Check VITE_CONVEX_URL is set in hosting provider
2. Verify build was successful
3. Check browser console for errors
4. Ensure Convex backend is deployed
5. Check routing configuration (SPA fallback)

#### Issue: API calls failing in production
**Symptoms**: "Failed to fetch" errors

**Solutions**:
1. Verify production Convex URL is correct
2. Check CORS settings
3. Ensure Convex is deployed (not just dev)
4. Check network tab in DevTools

## 🔍 Debugging Tools

### Browser Console
```javascript
// Check user data
JSON.parse(localStorage.getItem('campusconnect_user'))

// Check Convex connection
// Look for Convex logs in console

// Clear local storage
localStorage.clear()
```

### Convex Dashboard
1. Go to https://dashboard.convex.dev
2. Select your project
3. Check:
   - Data tables (users, events, registrations)
   - Function logs
   - Deployment status

### VS Code Extensions
- ESLint - Code quality
- Prettier - Code formatting
- Tailwind CSS IntelliSense - CSS autocomplete
- Error Lens - Inline errors

## 📞 Getting Help

### Before Asking for Help
1. ✅ Check this troubleshooting guide
2. ✅ Read error messages carefully
3. ✅ Check browser console
4. ✅ Check Convex dashboard
5. ✅ Try restarting servers
6. ✅ Search error message online

### When Asking for Help
Include:
- Error message (full text)
- What you were trying to do
- Steps to reproduce
- Browser console screenshot
- Your environment (OS, Node version)

### Resources
- Convex Discord: https://convex.dev/community
- Stack Overflow: Tag with `convex` and `react`
- GitHub Issues: Create issue in your repo

## 🛠️ Maintenance Commands

### Clear Everything and Start Fresh
```bash
# Stop all servers (Ctrl+C)

# Clear node modules
rmdir /s /q node_modules

# Clear Convex cache
rmdir /s /q .convex

# Reinstall
npm install

# Restart
npx convex dev  # Terminal 1
npm run dev     # Terminal 2
```

### Reset Database
```bash
# In Convex dashboard:
# Data → Select table → Delete all rows
# Or drop and recreate tables
```

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package-name@latest
```

## ⚡ Performance Tips

### Slow Loading
1. Check network speed
2. Optimize images
3. Enable caching
4. Use production build
5. Check Convex query efficiency

### High Memory Usage
1. Close unused browser tabs
2. Restart dev servers
3. Check for memory leaks in code
4. Use production build (smaller)

### Slow Builds
1. Clear dist folder
2. Update Node.js
3. Close other applications
4. Use faster disk (SSD)

## 🎯 Prevention Tips

1. **Always run both servers** (Convex + Vite)
2. **Check console regularly** for warnings
3. **Test in multiple browsers**
4. **Keep dependencies updated**
5. **Use version control** (Git)
6. **Back up your data** (export from Convex)
7. **Test before deploying**
8. **Monitor production** after deployment

---

## Still Stuck?

1. Re-read the error message carefully
2. Check SETUP.md for setup steps
3. Try the "Clear Everything" commands above
4. Search the error on Google
5. Ask in Convex Discord community

**Remember**: Most issues are simple fixes! Take a deep breath and debug systematically. 🧘‍♂️
