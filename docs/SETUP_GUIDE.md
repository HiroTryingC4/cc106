# Smart Stay - Setup Guide

## Phase 1 Complete! ✅

You now have:
- ✅ Backend API with authentication
- ✅ React frontend with Tailwind CSS
- ✅ Login/Register pages
- ✅ Role-based routing (Admin, Host, Guest)
- ✅ Sample data in JSON files
- ✅ Landing page and unit browsing

## Installation & Running

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Backend Server
```bash
npm start
```
Backend will run on: **http://localhost:5000**

### Step 3: Install Frontend Dependencies (New Terminal)
```bash
cd frontend
npm install
```

### Step 4: Start Frontend
```bash
npm start
```
Frontend will run on: **http://localhost:3000**

## Test the Application

### 1. Test Login
Go to: http://localhost:3000/login

**Demo Credentials:**
- **Admin**: admin@smartstay.com / password123
- **Host**: host1@smartstay.com / password123
- **Guest**: guest1@example.com / password123

### 2. Test Registration
Go to: http://localhost:3000/register
- Create a new account (Guest or Host)

### 3. Browse Units
Go to: http://localhost:3000/units
- View available units
- Click on a unit to see details

### 4. Test Dashboards
After logging in, you'll be redirected to your role-specific dashboard:
- Admin → `/admin/dashboard`
- Host → `/host/dashboard`
- Guest → `/guest/dashboard`

## What's Working

✅ Authentication (Login/Register)
✅ JWT token management
✅ Role-based access control
✅ Protected routes
✅ Landing page
✅ Units listing
✅ Unit details page
✅ Basic dashboards for all roles

## Next Steps - Phase 2

Ready to continue? Phase 2 will add:
- Booking system
- Payment with QR codes
- Guest booking management
- More detailed dashboards

## Project Structure

```
smart-stay/
├── backend/
│   ├── data/
│   │   ├── users.json          # User data
│   │   ├── units.json          # Property listings
│   │   └── bookings.json       # Booking records
│   ├── routes/
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── units.js            # Unit endpoints
│   │   ├── bookings.js         # Booking endpoints
│   │   ├── admin.js            # Admin endpoints
│   │   ├── host.js             # Host endpoints
│   │   └── guest.js            # Guest endpoints
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   ├── server.js               # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js # Protected route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.js  # Auth state management
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── Public/
│   │   │   │   ├── Landing.js
│   │   │   │   ├── Units.js
│   │   │   │   └── UnitDetails.js
│   │   │   ├── Guest/
│   │   │   │   └── Dashboard.js
│   │   │   ├── Host/
│   │   │   │   └── Dashboard.js
│   │   │   └── Admin/
│   │   │       └── Dashboard.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## Troubleshooting

### Backend won't start
- Make sure you're in the `backend` folder
- Check if port 5000 is available
- Run `npm install` again

### Frontend won't start
- Make sure you're in the `frontend` folder
- Check if port 3000 is available
- Run `npm install` again
- Clear cache: `npm start -- --reset-cache`

### CORS errors
- Make sure backend is running on port 5000
- Check that CORS is enabled in `backend/server.js`

### Login not working
- Check backend console for errors
- Verify backend is running
- Use demo credentials: password123

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Units
- GET `/api/units` - Get all units
- GET `/api/units/:id` - Get single unit

### Bookings
- GET `/api/bookings` - Get user bookings (requires auth)

### Admin
- GET `/api/admin/dashboard` - Admin dashboard data (requires admin role)

### Host
- GET `/api/host/dashboard` - Host dashboard data (requires host role)

### Guest
- GET `/api/guest/dashboard` - Guest dashboard data (requires guest role)

---

**Phase 1 Complete!** 🎉

Ready for Phase 2? Let me know!
