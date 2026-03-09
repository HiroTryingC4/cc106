import React from 'react';
import ListingScore from '../components/ListingScore';

const Step5Review = ({ formData, onEdit }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Review your listing
        </h2>
        <p className="text-lg text-gray-600">
          Here's what we'll show to guests. Make sure everything looks good!
        </p>
      </div>

      <div className="space-y-6 mt-12">
        {/* Property Overview */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">Property Overview</h3>
            <button
              onClick={() => onEdit(1)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-semibold capitalize">{formData.propertyType}</span>
            </div>
            <div>
              <span className="text-gray-600">Guests:</span>
              <span className="ml-2 font-semibold">{formData.guests}</span>
            </div>
            <div>
              <span className="text-gray-600">Bedrooms:</span>
              <span className="ml-2 font-semibold">{formData.bedrooms}</span>
            </div>
            <div>
              <span className="text-gray-600">Beds:</span>
              <span className="ml-2 font-semibold">{formData.beds}</span>
            </div>
            <div>
              <span className="text-gray-600">Bathrooms:</span>
              <span className="ml-2 font-semibold">{formData.bathrooms}</span>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">Photos ({formData.images.length})</h3>
            <button
              onClick={() => onEdit(3)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {formData.images.slice(0, 6).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
          {formData.images.length > 6 && (
            <div className="text-sm text-gray-600 mt-3">
              +{formData.images.length - 6} more photos
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">Title & Description</h3>
            <button
              onClick={() => onEdit(4)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Title</div>
              <div className="font-semibold text-gray-900">{formData.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Description</div>
              <div className="text-gray-700">{formData.description}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Address</div>
              <div className="text-gray-700">{formData.address}</div>
            </div>
          </div>
        </div>

        {/* Next Step Info */}
        <div className="pt-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Looking great!
            </h3>
            <p className="text-gray-600">
              Click Next to create your account and publish your listing
            </p>
          </div>
        </div>

        {/* Listing Score */}
        <div className="mt-8">
          <ListingScore formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default Step5Review;
