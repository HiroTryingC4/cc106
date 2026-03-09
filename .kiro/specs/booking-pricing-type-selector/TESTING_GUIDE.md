# Booking Pricing Type Selector - Testing Guide

This document provides comprehensive manual testing procedures for the booking pricing type selector feature.

---

## Test Environment Setup

### Prerequisites
1. Application running on `http://localhost:3000` (frontend)
2. Backend API running on `http://localhost:5000`
3. Test accounts available:
   - Guest: `guest@example.com` / `password123`
   - Host: `host@example.com` / `password123`

### Test Data Requirements
- At least one unit with hourly pricing configured
- At least one unit without hourly pricing (standard only)
- Existing bookings in the system (for backward compatibility testing)

---

## Test Cases

### Test Suite 1: Standard Pricing Flow (Regression Testing)

**Objective**: Ensure existing standard per-night booking functionality works as before.

#### Test Case 1.1: Standard Pricing Selection
**Steps**:
1. Log in as guest
2. Navigate to any unit details page
3. Click "Book Now"
4. Verify "Standard Per Night" option is displayed
5. Verify "Standard Per Night" is selected by default
6. Verify pricing shows "₱[price]/night"

**Expected Result**:
- ✅ Standard pricing option is visible
- ✅ Default selection is "Standard Per Night"
- ✅ Price displays correctly

#### Test Case 1.2: Standard Booking Creation
**Steps**:
1. Select "Standard Per Night" pricing
2. Choose check-in date (e.g., tomorrow)
3. Choose check-out date (e.g., 3 days later)
4. Enter number of guests (e.g., 2)
5. Review price breakdown in sidebar
6. Click "Review Booking"
7. Review confirmation modal
8. Click "Confirm & Proceed to Payment"

**Expected Result**:
- ✅ Calendar displays correctly
- ✅ Guest input field appears
- ✅ Price calculation is accurate (nights × pricePerNight + extra fees)
- ✅ Confirmation modal shows all details correctly
- ✅ Booking is created successfully
- ✅ Redirects to payment page

#### Test Case 1.3: Extra Guest Fee Calculation
**Steps**:
1. Select "Standard Per Night" pricing
2. Choose dates (2 nights)
3. Enter 4 guests (assuming base is 2, extra fee is ₱50)
4. Review price breakdown

**Expected Result**:
- ✅ Base capacity notice displays
- ✅ Extra guest fee calculated correctly: 2 extra guests × ₱50 × 2 nights = ₱200
- ✅ Total price includes extra guest fees
- ✅ Breakdown shows itemized fees

#### Test Case 1.4: Standard Pricing Validation
**Steps**:
1. Select "Standard Per Night" pricing
2. Try to submit without selecting dates
3. Try to submit with check-out before check-in
4. Try to submit with guests exceeding maxGuests

**Expected Result**:
- ✅ Error toast: "Please select check-in and check-out dates"
- ✅ Error toast: "Check-out date must be after check-in date"
- ✅ Error toast: "Maximum [X] guests allowed"
- ✅ Form submission is prevented

---

### Test Suite 2: Hourly Pricing - Fixed Time Options

**Objective**: Test hourly pricing with pre-set check-in/check-out times.

#### Test Case 2.1: Hourly Pricing Availability
**Steps**:
1. Navigate to a unit WITH hourly pricing
2. Click "Book Now"
3. Verify "Hourly Pricing" option is displayed
4. Click "Hourly Pricing" option

**Expected Result**:
- ✅ "Hourly Pricing" button is visible
- ✅ Shows number of available options (e.g., "2 options")
- ✅ Clicking switches to hourly pricing view

#### Test Case 2.2: Fixed-Time Option Display
**Steps**:
1. Select "Hourly Pricing"
2. Review the displayed pricing cards
3. Identify cards with "Fixed Time" badge

**Expected Result**:
- ✅ All hourly options display as cards
- ✅ Each card shows: hours, price, time type badge
- ✅ Fixed-time cards show "🕐 Fixed Time" badge
- ✅ Fixed-time cards display check-in and check-out times
- ✅ Cards are visually distinct and clickable

#### Test Case 2.3: Fixed-Time Option Selection
**Steps**:
1. Click on a fixed-time hourly option card
2. Verify card selection state
3. Review sidebar price breakdown
4. Click "Review Booking"
5. Review confirmation modal

**Expected Result**:
- ✅ Selected card has purple border and background
- ✅ Checkmark icon appears on selected card
- ✅ Sidebar shows selected option details
- ✅ Price breakdown shows hourly rate + security deposit
- ✅ Confirmation modal displays:
  - Duration (e.g., "6 Hours")
  - Time type: "Fixed Time"
  - Check-in time (e.g., "14:00")
  - Check-out time (e.g., "20:00")
  - Total price

#### Test Case 2.4: Fixed-Time Booking Creation
**Steps**:
1. Select a fixed-time hourly option
2. Click "Review Booking"
3. Verify all details in confirmation modal
4. Click "Confirm & Proceed to Payment"

**Expected Result**:
- ✅ Booking is created successfully
- ✅ Backend stores pricingType: "hourly"
- ✅ Backend stores hourlyOption with all fields
- ✅ Redirects to payment page
- ✅ Success toast appears

---

### Test Suite 3: Hourly Pricing - Flexible Time Options

**Objective**: Test hourly pricing where guests choose their own start time.

#### Test Case 3.1: Flexible-Time Option Display
**Steps**:
1. Select "Hourly Pricing"
2. Identify cards with "Flexible Time" badge

**Expected Result**:
- ✅ Flexible-time cards show "✨ Flexible Time" badge
- ✅ Cards do NOT show fixed check-in/check-out times
- ✅ Cards are clickable

#### Test Case 3.2: Flexible-Time Option Selection
**Steps**:
1. Click on a flexible-time hourly option card
2. Verify time picker appears

**Expected Result**:
- ✅ Card is selected (purple border/background)
- ✅ Time picker input appears within the card
- ✅ Time picker is labeled "Select Your Start Time: *"
- ✅ Time picker is required (red border if empty)

#### Test Case 3.3: Start Time Selection
**Steps**:
1. Select a flexible-time option
2. Click on the time picker
3. Select a start time (e.g., 10:00)
4. Verify end time calculation

**Expected Result**:
- ✅ Time picker opens correctly
- ✅ Selected time displays in input
- ✅ End time is calculated and displayed (e.g., "Your booking will end at: 16:00")
- ✅ Sidebar shows start and end times
- ✅ Price breakdown updates

#### Test Case 3.4: Flexible-Time Booking Creation
**Steps**:
1. Select a flexible-time option
2. Choose start time (e.g., 10:00)
3. Click "Review Booking"
4. Verify confirmation modal shows:
   - "Flexible Time" badge
   - Start time: 10:00
   - End time: (calculated based on hours)
5. Click "Confirm & Proceed to Payment"

**Expected Result**:
- ✅ Confirmation modal displays all details correctly
- ✅ Booking is created successfully
- ✅ Backend stores startTime field
- ✅ Backend stores calculated checkInTime and checkOutTime
- ✅ Redirects to payment page

#### Test Case 3.5: Flexible-Time Validation
**Steps**:
1. Select a flexible-time option
2. Do NOT select a start time
3. Click "Review Booking"

**Expected Result**:
- ✅ Error toast: "Please select a start time for your booking"
- ✅ Time picker highlights in red
- ✅ Form submission is prevented

---

### Test Suite 4: Validation and Error Handling

**Objective**: Ensure all validation rules work correctly.

#### Test Case 4.1: No Hourly Option Selected
**Steps**:
1. Select "Hourly Pricing"
2. Do NOT click any pricing card
3. Click "Review Booking"

**Expected Result**:
- ✅ Error toast: "Please select an hourly pricing option"
- ✅ Form submission is prevented
- ✅ User remains on booking page

#### Test Case 4.2: Switching Between Pricing Types
**Steps**:
1. Select "Standard Per Night"
2. Choose dates and guests
3. Switch to "Hourly Pricing"
4. Select an hourly option
5. Switch back to "Standard Per Night"

**Expected Result**:
- ✅ UI updates immediately when switching
- ✅ Previous selections are preserved (if applicable)
- ✅ No console errors
- ✅ Price calculations update correctly

#### Test Case 4.3: Backend Validation - Invalid Hourly Option
**Steps**:
1. Use browser dev tools or API client
2. Send POST request to `/api/guest/bookings` with:
   - pricingType: "hourly"
   - hourlyOption with hours/price that don't exist in unit

**Expected Result**:
- ✅ Backend returns 400 error
- ✅ Error message: "Invalid hourly pricing option"
- ✅ Booking is NOT created

#### Test Case 4.4: Backend Validation - Price Mismatch
**Steps**:
1. Use API client to send booking request
2. Set totalPrice to incorrect value (e.g., different from hourlyOption.price + deposit)

**Expected Result**:
- ✅ Backend returns 400 error
- ✅ Error message: "Price calculation mismatch"
- ✅ Booking is NOT created

---

### Test Suite 5: Backward Compatibility

**Objective**: Ensure existing bookings and units without hourly pricing continue to work.

#### Test Case 5.1: Unit Without Hourly Pricing
**Steps**:
1. Navigate to a unit WITHOUT hourlyPricing field
2. Click "Book Now"

**Expected Result**:
- ✅ Only "Standard Per Night" option is displayed
- ✅ "Hourly Pricing" button is NOT displayed
- ✅ Informational message appears: "This unit only offers standard per-night pricing at this time."
- ✅ Standard booking flow works normally

#### Test Case 5.2: Unit With Empty Hourly Pricing Array
**Steps**:
1. Navigate to a unit with `hourlyPricing: []`
2. Click "Book Now"

**Expected Result**:
- ✅ Same behavior as Test Case 5.1
- ✅ Only standard pricing is available
- ✅ No errors in console

#### Test Case 5.3: Display Existing Bookings
**Steps**:
1. Log in as guest
2. Navigate to "My Bookings"
3. View bookings list

**Expected Result**:
- ✅ Old bookings (without pricingType) display correctly
- ✅ Old bookings show standard pricing details
- ✅ New bookings with pricingType display correctly
- ✅ Hourly bookings show hourly details
- ✅ No errors or missing data

#### Test Case 5.4: View Old Booking Details
**Steps**:
1. Click on an old booking (created before pricing type feature)
2. Review booking details page

**Expected Result**:
- ✅ Booking details display correctly
- ✅ Defaults to standard pricing display
- ✅ All existing fields (checkIn, checkOut, guests) are shown
- ✅ No errors or undefined values

#### Test Case 5.5: Backend Handles Missing pricingType
**Steps**:
1. Use API to GET `/api/guest/bookings`
2. Check response for old bookings

**Expected Result**:
- ✅ Backend adds default pricingType: "standard" to old bookings
- ✅ All bookings have pricingType field in response
- ✅ No null or undefined values

---

### Test Suite 6: Edge Cases

**Objective**: Test unusual scenarios and edge cases.

#### Test Case 6.1: Single Hour Option
**Steps**:
1. Navigate to unit with only 1 hourly pricing option
2. Select "Hourly Pricing"

**Expected Result**:
- ✅ Single option displays correctly
- ✅ Can be selected and booked
- ✅ No layout issues

#### Test Case 6.2: Many Hourly Options
**Steps**:
1. Navigate to unit with 5+ hourly pricing options
2. Select "Hourly Pricing"

**Expected Result**:
- ✅ All options display in grid layout
- ✅ Grid is responsive
- ✅ All cards are accessible and clickable
- ✅ No overflow issues

#### Test Case 6.3: Very Long Duration
**Steps**:
1. Select hourly option with 24 hours
2. Choose flexible start time
3. Verify end time calculation

**Expected Result**:
- ✅ End time calculated correctly (next day)
- ✅ Time displays properly (e.g., 10:00 start → 10:00 end next day)
- ✅ Booking can be created

#### Test Case 6.4: Midnight Times
**Steps**:
1. Select flexible hourly option
2. Choose start time of 00:00 (midnight)
3. Verify end time calculation

**Expected Result**:
- ✅ Midnight time is accepted
- ✅ End time calculated correctly
- ✅ No time parsing errors

#### Test Case 6.5: Same Start and End Time (24 hours)
**Steps**:
1. Select 24-hour flexible option
2. Choose start time 14:00
3. Verify end time is 14:00 (next day)

**Expected Result**:
- ✅ End time displays as 14:00
- ✅ Booking can be created
- ✅ Backend stores times correctly

---

### Test Suite 7: UI/UX Testing

**Objective**: Ensure good user experience and visual design.

#### Test Case 7.1: Pricing Type Selector Visual Design
**Steps**:
1. Navigate to booking page
2. Review pricing type selector appearance

**Expected Result**:
- ✅ Selector is prominently displayed at top of form
- ✅ Icons (🌙 and ⏰) are visible
- ✅ Selected option has distinct styling (blue/purple)
- ✅ Hover effects work on both options
- ✅ Text is readable and clear

#### Test Case 7.2: Hourly Pricing Cards Visual Design
**Steps**:
1. Select "Hourly Pricing"
2. Review pricing cards appearance

**Expected Result**:
- ✅ Cards are well-spaced in grid
- ✅ Selected card has clear visual distinction
- ✅ Badges (Fixed/Flexible) are color-coded and readable
- ✅ Time information is clearly formatted
- ✅ Hover effects work smoothly

#### Test Case 7.3: Confirmation Modal Display
**Steps**:
1. Create booking with hourly pricing
2. Review confirmation modal

**Expected Result**:
- ✅ Modal is centered and readable
- ✅ Pricing type badge is prominent
- ✅ All information is well-organized
- ✅ Price breakdown is clear
- ✅ Action buttons are accessible

#### Test Case 7.4: Mobile Responsiveness
**Steps**:
1. Open booking page on mobile device or resize browser to mobile width
2. Test all pricing type interactions

**Expected Result**:
- ✅ Pricing type selector stacks vertically on mobile
- ✅ Hourly pricing cards stack in single column
- ✅ Time picker is accessible on mobile
- ✅ Confirmation modal fits mobile screen
- ✅ All buttons are tappable

#### Test Case 7.5: Sidebar Price Breakdown
**Steps**:
1. Select different pricing types and options
2. Review sidebar updates

**Expected Result**:
- ✅ Sidebar updates immediately when selection changes
- ✅ Pricing type indicator shows current selection
- ✅ Hourly option details display when selected
- ✅ Price breakdown is accurate and clear
- ✅ Total price is prominent

---

## Test Results Summary

### Test Execution Checklist

- [ ] Test Suite 1: Standard Pricing Flow (6 test cases)
- [ ] Test Suite 2: Hourly Pricing - Fixed Time (4 test cases)
- [ ] Test Suite 3: Hourly Pricing - Flexible Time (5 test cases)
- [ ] Test Suite 4: Validation and Error Handling (4 test cases)
- [ ] Test Suite 5: Backward Compatibility (5 test cases)
- [ ] Test Suite 6: Edge Cases (5 test cases)
- [ ] Test Suite 7: UI/UX Testing (5 test cases)

**Total Test Cases**: 34

---

## Known Issues

Document any issues found during testing:

1. [Issue description]
   - Severity: [Low/Medium/High/Critical]
   - Steps to reproduce:
   - Expected vs Actual:
   - Status: [Open/Fixed/Won't Fix]

---

## Browser Compatibility

Test on the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Performance Testing

- [ ] Page load time is acceptable (<2 seconds)
- [ ] Price calculations are instant
- [ ] No lag when switching pricing types
- [ ] Modal opens/closes smoothly
- [ ] No memory leaks during extended use

---

## Accessibility Testing

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Form labels are properly associated
- [ ] Error messages are announced
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader compatibility (basic check)

---

## Security Testing

- [ ] Backend validates all pricing calculations
- [ ] Cannot manipulate prices via frontend
- [ ] Authentication required for booking creation
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention in user inputs

---

## Test Data Cleanup

After testing, ensure:
- [ ] Test bookings are identified or removed
- [ ] Test data doesn't interfere with production
- [ ] Database is in consistent state

---

**Testing Completed By**: _________________
**Date**: _________________
**Version Tested**: _________________
**Overall Status**: [ ] Pass [ ] Fail [ ] Pass with Issues

