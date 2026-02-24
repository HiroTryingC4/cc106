import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import BookingsCalendar from '../../components/BookingsCalendar';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

const Bookings = () => {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [actionModal, setActionModal] = useState({ show: false, booking: null, action: null });
  const [guestProfileModal, setGuestProfileModal] = useState({ show: false, guest: null });
  const [processing, setProcessing] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  
  const isVerified = user?.verified;

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await refreshUser();
    setTimeout(() => setRefreshing(false), 500);
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = actionModal.action === 'approve' ? 'approve' : 'reject';
      const response = await fetch(`http://localhost:5000/api/host/bookings/${actionModal.booking.id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'Host decision' })
      });

      const data = await response.json();
      if (data.success) {
        addToast(`Booking ${actionModal.action}d successfully`, 'success');
        fetchBookings();
      } else {
        addToast(data.message || `Failed to ${actionModal.action} booking`, 'error');
      }
    } catch (error) {
      addToast(`Error ${actionModal.action}ing booking`, 'error');
    } finally {
      setProcessing(false);
      setActionModal({ show: false, booking: null, action: null });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'pending') return booking.status === 'pending';
    if (filter === 'confirmed') return booking.status === 'confirmed';
    if (filter === 'completed') return booking.status === 'completed';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      {/* Verification Warning Banner */}
      {!isVerified && (
        <Card className="mb-6 bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔒</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">
                Read-Only Mode - Verification Required
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                You're viewing bookings in read-only mode. Complete verification to approve or reject bookings.
              </p>
              <div className="flex gap-2">
                <Link to="/host/verification">
                  <Button size="sm">
                    Complete Verification
                  </Button>
                </Link>
                <Button size="sm" variant="secondary" onClick={handleRefreshStatus} disabled={refreshing}>
                  {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Status'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">Manage your property bookings</p>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'secondary'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'primary' : 'secondary'}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'secondary'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List View
            </span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              viewMode === 'calendar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar View
            </span>
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <BookingsCalendar bookings={filteredBookings} />
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredBookings.map(booking => (
                <Card key={booking.id}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">Booking #{booking.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        {booking.paymentStatus === 'paid' && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Unit</p>
                          <p className="font-medium">{booking.unit?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Guest</p>
                          <p className="font-medium">{booking.guest?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Check-in</p>
                          <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Check-out</p>
                          <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Guests</p>
                          <p className="font-medium">{booking.guests}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Price</p>
                          <p className="font-medium text-blue-600">₱{booking.totalPrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Security Deposit</p>
                          <p className="font-medium">₱{booking.securityDeposit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Contact</p>
                          <p className="font-medium text-sm">{booking.guest?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setGuestProfileModal({ show: true, guest: booking.guest })}
                      >
                        View Guest
                      </Button>
                      {booking.status === 'pending' && (
                        <>
                          {isVerified ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setActionModal({ show: true, booking, action: 'approve' })}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => setActionModal({ show: true, booking, action: 'reject' })}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" disabled title="Verification required">
                                🔒 Approve
                              </Button>
                              <Button size="sm" variant="danger" disabled title="Verification required">
                                🔒 Reject
                              </Button>
                            </>
                          )}
                        </>
                      )}
                      {booking.status === 'confirmed' && booking.checkoutPhotos && (
                        <Button size="sm" variant="secondary">
                          View Photos
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={actionModal.show}
        onClose={() => setActionModal({ show: false, booking: null, action: null })}
        title={`${actionModal.action === 'approve' ? 'Approve' : 'Reject'} Booking`}
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to {actionModal.action} booking #{actionModal.booking?.id}?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setActionModal({ show: false, booking: null, action: null })}
          >
            Cancel
          </Button>
          <Button
            variant={actionModal.action === 'approve' ? 'primary' : 'danger'}
            onClick={handleAction}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Yes, ${actionModal.action}`}
          </Button>
        </div>
      </Modal>

      {/* Guest Profile Modal */}
      <Modal
        isOpen={guestProfileModal.show}
        onClose={() => setGuestProfileModal({ show: false, guest: null })}
        title="Guest Profile"
      >
        {guestProfileModal.guest && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                {guestProfileModal.guest.name?.charAt(0) || 'G'}
              </div>
              <div>
                <h3 className="text-xl font-bold">{guestProfileModal.guest.name}</h3>
                <p className="text-gray-600">{guestProfileModal.guest.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{guestProfileModal.guest.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">
                  {guestProfileModal.guest.createdAt 
                    ? new Date(guestProfileModal.guest.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="font-medium">{guestProfileModal.guest.totalBookings || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {guestProfileModal.guest.status || 'Active'}
                </span>
              </div>
            </div>

            {guestProfileModal.guest.bio && (
              <div>
                <p className="text-sm text-gray-600 mb-1">About</p>
                <p className="text-gray-800">{guestProfileModal.guest.bio}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Link to="/host/messages">
                <Button className="w-full">
                  Send Message
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Bookings;
