import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/guest/bookings/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/guest/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        addToast('Booking cancelled successfully', 'success');
        navigate('/guest/bookings');
      } else {
        addToast(data.message || 'Failed to cancel booking', 'error');
      }
    } catch (error) {
      addToast('Error cancelling booking', 'error');
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
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

  if (!booking) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Booking not found</p>
            <Link to="/guest/bookings">
              <Button>Back to Bookings</Button>
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  const canPay = booking.status === 'pending' && booking.paymentStatus === 'pending';
  const canCheckout = booking.status === 'confirmed' && !booking.checkoutPhotoSubmitted;
  const canReview = booking.status === 'completed';

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to="/guest/bookings" className="text-blue-600 hover:underline mb-2 inline-block">
          ← Back to Bookings
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Booking #{booking.id}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Unit Information</h3>
                <p className="text-gray-600">{booking.unit?.name || `Unit #${booking.unitId}`}</p>
                <p className="text-sm text-gray-500">{booking.unit?.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-semibold">{booking.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nights</p>
                  <p className="font-semibold">
                    {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {booking.unit && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Unit Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-medium">{booking.unit.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bedrooms</p>
                  <p className="font-medium">{booking.unit.bedrooms}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bathrooms</p>
                  <p className="font-medium">{booking.unit.bathrooms}</p>
                </div>
                <div>
                  <p className="text-gray-600">Max Guests</p>
                  <p className="font-medium">{booking.unit.maxGuests}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price</span>
                <span className="font-semibold">₱{booking.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit</span>
                <span className="font-semibold">₱{booking.securityDeposit}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl text-blue-600">
                  ₱{booking.totalPrice + booking.securityDeposit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status</span>
                <span className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {canPay && (
                <Link to={`/guest/payment/${booking.id}`} className="block">
                  <Button className="w-full">Pay Now</Button>
                </Link>
              )}
              {canCheckout && (
                <Link to={`/guest/checkout/${booking.id}`} className="block">
                  <Button className="w-full" variant="secondary">Upload Checkout Photos</Button>
                </Link>
              )}
              {canReview && (
                <Link to={`/guest/review/${booking.id}`} className="block">
                  <Button className="w-full" variant="secondary">Write Review</Button>
                </Link>
              )}
              {canCancel && (
                <Button
                  className="w-full"
                  variant="danger"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Booking
          </Button>
          <Button variant="danger" onClick={handleCancelBooking} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BookingDetails;
