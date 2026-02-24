const express = require('express');
const router = express.Router();

// Import admin route modules
const dashboardRoutes = require('./dashboard');
// Future routes will be added here:
// const usersRoutes = require('./users');
// const systemRoutes = require('./system');
// const reportsRoutes = require('./reports');

// Mount routes
router.use('/', dashboardRoutes);
// router.use('/users', usersRoutes);
// router.use('/system', systemRoutes);
// router.use('/reports', reportsRoutes);

module.exports = router;
