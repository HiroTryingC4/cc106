import React from 'react';

const Step4TitleDescription = ({ name, description, address, onChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Now, let's give your place a title and description
        </h2>
        <p className="text-lg text-gray-600">
          Short titles work best. Have fun with it—you can always change it later.
        </p>
      </div>

      <div className="space-y-6 mt-12">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Property Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Cozy beachfront condo with stunning views"
            maxLength={50}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none text-lg"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {name.length}/50 characters
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Describe what makes your place special..."
            maxLength={500}
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none text-lg resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {description.length}/500 characters
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="123 Ocean Drive, Miami Beach, FL"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none text-lg"
          />
          <div className="text-sm text-gray-500 mt-2">
            💡 Your exact address is only shared with guests after they book
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-3">Writing Tips</h3>
          <ul className="space-y-2 text-sm text-purple-800">
            <li>✓ Highlight unique features and amenities</li>
            <li>✓ Mention nearby attractions or landmarks</li>
            <li>✓ Be honest and accurate in your description</li>
            <li>✓ Use descriptive language that paints a picture</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step4TitleDescription;
