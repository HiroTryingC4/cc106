import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ImageUpload from '../../components/ImageUpload';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';

const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [booking, setBooking] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, [bookingId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const bookingResponse = await fetch(`http://localhost:5000/api/guest/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bookingData = await bookingResponse.json();
      
      if (bookingData.success) {
        setBooking(bookingData.booking);
        
        const reviewResponse = await fetch(`http://localhost:5000/api/guest/reviews/${bookingId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const reviewData = await reviewResponse.json();
        
        if (reviewData.success && reviewData.review) {
          setExistingReview(reviewData.review);
          setRating(reviewData.review.rating);
          setComment(reviewData.review.comment);
          setPhotos(reviewData.review.photos || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      addToast('Please select a rating', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = existingReview 
        ? `http://localhost:5000/api/guest/reviews/${existingReview.id}`
        : 'http://localhost:5000/api/guest/reviews';
      
      const method = existingReview ? 'PUT' : 'POST';
      
      const body = existingReview
        ? { rating, comment, photos }
        : { bookingId, unitId: booking.unitId, rating, comment, photos };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        addToast(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!', 'success');
        setIsEditing(false);
        fetchData();
      } else {
        addToast(data.message || 'Failed to submit review', 'error');
      }
    } catch (error) {
      addToast('Error submitting review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/guest/reviews/${existingReview.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        addToast('Review deleted successfully', 'success');
        navigate(`/guest/bookings/${bookingId}`);
      } else {
        addToast(data.message || 'Failed to delete review', 'error');
      }
    } catch (error) {
      addToast('Error deleting review', 'error');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRating(existingReview.rating);
    setComment(existingReview.comment);
    setPhotos(existingReview.photos || []);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        className="text-4xl focus:outline-none transition-transform hover:scale-110"
        disabled={existingReview && !isEditing}
      >
        <span className={
          star <= (hoveredRating || rating)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }>
          ★
        </span>
      </button>
    ));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Booking not found</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (booking.status !== 'completed') {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">You can only review completed bookings</p>
            <Button onClick={() => navigate(`/guest/bookings/${bookingId}`)} className="mt-4">
              Back to Booking
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {existingReview ? 'Your Review' : 'Write a Review'}
        </h1>
        <p className="text-gray-600 mt-2">Share your experience with this unit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            {existingReview && !isEditing ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">✓ Review Submitted</p>
                  <p className="text-sm text-green-600 mt-1">
                    Thank you for your feedback!
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Your Rating</h3>
                  <div className="flex gap-2">
                    {renderStars()}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Your Review</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment || 'No comment provided'}
                  </p>
                </div>

                {photos && photos.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6 flex gap-3">
                  <Button onClick={() => navigate(`/guest/bookings/${bookingId}`)}>
                    Back to Booking
                  </Button>
                  <Button variant="secondary" onClick={handleEdit}>
                    Edit Review
                  </Button>
                  <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
                    Delete Review
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Rate Your Stay</h3>
                  <div className="flex gap-2">
                    {renderStars()}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {rating === 1 && 'Poor'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Excellent'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with this unit..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Tell us about your stay, the amenities, cleanliness, and overall experience.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos (Optional)
                  </label>
                  <ImageUpload
                    images={photos}
                    onChange={setPhotos}
                    maxImages={5}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Add up to 5 photos from your stay (max 5MB each)
                  </p>
                </div>

                <div className="border-t pt-6 flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={isEditing ? handleCancelEdit : () => navigate(`/guest/bookings/${bookingId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting || rating === 0}>
                    {submitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Review' : 'Submit Review')}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-xl font-semibold mb-4">Booking Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Booking ID</p>
                <p className="font-semibold">#{booking.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Unit</p>
                <p className="font-semibold">{booking.unit?.name || `Unit #${booking.unitId}`}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-in</p>
                <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-out</p>
                <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <Card className="mt-4">
            <h3 className="font-semibold mb-3">Review Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Be honest and constructive</li>
              <li>• Focus on your experience</li>
              <li>• Mention specific details</li>
              <li>• Be respectful</li>
            </ul>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </DashboardLayout>
  );
};

export default Review;
