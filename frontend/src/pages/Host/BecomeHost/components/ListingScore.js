import React from 'react';

const ListingScore = ({ formData }) => {
  const calculateScore = () => {
    let score = 0;
    const feedback = [];

    // Property type selected (10 points)
    if (formData.propertyType) {
      score += 10;
      feedback.push({ type: 'excellent', text: 'Property type selected', icon: '✅' });
    }

    // Basic details (15 points)
    if (formData.guests >= 2 && formData.bedrooms >= 1 && formData.beds >= 1) {
      score += 15;
      feedback.push({ type: 'excellent', text: 'Complete property details', icon: '✅' });
    }

    // Photos (30 points)
    if (formData.images.length >= 10) {
      score += 30;
      feedback.push({ type: 'excellent', text: `${formData.images.length} high-quality photos`, icon: '✅' });
    } else if (formData.images.length >= 5) {
      score += 20;
      feedback.push({ type: 'good', text: `${formData.images.length} photos (add ${10 - formData.images.length} more for +10 points)`, icon: '⚠️' });
    } else if (formData.images.length >= 1) {
      score += 10;
      feedback.push({ type: 'warning', text: `Only ${formData.images.length} photo(s) (add ${10 - formData.images.length} more for +20 points)`, icon: '⚠️' });
    }

    // Title (10 points)
    if (formData.name && formData.name.length >= 20) {
      score += 10;
      feedback.push({ type: 'excellent', text: 'Detailed title', icon: '✅' });
    } else if (formData.name && formData.name.length >= 10) {
      score += 5;
      feedback.push({ type: 'good', text: 'Title could be more descriptive (+5 points)', icon: '⚠️' });
    }

    // Description (20 points)
    if (formData.description && formData.description.length >= 200) {
      score += 20;
      feedback.push({ type: 'excellent', text: 'Comprehensive description', icon: '✅' });
    } else if (formData.description && formData.description.length >= 100) {
      score += 10;
      feedback.push({ type: 'good', text: 'Description could be more detailed (+10 points)', icon: '⚠️' });
    } else if (formData.description) {
      score += 5;
      feedback.push({ type: 'warning', text: 'Description is too short (+15 points)', icon: '⚠️' });
    }

    // Address (10 points)
    if (formData.address && formData.address.length >= 10) {
      score += 10;
      feedback.push({ type: 'excellent', text: 'Complete address provided', icon: '✅' });
    }

    // Pricing (5 points - always included in defaults)
    if (formData.pricePerNight > 0) {
      score += 5;
      feedback.push({ type: 'excellent', text: 'Competitive pricing set', icon: '✅' });
    }

    return { score, feedback };
  };

  const { score, feedback } = calculateScore();
  const maxScore = 100;
  const percentage = (score / maxScore) * 100;

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreMessage = () => {
    if (score >= 90) return 'Outstanding! Your listing is superhost quality! 🌟';
    if (score >= 70) return 'Great job! Your listing looks professional! 👍';
    if (score >= 50) return 'Good start! A few improvements will make it shine! ✨';
    return 'Keep going! You\'re building something great! 💪';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Your Listing Score
        </h3>
        <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
          {score}/100
        </div>
        <div className="text-gray-600 text-sm">
          {getScoreMessage()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="space-y-3">
        <div className="font-semibold text-gray-900 mb-3">Listing Quality:</div>
        
        {feedback.filter(f => f.type === 'excellent').length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-green-700">Excellent:</div>
            {feedback.filter(f => f.type === 'excellent').map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-lg p-3">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {feedback.filter(f => f.type === 'good').length > 0 && (
          <div className="space-y-2 mt-3">
            <div className="text-sm font-semibold text-blue-700">Good:</div>
            {feedback.filter(f => f.type === 'good').map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-lg p-3">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {feedback.filter(f => f.type === 'warning').length > 0 && (
          <div className="space-y-2 mt-3">
            <div className="text-sm font-semibold text-orange-700">Needs Improvement:</div>
            {feedback.filter(f => f.type === 'warning').map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-lg p-3">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {score >= 95 && (
        <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-bold text-yellow-900">Superhost Quality!</div>
          <div className="text-sm text-yellow-800">Your listing is ready to attract premium guests!</div>
        </div>
      )}
    </div>
  );
};

export default ListingScore;
