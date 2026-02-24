const express = require('express');
const router = express.Router();

// Import guest route modules
const dashboardRoutes = require('./dashboard');
// Future routes will be added here:
// const bookingsRoutes = require('./bookings');
// const paymentsRoutes = require('./payments');
// const reviewsRoutes = require('./reviews');
// const profileRoutes = require('./profile');

// Mount routes
router.use('/', dashboardRoutes);
// router.use('/bookings', bookingsRoutes);
// router.use('/payments', paymentsRoutes);
// router.use('/reviews', reviewsRoutes);
// router.use('/profile', profileRoutes);

module.exports = router;
