# Phase 4: Host Dashboard & Management - Implementation Plan

## Overview
Build complete host management interface including dashboard analytics, unit management, booking management, and financial tracking.

## Implementation Order

### Step 1: Host Dashboard with Analytics
**Backend**: Update dashboard route with real calculations
**Frontend**: Enhanced dashboard with stats, charts, and recent activity

### Step 2: Unit Management System
**Backend**: CRUD operations for units with image uploads
**Frontend**: Unit list, add/edit forms, condition tracking

### Step 3: Booking Management
**Backend**: Booking approval/rejection, status updates
**Frontend**: Booking list, calendar view, guest details

### Step 4: Analytics & Reports
**Backend**: Generate analytics data for charts
**Frontend**: Charts and graphs with date filters

---

## Files to Create

### Backend Routes (4 files)
1. `backend/routes/host/units.js` - Unit CRUD operations
2. `backend/routes/host/bookings.js` - Booking management
3. `backend/routes/host/analytics.js` - Analytics data
4. Update `backend/routes/host/dashboard.js` - Real stats

### Frontend Pages (7 files)
1. Update `frontend/src/pages/Host/Dashboard.js` - Enhanced dashboard
2. `frontend/src/pages/Host/Units.js` - Unit list
3. `frontend/src/pages/Host/UnitForm.js` - Add/edit unit
4. `frontend/src/pages/Host/UnitCondition.js` - Condition tracker
5. `frontend/src/pages/Host/Bookings.js` - Booking list
6. `frontend/src/pages/Host/BookingCalendar.js` - Calendar view
7. `frontend/src/pages/Host/Analytics.js` - Charts and reports

---

## Backend API Routes

### Dashboard
```
GET /api/host/dashboard - Get dashboard stats
```

### Units
```
GET    /api/host/units           - Get all host units
GET    /api/host/units/:id       - Get single unit
POST   /api/host/units           - Create new unit
PUT    /api/host/units/:id       - Update unit
DELETE /api/host/units/:id       - Delete unit
POST   /api/host/units/:id/condition - Record unit condition
POST   /api/host/units/:id/images    - Upload images
```

### Bookings
```
GET /api/host/bookings              - Get all host bookings
GET /api/host/bookings/:id          - Get single booking
PUT /api/host/bookings/:id/approve  - Approve booking
PUT /api/host/bookings/:id/reject   - Reject booking
PUT /api/host/bookings/:id/status   - Update status
```

### Analytics
```
GET /api/host/analytics/guests    - Guest statistics
GET /api/host/analytics/bookings  - Booking trends
GET /api/host/analytics/revenue   - Revenue data
GET /api/host/analytics/occupancy - Occupancy rates
```

---

## Frontend Routes

```
/host/dashboard              - Main dashboard
/host/units                  - Unit list
/host/units/new              - Add new unit
/host/units/:id/edit         - Edit unit
/host/units/:id/condition    - Record condition
/host/bookings               - Booking list
/host/bookings/calendar      - Calendar view
/host/bookings/:id           - Booking details
/host/analytics              - Analytics & reports
```

---

## Key Features

### Dashboard
- Total guests (monthly, new vs returning)
- Booking trends and occupancy per unit
- Revenue vs expenses
- Security deposit tracking
- Recent bookings
- Notifications
- Quick actions

### Unit Management
- Add/edit/delete units
- Upload multiple images
- Set amenities and features
- Record unit condition before/after stays
- Track maintenance requests
- Set pricing and availability

### Booking Management
- View all bookings with filters
- Calendar view with availability
- Approve/reject pending bookings
- View guest details and contact info
- Track payment and security deposit status
- Update booking status

### Analytics
- Guest analytics (total, monthly, new/returning)
- Booking trends (per unit, per month)
- Revenue tracking (total, monthly, yearly)
- Expense tracking
- Net profit calculations
- Occupancy rates
- Visual charts and graphs
- Export reports (CSV, PDF)

---

## Dependencies to Install

```bash
# Frontend
npm install recharts          # For charts
npm install react-calendar    # For calendar view
npm install date-fns          # For date formatting
```

---

## Success Criteria

- ✅ Host can view comprehensive dashboard
- ✅ Host can manage units (CRUD)
- ✅ Host can upload unit images
- ✅ Host can approve/reject bookings
- ✅ Host can view booking calendar
- ✅ Host can track revenue and expenses
- ✅ Host can view analytics with charts
- ✅ All data persists in JSON files
- ✅ Proper error handling
- ✅ Loading states
- ✅ Form validation

Let's build Phase 4! 🚀
