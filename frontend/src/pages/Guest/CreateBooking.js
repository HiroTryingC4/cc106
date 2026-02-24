import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import BookingCalendar from '../../components/BookingCalendar';
import { useToast } from '../../components/Toast';

const CreateBooking = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  useEffect(() => {
    fetchUnit();
  }, [unitId]);

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

  const calculatePrice = () => {
    if (!formData.checkIn || !formData.checkOut || !unit) return 0;
    const nights = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
    const basePrice = nights * unit.pricePerNight;
    
    // Calculate extra guest fee
    const baseGuests = 2; // Assume base price covers 2 guests
    const extraGuests = Math.max(0, formData.guests - baseGuests);
    const extraGuestFee = unit.extraGuestFee || 0;
    const totalExtraGuestFee = extraGuests * extraGuestFee * nights;
    
    return basePrice + totalExtraGuestFee;
  };

  const calculateExtraGuestFee = () => {
    if (!formData.checkIn || !formData.checkOut || !unit) return 0;
    const nights = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
    const baseGuests = 2;
    const extraGuests = Math.max(0, formData.guests - baseGuests);
    const extraGuestFee = unit.extraGuestFee || 0;
    return extraGuests * extraGuestFee * nights;
  };

  const handleDateSelect = (startDate, endDate) => {
    setFormData({
      ...formData,
      checkIn: startDate,
      checkOut: endDate || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    // Show confirmation dialog instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setShowConfirmation(false);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/guest/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          unitId,
          ...formData
        })
      });

      const data = await response.json();
      if (data.success) {
        addToast('Booking created successfully!', 'success');
        navigate(`/guest/payment/${data.booking.id}`);
      } else {
        addToast(data.message || 'Failed to create booking', 'error');
      }
    } catch (error) {
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
  const extraGuestFeeTotal = calculateExtraGuestFee();
  const baseGuests = 2;
  const extraGuests = Math.max(0, formData.guests - baseGuests);
  const nights = formData.checkIn && formData.checkOut 
    ? Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Booking</h1>
        <p className="text-gray-600 mt-2">Book your stay at {unit.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>
              </div>

              <div className="border-t pt-6">
                <Button type="submit" disabled={submitting || !formData.checkIn || !formData.checkOut} className="w-full">
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
            
            {/* Stay Duration Info */}
            {unit.stayDuration && (
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
              <div className="flex justify-between">
                <span className="text-gray-600">Price per night</span>
                <span className="font-medium">₱{unit.pricePerNight}</span>
              </div>
            </div>
          </Card>

          {nights > 0 && (
            <Card className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Price Breakdown</h3>
              <div className="space-y-3">
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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium">₱{unit.securityDeposit || 200}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl text-blue-600">
                    ₱{totalPrice + (unit.securityDeposit || 200)}
                  </span>
                </div>
                {extraGuestFeeTotal > 0 && (
                  <p className="text-xs text-gray-500 pt-2 border-t">
                    * Base price covers up to {baseGuests} guests. Additional guests incur extra fees.
                  </p>
                )}
              </div>
            </Card>
          )}
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

                {/* Dates */}
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

                {/* Guests & Nights */}
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

                {/* Price Breakdown */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Price Breakdown</h4>
                  <div className="space-y-2">
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
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium">₱{unit.securityDeposit || 200}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold text-lg">Total Amount</span>
                      <span className="font-bold text-xl text-blue-600">
                        ₱{totalPrice + (unit.securityDeposit || 200)}
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
