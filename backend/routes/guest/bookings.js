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
    
    // Sort by date (newest first)
    guestBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, bookings: guestBookings });
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
    
    res.json({ success: true, booking: { ...booking, unit } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new booking
router.post('/', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const { unitId, checkIn, checkOut, guests } = req.body;
    
    // Validate required fields
    if (!unitId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Get unit details
    const units = getUnitsData();
    const unit = units.find(u => u.id === unitId);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Check if unit can accommodate guests
    if (guests > unit.maxGuests) {
      return res.status(400).json({ 
        success: false, 
        message: `Unit can only accommodate ${unit.maxGuests} guests` 
      });
    }
    
    // Calculate nights and total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (nights < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Check-out must be after check-in' 
      });
    }
    
    // Calculate base price
    const basePrice = nights * unit.pricePerNight;
    
    // Calculate extra guest fee
    const baseGuests = 2; // Base price covers 2 guests
    const extraGuests = Math.max(0, guests - baseGuests);
    const extraGuestFee = unit.extraGuestFee || 0;
    const totalExtraGuestFee = extraGuests * extraGuestFee * nights;
    
    // Calculate total
    const totalPrice = basePrice + totalExtraGuestFee;
    const securityDeposit = unit.securityDeposit || 200;
    
    // Check for date conflicts
    const bookings = getBookingsData();
    const hasConflict = bookings.some(b => {
      if (b.unitId !== unitId || b.status === 'cancelled') return false;
      
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
    
    // Create booking
    const newBooking = {
      id: String(bookings.length + 1),
      unitId,
      guestId: req.user.id,
      hostId: unit.hostId,
      checkIn,
      checkOut,
      guests: parseInt(guests),
      nights,
      basePrice,
      extraGuestFee: totalExtraGuestFee,
      totalPrice,
      securityDeposit,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    saveBookingsData(bookings);
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully',
      booking: newBooking 
    });
  } catch (error) {
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
