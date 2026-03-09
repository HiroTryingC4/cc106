import React from 'react';

const StepNavigation = ({ currentStep, totalSteps, onBack, onNext }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            currentStep === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          {currentStep === totalSteps ? 'Review' : 'Next'} →
        </button>
      </div>
    </div>
  );
};

export default StepNavigation;
