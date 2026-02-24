const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get system statistics
router.get('/stats', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    
    const stats = {
      users: {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        byRole: {
          admin: users.filter(u => u.role === 'admin').length,
          host: users.filter(u => u.role === 'host').length,
          guest: users.filter(u => u.role === 'guest').length
        }
      },
      bookings: {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length
      },
      units: {
        total: units.length,
        available: units.filter(u => u.available).length
      },
      reviews: {
        total: reviews.length,
        averageRating: reviews.length > 0 
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0
      },
      revenue: {
        total: bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0),
        pending: bookings.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + b.totalPrice, 0)
      }
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Backup data
router.get('/backup', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    const messages = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/messages.json'), 'utf8'));
    
    const backup = {
      timestamp: new Date().toISOString(),
      data: { users, bookings, units, reviews, messages }
    };
    
    res.json({ success: true, backup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get system settings
router.get('/settings', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const settingsPath = path.join(__dirname, '../../data/settings.json');
    let settings = {
      siteName: 'Smart Stay',
      currency: 'USD',
      timezone: 'UTC',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: false
    };
    
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update system settings
router.put('/settings', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const settingsPath = path.join(__dirname, '../../data/settings.json');
    const newSettings = req.body;
    
    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
    
    res.json({ success: true, message: 'Settings updated successfully', settings: newSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
