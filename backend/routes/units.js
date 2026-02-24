const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const getUnitsData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../data/units.json'), 'utf8');
  return JSON.parse(data);
};

// Get all units with filters and search
router.get('/', (req, res) => {
  try {
    let units = getUnitsData();
    const { 
      type, 
      minPrice, 
      maxPrice, 
      guests, 
      search,
      bedrooms,
      stayDuration,
      sort = 'default',
      page = 1,
      limit = 12
    } = req.query;

    // Apply filters
    if (type && type !== 'all') {
      units = units.filter(u => u.type === type);
    }
    
    if (minPrice) {
      units = units.filter(u => u.pricePerNight >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      units = units.filter(u => u.pricePerNight <= parseInt(maxPrice));
    }
    
    if (guests) {
      units = units.filter(u => u.maxGuests >= parseInt(guests));
    }

    if (bedrooms) {
      units = units.filter(u => u.bedrooms >= parseInt(bedrooms));
    }

    if (stayDuration && stayDuration !== 'all') {
      units = units.filter(u => u.stayDuration === stayDuration || !u.stayDuration);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      units = units.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.description.toLowerCase().includes(searchLower) ||
        u.address.toLowerCase().includes(searchLower) ||
        u.amenities.some(a => a.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    switch (sort) {
      case 'price_low':
        units.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price_high':
        units.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        units.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        units.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Keep default order
        break;
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUnits = units.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      units: paginatedUnits,
      total: units.length,
      page: parseInt(page),
      totalPages: Math.ceil(units.length / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single unit
router.get('/:id', (req, res) => {
  try {
    const units = getUnitsData();
    const unit = units.find(u => u.id === req.params.id);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    res.json({ success: true, unit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unit types for filter
router.get('/meta/types', (req, res) => {
  try {
    const units = getUnitsData();
    const types = [...new Set(units.map(u => u.type))];
    res.json({ success: true, types });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unit availability
router.get('/:id/availability', (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf8'));
    const unitBookings = bookings.filter(b => 
      b.unitId === req.params.id && 
      (b.status === 'confirmed' || b.status === 'pending')
    );
    
    // Get all booked dates
    const bookedDates = [];
    unitBookings.forEach(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        bookedDates.push(date.toISOString().split('T')[0]);
      }
    });
    
    res.json({ success: true, bookedDates: [...new Set(bookedDates)] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
