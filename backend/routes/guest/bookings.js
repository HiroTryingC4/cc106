const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const getBookingsData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8');
  return JSON.parse(data);
};

const saveBookingsData = (bookings) => {
  fs.writeFileSync(
    path.join(__dirname, '../../data/bookings.json'),
    JSON.stringify(bookings, null, 2)
  );
};

const getUnitsData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8');
  return JSON.parse(data);
};

// Get all guest bookings
router.get('/', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const bookings = getBookingsData();
    const guestBookings = bookings.filter(b => b.guestId === req.user.id);
    
    // Ensure backward compatibility: default to 'standard' if pricingType is missing
    const bookingsWithDefaults = guestBookings.map(booking => ({
      ...booking,
      pricingType: booking.pricingType || 'standard'
    }));
    
    // Sort by date (newest first)
    bookingsWithDefaults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, bookings: bookingsWithDefaults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single booking
router.get('/:id', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const bookings = getBookingsData();
    const booking = bookings.find(b => b.id === req.params.id && b.guestId === req.user.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Get unit details
    const units = getUnitsData();
    const unit = units.find(u => u.id === booking.unitId);
    
    // Ensure backward compatibility: default to 'standard' if pricingType is missing
    const bookingWithDefaults = {
      ...booking,
      pricingType: booking.pricingType || 'standard'
    };
    
    res.json({ success: true, booking: { ...bookingWithDefaults, unit } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Validation helper function
const validateBookingRequest = (bookingData, unit) => {
  const pricingType = bookingData.pricingType || 'standard';
  
  console.log('=== VALIDATION START ===');
  console.log('Pricing Type:', pricingType);
  console.log('Booking Data:', JSON.stringify(bookingData, null, 2));
  
  if (pricingType === 'standard') {
    // Validate standard pricing fields
    if (!bookingData.checkIn || !bookingData.checkOut) {
      console.log('VALIDATION FAILED: Missing check-in or check-out');
      return { valid: false, error: 'Check-in and check-out dates are required' };
    }
    
    if (!bookingData.guests) {
      console.log('VALIDATION FAILED: Missing guests');
      return { valid: false, error: 'Number of guests is required' };
    }
    
    // Validate dates
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    
    if (checkInDate >= checkOutDate) {
      console.log('VALIDATION FAILED: Invalid dates');
      return { valid: false, error: 'Check-out must be after check-in' };
    }
    
    // Validate guest count
    if (bookingData.guests > unit.maxGuests) {
      console.log('VALIDATION FAILED: Too many guests');
      return { valid: false, error: `Unit can only accommodate ${unit.maxGuests} guests` };
    }
  } else if (pricingType === 'hourly') {
    // Validate hourly pricing fields
    console.log('Checking bookingDate:', bookingData.bookingDate);
    console.log('Checking guests:', bookingData.guests);
    console.log('Checking hourlyOption:', bookingData.hourlyOption);
    
    if (!bookingData.bookingDate) {
      console.log('VALIDATION FAILED: Missing bookingDate');
      return { valid: false, error: 'Booking date is required for hourly pricing' };
    }

    const guestCount = parseInt(bookingData.guests);
    if (!guestCount || guestCount < 1) {
      console.log('VALIDATION FAILED: Invalid guest count:', bookingData.guests);
      return { valid: false, error: 'Number of guests is required (must be at least 1)' };
    }

    // Validate guest count
    if (guestCount > unit.maxGuests) {
      console.log('VALIDATION FAILED: Too many guests');
      return { valid: false, error: `Unit can only accommodate ${unit.maxGuests} guests` };
    }

    if (!bookingData.hourlyOption) {
      console.log('VALIDATION FAILED: Missing hourlyOption');
      return { valid: false, error: 'Hourly option details are required' };
    }
    
    const { hours, price, isFlexible, startTime } = bookingData.hourlyOption;
    
    console.log('Hourly option - hours:', hours, 'price:', price);
    
    if (!hours || !price) {
      console.log('VALIDATION FAILED: Missing hours or price');
      return { valid: false, error: 'Hours and price are required for hourly pricing' };
    }
    
    // Validate that the hourly option exists in unit configuration
    if (!unit.hourlyPricing || !Array.isArray(unit.hourlyPricing)) {
      console.log('VALIDATION FAILED: Unit has no hourly pricing');
      return { valid: false, error: 'Unit does not support hourly pricing' };
    }
    
    const optionExists = unit.hourlyPricing.some(
      opt => String(opt.hours) === String(hours) && String(opt.price) === String(price)
    );
    
    if (!optionExists) {
      console.log('VALIDATION FAILED: Hourly option not found in unit config');
      return { valid: false, error: 'Invalid hourly pricing option' };
    }
    
    // Validate flexible time selection
    if (isFlexible && !startTime) {
      console.log('VALIDATION FAILED: Missing start time for flexible option');
      return { valid: false, error: 'Start time is required for flexible options' };
    }
  } else {
    console.log('VALIDATION FAILED: Invalid pricing type');
    return { valid: false, error: 'Invalid pricing type' };
  }
  
  console.log('VALIDATION PASSED');
  console.log('=== VALIDATION END ===');
  return { valid: true };
};

// Create new booking
router.post('/', verifyToken, checkRole('guest'), (req, res) => {
  console.log('=== ROUTE HIT ===');
  console.log('Request received at /api/guest/bookings');
  
  try {
    const { unitId, pricingType = 'standard', ...bookingData } = req.body;
    
    console.log('=== BACKEND BOOKING REQUEST ===');
    console.log('Received booking request:', JSON.stringify({ unitId, pricingType, ...bookingData }, null, 2));
    console.log('=== END BACKEND REQUEST ===');
    
    // Validate required fields
    if (!unitId) {
      console.log('ERROR: Missing unitId');
      return res.status(400).json({ 
        success: false, 
        message: 'Unit ID is required' 
      });
    }
    
    // Get unit details
    const units = getUnitsData();
    const unit = units.find(u => u.id === unitId);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Validate booking request
    const validation = validateBookingRequest({ pricingType, ...bookingData }, unit);
    console.log('=== VALIDATION RESULT ===');
    console.log('Valid:', validation.valid);
    if (!validation.valid) {
      console.log('Error:', validation.error);
    }
    console.log('=== END VALIDATION ===');
    
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.error 
      });
    }
    
    const bookings = getBookingsData();
    const securityDeposit = unit.securityDeposit || 200;
    let newBooking;
    
    if (pricingType === 'standard') {
      // Handle standard pricing (existing logic)
      const { checkIn, checkOut, guests } = bookingData;
      
      // Calculate nights and total price
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      // Calculate base price
      const basePrice = nights * unit.pricePerNight;
      
      // Calculate extra guest fee
      const baseGuests = 2; // Base price covers 2 guests
      const extraGuests = Math.max(0, guests - baseGuests);
      const extraGuestFee = unit.extraGuestFee || 0;
      const totalExtraGuestFee = extraGuests * extraGuestFee * nights;
      
      // Calculate total
      const totalPrice = basePrice + totalExtraGuestFee;
      
      // Check for date conflicts
      const hasConflict = bookings.some(b => {
        if (b.unitId !== unitId || b.status === 'cancelled') return false;
        if (b.pricingType === 'hourly') return false; // Skip hourly bookings for date conflict check
        
        const existingCheckIn = new Date(b.checkIn);
        const existingCheckOut = new Date(b.checkOut);
        
        return (
          (checkInDate >= existingCheckIn && checkInDate < existingCheckOut) ||
          (checkOutDate > existingCheckIn && checkOutDate <= existingCheckOut) ||
          (checkInDate <= existingCheckIn && checkOutDate >= existingCheckOut)
        );
      });
      
      if (hasConflict) {
        return res.status(400).json({ 
          success: false, 
          message: 'Unit is not available for selected dates' 
        });
      }
      
      // Create standard booking
      newBooking = {
        id: String(bookings.length + 1),
        unitId,
        guestId: req.user.id,
        hostId: unit.hostId,
        pricingType: 'standard',
        checkIn,
        checkOut,
        guests: parseInt(guests),
        nights,
        basePrice,
        extraGuestFee: totalExtraGuestFee,
        totalPrice,
        securityDeposit,
        status: unit.instantBooking ? 'confirmed' : 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // If instant booking, add approval timestamp
      if (unit.instantBooking) {
        newBooking.approvedAt = new Date().toISOString();
      }
    } else if (pricingType === 'hourly') {
      // Handle hourly pricing
      const { hourlyOption, bookingDate, guests } = bookingData;
      
      // Calculate extra guest fee
      const baseGuests = 2;
      const extraGuests = Math.max(0, guests - baseGuests);
      const extraGuestFee = unit.extraGuestFee || 0;
      const totalExtraGuestFee = extraGuests * extraGuestFee;
      
      // Create hourly booking
      newBooking = {
        id: String(bookings.length + 1),
        unitId,
        guestId: req.user.id,
        hostId: unit.hostId,
        pricingType: 'hourly',
        bookingDate,
        guests: parseInt(guests),
        extraGuestFee: totalExtraGuestFee,
        hourlyOption: {
          hours: hourlyOption.hours,
          price: hourlyOption.price,
          isFlexible: hourlyOption.isFlexible,
          checkInTime: hourlyOption.checkInTime,
          checkOutTime: hourlyOption.checkOutTime,
          startTime: hourlyOption.startTime || null
        },
        totalPrice: bookingData.totalPrice,
        securityDeposit,
        status: unit.instantBooking ? 'confirmed' : 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // If instant booking, add approval timestamp
      if (unit.instantBooking) {
        newBooking.approvedAt = new Date().toISOString();
      }
    }
    
    bookings.push(newBooking);
    saveBookingsData(bookings);
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully',
      booking: newBooking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update guest details for booking
router.put('/:id/guest-details', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const { guestDetails } = req.body;
    
    if (!guestDetails || !Array.isArray(guestDetails) || guestDetails.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Guest details are required' 
      });
    }
    
    const bookings = getBookingsData();
    const index = bookings.findIndex(b => b.id === req.params.id && b.guestId === req.user.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Validate that number of guest details matches booking guests count
    if (guestDetails.length !== bookings[index].guests) {
      return res.status(400).json({ 
        success: false, 
        message: `Expected ${bookings[index].guests} guest details, received ${guestDetails.length}` 
      });
    }
    
    // Update booking with guest details
    bookings[index].guestDetails = guestDetails;
    bookings[index].guestDetailsCompleted = true;
    bookings[index].guestDetailsCompletedAt = new Date().toISOString();
    bookings[index].updatedAt = new Date().toISOString();
    
    saveBookingsData(bookings);
    
    res.json({ 
      success: true, 
      message: 'Guest details saved successfully',
      booking: bookings[index]
    });
  } catch (error) {
    console.error('Error saving guest details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel booking
router.delete('/:id', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const bookings = getBookingsData();
    const index = bookings.findIndex(b => b.id === req.params.id && b.guestId === req.user.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const booking = bookings[index];
    
    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel this booking' 
      });
    }
    
    // Update booking status
    bookings[index].status = 'cancelled';
    bookings[index].updatedAt = new Date().toISOString();
    
    saveBookingsData(bookings);
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      booking: bookings[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
