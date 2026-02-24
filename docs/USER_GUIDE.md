# Smart Stay - User Guide

Welcome to Smart Stay, a comprehensive property management system for short-term rentals. This guide will help you navigate the platform based on your role.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Guest Guide](#guest-guide)
3. [Host Guide](#host-guide)
4. [Admin Guide](#admin-guide)
5. [Common Features](#common-features)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Creating an Account

1. Visit the homepage at `http://localhost:3000`
2. Click "Book as Guest" or "Become a Host" based on your needs
3. Fill in the registration form with your details
4. Choose your role (Guest or Host)
5. Click "Register" to create your account

### Logging In

**Demo Accounts** (All use password: `password123`):
- **Guest**: guest@example.com
- **Host**: host@example.com
- **Admin**: admin@example.com

**Login URLs**:
- Guest: `/guest/login`
- Host: `/host/login`
- Admin: `/admin/login`

---

## Guest Guide

### Browsing Units

1. From the homepage, click "Browse Units" or navigate to `/units`
2. Use filters to narrow down your search:
   - Price range
   - Property type (Apartment, House, Villa, etc.)
   - Number of guests
   - Location
3. Click on any unit to view detailed information

### Making a Booking

1. On the unit details page, click "Book Now"
2. Select your check-in and check-out dates using the calendar
   - Red dates are unavailable
   - Blue dates are your selection
3. Enter the number of guests
4. Review the price breakdown
5. Click "Continue to Payment"

### Payment Process

1. Review your booking details
2. A QR code will be displayed for payment
3. Scan the QR code with your payment app
4. After payment, click "Confirm Payment"
5. Your booking status will update to "Confirmed"

### Managing Bookings

**View All Bookings**:
- Navigate to Dashboard → "My Bookings"
- See upcoming, active, and past bookings

**Booking Details**:
- Click on any booking to view full details
- See check-in/out dates, payment status, and unit information

**Cancel Booking**:
- Open booking details
- Click "Cancel Booking" (only available for pending/confirmed bookings)
- Confirm cancellation

### Check-out Process

1. Navigate to your active booking
2. Click "Upload Check-out Photos"
3. Take photos of the unit before leaving
4. Upload photos (max 5 images)
5. Submit for host review

### Writing Reviews

1. After check-out, navigate to completed bookings
2. Click "Write Review"
3. Rate your experience (1-5 stars)
4. Write your review comments
5. Optionally upload photos
6. Submit review

### Profile Management

1. Go to Dashboard → "Profile"
2. Update your personal information
3. Change password if needed
4. Save changes

---

## Host Guide

### Dashboard Overview

Your dashboard shows:
- Total revenue and bookings
- Occupancy rate
- Recent bookings
- Quick action buttons

### Managing Units

**Add New Unit**:
1. Navigate to "Units" → "Add New Unit"
2. Fill in unit details:
   - Name and description
   - Location
   - Property type
   - Bedrooms and bathrooms
   - Maximum guests
   - Price per night
   - Security deposit
3. Add amenities (WiFi, Pool, Parking, etc.)
4. Upload photos (up to 5 images)
5. Click "Create Unit"

**Edit Unit**:
1. Go to "Units"
2. Click "Edit" on any unit
3. Update information
4. Save changes

**Delete Unit**:
1. Go to "Units"
2. Click "Delete" on the unit
3. Confirm deletion

### Managing Bookings

**View Bookings**:
- Navigate to "Bookings"
- See all bookings for your units
- Filter by status (Pending, Confirmed, Completed, Cancelled)

**Approve/Reject Bookings**:
1. Click on a pending booking
2. Review guest details
3. Click "Approve" or "Reject"
4. Booking status updates automatically

### Analytics

View detailed analytics:
- **Guest Analytics**: Total guests, new vs returning, monthly trends
- **Booking Trends**: Bookings over time, occupancy rates
- **Revenue**: Income breakdown, monthly comparisons

### Financial Reports

1. Navigate to "Financial"
2. View:
   - Total revenue (Kinita)
   - Total expenses (Gastos)
   - Net profit
   - Security deposits tracking
3. Export data as CSV or JSON

### Guest Communication

1. Go to "Guests"
2. View all guests who have booked your units
3. Click on a guest to:
   - View booking history
   - Send messages
   - See contact information

### Chatbot Management

1. Navigate to "Chatbot"
2. View pre-trained responses
3. Edit responses to common questions
4. See guest-chatbot interactions
5. Review AI suggestions for improvements

---

## Admin Guide

### System Dashboard

Monitor system-wide metrics:
- Total users (Guests, Hosts, Admins)
- All bookings across the platform
- Total revenue
- System health indicators
- Suspicious activity alerts

### User Management

**View Users**:
1. Navigate to "Users"
2. See all registered users
3. Filter by role or status

**Create User**:
1. Click "Add User"
2. Fill in user details
3. Assign role
4. Save

**Edit User**:
1. Click "Edit" on any user
2. Update information
3. Change role if needed
4. Activate/Deactivate account

**View Activity Logs**:
- Click on a user to see their activity history
- Monitor login attempts and actions

### Financial Overview

1. Navigate to "Financial"
2. View system-wide financial data:
   - Total revenue across all hosts
   - Transaction audit trail
   - Security deposit tracking
3. Export reports

### Reports & Logs

**Generate Reports**:
1. Go to "Reports"
2. Select report type:
   - Daily
   - Monthly
   - Yearly
3. Choose date range
4. Click "Generate Report"
5. Export as needed

**Activity Logs**:
- View all user actions
- Filter by user, action type, or date
- Identify suspicious activities

### System Management

1. Navigate to "System"
2. View system statistics:
   - Database performance
   - API response times
   - Storage usage
3. Manage settings:
   - Email configuration
   - Payment settings
   - Security settings
4. Backup/Restore data

---

## Common Features

### AI Chatbot

The chatbot is available on all pages (bottom-right corner):

**Features**:
- Answer FAQs
- Check unit availability
- Provide booking guidance
- Explain payment process
- Share check-in instructions

**How to Use**:
1. Click the chat icon
2. Type your question
3. Get instant responses
4. Continue conversation as needed

### Search & Filters

**Unit Search**:
- Use the search bar to find units by name or location
- Apply filters for price, type, and amenities
- Sort by price, rating, or date

**Table Filtering**:
- Most data tables support column filtering
- Click the filter icon in column headers
- Enter search terms
- Results update automatically

### Data Export

Export data from various sections:
- Financial reports (CSV, JSON)
- Booking lists
- User lists
- Analytics data

**How to Export**:
1. Navigate to the relevant page
2. Click "Export" button
3. Choose format (CSV or JSON)
4. File downloads automatically

### Notifications

Toast notifications appear for:
- Successful actions (green)
- Errors (red)
- Warnings (yellow)
- Information (blue)

---

## Troubleshooting

### Login Issues

**Problem**: Can't log in
**Solutions**:
- Verify you're using the correct login page for your role
- Check email and password are correct
- Clear browser cache and cookies
- Try password reset (if implemented)

### Booking Issues

**Problem**: Can't select dates
**Solutions**:
- Dates in the past are disabled
- Red dates are already booked
- Ensure check-out is after check-in

**Problem**: Booking creation fails
**Solutions**:
- Check all required fields are filled
- Verify guest count doesn't exceed maximum
- Ensure dates don't conflict with existing bookings

### Payment Issues

**Problem**: Payment not confirming
**Solutions**:
- Ensure you clicked "Confirm Payment" after scanning QR
- Refresh the page
- Contact support if issue persists

### Image Upload Issues

**Problem**: Can't upload images
**Solutions**:
- Check file size (max 5MB per image)
- Supported formats: JPG, PNG, GIF
- Maximum 5 images per upload
- Images are automatically compressed

### Performance Issues

**Problem**: Slow loading
**Solutions**:
- Clear browser cache
- Check internet connection
- Try a different browser
- Disable browser extensions

### Data Not Showing

**Problem**: Missing data or empty tables
**Solutions**:
- Refresh the page
- Check filters aren't too restrictive
- Verify you have the correct permissions
- Check if data exists in the system

---

## Keyboard Shortcuts

- `Esc` - Close modals and dialogs
- `Enter` - Submit forms (when focused on input)
- `Tab` - Navigate between form fields

---

## Best Practices

### For Guests
- Book early for better availability
- Read unit descriptions carefully
- Upload clear check-out photos
- Leave honest reviews

### For Hosts
- Keep unit information up-to-date
- Respond to bookings promptly
- Upload high-quality photos
- Maintain competitive pricing
- Monitor chatbot interactions

### For Admins
- Regularly review activity logs
- Monitor system health
- Generate periodic reports
- Keep user data secure
- Backup data regularly

---

## Support

For additional help:
- Use the AI Chatbot for instant answers
- Check the API Documentation for technical details
- Review the README.md for setup instructions

---

## Security Tips

1. Never share your password
2. Log out when using shared computers
3. Use strong, unique passwords
4. Monitor your account activity
5. Report suspicious behavior to admins

---

**Last Updated**: February 2026
**Version**: 1.0.0
