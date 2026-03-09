const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { verifyToken, checkRole } = require('../middleware/auth');

// Dashboard route
router.get('/dashboard', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/units.json'), 'utf8'));

    const stats = {
      totalUsers: users.length,
      totalHosts: users.filter(u => u.role === 'host').length,
      totalGuests: users.filter(u => u.role === 'guest').length,
      totalUnits: units.length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      totalRevenue: bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0)
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get admin profile
router.get('/profile', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    const admin = users.find(u => u.id === req.user.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const { password, ...adminData } = admin;
    res.json({ success: true, admin: adminData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update admin profile
router.put('/profile', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const usersPath = path.join(__dirname, '../data/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    
    const adminIndex = users.findIndex(u => u.id === req.user.id);
    
    if (adminIndex === -1) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    users[adminIndex] = {
      ...users[adminIndex],
      firstName,
      lastName,
      phone
    };

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

    const { password, ...adminData } = users[adminIndex];
    res.json({ success: true, message: 'Profile updated successfully', admin: adminData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Change admin password
router.put('/change-password', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const usersPath = path.join(__dirname, '../data/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    
    const adminIndex = users.findIndex(u => u.id === req.user.id);
    
    if (adminIndex === -1) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const admin = users[adminIndex];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[adminIndex].password = hashedPassword;

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mount sub-routes (removed duplicate section)
router.use('/users', require('./admin/users'));
router.use('/units', require('./admin/units'));
router.use('/reviews', require('./admin/reviews'));
router.use('/financial', require('./admin/financial'));
router.use('/reports', require('./admin/reports'));
router.use('/system', require('./admin/system'));
router.use('/chatbot', require('./admin/chatbot'));
router.use('/chatbot', require('./admin/chatbot-analytics'));
router.use('/verifications', require('./admin/verifications'));
router.use('/security', require('./admin/security'));
router.use('/promo-codes', require('./admin/promo-codes'));

module.exports = router;
