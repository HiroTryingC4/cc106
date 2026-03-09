const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get payments data
router.get('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    
    // Convert both to strings for comparison
    const hostId = String(req.user.id);
    const hostBookings = bookings.filter(b => String(b.hostId) === hostId);
    
    // Calculate stats
    const paidBookings = hostBookings.filter(b => b.paymentStatus === 'paid');
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const completedTransactions = paidBookings.length;
    const pendingDepositsCount = hostBookings.filter(b => 
      b.status === 'pending' && b.paymentStatus === 'pending'
    ).length;
    const avgTransactionPerBooking = completedTransactions > 0 
      ? Math.round(totalRevenue / completedTransactions) 
      : 0;
    
    // Get pending deposits (bookings awaiting approval)
    const pendingDeposits = hostBookings
      .filter(b => b.status === 'pending' && b.paymentStatus === 'pending')
      .map(booking => {
        const unit = units.find(u => u.id === booking.unitId);
        const guest = users.find(u => u.id === booking.guestId);
        
        return {
          bookingId: booking.id,
          guestName: guest ? guest.name : 'Unknown',
          unitName: unit ? unit.name : 'Unknown',
          amount: booking.totalPrice,
          date: booking.createdAt
        };
      });
    
    // Get all transactions
    const transactions = hostBookings.map(booking => {
      const unit = units.find(u => u.id === booking.unitId);
      const guest = users.find(u => u.id === booking.guestId);
      
      return {
        paymentId: booking.paymentReference || `PAY_${booking.id}`,
        bookingId: booking.id,
        guestName: guest ? guest.name : 'Unknown',
        unitName: unit ? unit.name : 'Unknown',
        type: 'booking',
        amount: booking.totalPrice,
        date: booking.paidAt || booking.createdAt,
        status: booking.paymentStatus,
        paymentStatus: booking.paymentStatus
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      success: true,
      stats: {
        totalRevenue,
        completedTransactions,
        pendingDeposits: pendingDepositsCount,
        avgTransactionPerBooking
      },
      pendingDeposits,
      transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
