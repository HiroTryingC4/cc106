import React from 'react';

const ProgressReward = ({ step, message, icon }) => {
  return (
    <div className="fixed top-24 right-8 z-50 animate-slideInRight">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-green-400 p-6 max-w-sm">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{icon || '🎉'}</div>
          <div>
            <div className="font-bold text-gray-900 text-lg mb-1">
              Step {step} Complete!
            </div>
            <div className="text-gray-600 text-sm">
              {message}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProgressReward;
