import React from 'react';

const CounterInput = ({ label, value, onChange, min = 0, max = 20, step = 1 }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-900 text-lg">{label}</div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onChange(Math.max(min, value - step))}
            disabled={value <= min}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all ${
              value <= min
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-400 text-gray-700 hover:border-purple-600 hover:text-purple-600'
            }`}
          >
            −
          </button>
          <span className="text-2xl font-bold text-gray-900 w-12 text-center">
            {value}
          </span>
          <button
            onClick={() => onChange(Math.min(max, value + step))}
            disabled={value >= max}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all ${
              value >= max
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-400 text-gray-700 hover:border-purple-600 hover:text-purple-600'
            }`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

const Step2BasicDetails = ({ guests, bedrooms, beds, bathrooms, onChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Share some basics about your place
        </h2>
        <p className="text-lg text-gray-600">
          You'll add more details later, like amenities and photos
        </p>
      </div>

      <div className="space-y-4 mt-12">
        <CounterInput
          label="Guests"
          value={guests}
          onChange={(val) => onChange('guests', val)}
          min={1}
          max={20}
        />
        
        <CounterInput
          label="Bedrooms"
          value={bedrooms}
          onChange={(val) => onChange('bedrooms', val)}
          min={0}
          max={10}
        />
        
        <CounterInput
          label="Beds"
          value={beds}
          onChange={(val) => onChange('beds', val)}
          min={1}
          max={20}
        />
        
        <CounterInput
          label="Bathrooms"
          value={bathrooms}
          onChange={(val) => onChange('bathrooms', val)}
          min={0.5}
          max={10}
          step={0.5}
        />
      </div>
    </div>
  );
};

export default Step2BasicDetails;
