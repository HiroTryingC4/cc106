import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const Bookings = () => {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/bookings', {
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

  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = action === 'cancel' 
        ? `http://localhost:5000/api/admin/bookings/${selectedBooking.id}/cancel`
        : `http://localhost:5000/api/admin/bookings/${selectedBooking.id}/status`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
          action === 'cancel' 
            ? { reason: 'Cancelled by admin' }
            : { status: action }
        )
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(`Booking ${action}ed successfully`, 'success');
        setShowModal(false);
        setSelectedBooking(null);
        fetchBookings();
      } else {
        addToast(data.message || 'Action failed', 'error');
      }
    } catch (error) {
      addToast('Error performing action', 'error');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-2">Manage all system bookings</p>
      </div>

      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All ({bookings.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'secondary'}
          onClick={() => setFilter('pending')}
        >
          Pending ({bookings.filter(b => b.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'confirmed' ? 'primary' : 'secondary'}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'secondary'}
          onClick={() => setFilter('completed')}
        >
          Completed ({bookings.filter(b => b.status === 'completed').length})
        </Button>
        <Button
          variant={filter === 'cancelled' ? 'primary' : 'secondary'}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Guest</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Host</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-4 py-3 text-sm">#{booking.id}</td>
                  <td className="px-4 py-3 text-sm">{booking.guest?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{booking.host?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{booking.unit?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">₱{booking.totalPrice}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setActionType('cancel');
                            setShowModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedBooking(null);
        }}
        title={`${actionType === 'cancel' ? 'Cancel' : 'Update'} Booking`}
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to {actionType} booking #{selectedBooking?.id}?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setSelectedBooking(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleAction(actionType)}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Bookings;
