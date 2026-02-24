# How to Run Smart Stay

## Prerequisites
- Node.js installed (v14 or higher)
- npm installed

## Step-by-Step Instructions

### 1. Install Backend Dependencies
Open a terminal and run:
```bash
cd backend
npm install
```

### 2. Start Backend Server
In the same terminal (from backend folder):
```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
```

**Keep this terminal open!**

---

### 3. Install Frontend Dependencies
Open a **NEW terminal** and run:
```bash
cd frontend
npm install
```

This will install:
- React
- React Router
- Axios
- Tailwind CSS
- And other dependencies

### 4. Start Frontend Development Server
In the same terminal (from frontend folder):
```bash
npm start
```

The app will automatically open in your browser at:
```
http://localhost:3000
```

**Keep this terminal open too!**

---

## Testing the Application

### Test Login
1. Go to http://localhost:3000/login
2. Use these credentials:

**Admin:**
- Email: `admin@smartstay.com`
- Password: `password123`

**Host:**
- Email: `host1@smartstay.com`
- Password: `password123`

**Guest:**
- Email: `guest1@example.com`
- Password: `password123`

### Test Features
1. **Landing Page** - http://localhost:3000
   - View hero section
   - See features
   - Read testimonials
   - Responsive mobile menu

2. **Browse Units** - http://localhost:3000/units
   - View 8 available units
   - Click on any unit for details

3. **Unit Details** - Click any unit
   - View images
   - See amenities
   - Check pricing

4. **Register** - http://localhost:3000/register
   - Create new account (Guest or Host)

5. **Dashboards** - After login
   - Admin: http://localhost:3000/admin/dashboard
   - Host: http://localhost:3000/host/dashboard
   - Guest: http://localhost:3000/guest/dashboard

---

## What's New in Phase 2

### ✅ Completed Features:
1. **Navbar** - Responsive with mobile menu
2. **Footer** - With links and contact info
3. **Sidebar** - Role-based navigation for dashboards
4. **Layout Components** - Reusable wrappers
5. **UI Components** - Button, Card, Input, Modal, Toast
6. **Enhanced Landing Page** - Testimonials and CTA sections
7. **More Units** - 8 units total (was 2)
8. **Backend Filters** - Search, sort, pagination ready

### 🔄 In Progress:
- Units listing page with filters
- Search functionality UI
- Loading states
- Image gallery improvements

---

## Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

### Port already in use
- Backend (5000): Stop any process using port 5000
- Frontend (3000): Stop any process using port 3000

### CORS errors
- Make sure backend is running on port 5000
- Check backend console for errors

---

## Current Progress

**Phase 1**: ✅ 100% Complete (18/18 tasks)
**Phase 2**: 🔄 80% Complete (12/15 tasks)

**Total**: 30/231 tasks complete (13%)

---

## Next Steps

To complete Phase 2:
1. Add filters UI to units listing page
2. Add search bar
3. Improve unit details with image gallery
4. Add loading skeletons

Then move to Phase 3: Guest Features (Booking system)
