# Tasks

## Task 1: Add Pricing Type Selector UI Component
**Status:** completed
**Requirements:** Requirement 1

### Description
Add a pricing type selector at the top of the CreateBooking form that allows guests to choose between "Standard Per Night" and "Hourly Pricing" options.

### Implementation Details
- Add state variable `pricingType` with default value 'standard'
- Create radio button or toggle UI component for pricing type selection
- Position selector at the top of the booking form, before date/time selection
- Style the selector to be visually prominent and accessible
- Ensure the selector remains visible throughout the booking process

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Pricing selector displays at the top of the form
- [x] Two options are available: "Standard Per Night" and "Hourly Pricing"
- [x] Default selection is "Standard Per Night"
- [x] Selecting an option updates the `pricingType` state
- [x] Selector remains visible during the entire booking process

---

## Task 2: Implement Conditional Rendering for Pricing Types
**Status:** completed
**Requirements:** Requirement 1, Requirement 2

### Description
Implement conditional rendering logic to show appropriate form fields based on the selected pricing type.

### Implementation Details
- Add conditional rendering based on `pricingType` state
- When 'standard' is selected, show existing calendar and guest count fields
- When 'hourly' is selected, show hourly pricing options (to be implemented in Task 3)
- Ensure smooth transitions between pricing type views
- Preserve form state when switching between types (if applicable)

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Calendar displays only when "Standard Per Night" is selected
- [x] Guest count input displays for standard pricing
- [x] Hourly pricing section displays only when "Hourly Pricing" is selected
- [x] Switching between types updates the UI immediately
- [x] No console errors when switching between pricing types

---

## Task 3: Create Hourly Pricing Options Display
**Status:** completed
**Requirements:** Requirement 3

### Description
Create UI to display all available hourly pricing options as selectable cards when hourly pricing is selected.

### Implementation Details
- Add state variable `selectedHourlyOption` to track selected option
- Map through `unit.hourlyPricing` array to create pricing cards
- Display hours, price, and time type badge for each option
- Show check-in/check-out times for fixed-time options (isFlexible === false)
- Show time picker for flexible options (isFlexible === true)
- Style selected vs unselected cards differently
- Handle case when no hourly pricing options exist

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] All hourly pricing options display as cards
- [x] Each card shows hours and price
- [x] Badge indicates "Fixed Time" or "Flexible Time"
- [x] Fixed-time options show check-in and check-out times
- [x] Flexible options show a time picker
- [x] Selected card has distinct visual styling
- [x] Message displays when no hourly options exist

---

## Task 4: Implement Hourly Pricing Selection Logic
**Status:** completed
**Requirements:** Requirement 4

### Description
Implement the logic for selecting hourly pricing options and handling flexible time selection.

### Implementation Details
- Add click handler for pricing cards to update `selectedHourlyOption`
- Add state variable `flexibleStartTime` for flexible time options
- Implement single-selection logic (deselect previous when new option selected)
- Add time picker component for flexible options
- Validate that start time is selected for flexible options
- Update selection state immediately on user interaction

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Clicking a card selects that hourly option
- [x] Only one option can be selected at a time
- [x] Previous selection is deselected when new option is chosen
- [x] Time picker appears for flexible options
- [x] Selected start time is stored in state
- [x] Selection updates immediately on click

---

## Task 5: Implement Price Calculation for Hourly Pricing
**Status:** completed
**Requirements:** Requirement 4

### Description
Update price calculation logic to handle both standard and hourly pricing types.

### Implementation Details
- Modify `calculatePrice()` function to check `pricingType`
- For standard pricing: keep existing calculation (nights × pricePerNight + extra guest fees)
- For hourly pricing: use selected option's price + security deposit
- Update price breakdown display to show appropriate details for each type
- Recalculate price when selection changes
- Handle edge cases (no selection, invalid data)

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Standard pricing calculates correctly (existing functionality preserved)
- [x] Hourly pricing uses selected option's price
- [x] Security deposit is added to hourly pricing total
- [x] Price breakdown shows correct details for each pricing type
- [x] Price updates immediately when selection changes
- [x] No calculation errors in console

---

## Task 6: Update Confirmation Modal for Pricing Types
**Status:** completed
**Requirements:** Requirement 5

### Description
Update the booking confirmation modal to display appropriate details based on the selected pricing type.

### Implementation Details
- Add pricing type indicator to confirmation modal
- For standard pricing: show existing details (dates, nights, guests)
- For hourly pricing: show hours, price, time type, and times
- Display check-in/check-out times for fixed-time hourly options
- Display start time and calculated end time for flexible hourly options
- Update price breakdown section to match pricing type
- Ensure all information is clearly formatted and readable

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Modal shows selected pricing type
- [x] Standard pricing displays dates, nights, and guest count
- [x] Hourly pricing displays hours, price, and time type
- [x] Fixed-time hourly shows check-in and check-out times
- [x] Flexible hourly shows selected start time and calculated end time
- [x] Price breakdown matches the selected pricing type
- [x] All information is clearly formatted

---

## Task 7: Update Booking Submission with Pricing Type Data
**Status:** completed
**Requirements:** Requirement 6

### Description
Update the booking submission logic to include pricing type and related data when creating a booking.

### Implementation Details
- Add `pricingType` field to booking submission payload
- For standard pricing: include existing fields (checkIn, checkOut, guests)
- For hourly pricing: include selected option details (hours, price, isFlexible)
- Include `flexibleStartTime` for flexible hourly options
- Include check-in/check-out times for fixed hourly options
- Ensure all required fields are included before submission
- Handle submission for both pricing types

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Booking payload includes `pricingType` field
- [x] Standard bookings include checkIn, checkOut, guests
- [x] Hourly bookings include selected option details
- [x] Flexible hourly bookings include start time
- [x] Fixed hourly bookings include check-in/check-out times
- [x] Submission works for both pricing types
- [x] No missing required fields

---

## Task 8: Add Frontend Validation for Hourly Pricing
**Status:** completed
**Requirements:** Requirement 7

### Description
Add validation logic to ensure guests provide all required information before submitting hourly pricing bookings.

### Implementation Details
- Validate that an hourly option is selected when hourly pricing is chosen
- Validate that start time is provided for flexible options
- Display clear error messages using toast notifications
- Prevent form submission when validation fails
- Add visual indicators for required fields
- Ensure validation runs before showing confirmation modal

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Error displays when no hourly option is selected
- [x] Error displays when flexible option lacks start time
- [x] Error messages are clear and actionable
- [x] Form submission is prevented when validation fails
- [x] Required fields have visual indicators
- [x] Validation runs before confirmation modal appears

---

## Task 9: Update Backend Booking Route for Pricing Types
**Status:** completed
**Requirements:** Requirement 6, Requirement 7

### Description
Update the backend booking creation endpoint to handle and validate both standard and hourly pricing types.

### Implementation Details
- Accept `pricingType` field in booking request body
- For hourly pricing, accept and store: hours, price, isFlexible, times
- Validate that pricing type matches available options for the unit
- Validate price calculation matches frontend calculation
- Store all pricing-related fields in booking data
- Return appropriate error messages for invalid data
- Maintain backward compatibility with existing bookings

### Files to Modify
- `backend/routes/guest/bookings.js`
- `backend/data/bookings.json` (data structure)

### Acceptance Criteria
- [x] Backend accepts `pricingType` field
- [x] Hourly pricing data is stored correctly
- [x] Validation checks pricing type against unit options
- [x] Price calculation is validated server-side
- [x] All pricing fields are stored in booking
- [x] Clear error messages for invalid data
- [x] Backward compatibility maintained

---

## Task 10: Implement Hourly Pricing Availability Logic
**Status:** completed
**Requirements:** Requirement 7, Requirement 8

### Description
Implement logic to show/hide hourly pricing option based on unit configuration and ensure backward compatibility.

### Implementation Details
- Check if `unit.hourlyPricing` exists and has items
- Disable or hide "Hourly Pricing" option if no hourly pricing configured
- Show only "Standard Per Night" for units without hourly pricing
- Handle units with empty `hourlyPricing` array
- Ensure existing units without hourly pricing continue to work
- Add helpful message when hourly pricing is unavailable

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Hourly pricing option hidden when unit has no hourly pricing
- [x] Hourly pricing option hidden when hourlyPricing array is empty
- [x] Only standard pricing shows for units without hourly pricing
- [x] Existing units continue to work normally
- [x] Helpful message displays when hourly pricing unavailable
- [x] No errors for units without hourlyPricing field

---

## Task 11: Add Backward Compatibility for Existing Bookings
**Status:** completed
**Requirements:** Requirement 8

### Description
Ensure existing bookings without pricing type information continue to work and display correctly.

### Implementation Details
- Update booking display logic to handle missing `pricingType` field
- Default to 'standard' pricing type when field is missing
- Ensure booking details pages work for old bookings
- Update booking list views to handle both formats
- Test with existing booking data
- Document the backward compatibility approach

### Files to Modify
- `frontend/src/pages/Guest/Bookings.js`
- `frontend/src/pages/Guest/BookingDetails.js`
- `frontend/src/pages/Host/Bookings.js`
- `backend/routes/guest/bookings.js`

### Acceptance Criteria
- [x] Existing bookings display correctly
- [x] Missing pricingType defaults to 'standard'
- [x] Booking details pages work for old bookings
- [x] Booking lists display both old and new formats
- [x] No errors when loading existing bookings
- [x] Backward compatibility is documented

---

## Task 12: Update Unit Summary Sidebar for Hourly Pricing
**Status:** completed
**Requirements:** Requirement 3, Requirement 4

### Description
Update the unit summary sidebar to display appropriate pricing information based on selected pricing type.

### Implementation Details
- Show standard pricing info when standard is selected
- Show selected hourly option details when hourly is selected
- Update price breakdown to match selected pricing type
- Display time information for hourly bookings
- Keep existing security deposit display
- Ensure responsive design for mobile devices

### Files to Modify
- `frontend/src/pages/Guest/CreateBooking.js`

### Acceptance Criteria
- [x] Sidebar shows standard pricing for standard bookings
- [x] Sidebar shows hourly option details for hourly bookings
- [x] Price breakdown matches selected pricing type
- [x] Time information displays for hourly bookings
- [x] Security deposit displays for both types
- [x] Sidebar is responsive on mobile devices

---

## Task 13: Add Testing and Documentation
**Status:** completed
**Requirements:** All Requirements

### Description
Test the complete pricing type selector feature and document the implementation.

### Implementation Details
- Test standard pricing flow (existing functionality)
- Test hourly pricing flow with fixed-time options
- Test hourly pricing flow with flexible-time options
- Test validation and error handling
- Test backward compatibility with existing bookings
- Test edge cases (no hourly pricing, empty arrays, etc.)
- Document the feature in user guide
- Update API documentation

### Files to Modify
- `docs/USER_GUIDE.md` (or create if needed)
- `docs/API_DOCUMENTATION.md`

### Acceptance Criteria
- [x] Standard pricing works as before
- [x] Fixed-time hourly pricing works correctly
- [x] Flexible-time hourly pricing works correctly
- [x] Validation prevents invalid submissions
- [x] Existing bookings display correctly
- [x] Edge cases are handled gracefully
- [x] Feature is documented for users
- [x] API changes are documented

### Documentation Created
- `.kiro/specs/booking-pricing-type-selector/FEATURE_COMPLETE.md`
- `.kiro/specs/booking-pricing-type-selector/TESTING_GUIDE.md`
- `.kiro/specs/booking-pricing-type-selector/BACKWARD_COMPATIBILITY.md`
- `backend/PRICING_TYPES_IMPLEMENTATION.md`
