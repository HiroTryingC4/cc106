const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get all reviews
router.get('/', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    
    const enrichedReviews = reviews.map(review => {
      const guest = users.find(u => u.id === review.guestId);
      const unit = units.find(u => u.id === review.unitId);
      
      return {
        ...review,
        guest: guest ? { id: guest.id, name: `${guest.firstName} ${guest.lastName}` } : null,
        unit: unit ? { id: unit.id, name: unit.name } : null
      };
    });
    
    res.json({ success: true, reviews: enrichedReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete review
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    const filteredReviews = reviews.filter(r => r.id !== req.params.id);
    
    if (reviews.length === filteredReviews.length) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    fs.writeFileSync(path.join(__dirname, '../../data/reviews.json'), JSON.stringify(filteredReviews, null, 2));
    
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Flag/unflag review
router.put('/:id/flag', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { flagged, reason } = req.body;
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    const reviewIndex = reviews.findIndex(r => r.id === req.params.id);
    
    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    reviews[reviewIndex].flagged = flagged;
    if (flagged) {
      reviews[reviewIndex].flagReason = reason;
      reviews[reviewIndex].flaggedAt = new Date().toISOString();
    } else {
      delete reviews[reviewIndex].flagReason;
      delete reviews[reviewIndex].flaggedAt;
    }
    
    fs.writeFileSync(path.join(__dirname, '../../data/reviews.json'), JSON.stringify(reviews, null, 2));
    
    res.json({ success: true, message: flagged ? 'Review flagged' : 'Review unflagged' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
