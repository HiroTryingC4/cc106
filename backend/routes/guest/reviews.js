const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Submit a review
router.post('/', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const { bookingId, unitId, rating, comment, photos } = req.body;

    if (!bookingId || !unitId || !rating) {
      return res.status(400).json({ success: false, message: 'Booking ID, unit ID, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Verify booking exists and belongs to guest
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const booking = bookings.find(b => b.id === bookingId && b.guestId === req.user.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed bookings' });
    }

    const reviewsPath = path.join(__dirname, '../../data/reviews.json');
    let reviews = [];
    
    if (fs.existsSync(reviewsPath)) {
      reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    }

    // Check if review already exists
    const existingReview = reviews.find(r => r.bookingId === bookingId);
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Review already submitted for this booking' });
    }

    const newReview = {
      id: String(reviews.length + 1),
      bookingId,
      unitId,
      guestId: req.user.id,
      guestName: req.user.name,
      rating: Number(rating),
      comment: comment || '',
      photos: photos || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reviews.push(newReview);
    fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));

    res.json({ success: true, message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get review for a booking
router.get('/:bookingId', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const { bookingId } = req.params;
    const reviewsPath = path.join(__dirname, '../../data/reviews.json');
    
    if (!fs.existsSync(reviewsPath)) {
      return res.json({ success: true, review: null });
    }

    const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    const review = reviews.find(r => r.bookingId === bookingId && r.guestId === req.user.id);

    res.json({ success: true, review: review || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all reviews by guest
router.get('/', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const reviewsPath = path.join(__dirname, '../../data/reviews.json');
    
    if (!fs.existsSync(reviewsPath)) {
      return res.json({ success: true, reviews: [] });
    }

    const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    const guestReviews = reviews.filter(r => r.guestId === req.user.id);

    res.json({ success: true, reviews: guestReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a review
router.put('/:reviewId', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, photos } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating is required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const reviewsPath = path.join(__dirname, '../../data/reviews.json');
    
    if (!fs.existsSync(reviewsPath)) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    const reviewIndex = reviews.findIndex(r => r.id === reviewId && r.guestId === req.user.id);

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      rating: Number(rating),
      comment: comment || '',
      photos: photos || reviews[reviewIndex].photos || [],
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));

    res.json({ success: true, message: 'Review updated successfully', review: reviews[reviewIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a review
router.delete('/:reviewId', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const { reviewId } = req.params;
    const reviewsPath = path.join(__dirname, '../../data/reviews.json');
    
    if (!fs.existsSync(reviewsPath)) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
    const reviewIndex = reviews.findIndex(r => r.id === reviewId && r.guestId === req.user.id);

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    reviews.splice(reviewIndex, 1);
    fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
