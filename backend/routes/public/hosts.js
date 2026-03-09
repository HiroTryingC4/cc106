const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const getUsersData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8');
  return JSON.parse(data);
};

const getUnitsData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8');
  return JSON.parse(data);
};

const getBookingsData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8');
  return JSON.parse(data);
};

const getReviewsData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8');
  return JSON.parse(data);
};

const getPromoCodesData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/promo_codes.json'), 'utf8');
  return JSON.parse(data);
};

// Get public host profile
router.get('/:hostId', (req, res) => {
  try {
    const { hostId } = req.params;
    const users = getUsersData();
    const units = getUnitsData();
    const bookings = getBookingsData();
    const reviews = getReviewsData();
    const promoCodes = getPromoCodesData();
    
    // Find host
    const host = users.find(u => u.id === hostId && u.role === 'host');
    
    if (!host) {
      return res.status(404).json({ 
        success: false, 
        message: 'Host not found' 
      });
    }
    
    // Get host's units
    const hostUnits = units.filter(u => u.hostId === hostId);
    
    // Get host's active promo codes (only show active, non-expired codes)
    const now = new Date();
    const activePromoCodes = promoCodes.filter(p => {
      if (p.hostId !== hostId || !p.active) return false;
      
      // Check if expired
      if (p.expiresAt && new Date(p.expiresAt) < now) return false;
      
      // Check if usage limit reached
      if (p.usageLimit && p.usageCount >= p.usageLimit) return false;
      
      return true;
    }).map(p => ({
      id: p.id,
      code: p.code,
      type: p.type,
      value: p.value,
      description: p.description,
      expiresAt: p.expiresAt,
      usageLimit: p.usageLimit,
      usageCount: p.usageCount,
      // Show which units this promo applies to
      appliesTo: Array.isArray(p.unitIds) && p.unitIds.length === 0 
        ? 'all' 
        : p.unitIds || []
    }));
    
    // Calculate host statistics
    const hostBookings = bookings.filter(b => b.hostId === hostId);
    const totalBookings = hostBookings.length;
    
    // Calculate average rating from reviews
    const hostReviews = reviews.filter(r => {
      const unit = units.find(u => u.id === r.unitId);
      return unit && unit.hostId === hostId;
    });
    
    const averageRating = hostReviews.length > 0
      ? (hostReviews.reduce((sum, r) => sum + r.rating, 0) / hostReviews.length).toFixed(1)
      : '5.0';
    
    // Prepare public host data (exclude sensitive information)
    const publicHostData = {
      id: host.id,
      name: `${host.firstName} ${host.lastName}`,
      companyName: host.companyName || null,
      email: host.email, // You might want to hide this
      verificationStatus: host.verificationStatus || (host.verified ? 'verified' : 'pending'),
      rating: averageRating,
      reviewCount: hostReviews.length,
      totalBookings: totalBookings,
      memberSince: host.createdAt || new Date().toISOString(),
      bio: host.bio || `Welcome! I'm ${host.firstName} ${host.lastName}${host.companyName ? ` from ${host.companyName}` : ''}. I'm dedicated to providing excellent accommodation experiences for all my guests.`,
      facebook: host.facebook || null,
      instagram: host.instagram || null,
      tiktok: host.tiktok || null,
      website: host.website || null
    };
    
    res.json({
      success: true,
      host: publicHostData,
      units: hostUnits,
      promoCodes: activePromoCodes
    });
  } catch (error) {
    console.error('Error fetching host profile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
