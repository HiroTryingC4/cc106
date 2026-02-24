const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const getBookingsData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf8');
  return JSON.parse(data);
};

router.get('/', verifyToken, (req, res) => {
  try {
    let bookings = getBookingsData();
    
    if (req.user.role === 'guest') {
      bookings = bookings.filter(b => b.guestId === req.user.id);
    } else if (req.user.role === 'host') {
      bookings = bookings.filter(b => b.hostId === req.user.id);
    }
    
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
