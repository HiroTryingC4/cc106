import React from 'react';
import Input from './Input';

const GuestDetailsForm = ({ guestDetails, onUpdateGuest, pricingType = 'standard', acceptsMinors = false }) => {
  const themeColor = pricingType === 'hourly' ? 'purple' : 'blue';
  
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

  return (
    <div className="mt-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Guest Information (Required)
        </h3>
        <p className="text-sm text-gray-600">
          Please provide complete information for all {guestDetails.length} guest{guestDetails.length > 1 ? 's' : ''}. 
          This helps the host verify your booking and ensures a safe stay for everyone.
        </p>
      </div>

      <div className="space-y-6">
        {guestDetails.map((guest, index) => (
          <div 
            key={index} 
            className={`bg-${themeColor}-50 border-2 border-${themeColor}-200 rounded-lg p-6`}
          >
            {/* Guest Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
              <span className={`text-lg font-bold text-${themeColor}-600`}>
                Guest {index + 1}
              </span>
              {index === 0 && (
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                  Primary Guest
                </span>
              )}
            </div>

            {/* Personal Information */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={guest.fullName}
                  onChange={(e) => onUpdateGuest(index, 'fullName', e.target.value)}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email *"
                  type="email"
                  value={guest.email}
                  onChange={(e) => onUpdateGuest(index, 'email', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
                <Input
                  label="Phone Number *"
                  type="tel"
                  value={guest.phone}
                  onChange={(e) => onUpdateGuest(index, 'phone', e.target.value)}
                  placeholder="+1234567890"
                  required
                />
                <Input
                  label="Date of Birth *"
                  type="date"
                  value={guest.dateOfBirth}
                  onChange={(e) => onUpdateGuest(index, 'dateOfBirth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {guest.dateOfBirth && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">
                      Age: {calculateAge(guest.dateOfBirth)} years old
                      {calculateAge(guest.dateOfBirth) < 18 && !acceptsMinors && (
                        <span className="text-red-600 ml-2">⚠️ This unit requires guests to be 18 or older</span>
                      )}
                      {calculateAge(guest.dateOfBirth) < 18 && acceptsMinors && (
                        <span className="text-yellow-600 ml-2">ℹ️ Minor (under 18) - Parental/guardian consent required</span>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={guest.gender}
                    onChange={(e) => onUpdateGuest(index, 'gender', e.target.value)}
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
                  value={guest.nationality}
                  onChange={(e) => onUpdateGuest(index, 'nationality', e.target.value)}
                  placeholder="United States"
                  required
                />
              </div>
            </div>

            {/* ID Information */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Identification</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Type *
                  </label>
                  <select
                    value={guest.idType}
                    onChange={(e) => onUpdateGuest(index, 'idType', e.target.value)}
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
                  value={guest.idNumber}
                  onChange={(e) => onUpdateGuest(index, 'idNumber', e.target.value)}
                  placeholder="P123456789"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Address</h4>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Street Address *"
                  value={guest.street}
                  onChange={(e) => onUpdateGuest(index, 'street', e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City *"
                    value={guest.city}
                    onChange={(e) => onUpdateGuest(index, 'city', e.target.value)}
                    placeholder="New York"
                    required
                  />
                  <Input
                    label="State/Province *"
                    value={guest.state}
                    onChange={(e) => onUpdateGuest(index, 'state', e.target.value)}
                    placeholder="NY"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Country *"
                    value={guest.country}
                    onChange={(e) => onUpdateGuest(index, 'country', e.target.value)}
                    placeholder="United States"
                    required
                  />
                  <Input
                    label="Postal Code *"
                    value={guest.postalCode}
                    onChange={(e) => onUpdateGuest(index, 'postalCode', e.target.value)}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Notice */}
      <div className={`mt-4 bg-${themeColor}-50 border border-${themeColor}-200 rounded-lg p-4`}>
        <p className={`text-sm text-${themeColor}-800`}>
          🔒 <strong>Privacy & Security:</strong> Your information is encrypted and only shared with the host for verification purposes. 
          We comply with data protection regulations and your data is secure.
        </p>
      </div>
    </div>
  );
};

export default GuestDetailsForm;
