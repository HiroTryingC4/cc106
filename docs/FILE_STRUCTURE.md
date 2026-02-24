# Smart Stay - Complete File Structure

## Backend Structure

```
backend/
├── data/                           # JSON sample data files
│   ├── users.json                  # All users (admin, host, guest)
│   ├── units.json                  # Property listings
│   ├── bookings.json               # Booking records
│   └── chatbot.json                # (To be created) Chatbot FAQs
│
├── middleware/
│   └── auth.js                     # JWT verification & role checking
│
├── routes/
│   ├── auth.js                     # Authentication (login, register)
│   ├── admin.js                    # Admin-only endpoints
│   ├── host.js                     # Host-only endpoints
│   ├── guest.js                    # Guest-only endpoints
│   ├── units.js                    # Unit management
│   ├── bookings.js                 # Booking management
│   └── chatbot.js                  # Chatbot endpoints
│
├── server.js                       # Express server entry point
├── .env                            # Environment variables
└── package.json                    # Backend dependencies
```

---

## Frontend Structure

```
frontend/
├── public/
│   └── index.html                  # HTML template
│
├── src/
│   ├── components/                 # Reusable components
│   │   ├── PrivateRoute.js         # Protected route wrapper
│   │   ├── Navbar.js               # (To be created) Navigation bar
│   │   ├── Sidebar.js              # (To be created) Dashboard sidebar
│   │   └── ChatbotWidget.js        # (To be created) AI chatbot
│   │
│   ├── context/
│   │   └── AuthContext.js          # Authentication state management
│   │
│   ├── pages/
│   │   │
│   │   ├── Auth/                   # Authentication pages
│   │   │   ├── Login.js            # Login page
│   │   │   └── Register.js         # Registration page
│   │   │
│   │   ├── Public/                 # Public-facing pages
│   │   │   ├── Landing.js          # Home/landing page
│   │   │   ├── Units.js            # Units listing page
│   │   │   └── UnitDetails.js      # Single unit details
│   │   │
│   │   ├── Guest/                  # 🟢 GUEST PAGES
│   │   │   ├── Dashboard.js        # Guest dashboard
│   │   │   ├── Bookings.js         # (To be created) Booking history
│   │   │   ├── BookingDetails.js   # (To be created) Single booking view
│   │   │   ├── CreateBooking.js    # (To be created) New booking form
│   │   │   ├── Payment.js          # (To be created) Payment page with QR
│   │   │   ├── Profile.js          # (To be created) Guest profile
│   │   │   ├── CheckoutPhoto.js    # (To be created) Photo upload
│   │   │   └── Review.js           # (To be created) Submit review
│   │   │
│   │   ├── Host/                   # 🔵 HOST PAGES
│   │   │   ├── Dashboard.js        # Host dashboard with analytics
│   │   │   ├── Units.js            # (To be created) Unit management
│   │   │   ├── UnitForm.js         # (To be created) Add/edit unit
│   │   │   ├── UnitCondition.js    # (To be created) Unit condition tracker
│   │   │   ├── Bookings.js         # (To be created) Booking management
│   │   │   ├── BookingCalendar.js  # (To be created) Calendar view
│   │   │   ├── Analytics.js        # (To be created) Analytics & reports
│   │   │   ├── Financial.js        # (To be created) Financial reports
│   │   │   ├── Guests.js           # (To be created) Guest communication
│   │   │   └── ChatbotManage.js    # (To be created) AI chatbot config
│   │   │
│   │   └── Admin/                  # 🔴 ADMIN PAGES
│   │       ├── Dashboard.js        # Admin dashboard
│   │       ├── Users.js            # (To be created) User management
│   │       ├── UserForm.js         # (To be created) Create/edit user
│   │       ├── Units.js            # (To be created) All units overview
│   │       ├── Bookings.js         # (To be created) All bookings
│   │       ├── Financial.js        # (To be created) Financial overview
│   │       ├── Reports.js          # (To be created) System reports
│   │       ├── System.js           # (To be created) System management
│   │       ├── ActivityLogs.js     # (To be created) Activity logs
│   │       └── Settings.js         # (To be created) System settings
│   │
│   ├── utils/                      # Utility functions
│   │   ├── api.js                  # (To be created) API helper functions
│   │   └── helpers.js              # (To be created) General helpers
│   │
│   ├── App.js                      # Main app component with routes
│   ├── index.js                    # React entry point
│   └── index.css                   # Global styles with Tailwind
│
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
└── package.json                    # Frontend dependencies
```

---

## 🟢 Guest Pages Breakdown

### Current Files:
- ✅ `frontend/src/pages/Guest/Dashboard.js` - Main dashboard

### To Be Created:
- `frontend/src/pages/Guest/Bookings.js` - View all bookings (upcoming, past)
- `frontend/src/pages/Guest/BookingDetails.js` - Single booking details
- `frontend/src/pages/Guest/CreateBooking.js` - Create new booking
- `frontend/src/pages/Guest/Payment.js` - Payment page with QR code
- `frontend/src/pages/Guest/Profile.js` - Edit profile information
- `frontend/src/pages/Guest/CheckoutPhoto.js` - Upload checkout photos
- `frontend/src/pages/Guest/Review.js` - Submit reviews and ratings

### Guest Routes (in App.js):
```javascript
/guest/dashboard          → Dashboard.js
/guest/bookings           → Bookings.js
/guest/bookings/:id       → BookingDetails.js
/guest/booking/new/:unitId → CreateBooking.js
/guest/payment/:bookingId → Payment.js
/guest/profile            → Profile.js
/guest/checkout/:bookingId → CheckoutPhoto.js
/guest/review/:bookingId  → Review.js
```

---

## 🔵 Host Pages Breakdown

### Current Files:
- ✅ `frontend/src/pages/Host/Dashboard.js` - Main dashboard

### To Be Created:
- `frontend/src/pages/Host/Units.js` - Manage all units
- `frontend/src/pages/Host/UnitForm.js` - Add/edit unit form
- `frontend/src/pages/Host/UnitCondition.js` - Track unit conditions
- `frontend/src/pages/Host/Bookings.js` - Manage bookings
- `frontend/src/pages/Host/BookingCalendar.js` - Calendar view
- `frontend/src/pages/Host/Analytics.js` - Analytics dashboard
- `frontend/src/pages/Host/Financial.js` - Financial reports
- `frontend/src/pages/Host/Guests.js` - Guest communication
- `frontend/src/pages/Host/ChatbotManage.js` - Chatbot management

### Host Routes (in App.js):
```javascript
/host/dashboard           → Dashboard.js
/host/units               → Units.js
/host/units/new           → UnitForm.js (create mode)
/host/units/edit/:id      → UnitForm.js (edit mode)
/host/units/condition/:id → UnitCondition.js
/host/bookings            → Bookings.js
/host/bookings/calendar   → BookingCalendar.js
/host/analytics           → Analytics.js
/host/financial           → Financial.js
/host/guests              → Guests.js
/host/chatbot             → ChatbotManage.js
```

---

## 🔴 Admin Pages Breakdown

### Current Files:
- ✅ `frontend/src/pages/Admin/Dashboard.js` - Main dashboard

### To Be Created:
- `frontend/src/pages/Admin/Users.js` - User management table
- `frontend/src/pages/Admin/UserForm.js` - Create/edit user
- `frontend/src/pages/Admin/Units.js` - All units overview
- `frontend/src/pages/Admin/Bookings.js` - All bookings overview
- `frontend/src/pages/Admin/Financial.js` - Financial overview
- `frontend/src/pages/Admin/Reports.js` - Generate reports
- `frontend/src/pages/Admin/System.js` - System management
- `frontend/src/pages/Admin/ActivityLogs.js` - View activity logs
- `frontend/src/pages/Admin/Settings.js` - System settings

### Admin Routes (in App.js):
```javascript
/admin/dashboard          → Dashboard.js
/admin/users              → Users.js
/admin/users/new          → UserForm.js (create mode)
/admin/users/edit/:id     → UserForm.js (edit mode)
/admin/units              → Units.js
/admin/bookings           → Bookings.js
/admin/financial          → Financial.js
/admin/reports            → Reports.js
/admin/system             → System.js
/admin/logs               → ActivityLogs.js
/admin/settings           → Settings.js
```

---

## Backend API Endpoints by Role

### 🟢 Guest Endpoints (`backend/routes/guest.js`)
```
GET    /api/guest/dashboard          - Guest dashboard stats
GET    /api/guest/bookings           - Get guest bookings
GET    /api/guest/bookings/:id       - Get single booking
POST   /api/guest/bookings           - Create new booking
PUT    /api/guest/bookings/:id       - Update booking
POST   /api/guest/reviews            - Submit review
GET    /api/guest/profile            - Get profile
PUT    /api/guest/profile            - Update profile
POST   /api/guest/checkout-photo     - Upload checkout photo
```

### 🔵 Host Endpoints (`backend/routes/host.js`)
```
GET    /api/host/dashboard           - Host dashboard stats
GET    /api/host/units               - Get host units
POST   /api/host/units               - Create unit
PUT    /api/host/units/:id           - Update unit
DELETE /api/host/units/:id           - Delete unit
GET    /api/host/bookings            - Get host bookings
PUT    /api/host/bookings/:id/status - Update booking status
GET    /api/host/analytics           - Get analytics data
GET    /api/host/financial           - Get financial reports
GET    /api/host/guests              - Get guest list
POST   /api/host/unit-condition      - Record unit condition
```

### 🔴 Admin Endpoints (`backend/routes/admin.js`)
```
GET    /api/admin/dashboard          - Admin dashboard stats
GET    /api/admin/users              - Get all users
POST   /api/admin/users              - Create user
PUT    /api/admin/users/:id          - Update user
DELETE /api/admin/users/:id          - Delete user
GET    /api/admin/units              - Get all units
GET    /api/admin/bookings           - Get all bookings
GET    /api/admin/financial          - System financial overview
GET    /api/admin/reports            - Generate reports
GET    /api/admin/logs               - Get activity logs
GET    /api/admin/system             - System stats
PUT    /api/admin/settings           - Update settings
```

---

## Summary

### ✅ Already Created (Phase 1):
- Backend: 7 files
- Frontend: 11 files
- Total: 18 files

### 📋 To Be Created (Phases 2-7):
- **Guest Pages**: 7 files
- **Host Pages**: 9 files
- **Admin Pages**: 9 files
- **Shared Components**: 3 files
- **Backend Routes**: Expand existing files
- **Total**: ~28 additional files

---

## Next Steps

Choose which section to build next:
1. **Guest Features** (Phase 3) - Booking system, payments, reviews
2. **Host Features** (Phase 4) - Unit management, analytics, bookings
3. **Admin Features** (Phase 5) - User management, system oversight

Let me know which you'd like to tackle first!
