const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get all deposits for host
router.get('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    
    // Get all bookings for this host that have security deposits
    const hostDeposits = bookings
      .filter(b => b.hostId === req.user.id && b.securityDeposit > 0)
      .map(booking => {
        const unit = units.find(u => u.id === booking.unitId);
        const guest = users.find(u => u.id === booking.guestId);
        return {
          ...booking,
          unit: unit ? { id: unit.id, name: unit.name, location: unit.location } : null,
          guest: guest ? { 
            id: guest.id, 
            name: `${guest.firstName} ${guest.lastName}`, 
            email: guest.email,
            phone: guest.phone 
          } : null
        };
      })
      .sort((a, b) => {
        // Sort by: not returned first, then by status (completed first), then by date
        if (a.depositReturned !== b.depositReturned) {
          return a.depositReturned ? 1 : -1;
        }
        if (a.status === 'completed' && b.status !== 'completed') return -1;
        if (a.status !== 'completed' && b.status === 'completed') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    
    res.json({ success: true, deposits: hostDeposits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark deposit as returned
router.put('/:id/return', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookingsPath = path.join(__dirname, '../../data/bookings.json');
    const bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id && b.hostId === req.user.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const booking = bookings[bookingIndex];
    
    if (booking.depositReturned) {
      return res.status(400).json({ success: false, message: 'Deposit already marked as returned' });
    }
    
    // Mark deposit as returned
    booking.depositReturned = true;
    booking.depositReturnedAt = new Date().toISOString();
    
    bookings[bookingIndex] = booking;
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Deposit marked as returned successfully',
      booking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
