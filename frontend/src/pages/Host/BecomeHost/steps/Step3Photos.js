import React, { useState } from 'react';
import PhotoQualityFeedback from '../components/PhotoQualityFeedback';

const Step3Photos = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newImages = [];

    for (const file of files) {
      // Convert to base64 for temporary storage (no backend needed yet)
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          onChange([...images, ...newImages]);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Add some photos of your place
        </h2>
        <p className="text-lg text-gray-600">
          You can add multiple photos. The first one will be your cover photo.
        </p>
      </div>

      <div className="mt-12">
        {/* Upload Area */}
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer bg-gray-50 hover:bg-purple-50">
            <div className="text-6xl mb-4">📸</div>
            <div className="text-xl font-semibold text-gray-900 mb-2">
              {uploading ? 'Uploading...' : 'Add photos'}
            </div>
            <div className="text-gray-600">
              Drag and drop or click to upload
            </div>
            <div className="text-sm text-gray-500 mt-2">
              JPG, PNG up to 10MB • Add multiple photos at once
            </div>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {images.length} photo{images.length > 1 ? 's' : ''} added
              </h3>
              <label className="cursor-pointer">
                <span className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add More
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Cover Photo
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Photo Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Use natural lighting for best results</li>
            <li>✓ Show all rooms and spaces</li>
            <li>✓ Highlight unique features and amenities</li>
            <li>✓ Keep spaces clean and tidy</li>
            <li>✓ Add at least 5 photos for better visibility</li>
          </ul>
        </div>

        {/* Photo Quality Feedback */}
        <PhotoQualityFeedback imageCount={images.length} />
      </div>
    </div>
  );
};

export default Step3Photos;
