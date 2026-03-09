import React from 'react';

const EarningsCalculator = ({ propertyType, guests, bedrooms }) => {
  const calculateEarnings = () => {
    let baseRate = 80;
    
    // Property type multiplier
    const typeMultipliers = {
      house: 1.3,
      apartment: 1.0,
      villa: 1.5,
      condo: 1.1,
      cottage: 1.2,
      studio: 0.8
    };
    
    baseRate *= typeMultipliers[propertyType] || 1.0;
    
    // Guest capacity bonus
    baseRate += guests * 15;
    
    // Bedroom bonus
    baseRate += bedrooms * 25;
    
    const nightlyRate = Math.round(baseRate);
    const monthlyLow = Math.round(nightlyRate * 20 * 0.9);
    const monthlyHigh = Math.round(nightlyRate * 25 * 1.1);
    const yearlyLow = monthlyLow * 12;
    const yearlyHigh = monthlyHigh * 12;
    
    return {
      nightlyRate,
      monthlyLow,
      monthlyHigh,
      yearlyLow,
      yearlyHigh
    };
  };

  const earnings = calculateEarnings();

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">💰</div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Your Earning Potential
        </h3>
        <p className="text-gray-600">
          Based on properties like yours in your area
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="text-sm text-gray-600 mb-1">Estimated Nightly Rate</div>
          <div className="text-4xl font-bold text-green-600">
            ${earnings.nightlyRate}
          </div>
          <div className="text-xs text-gray-500 mt-1">per night</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="text-sm text-gray-600 mb-2">Monthly Earnings</div>
          <div className="text-3xl font-bold text-gray-900">
            ${earnings.monthlyLow.toLocaleString()} - ${earnings.monthlyHigh.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">based on 20-25 nights booked</div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border-2 border-purple-300">
          <div className="text-sm text-purple-800 font-semibold mb-2">Annual Potential</div>
          <div className="text-4xl font-bold text-purple-900">
            ${earnings.yearlyLow.toLocaleString()} - ${earnings.yearlyHigh.toLocaleString()}
          </div>
          <div className="text-xs text-purple-700 mt-2">That's serious income! 🚀</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-green-200">
        <div className="flex items-start gap-3 text-sm text-gray-700">
          <div className="text-2xl">💡</div>
          <div>
            <div className="font-semibold mb-1">Pro Tip:</div>
            <div className="text-gray-600">
              Hosts who add professional photos and detailed descriptions earn 30% more on average!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalculator;
