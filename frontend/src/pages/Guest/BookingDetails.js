import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import CancellationPolicyDisplay from '../../components/CancellationPolicyDisplay';
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
  
  // Backward compatibility: default to 'standard' if pricingType is missing
  const pricingType = booking.pricingType || 'standard';

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
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">Booking #{booking.id}</h2>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(booking.id);
                      addToast('Booking number copied!', 'success');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy booking number"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Reference:</span>
                  <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    SS-{new Date(booking.createdAt).getFullYear()}-{String(booking.id).padStart(4, '0')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                {pricingType === 'hourly' && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    ⏰ Hourly
                  </span>
                )}
              </div>
            </div>

            {/* Instant Booking Notice */}
            {booking.status === 'confirmed' && booking.approvedAt && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-green-900">
                      ✓ Instant Booking Confirmed
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      This booking was automatically confirmed. You can proceed to payment immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {booking.status === 'pending' && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-yellow-900">
                      ⏳ Waiting for Host Approval
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your booking request has been submitted. The host will review and approve it shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Unit Information</h3>
                <p className="text-gray-600">{booking.unit?.name || `Unit #${booking.unitId}`}</p>
                <p className="text-sm text-gray-500">{booking.unit?.location}</p>
                {booking.unit?.hostId && (
                  <Link 
                    to={`/hosts/${booking.unit.hostId}`}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    View Host Profile
                  </Link>
                )}
              </div>

              {pricingType === 'standard' ? (
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
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <p className="font-semibold">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{booking.hourlyOption?.hours} hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold">{booking.guests || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Type</p>
                    <p className="font-semibold">
                      {booking.hourlyOption?.isFlexible ? '✨ Flexible Time' : '🕐 Fixed Time'}
                    </p>
                  </div>
                  {booking.hourlyOption?.isFlexible ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Start Time</p>
                        <p className="font-semibold">{booking.hourlyOption?.startTime || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">End Time</p>
                        <p className="font-semibold">
                          {booking.hourlyOption?.checkOutTime || 'N/A'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Check-in Time</p>
                        <p className="font-semibold">{booking.hourlyOption?.checkInTime || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out Time</p>
                        <p className="font-semibold">{booking.hourlyOption?.checkOutTime || 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>
              )}
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

          {/* Cancellation Policy */}
          {booking.unit?.cancellationPolicy && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
              <CancellationPolicyDisplay 
                policy={booking.unit.cancellationPolicy} 
                customPolicy={booking.unit.customCancellation}
              />
            </Card>
          )}

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
