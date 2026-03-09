# Design Document

## Overview

This document describes the technical design for adding a pricing type selector to the guest booking page. The feature enables guests to choose between standard per-night pricing and hourly pricing options when creating bookings. The design focuses on maintaining backward compatibility while extending the existing booking system to support multiple pricing models.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Guest Booking Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         CreateBooking Component (Frontend)          │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │      Pricing Type Selector                   │   │   │
│  │  │  ○ Standard Per Night  ○ Hourly Pricing     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                      │                               │   │
│  │         ┌────────────┴────────────┐                 │   │
│  │         │                         │                 │   │
│  │  ┌──────▼──────┐         ┌───────▼────────┐       │   │
│  │  │  Standard   │         │    Hourly      │       │   │
│  │  │  Pricing    │         │   Pricing      │       │   │
│  │  │   View      │         │    View        │       │   │
│  │  │             │         │                │       │   │
│  │  │ • Calendar  │         │ • Option Cards │       │   │
│  │  │ • Guests    │         │ • Time Picker  │       │   │
│  │  │ • Nights    │         │ • Hours/Price  │       │   │
│  │  └─────────────┘         └────────────────┘       │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │      Price Calculation Engine                │   │   │
│  │  │  • Standard: nights × price + extras         │   │   │
│  │  │  • Hourly: option.price + deposit            │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                      │                               │   │
│  │  ┌───────────────────▼──────────────────────────┐  │   │
│  │  │      Confirmation Modal                       │  │   │
│  │  │  • Pricing type details                       │  │   │
│  │  │  • Price breakdown                            │  │   │
│  │  │  • Time information                           │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │                      │                               │   │
│  └──────────────────────┼───────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Backend API (POST /api/guest/bookings)      │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │      Request Validation                      │   │   │
│  │  │  • Pricing type validation                   │   │   │
│  │  │  • Price calculation verification            │   │   │
│  │  │  • Required fields check                     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                      │                               │   │
│  │  ┌───────────────────▼──────────────────────────┐  │   │
│  │  │      Booking Storage                          │  │   │
│  │  │  • Store pricingType                          │  │   │
│  │  │  • Store hourly option details                │  │   │
│  │  │  • Maintain backward compatibility            │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### Unit Data Model (Extended)

```javascript
{
  id: string,
  name: string,
  pricePerNight: number,           // Standard pricing
  nightHours: string,               // Hours per night (e.g., "22")
  hourlyPricing: [                  // NEW: Hourly pricing options
    {
      hours: string,                // Duration in hours (e.g., "6", "12")
      price: string,                // Price for this duration
      isFlexible: boolean,          // true = guest picks time, false = fixed times
      checkInTime: string,          // For fixed-time options (e.g., "14:00")
      checkOutTime: string          // For fixed-time options (e.g., "20:00")
    }
  ],
  securityDeposit: number,
  extraGuestFee: number,
  maxGuests: number,
  // ... other existing fields
}
```

### Booking Data Model (Extended)

```javascript
{
  id: string,
  unitId: string,
  guestId: string,
  
  // NEW: Pricing type field
  pricingType: "standard" | "hourly",  // Defaults to "standard" for backward compatibility
  
  // Standard pricing fields (existing)
  checkIn: string,                     // ISO date string
  checkOut: string,                    // ISO date string
  guests: number,
  
  // NEW: Hourly pricing fields
  hourlyOption: {                      // Only present when pricingType === "hourly"
    hours: string,                     // Duration selected
    price: string,                     // Price for the duration
    isFlexible: boolean,               // Time type
    checkInTime: string,               // Fixed time or guest-selected time
    checkOutTime: string,              // Fixed time or calculated time
    startTime: string                  // For flexible options: guest-selected start time
  },
  
  totalPrice: number,
  status: string,
  // ... other existing fields
}
```

## Component Design

### CreateBooking Component State

```javascript
const [pricingType, setPricingType] = useState('standard');
const [selectedHourlyOption, setSelectedHourlyOption] = useState(null);
const [flexibleStartTime, setFlexibleStartTime] = useState('');

// Existing state
const [formData, setFormData] = useState({
  checkIn: '',
  checkOut: '',
  guests: 1
});
```

### Pricing Type Selector Component

```jsx
<div className="pricing-type-selector">
  <label className="text-lg font-semibold mb-3">Select Pricing Type</label>
  <div className="flex gap-4">
    <button
      className={`pricing-option ${pricingType === 'standard' ? 'selected' : ''}`}
      onClick={() => setPricingType('standard')}
    >
      <span className="icon">🌙</span>
      <span className="label">Standard Per Night</span>
      <span className="price">₱{unit.pricePerNight}/night</span>
    </button>
    
    {unit.hourlyPricing && unit.hourlyPricing.length > 0 && (
      <button
        className={`pricing-option ${pricingType === 'hourly' ? 'selected' : ''}`}
        onClick={() => setPricingType('hourly')}
      >
        <span className="icon">⏰</span>
        <span className="label">Hourly Pricing</span>
        <span className="price">{unit.hourlyPricing.length} options</span>
      </button>
    )}
  </div>
</div>
```

### Hourly Pricing Card Component

```jsx
<div className="hourly-pricing-options">
  <h3>Select Your Hourly Option</h3>
  <div className="pricing-cards-grid">
    {unit.hourlyPricing.map((option, index) => (
      <div
        key={index}
        className={`pricing-card ${selectedHourlyOption === index ? 'selected' : ''}`}
        onClick={() => handleHourlyOptionSelect(index)}
      >
        {/* Hours and Price */}
        <div className="card-header">
          <span className="hours">{option.hours} {option.hours === '1' ? 'hour' : 'hours'}</span>
          <span className="price">₱{option.price}</span>
        </div>
        
        {/* Time Type Badge */}
        <div className="card-badge">
          {option.isFlexible ? (
            <span className="badge flexible">✨ Flexible Time</span>
          ) : (
            <span className="badge fixed">🕐 Fixed Time</span>
          )}
        </div>
        
        {/* Time Details */}
        {!option.isFlexible && option.checkInTime && option.checkOutTime && (
          <div className="time-details">
            <span>{option.checkInTime} - {option.checkOutTime}</span>
          </div>
        )}
        
        {/* Time Picker for Flexible Options */}
        {option.isFlexible && selectedHourlyOption === index && (
          <div className="time-picker">
            <label>Select Start Time:</label>
            <input
              type="time"
              value={flexibleStartTime}
              onChange={(e) => setFlexibleStartTime(e.target.value)}
              required
            />
          </div>
        )}
      </div>
    ))}
  </div>
</div>
```

## Price Calculation Logic

### Standard Pricing Calculation

```javascript
const calculateStandardPrice = () => {
  if (!formData.checkIn || !formData.checkOut || !unit) return 0;
  
  const nights = Math.ceil(
    (new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)
  );
  
  const basePrice = nights * unit.pricePerNight;
  
  // Extra guest fee calculation
  const baseGuests = 2;
  const extraGuests = Math.max(0, formData.guests - baseGuests);
  const extraGuestFee = (unit.extraGuestFee || 0) * extraGuests * nights;
  
  return basePrice + extraGuestFee;
};
```

### Hourly Pricing Calculation

```javascript
const calculateHourlyPrice = () => {
  if (selectedHourlyOption === null || !unit.hourlyPricing[selectedHourlyOption]) {
    return 0;
  }
  
  const option = unit.hourlyPricing[selectedHourlyOption];
  return parseFloat(option.price);
};
```

### Unified Price Calculation

```javascript
const calculateTotalPrice = () => {
  if (pricingType === 'standard') {
    return calculateStandardPrice() + (unit.securityDeposit || 200);
  } else if (pricingType === 'hourly') {
    return calculateHourlyPrice() + (unit.securityDeposit || 200);
  }
  return 0;
};
```

## Validation Logic

### Frontend Validation

```javascript
const validateBooking = () => {
  if (pricingType === 'standard') {
    // Existing validation
    if (!formData.checkIn || !formData.checkOut) {
      addToast('Please select check-in and check-out dates', 'error');
      return false;
    }
    
    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      addToast('Check-out date must be after check-in date', 'error');
      return false;
    }
    
    if (formData.guests > unit.maxGuests) {
      addToast(`Maximum ${unit.maxGuests} guests allowed`, 'error');
      return false;
    }
  } else if (pricingType === 'hourly') {
    // New hourly pricing validation
    if (selectedHourlyOption === null) {
      addToast('Please select an hourly pricing option', 'error');
      return false;
    }
    
    const option = unit.hourlyPricing[selectedHourlyOption];
    if (option.isFlexible && !flexibleStartTime) {
      addToast('Please select a start time for your booking', 'error');
      return false;
    }
  }
  
  return true;
};
```

### Backend Validation

```javascript
// In backend/routes/guest/bookings.js
const validateBookingRequest = (bookingData, unit) => {
  const pricingType = bookingData.pricingType || 'standard';
  
  if (pricingType === 'standard') {
    // Existing validation
    if (!bookingData.checkIn || !bookingData.checkOut) {
      return { valid: false, error: 'Check-in and check-out dates are required' };
    }
    // ... other standard validations
  } else if (pricingType === 'hourly') {
    // New hourly pricing validation
    if (!bookingData.hourlyOption) {
      return { valid: false, error: 'Hourly option details are required' };
    }
    
    // Validate that the hourly option exists in unit configuration
    const optionExists = unit.hourlyPricing?.some(
      opt => opt.hours === bookingData.hourlyOption.hours && 
             opt.price === bookingData.hourlyOption.price
    );
    
    if (!optionExists) {
      return { valid: false, error: 'Invalid hourly pricing option' };
    }
    
    // Validate flexible time selection
    if (bookingData.hourlyOption.isFlexible && !bookingData.hourlyOption.startTime) {
      return { valid: false, error: 'Start time is required for flexible options' };
    }
    
    // Validate price calculation
    const expectedPrice = parseFloat(bookingData.hourlyOption.price) + 
                         (unit.securityDeposit || 200);
    if (Math.abs(bookingData.totalPrice - expectedPrice) > 0.01) {
      return { valid: false, error: 'Price calculation mismatch' };
    }
  }
  
  return { valid: true };
};
```

## Booking Submission Flow

### Frontend Submission

```javascript
const handleConfirmBooking = async () => {
  setSubmitting(true);
  setShowConfirmation(false);
  
  try {
    const token = localStorage.getItem('token');
    
    // Build booking payload based on pricing type
    const bookingPayload = {
      unitId,
      pricingType,
      totalPrice: calculateTotalPrice()
    };
    
    if (pricingType === 'standard') {
      bookingPayload.checkIn = formData.checkIn;
      bookingPayload.checkOut = formData.checkOut;
      bookingPayload.guests = formData.guests;
    } else if (pricingType === 'hourly') {
      const option = unit.hourlyPricing[selectedHourlyOption];
      bookingPayload.hourlyOption = {
        hours: option.hours,
        price: option.price,
        isFlexible: option.isFlexible,
        checkInTime: option.isFlexible ? flexibleStartTime : option.checkInTime,
        checkOutTime: option.isFlexible 
          ? calculateEndTime(flexibleStartTime, option.hours)
          : option.checkOutTime,
        startTime: option.isFlexible ? flexibleStartTime : undefined
      };
    }
    
    const response = await fetch('http://localhost:5000/api/guest/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingPayload)
    });
    
    const data = await response.json();
    if (data.success) {
      addToast('Booking created successfully!', 'success');
      navigate(`/guest/payment/${data.booking.id}`);
    } else {
      addToast(data.message || 'Failed to create booking', 'error');
    }
  } catch (error) {
    addToast('Error creating booking', 'error');
  } finally {
    setSubmitting(false);
  }
};
```

### Backend Processing

```javascript
// In backend/routes/guest/bookings.js
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { unitId, pricingType = 'standard', ...bookingData } = req.body;
    
    // Fetch unit details
    const units = JSON.parse(fs.readFileSync('./data/units.json', 'utf8'));
    const unit = units.find(u => u.id === unitId);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Validate booking request
    const validation = validateBookingRequest({ pricingType, ...bookingData }, unit);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.error });
    }
    
    // Create booking object
    const booking = {
      id: Date.now().toString(),
      unitId,
      guestId: req.user.id,
      pricingType,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    
    // Save booking
    const bookings = JSON.parse(fs.readFileSync('./data/bookings.json', 'utf8'));
    bookings.push(booking);
    fs.writeFileSync('./data/bookings.json', JSON.stringify(bookings, null, 2));
    
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

## Confirmation Modal Design

### Modal Structure

```jsx
<div className="confirmation-modal">
  <h2>Confirm Your Booking</h2>
  
  {/* Pricing Type Indicator */}
  <div className="pricing-type-badge">
    {pricingType === 'standard' ? '🌙 Standard Per Night' : '⏰ Hourly Pricing'}
  </div>
  
  {/* Unit Information */}
  <div className="unit-info">
    <h3>{unit.name}</h3>
    <p>{unit.location}</p>
  </div>
  
  {/* Booking Details - Conditional based on pricing type */}
  {pricingType === 'standard' ? (
    <div className="standard-details">
      <div className="detail-row">
        <span>Check-in:</span>
        <span>{formatDate(formData.checkIn)}</span>
      </div>
      <div className="detail-row">
        <span>Check-out:</span>
        <span>{formatDate(formData.checkOut)}</span>
      </div>
      <div className="detail-row">
        <span>Nights:</span>
        <span>{calculateNights()}</span>
      </div>
      <div className="detail-row">
        <span>Guests:</span>
        <span>{formData.guests}</span>
      </div>
    </div>
  ) : (
    <div className="hourly-details">
      <div className="detail-row">
        <span>Duration:</span>
        <span>{unit.hourlyPricing[selectedHourlyOption].hours} hours</span>
      </div>
      <div className="detail-row">
        <span>Time Type:</span>
        <span>
          {unit.hourlyPricing[selectedHourlyOption].isFlexible 
            ? 'Flexible Time' 
            : 'Fixed Time'}
        </span>
      </div>
      {unit.hourlyPricing[selectedHourlyOption].isFlexible ? (
        <>
          <div className="detail-row">
            <span>Start Time:</span>
            <span>{flexibleStartTime}</span>
          </div>
          <div className="detail-row">
            <span>End Time:</span>
            <span>{calculateEndTime(flexibleStartTime, unit.hourlyPricing[selectedHourlyOption].hours)}</span>
          </div>
        </>
      ) : (
        <>
          <div className="detail-row">
            <span>Check-in:</span>
            <span>{unit.hourlyPricing[selectedHourlyOption].checkInTime}</span>
          </div>
          <div className="detail-row">
            <span>Check-out:</span>
            <span>{unit.hourlyPricing[selectedHourlyOption].checkOutTime}</span>
          </div>
        </>
      )}
    </div>
  )}
  
  {/* Price Breakdown */}
  <div className="price-breakdown">
    <h4>Price Breakdown</h4>
    {pricingType === 'standard' ? (
      <>
        <div className="price-row">
          <span>₱{unit.pricePerNight} × {calculateNights()} nights</span>
          <span>₱{calculateStandardPrice()}</span>
        </div>
        {calculateExtraGuestFee() > 0 && (
          <div className="price-row">
            <span>Extra Guest Fee</span>
            <span>₱{calculateExtraGuestFee()}</span>
          </div>
        )}
      </>
    ) : (
      <div className="price-row">
        <span>{unit.hourlyPricing[selectedHourlyOption].hours} hours</span>
        <span>₱{unit.hourlyPricing[selectedHourlyOption].price}</span>
      </div>
    )}
    <div className="price-row">
      <span>Security Deposit</span>
      <span>₱{unit.securityDeposit || 200}</span>
    </div>
    <div className="price-row total">
      <span>Total Amount</span>
      <span>₱{calculateTotalPrice()}</span>
    </div>
  </div>
  
  {/* Action Buttons */}
  <div className="modal-actions">
    <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
      Cancel
    </Button>
    <Button onClick={handleConfirmBooking}>
      Confirm & Proceed to Payment
    </Button>
  </div>
</div>
```

## Backward Compatibility Strategy

### 1. Default Pricing Type
- All bookings without `pricingType` field are treated as 'standard'
- Existing booking display logic checks for `pricingType` field and defaults to 'standard'

### 2. Unit Configuration
- Units without `hourlyPricing` array only show standard pricing option
- Empty `hourlyPricing` arrays are treated the same as missing arrays

### 3. API Compatibility
- Backend accepts bookings in both old format (without `pricingType`) and new format
- Old format bookings are automatically assigned `pricingType: 'standard'`

### 4. Display Logic
```javascript
// In booking display components
const displayBookingDetails = (booking) => {
  const pricingType = booking.pricingType || 'standard';
  
  if (pricingType === 'standard') {
    // Display standard booking details (existing logic)
    return <StandardBookingDetails booking={booking} />;
  } else if (pricingType === 'hourly') {
    // Display hourly booking details (new logic)
    return <HourlyBookingDetails booking={booking} />;
  }
};
```

## Utility Functions

### Time Calculation

```javascript
// Calculate end time for flexible hourly bookings
const calculateEndTime = (startTime, hours) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(startHour, startMinute, 0, 0);
  
  const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
  
  return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
};

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
```

## Styling Guidelines

### Pricing Type Selector Styles

```css
.pricing-type-selector {
  margin-bottom: 2rem;
}

.pricing-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pricing-option:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.pricing-option.selected {
  border-color: #3b82f6;
  background-color: #dbeafe;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Hourly Pricing Card Styles

```css
.pricing-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.pricing-card {
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pricing-card:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pricing-card.selected {
  border-color: #8b5cf6;
  background-color: #f5f3ff;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.badge.flexible {
  background-color: #d1fae5;
  color: #065f46;
}

.badge.fixed {
  background-color: #dbeafe;
  color: #1e40af;
}
```

## Error Handling

### Error Scenarios

1. **No hourly option selected**: Display toast error before showing confirmation modal
2. **Missing start time for flexible option**: Display toast error and highlight time picker
3. **Backend validation failure**: Display server error message in toast
4. **Price calculation mismatch**: Backend rejects booking and returns error
5. **Invalid hourly option**: Backend validates against unit configuration

### Error Messages

```javascript
const ERROR_MESSAGES = {
  NO_HOURLY_OPTION: 'Please select an hourly pricing option',
  NO_START_TIME: 'Please select a start time for your booking',
  INVALID_DATES: 'Please select valid check-in and check-out dates',
  INVALID_OPTION: 'The selected pricing option is no longer available',
  PRICE_MISMATCH: 'Price calculation error. Please try again',
  SERVER_ERROR: 'Unable to create booking. Please try again later'
};
```

## Testing Considerations

### Unit Tests
- Price calculation for both pricing types
- Validation logic for standard and hourly bookings
- Time calculation utilities
- Backward compatibility checks

### Integration Tests
- Complete booking flow for standard pricing
- Complete booking flow for fixed-time hourly pricing
- Complete booking flow for flexible-time hourly pricing
- Backend validation and storage
- Error handling scenarios

### Manual Testing Checklist
- [ ] Standard pricing works as before (regression test)
- [ ] Hourly pricing selector appears when options exist
- [ ] Hourly pricing selector hidden when no options
- [ ] Fixed-time hourly booking flow
- [ ] Flexible-time hourly booking flow
- [ ] Price calculations are correct
- [ ] Confirmation modal shows correct details
- [ ] Backend stores all fields correctly
- [ ] Existing bookings display correctly
- [ ] Mobile responsive design

## Performance Considerations

- Pricing calculations are performed client-side for immediate feedback
- Backend validation ensures data integrity
- No additional API calls required for pricing type selection
- Minimal state updates to prevent unnecessary re-renders
- Lazy loading of hourly pricing options only when needed

## Security Considerations

- Backend validates all pricing calculations
- Backend verifies hourly options exist in unit configuration
- Price manipulation attempts are detected and rejected
- Authentication required for all booking operations
- Input sanitization for time values
