# Backend Folder Structure - Organized by Role

## New Organized Structure ✅

```
backend/
├── data/                           # JSON sample data
│   ├── users.json
│   ├── units.json
│   └── bookings.json
│
├── middleware/
│   └── auth.js                     # JWT verification & role checking
│
├── routes/
│   │
│   ├── admin/                      # 🔴 ADMIN ROUTES FOLDER
│   │   ├── index.js                # Main admin router (combines all admin routes)
│   │   ├── dashboard.js            # ✅ Admin dashboard endpoints
│   │   ├── users.js                # (To create) User management
│   │   ├── system.js               # (To create) System management
│   │   ├── reports.js              # (To create) Reports generation
│   │   ├── financial.js            # (To create) Financial overview
│   │   └── logs.js                 # (To create) Activity logs
│   │
│   ├── host/                       # 🔵 HOST ROUTES FOLDER
│   │   ├── index.js                # Main host router (combines all host routes)
│   │   ├── dashboard.js            # ✅ Host dashboard endpoints
│   │   ├── units.js                # (To create) Unit management
│   │   ├── bookings.js             # (To create) Booking management
│   │   ├── analytics.js            # (To create) Analytics data
│   │   ├── financial.js            # (To create) Financial reports
│   │   ├── guests.js               # (To create) Guest communication
│   │   └── chatbot.js              # (To create) Chatbot management
│   │
│   ├── guest/                      # 🟢 GUEST ROUTES FOLDER
│   │   ├── index.js                # Main guest router (combines all guest routes)
│   │   ├── dashboard.js            # ✅ Guest dashboard endpoints
│   │   ├── bookings.js             # (To create) Booking management
│   │   ├── payments.js             # (To create) Payment processing
│   │   ├── reviews.js              # (To create) Review submission
│   │   ├── profile.js              # (To create) Profile management
│   │   └── checkout.js             # (To create) Checkout photos
│   │
│   ├── auth.js                     # ✅ Authentication (shared)
│   ├── units.js                    # ✅ Units (shared/public)
│   ├── bookings.js                 # ✅ Bookings (shared)
│   └── chatbot.js                  # ✅ Chatbot (shared)
│
├── server.js                       # ✅ Express server
├── .env                            # ✅ Environment variables
└── package.json                    # ✅ Dependencies
```

---

## 🔴 Admin Routes (`/api/admin/*`)

### Current Files:
- ✅ `backend/routes/admin/index.js` - Main router
- ✅ `backend/routes/admin/dashboard.js` - Dashboard endpoint

### To Be Created:
```
backend/routes/admin/
├── users.js          # User CRUD operations
├── system.js         # System management & settings
├── reports.js        # Generate system reports
├── financial.js      # Financial overview
└── logs.js           # Activity logs
```

### Endpoints:
```javascript
// Dashboard
GET /api/admin/dashboard

// Users (to be created)
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

// System (to be created)
GET /api/admin/system/stats
PUT /api/admin/system/settings

// Reports (to be created)
GET /api/admin/reports
POST /api/admin/reports/generate

// Financial (to be created)
GET /api/admin/financial

// Logs (to be created)
GET /api/admin/logs
```

---

## 🔵 Host Routes (`/api/host/*`)

### Current Files:
- ✅ `backend/routes/host/index.js` - Main router
- ✅ `backend/routes/host/dashboard.js` - Dashboard endpoint

### To Be Created:
```
backend/routes/host/
├── units.js          # Unit CRUD operations
├── bookings.js       # Booking management
├── analytics.js      # Analytics data
├── financial.js      # Financial reports
├── guests.js         # Guest communication
└── chatbot.js        # Chatbot configuration
```

### Endpoints:
```javascript
// Dashboard
GET /api/host/dashboard

// Units (to be created)
GET    /api/host/units
POST   /api/host/units
PUT    /api/host/units/:id
DELETE /api/host/units/:id
POST   /api/host/units/:id/condition

// Bookings (to be created)
GET /api/host/bookings
PUT /api/host/bookings/:id/status
PUT /api/host/bookings/:id/approve
PUT /api/host/bookings/:id/reject

// Analytics (to be created)
GET /api/host/analytics/guests
GET /api/host/analytics/bookings
GET /api/host/analytics/revenue

// Financial (to be created)
GET /api/host/financial/summary
GET /api/host/financial/deposits
GET /api/host/financial/export

// Guests (to be created)
GET  /api/host/guests
POST /api/host/guests/:id/message

// Chatbot (to be created)
GET /api/host/chatbot/config
PUT /api/host/chatbot/config
```

---

## 🟢 Guest Routes (`/api/guest/*`)

### Current Files:
- ✅ `backend/routes/guest/index.js` - Main router
- ✅ `backend/routes/guest/dashboard.js` - Dashboard endpoint

### To Be Created:
```
backend/routes/guest/
├── bookings.js       # Booking operations
├── payments.js       # Payment processing
├── reviews.js        # Review submission
├── profile.js        # Profile management
└── checkout.js       # Checkout photos
```

### Endpoints:
```javascript
// Dashboard
GET /api/guest/dashboard

// Bookings (to be created)
GET    /api/guest/bookings
GET    /api/guest/bookings/:id
POST   /api/guest/bookings
PUT    /api/guest/bookings/:id
DELETE /api/guest/bookings/:id

// Payments (to be created)
POST /api/guest/payments/create
GET  /api/guest/payments/:id/qr
POST /api/guest/payments/:id/confirm

// Reviews (to be created)
POST /api/guest/reviews
GET  /api/guest/reviews/:bookingId

// Profile (to be created)
GET /api/guest/profile
PUT /api/guest/profile

// Checkout (to be created)
POST /api/guest/checkout/:bookingId/photos
GET  /api/guest/checkout/:bookingId
```

---

## How It Works

### 1. Main Server (`server.js`)
```javascript
app.use('/api/admin', require('./routes/admin'));
app.use('/api/host', require('./routes/host'));
app.use('/api/guest', require('./routes/guest'));
```

### 2. Index Files (e.g., `routes/admin/index.js`)
```javascript
const router = express.Router();

router.use('/', require('./dashboard'));
router.use('/users', require('./users'));
router.use('/system', require('./system'));

module.exports = router;
```

### 3. Individual Route Files (e.g., `routes/admin/dashboard.js`)
```javascript
const router = express.Router();
const { verifyToken, checkRole } = require('../../middleware/auth');

router.use(verifyToken, checkRole('admin'));

router.get('/dashboard', (req, res) => {
  // Dashboard logic
});

module.exports = router;
```

---

## Benefits of This Structure

✅ **Organized by Role** - Easy to find admin, host, or guest routes
✅ **Scalable** - Add new route files without cluttering
✅ **Maintainable** - Each file has a single responsibility
✅ **Clear Separation** - Role-based access is obvious
✅ **Easy to Extend** - Just create new files in the appropriate folder

---

## Current Status

### ✅ Completed:
- Admin folder with index and dashboard
- Host folder with index and dashboard
- Guest folder with index and dashboard
- Server.js updated to use new structure

### 📋 Next Steps:
Choose which routes to create next:
1. **Guest routes** - bookings, payments, reviews
2. **Host routes** - units, bookings, analytics
3. **Admin routes** - users, system, reports

---

## File Count

**Current:**
- Admin: 2 files (index.js, dashboard.js)
- Host: 2 files (index.js, dashboard.js)
- Guest: 2 files (index.js, dashboard.js)
- Shared: 4 files (auth, units, bookings, chatbot)
- **Total: 10 backend route files**

**To Create:**
- Admin: 5 more files
- Host: 6 more files
- Guest: 5 more files
- **Total: 16 more files**

Ready to continue building! 🚀
