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

// Generate QR code data for payment
router.get('/:bookingId/qr', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const bookings = getBookingsData();
    const booking = bookings.find(b => b.id === req.params.bookingId && b.guestId === req.user.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking already paid' 
      });
    }
    
    // Generate QR code data (in real app, this would be payment gateway data)
    const qrData = {
      bookingId: booking.id,
      amount: booking.totalPrice + booking.securityDeposit,
      currency: 'USD',
      merchantId: 'SMARTSTAY_' + booking.hostId,
      reference: `BOOKING_${booking.id}_${Date.now()}`,
      description: `Smart Stay Booking #${booking.id}`
    };
    
    res.json({ 
      success: true, 
      qrData: JSON.stringify(qrData),
      amount: booking.totalPrice + booking.securityDeposit,
      breakdown: {
        totalPrice: booking.totalPrice,
        securityDeposit: booking.securityDeposit,
        total: booking.totalPrice + booking.securityDeposit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Confirm payment
router.post('/:bookingId/confirm', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const bookings = getBookingsData();
    const index = bookings.findIndex(b => b.id === req.params.bookingId && b.guestId === req.user.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const booking = bookings[index];
    
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking already paid' 
      });
    }
    
    // Update booking payment status
    bookings[index].paymentStatus = 'paid';
    bookings[index].status = 'confirmed';
    bookings[index].paidAt = new Date().toISOString();
    bookings[index].updatedAt = new Date().toISOString();
    
    // In real app, would verify payment with payment gateway
    bookings[index].paymentReference = req.body.paymentReference || `PAY_${Date.now()}`;
    
    saveBookingsData(bookings);
    
    res.json({ 
      success: true, 
      message: 'Payment confirmed successfully',
      booking: bookings[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
