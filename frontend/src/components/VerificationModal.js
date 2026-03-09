import React from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleStartVerification = () => {
    onClose();
    navigate('/host/verification');
  };

  const handleLater = () => {
    onClose();
  };

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn overflow-hidden my-8">
        {/* Header with Icon */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Welcome to Smart Stay!
          </h2>
          <p className="text-purple-100 text-sm">
            Your listing has been created successfully
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Box */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Complete Your Host Verification
              </h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              To start accepting bookings and receiving payments, you need to complete the host verification process.
            </p>

            {/* Steps */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  1
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Upload ID Document</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  2
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Verify Your Identity</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  3
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Admin Review (24 hours)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
            <h4 className="font-semibold text-green-900 mb-2 text-sm flex items-center gap-2">
              <span>✅</span> What you'll unlock:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-green-800">
              <div>• Accept bookings</div>
              <div>• Receive payments</div>
              <div>• All host features</div>
              <div>• Build trust</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleStartVerification}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Verification Now
            </button>
            <button
              onClick={handleLater}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              I'll Do This Later
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-3">
            You can start verification anytime from your dashboard
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VerificationModal;
