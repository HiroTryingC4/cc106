const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const getBrowsingHistory = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/browsing_history.json'), 'utf8');
  return JSON.parse(data);
};

const saveBrowsingHistory = (history) => {
  fs.writeFileSync(
    path.join(__dirname, '../../data/browsing_history.json'),
    JSON.stringify(history, null, 2)
  );
};

// Track property view
router.post('/track', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const { unitId } = req.body;
    const history = getBrowsingHistory();
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const unit = units.find(u => u.id === unitId);

    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    // Add to browsing history
    history.push({
      id: String(history.length + 1),
      guestId: req.user.id,
      unitId,
      unitType: unit.type,
      pricePerNight: unit.pricePerNight,
      bedrooms: unit.bedrooms,
      maxGuests: unit.maxGuests,
      amenities: unit.amenities,
      viewedAt: new Date().toISOString()
    });

    saveBrowsingHistory(history);
    res.json({ success: true, message: 'View tracked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get guest's browsing history
router.get('/', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const history = getBrowsingHistory();
    const guestHistory = history.filter(h => h.guestId === req.user.id);
    
    // Sort by most recent
    guestHistory.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));

    res.json({ success: true, history: guestHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get browsing analytics for the guest
router.get('/analytics', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const history = getBrowsingHistory();
    const guestHistory = history.filter(h => h.guestId === req.user.id);

    if (guestHistory.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalViews: 0,
          preferredTypes: [],
          averagePriceRange: { min: 0, max: 0 },
          preferredBedrooms: 0,
          preferredGuests: 0,
          commonAmenities: []
        }
      });
    }

    // Calculate preferences
    const types = {};
    let totalPrice = 0;
    let minPrice = Infinity;
    let maxPrice = 0;
    let totalBedrooms = 0;
    let totalGuests = 0;
    const amenityCounts = {};

    guestHistory.forEach(item => {
      // Count types
      types[item.unitType] = (types[item.unitType] || 0) + 1;
      
      // Price analysis
      totalPrice += item.pricePerNight;
      minPrice = Math.min(minPrice, item.pricePerNight);
      maxPrice = Math.max(maxPrice, item.pricePerNight);
      
      // Bedrooms and guests
      totalBedrooms += item.bedrooms;
      totalGuests += item.maxGuests;
      
      // Amenities
      item.amenities.forEach(amenity => {
        amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
      });
    });

    // Get top preferred types
    const preferredTypes = Object.entries(types)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));

    // Get top amenities
    const commonAmenities = Object.entries(amenityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([amenity, count]) => ({ amenity, count }));

    const analytics = {
      totalViews: guestHistory.length,
      preferredTypes,
      averagePriceRange: {
        min: Math.round(minPrice),
        max: Math.round(maxPrice),
        average: Math.round(totalPrice / guestHistory.length)
      },
      preferredBedrooms: Math.round(totalBedrooms / guestHistory.length),
      preferredGuests: Math.round(totalGuests / guestHistory.length),
      commonAmenities
    };

    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
