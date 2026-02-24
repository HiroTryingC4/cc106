# Test Accounts for Smart Stay

## Overview
This document contains test account credentials for different user roles in the Smart Stay application.

## Important Notes
- All test accounts use the same password: `password123`
- The password hash in the database is: `$2a$10$rKZLvXZnJ5Z5Z5Z5Z5Z5ZeO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z`
- These are for development/testing purposes only

---

## Admin Account

**Email:** `admin@smartstay.com`  
**Password:** `password123`  
**Role:** Admin  
**Access:** Full system access

**Features:**
- User management
- Host verification approval/rejection
- Property and content moderation
- Booking management
- Financial reports
- System settings
- Activity logs

**Login URL:** `http://localhost:3000/admin/login`

---

## Host Accounts

### Host 1 - Verified ✅

**Email:** `host1@smartstay.com`  
**Password:** `password123`  
**Name:** John Smith  
**Role:** Host  
**Status:** Verified  
**Verified Date:** January 20, 2024

**Features (Full Access):**
- ✅ Create and manage property listings
- ✅ Accept/reject bookings
- ✅ View analytics and financial reports
- ✅ Manage guests
- ✅ Configure chatbot
- ✅ All write operations enabled

**Login URL:** `http://localhost:3000/host/login`

---

### Host 2 - Unverified ⏳

**Email:** `host2@smartstay.com`  
**Password:** `password123`  
**Name:** Emily Davis  
**Role:** Host  
**Status:** Not Verified (Pending Verification)  
**Verification Status:** Pending Review

**Features (Read-Only Mode):**
- ✅ View dashboard and statistics
- ✅ Browse property listings (read-only)
- ✅ View bookings (read-only)
- ✅ View analytics and reports (read-only)
- ❌ Cannot create/edit/delete units
- ❌ Cannot approve/reject bookings
- ❌ Cannot perform any write operations

**Verification Details:**
- Business Name: Davis Vacation Rentals
- Submitted: February 15, 2024
- Status: Awaiting admin approval

**Login URL:** `http://localhost:3000/host/login`

---

### Host 3 - Verified (Recently Approved) ✅

**Email:** `host3@smartstay.com`  
**Password:** `password123`  
**Name:** Michael Rodriguez  
**Role:** Host  
**Status:** Verified  
**Verified Date:** February 10, 2024

**Features (Full Access):**
- ✅ Create and manage property listings
- ✅ Accept/reject bookings
- ✅ View analytics and financial reports
- ✅ Manage guests
- ✅ Configure chatbot
- ✅ All write operations enabled

**Verification Details:**
- Business Name: Rodriguez Property Management (LLC)
- Business Type: Limited Liability Company
- Submitted: February 6, 2024
- Approved: February 10, 2024 by Admin
- Admin Notes: "All documents verified. Business license and insurance valid. Approved for hosting."

**Special Notes:**
- This is a newly verified host with no properties yet
- Perfect for testing the full property creation workflow
- Has completed verification process successfully

**Login URL:** `http://localhost:3000/host/login`

---

## Guest Account

**Email:** `guest1@example.com`  
**Password:** `password123`  
**Name:** Sarah Johnson  
**Role:** Guest

**Features:**
- Browse available units
- Create bookings
- Make payments
- Leave reviews
- View booking history
- Manage profile

**Login URL:** `http://localhost:3000/guest/login`

---

## Testing Scenarios

### Scenario 1: Verified Host Experience (Host 1)
1. Login as `host1@smartstay.com`
2. Navigate to "My Units"
3. Click "Add New Unit" - Should work ✅
4. Edit existing units - Should work ✅
5. View bookings and approve/reject - Should work ✅

### Scenario 2: Unverified Host Experience (Host 2)
1. Login as `host2@smartstay.com`
2. See yellow verification banner on dashboard
3. Navigate to "My Units"
4. See warning banner about read-only mode
5. Try to click "Add New Unit" - Button is disabled 🔒
6. Try to edit/delete units - Buttons are disabled 🔒
7. Navigate to "Bookings"
8. Try to approve/reject - Buttons are disabled 🔒
9. Click "Complete Verification" to see verification page

### Scenario 3: Newly Verified Host Experience (Host 3)
1. Login as `host3@smartstay.com`
2. See verified status on dashboard ✅
3. Navigate to "My Units" - No properties yet
4. Click "Add New Unit" - Should work ✅
5. Fill out complete property form with:
   - Property details (name, type, location)
   - Pricing and availability
   - House rules
   - Instant booking configuration
   - Amenities
6. Create first property successfully
7. Test all host features with full access

### Scenario 4: Admin Verification Workflow
1. Login as `admin@smartstay.com`
2. Navigate to "Host Verifications"
3. See pending verification for Emily Davis (Host 2)
4. See approved verification for Michael Rodriguez (Host 3)
5. Click "View Details" to review documents
6. Either:
   - Click "Approve Host" to verify the account
   - Click "Reject" and provide a reason
7. After approval, host2@smartstay.com will have full access

### Scenario 5: Host Verification Submission
1. Login as unverified host
2. Click "Get Verified" in sidebar or banner
3. Fill out verification form with:
   - Business information
   - Identification details
   - Banking information
   - Property documents
4. Submit for review
5. See "Verification Pending" status
6. Wait for admin approval

---

## Password Reset

If you need to reset passwords or create new test accounts, use bcrypt to hash passwords:

```javascript
const bcrypt = require('bcryptjs');
const password = 'password123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

---

## Database Files

User data is stored in:
- `backend/data/users.json` - User accounts
- `backend/data/host_verifications.json` - Verification requests
- `backend/data/units.json` - Property listings
- `backend/data/bookings.json` - Booking records

---

## Quick Access URLs

- **Landing Page:** `http://localhost:3000`
- **Admin Login:** `http://localhost:3000/admin/login`
- **Host Login:** `http://localhost:3000/host/login`
- **Guest Login:** `http://localhost:3000/guest/login`
- **Register:** `http://localhost:3000/register/host` or `/register/guest`

---

## Support

For issues or questions about test accounts, refer to:
- `docs/ADMIN_FEATURES_COMPLETE.md` - Admin features documentation
- `docs/USER_GUIDE.md` - User guide
- `docs/RUN_GUIDE.md` - How to run the application
