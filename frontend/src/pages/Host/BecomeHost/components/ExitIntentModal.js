import React from 'react';

const ExitIntentModal = ({ show, onClose, onContinue, progress, completedSteps }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scaleIn">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Wait! You're So Close! 🎉
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            You've completed {Math.round(progress)}% of your listing.
            Don't lose your progress!
          </p>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <div className="text-gray-700">Your information is saved</div>
              </div>
              {completedSteps.includes(3) && (
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✅</div>
                  <div className="text-gray-700">Your photos are uploaded</div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="text-2xl">⏱️</div>
                <div className="text-gray-700">Just 2-3 minutes to finish</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800">
              <span className="font-semibold">💡 Fun fact:</span> Hosts who complete their listing
              earn an average of <span className="font-bold">$3,200 in their first month!</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Save & Exit
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Continue 🚀
            </button>
          </div>
        </div>

        <style>{`
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
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ExitIntentModal;
