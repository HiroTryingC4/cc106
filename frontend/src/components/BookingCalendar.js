/**
 * BookingCalendar Component
 * 
 * Interactive calendar for selecting booking dates with availability checking.
 * Features:
 * - Displays monthly calendar view
 * - Shows booked dates (fetched from API)
 * - Prevents selection of past dates and booked dates
 * - Supports date range selection (check-in to check-out)
 * - Calculates total price based on selected dates
 * - Visual feedback for selection and hover states
 * 
 * @param {string} unitId - ID of the unit to check availability for
 * @param {function} onDateSelect - Callback when dates are selected (startDate, endDate)
 * @param {string} selectedStartDate - Currently selected check-in date (ISO format)
 * @param {string} selectedEndDate - Currently selected check-out date (ISO format)
 * @param {number} pricePerNight - Price per night for the unit
 */
import React, { useState, useEffect } from 'react';

const BookingCalendar = ({ 
  unitId, 
  onDateSelect, 
  selectedStartDate, 
  selectedEndDate,
  pricePerNight = 100 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    if (unitId) {
      fetchBookedDates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId, currentMonth]);

  const fetchBookedDates = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/units/${unitId}/availability`);
      const data = await response.json();
      if (data.success) {
        setBookedDates(data.bookedDates || []);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateBooked = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookedDates.includes(dateStr);
  };

  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date) => {
    if (!selectedStartDate) return false;
    const dateStr = date.toISOString().split('T')[0];
    const startStr = selectedStartDate;
    const endStr = selectedEndDate;
    
    if (!endStr) return dateStr === startStr;
    return dateStr >= startStr && dateStr <= endStr;
  };

  const isDateInRange = (date) => {
    if (!selectedStartDate || !hoveredDate || selectedEndDate) return false;
    
    const start = new Date(selectedStartDate);
    const end = hoveredDate;
    
    return date >= start && date <= end;
  };

  const handleDateClick = (date) => {
    if (isDateBooked(date) || isDateInPast(date)) return;
    
    const dateStr = date.toISOString().split('T')[0];
    
    if (!selectedStartDate || selectedEndDate) {
      // Start new selection
      onDateSelect(dateStr, null);
    } else {
      // Complete selection
      const start = new Date(selectedStartDate);
      if (date < start) {
        onDateSelect(dateStr, null);
      } else {
        onDateSelect(selectedStartDate, dateStr);
      }
    }
  };

  const calculatePrice = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights * pricePerNight;
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-gray-100 rounded text-sm"
        >
          ←
        </button>
        <h3 className="text-sm font-semibold">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded text-sm"
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-[10px] font-medium text-gray-600 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {/* Empty cells for days before month starts */}
        {[...Array(startingDayOfWeek)].map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const date = new Date(year, month, day);
          const isBooked = isDateBooked(date);
          const isPast = isDateInPast(date);
          const isSelected = isDateSelected(date);
          const isInRange = isDateInRange(date);
          const isDisabled = isBooked || isPast;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              disabled={isDisabled}
              className={`
                aspect-square p-1 text-xs rounded transition-colors
                ${isDisabled ? 'bg-red-100 text-red-400 cursor-not-allowed line-through' : ''}
                ${!isDisabled && !isSelected && !isInRange ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}
                ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                ${isInRange && !isSelected ? 'bg-blue-100' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {/* Price calculation */}
      {selectedStartDate && selectedEndDate && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {Math.ceil((new Date(selectedEndDate) - new Date(selectedStartDate)) / (1000 * 60 * 60 * 24))} nights × ₱{pricePerNight}
            </span>
            <span className="text-base font-bold text-blue-600">
              ₱{calculatePrice()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
