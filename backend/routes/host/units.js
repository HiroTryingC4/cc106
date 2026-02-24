const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { verifyToken, checkRole, checkVerified } = require('../../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/units');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'unit-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

// Get all host units
router.get('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const hostUnits = units.filter(u => u.hostId === req.user.id);
    res.json({ success: true, units: hostUnits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single unit
router.get('/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const unit = units.find(u => u.id === req.params.id && u.hostId === req.user.id);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    res.json({ success: true, unit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new unit
router.post('/', verifyToken, checkRole('host'), checkVerified, (req, res) => {
  try {
    const { name, type, location, description, pricePerNight, bedrooms, bathrooms, maxGuests, amenities, securityDeposit, houseRules, instantBooking, extraGuestFee, hourlyPricing, fixedCheckInTime, fixedCheckOutTime } = req.body;
    
    if (!name || !type || !location) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const unitsPath = path.join(__dirname, '../../data/units.json');
    const units = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
    
    const newUnit = {
      id: String(units.length + 1),
      hostId: req.user.id,
      name,
      type,
      location,
      description: description || '',
      pricePerNight: Number(pricePerNight) || 0,
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      maxGuests: Number(maxGuests) || 2,
      amenities: amenities || [],
      securityDeposit: Number(securityDeposit) || 200,
      extraGuestFee: Number(extraGuestFee) || 200,
      houseRules: houseRules || '',
      instantBooking: instantBooking || false,
      stayDuration: 'flexible', // Default to flexible, managed by hourly pricing
      hourlyPricing: hourlyPricing || [],
      fixedCheckInTime: fixedCheckInTime || '14:00',
      fixedCheckOutTime: fixedCheckOutTime || '12:00',
      images: [],
      rating: 0,
      reviews: 0,
      available: true,
      createdAt: new Date().toISOString()
    };
    
    units.push(newUnit);
    fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Unit created successfully', unit: newUnit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update unit
router.put('/:id', verifyToken, checkRole('host'), checkVerified, (req, res) => {
  try {
    const { name, type, location, description, pricePerNight, bedrooms, bathrooms, maxGuests, amenities, securityDeposit, available, houseRules, instantBooking, extraGuestFee, hourlyPricing, fixedCheckInTime, fixedCheckOutTime } = req.body;
    
    const unitsPath = path.join(__dirname, '../../data/units.json');
    const units = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id && u.hostId === req.user.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    const unit = units[unitIndex];
    
    if (name) unit.name = name;
    if (type) unit.type = type;
    if (location) unit.location = location;
    if (description !== undefined) unit.description = description;
    if (pricePerNight) unit.pricePerNight = Number(pricePerNight);
    if (bedrooms) unit.bedrooms = Number(bedrooms);
    if (bathrooms) unit.bathrooms = Number(bathrooms);
    if (maxGuests) unit.maxGuests = Number(maxGuests);
    if (amenities) unit.amenities = amenities;
    if (securityDeposit) unit.securityDeposit = Number(securityDeposit);
    if (extraGuestFee !== undefined) unit.extraGuestFee = Number(extraGuestFee);
    if (available !== undefined) unit.available = available;
    if (houseRules !== undefined) unit.houseRules = houseRules;
    if (instantBooking !== undefined) unit.instantBooking = instantBooking;
    if (hourlyPricing !== undefined) unit.hourlyPricing = hourlyPricing;
    if (fixedCheckInTime !== undefined) unit.fixedCheckInTime = fixedCheckInTime;
    if (fixedCheckOutTime !== undefined) unit.fixedCheckOutTime = fixedCheckOutTime;
    unit.updatedAt = new Date().toISOString();
    
    units[unitIndex] = unit;
    fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Unit updated successfully', unit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete unit
router.delete('/:id', verifyToken, checkRole('host'), checkVerified, (req, res) => {
  try {
    const unitsPath = path.join(__dirname, '../../data/units.json');
    const units = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id && u.hostId === req.user.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Check for active bookings
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const activeBookings = bookings.filter(b => 
      b.unitId === req.params.id && 
      (b.status === 'confirmed' || b.status === 'pending')
    );
    
    if (activeBookings.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete unit with active bookings' });
    }
    
    units.splice(unitIndex, 1);
    fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload unit images
router.post('/:id/images', verifyToken, checkRole('host'), upload.array('images', 10), (req, res) => {
  try {
    const unitsPath = path.join(__dirname, '../../data/units.json');
    const units = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id && u.hostId === req.user.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    const imageUrls = req.files.map(file => `/uploads/units/${file.filename}`);
    units[unitIndex].images = [...(units[unitIndex].images || []), ...imageUrls];
    
    fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Images uploaded successfully', images: imageUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete unit image
router.delete('/:id/images', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }

    const unitsPath = path.join(__dirname, '../../data/units.json');
    const units = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id && u.hostId === req.user.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Remove image from array
    units[unitIndex].images = (units[unitIndex].images || []).filter(img => img !== imageUrl);
    
    // Try to delete the physical file
    if (imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../..', imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Image removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Record unit condition
router.post('/:id/condition', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { bookingId, condition, notes, photos } = req.body;
    
    const conditionsPath = path.join(__dirname, '../../data/unit_conditions.json');
    let conditions = [];
    
    if (fs.existsSync(conditionsPath)) {
      conditions = JSON.parse(fs.readFileSync(conditionsPath, 'utf8'));
    }
    
    const newCondition = {
      id: String(conditions.length + 1),
      unitId: req.params.id,
      bookingId: bookingId || null,
      hostId: req.user.id,
      condition: condition || 'good',
      notes: notes || '',
      photos: photos || [],
      recordedAt: new Date().toISOString()
    };
    
    conditions.push(newCondition);
    fs.writeFileSync(conditionsPath, JSON.stringify(conditions, null, 2));
    
    res.json({ success: true, message: 'Condition recorded successfully', condition: newCondition });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
