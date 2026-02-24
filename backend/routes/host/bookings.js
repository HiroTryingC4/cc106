const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole, checkVerified } = require('../../middleware/auth');

// Get all host bookings
router.get('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    
    const hostBookings = bookings
      .filter(b => b.hostId === req.user.id)
      .map(booking => {
        const unit = units.find(u => u.id === booking.unitId);
        const guest = users.find(u => u.id === booking.guestId);
        return {
          ...booking,
          unit: unit ? { id: unit.id, name: unit.name, location: unit.location } : null,
          guest: guest ? { id: guest.id, name: guest.name, email: guest.email } : null
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, bookings: hostBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single booking
router.get('/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    
    const booking = bookings.find(b => b.id === req.params.id && b.hostId === req.user.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const unit = units.find(u => u.id === booking.unitId);
    const guest = users.find(u => u.id === booking.guestId);
    
    res.json({
      success: true,
      booking: {
        ...booking,
        unit,
        guest: guest ? { id: guest.id, name: guest.name, email: guest.email, phone: guest.phone } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve booking
router.put('/:id/approve', verifyToken, checkRole('host'), checkVerified, (req, res) => {
  try {
    const bookingsPath = path.join(__dirname, '../../data/bookings.json');
    const bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id && b.hostId === req.user.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const booking = bookings[bookingIndex];
    
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending bookings can be approved' });
    }
    
    booking.status = 'confirmed';
    booking.approvedAt = new Date().toISOString();
    
    bookings[bookingIndex] = booking;
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
    
    res.json({ success: true, message: 'Booking approved successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject booking
router.put('/:id/reject', verifyToken, checkRole('host'), checkVerified, (req, res) => {
  try {
    const { reason } = req.body;
    const bookingsPath = path.join(__dirname, '../../data/bookings.json');
    const bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id && b.hostId === req.user.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const booking = bookings[bookingIndex];
    
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending bookings can be rejected' });
    }
    
    booking.status = 'cancelled';
    booking.rejectedAt = new Date().toISOString();
    booking.rejectionReason = reason || 'Rejected by host';
    
    bookings[bookingIndex] = booking;
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
    
    res.json({ success: true, message: 'Booking rejected successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking status
router.put('/:id/status', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const bookingsPath = path.join(__dirname, '../../data/bookings.json');
    const bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id && b.hostId === req.user.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    bookings[bookingIndex].status = status;
    bookings[bookingIndex].statusUpdatedAt = new Date().toISOString();
    
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
    
    res.json({ success: true, message: 'Status updated successfully', booking: bookings[bookingIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
