# Phase 3: Guest Features - Implementation Plan

## Overview
Build complete guest booking flow including booking creation, payment, profile management, checkout, and reviews.

## Files to Create

### Backend Routes (5 files)
1. `backend/routes/guest/bookings.js` - Booking CRUD operations
2. `backend/routes/guest/payments.js` - Payment processing & QR codes
3. `backend/routes/guest/profile.js` - Profile management
4. `backend/routes/guest/checkout.js` - Checkout photo uploads
5. `backend/routes/guest/reviews.js` - Review submission

### Frontend Pages (7 files)
1. `frontend/src/pages/Guest/Bookings.js` - List all bookings
2. `frontend/src/pages/Guest/BookingDetails.js` - Single booking view
3. `frontend/src/pages/Guest/CreateBooking.js` - New booking form
4. `frontend/src/pages/Guest/Payment.js` - Payment with QR code
5. `frontend/src/pages/Guest/Profile.js` - Edit profile
6. `frontend/src/pages/Guest/CheckoutPhoto.js` - Upload checkout photos
7. `frontend/src/pages/Guest/Review.js` - Submit reviews

### Sample Data
- Add more bookings to `backend/data/bookings.json`
- Create `backend/data/reviews.json`

## Implementation Order

### Step 1: Booking System Backend
- Create bookings routes
- CRUD operations for bookings
- Booking validation
- Date conflict checking

### Step 2: Booking System Frontend
- Bookings list page
- Create booking form with date picker
- Booking details page
- Cancel booking functionality

### Step 3: Payment System
- Backend: Payment routes
- Frontend: Payment page with QR code display
- Payment confirmation flow

### Step 4: Profile Management
- Backend: Profile routes
- Frontend: Profile edit page
- Update user information

### Step 5: Checkout & Photos
- Backend: File upload with multer
- Frontend: Photo upload component
- Checkout photo submission

### Step 6: Reviews System
- Backend: Reviews routes
- Frontend: Review submission form
- Display reviews on unit details

### Step 7: Dashboard Enhancement
- Update guest dashboard with real data
- Show upcoming/past bookings
- Display stats

## Routes to Add

### Backend API Routes
```
POST   /api/guest/bookings           - Create booking
GET    /api/guest/bookings           - Get all bookings
GET    /api/guest/bookings/:id       - Get single booking
PUT    /api/guest/bookings/:id       - Update booking
DELETE /api/guest/bookings/:id       - Cancel booking

POST   /api/guest/payments/create    - Create payment
GET    /api/guest/payments/:id/qr    - Get QR code
POST   /api/guest/payments/:id/confirm - Confirm payment

GET    /api/guest/profile            - Get profile
PUT    /api/guest/profile            - Update profile

POST   /api/guest/checkout/:bookingId/photos - Upload photos
GET    /api/guest/checkout/:bookingId - Get checkout info

POST   /api/guest/reviews            - Submit review
GET    /api/guest/reviews/:bookingId - Get review
```

### Frontend Routes
```
/guest/bookings                - Bookings list
/guest/bookings/:id            - Booking details
/guest/booking/new/:unitId     - Create booking
/guest/payment/:bookingId      - Payment page
/guest/profile                 - Profile page
/guest/checkout/:bookingId     - Checkout photos
/guest/review/:bookingId       - Submit review
```

## Key Features

### Booking Creation
- Date range selection
- Guest count selection
- Price calculation
- Availability checking
- Security deposit info

### Payment
- QR code generation
- Payment instructions
- Payment confirmation
- Receipt display

### Profile
- Edit personal info
- Change password
- View booking history
- Security deposit tracking

### Checkout
- Upload multiple photos
- Photo preview
- Submission confirmation

### Reviews
- Star rating (1-5)
- Text review
- Optional photos
- Review history

## Dependencies Needed
- Date picker library (react-datepicker or similar)
- QR code generator (qrcode.react)
- Image upload preview

## Success Criteria
- ✅ Guest can create bookings
- ✅ Guest can view all bookings
- ✅ Guest can make payments
- ✅ Guest can manage profile
- ✅ Guest can upload checkout photos
- ✅ Guest can submit reviews
- ✅ All data persists in JSON files
- ✅ Proper error handling
- ✅ Loading states
- ✅ Form validation

Let's build this! 🚀
