const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole, checkVerified } = require('../../middleware/auth');

// Get pricing recommendations for a unit
router.get('/:unitId', verifyToken, checkRole('host'), checkVerified, (req, res) => {
  try {
    const { unitId } = req.params;
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    
    // Find the unit
    const unit = units.find(u => u.id === unitId && u.hostId === req.user.id);
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    // Calculate market analysis
    const marketAnalysis = calculateMarketAnalysis(units, unit);
    
    // Generate pricing suggestions
    const pricingSuggestions = generatePricingSuggestions(unit, marketAnalysis, bookings);
    
    // Get competitor pricing
    const competitorPricing = getCompetitorPricing(units, unit);
    
    // Generate seasonal recommendations
    const seasonalRecommendations = getSeasonalRecommendations(unit, bookings);
    
    // Calculate revenue optimization
    const revenueOptimization = calculateRevenueOptimization(unit, bookings, marketAnalysis);

    res.json({
      success: true,
      data: {
        currentPrice: unit.pricePerNight,
        suggestedPrice: pricingSuggestions.recommended,
        priceRange: pricingSuggestions.range,
        marketAnalysis,
        competitorPricing,
        seasonalRecommendations,
        revenueOptimization
      }
    });
  } catch (error) {
    console.error('Pricing error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Calculate market analysis
function calculateMarketAnalysis(units, currentUnit) {
  // Filter similar units (same type, similar location)
  const similarUnits = units.filter(u => 
    u.type === currentUnit.type && 
    u.id !== currentUnit.id &&
    u.available
  );

  if (similarUnits.length === 0) {
    return {
      averagePrice: currentUnit.pricePerNight,
      medianPrice: currentUnit.pricePerNight,
      minPrice: currentUnit.pricePerNight,
      maxPrice: currentUnit.pricePerNight,
      totalUnits: 1,
      occupancyRate: 75,
      demandLevel: 'medium'
    };
  }

  const prices = similarUnits.map(u => u.pricePerNight);
  const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const sortedPrices = prices.sort((a, b) => a - b);
  const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Calculate occupancy rate (simulated based on bookings)
  const occupancyRate = Math.floor(Math.random() * 30) + 60; // 60-90%

  // Determine demand level
  let demandLevel = 'medium';
  if (occupancyRate > 80) demandLevel = 'high';
  else if (occupancyRate < 65) demandLevel = 'low';

  return {
    averagePrice,
    medianPrice,
    minPrice,
    maxPrice,
    totalUnits: similarUnits.length + 1,
    occupancyRate,
    demandLevel
  };
}

// Generate pricing suggestions
function generatePricingSuggestions(unit, marketAnalysis, bookings) {
  const currentPrice = unit.pricePerNight;
  const marketAverage = marketAnalysis.averagePrice;
  
  // Calculate suggested price based on market and unit features
  let suggestedPrice = marketAverage;
  
  // Adjust for amenities
  const amenityBonus = (unit.amenities?.length || 0) * 5;
  suggestedPrice += amenityBonus;
  
  // Adjust for bedrooms
  const bedroomBonus = (unit.bedrooms - 1) * 15;
  suggestedPrice += bedroomBonus;
  
  // Adjust for rating
  if (unit.rating > 4.5) {
    suggestedPrice += 20;
  } else if (unit.rating < 3.5) {
    suggestedPrice -= 15;
  }
  
  // Adjust for demand
  if (marketAnalysis.demandLevel === 'high') {
    suggestedPrice *= 1.15;
  } else if (marketAnalysis.demandLevel === 'low') {
    suggestedPrice *= 0.90;
  }
  
  suggestedPrice = Math.round(suggestedPrice);
  
  // Calculate price range
  const minSuggested = Math.round(suggestedPrice * 0.85);
  const maxSuggested = Math.round(suggestedPrice * 1.15);
  
  // Calculate potential impact
  const priceDifference = suggestedPrice - currentPrice;
  const percentageChange = ((priceDifference / currentPrice) * 100).toFixed(1);
  
  let impact = 'neutral';
  let impactDescription = 'Your current price is competitive';
  
  if (priceDifference > 20) {
    impact = 'increase';
    impactDescription = `You could increase revenue by raising your price by ₱${priceDifference}`;
  } else if (priceDifference < -20) {
    impact = 'decrease';
    impactDescription = `Consider lowering your price by ₱${Math.abs(priceDifference)} to increase bookings`;
  }

  return {
    recommended: suggestedPrice,
    range: {
      min: minSuggested,
      max: maxSuggested
    },
    comparison: {
      current: currentPrice,
      difference: priceDifference,
      percentageChange: parseFloat(percentageChange)
    },
    impact,
    impactDescription
  };
}

// Get competitor pricing
function getCompetitorPricing(units, currentUnit) {
  const competitors = units
    .filter(u => 
      u.type === currentUnit.type && 
      u.id !== currentUnit.id &&
      u.available
    )
    .slice(0, 5)
    .map(u => ({
      id: u.id,
      name: u.name,
      price: u.pricePerNight,
      bedrooms: u.bedrooms,
      rating: u.rating || 0,
      amenities: u.amenities?.length || 0,
      location: u.location
    }));

  return competitors;
}

// Get seasonal recommendations
function getSeasonalRecommendations(unit, bookings) {
  const currentMonth = new Date().getMonth();
  const seasons = [
    { name: 'Winter', months: [11, 0, 1], multiplier: 0.90 },
    { name: 'Spring', months: [2, 3, 4], multiplier: 1.05 },
    { name: 'Summer', months: [5, 6, 7], multiplier: 1.20 },
    { name: 'Fall', months: [8, 9, 10], multiplier: 1.00 }
  ];

  const recommendations = seasons.map(season => {
    const suggestedPrice = Math.round(unit.pricePerNight * season.multiplier);
    const isCurrentSeason = season.months.includes(currentMonth);
    
    let description = '';
    if (season.multiplier > 1.1) {
      description = 'Peak season - High demand expected';
    } else if (season.multiplier < 0.95) {
      description = 'Off-season - Consider competitive pricing';
    } else {
      description = 'Regular season - Standard pricing';
    }

    return {
      season: season.name,
      suggestedPrice,
      multiplier: season.multiplier,
      description,
      isCurrentSeason
    };
  });

  return recommendations;
}

// Calculate revenue optimization
function calculateRevenueOptimization(unit, bookings, marketAnalysis) {
  const currentPrice = unit.pricePerNight;
  const unitBookings = bookings.filter(b => b.unitId === unit.id);
  
  // Calculate current metrics
  const totalBookings = unitBookings.length;
  const confirmedBookings = unitBookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = unitBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  
  // Calculate average booking length
  const avgBookingLength = totalBookings > 0
    ? Math.round(unitBookings.reduce((sum, b) => {
        const checkIn = new Date(b.checkIn);
        const checkOut = new Date(b.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return sum + nights;
      }, 0) / totalBookings)
    : 7;

  // Generate optimization tips
  const tips = [];
  
  if (marketAnalysis.occupancyRate < 70) {
    tips.push({
      title: 'Increase Visibility',
      description: 'Your occupancy rate is below average. Consider lowering your price by 10-15% to attract more bookings.',
      potentialImpact: '+15% bookings',
      priority: 'high'
    });
  }
  
  if (currentPrice < marketAnalysis.averagePrice * 0.85) {
    tips.push({
      title: 'Underpriced Property',
      description: 'Your price is significantly below market average. You could increase revenue without losing bookings.',
      potentialImpact: `+₱${Math.round((marketAnalysis.averagePrice - currentPrice) * 30)}/month`,
      priority: 'high'
    });
  }
  
  if (unit.amenities?.length < 5) {
    tips.push({
      title: 'Add More Amenities',
      description: 'Properties with more amenities can charge 10-20% higher prices. Consider adding WiFi, parking, or kitchen facilities.',
      potentialImpact: '+₱20-40/night',
      priority: 'medium'
    });
  }
  
  if (!unit.instantBooking) {
    tips.push({
      title: 'Enable Instant Booking',
      description: 'Properties with instant booking enabled get 30% more bookings on average.',
      potentialImpact: '+30% bookings',
      priority: 'medium'
    });
  }
  
  tips.push({
    title: 'Seasonal Pricing',
    description: 'Implement dynamic pricing based on seasons. Increase prices by 20% during peak season (Summer).',
    potentialImpact: '+₱500-1000/month',
    priority: 'medium'
  });
  
  if (totalBookings > 0 && confirmedBookings / totalBookings < 0.7) {
    tips.push({
      title: 'Improve Response Time',
      description: 'Quick responses to booking requests increase confirmation rates by up to 40%.',
      potentialImpact: '+40% confirmations',
      priority: 'high'
    });
  }

  // Calculate projected revenue with optimizations
  const currentMonthlyRevenue = totalRevenue / Math.max(1, totalBookings) * 4;
  const optimizedPrice = Math.round(currentPrice * 1.15);
  const projectedMonthlyRevenue = Math.round(currentMonthlyRevenue * 1.25);

  return {
    currentMetrics: {
      totalBookings,
      confirmedBookings,
      totalRevenue,
      avgBookingLength,
      monthlyRevenue: Math.round(currentMonthlyRevenue)
    },
    projectedMetrics: {
      optimizedPrice,
      projectedMonthlyRevenue,
      revenueIncrease: Math.round(projectedMonthlyRevenue - currentMonthlyRevenue),
      percentageIncrease: Math.round(((projectedMonthlyRevenue - currentMonthlyRevenue) / currentMonthlyRevenue) * 100)
    },
    tips
  };
}

module.exports = router;
