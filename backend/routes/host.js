const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../middleware/auth');

// Mount sub-routes
router.use('/units', require('./host/units'));
router.use('/bookings', require('./host/bookings'));
router.use('/analytics', require('./host/analytics'));
router.use('/financial', require('./host/financial'));
router.use('/guests', require('./host/guests'));
router.use('/chatbot', require('./host/chatbot'));
router.use('/verification', require('./host/verification'));
router.use('/pricing', require('./host/pricing'));
router.use('/expenses', require('./host/expenses'));
router.use('/payroll', require('./host/payroll'));
router.use('/reports', require('./host/reports'));

router.get('/dashboard', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/units.json'), 'utf8'));
    
    const hostBookings = bookings.filter(b => b.hostId === req.user.id);
    const hostUnits = units.filter(u => u.hostId === req.user.id);
    
    // Guest statistics
    const uniqueGuests = [...new Set(hostBookings.map(b => b.guestId))];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyBookings = hostBookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    });
    const monthlyGuests = [...new Set(monthlyBookings.map(b => b.guestId))];
    
    // Revenue statistics
    const paidBookings = hostBookings.filter(b => b.paymentStatus === 'paid');
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const monthlyRevenue = monthlyBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    // Recent bookings with unit names
    const recentBookings = hostBookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(booking => {
        const unit = units.find(u => u.id === booking.unitId);
        return {
          ...booking,
          unitName: unit ? unit.name : 'Unknown Unit'
        };
      });

    const stats = {
      totalUnits: hostUnits.length,
      totalGuests: uniqueGuests.length,
      monthlyGuests: monthlyGuests.length,
      totalBookings: hostBookings.length,
      pendingBookings: hostBookings.filter(b => b.status === 'pending').length,
      confirmedBookings: hostBookings.filter(b => b.status === 'confirmed').length,
      totalRevenue,
      monthlyRevenue,
      pendingDeposits: hostBookings.filter(b => b.status === 'confirmed' && !b.depositReturned).reduce((sum, b) => sum + b.securityDeposit, 0)
    };

    res.json({ success: true, stats, units: hostUnits, recentBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
