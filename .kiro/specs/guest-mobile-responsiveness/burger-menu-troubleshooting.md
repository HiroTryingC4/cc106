# Burger Menu Troubleshooting Guide

## Issue
User reports the burger menu is "not working" after the fix was applied.

## Possible Causes

### 1. Viewport Size Issue (Most Likely)
The burger menu button has the class `lg:hidden`, which means:
- **Visible**: On screens < 1024px (mobile, tablet)
- **Hidden**: On screens ≥ 1024px (desktop)

**Solution**: Resize your browser window to be narrower than 1024px, or use browser dev tools:
1. Open Chrome/Edge DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Select a mobile device (iPhone, Pixel, etc.)
4. The burger menu should now be visible

### 2. Frontend Not Recompiled
The changes to `Layout.js` might not have been picked up by the React dev server.

**Solution**: Restart the frontend server:
```bash
cd frontend
npm start
```

### 3. Wrong User Role
The burger menu only appears for guest and host users, not for:
- Non-logged-in users (they see a different mobile menu)
- Admin users (they have their own navigation)

**Solution**: Make sure you're logged in as:
- Guest: `guest1@example.com` / `password123`
- Host: `host1@smartstay.com` / `password123`

### 4. Browser Cache
Old JavaScript might be cached.

**Solution**: Hard refresh the page:
- Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache

## Testing Steps

### Step 1: Verify You're on the Right Page
1. Go to `http://localhost:3000`
2. Log in as guest: `guest1@example.com` / `password123`
3. You should be redirected to `/guest/dashboard`

### Step 2: Check Viewport Size
1. Open browser dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. The viewport should now be < 1024px wide

### Step 3: Look for the Burger Menu
On the navbar (top of page), you should see:
- **Left side**: "Smart Stay" logo
- **Right side**: 
  - **Burger menu icon** (three horizontal lines) ← This is what you're looking for
  - Bell icon (notifications)
  - Date display (on tablet+)

### Step 4: Click the Burger Menu
1. Click the three horizontal lines icon
2. A drawer should slide in from the left
3. The drawer should show:
   - "Guest Panel" header
   - Your name
   - Navigation menu items (Dashboard, Units, Recommendations, etc.)
   - Logout button at bottom

### Step 5: Close the Drawer
You can close it by:
- Clicking the X button in the drawer header
- Clicking the dark overlay behind the drawer
- Pressing the Escape key

## Visual Reference

### What the Burger Menu Looks Like
```
┌─────────────────────────────────┐
│ Smart Stay          ☰  🔔  📅  │  ← Navbar
└─────────────────────────────────┘
                      ↑
                Burger menu icon
                (three lines)
```

### What Happens When You Click It
```
┌──────────────┬──────────────────┐
│ Guest Panel  │ [Dark Overlay]   │
│ Welcome, ... │                  │
│              │                  │
│ 📊 Dashboard │                  │
│ 🏠 Units     │                  │
│ 📖 Recommend │                  │
│ 📅 Bookings  │                  │
│ 💬 Messages  │                  │
│              │                  │
│ [Profile]    │                  │
│ [Logout]     │                  │
└──────────────┴──────────────────┘
```

## Diagnostic Checklist

- [ ] Logged in as guest or host user
- [ ] Browser viewport is < 1024px wide (use dev tools mobile view)
- [ ] Frontend server is running (`npm start` in frontend folder)
- [ ] Page has been hard-refreshed (Ctrl+Shift+R)
- [ ] Looking at the right side of the navbar
- [ ] Can see the three horizontal lines icon (☰)

## If Still Not Working

### Check Browser Console
1. Open dev tools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Share the error messages for further diagnosis

### Verify Files Were Updated
Check that these files have the latest changes:
- `frontend/src/components/Layout.js` - Should import and render MobileSidebar
- `frontend/src/components/Navbar.js` - Should have burger menu button
- `frontend/src/components/MobileSidebar.js` - Should exist

### Test with DashboardLayout
The burger menu definitely works in DashboardLayout (used by dashboard pages).
Try navigating to `/guest/dashboard` after logging in - the burger menu should work there.

## Expected Behavior Summary

| Viewport Size | User Role | Burger Menu Visible? |
|--------------|-----------|---------------------|
| < 1024px     | Guest     | ✅ Yes              |
| < 1024px     | Host      | ✅ Yes              |
| < 1024px     | Admin     | ❌ No (different menu) |
| < 1024px     | Not logged in | ❌ No (different menu) |
| ≥ 1024px     | Any       | ❌ No (desktop sidebar) |

## Contact
If none of these solutions work, please provide:
1. Screenshot of the navbar on mobile viewport
2. Browser console errors (if any)
3. Which page you're testing on
4. Which user account you're logged in as
