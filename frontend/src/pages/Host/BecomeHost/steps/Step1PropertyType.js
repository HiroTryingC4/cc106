import React from 'react';

const propertyTypes = [
  { value: 'house', label: 'House', icon: '🏠' },
  { value: 'apartment', label: 'Apartment', icon: '🏢' },
  { value: 'condo', label: 'Condo', icon: '🏬' },
  { value: 'cottage', label: 'Cottage', icon: '🏡' },
  { value: 'bungalow', label: 'Bungalow', icon: '🏘️' },
  { value: 'penthouse', label: 'Penthouse', icon: '🏙️' },
  { value: 'studio', label: 'Studio', icon: '🏠' },
  { value: 'villa', label: 'Villa', icon: '🏰' },
  { value: 'resort', label: 'Resort', icon: '🏕️' },
  { value: 'hotel', label: 'Hotel Room', icon: '🏨' }
];

const Step1PropertyType = ({ value, onChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Which of these best describes your place?
        </h2>
        <p className="text-lg text-gray-600">
          Choose the option that best matches your property type
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
        {propertyTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              value === type.value
                ? 'border-purple-600 bg-purple-50 shadow-md'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="text-5xl mb-3">{type.icon}</div>
            <div className="font-semibold text-gray-900">{type.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step1PropertyType;
