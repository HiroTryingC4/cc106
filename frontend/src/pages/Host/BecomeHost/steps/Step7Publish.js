import React, { useState } from 'react';

const Step7Publish = ({ formData, onPublish }) => {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    await onPublish();
    setPublishing(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-8xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Congratulations! Setup Complete
        </h2>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-green-800 mb-4">✅ What You've Accomplished:</h3>
          <div className="space-y-2 text-left text-green-700">
            <div className="flex items-center gap-3">
              <span className="text-green-600">✓</span>
              <span>Your host account has been created successfully</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-600">✓</span>
              <span>Your property listing is ready to publish</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-600">✓</span>
              <span>All your property details and photos are saved</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">🔍 Ready for Verification</h3>
          <p className="text-blue-700 text-left">
            Now you already have an account ready for verification process. This helps verify you're a true host and builds trust with guests.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="w-full py-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-2xl hover:from-green-700 hover:to-green-800 transition-all shadow-2xl hover:shadow-3xl disabled:opacity-50"
        >
          {publishing ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Publishing Your Listing...
            </span>
          ) : (
            '🚀 Continue to Verification Process'
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Your listing will be published and you'll proceed to host verification
        </p>
      </div>
    </div>
  );
};

export default Step7Publish;
