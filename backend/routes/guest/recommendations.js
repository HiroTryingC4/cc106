const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const getUnits = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
};

const getBrowsingHistory = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/browsing_history.json'), 'utf8'));
};

const getBookings = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
};

// Calculate similarity score between two units
function calculateSimilarity(unit, preferences) {
  let score = 0;
  
  // Type match (highest weight)
  if (preferences.preferredTypes.some(t => t.type === unit.type)) {
    const typeRank = preferences.preferredTypes.findIndex(t => t.type === unit.type);
    score += (3 - typeRank) * 30; // 30, 60, or 90 points based on rank
  }
  
  // Price range match
  if (unit.pricePerNight >= preferences.priceRange.min && 
      unit.pricePerNight <= preferences.priceRange.max) {
    score += 40;
  } else {
    // Partial points for being close to range
    const priceDiff = Math.min(
      Math.abs(unit.pricePerNight - preferences.priceRange.min),
      Math.abs(unit.pricePerNight - preferences.priceRange.max)
    );
    score += Math.max(0, 40 - (priceDiff / 100));
  }
  
  // Bedrooms match
  if (unit.bedrooms === preferences.preferredBedrooms) {
    score += 20;
  } else if (Math.abs(unit.bedrooms - preferences.preferredBedrooms) === 1) {
    score += 10;
  }
  
  // Guest capacity match
  if (unit.maxGuests >= preferences.preferredGuests) {
    score += 15;
  }
  
  // Amenities match
  const matchingAmenities = unit.amenities.filter(amenity =>
    preferences.commonAmenities.some(pref => pref.amenity === amenity)
  );
  score += matchingAmenities.length * 5;
  
  // Rating boost
  score += unit.rating * 5;
  
  return score;
}

// Get smart recommendations
router.get('/', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const units = getUnits();
    const browsingHistory = getBrowsingHistory();
    const bookings = getBookings();
    
    const guestHistory = browsingHistory.filter(h => h.guestId === req.user.id);
    const guestBookings = bookings.filter(b => b.guestId === req.user.id);
    
    // If no history, return popular units
    if (guestHistory.length === 0 && guestBookings.length === 0) {
      const popularUnits = units
        .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
        .slice(0, 6)
        .map(unit => ({
          ...unit,
          recommendationReason: 'Popular choice',
          matchScore: 0
        }));
      
      return res.json({
        success: true,
        recommendations: popularUnits,
        hasPersonalizedData: false
      });
    }
    
    // Calculate user preferences from history
    const types = {};
    let totalPrice = 0;
    let minPrice = Infinity;
    let maxPrice = 0;
    let totalBedrooms = 0;
    let totalGuests = 0;
    const amenityCounts = {};
    
    guestHistory.forEach(item => {
      types[item.unitType] = (types[item.unitType] || 0) + 1;
      totalPrice += item.pricePerNight;
      minPrice = Math.min(minPrice, item.pricePerNight);
      maxPrice = Math.max(maxPrice, item.pricePerNight);
      totalBedrooms += item.bedrooms;
      totalGuests += item.maxGuests;
      item.amenities.forEach(amenity => {
        amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
      });
    });
    
    // Add booking history to preferences
    guestBookings.forEach(booking => {
      const unit = units.find(u => u.id === booking.unitId);
      if (unit) {
        types[unit.type] = (types[unit.type] || 0) + 2; // Weight bookings higher
        totalPrice += unit.pricePerNight;
        totalBedrooms += unit.bedrooms;
        totalGuests += unit.maxGuests;
        unit.amenities.forEach(amenity => {
          amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 2;
        });
      }
    });
    
    const totalItems = guestHistory.length + guestBookings.length;
    
    const preferences = {
      preferredTypes: Object.entries(types)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type]) => ({ type })),
      priceRange: {
        min: Math.round(minPrice * 0.8),
        max: Math.round(maxPrice * 1.2),
        average: Math.round(totalPrice / totalItems)
      },
      preferredBedrooms: Math.round(totalBedrooms / totalItems),
      preferredGuests: Math.round(totalGuests / totalItems),
      commonAmenities: Object.entries(amenityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([amenity]) => ({ amenity }))
    };
    
    // Get viewed/booked unit IDs to exclude
    const viewedUnitIds = new Set(guestHistory.map(h => h.unitId));
    const bookedUnitIds = new Set(guestBookings.map(b => b.unitId));
    
    // Calculate scores for all units
    const scoredUnits = units
      .filter(unit => !viewedUnitIds.has(unit.id) && !bookedUnitIds.has(unit.id))
      .map(unit => {
        const score = calculateSimilarity(unit, preferences);
        let reason = 'Matches your preferences';
        
        // Determine specific reason
        if (preferences.preferredTypes[0] && unit.type === preferences.preferredTypes[0].type) {
          reason = `Perfect ${unit.type} match`;
        } else if (unit.rating >= 4.5) {
          reason = 'Highly rated property';
        } else if (preferences.commonAmenities.some(a => unit.amenities.includes(a.amenity))) {
          reason = 'Has amenities you love';
        }
        
        return {
          ...unit,
          matchScore: Math.round(score),
          recommendationReason: reason
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);
    
    res.json({
      success: true,
      recommendations: scoredUnits,
      hasPersonalizedData: true,
      preferences
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get "Similar to" recommendations for a specific unit
router.get('/similar/:unitId', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const units = getUnits();
    const targetUnit = units.find(u => u.id === req.params.unitId);
    
    if (!targetUnit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Create preferences based on target unit
    const preferences = {
      preferredTypes: [{ type: targetUnit.type }],
      priceRange: {
        min: Math.round(targetUnit.pricePerNight * 0.7),
        max: Math.round(targetUnit.pricePerNight * 1.3),
        average: targetUnit.pricePerNight
      },
      preferredBedrooms: targetUnit.bedrooms,
      preferredGuests: targetUnit.maxGuests,
      commonAmenities: targetUnit.amenities.slice(0, 5).map(amenity => ({ amenity }))
    };
    
    // Find similar units
    const similarUnits = units
      .filter(unit => unit.id !== targetUnit.id)
      .map(unit => {
        const score = calculateSimilarity(unit, preferences);
        return {
          ...unit,
          matchScore: Math.round(score),
          recommendationReason: 'Similar property'
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);
    
    res.json({
      success: true,
      recommendations: similarUnits,
      basedOn: {
        id: targetUnit.id,
        name: targetUnit.name,
        type: targetUnit.type
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get trending/popular recommendations
router.get('/trending', (req, res) => {
  try {
    const units = getUnits();
    const bookings = getBookings();
    
    // Calculate popularity score
    const unitPopularity = {};
    bookings.forEach(booking => {
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        unitPopularity[booking.unitId] = (unitPopularity[booking.unitId] || 0) + 1;
      }
    });
    
    // Get trending units
    const trendingUnits = units
      .map(unit => ({
        ...unit,
        bookingCount: unitPopularity[unit.id] || 0,
        popularityScore: (unitPopularity[unit.id] || 0) * unit.rating
      }))
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 6)
      .map(unit => ({
        ...unit,
        recommendationReason: 'Trending now'
      }));
    
    res.json({
      success: true,
      recommendations: trendingUnits
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
