import React, { useState } from 'react';

const CancellationPolicyDisplay = ({ policy, customPolicy }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPolicyInfo = () => {
    switch (policy) {
      case 'flexible':
        return {
          name: 'Flexible',
          icon: '😊',
          color: 'green',
          description: 'Full refund if cancelled 24 hours before check-in',
          rules: [
            { condition: '24+ hours before check-in', refund: '100% refund' },
            { condition: 'Less than 24 hours', refund: '50% refund' }
          ]
        };
      case 'moderate':
        return {
          name: 'Moderate',
          icon: '⚖️',
          color: 'yellow',
          description: 'Full refund if cancelled 5 days before check-in',
          rules: [
            { condition: '5+ days before check-in', refund: '100% refund' },
            { condition: '2-4 days before check-in', refund: '50% refund' },
            { condition: 'Less than 2 days', refund: 'No refund' }
          ]
        };
      case 'strict':
        return {
          name: 'Strict',
          icon: '🔒',
          color: 'red',
          description: 'Full refund if cancelled 14 days before check-in',
          rules: [
            { condition: '14+ days before check-in', refund: '100% refund' },
            { condition: '7-13 days before check-in', refund: '50% refund' },
            { condition: 'Less than 7 days', refund: 'No refund' }
          ]
        };
      case 'custom':
        if (!customPolicy) return null;
        return {
          name: 'Custom',
          icon: '⚙️',
          color: 'blue',
          description: `Full refund if cancelled ${customPolicy.fullRefundDays} days before check-in`,
          rules: [
            { condition: `${customPolicy.fullRefundDays}+ days before check-in`, refund: '100% refund' },
            { condition: `${customPolicy.partialRefundDays}-${parseInt(customPolicy.fullRefundDays) - 1} days before check-in`, refund: `${customPolicy.partialRefundPercent}% refund` },
            { condition: `Less than ${customPolicy.noRefundDays} day(s)`, refund: 'No refund' }
          ]
        };
      default:
        return null;
    }
  };

  const policyInfo = getPolicyInfo();

  if (!policyInfo) return null;

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      badge: 'bg-green-100 text-green-800'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      badge: 'bg-red-100 text-red-800'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      badge: 'bg-blue-100 text-blue-800'
    }
  };

  const colors = colorClasses[policyInfo.color];

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{policyInfo.icon}</span>
            <div>
              <h3 className={`font-semibold ${colors.text}`}>
                {policyInfo.name} Cancellation Policy
              </h3>
              <p className="text-sm text-gray-600">{policyInfo.description}</p>
            </div>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Refund Schedule:</p>
              <div className="space-y-2">
                {policyInfo.rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400">•</span>
                    <div className="flex-1">
                      <span className="text-gray-700">{rule.condition}:</span>
                      <span className={`ml-2 font-semibold ${colors.text}`}>{rule.refund}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💡 Refunds are processed within 5-7 business days after cancellation approval.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`ml-4 px-3 py-1 text-xs font-medium ${colors.badge} rounded-full hover:opacity-80 transition`}
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default CancellationPolicyDisplay;
