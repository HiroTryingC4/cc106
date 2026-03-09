import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';

const GuestInformation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [guestDetails, setGuestDetails] = useState([]);
  
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/guest/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBooking(data.booking);
        
        // Initialize guest details array or load existing
        if (data.booking.guestDetails && data.booking.guestDetails.length > 0) {
          setGuestDetails(data.booking.guestDetails);
          // Load first guest data
          if (data.booking.guestDetails[0]) {
            loadGuestData(data.booking.guestDetails[0]);
          }
        } else {
          // Initialize empty array
          setGuestDetails(Array(data.booking.guests).fill(null));
        }
      } else {
        addToast('Booking not found', 'error');
        navigate('/guest/bookings');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      addToast('Error loading booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadGuestData = (guest) => {
    if (guest) {
      setFormData({
        fullName: guest.fullName || '',
        email: guest.email || '',
        phone: guest.phone || '',
        dateOfBirth: guest.dateOfBirth || '',
        gender: guest.gender || '',
        nationality: guest.nationality || '',
        idType: guest.idType || '',
        idNumber: guest.idNumber || '',
        street: guest.address?.street || '',
        city: guest.address?.city || '',
        state: guest.address?.state || '',
        country: guest.address?.country || '',
        postalCode: guest.address?.postalCode || ''
      });
    }
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

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      addToast('Full name is required', 'error');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      addToast('Valid email is required', 'error');
      return false;
    }
    if (!formData.phone.trim()) {
      addToast('Phone number is required', 'error');
      return false;
    }
    if (!formData.dateOfBirth) {
      addToast('Date of birth is required', 'error');
      return false;
    }
    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      addToast('Guest must be at least 18 years old', 'error');
      return false;
    }
    if (!formData.gender) {
      addToast('Gender is required', 'error');
      return false;
    }
    if (!formData.nationality.trim()) {
      addToast('Nationality is required', 'error');
      return false;
    }
    if (!formData.idType) {
      addToast('ID type is required', 'error');
      return false;
    }
    if (!formData.idNumber.trim()) {
      addToast('ID number is required', 'error');
      return false;
    }
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || 
        !formData.country.trim() || !formData.postalCode.trim()) {
      addToast('Complete address is required', 'error');
      return false;
    }
    return true;
  };

  const handleSaveGuest = () => {
    if (!validateForm()) return;

    const guestData = {
      guestNumber: currentGuestIndex + 1,
      isPrimary: currentGuestIndex === 0,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      age: calculateAge(formData.dateOfBirth),
      gender: formData.gender,
      nationality: formData.nationality,
      idType: formData.idType,
      idNumber: formData.idNumber,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode
      }
    };

    const updatedDetails = [...guestDetails];
    updatedDetails[currentGuestIndex] = guestData;
    setGuestDetails(updatedDetails);

    addToast(`Guest ${currentGuestIndex + 1} information saved`, 'success');

    // Move to next guest or complete
    if (currentGuestIndex < booking.guests - 1) {
      setCurrentGuestIndex(currentGuestIndex + 1);
      // Load next guest data if exists
      if (updatedDetails[currentGuestIndex + 1]) {
        loadGuestData(updatedDetails[currentGuestIndex + 1]);
      } else {
        // Clear form for new guest
        setFormData({
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
        });
      }
    }
  };

  const handleComplete = async () => {
    // Check all guests have data
    const allCompleted = guestDetails.every(guest => guest !== null);
    if (!allCompleted) {
      addToast('Please complete information for all guests', 'error');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/guest/bookings/${bookingId}/guest-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ guestDetails })
      });

      const data = await response.json();
      if (data.success) {
        addToast('Guest information completed successfully', 'success');
        navigate(`/guest/payment/${bookingId}`);
      } else {
        addToast(data.message || 'Failed to save guest information', 'error');
      }
    } catch (error) {
      console.error('Error saving guest details:', error);
      addToast('Error saving guest information', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentGuestIndex > 0) {
      setCurrentGuestIndex(currentGuestIndex - 1);
      loadGuestData(guestDetails[currentGuestIndex - 1]);
    }
  };

  const goToGuest = (index) => {
    setCurrentGuestIndex(index);
    if (guestDetails[index]) {
      loadGuestData(guestDetails[index]);
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
            <p className="text-gray-500">Booking not found</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const allCompleted = guestDetails.every(guest => guest !== null);
  const completedCount = guestDetails.filter(guest => guest !== null).length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Complete Guest Information</h1>
        <p className="text-gray-600 mt-2">Booking #{booking.id} - {booking.unit?.name}</p>
      </div>

      {/* Booking Summary */}
      <Card className="mb-6 bg-blue-50 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="text-3xl">ℹ️</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Booking Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Unit</p>
                <p className="font-semibold text-blue-900">{booking.unit?.name}</p>
              </div>
              {booking.pricingType === 'standard' ? (
                <>
                  <div>
                    <p className="text-blue-700">Check-in</p>
                    <p className="font-semibold text-blue-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Check-out</p>
                    <p className="font-semibold text-blue-900">{new Date(booking.checkOut).toLocaleDateString()}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-blue-700">Date</p>
                    <p className="font-semibold text-blue-900">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Duration</p>
                    <p className="font-semibold text-blue-900">{booking.hourlyOption?.hours} hours</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-blue-700">Total Guests</p>
                <p className="font-semibold text-blue-900">{booking.guests}</p>
              </div>
            </div>
            <p className="text-sm text-blue-800 mt-3">
              Please provide information for all {booking.guests} guest{booking.guests > 1 ? 's' : ''} before proceeding to payment.
            </p>
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <Card className="mb-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Progress: {completedCount} of {booking.guests} completed</h3>
            <span className="text-sm text-gray-600">
              {Math.round((completedCount / booking.guests) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / booking.guests) * 100}%` }}
            />
          </div>
        </div>

        {/* Guest Navigation */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: booking.guests }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToGuest(index)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentGuestIndex === index
                  ? 'bg-blue-600 text-white'
                  : guestDetails[index]
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {guestDetails[index] && '✓ '}Guest {index + 1}
              {index === 0 && ' (Primary)'}
            </button>
          ))}
        </div>
      </Card>

      {/* Guest Form */}
      <Card>
        <h2 className="text-2xl font-bold mb-6">
          Guest {currentGuestIndex + 1} of {booking.guests}
          {currentGuestIndex === 0 && ' (Primary Guest)'}
        </h2>

        <form className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Phone Number *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
                required
              />
              <Input
                label="Date of Birth *"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                required
              />
              {formData.dateOfBirth && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">
                    Age: {calculateAge(formData.dateOfBirth)} years old
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <Input
                label="Nationality *"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="United States"
                required
              />
            </div>
          </div>

          {/* ID Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Type *</label>
                <select
                  value={formData.idType}
                  onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select ID Type</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="National ID">National ID</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input
                label="ID Number *"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                placeholder="P123456789"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Street Address *"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="123 Main Street"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City *"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                  required
                />
                <Input
                  label="State/Province *"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="NY"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Country *"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                  required
                />
                <Input
                  label="Postal Code *"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="10001"
                  required
                />
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              🔒 <strong>Privacy Notice:</strong> Your personal information is collected for booking verification and safety purposes. 
              We protect your data and only share it with the property host as required for your stay.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentGuestIndex === 0}
            >
              ← Previous Guest
            </Button>

            <div className="flex gap-3">
              {currentGuestIndex < booking.guests - 1 ? (
                <Button
                  type="button"
                  onClick={handleSaveGuest}
                >
                  Save & Next Guest →
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSaveGuest}
                  >
                    Save Guest {currentGuestIndex + 1}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleComplete}
                    disabled={!allCompleted || saving}
                    className={!allCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {saving ? 'Saving...' : 'Complete & Proceed to Payment →'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default GuestInformation;
