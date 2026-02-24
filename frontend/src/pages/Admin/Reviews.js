import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const Reviews = () => {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = async (reviewId, flagged) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reviews/${reviewId}/flag`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          flagged, 
          reason: flagged ? 'Inappropriate content' : '' 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(flagged ? 'Review flagged' : 'Review unflagged', 'success');
        fetchReviews();
      } else {
        addToast(data.message || 'Action failed', 'error');
      }
    } catch (error) {
      addToast('Error updating review', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reviews/${selectedReview.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Review deleted successfully', 'success');
        setShowModal(false);
        setSelectedReview(null);
        fetchReviews();
      } else {
        addToast(data.message || 'Failed to delete review', 'error');
      }
    } catch (error) {
      addToast('Error deleting review', 'error');
    }
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-600 mt-2">Moderate user reviews</p>
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold">{review.guest?.name || 'Anonymous'}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  {review.flagged && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Flagged
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Unit: {review.unit?.name || 'N/A'}
                </p>
                <p className="text-gray-800">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  size="sm"
                  variant={review.flagged ? 'secondary' : 'danger'}
                  onClick={() => handleFlag(review.id, !review.flagged)}
                >
                  {review.flagged ? 'Unflag' : 'Flag'}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    setSelectedReview(review);
                    setShowModal(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found</p>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedReview(null);
        }}
        title="Delete Review"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this review? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setSelectedReview(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Delete Review
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Reviews;
