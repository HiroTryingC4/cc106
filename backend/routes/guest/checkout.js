const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/checkout');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'checkout-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// Upload checkout photos
router.post('/:bookingId/photos', verifyToken, checkRole('guest'), upload.array('photos', 5), (req, res) => {
  try {
    const { bookingId } = req.params;
    const bookingsPath = path.join(__dirname, '../../data/bookings.json');
    const bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));
    const bookingIndex = bookings.findIndex(b => b.id === bookingId && b.guestId === req.user.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookings[bookingIndex];
    
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Can only upload photos for confirmed bookings' });
    }

    const photoUrls = req.files.map(file => `/uploads/checkout/${file.filename}`);
    booking.checkoutPhotos = photoUrls;
    booking.checkoutPhotoSubmitted = true;
    booking.checkoutPhotoSubmittedAt = new Date().toISOString();

    bookings[bookingIndex] = booking;
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));

    res.json({ 
      success: true, 
      message: 'Checkout photos uploaded successfully',
      photos: photoUrls 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get checkout info
router.get('/:bookingId', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const { bookingId } = req.params;
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    
    const booking = bookings.find(b => b.id === bookingId && b.guestId === req.user.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const unit = units.find(u => u.id === booking.unitId);

    res.json({ 
      success: true, 
      booking,
      unit,
      checkoutPhotos: booking.checkoutPhotos || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
