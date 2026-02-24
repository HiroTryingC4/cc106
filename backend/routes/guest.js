const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../middleware/auth');

// Mount sub-routes
router.use('/bookings', require('./guest/bookings'));
router.use('/payments', require('./guest/payments'));
router.use('/profile', require('./guest/profile'));
router.use('/checkout', require('./guest/checkout'));
router.use('/reviews', require('./guest/reviews'));
router.use('/browsing-history', require('./guest/browsing-history'));
router.use('/recommendations', require('./guest/recommendations'));

router.get('/dashboard', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf8'));
    const guestBookings = bookings.filter(b => b.guestId === req.user.id);

    const stats = {
      totalBookings: guestBookings.length,
      upcomingBookings: guestBookings.filter(b => b.status === 'confirmed' && new Date(b.checkIn) > new Date()).length,
      completedBookings: guestBookings.filter(b => b.status === 'completed').length,
      totalSpent: guestBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0)
    };

    res.json({ success: true, stats, bookings: guestBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
