import React from 'react';

const SmartTips = ({ step, formData }) => {
  const getTips = () => {
    switch (step) {
      case 1:
        return [
          { icon: '🏠', text: 'Houses typically earn 30% more than apartments' },
          { icon: '⭐', text: 'Choose the type that best matches your property' }
        ];
      
      case 2:
        const tips = [];
        if (formData.guests < 4) {
          tips.push({ icon: '👥', text: 'Properties with 4+ guests get 40% more bookings' });
        }
        if (formData.bedrooms < 2) {
          tips.push({ icon: '🛏️', text: 'Adding a bedroom can increase your rate by $30/night' });
        }
        if (formData.bathrooms < 2) {
          tips.push({ icon: '🚿', text: 'Extra bathrooms are highly valued by guests' });
        }
        if (tips.length === 0) {
          tips.push({ icon: '✨', text: 'Great capacity! Your property can attract families and groups' });
        }
        return tips;
      
      case 3:
        const photoTips = [];
        if (formData.images.length < 5) {
          photoTips.push({ icon: '📸', text: 'Add at least 5 photos for better visibility' });
        }
        if (formData.images.length < 10) {
          photoTips.push({ icon: '🌟', text: 'Listings with 10+ photos get 3x more views' });
        }
        photoTips.push({ icon: '💡', text: 'Take photos during golden hour (sunrise/sunset)' });
        photoTips.push({ icon: '🎯', text: 'Show your best room first - it\'s your cover photo!' });
        return photoTips;
      
      case 4:
        const descTips = [];
        if (!formData.name || formData.name.length < 20) {
          descTips.push({ icon: '✍️', text: 'Detailed titles get 25% more clicks' });
        }
        if (!formData.description || formData.description.length < 100) {
          descTips.push({ icon: '📝', text: 'Descriptions with 200+ characters perform best' });
        }
        descTips.push({ icon: '🎯', text: 'Mention unique features like "ocean view" or "downtown"' });
        descTips.push({ icon: '⭐', text: 'Highlight nearby attractions and amenities' });
        return descTips;
      
      default:
        return [];
    }
  };

  const tips = getTips();
  if (tips.length === 0) return null;

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-2xl">💡</div>
        <h3 className="font-bold text-blue-900">Smart Tips</h3>
      </div>
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3 text-sm text-blue-800">
            <div className="text-xl flex-shrink-0">{tip.icon}</div>
            <div>{tip.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartTips;
