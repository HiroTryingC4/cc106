const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get all bookings
router.get('/', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    
    const enrichedBookings = bookings.map(booking => {
      const guest = users.find(u => u.id === booking.guestId);
      const host = users.find(u => u.id === booking.hostId);
      const unit = units.find(u => u.id === booking.unitId);
      
      return {
        ...booking,
        guest: guest ? { id: guest.id, name: `${guest.firstName} ${guest.lastName}`, email: guest.email } : null,
        host: host ? { id: host.id, name: `${host.firstName} ${host.lastName}`, email: host.email } : null,
        unit: unit ? { id: unit.id, name: unit.name } : null
      };
    });
    
    res.json({ success: true, bookings: enrichedBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single booking
router.get('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const booking = bookings.find(b => b.id === req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { reason } = req.body;
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].cancelledBy = 'admin';
    bookings[bookingIndex].cancellationReason = reason || 'Cancelled by admin';
    bookings[bookingIndex].cancelledAt = new Date().toISOString();
    
    fs.writeFileSync(path.join(__dirname, '../../data/bookings.json'), JSON.stringify(bookings, null, 2));
    
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking status
router.put('/:id/status', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    bookings[bookingIndex].status = status;
    bookings[bookingIndex].updatedAt = new Date().toISOString();
    
    fs.writeFileSync(path.join(__dirname, '../../data/bookings.json'), JSON.stringify(bookings, null, 2));
    
    res.json({ success: true, message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
