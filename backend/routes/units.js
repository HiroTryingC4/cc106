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
      location,
      stayDuration,
      sort = 'default',
      page = 1,
      limit = 12
    } = req.query;

    console.log('Units API called - Total units in database:', units.length);

    // Filter only available and approved units for public view
    units = units.filter(u => u.available !== false && (u.moderationStatus === 'approved' || !u.moderationStatus));
    
    console.log('After filtering for available and approved:', units.length);

    // Apply filters
    if (type && type !== 'all') {
      units = units.filter(u => u.type === type);
      console.log('After type filter:', units.length);
    }
    
    if (minPrice) {
      units = units.filter(u => u.pricePerNight >= parseInt(minPrice));
      console.log('After minPrice filter:', units.length);
    }
    
    if (maxPrice) {
      units = units.filter(u => u.pricePerNight <= parseInt(maxPrice));
      console.log('After maxPrice filter:', units.length);
    }
    
    if (guests) {
      units = units.filter(u => u.maxGuests >= parseInt(guests));
      console.log('After guests filter:', units.length);
    }

    if (bedrooms) {
      units = units.filter(u => u.bedrooms >= parseInt(bedrooms));
      console.log('After bedrooms filter:', units.length);
    }

    if (location) {
      const locationLower = location.toLowerCase();
      units = units.filter(u => 
        (u.location && u.location.toLowerCase().includes(locationLower)) ||
        (u.address && u.address.toLowerCase().includes(locationLower))
      );
      console.log('After location filter:', units.length);
    }

    if (stayDuration && stayDuration !== 'all') {
      units = units.filter(u => u.stayDuration === stayDuration || !u.stayDuration);
      console.log('After stayDuration filter:', units.length);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      units = units.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        (u.description && u.description.toLowerCase().includes(searchLower)) ||
        (u.address && u.address.toLowerCase().includes(searchLower)) ||
        (u.location && u.location.toLowerCase().includes(searchLower)) ||
        (u.amenities && u.amenities.some(a => a.toLowerCase().includes(searchLower)))
      );
      console.log('After search filter:', units.length);
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
      case 'price_low':
        units.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price_desc':
      case 'price_high':
        units.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        units.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviews':
        units.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default:
        // Keep default order
        break;
    }

    // Add host information to units
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    units = units.map(unit => {
      const host = users.find(u => u.id === unit.hostId && u.role === 'host');
      if (host) {
        return {
          ...unit,
          hostName: `${host.firstName} ${host.lastName}`,
          hostCompanyName: host.companyName || null
        };
      }
      return unit;
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUnits = units.slice(startIndex, endIndex);

    console.log('Returning', paginatedUnits.length, 'units out of', units.length, 'total');

    res.json({ 
      success: true, 
      units: paginatedUnits,
      total: units.length,
      page: parseInt(page),
      totalPages: Math.ceil(units.length / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single unit
router.get('/:id', (req, res) => {
  try {
    const units = getUnitsData();
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    const unit = units.find(u => u.id === req.params.id);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Add host information
    const host = users.find(u => u.id === unit.hostId && u.role === 'host');
    if (host) {
      unit.hostName = `${host.firstName} ${host.lastName}`;
      unit.hostCompanyName = host.companyName || null;
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
      if (booking.pricingType === 'hourly') {
        // For hourly bookings, just add the booking date
        if (booking.bookingDate) {
          bookedDates.push(booking.bookingDate);
        }
      } else {
        // For standard bookings, add all dates in the range
        const start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);
        
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          bookedDates.push(date.toISOString().split('T')[0]);
        }
      }
    });
    
    res.json({ success: true, bookedDates: [...new Set(bookedDates)] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get booked dates for hourly bookings (alias for availability)
router.get('/:id/booked-dates', (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf8'));
    const unitBookings = bookings.filter(b => 
      b.unitId === req.params.id && 
      (b.status === 'confirmed' || b.status === 'pending')
    );
    
    // Get all booked dates
    const bookedDates = [];
    unitBookings.forEach(booking => {
      if (booking.pricingType === 'hourly') {
        // For hourly bookings, just add the booking date
        if (booking.bookingDate) {
          bookedDates.push(booking.bookingDate);
        }
      } else {
        // For standard bookings, add all dates in the range
        const start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);
        
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          bookedDates.push(date.toISOString().split('T')[0]);
        }
      }
    });
    
    res.json({ success: true, bookedDates: [...new Set(bookedDates)] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
