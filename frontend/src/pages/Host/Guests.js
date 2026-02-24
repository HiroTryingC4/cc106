import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const Guests = () => {
  const { addToast } = useToast();
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState({ show: false, guestId: null, guestName: '' });
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/guests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setGuests(data.guests);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestDetails = async (guestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/guests/${guestId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedGuest(data.guest);
      }
    } catch (error) {
      console.error('Error fetching guest details:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      addToast('Please enter a message', 'error');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: messageModal.guestId,
          toRole: 'guest',
          message: message
        })
      });

      const data = await response.json();
      if (data.success) {
        addToast('Message sent successfully', 'success');
        setMessage('');
        setMessageModal({ show: false, guestId: null, guestName: '' });
      } else {
        addToast(data.message || 'Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addToast('Error sending message', 'error');
    } finally {
      setSending(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
        <p className="text-gray-600 mt-2">View and communicate with your guests</p>
      </div>

      {guests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No guests yet</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guest List */}
          <div className="space-y-4">
            {guests.map(guest => (
              <Card key={guest.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{guest.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guest.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {guest.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📧 {guest.email}</p>
                      {guest.phone && <p>📱 {guest.phone}</p>}
                      <p className="font-medium text-gray-900">
                        {guest.totalBookings} bookings • ₱{guest.totalSpent} spent
                      </p>
                      {guest.lastBookingDate && (
                        <p className="text-xs">
                          Last booking: {new Date(guest.lastBookingDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => fetchGuestDetails(guest.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setMessageModal({ show: true, guestId: guest.id, guestName: guest.name })}
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Guest Details */}
          <div>
            {selectedGuest ? (
              <Card>
                <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedGuest.name}</h3>
                    <p className="text-sm text-gray-600">{selectedGuest.email}</p>
                    {selectedGuest.phone && <p className="text-sm text-gray-600">{selectedGuest.phone}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedGuest.totalBookings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-green-600">₱{selectedGuest.totalSpent}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Booking History</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedGuest.bookings.map(booking => (
                        <div key={booking.id} className="border border-gray-200 rounded p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">#{booking.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{booking.unitName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-medium text-blue-600 mt-1">₱{booking.totalPrice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12 text-gray-500">
                  Select a guest to view details
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      <Modal
        isOpen={messageModal.show}
        onClose={() => {
          setMessageModal({ show: false, guestId: null, guestName: '' });
          setMessage('');
        }}
        title={`Send Message to ${messageModal.guestName}`}
      >
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message here..."
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setMessageModal({ show: false, guestId: null, guestName: '' });
                setMessage('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Guests;
