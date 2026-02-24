# Verification Status Auto-Refresh Fix

## Issue
When admin approves a host's verification, the frontend doesn't automatically update the user's verification status. Hosts see "verification required" banners even after being approved, preventing them from adding units or performing other actions.

## Root Cause
The user object in AuthContext was only fetched:
1. On initial login
2. When manually calling `refreshUser()`

The JWT token doesn't contain the `verified` status, so the frontend needs to fetch fresh user data from the `/api/auth/me` endpoint to see verification updates.

## Solution Implemented

### 1. Global Auto-Refresh (AuthContext.js)
Added automatic user data refresh every 30 seconds:
```javascript
useEffect(() => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchUser();
    
    // Auto-refresh user data every 30 seconds
    const interval = setInterval(() => {
      fetchUser();
    }, 30000);
    
    return () => clearInterval(interval);
  } else {
    setLoading(false);
  }
}, [token]);
```

### 2. Manual Refresh Button
Added "Refresh Status" button to verification banners on:
- Host Dashboard
- Host Units page
- Host Bookings page

Button functionality:
```javascript
const handleRefreshStatus = async () => {
  setRefreshing(true);
  await refreshUser();
  setTimeout(() => setRefreshing(false), 500);
};
```

### 3. Backend Verification Check
The `checkVerified` middleware already fetches user verification status from database (not JWT):
```javascript
const checkVerified = (req, res, next) => {
  if (req.user.role === 'host') {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const user = users.find(u => u.id === req.user.id);
    
    if (!user || !user.verified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Host verification required',
        requiresVerification: true
      });
    }
  }
  next();
};
```

## User Experience

### Before Fix
1. Admin approves verification
2. Host refreshes page → Still sees "verification required"
3. Host must logout and login again to see updated status

### After Fix
1. Admin approves verification
2. Host waits up to 30 seconds → Status automatically updates
3. OR Host clicks "Refresh Status" button → Instant update
4. Host can now add units and access all features

## Files Modified
- `frontend/src/context/AuthContext.js` - Added 30-second auto-refresh
- `frontend/src/pages/Host/Dashboard.js` - Added refresh button
- `frontend/src/pages/Host/Units.js` - Added refresh button
- `frontend/src/pages/Host/Bookings.js` - Added refresh button

## Testing
Test with trial5 account:
- Email: TRIAL5@gmail.com
- Password: password123
- Status: Verified (approved by admin)
- Should now be able to add units without logout/login

## Future Improvements
Consider implementing:
- WebSocket for real-time status updates
- Toast notification when verification status changes
- Reduce auto-refresh interval to 15 seconds for better UX
