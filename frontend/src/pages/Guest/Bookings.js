import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import BookingsCalendar from '../../components/BookingsCalendar';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/guest/bookings', {
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'upcoming') return booking.status === 'confirmed' && new Date(booking.checkIn) > new Date();
    if (filter === 'past') return booking.status === 'completed';
    if (filter === 'pending') return booking.status === 'pending';
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
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">View and manage your bookings</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('calendar')}
              size="sm"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <BookingsCalendar bookings={bookings} />
      ) : (
        <>
          <div className="mb-6 flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'primary' : 'secondary'}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'secondary'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'past' ? 'primary' : 'secondary'}
              onClick={() => setFilter('past')}
            >
              Past
            </Button>
          </div>

          {filteredBookings.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No bookings found</p>
                <Link to="/units">
                  <Button>Browse Units</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking, idx) => {
                // Backward compatibility: default to 'standard' if pricingType is missing
                const pricingType = booking.pricingType || 'standard';
                
                return (
                  <Card key={`${booking.id}-${idx}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">Booking #{booking.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          {pricingType === 'hourly' && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                              ⏰ Hourly
                            </span>
                          )}
                        </div>
                        
                        {/* Status Notice */}
                        {booking.status === 'pending' && (
                          <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center text-sm">
                              <svg className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span className="text-yellow-800 font-medium">
                                The booking is done, waiting for the confirmation of the host
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {booking.status === 'confirmed' && booking.approvedAt && (
                          <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center text-sm">
                              <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-green-800 font-medium">
                                ✓ Booking confirmed - Ready for payment
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          {pricingType === 'standard' ? (
                            <>
                              <div>
                                <p className="font-medium text-gray-900">Check-in</p>
                                <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Check-out</p>
                                <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Guests</p>
                                <p>{booking.guests}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="font-medium text-gray-900">Booking Date</p>
                                <p>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Duration</p>
                                <p>{booking.hourlyOption?.hours} hours</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Guests</p>
                                <p>{booking.guests || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Time Type</p>
                                <p>{booking.hourlyOption?.isFlexible ? 'Flexible' : 'Fixed'}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Time</p>
                                <p>
                                  {booking.hourlyOption?.isFlexible 
                                    ? `${booking.hourlyOption?.startTime || 'N/A'}`
                                    : `${booking.hourlyOption?.checkInTime || 'N/A'} - ${booking.hourlyOption?.checkOutTime || 'N/A'}`
                                  }
                                </p>
                              </div>
                            </>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Total Price</p>
                            <p className="text-lg font-bold text-blue-600">₱{booking.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={`/guest/bookings/${booking.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Bookings;
