# Extra Guest Fee Feature - Complete ✅

## Overview
Added an "Extra Guest Fee" field to unit management, allowing hosts to charge additional fees for extra guests beyond the base capacity.

## Feature Details

### What It Does
- Hosts can set a per-person, per-night fee for additional guests
- Default value: ₱200 per extra guest per night
- Displayed prominently on unit details page
- Helps hosts monetize additional capacity

### Example Scenario
```
Unit Details:
- Max Guests: 4
- Base Price: ₱1,000/night
- Extra Guest Fee: ₱200/night

Booking for 2 guests:
- Total: ₱1,000/night (base price only)

Booking for 3 guests:
- Base: ₱1,000/night
- Extra Guest Fee: ₱200 × 1 guest = ₱200
- Total: ₱1,200/night

Booking for 4 guests:
- Base: ₱1,000/night
- Extra Guest Fee: ₱200 × 2 guests = ₱400
- Total: ₱1,400/night
```

## Implementation

### Frontend - Unit Form
**File:** `frontend/src/pages/Host/UnitForm.js`

#### Added Field
- Input field: "Extra Guest Fee (per person/night)"
- Type: Number
- Default: 200
- Min: 0
- Placeholder: "200"

#### Helper Text
Added informative box explaining:
- What the fee is for
- How it's calculated
- Example usage

#### Form State
```javascript
extraGuestFee: '200'  // Default value
```

### Backend - Unit Routes
**File:** `backend/routes/host/units.js`

#### POST Endpoint (Create)
- Added `extraGuestFee` parameter
- Default: 200 if not provided
- Stored as Number

#### PUT Endpoint (Update)
- Added `extraGuestFee` parameter
- Updates existing value
- Stored as Number

### Frontend - Unit Details Page
**File:** `frontend/src/pages/Public/UnitDetails.js`

#### Display Section
- Green highlighted box (matches design system)
- Shows: "₱{amount} per additional guest per night"
- Icon: 👥 (people emoji)
- Only displays if fee > 0

## User Experience

### For Hosts - Creating Unit
1. Fill in unit details
2. Set "Max Guests" (e.g., 4)
3. Set "Extra Guest Fee" (e.g., 200)
4. See helper text explaining the fee
5. Save unit

### For Hosts - Editing Unit
1. Edit existing unit
2. Update "Extra Guest Fee" value
3. Save changes

### For Guests - Viewing Unit
1. Browse unit details
2. See "Extra Guest Fee" section
3. Understand additional costs
4. Make informed booking decision

## Data Structure

### Unit Object
```json
{
  "id": "1",
  "name": "Luxury Condo",
  "maxGuests": 4,
  "pricePerNight": 1000,
  "extraGuestFee": 200,
  "stayDuration": "flexible",
  // ... other fields
}
```

## Display Examples

### Unit Form
```
┌─────────────────────────────────────────┐
│ Extra Guest Fee (per person/night)     │
│ ┌─────────────────────────────────────┐ │
│ │ 200                                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

💡 Extra Guest Fee: Additional charge per 
extra guest beyond base capacity. Example: 
If max guests is 4 and booking is for 3 
guests, the extra guest fee will be added 
to the total price.
```

### Unit Details Page
```
┌─────────────────────────────────────────┐
│ 👥 Extra Guest Fee                      │
│    ₱200 per additional guest per night  │
└─────────────────────────────────────────┘
```

## Benefits

### For Hosts
✅ Monetize additional capacity
✅ Fair pricing for extra guests
✅ Flexible pricing strategy
✅ Covers additional costs (utilities, amenities)
✅ Competitive with market standards

### For Guests
✅ Transparent pricing
✅ Clear cost breakdown
✅ No hidden fees
✅ Informed booking decisions
✅ Fair pricing structure

### For Platform
✅ More detailed pricing
✅ Better revenue optimization
✅ Competitive with other platforms
✅ Professional appearance
✅ Industry standard feature

## Future Enhancements (Optional)

### Booking Integration
1. **Automatic Calculation**
   - Calculate extra guest fees during booking
   - Show breakdown in booking summary
   - Add to total price automatically

2. **Dynamic Pricing**
   - Different fees for different seasons
   - Weekend vs weekday rates
   - Bulk discounts for large groups

3. **Guest Count Validation**
   - Enforce max guests limit
   - Show warning if exceeding capacity
   - Suggest alternative units

4. **Pricing Preview**
   - Show price calculator on unit details
   - Interactive guest count selector
   - Real-time price updates

### Analytics
1. Track average extra guest bookings
2. Revenue from extra guest fees
3. Optimal fee pricing suggestions
4. Comparison with similar units

## Testing

### Test Scenarios
✅ Create unit with extra guest fee
✅ Create unit without extra guest fee (0)
✅ Edit unit to change fee
✅ View fee on unit details page
✅ Fee displays correctly (₱200 format)
✅ Helper text shows correctly
✅ Default value (200) works
✅ Backward compatibility (units without fee)

### Test Account
- **Host:** TRIAL5@gmail.com / password123 (ID: 13)
- **Guest:** guest1@example.com / password123

## Files Modified

### Frontend
- `frontend/src/pages/Host/UnitForm.js` - Added input field and helper text
- `frontend/src/pages/Public/UnitDetails.js` - Added fee display section

### Backend
- `backend/routes/host/units.js` - Added extraGuestFee to create/update endpoints

## Backward Compatibility

✅ Existing units work without fee
✅ Default value provided (200)
✅ Optional field (can be 0)
✅ No breaking changes
✅ Graceful fallback

## Status: ✅ COMPLETE

The extra guest fee feature is fully implemented and ready for use. Hosts can now set per-person fees for additional guests, and guests can see these fees clearly on unit details pages.

---

**Key Feature:** Per-person, per-night pricing for extra guests
**Default Value:** ₱200
**User Impact:** Better pricing transparency and revenue optimization
**Implementation Date:** February 23, 2026
