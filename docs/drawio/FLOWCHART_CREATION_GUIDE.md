# SmartStay Detailed Flowchart Creation Guide

This guide provides complete instructions for creating detailed flowcharts for all user types in Draw.io.

## Overview

You need to create 4 detailed flowcharts:
1. **GUEST_FLOW_DETAILED.drawio** - Guest user journey with all 8 features
2. **HOST_FLOW_DETAILED.drawio** - Host user journey with all 14 features  
3. **ADMIN_FLOW_DETAILED.drawio** - Admin user journey with all 13 features
4. **COMPLETE_SYSTEM_DETAILED.drawio** - All three user types on ONE page showing interactions

## Color Coding System

Use these exact colors for consistency:

- **Green** (#d5e8d4, border #82b366) - Start/Success states, Shared features
- **Blue** (#dae8fc, border #6c8ebf) - Main pages and navigation
- **Yellow** (#fff2cc, border #d6b656) - Decision diamonds (rhombus shapes)
- **Purple** (#e1d5e7, border #9673a6) - Guest features and actions
- **Orange** (#ffe6cc, border #d79b00) - Host features and actions
- **Red** (#f8cecc, border #b85450) - Admin features, End states, Errors

## Canvas Sizes

- Individual flowcharts (Guest/Host/Admin): 2000 x 1500 pixels
- Combined flowchart: 3000 x 2200 pixels

## Shape Types

- **Ellipse** - Start and End points
- **Rectangle (rounded)** - Processes, actions, pages
- **Rhombus (Diamond)** - Decision points (Yes/No, choices)
- **Arrows** - Flow direction (use strokeWidth=2 for main flow, strokeWidth=1 for sub-flows)

---

## 1. GUEST FLOW DETAILED

### Structure (50+ nodes)

```
START (ellipse, green)
  ↓
Landing Page (rectangle, blue)
  ↓
Decision: Action? (rhombus, yellow)
  ├→ Browse Units (purple)
  ├→ Search & Filter (purple)
  │   ├→ Decision: Filter By? (yellow)
  │   ├→ Location (purple)
  │   ├→ Price (purple)
  │   ├→ Amenities (purple)
  │   └→ Capacity (purple)
  ├→ View Unit Details (purple)
  │   ├→ Decision: View? (yellow)
  │   ├→ Image Gallery (purple)
  │   ├→ Amenities & Rules (purple)
  │   ├→ Location Map (purple)
  │   ├→ Availability Calendar (purple)
  │   └→ AI Chatbot Q&A (purple)
  ├→ AI Recommendations (purple)
  ├→ FAQ (purple)
  ├→ Register (purple)
  │   ├→ Enter Details (purple)
  │   └→ Create Account (purple)
  └→ Login (purple)
      ├→ Enter Credentials (purple)
      └→ Authenticate (purple)
        ↓
GUEST DASHBOARD (rectangle, purple, bold)
  ↓
Decision: Feature? (rhombus, yellow)
  ├→ Dashboard Overview (purple)
  │   ├→ Active Bookings (purple)
  │   ├→ Upcoming Stays (purple)
  │   └→ Quick Stats (purple)
  ├→ Browse & Search (purple)
  ├→ Create Booking (purple)
  │   ├→ Select Dates (purple)
  │   ├→ Enter Guest Details (purple)
  │   ├→ Review Summary (purple)
  │   └→ Payment (purple)
  │       ├→ Enter Card Details (purple)
  │       ├→ Process Payment (purple)
  │       ├→ Decision: Success? (yellow)
  │       ├→ Payment Success ✓ (green)
  │       ├→ Payment Failed ✗ (red)
  │       └→ Booking Confirmed (green)
  ├→ My Bookings (purple)
  │   ├→ View All Bookings (purple)
  │   ├→ Booking Details (purple)
  │   ├→ Decision: Action? (yellow)
  │   ├→ Cancel (purple)
  │   ├→ Modify (purple)
  │   └→ Contact Host (purple)
  ├→ Check-out Photo (purple)
  │   ├→ Upload Photo (purple)
  │   ├→ Verify Unit Condition (purple)
  │   └→ Complete Check-out (green)
  ├→ Reviews & Ratings (purple)
  │   ├→ Rate Property (1-5 stars) (purple)
  │   ├→ Write Review (purple)
  │   ├→ Rate Cleanliness (purple)
  │   ├→ Rate Accuracy (purple)
  │   └→ Submit Review (green)
  ├→ Messages (purple)
  │   ├→ View Conversations (purple)
  │   ├→ Decision: Action? (yellow)
  │   ├→ Message Host (purple)
  │   ├→ Message Admin (purple)
  │   └→ Start New Conversation (purple)
  ├→ AI Recommendations (purple)
  │   ├→ View Suggestions (purple)
  │   ├→ Decision: Based On? (yellow)
  │   ├→ Preferences (purple)
  │   ├→ Browsing History (purple)
  │   └→ Similar Properties (purple)
  ├→ Profile Management (purple)
  │   ├→ Update Personal Info (purple)
  │   ├→ Change Password (purple)
  │   ├→ Manage Preferences (purple)
  │   └→ View Booking History (purple)
  └→ LOGOUT (ellipse, red)
```

**Total Nodes: ~55**

---

## 2. HOST FLOW DETAILED

### Structure (60+ nodes)

```
START (ellipse, green)
  ↓
Landing Page (rectangle, blue)
  ↓
Decision: Register or Login? (rhombus, yellow)
  ├→ Host Registration (orange)
  │   ├→ Enter Details (orange)
  │   └→ Create Account (orange)
  └→ Host Login (orange)
      ├→ Enter Credentials (orange)
      └→ Authenticate (orange)
        ↓
HOST DASHBOARD (rectangle, orange, bold)
  ↓
Decision: Feature? (rhombus, yellow)
  ├→ Dashboard Overview (orange)
  │   ├→ Revenue Summary (orange)
  │   ├→ Booking Statistics (orange)
  │   ├→ Occupancy Rate (orange)
  │   └→ Quick Actions (orange)
  ├→ Verification Process (orange)
  │   ├→ Submit Documents (orange)
  │   │   ├→ Government ID (orange)
  │   │   ├→ Proof of Ownership (orange)
  │   │   └→ Business Permits (orange)
  │   ├→ Wait for Admin Review (orange)
  │   ├→ Decision: Status? (yellow)
  │   ├→ Approved ✓ (green)
  │   ├→ Pending ⏳ (yellow)
  │   └→ Rejected ✗ (red)
  ├→ Property Management (orange)
  │   ├→ View All Units (orange)
  │   ├→ Add New Unit (orange)
  │   │   ├→ Basic Information (orange)
  │   │   ├→ Upload Images (orange)
  │   │   ├→ Set Amenities (orange)
  │   │   ├→ Set Pricing (orange)
  │   │   ├→ House Rules (orange)
  │   │   └→ Availability Settings (orange)
  │   ├→ Edit Unit (orange)
  │   ├→ Delete Unit (orange)
  │   └→ Manage Availability (orange)
  ├→ Booking Management (orange)
  │   ├→ View All Bookings (orange)
  │   ├→ Booking Calendar View (orange)
  │   ├→ Booking Details (orange)
  │   ├→ Approve/Reject Bookings (orange)
  │   └→ Track Payment Status (orange)
  ├→ Guest Management (orange)
  │   ├→ View All Guests (orange)
  │   ├→ Guest Details (orange)
  │   │   ├→ Booking History (orange)
  │   │   ├→ Total Spent (orange)
  │   │   └→ Contact Info (orange)
  │   └→ Send Messages (orange)
  ├→ Financial Management (orange)
  │   ├→ Tab 1: Financial Overview (orange)
  │   │   ├→ Revenue Analytics (orange)
  │   │   ├→ Income by Property (orange)
  │   │   ├→ Monthly Trends (orange)
  │   │   └→ Financial Charts (orange)
  │   ├→ Tab 2: Expense Tracking (orange)
  │   │   ├→ View All Expenses (orange)
  │   │   ├→ Add New Expense (orange)
  │   │   │   ├→ Maintenance (orange)
  │   │   │   ├→ Utilities (orange)
  │   │   │   ├→ Supplies (orange)
  │   │   │   └→ Other (orange)
  │   │   └→ Expense Reports (orange)
  │   └→ Tab 3: Payroll Management (orange)
  │       ├→ View Employees (orange)
  │       ├→ Add Employee (orange)
  │       ├→ Process Payroll (orange)
  │       └→ Payroll Reports (orange)
  ├→ Analytics & Insights (orange)
  │   ├→ Revenue Analytics (orange)
  │   ├→ Booking Trends (orange)
  │   ├→ Occupancy Rates (orange)
  │   └→ Performance Metrics (orange)
  ├→ Reports (orange)
  │   ├→ Financial Reports (orange)
  │   │   ├→ Income Statement (orange)
  │   │   ├→ Profit Analysis (orange)
  │   │   └→ Revenue by Property (orange)
  │   ├→ Booking Reports (orange)
  │   ├→ Guest Reports (orange)
  │   └→ Export (PDF/CSV) (orange)
  ├→ AI Pricing Recommendations (orange)
  │   ├→ AI-Powered Pricing (orange)
  │   ├→ Market Analysis (orange)
  │   ├→ Seasonal Adjustments (orange)
  │   └→ Apply Recommendations (orange)
  ├→ Chatbot Management (orange)
  │   ├→ Configure Chatbot (orange)
  │   ├→ Response Templates (orange)
  │   ├→ FAQ Management (orange)
  │   └→ View Chat Logs (orange)
  ├→ Reviews Management (orange)
  │   ├→ View All Reviews (orange)
  │   ├→ Respond to Reviews (orange)
  │   └→ Rating Trends (orange)
  ├→ Messages (orange)
  │   ├→ View Conversations (orange)
  │   ├→ Message Guests (orange)
  │   └→ Message Admins (orange)
  ├→ Response Templates (orange)
  │   ├→ Create Template (orange)
  │   ├→ Edit Template (orange)
  │   └→ Use Template (orange)
  └→ LOGOUT (ellipse, red)
```

**Total Nodes: ~65**

---

## 3. ADMIN FLOW DETAILED

### Structure (60+ nodes)

```
START (ellipse, green)
  ↓
Admin Login Page (rectangle, blue)
  ↓
Admin Login (Secure) (rectangle, red)
  ├→ Enter Credentials (red)
  └→ Enhanced Authentication (red)
    ↓
ADMIN DASHBOARD (rectangle, red, bold)
  ↓
Decision: Feature? (rhombus, yellow)
  ├→ Dashboard Overview (red)
  │   ├→ Platform Statistics (red)
  │   ├→ Total Users (red)
  │   ├→ Total Bookings (red)
  │   ├→ Total Revenue (red)
  │   └→ System Health (red)
  ├→ User Management (red)
  │   ├→ View All Users (red)
  │   ├→ Decision: Filter? (yellow)
  │   ├→ Filter by Role (red)
  │   ├→ Filter by Status (red)
  │   ├→ User Details (red)
  │   ├→ Add New User (red)
  │   ├→ Edit User (red)
  │   ├→ Suspend/Activate User (red)
  │   └→ Delete User (red)
  ├→ Host Verification (red)
  │   ├→ View Verification Requests (red)
  │   ├→ Decision: Status? (yellow)
  │   ├→ Pending (yellow)
  │   ├→ Approved (green)
  │   ├→ Rejected (red)
  │   ├→ Review Documents (red)
  │   │   ├→ Government ID (red)
  │   │   ├→ Proof of Ownership (red)
  │   │   └→ Business Permits (red)
  │   ├→ Decision: Approve? (yellow)
  │   ├→ Approve Verification ✓ (green)
  │   └→ Reject Verification ✗ (red)
  │       └→ Provide Reason (red)
  ├→ Property Management (red)
  │   ├→ View All Units (red)
  │   ├→ Filter by Status (red)
  │   ├→ Unit Details (red)
  │   ├→ Edit Unit (red)
  │   ├→ Approve/Reject Unit (red)
  │   ├→ Suspend Unit (red)
  │   └→ Delete Unit (red)
  ├→ Booking Management (red)
  │   ├→ View All Bookings (red)
  │   ├→ Filter by Status (red)
  │   ├→ Booking Details (red)
  │   ├→ Modify Booking (red)
  │   ├→ Cancel Booking (red)
  │   └→ Resolve Disputes (red)
  ├→ Financial Management (red)
  │   ├→ Platform Revenue (red)
  │   ├→ Transaction History (red)
  │   ├→ Payment Analytics (red)
  │   ├→ Commission Tracking (red)
  │   └→ Refund Management (red)
  ├→ Reviews Management (red)
  │   ├→ View All Reviews (red)
  │   ├→ Filter by Rating (red)
  │   ├→ Moderate Reviews (red)
  │   ├→ Flag Inappropriate (red)
  │   └→ Delete Reviews (red)
  ├→ Chatbot Management (red)
  │   ├→ Global Settings (red)
  │   ├→ Response Templates (red)
  │   ├→ FAQ Management (red)
  │   ├→ Training Data (red)
  │   └→ Chatbot Analytics (red)
  │       ├→ Total Conversations (red)
  │       ├→ Response Accuracy (red)
  │       ├→ User Satisfaction (red)
  │       └→ Common Questions (red)
  ├→ Security & Fraud Detection (red)
  │   ├→ Security Dashboard (red)
  │   ├→ Fraud Alerts (red)
  │   │   ├→ Suspicious Activities (red)
  │   │   ├→ Failed Logins (red)
  │   │   ├→ Unusual Patterns (red)
  │   │   └→ Payment Anomalies (red)
  │   ├→ Security Logs (red)
  │   ├→ IP Blocking (red)
  │   └→ Security Reports (red)
  ├→ Reports & Analytics (red)
  │   ├→ Platform Reports (red)
  │   │   ├→ User Growth (red)
  │   │   ├→ Booking Trends (red)
  │   │   └→ Revenue Analysis (red)
  │   ├→ Data Visualization (red)
  │   │   ├→ Charts & Graphs (red)
  │   │   └→ Trend Analysis (red)
  │   └→ Export Reports (red)
  │       ├→ PDF Export (red)
  │       ├→ CSV Export (red)
  │       └→ Excel Export (red)
  ├→ System Management (red)
  │   ├→ System Settings (red)
  │   ├→ Platform Configuration (red)
  │   ├→ Email Templates (red)
  │   ├→ Notification Settings (red)
  │   ├→ Payment Gateway Config (red)
  │   └→ Backup & Restore (red)
  ├→ Activity Logs (red)
  │   ├→ User Activity Logs (red)
  │   ├→ System Logs (red)
  │   ├→ Error Logs (red)
  │   ├→ Security Logs (red)
  │   └→ Export Logs (red)
  ├→ Messages (red)
  │   ├→ View All Conversations (red)
  │   ├→ Message Users (red)
  │   └→ Broadcast Messages (red)
  └→ LOGOUT (ellipse, red)
```

**Total Nodes: ~70**

---

## 4. COMPLETE SYSTEM (All Users on ONE Page)

### Layout Strategy

Use a 3-column layout on a 3000x2200 canvas:

**Left Column (x: 100-900):** GUEST FLOW (purple)
**Middle Column (x: 1000-2000):** HOST FLOW (orange)  
**Right Column (x: 2100-2900):** ADMIN FLOW (red)

**Bottom Section (y: 1800-2100):** SHARED SYSTEMS (green)
- Messaging System (connects all three)
- Booking Lifecycle (Guest → Host → Admin)
- Payment System (Guest → Host → Admin)
- Review System (Guest ↔ Host, Admin moderates)

### Cross-User Connections

Add arrows showing interactions:
- Guest "Create Booking" → Host "Receive Booking"
- Guest "Make Payment" → Host "Receive Payment"
- Guest "Write Review" → Host "View Review"
- Host "Submit Verification" → Admin "Review Verification"
- Host "List Unit" → Guest "Browse Units"
- Admin monitors all flows (dashed lines to all major nodes)

### Key Features to Show

1. **Guest Section** (simplified, 30 nodes)
   - Landing → Browse → Book → Pay → Review
   - All 8 main features visible

2. **Host Section** (simplified, 35 nodes)
   - Register → Verify → Manage Properties → Financial → Analytics
   - All 14 main features visible

3. **Admin Section** (simplified, 35 nodes)
   - Login → Monitor Users → Verify Hosts → Security → Reports
   - All 13 main features visible

4. **Shared Systems** (10 nodes)
   - Messaging hub
   - Booking lifecycle
   - Payment flow
   - Review system
   - AI Chatbot

**Total Nodes: ~110**

---

## Step-by-Step Creation in Draw.io

### 1. Open Draw.io
- Go to https://app.diagrams.net/
- Click "Create New Diagram"
- Choose "Blank Diagram"
- Set canvas size in File → Page Setup

### 2. Create Shapes
- Use the shape library on the left
- Drag and drop shapes onto canvas
- Double-click to edit text
- Right-click → Edit Style to change colors

### 3. Color Format Strings
For consistent styling, use these format strings:

**Green (Start/Success):**
```
fillColor=#d5e8d4;strokeColor=#82b366;
```

**Blue (Main Pages):**
```
fillColor=#dae8fc;strokeColor=#6c8ebf;
```

**Yellow (Decisions):**
```
fillColor=#fff2cc;strokeColor=#d6b656;
```

**Purple (Guest):**
```
fillColor=#e1d5e7;strokeColor=#9673a6;
```

**Orange (Host):**
```
fillColor=#ffe6cc;strokeColor=#d79b00;
```

**Red (Admin/End):**
```
fillColor=#f8cecc;strokeColor=#b85450;
```

### 4. Connect Shapes
- Click on a shape
- Drag the blue arrow points to another shape
- Right-click arrow → Edit Style → strokeWidth=2 (for main flow)

### 5. Add Decision Diamonds
- Use rhombus shape
- Add text like "Success?", "Action?", "Filter By?"
- Connect to multiple outcomes

### 6. Save and Export
- File → Save As → Choose location
- File → Export As → PNG/PDF/SVG

---

## Tips for Detailed Flowcharts

1. **Use Layers** - Separate main flow from sub-processes
2. **Align Shapes** - Use Arrange → Align for clean layout
3. **Group Related Items** - Select multiple → Right-click → Group
4. **Add Swimlanes** - For the combined view, use Container shapes
5. **Use Connectors** - Not just arrows, but proper connectors that stay attached
6. **Add Labels** - Label decision branches (Yes/No, Success/Fail)
7. **Keep Spacing Consistent** - Use grid snap (View → Grid)
8. **Test Readability** - Zoom out to 50% to check overall flow

---

## Validation Checklist

### Guest Flow
- [ ] All 8 features included
- [ ] Booking process shows all steps (dates → details → review → payment)
- [ ] Payment has Success/Fail decision
- [ ] Reviews show rating categories
- [ ] Messages show Host/Admin options
- [ ] AI Recommendations show different bases

### Host Flow
- [ ] All 14 features included
- [ ] Verification process shows Approved/Pending/Rejected
- [ ] Property management shows add/edit/delete
- [ ] Financial has 3 tabs (Overview/Expenses/Payroll)
- [ ] Reports show different types
- [ ] Chatbot management included

### Admin Flow
- [ ] All 13 features included
- [ ] User management shows all roles
- [ ] Verification review process detailed
- [ ] Security & Fraud Detection prominent
- [ ] Chatbot Analytics separate from management
- [ ] System management included

### Combined Flow
- [ ] All three user types visible
- [ ] Cross-user connections shown
- [ ] Shared systems at bottom
- [ ] Color coding consistent
- [ ] Readable at 50% zoom
- [ ] All major interactions visible

---

## Reference

For complete feature lists and detailed descriptions, see:
- `docs/USER_FLOWCHARTS.md` - Comprehensive ASCII flowcharts
- `docs/ADMIN_FEATURES_COMPLETE.md` - Admin feature details
- `docs/ALL_HOST_FEATURES_COMPLETE.md` - Host feature details
- `docs/PHASE7_COMPLETE.md` - Guest feature details

---

## Need Help?

If you encounter issues:
1. Check XML syntax (especially `&` should be `&amp;`)
2. Verify all shapes have unique IDs
3. Ensure arrows connect to valid shape IDs
4. Test with smaller flowchart first
5. Use Draw.io's built-in validation (File → Check)

