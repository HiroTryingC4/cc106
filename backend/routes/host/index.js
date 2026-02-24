const express = require('express');
const router = express.Router();

// Import host route modules
const dashboardRoutes = require('./dashboard');
// Future routes will be added here:
// const unitsRoutes = require('./units');
// const bookingsRoutes = require('./bookings');
// const analyticsRoutes = require('./analytics');
// const financialRoutes = require('./financial');

// Mount routes
router.use('/', dashboardRoutes);
// router.use('/units', unitsRoutes);
// router.use('/bookings', bookingsRoutes);
// router.use('/analytics', analyticsRoutes);
// router.use('/financial', financialRoutes);

module.exports = router;
