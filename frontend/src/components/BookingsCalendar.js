import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';

const BookingsCalendar = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateBookings, setSelectedDateBookings] = useState({ show: false, date: null, bookings: [] });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const currentDate = new Date(date);
      
      // Reset time to compare only dates
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      return currentDate >= checkIn && currentDate <= checkOut;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDateClick = (date, dayBookings) => {
    if (dayBookings.length > 0) {
      setSelectedDateBookings({
        show: true,
        date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        bookings: dayBookings
      });
    }
  };

  return (
    <Card>
      <div className="p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(year, month, day);
            const dayBookings = getBookingsForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div
                key={day}
                onClick={() => handleDateClick(date, dayBookings)}
                className={`aspect-square border rounded-lg p-1 relative ${
                  isToday ? 'border-blue-500 border-2' : 'border-gray-200'
                } ${dayBookings.length > 0 ? 'bg-blue-50 cursor-pointer hover:bg-blue-100 transition' : 'bg-white'}`}
              >
                <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day}
                </div>
                
                {/* Booking indicators */}
                {dayBookings.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayBookings.slice(0, 2).map((booking, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full ${getStatusColor(booking.status)}`}
                        title={`${booking.guest?.name || 'Guest'} - ${booking.status}`}
                      />
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-gray-600 text-center font-medium">
                        +{dayBookings.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-gray-600">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm text-gray-600">Cancelled</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">💡 Click on a date with bookings to view details</p>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={selectedDateBookings.show}
        onClose={() => setSelectedDateBookings({ show: false, date: null, bookings: [] })}
        title={`Bookings on ${selectedDateBookings.date}`}
      >
        <div className="space-y-4">
          {selectedDateBookings.bookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">Booking #{booking.id}</h4>
                  <p className="text-sm text-gray-600">{booking.unit?.name || 'N/A'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Guest</p>
                  <p className="font-medium">{booking.guest?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Number of Guests</p>
                  <p className="font-medium">{booking.guests} guests</p>
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
                  <p className="text-gray-600">Total Price</p>
                  <p className="font-medium text-blue-600">₱{booking.totalPrice}</p>
                </div>
                <div>
                  <p className="text-gray-600">Contact</p>
                  <p className="font-medium text-xs">{booking.guest?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}

          {selectedDateBookings.bookings.length === 0 && (
            <p className="text-center text-gray-500 py-4">No bookings on this date</p>
          )}

          <div className="pt-4 border-t">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setSelectedDateBookings({ show: false, date: null, bookings: [] })}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default BookingsCalendar;
