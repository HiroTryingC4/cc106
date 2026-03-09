import React from 'react';

const PhotoQualityFeedback = ({ imageCount }) => {
  const getQualityScore = () => {
    if (imageCount >= 10) return { score: 10, rating: 'Excellent', color: 'green', message: 'Outstanding! Your listing will stand out!' };
    if (imageCount >= 7) return { score: 8, rating: 'Great', color: 'blue', message: 'Great job! A few more photos would be perfect.' };
    if (imageCount >= 5) return { score: 6, rating: 'Good', color: 'yellow', message: 'Good start! Add more photos for better results.' };
    if (imageCount >= 3) return { score: 4, rating: 'Fair', color: 'orange', message: 'Add more photos to attract more guests.' };
    if (imageCount >= 1) return { score: 2, rating: 'Needs Work', color: 'red', message: 'More photos needed for a professional listing.' };
    return { score: 0, rating: 'No Photos', color: 'gray', message: 'Upload photos to get started!' };
  };

  const quality = getQualityScore();
  const colorClasses = {
    green: 'bg-green-50 border-green-300 text-green-800',
    blue: 'bg-blue-50 border-blue-300 text-blue-800',
    yellow: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    orange: 'bg-orange-50 border-orange-300 text-orange-800',
    red: 'bg-red-50 border-red-300 text-red-800',
    gray: 'bg-gray-50 border-gray-300 text-gray-800'
  };

  if (imageCount === 0) return null;

  return (
    <div className={`${colorClasses[quality.color]} border-2 rounded-xl p-4 mt-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Photo Quality Score</div>
        <div className="text-2xl font-bold">{quality.score}/10</div>
      </div>
      <div className="text-sm mb-2">{quality.message}</div>
      
      <div className="space-y-2 mt-3">
        <div className="flex items-center gap-2 text-xs">
          {imageCount >= 1 ? '✅' : '⭕'} <span>At least 1 photo</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {imageCount >= 5 ? '✅' : '⭕'} <span>5+ photos (recommended)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {imageCount >= 10 ? '✅' : '⭕'} <span>10+ photos (professional)</span>
        </div>
      </div>

      {imageCount < 10 && (
        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
          <div className="text-xs font-semibold">💡 Pro Tip:</div>
          <div className="text-xs mt-1">
            Listings with 10+ photos get 3x more views and book 2x faster!
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoQualityFeedback;
