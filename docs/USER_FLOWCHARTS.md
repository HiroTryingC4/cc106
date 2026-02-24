# SmartStay Platform - User Flowcharts

## Overview
This document provides comprehensive flowcharts for all user types in the SmartStay platform: Guests, Hosts, and Admins.

---

## 1. GUEST USER FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                        GUEST JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─→ [Landing Page]
  │     │
  │     ├─→ Browse Units (Public)
  │     │     │
  │     │     ├─→ View Unit Details
  │     │     │     ├─→ Image Gallery
  │     │     │     ├─→ Amenities & Rules
  │     │     │     ├─→ Location Map
  │     │     │     ├─→ Availability Calendar
  │     │     │     └─→ AI Chatbot (Property Q&A)
  │     │     │
  │     │     ├─→ Search & Filter
  │     │     │     ├─→ By Location
  │     │     │     ├─→ By Price Range
  │     │     │     ├─→ By Amenities
  │     │     │     └─→ By Capacity
  │     │     │
  │     │     └─→ AI Recommendations
  │     │           └─→ Personalized Suggestions
  │     │
  │     └─→ Register/Login
  │           │
  │           ├─→ Guest Registration
  │           └─→ Guest Login
  │
  ├─→ [Guest Dashboard] (After Login)
  │     │
  │     ├─→ Dashboard Overview
  │     │     ├─→ Active Bookings
  │     │     ├─→ Upcoming Stays
  │     │     └─→ Quick Stats
  │     │
  │     ├─→ Browse & Search Units
  │     │     ├─→ View Recommendations
  │     │     ├─→ Search with Filters
  │     │     └─→ View Unit Details
  │     │
  │     ├─→ Create Booking
  │     │     ├─→ Select Dates
  │     │     ├─→ Enter Guest Details
  │     │     ├─→ Review Booking Summary
  │     │     └─→ Proceed to Payment
  │     │
  │     ├─→ Payment Processing
  │     │     ├─→ Enter Payment Details
  │     │     ├─→ Process Payment
  │     │     ├─→ Payment Success ✓
  │     │     └─→ Booking Confirmed
  │     │
  │     ├─→ My Bookings
  │     │     ├─→ View All Bookings
  │     │     ├─→ Booking Details
  │     │     │     ├─→ Check-in/Check-out Info
  │     │     │     ├─→ Payment Status
  │     │     │     ├─→ Unit Information
  │     │     │     └─→ Host Contact
  │     │     │
  │     │     ├─→ Cancel Booking (if allowed)
  │     │     └─→ Modify Booking
  │     │
  │     ├─→ Check-out Process
  │     │     ├─→ Upload Check-out Photo
  │     │     ├─→ Verify Unit Condition
  │     │     └─→ Complete Check-out
  │     │
  │     ├─→ Reviews & Ratings
  │     │     ├─→ Rate Property (1-5 stars)
  │     │     ├─→ Write Review
  │     │     ├─→ Rate Cleanliness
  │     │     ├─→ Rate Accuracy
  │     │     └─→ Submit Review
  │     │
  │     ├─→ Messages
  │     │     ├─→ View Conversations
  │     │     ├─→ Message Hosts
  │     │     ├─→ Message Admins
  │     │     └─→ Start New Conversation
  │     │
  │     ├─→ Recommendations
  │     │     ├─→ AI-Powered Suggestions
  │     │     ├─→ Based on Preferences
  │     │     ├─→ Based on Browsing History
  │     │     └─→ Similar Properties
  │     │
  │     └─→ Profile Management
  │           ├─→ Update Personal Info
  │           ├─→ Change Password
  │           ├─→ Manage Preferences
  │           └─→ View Booking History
  │
  └─→ [Logout]

```

---

## 2. HOST USER FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOST JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─→ [Landing Page]
  │     │
  │     └─→ Host Registration/Login
  │           │
  │           ├─→ Host Registration
  │           └─→ Host Login
  │
  ├─→ [Host Dashboard] (After Login)
  │     │
  │     ├─→ Dashboard Overview
  │     │     ├─→ Revenue Summary
  │     │     ├─→ Booking Statistics
  │     │     ├─→ Occupancy Rate
  │     │     ├─→ Recent Activities
  │     │     └─→ Quick Actions
  │     │
  │     ├─→ Verification Process
  │     │     ├─→ Submit Verification Documents
  │     │     │     ├─→ Government ID
  │     │     │     ├─→ Proof of Ownership
  │     │     │     └─→ Business Permits
  │     │     │
  │     │     ├─→ Wait for Admin Review
  │     │     └─→ Verification Status
  │     │           ├─→ Approved ✓
  │     │           ├─→ Pending ⏳
  │     │           └─→ Rejected ✗
  │     │
  │     ├─→ Property Management (Units)
  │     │     ├─→ View All Units
  │     │     ├─→ Add New Unit
  │     │     │     ├─→ Basic Information
  │     │     │     ├─→ Upload Images
  │     │     │     ├─→ Set Amenities
  │     │     │     ├─→ Set Pricing
  │     │     │     ├─→ House Rules
  │     │     │     └─→ Availability Settings
  │     │     │
  │     │     ├─→ Edit Unit
  │     │     ├─→ Delete Unit
  │     │     └─→ Manage Availability
  │     │
  │     ├─→ Booking Management
  │     │     ├─→ View All Bookings
  │     │     ├─→ Booking Calendar View
  │     │     ├─→ Booking Details
  │     │     ├─→ Approve/Reject Bookings
  │     │     ├─→ Manage Check-in/Check-out
  │     │     └─→ Track Payment Status
  │     │
  │     ├─→ Guest Management
  │     │     ├─→ View All Guests
  │     │     ├─→ Guest Details
  │     │     │     ├─→ Booking History
  │     │     │     ├─→ Total Spent
  │     │     │     └─→ Contact Information
  │     │     │
  │     │     └─→ Send Messages to Guests
  │     │
  │     ├─→ Financial Management (Consolidated)
  │     │     │
  │     │     ├─→ [Tab 1] Financial Overview
  │     │     │     ├─→ Revenue Analytics
  │     │     │     ├─→ Income by Property
  │     │     │     ├─→ Monthly Trends
  │     │     │     ├─→ Payment Status
  │     │     │     └─→ Financial Charts
  │     │     │
  │     │     ├─→ [Tab 2] Expense Tracking
  │     │     │     ├─→ View All Expenses
  │     │     │     ├─→ Add New Expense
  │     │     │     │     ├─→ Maintenance
  │     │     │     │     ├─→ Utilities
  │     │     │     │     ├─→ Supplies
  │     │     │     │     └─→ Other
  │     │     │     │
  │     │     │     ├─→ Edit/Delete Expense
  │     │     │     ├─→ Expense by Category
  │     │     │     └─→ Expense Reports
  │     │     │
  │     │     └─→ [Tab 3] Payroll Management
  │     │           ├─→ View Employees
  │     │           ├─→ Add Employee
  │     │           ├─→ Process Payroll
  │     │           ├─→ Payment History
  │     │           └─→ Payroll Reports
  │     │
  │     ├─→ Analytics & Insights
  │     │     ├─→ Revenue Analytics
  │     │     ├─→ Booking Trends
  │     │     ├─→ Occupancy Rates
  │     │     ├─→ Guest Demographics
  │     │     ├─→ Performance Metrics
  │     │     └─→ Comparative Analysis
  │     │
  │     ├─→ Reports
  │     │     ├─→ Financial Reports
  │     │     │     ├─→ Income Statement
  │     │     │     ├─→ Profit Analysis
  │     │     │     └─→ Revenue by Property
  │     │     │
  │     │     ├─→ Booking Reports
  │     │     │     ├─→ Booking Summary
  │     │     │     ├─→ Occupancy Report
  │     │     │     └─→ Cancellation Report
  │     │     │
  │     │     ├─→ Guest Reports
  │     │     │     ├─→ Guest Activity
  │     │     │     └─→ Guest Spending
  │     │     │
  │     │     └─→ Export Reports (PDF/CSV)
  │     │
  │     ├─→ Pricing Recommendations
  │     │     ├─→ AI-Powered Pricing
  │     │     ├─→ Market Analysis
  │     │     ├─→ Seasonal Adjustments
  │     │     └─→ Apply Recommendations
  │     │
  │     ├─→ AI Chatbot Management
  │     │     ├─→ Configure Chatbot
  │     │     ├─→ Response Templates
  │     │     ├─→ FAQ Management
  │     │     ├─→ View Chat Logs
  │     │     └─→ Chatbot Analytics
  │     │
  │     ├─→ Reviews Management
  │     │     ├─→ View All Reviews
  │     │     ├─→ Respond to Reviews
  │     │     ├─→ Review Analytics
  │     │     └─→ Rating Trends
  │     │
  │     ├─→ Messages
  │     │     ├─→ View Conversations
  │     │     ├─→ Message Guests
  │     │     ├─→ Message Admins
  │     │     └─→ Start New Conversation
  │     │
  │     ├─→ Notifications
  │     │     ├─→ New Bookings
  │     │     ├─→ Payment Updates
  │     │     ├─→ Guest Messages
  │     │     └─→ System Alerts
  │     │
  │     └─→ Profile & Settings
  │           ├─→ Update Profile
  │           ├─→ Change Password
  │           ├─→ Notification Preferences
  │           └─→ Account Settings
  │
  └─→ [Logout]

```

---

## 3. ADMIN USER FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─→ [Admin Login Page]
  │     │
  │     └─→ Admin Login (Secure)
  │
  ├─→ [Admin Dashboard] (After Login)
  │     │
  │     ├─→ Dashboard Overview
  │     │     ├─→ Platform Statistics
  │     │     ├─→ Total Users (Guests/Hosts)
  │     │     ├─→ Total Bookings
  │     │     ├─→ Total Revenue
  │     │     ├─→ Active Units
  │     │     ├─→ Recent Activities
  │     │     └─→ System Health
  │     │
  │     ├─→ User Management
  │     │     ├─→ View All Users
  │     │     │     ├─→ Filter by Role (Guest/Host/Admin)
  │     │     │     ├─→ Filter by Status
  │     │     │     └─→ Search Users
  │     │     │
  │     │     ├─→ User Details
  │     │     │     ├─→ Personal Information
  │     │     │     ├─→ Activity History
  │     │     │     ├─→ Booking History
  │     │     │     └─→ Financial Summary
  │     │     │
  │     │     ├─→ Add New User
  │     │     ├─→ Edit User
  │     │     ├─→ Suspend/Activate User
  │     │     └─→ Delete User
  │     │
  │     ├─→ Host Verification Management
  │     │     ├─→ View Verification Requests
  │     │     │     ├─→ Pending Verifications
  │     │     │     ├─→ Approved Verifications
  │     │     │     └─→ Rejected Verifications
  │     │     │
  │     │     ├─→ Review Verification
  │     │     │     ├─→ View Documents
  │     │     │     │     ├─→ Government ID
  │     │     │     │     ├─→ Proof of Ownership
  │     │     │     │     └─→ Business Permits
  │     │     │     │
  │     │     │     ├─→ Approve Verification ✓
  │     │     │     └─→ Reject Verification ✗
  │     │     │           └─→ Provide Rejection Reason
  │     │     │
  │     │     └─→ Verification History
  │     │
  │     ├─→ Property Management (Units)
  │     │     ├─→ View All Units
  │     │     ├─→ Filter by Status
  │     │     ├─→ Unit Details
  │     │     ├─→ Edit Unit
  │     │     ├─→ Approve/Reject Unit
  │     │     ├─→ Suspend Unit
  │     │     └─→ Delete Unit
  │     │
  │     ├─→ Booking Management
  │     │     ├─→ View All Bookings
  │     │     ├─→ Filter by Status
  │     │     ├─→ Booking Details
  │     │     ├─→ Modify Booking
  │     │     ├─→ Cancel Booking
  │     │     ├─→ Resolve Disputes
  │     │     └─→ Booking Analytics
  │     │
  │     ├─→ Financial Management
  │     │     ├─→ Platform Revenue
  │     │     ├─→ Transaction History
  │     │     ├─→ Payment Analytics
  │     │     ├─→ Revenue by Host
  │     │     ├─→ Commission Tracking
  │     │     ├─→ Refund Management
  │     │     └─→ Financial Reports
  │     │
  │     ├─→ Reviews & Ratings Management
  │     │     ├─→ View All Reviews
  │     │     ├─→ Filter by Rating
  │     │     ├─→ Moderate Reviews
  │     │     ├─→ Flag Inappropriate Content
  │     │     ├─→ Delete Reviews
  │     │     └─→ Review Analytics
  │     │
  │     ├─→ AI Chatbot Management
  │     │     ├─→ Global Chatbot Settings
  │     │     ├─→ Response Templates
  │     │     ├─→ FAQ Management
  │     │     ├─→ Training Data
  │     │     ├─→ Chatbot Analytics
  │     │     │     ├─→ Total Conversations
  │     │     │     ├─→ Response Accuracy
  │     │     │     ├─→ User Satisfaction
  │     │     │     └─→ Common Questions
  │     │     │
  │     │     └─→ View Chat Logs
  │     │
  │     ├─→ Security & Fraud Detection
  │     │     ├─→ Security Dashboard
  │     │     ├─→ Fraud Alerts
  │     │     │     ├─→ Suspicious Activities
  │     │     │     ├─→ Multiple Failed Logins
  │     │     │     ├─→ Unusual Booking Patterns
  │     │     │     └─→ Payment Anomalies
  │     │     │
  │     │     ├─→ Security Logs
  │     │     ├─→ IP Blocking
  │     │     ├─→ User Verification
  │     │     └─→ Security Reports
  │     │
  │     ├─→ Reports & Analytics
  │     │     ├─→ Platform Reports
  │     │     │     ├─→ User Growth
  │     │     │     ├─→ Booking Trends
  │     │     │     ├─→ Revenue Analysis
  │     │     │     └─→ Performance Metrics
  │     │     │
  │     │     ├─→ Data Visualization
  │     │     │     ├─→ Charts & Graphs
  │     │     │     ├─→ Trend Analysis
  │     │     │     └─→ Comparative Reports
  │     │     │
  │     │     └─→ Export Reports
  │     │           ├─→ PDF Export
  │     │           ├─→ CSV Export
  │     │           └─→ Excel Export
  │     │
  │     ├─→ System Management
  │     │     ├─→ System Settings
  │     │     ├─→ Platform Configuration
  │     │     ├─→ Email Templates
  │     │     ├─→ Notification Settings
  │     │     ├─→ Payment Gateway Config
  │     │     ├─→ API Management
  │     │     └─→ Backup & Restore
  │     │
  │     ├─→ Activity Logs
  │     │     ├─→ User Activity Logs
  │     │     ├─→ System Logs
  │     │     ├─→ Error Logs
  │     │     ├─→ Security Logs
  │     │     ├─→ Filter by Date/User/Action
  │     │     └─→ Export Logs
  │     │
  │     ├─→ Messages
  │     │     ├─→ View All Conversations
  │     │     ├─→ Message Users (Guests/Hosts)
  │     │     ├─→ Broadcast Messages
  │     │     └─→ Support Tickets
  │     │
  │     ├─→ Notifications
  │     │     ├─→ System Alerts
  │     │     ├─→ Security Alerts
  │     │     ├─→ User Reports
  │     │     └─→ Platform Updates
  │     │
  │     └─→ Profile & Settings
  │           ├─→ Update Profile
  │           ├─→ Change Password
  │           ├─→ Admin Preferences
  │           └─→ Security Settings
  │
  └─→ [Logout]

```

---

## 4. CROSS-USER INTERACTIONS

```
┌─────────────────────────────────────────────────────────────────┐
│                   INTERACTION FLOWCHART                          │
└─────────────────────────────────────────────────────────────────┘

GUEST ←──────────────────────────────────────────────→ HOST
  │                                                        │
  ├─→ Browse Units ←─────────────────── List Units ←─────┤
  │                                                        │
  ├─→ Create Booking ──────────────→ Receive Booking ←───┤
  │                                                        │
  ├─→ Make Payment ────────────────→ Receive Payment ←───┤
  │                                                        │
  ├─→ Send Message ←──────────────→ Send Message ←───────┤
  │                                                        │
  ├─→ Write Review ────────────────→ View Review ←───────┤
  │                                                        │
  ├─→ Ask Chatbot ←────────────────── Configure Bot ←────┤
  │                                                        │
  │                                                        │
  │                      ADMIN                             │
  │                        │                               │
  │                        ├─→ Monitor All Users          │
  │                        │                               │
  ├────────────────────→  ├─→ Manage Guests              │
  │                        │                               │
  │                        ├─→ Verify Hosts ←─────────────┤
  │                        │                               │
  │                        ├─→ Moderate Reviews           │
  │                        │                               │
  │                        ├─→ Resolve Disputes           │
  │                        │                               │
  │                        ├─→ Manage Bookings            │
  │                        │                               │
  │                        ├─→ Security & Fraud Detection │
  │                        │                               │
  │                        └─→ Platform Analytics         │
  │                                                        │
  └────────────────────────────────────────────────────────┘
```

---

## 5. BOOKING LIFECYCLE FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    BOOKING LIFECYCLE                             │
└─────────────────────────────────────────────────────────────────┘

[GUEST] Browse Units
   │
   ├─→ Select Unit
   │
   ├─→ Check Availability (Calendar)
   │
   ├─→ Select Dates
   │
   ├─→ Create Booking
   │     ├─→ Enter Guest Details
   │     └─→ Review Summary
   │
   ├─→ Payment Processing
   │     ├─→ Enter Payment Info
   │     ├─→ Process Payment
   │     └─→ Payment Success ✓
   │
   ├─→ Booking Confirmed
   │     │
   │     ├─→ [GUEST] Receives Confirmation
   │     └─→ [HOST] Receives Notification
   │
   ├─→ Pre-Check-in
   │     ├─→ [GUEST] Receives Check-in Details
   │     └─→ [HOST] Prepares Unit
   │
   ├─→ Check-in
   │     └─→ Guest Arrives
   │
   ├─→ Stay Period
   │     ├─→ [GUEST] Can Message Host
   │     └─→ [HOST] Can Message Guest
   │
   ├─→ Check-out
   │     ├─→ [GUEST] Uploads Check-out Photo
   │     └─→ [HOST] Verifies Condition
   │
   ├─→ Post-Stay
   │     ├─→ [GUEST] Writes Review
   │     ├─→ [HOST] Responds to Review
   │     └─→ Booking Completed ✓
   │
   └─→ [ADMIN] Monitors Entire Process

```

---

## 6. AUTHENTICATION & AUTHORIZATION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                             │
└─────────────────────────────────────────────────────────────────┘

START → Landing Page
   │
   ├─→ Public Access (No Login Required)
   │     ├─→ Browse Units
   │     ├─→ View Unit Details
   │     ├─→ Search & Filter
   │     ├─→ AI Recommendations
   │     ├─→ FAQ Page
   │     └─→ Contact Information
   │
   ├─→ Registration
   │     ├─→ Guest Registration
   │     │     ├─→ Enter Details
   │     │     ├─→ Create Account
   │     │     └─→ Auto Login → Guest Dashboard
   │     │
   │     └─→ Host Registration
   │           ├─→ Enter Details
   │           ├─→ Create Account
   │           ├─→ Auto Login → Host Dashboard
   │           └─→ Submit Verification (Required)
   │
   └─→ Login
         ├─→ Guest Login
         │     ├─→ Enter Credentials
         │     ├─→ Authenticate
         │     └─→ Redirect → Guest Dashboard
         │
         ├─→ Host Login
         │     ├─→ Enter Credentials
         │     ├─→ Authenticate
         │     └─→ Redirect → Host Dashboard
         │
         └─→ Admin Login (Separate Page)
               ├─→ Enter Credentials
               ├─→ Authenticate (Enhanced Security)
               └─→ Redirect → Admin Dashboard

AUTHORIZATION LEVELS:
├─→ Public: Browse, Search, View Details
├─→ Guest: + Booking, Payment, Reviews, Messages
├─→ Host: + Property Management, Financial, Analytics
└─→ Admin: + All Platform Management & Monitoring

```

---

## 7. MESSAGING SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    MESSAGING SYSTEM                              │
└─────────────────────────────────────────────────────────────────┘

[GUEST]                    [HOST]                    [ADMIN]
   │                          │                          │
   ├─→ Messages Page          ├─→ Messages Page         ├─→ Messages Page
   │                          │                          │
   ├─→ View Conversations     ├─→ View Conversations    ├─→ View All Conversations
   │   ├─→ With Hosts         │   ├─→ With Guests       │   ├─→ With Guests
   │   └─→ With Admins        │   └─→ With Admins       │   ├─→ With Hosts
   │                          │                          │   └─→ With Other Admins
   │                          │                          │
   ├─→ Start New Conversation ├─→ Start New Conversation├─→ Start New Conversation
   │   ├─→ Select Host        │   ├─→ Select Guest      │   └─→ Select Any User
   │   ├─→ Select Admin       │   ├─→ Select Admin      │
   │   └─→ Send Message       │   └─→ Send Message      │
   │                          │                          │
   ├─→ Send Message           ├─→ Send Message          ├─→ Send Message
   │                          │                          │
   ├─→ Receive Message        ├─→ Receive Message       ├─→ Receive Message
   │   └─→ Notification       │   └─→ Notification      │   └─→ Notification
   │                          │                          │
   └─→ Real-time Updates      └─→ Real-time Updates     └─→ Real-time Updates
       (10s polling)              (10s polling)             (10s polling)

MESSAGING RULES:
├─→ Guest can message: Hosts, Admins
├─→ Host can message: Guests, Admins
└─→ Admin can message: Everyone

```

---

## 8. AI FEATURES FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                      AI FEATURES                                 │
└─────────────────────────────────────────────────────────────────┘

1. AI CHATBOT (Property Q&A)
   │
   [GUEST] → Unit Details Page
      │
      ├─→ Click Chatbot Widget
      │
      ├─→ Ask Question
      │     ├─→ "What amenities are available?"
      │     ├─→ "Is parking included?"
      │     ├─→ "What's the cancellation policy?"
      │     └─→ "How far is it from downtown?"
      │
      ├─→ AI Processes Question
      │     ├─→ Analyzes Property Data
      │     ├─→ Checks Response Templates
      │     └─→ Generates Answer
      │
      └─→ Receive Instant Response

   [HOST] → Chatbot Management
      │
      ├─→ Configure Chatbot
      ├─→ Add Response Templates
      ├─→ Update FAQ
      └─→ View Analytics

   [ADMIN] → Global Chatbot Management
      │
      ├─→ Platform-wide Settings
      ├─→ Training Data
      ├─→ Analytics Dashboard
      └─→ Monitor All Conversations

2. AI RECOMMENDATIONS
   │
   [GUEST] → Recommendations Page
      │
      ├─→ AI Analyzes:
      │     ├─→ Browsing History
      │     ├─→ Search Patterns
      │     ├─→ Booking History
      │     ├─→ Preferences
      │     └─→ Similar User Behavior
      │
      ├─→ Generates Personalized Suggestions
      │     ├─→ "Based on your searches"
      │     ├─→ "Similar to properties you liked"
      │     └─→ "Popular in your area"
      │
      └─→ Display Recommended Units

3. AI PRICING RECOMMENDATIONS
   │
   [HOST] → Pricing Recommendations
      │
      ├─→ AI Analyzes:
      │     ├─→ Market Trends
      │     ├─→ Seasonal Demand
      │     ├─→ Competitor Pricing
      │     ├─→ Property Features
      │     └─→ Historical Data
      │
      ├─→ Generates Pricing Suggestions
      │     ├─→ Optimal Base Price
      │     ├─→ Seasonal Adjustments
      │     └─→ Dynamic Pricing
      │
      └─→ Apply or Customize

```

---

## 9. PAYMENT PROCESSING FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                   PAYMENT PROCESSING                             │
└─────────────────────────────────────────────────────────────────┘

[GUEST] Create Booking
   │
   ├─→ Review Booking Summary
   │     ├─→ Unit Details
   │     ├─→ Dates
   │     ├─→ Price Breakdown
   │     │     ├─→ Base Price
   │     │     ├─→ Cleaning Fee
   │     │     ├─→ Service Fee
   │     │     └─→ Total Amount
   │     │
   │     └─→ Proceed to Payment
   │
   ├─→ Payment Page
   │     ├─→ Enter Payment Details
   │     │     ├─→ Card Number
   │     │     ├─→ Expiry Date
   │     │     ├─→ CVV
   │     │     └─→ Billing Address
   │     │
   │     └─→ Submit Payment
   │
   ├─→ Payment Processing
   │     ├─→ Validate Card Details
   │     ├─→ Check Fraud Detection
   │     ├─→ Process Transaction
   │     │     ├─→ Success ✓
   │     │     └─→ Failed ✗
   │     │
   │     └─→ Update Payment Status
   │
   ├─→ Payment Success
   │     ├─→ Create Booking Record
   │     ├─→ Send Confirmation Email
   │     ├─→ Notify Host
   │     └─→ Update Unit Availability
   │
   └─→ Payment Failed
         ├─→ Show Error Message
         ├─→ Retry Payment Option
         └─→ Contact Support

[HOST] View Payment
   │
   ├─→ Financial Dashboard
   │     ├─→ Pending Payments
   │     ├─→ Completed Payments
   │     └─→ Payment History
   │
   └─→ Payout Management
         ├─→ View Earnings
         ├─→ Request Payout
         └─→ Payout History

[ADMIN] Monitor Payments
   │
   ├─→ Financial Management
   │     ├─→ All Transactions
   │     ├─→ Payment Analytics
   │     ├─→ Refund Management
   │     └─→ Commission Tracking
   │
   └─→ Fraud Detection
         ├─→ Suspicious Transactions
         ├─→ Failed Payments
         └─→ Security Alerts

```

---

## 10. VERIFICATION PROCESS FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                  HOST VERIFICATION PROCESS                       │
└─────────────────────────────────────────────────────────────────┘

[HOST] Register Account
   │
   ├─→ Login to Dashboard
   │
   ├─→ Verification Status: "Not Verified" ⚠️
   │
   ├─→ Navigate to Verification Page
   │
   ├─→ Submit Verification Documents
   │     ├─→ Upload Government ID
   │     │     ├─→ Driver's License
   │     │     ├─→ Passport
   │     │     └─→ National ID
   │     │
   │     ├─→ Upload Proof of Ownership
   │     │     ├─→ Property Title
   │     │     ├─→ Lease Agreement
   │     │     └─→ Authorization Letter
   │     │
   │     └─→ Upload Business Permits (Optional)
   │           ├─→ Business License
   │           ├─→ Tax Registration
   │           └─→ Tourism Permit
   │
   ├─→ Submit for Review
   │     └─→ Status: "Pending Review" ⏳
   │
   ├─→ Wait for Admin Review
   │
   └─→ Verification Result
         │
         ├─→ APPROVED ✓
         │     ├─→ Status: "Verified"
         │     ├─→ Receive Notification
         │     ├─→ Full Platform Access
         │     └─→ Can List Properties
         │
         └─→ REJECTED ✗
               ├─→ Status: "Rejected"
               ├─→ Receive Rejection Reason
               ├─→ Fix Issues
               └─→ Resubmit Documents

[ADMIN] Review Verification
   │
   ├─→ Verifications Page
   │
   ├─→ View Pending Requests
   │
   ├─→ Select Host to Review
   │
   ├─→ Review Documents
   │     ├─→ Check ID Validity
   │     ├─→ Verify Ownership
   │     └─→ Validate Permits
   │
   ├─→ Make Decision
   │     │
   │     ├─→ APPROVE
   │     │     ├─→ Update Status
   │     │     ├─→ Send Approval Email
   │     │     └─→ Grant Full Access
   │     │
   │     └─→ REJECT
   │           ├─→ Enter Rejection Reason
   │           ├─→ Update Status
   │           └─→ Send Rejection Email
   │
   └─→ Log Activity

```

---

## 11. REVIEW & RATING FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                   REVIEW & RATING SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

[GUEST] Complete Stay
   │
   ├─→ Check-out Completed
   │
   ├─→ Receive Review Prompt
   │
   ├─→ Navigate to Review Page
   │
   ├─→ Write Review
   │     ├─→ Overall Rating (1-5 stars)
   │     ├─→ Cleanliness Rating
   │     ├─→ Accuracy Rating
   │     ├─→ Communication Rating
   │     ├─→ Location Rating
   │     ├─→ Value Rating
   │     └─→ Written Review (Optional)
   │
   ├─→ Submit Review
   │     └─→ Review Published
   │
   └─→ Host Receives Notification

[HOST] Receive Review
   │
   ├─→ View Review
   │     ├─→ Read Guest Feedback
   │     └─→ View Ratings
   │
   ├─→ Respond to Review (Optional)
   │     ├─→ Thank Guest
   │     ├─→ Address Concerns
   │     └─→ Submit Response
   │
   └─→ Review Analytics
         ├─→ Average Rating
         ├─→ Rating Trends
         └─→ Improvement Areas

[ADMIN] Moderate Reviews
   │
   ├─→ View All Reviews
   │
   ├─→ Filter Reviews
   │     ├─→ By Rating
   │     ├─→ By Date
   │     └─→ Flagged Reviews
   │
   ├─→ Review Moderation
   │     ├─→ Approve Review
   │     ├─→ Flag Inappropriate Content
   │     └─→ Delete Review (if necessary)
   │
   └─→ Review Analytics
         ├─→ Platform Average Rating
         ├─→ Review Trends
         └─→ Quality Metrics

PUBLIC VIEW
   │
   └─→ Unit Details Page
         ├─→ View All Reviews
         ├─→ Average Rating Display
         ├─→ Rating Breakdown
         └─→ Sort/Filter Reviews

```

---

## 12. SECURITY & FRAUD DETECTION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              SECURITY & FRAUD DETECTION SYSTEM                   │
└─────────────────────────────────────────────────────────────────┘

CONTINUOUS MONITORING
   │
   ├─→ User Activity Tracking
   │     ├─→ Login Attempts
   │     ├─→ Failed Logins
   │     ├─→ IP Address Monitoring
   │     ├─→ Session Management
   │     └─→ User Behavior Patterns
   │
   ├─→ Booking Pattern Analysis
   │     ├─→ Unusual Booking Frequency
   │     ├─→ Multiple Bookings Same Time
   │     ├─→ Rapid Cancellations
   │     └─→ Suspicious Guest Behavior
   │
   ├─→ Payment Monitoring
   │     ├─→ Failed Payment Attempts
   │     ├─→ Multiple Cards Same User
   │     ├─→ High-Value Transactions
   │     └─→ Chargeback Patterns
   │
   └─→ Content Moderation
         ├─→ Review Content Analysis
         ├─→ Message Monitoring
         └─→ Inappropriate Content Detection

FRAUD DETECTION TRIGGERS
   │
   ├─→ Multiple Failed Login Attempts
   │     ├─→ Lock Account Temporarily
   │     ├─→ Send Security Alert
   │     └─→ Require Password Reset
   │
   ├─→ Suspicious Booking Pattern
   │     ├─→ Flag for Review
   │     ├─→ Notify Admin
   │     └─→ Require Additional Verification
   │
   ├─→ Payment Anomaly Detected
   │     ├─→ Hold Transaction
   │     ├─→ Request Verification
   │     └─→ Admin Review Required
   │
   └─→ Inappropriate Content
         ├─→ Auto-Flag Content
         ├─→ Notify Moderators
         └─→ Temporary Suspension

[ADMIN] Security Dashboard
   │
   ├─→ View Security Alerts
   │     ├─→ High Priority
   │     ├─→ Medium Priority
   │     └─→ Low Priority
   │
   ├─→ Investigate Alert
   │     ├─→ View User Activity
   │     ├─→ Check Transaction History
   │     ├─→ Review Patterns
   │     └─→ Analyze Risk Level
   │
   ├─→ Take Action
   │     ├─→ Approve Activity
   │     ├─→ Suspend Account
   │     ├─→ Block IP Address
   │     ├─→ Refund Transaction
   │     └─→ Contact User
   │
   └─→ Security Reports
         ├─→ Fraud Statistics
         ├─→ Security Incidents
         └─→ Prevention Metrics

```

---

## 13. NOTIFICATION SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                   NOTIFICATION SYSTEM                            │
└─────────────────────────────────────────────────────────────────┘

NOTIFICATION TYPES
   │
   ├─→ [GUEST NOTIFICATIONS]
   │     ├─→ Booking Confirmed
   │     ├─→ Payment Successful
   │     ├─→ Check-in Reminder
   │     ├─→ Check-out Reminder
   │     ├─→ New Message from Host
   │     ├─→ Review Request
   │     ├─→ Booking Cancelled
   │     └─→ Special Offers
   │
   ├─→ [HOST NOTIFICATIONS]
   │     ├─→ New Booking Request
   │     ├─→ Payment Received
   │     ├─→ Guest Check-in
   │     ├─→ Guest Check-out
   │     ├─→ New Message from Guest
   │     ├─→ New Review Received
   │     ├─→ Verification Status Update
   │     ├─→ Payout Processed
   │     └─→ Unit Performance Report
   │
   └─→ [ADMIN NOTIFICATIONS]
         ├─→ New User Registration
         ├─→ Verification Request
         ├─→ Security Alert
         ├─→ Fraud Detection
         ├─→ System Error
         ├─→ High-Value Transaction
         ├─→ User Report/Complaint
         └─→ Platform Milestone

NOTIFICATION CHANNELS
   │
   ├─→ In-App Notifications
   │     ├─→ Notification Bell Icon
   │     ├─→ Unread Count Badge
   │     ├─→ Notification List
   │     └─→ Mark as Read
   │
   ├─→ Email Notifications
   │     ├─→ Immediate Alerts
   │     ├─→ Daily Digest
   │     └─→ Weekly Summary
   │
   └─→ SMS Notifications (Optional)
         ├─→ Critical Alerts
         └─→ Booking Confirmations

NOTIFICATION PREFERENCES
   │
   └─→ User Settings
         ├─→ Enable/Disable by Type
         ├─→ Choose Channels
         ├─→ Frequency Settings
         └─→ Quiet Hours

```

---

## 14. DATA EXPORT & REPORTING FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                DATA EXPORT & REPORTING                           │
└─────────────────────────────────────────────────────────────────┘

[HOST] Reports Page
   │
   ├─→ Select Report Type
   │     ├─→ Financial Report
   │     ├─→ Booking Report
   │     ├─→ Guest Report
   │     └─→ Performance Report
   │
   ├─→ Configure Report
   │     ├─→ Select Date Range
   │     ├─→ Choose Properties
   │     ├─→ Select Metrics
   │     └─→ Filter Options
   │
   ├─→ Generate Report
   │     ├─→ View Preview
   │     └─→ Visualizations
   │
   └─→ Export Report
         ├─→ PDF Format
         ├─→ CSV Format
         └─→ Excel Format

[ADMIN] Reports & Analytics
   │
   ├─→ Platform Reports
   │     ├─→ User Growth Report
   │     ├─→ Revenue Report
   │     ├─→ Booking Analytics
   │     ├─→ Performance Metrics
   │     └─→ Security Report
   │
   ├─→ Data Visualization
   │     ├─→ Charts & Graphs
   │     ├─→ Trend Analysis
   │     ├─→ Comparative Reports
   │     └─→ Dashboard Widgets
   │
   ├─→ Custom Reports
   │     ├─→ Query Builder
   │     ├─→ Custom Filters
   │     └─→ Scheduled Reports
   │
   └─→ Export Options
         ├─→ PDF Export
         ├─→ CSV Export
         ├─→ Excel Export
         └─→ API Export

```

---

## 15. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                   SYSTEM ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────┘

FRONTEND (React)
   │
   ├─→ Public Pages
   │     ├─→ Landing Page
   │     ├─→ Units Listing
   │     ├─→ Unit Details
   │     ├─→ FAQ
   │     └─→ Authentication
   │
   ├─→ Guest Dashboard
   │     └─→ 8 Main Features
   │
   ├─→ Host Dashboard
   │     └─→ 11 Main Features
   │
   └─→ Admin Dashboard
         └─→ 12 Main Features

BACKEND (Node.js + Express)
   │
   ├─→ Authentication & Authorization
   │     ├─→ JWT Token Management
   │     ├─→ Role-Based Access Control
   │     └─→ Session Management
   │
   ├─→ API Routes
   │     ├─→ /api/auth
   │     ├─→ /api/guest/*
   │     ├─→ /api/host/*
   │     ├─→ /api/admin/*
   │     ├─→ /api/messages
   │     └─→ /api/chatbot
   │
   ├─→ Business Logic
   │     ├─→ Booking Management
   │     ├─→ Payment Processing
   │     ├─→ User Management
   │     └─→ Analytics Engine
   │
   └─→ Data Layer
         ├─→ JSON File Storage
         ├─→ Data Validation
         └─→ Data Persistence

AI SERVICES
   │
   ├─→ Chatbot Engine
   ├─→ Recommendation System
   ├─→ Pricing Algorithm
   └─→ Fraud Detection

EXTERNAL INTEGRATIONS
   │
   ├─→ Payment Gateway
   ├─→ Email Service
   ├─→ SMS Service
   └─→ Map Service

```

---

## Summary

This comprehensive flowchart documentation covers:

1. **Guest User Flow** - Complete journey from browsing to booking and reviews
2. **Host User Flow** - Property management, financial tracking, and guest interactions
3. **Admin User Flow** - Platform management, monitoring, and security
4. **Cross-User Interactions** - How different user types interact
5. **Booking Lifecycle** - End-to-end booking process
6. **Authentication & Authorization** - Security and access control
7. **Messaging System** - Communication between users
8. **AI Features** - Chatbot, recommendations, and pricing
9. **Payment Processing** - Transaction flow and management
10. **Verification Process** - Host verification workflow
11. **Review & Rating** - Feedback system
12. **Security & Fraud Detection** - Platform security measures
13. **Notification System** - Alert and notification management
14. **Data Export & Reporting** - Analytics and reporting
15. **System Architecture** - Technical overview

All user types have clear, defined paths through the platform with appropriate access controls and feature sets.
