import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import BookingCalendar from '../../components/BookingCalendar';
import GuestDetailsForm from '../../components/GuestDetailsForm';
import CancellationPolicyDisplay from '../../components/CancellationPolicyDisplay';
import { useToast } from '../../components/Toast';

const CreateBooking = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pricingType, setPricingType] = useState('standard');
  const [selectedHourlyOption, setSelectedHourlyOption] = useState(null);
  const [flexibleStartTime, setFlexibleStartTime] = useState('');
  const [hourlyBookingDate, setHourlyBookingDate] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [guestDetails, setGuestDetails] = useState([]);

  useEffect(() => {
    fetchUnit();
    fetchBookedDates();
  }, [unitId]);

  // Initialize guest details when guest count changes
  useEffect(() => {
    if (formData.guests > 0) {
      const newGuestDetails = Array.from({ length: formData.guests }, (_, index) => ({
        guestNumber: index + 1,
        isPrimary: index === 0,
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        idType: '',
        idNumber: '',
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      }));
      setGuestDetails(newGuestDetails);
    }
  }, [formData.guests]);

  const fetchUnit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/units/${unitId}`);
      const data = await response.json();
      if (data.success) {
        setUnit(data.unit);
      }
    } catch (error) {
      console.error('Error fetching unit:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedDates = async () => {
    try {
      console.log('Fetching booked dates for unit:', unitId);
      const response = await fetch(`http://localhost:5000/api/units/${unitId}/booked-dates`);
      const data = await response.json();
      console.log('Booked dates response:', data);
      if (data.success) {
        console.log('Setting booked dates:', data.bookedDates);
        setBookedDates(data.bookedDates || []);
      }
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  // Standard pricing calculation
  const calculateStandardPrice = () => {
    if (!formData.checkIn || !formData.checkOut || !unit) return 0;
    const nights = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
    const basePrice = nights * unit.pricePerNight;
    
    // Calculate extra guest fee
    const baseGuests = unit.baseGuestsIncluded || 2; // Use unit's base guests included
    const extraGuests = Math.max(0, formData.guests - baseGuests);
    const extraGuestFee = unit.extraGuestFee || 0;
    const totalExtraGuestFee = extraGuests * extraGuestFee * nights;
    
    return basePrice + totalExtraGuestFee;
  };

  // Hourly pricing calculation
  const calculateHourlyPrice = () => {
    if (selectedHourlyOption === null || !unit.hourlyPricing || !unit.hourlyPricing[selectedHourlyOption]) {
      return 0;
    }
    
    const option = unit.hourlyPricing[selectedHourlyOption];
    const basePrice = parseFloat(option.price);
    
    // Calculate extra guest fee for hourly bookings
    const baseGuests = unit.baseGuestsIncluded || 2; // Use unit's base guests included
    const extraGuests = Math.max(0, formData.guests - baseGuests);
    const extraGuestFee = unit.extraGuestFee || 0;
    const totalExtraGuestFee = extraGuests * extraGuestFee;
    
    return basePrice + totalExtraGuestFee;
  };

  // Unified price calculation based on pricing type
  const calculatePrice = () => {
    if (pricingType === 'standard') {
      return calculateStandardPrice();
    } else if (pricingType === 'hourly') {
      return calculateHourlyPrice();
    }
    return 0;
  };

  // Total price including security deposit
  const calculateTotalPrice = () => {
    return calculatePrice() + (unit?.securityDeposit || 200);
  };

  const calculateExtraGuestFee = () => {
    if (!formData.checkIn || !formData.checkOut || !unit) return 0;
    const nights = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
    const baseGuests = unit.baseGuestsIncluded || 2; // Use unit's base guests included
    const extraGuests = Math.max(0, formData.guests - baseGuests);
    const extraGuestFee = unit.extraGuestFee || 0;
    return extraGuests * extraGuestFee * nights;
  };

  const calculateEndTime = (startTime, hours) => {
    if (!startTime) return '';
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(startDate.getTime() + parseInt(hours) * 60 * 60 * 1000);
    
    return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
  };

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  // Convert 12-hour time to 24-hour format
  const convertTo24Hour = (hours12, minutes, period) => {
    let hours = parseInt(hours12);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Calendar helper functions for hourly booking date picker
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleCalendarDateClick = (date) => {
    if (isDateInPast(date)) return;
    const dateStr = date.toISOString().split('T')[0];
    setHourlyBookingDate(dateStr);
  };

  const prevMonth = () => {
    const { year, month } = getDaysInMonth(calendarMonth);
    setCalendarMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    const { year, month } = getDaysInMonth(calendarMonth);
    setCalendarMonth(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateSelect = (startDate, endDate) => {
    setFormData({
      ...formData,
      checkIn: startDate,
      checkOut: endDate || ''
    });
  };

  const updateGuestDetail = (index, field, value) => {
    const updated = [...guestDetails];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setGuestDetails(updated);
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateGuestDetails = () => {
    for (let i = 0; i < guestDetails.length; i++) {
      const guest = guestDetails[i];
      
      if (!guest.fullName.trim()) {
        addToast(`Please enter full name for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!guest.email.trim() || !/\S+@\S+\.\S+/.test(guest.email)) {
        addToast(`Please enter valid email for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!guest.phone.trim()) {
        addToast(`Please enter phone for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!guest.dateOfBirth) {
        addToast(`Please enter date of birth for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      // Check age (must be 18+ unless unit accepts minors)
      const age = calculateAge(guest.dateOfBirth);
      if (age < 18 && !unit.acceptsMinors) {
        addToast(`This unit requires all guests to be 18 or older. Guest ${i + 1} is ${age} years old.`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!guest.gender) {
        addToast(`Please select gender for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!guest.nationality.trim()) {
        addToast(`Please enter nationality for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!guest.idType) {
        addToast(`Please select ID type for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!guest.idNumber.trim()) {
        addToast(`Please enter ID number for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!guest.street.trim() || !guest.city.trim() || !guest.state.trim() || 
          !guest.country.trim() || !guest.postalCode.trim()) {
        addToast(`Please complete address for Guest ${i + 1}`, 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation based on pricing type
    if (pricingType === 'standard') {
      if (!formData.checkIn || !formData.checkOut) {
        addToast('Please select check-in and check-out dates', 'error');
        return;
      }

      if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
        addToast('Check-out date must be after check-in date', 'error');
        return;
      }

      if (formData.guests > unit.maxGuests) {
        addToast(`Maximum ${unit.maxGuests} guests allowed`, 'error');
        return;
      }
    } else if (pricingType === 'hourly') {
      // Validate hourly pricing selection in order
      if (selectedHourlyOption === null || selectedHourlyOption === undefined) {
        addToast('Please select an hourly pricing option (1 Hour, 2 Hours, etc.)', 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (!hourlyBookingDate) {
        addToast('Please select a booking date from the calendar', 'error');
        return;
      }

      const guestCount = parseInt(formData.guests) || 1;
      if (guestCount < 1) {
        addToast('Please enter the number of guests', 'error');
        return;
      }

      if (guestCount > unit.maxGuests) {
        addToast(`Maximum ${unit.maxGuests} guests allowed`, 'error');
        return;
      }

      const option = unit.hourlyPricing[selectedHourlyOption];
      if (option && option.isFlexible && !flexibleStartTime) {
        addToast('Please select a start time for your booking', 'error');
        return;
      }
    }

    // Validate guest details before showing confirmation
    if (!validateGuestDetails()) {
      return;
    }

    // Show confirmation dialog instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setShowConfirmation(false);
    
    try {
      const token = localStorage.getItem('token');
      
      // Build booking payload based on pricing type
      const bookingPayload = {
        unitId,
        pricingType,
        totalPrice: calculateTotalPrice(),
        guestDetails: guestDetails.map(guest => ({
          ...guest,
          age: calculateAge(guest.dateOfBirth),
          address: {
            street: guest.street,
            city: guest.city,
            state: guest.state,
            country: guest.country,
            postalCode: guest.postalCode
          }
        })),
        guestDetailsCompleted: true,
        guestDetailsCompletedAt: new Date().toISOString()
      };
      
      if (pricingType === 'standard') {
        // Standard pricing: include checkIn, checkOut, guests
        bookingPayload.checkIn = formData.checkIn;
        bookingPayload.checkOut = formData.checkOut;
        bookingPayload.guests = parseInt(formData.guests) || 1;
      } else if (pricingType === 'hourly') {
        // Hourly pricing: include selected option details, booking date, and guests
        const option = unit.hourlyPricing[selectedHourlyOption];
        bookingPayload.bookingDate = hourlyBookingDate;
        bookingPayload.guests = parseInt(formData.guests) || 1;
        bookingPayload.hourlyOption = {
          hours: option.hours,
          price: option.price,
          isFlexible: option.isFlexible,
          checkInTime: option.isFlexible ? flexibleStartTime : option.checkInTime,
          checkOutTime: option.isFlexible 
            ? calculateEndTime(flexibleStartTime, option.hours)
            : option.checkOutTime
        };
        
        // For flexible options, include the start time
        if (option.isFlexible) {
          bookingPayload.hourlyOption.startTime = flexibleStartTime;
        }
      }
      
      console.log('=== BOOKING PAYLOAD DEBUG ===');
      console.log('Full payload:', JSON.stringify(bookingPayload, null, 2));
      console.log('Pricing type:', pricingType);
      console.log('Guests:', formData.guests, 'Type:', typeof formData.guests);
      console.log('Guest details count:', guestDetails.length);
      console.log('Selected hourly option index:', selectedHourlyOption);
      console.log('Hourly booking date:', hourlyBookingDate);
      if (pricingType === 'hourly' && bookingPayload.hourlyOption) {
        console.log('Hourly option details:', JSON.stringify(bookingPayload.hourlyOption, null, 2));
      }
      console.log('=== END DEBUG ===');
      
      const response = await fetch('http://localhost:5000/api/guest/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();
      if (data.success) {
        addToast('Booking created successfully! Proceeding to payment...', 'success');
        // Go directly to payment (skip guest info page since we already have the details)
        navigate(`/guest/payment/${data.booking.id}`);
      } else {
        console.error('Booking error:', data);
        addToast(data.message || 'Failed to create booking', 'error');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      addToast('Error creating booking', 'error');
    } finally {
      setSubmitting(false);
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

  if (!unit) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Unit not found</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const totalPrice = calculatePrice();
  const totalPriceWithDeposit = calculateTotalPrice();
  const extraGuestFeeTotal = calculateExtraGuestFee();
  const baseGuests = unit?.baseGuestsIncluded || 2; // Use unit's base guests included
  const extraGuests = Math.max(0, formData.guests - baseGuests);
  const nights = formData.checkIn && formData.checkOut 
    ? Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <DashboardLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate(`/guest/units/${unitId}`)}
        className="inline-flex items-center text-gray-600 hover:text-[#4E7B22] mb-6 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to unit details
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Booking</h1>
        <p className="text-gray-600 mt-2">Book your stay at {unit.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pricing Type Selector */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3 text-gray-900">Select Pricing Type</label>
                <div className="flex gap-4">
                  {/* Standard Per Night Option */}
                  <button
                    type="button"
                    className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      pricingType === 'standard'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => setPricingType('standard')}
                  >
                    <span className="text-3xl mb-2">🌙</span>
                    <span className="font-semibold text-gray-900 mb-1">Standard Per Night</span>
                    <span className="text-sm text-gray-600">₱{unit.pricePerNight}/night</span>
                  </button>

                  {/* Hourly Pricing Option - Only show if unit has hourly pricing */}
                  {unit.hourlyPricing && unit.hourlyPricing.length > 0 && (
                    <button
                      type="button"
                      className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        pricingType === 'hourly'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50'
                      }`}
                      onClick={() => setPricingType('hourly')}
                    >
                      <span className="text-3xl mb-2">⏰</span>
                      <span className="font-semibold text-gray-900 mb-1">Hourly Pricing</span>
                      <span className="text-sm text-gray-600">{unit.hourlyPricing.length} option{unit.hourlyPricing.length > 1 ? 's' : ''}</span>
                    </button>
                  )}
                </div>
                
                {/* Informational message when hourly pricing is not available */}
                {(!unit.hourlyPricing || unit.hourlyPricing.length === 0) && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      This unit only offers standard per-night pricing at this time.
                    </span>
                  </div>
                )}
              </div>

              {/* Standard Pricing Section */}
              {pricingType === 'standard' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Select Your Dates</h3>
                  
                  {/* Stay Duration Warning for Fixed Hours */}
                  {unit.stayDuration && unit.stayDuration !== 'flexible' && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">⚠️</span>
                        <div>
                          <div className="font-semibold text-yellow-900 mb-1">
                            {unit.stayDuration === 'fixed_22' && 'This unit is for 22-hour stays only'}
                            {unit.stayDuration === 'fixed_12' && 'This unit is for 12-hour stays only'}
                            {unit.stayDuration === 'fixed_6' && 'This unit is for 6-hour stays only'}
                          </div>
                          <p className="text-sm text-yellow-800">
                            Please select check-in and check-out times accordingly. The booking duration must match the specified hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <BookingCalendar
                    unitId={unitId}
                    onDateSelect={handleDateSelect}
                    selectedStartDate={formData.checkIn}
                    selectedEndDate={formData.checkOut}
                    pricePerNight={unit.pricePerNight}
                  />

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Guest Information</h3>
                    
                    {/* Base Capacity Notice */}
                    {unit.extraGuestFee && unit.extraGuestFee > 0 && (
                      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">ℹ️</span>
                          <div>
                            <div className="font-semibold text-green-900 mb-1">
                              Base Capacity: {baseGuests} Guests
                            </div>
                            <p className="text-sm text-green-800">
                              The base price covers up to {baseGuests} guests. Additional guests will incur an extra fee of <strong>₱{unit.extraGuestFee} per person per night</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Input
                      label={`Number of Guests (Max: ${unit.maxGuests})`}
                      type="number"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      min="1"
                      max={unit.maxGuests}
                      required
                    />
                    {unit.extraGuestFee && unit.extraGuestFee > 0 && formData.guests > baseGuests && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Extra Guest Fee:</strong> You have {extraGuests} extra guest{extraGuests > 1 ? 's' : ''} beyond the base capacity. 
                          An additional ₱{unit.extraGuestFee} per guest per night will be added.
                        </p>
                      </div>
                    )}

                    {/* Guest Information Forms - Inline */}
                    <GuestDetailsForm
                      guestDetails={guestDetails}
                      onUpdateGuest={updateGuestDetail}
                      pricingType={pricingType}
                      acceptsMinors={unit.acceptsMinors || false}
                    />
                  </div>
                </div>
              )}

              {/* Hourly Pricing Section */}
              {pricingType === 'hourly' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Select Your Hourly Option <span className="text-red-500">*</span>
                  </h3>
                  
                  {unit.hourlyPricing && unit.hourlyPricing.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">
                        Please select one of the following options to continue with your booking.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {unit.hourlyPricing.map((option, index) => (
                        <div
                          key={index}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedHourlyOption === index
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-300 bg-white hover:border-purple-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedHourlyOption(index)}
                        >
                          {/* Hours and Price Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-2xl font-bold text-gray-900">
                                {option.hours} {option.hours === '1' ? 'Hour' : 'Hours'}
                              </div>
                              <div className="text-xl font-semibold text-purple-600">
                                ₱{option.price}
                              </div>
                            </div>
                            {selectedHourlyOption === index && (
                              <div className="text-purple-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Time Type Badge */}
                          <div className="mb-3">
                            {option.isFlexible ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                ✨ Flexible Time
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                🕐 Fixed Time
                              </span>
                            )}
                          </div>

                          {/* Time Details for Fixed-Time Options */}
                          {!option.isFlexible && option.checkInTime && option.checkOutTime && (
                            <div className="bg-gray-50 rounded-lg p-3 text-sm">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-gray-600 text-xs">Check-in</div>
                                  <div className="font-semibold text-gray-900">{option.checkInTime}</div>
                                </div>
                                <div className="text-gray-400">→</div>
                                <div>
                                  <div className="text-gray-600 text-xs">Check-out</div>
                                  <div className="font-semibold text-gray-900">{option.checkOutTime}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Time Picker for Flexible Options */}
                          {option.isFlexible && selectedHourlyOption === index && (
                            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Your Start Time: <span className="text-red-500">*</span>
                              </label>
                              
                              {/* Custom 12-hour time picker */}
                              <div className="flex gap-2 items-center">
                                {/* Hour selector */}
                                <select
                                  value={flexibleStartTime ? parseInt(flexibleStartTime.split(':')[0]) % 12 || 12 : ''}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const hour12 = e.target.value;
                                    const currentMinute = flexibleStartTime ? flexibleStartTime.split(':')[1] : '00';
                                    const currentPeriod = flexibleStartTime ? (parseInt(flexibleStartTime.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'AM';
                                    const time24 = convertTo24Hour(hour12, currentMinute, currentPeriod);
                                    setFlexibleStartTime(time24);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    !flexibleStartTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                  }`}
                                  required
                                >
                                  <option value="">Hour</option>
                                  {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                  ))}
                                </select>

                                <span className="text-gray-600 font-bold">:</span>

                                {/* Minute selector */}
                                <select
                                  value={flexibleStartTime ? flexibleStartTime.split(':')[1] : ''}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const minute = e.target.value;
                                    const currentHour = flexibleStartTime ? flexibleStartTime.split(':')[0] : '12';
                                    const currentPeriod = flexibleStartTime ? (parseInt(currentHour) >= 12 ? 'PM' : 'AM') : 'AM';
                                    const hour12 = parseInt(currentHour) % 12 || 12;
                                    const time24 = convertTo24Hour(hour12, minute, currentPeriod);
                                    setFlexibleStartTime(time24);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    !flexibleStartTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                  }`}
                                  required
                                >
                                  <option value="">Min</option>
                                  {['00', '15', '30', '45'].map((min) => (
                                    <option key={min} value={min}>{min}</option>
                                  ))}
                                </select>

                                {/* AM/PM selector */}
                                <select
                                  value={flexibleStartTime ? (parseInt(flexibleStartTime.split(':')[0]) >= 12 ? 'PM' : 'AM') : ''}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const period = e.target.value;
                                    const currentHour = flexibleStartTime ? flexibleStartTime.split(':')[0] : '12';
                                    const currentMinute = flexibleStartTime ? flexibleStartTime.split(':')[1] : '00';
                                    const hour12 = parseInt(currentHour) % 12 || 12;
                                    const time24 = convertTo24Hour(hour12, currentMinute, period);
                                    setFlexibleStartTime(time24);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    !flexibleStartTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                  }`}
                                  required
                                >
                                  <option value="">--</option>
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>

                              {flexibleStartTime && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Your booking will end at: <strong>{formatTime12Hour(calculateEndTime(flexibleStartTime, option.hours))}</strong>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                      <span className="text-4xl mb-3 block">⚠️</span>
                      <p className="text-gray-700 font-semibold mb-2">
                        No Hourly Pricing Options Available
                      </p>
                      <p className="text-sm text-gray-600">
                        This unit does not currently offer hourly pricing. Please select "Standard Per Night" pricing instead.
                      </p>
                    </div>
                  )}

                  {/* Date Selection Calendar - Below Hourly Options */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Select Your Date</h3>
                    
                    {/* Calendar Container */}
                    <div className="bg-white rounded-lg border-2 border-purple-200 p-4" key={`calendar-${hourlyBookingDate}`}>
                      {/* Calendar Header */}
                      <div className="flex justify-between items-center mb-4">
                        <button
                          type="button"
                          onClick={prevMonth}
                          className="p-2 hover:bg-purple-100 rounded-lg transition"
                        >
                          ←
                        </button>
                        <h3 className="text-lg font-semibold text-purple-900">
                          {monthNames[getDaysInMonth(calendarMonth).month]} {getDaysInMonth(calendarMonth).year}
                        </h3>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="p-2 hover:bg-purple-100 rounded-lg transition"
                        >
                          →
                        </button>
                      </div>

                      {/* Day names */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {dayNames.map(day => (
                          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells for days before month starts */}
                        {[...Array(getDaysInMonth(calendarMonth).startingDayOfWeek)].map((_, index) => (
                          <div key={`empty-${index}`} className="aspect-square" />
                        ))}

                        {/* Days of the month */}
                        {[...Array(getDaysInMonth(calendarMonth).daysInMonth)].map((_, index) => {
                          const day = index + 1;
                          const { year, month } = getDaysInMonth(calendarMonth);
                          const date = new Date(year, month, day);
                          const dateStr = date.toISOString().split('T')[0];
                          const isPast = isDateInPast(date);
                          const isBooked = bookedDates.includes(dateStr);
                          const isSelected = hourlyBookingDate === dateStr;
                          const isUnavailable = isPast || isBooked;

                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleCalendarDateClick(date)}
                              disabled={isUnavailable}
                              className={`
                                aspect-square p-2 text-sm rounded-lg transition-all font-medium
                                ${isUnavailable ? 'bg-red-100 text-red-400 cursor-not-allowed line-through' : ''}
                                ${!isUnavailable && !isSelected ? 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-md' : ''}
                                ${isSelected ? 'bg-blue-600 text-white font-bold shadow-lg ring-2 ring-blue-400' : ''}
                              `}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <div className="flex flex-wrap gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-600 rounded"></div>
                            <span className="text-gray-700">Selected</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                            <span className="text-gray-700">Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-100 rounded"></div>
                            <span className="text-gray-700">Unavailable</span>
                          </div>
                        </div>
                      </div>

                      {/* Selected Date Display */}
                      {hourlyBookingDate && (
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <div className="bg-purple-50 rounded-lg p-3">
                            <div className="text-xs text-purple-700 font-semibold mb-1">Selected Date</div>
                            <div className="text-lg font-bold text-purple-900 flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {new Date(hourlyBookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guest Information for Hourly Bookings */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Guest Information</h3>
                    
                    {/* Base Capacity Notice */}
                    {unit.extraGuestFee && unit.extraGuestFee > 0 && (
                      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">ℹ️</span>
                          <div>
                            <div className="font-semibold text-green-900 mb-1">
                              Base Capacity: {baseGuests} Guests
                            </div>
                            <p className="text-sm text-green-800">
                              The base price covers up to {baseGuests} guests. Additional guests will incur an extra fee of <strong>₱{unit.extraGuestFee} per person</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Input
                      label={`Number of Guests (Max: ${unit.maxGuests})`}
                      type="number"
                      value={formData.guests}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, guests: value === '' ? 1 : parseInt(value) || 1 });
                      }}
                      min="1"
                      max={unit.maxGuests}
                      required
                    />
                    {unit.extraGuestFee && unit.extraGuestFee > 0 && formData.guests > baseGuests && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Extra Guest Fee:</strong> You have {formData.guests - baseGuests} extra guest{formData.guests - baseGuests > 1 ? 's' : ''} beyond the base capacity. 
                          An additional ₱{unit.extraGuestFee} per guest will be added.
                        </p>
                      </div>
                    )}

                    {/* Guest Information Forms - Inline */}
                    <GuestDetailsForm
                      guestDetails={guestDetails}
                      onUpdateGuest={updateGuestDetail}
                      pricingType={pricingType}
                      acceptsMinors={unit.acceptsMinors || false}
                    />
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <Button 
                  type="submit" 
                  disabled={
                    submitting || 
                    (pricingType === 'standard' && (!formData.checkIn || !formData.checkOut)) ||
                    (pricingType === 'hourly' && selectedHourlyOption === null)
                  } 
                  className="w-full"
                >
                  {submitting ? 'Creating Booking...' : 'Review Booking'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-xl font-semibold mb-4">Unit Summary</h3>
            {unit.images && unit.images[0] && (
              <img
                src={unit.images[0]}
                alt={unit.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h4 className="font-semibold text-lg">{unit.name}</h4>
            <p className="text-gray-600 text-sm mb-4">{unit.location}</p>
            
            {/* Pricing Type Indicator */}
            <div className="mb-4">
              {pricingType === 'standard' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">🌙</span>
                    <div>
                      <div className="text-xs font-semibold text-blue-900 uppercase">Pricing Type</div>
                      <div className="text-sm text-blue-700 font-medium">Standard Per Night</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">⏰</span>
                    <div>
                      <div className="text-xs font-semibold text-purple-900 uppercase">Pricing Type</div>
                      <div className="text-sm text-purple-700 font-medium">Hourly Pricing</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Stay Duration Info - Only show for standard pricing */}
            {pricingType === 'standard' && unit.stayDuration && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <span className="text-xl mr-2">⏱️</span>
                  <div>
                    <div className="text-xs font-semibold text-blue-900 uppercase">Stay Duration</div>
                    <div className="text-sm text-blue-700 font-medium">
                      {unit.stayDuration === 'flexible' && 'Flexible Stay (Multiple Days)'}
                      {unit.stayDuration === 'fixed_22' && 'Fixed 22 Hours Only'}
                      {unit.stayDuration === 'fixed_12' && 'Fixed 12 Hours Only'}
                      {unit.stayDuration === 'fixed_6' && 'Fixed 6 Hours Only'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hourly Option Details - Show when hourly pricing is selected */}
            {pricingType === 'hourly' && selectedHourlyOption !== null && unit.hourlyPricing[selectedHourlyOption] && (
              <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-purple-900 uppercase mb-2">Selected Option</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Duration</span>
                    <span className="text-sm font-semibold text-purple-900">
                      {unit.hourlyPricing[selectedHourlyOption].hours} {unit.hourlyPricing[selectedHourlyOption].hours === '1' ? 'Hour' : 'Hours'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Time Type</span>
                    <span className="text-xs">
                      {unit.hourlyPricing[selectedHourlyOption].isFlexible ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                          ✨ Flexible
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                          🕐 Fixed
                        </span>
                      )}
                    </span>
                  </div>
                  {unit.hourlyPricing[selectedHourlyOption].isFlexible ? (
                    flexibleStartTime && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-700">Start Time</span>
                          <span className="text-sm font-semibold text-purple-900">{flexibleStartTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-700">End Time</span>
                          <span className="text-sm font-semibold text-purple-900">
                            {calculateEndTime(flexibleStartTime, unit.hourlyPricing[selectedHourlyOption].hours)}
                          </span>
                        </div>
                      </>
                    )
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-700">Check-in</span>
                        <span className="text-sm font-semibold text-purple-900">
                          {unit.hourlyPricing[selectedHourlyOption].checkInTime}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-700">Check-out</span>
                        <span className="text-sm font-semibold text-purple-900">
                          {unit.hourlyPricing[selectedHourlyOption].checkOutTime}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{unit.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrooms</span>
                <span className="font-medium">{unit.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bathrooms</span>
                <span className="font-medium">{unit.bathrooms}</span>
              </div>
              {pricingType === 'standard' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per night</span>
                  <span className="font-medium">₱{unit.pricePerNight}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Cancellation Policy Card */}
          {unit.cancellationPolicy && (
            <Card className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Cancellation Policy</h3>
              <CancellationPolicyDisplay 
                policy={unit.cancellationPolicy} 
                customPolicy={unit.customCancellation}
              />
            </Card>
          )}

          {(pricingType === 'standard' && nights > 0) || (pricingType === 'hourly' && selectedHourlyOption !== null) ? (
            <Card className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Price Breakdown</h3>
              <div className="space-y-3">
                {pricingType === 'standard' ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">₱{unit.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span className="font-medium">₱{nights * unit.pricePerNight}</span>
                    </div>
                    {extraGuestFeeTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Extra Guest Fee ({extraGuests} guest{extraGuests > 1 ? 's' : ''} × ₱{unit.extraGuestFee} × {nights} night{nights > 1 ? 's' : ''})
                        </span>
                        <span className="font-medium text-blue-600">₱{extraGuestFeeTotal}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
                      <div className="text-xs font-semibold text-purple-900 uppercase mb-2">Hourly Rate</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-700">
                          {unit.hourlyPricing[selectedHourlyOption].hours} hour{unit.hourlyPricing[selectedHourlyOption].hours !== '1' ? 's' : ''}
                        </span>
                        <span className="text-lg font-bold text-purple-900">₱{unit.hourlyPricing[selectedHourlyOption].price}</span>
                      </div>
                      {unit.hourlyPricing[selectedHourlyOption].isFlexible && flexibleStartTime && (
                        <div className="mt-2 pt-2 border-t border-purple-200">
                          <div className="flex justify-between text-xs text-purple-700">
                            <span>{flexibleStartTime}</span>
                            <span>→</span>
                            <span>{calculateEndTime(flexibleStartTime, unit.hourlyPricing[selectedHourlyOption].hours)}</span>
                          </div>
                        </div>
                      )}
                      {!unit.hourlyPricing[selectedHourlyOption].isFlexible && (
                        <div className="mt-2 pt-2 border-t border-purple-200">
                          <div className="flex justify-between text-xs text-purple-700">
                            <span>{unit.hourlyPricing[selectedHourlyOption].checkInTime}</span>
                            <span>→</span>
                            <span>{unit.hourlyPricing[selectedHourlyOption].checkOutTime}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium">₱{unit.securityDeposit || 200}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl text-blue-600">
                    ₱{totalPriceWithDeposit}
                  </span>
                </div>
                {pricingType === 'standard' && extraGuestFeeTotal > 0 && (
                  <p className="text-xs text-gray-500 pt-2 border-t">
                    * Base price covers up to {baseGuests} guests. Additional guests incur extra fees.
                  </p>
                )}
                {pricingType === 'hourly' && (
                  <p className="text-xs text-gray-500 pt-2 border-t">
                    * Security deposit will be refunded after checkout inspection.
                  </p>
                )}
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Confirm Your Booking</h2>
              <p className="text-gray-600 mb-6">Please review your booking details before proceeding to payment.</p>

              {/* Booking Summary */}
              <div className="space-y-4 mb-6">
                {/* Unit Info */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">{unit.name}</h3>
                  <p className="text-sm text-gray-600">{unit.location}</p>
                </div>

                {/* Pricing Type Badge */}
                <div className="flex justify-center mb-4">
                  {pricingType === 'standard' ? (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      🌙 Standard Per Night
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                      ⏰ Hourly Pricing
                    </span>
                  )}
                </div>

                {/* Conditional Details Based on Pricing Type */}
                {pricingType === 'standard' ? (
                  <>
                    {/* Standard Pricing Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Check-in</div>
                        <div className="font-semibold">{new Date(formData.checkIn).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Check-out</div>
                        <div className="font-semibold">{new Date(formData.checkOut).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Guests</div>
                        <div className="font-semibold">{formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Nights</div>
                        <div className="font-semibold">{nights} {nights === 1 ? 'Night' : 'Nights'}</div>
                      </div>
                    </div>

                    {/* Stay Duration */}
                    {unit.stayDuration && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm text-blue-900 font-semibold">Stay Duration</div>
                        <div className="text-sm text-blue-700">
                          {unit.stayDuration === 'flexible' && 'Flexible Stay (Multiple Days)'}
                          {unit.stayDuration === 'fixed_22' && 'Fixed 22 Hours'}
                          {unit.stayDuration === 'fixed_12' && 'Fixed 12 Hours'}
                          {unit.stayDuration === 'fixed_6' && 'Fixed 6 Hours'}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Hourly Pricing Details */}
                    {selectedHourlyOption !== null && unit.hourlyPricing[selectedHourlyOption] && (
                      <>
                        {/* Booking Date */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                          <div className="text-sm text-purple-900 font-semibold mb-1">Booking Date</div>
                          <div className="text-lg font-bold text-purple-800">
                            {new Date(hourlyBookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Duration</div>
                            <div className="font-semibold">
                              {unit.hourlyPricing[selectedHourlyOption].hours} {unit.hourlyPricing[selectedHourlyOption].hours === '1' ? 'Hour' : 'Hours'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Guests</div>
                            <div className="font-semibold">{formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-2">Time Type</div>
                          {unit.hourlyPricing[selectedHourlyOption].isFlexible ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              ✨ Flexible Time
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              🕐 Fixed Time
                            </span>
                          )}
                        </div>

                        {/* Time Details */}
                        {unit.hourlyPricing[selectedHourlyOption].isFlexible ? (
                          // Flexible Time - Show selected start time and calculated end time
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-green-900 font-semibold">Start Time</div>
                                <div className="text-lg font-bold text-green-800">{flexibleStartTime}</div>
                              </div>
                              <div>
                                <div className="text-sm text-green-900 font-semibold">End Time</div>
                                <div className="text-lg font-bold text-green-800">
                                  {calculateEndTime(flexibleStartTime, unit.hourlyPricing[selectedHourlyOption].hours)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Fixed Time - Show check-in and check-out times
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-blue-900 font-semibold">Check-in Time</div>
                                <div className="text-lg font-bold text-blue-800">
                                  {unit.hourlyPricing[selectedHourlyOption].checkInTime}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-blue-900 font-semibold">Check-out Time</div>
                                <div className="text-lg font-bold text-blue-800">
                                  {unit.hourlyPricing[selectedHourlyOption].checkOutTime}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* Price Breakdown */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Price Breakdown</h4>
                  <div className="space-y-2">
                    {pricingType === 'standard' ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">₱{unit.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                          <span className="font-medium">₱{nights * unit.pricePerNight}</span>
                        </div>
                        {extraGuestFeeTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Extra Guest Fee ({extraGuests} guest{extraGuests > 1 ? 's' : ''} × ₱{unit.extraGuestFee} × {nights} night{nights > 1 ? 's' : ''})
                            </span>
                            <span className="font-medium text-blue-600">₱{extraGuestFeeTotal}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {selectedHourlyOption !== null && unit.hourlyPricing[selectedHourlyOption] && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {unit.hourlyPricing[selectedHourlyOption].hours} hour{unit.hourlyPricing[selectedHourlyOption].hours !== '1' ? 's' : ''}
                              </span>
                              <span className="font-medium">₱{unit.hourlyPricing[selectedHourlyOption].price}</span>
                            </div>
                            {formData.guests > 2 && unit.extraGuestFee && unit.extraGuestFee > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Extra Guest Fee ({formData.guests - 2} guest{formData.guests - 2 > 1 ? 's' : ''} × ₱{unit.extraGuestFee})
                                </span>
                                <span className="font-medium text-blue-600">₱{(formData.guests - 2) * unit.extraGuestFee}</span>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium">₱{unit.securityDeposit || 200}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold text-lg">Total Amount</span>
                      <span className="font-bold text-xl text-blue-600">
                        ₱{totalPriceWithDeposit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Question */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-900 font-semibold mb-2">
                  Are you sure you want to proceed with this booking?
                </p>
                <p className="text-xs text-yellow-800">
                  By confirming, you agree to the booking details above and will be redirected to the payment page.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Confirm & Proceed to Payment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreateBooking;

