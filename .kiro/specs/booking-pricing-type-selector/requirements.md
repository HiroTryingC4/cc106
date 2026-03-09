# Requirements Document

## Introduction

This feature adds a pricing type selector to the guest booking page, allowing guests to choose between standard per-night pricing and hourly pricing options when creating a booking. Currently, the CreateBooking page only supports standard per-night pricing with calendar date selection. This enhancement will enable guests to select from available hourly pricing options that hosts have configured for their units.

## Glossary

- **Booking_System**: The SmartStay booking management system that handles guest reservations
- **Pricing_Selector**: The UI component that allows guests to choose between pricing types
- **Standard_Pricing**: Per-night pricing model where guests pay a nightly rate
- **Hourly_Pricing**: Time-based pricing model where guests pay for specific hour durations
- **Fixed_Time_Option**: An hourly pricing option with predetermined check-in and check-out times
- **Flexible_Time_Option**: An hourly pricing option where guests can choose their own start time
- **Pricing_Card**: A selectable UI element displaying details of an hourly pricing option
- **Booking_Form**: The form interface where guests enter booking details
- **Confirmation_Modal**: The dialog that displays booking summary before final submission
- **Backend_API**: The server-side booking endpoint that processes booking requests

## Requirements

### Requirement 1: Pricing Type Selection

**User Story:** As a guest, I want to choose between standard per-night pricing and hourly pricing options, so that I can book a unit according to my preferred stay duration.

#### Acceptance Criteria

1. WHEN the Booking_Form loads, THE Pricing_Selector SHALL display at the top of the form
2. THE Pricing_Selector SHALL offer exactly two options: "Standard Per Night" and "Hourly Pricing"
3. THE Pricing_Selector SHALL default to "Standard Per Night" selection
4. WHEN a guest selects a pricing type, THE Booking_Form SHALL update to show the appropriate input fields for that pricing type
5. THE Pricing_Selector SHALL remain visible and accessible throughout the booking process

### Requirement 2: Standard Per Night Pricing Display

**User Story:** As a guest, I want to see the familiar calendar-based booking interface when I select standard pricing, so that I can book multiple nights as I currently do.

#### Acceptance Criteria

1. WHEN "Standard Per Night" is selected, THE Booking_Form SHALL display the existing calendar date picker
2. WHEN "Standard Per Night" is selected, THE Booking_Form SHALL display the guest count input field
3. WHEN dates are selected, THE Booking_System SHALL calculate price as (number of nights × pricePerNight)
4. WHEN extra guests exceed base capacity, THE Booking_System SHALL add extra guest fees to the total price
5. THE Booking_Form SHALL display the price breakdown showing nightly rate, extra guest fees, and security deposit

### Requirement 3: Hourly Pricing Options Display

**User Story:** As a guest, I want to see all available hourly pricing options for a unit, so that I can choose the option that best fits my schedule and budget.

#### Acceptance Criteria

1. WHEN "Hourly Pricing" is selected, THE Booking_Form SHALL retrieve hourly pricing options from unit.hourlyPricing array
2. WHEN hourly pricing options exist, THE Booking_Form SHALL display each option as a Pricing_Card
3. THE Pricing_Card SHALL display the number of hours for the option
4. THE Pricing_Card SHALL display the price for the option
5. THE Pricing_Card SHALL display a badge indicating "Fixed Time" or "Flexible Time"
6. WHEN an hourly option has isFlexible set to false, THE Pricing_Card SHALL display the checkInTime and checkOutTime
7. WHEN an hourly option has isFlexible set to true, THE Pricing_Card SHALL display a time picker for the guest to select their start time
8. THE Pricing_Card SHALL be visually distinct when selected versus unselected
9. WHEN no hourly pricing options exist, THE Booking_Form SHALL display a message indicating hourly pricing is not available

### Requirement 4: Hourly Pricing Selection and Calculation

**User Story:** As a guest, I want to select one hourly pricing option and see the calculated price, so that I know the total cost before confirming my booking.

#### Acceptance Criteria

1. WHEN a guest clicks a Pricing_Card, THE Booking_System SHALL mark that option as selected
2. WHEN a guest selects a different Pricing_Card, THE Booking_System SHALL deselect the previous option
3. WHEN a flexible hourly option is selected, THE Booking_Form SHALL require the guest to choose a start time
4. WHEN an hourly option is selected, THE Booking_System SHALL calculate the total price as the option's price plus security deposit
5. THE Booking_Form SHALL display the price breakdown showing hourly rate, duration, and security deposit
6. WHEN a guest changes their selection, THE Booking_System SHALL recalculate the price immediately

### Requirement 5: Booking Confirmation Modal Updates

**User Story:** As a guest, I want to review my selected pricing type and details in the confirmation modal, so that I can verify my booking before proceeding to payment.

#### Acceptance Criteria

1. WHEN the confirmation modal displays, THE Confirmation_Modal SHALL show the selected pricing type
2. WHEN standard pricing is selected, THE Confirmation_Modal SHALL display check-in date, check-out date, number of nights, and guest count
3. WHEN hourly pricing is selected, THE Confirmation_Modal SHALL display the number of hours, total price, and time type
4. WHEN a fixed-time hourly option is selected, THE Confirmation_Modal SHALL display the check-in and check-out times
5. WHEN a flexible-time hourly option is selected, THE Confirmation_Modal SHALL display the guest-selected start time and calculated end time
6. THE Confirmation_Modal SHALL display the complete price breakdown for the selected pricing type

### Requirement 6: Booking Submission with Pricing Type

**User Story:** As a guest, I want my selected pricing type and details to be saved with my booking, so that the host and system know which pricing model I chose.

#### Acceptance Criteria

1. WHEN a guest confirms a booking, THE Booking_System SHALL include a pricingType field in the booking data
2. WHEN standard pricing is selected, THE Booking_System SHALL set pricingType to "standard"
3. WHEN hourly pricing is selected, THE Booking_System SHALL set pricingType to "hourly"
4. WHEN hourly pricing is selected, THE Booking_System SHALL include the selected hourly option details in the booking data
5. WHEN hourly pricing is selected with flexible time, THE Booking_System SHALL include the guest-selected start time in the booking data
6. THE Backend_API SHALL validate that the submitted pricing type matches available options for the unit
7. THE Backend_API SHALL store the booking with all pricing-related fields

### Requirement 7: Validation and Error Handling

**User Story:** As a guest, I want to receive clear error messages if my booking cannot be processed, so that I can correct any issues.

#### Acceptance Criteria

1. WHEN "Hourly Pricing" is selected and no option is chosen, THE Booking_System SHALL display an error message when the guest attempts to proceed
2. WHEN a flexible hourly option is selected without a start time, THE Booking_System SHALL display an error message
3. WHEN the Backend_API receives invalid pricing data, THE Backend_API SHALL return a descriptive error message
4. WHEN a unit has no hourly pricing options, THE Pricing_Selector SHALL disable or hide the "Hourly Pricing" option
5. IF the Backend_API detects a pricing calculation mismatch, THEN THE Backend_API SHALL reject the booking and return an error

### Requirement 8: Backward Compatibility

**User Story:** As a system administrator, I want existing bookings and units without hourly pricing to continue working, so that the new feature does not break existing functionality.

#### Acceptance Criteria

1. WHEN a unit has no hourlyPricing array, THE Booking_Form SHALL only display the "Standard Per Night" option
2. WHEN a unit has an empty hourlyPricing array, THE Booking_Form SHALL only display the "Standard Per Night" option
3. WHEN processing a booking without pricingType field, THE Backend_API SHALL treat it as standard pricing
4. THE Backend_API SHALL continue to accept bookings in the existing format for backward compatibility
5. WHEN displaying existing bookings without pricingType, THE Booking_System SHALL assume standard pricing
