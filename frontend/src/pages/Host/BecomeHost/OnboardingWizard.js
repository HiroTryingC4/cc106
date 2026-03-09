import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/Toast';
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';
import Step1PropertyType from './steps/Step1PropertyType';
import Step2BasicDetails from './steps/Step2BasicDetails';
import Step3Photos from './steps/Step3Photos';
import Step4TitleDescription from './steps/Step4TitleDescription';
import Step5Review from './steps/Step5Review';
import Step6Register from './steps/Step6Register';
import Step7Publish from './steps/Step7Publish';
import Step8Verification from './steps/Step8Verification';
import SocialProof from './components/SocialProof';
import Confetti from './components/Confetti';
import ExitIntentModal from './components/ExitIntentModal';
import ProgressReward from './components/ProgressReward';
import SmartTips from './components/SmartTips';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    // Step 1
    propertyType: '',
    
    // Step 2
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    
    // Step 3
    images: [],
    
    // Step 4
    name: '',
    description: '',
    address: '',
    
    // Additional fields (will be set to defaults)
    pricePerNight: 1000,
    securityDeposit: 500,
    amenities: [],
    houseRules: 'No smoking. No pets. Check-in after 2PM. Check-out before 11AM.',
    instantBooking: false,
    cancellationPolicy: 'moderate'
  });

  const totalSteps = 8; // Property type, details, photos, title/desc, review, register, publish, verification

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY < 0 && currentStep < 8 && currentStep > 1) {
        const progress = (currentStep / totalSteps) * 100;
        if (progress > 20 && progress < 100) {
          setShowExitModal(true);
        }
      }
    };

    document.addEventListener('mouseout', handleMouseLeave);
    return () => document.removeEventListener('mouseout', handleMouseLeave);
  }, [currentStep]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  const saveDraft = () => {
    localStorage.setItem('hostOnboardingDraft', JSON.stringify({
      currentStep,
      formData,
      lastSaved: new Date().toISOString()
    }));
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.propertyType) {
          addToast('Please select a property type', 'error');
          return false;
        }
        return true;
      case 2:
        if (formData.guests < 1 || formData.bedrooms < 0 || formData.beds < 1 || formData.bathrooms < 0.5) {
          addToast('Please provide valid property details', 'error');
          return false;
        }
        return true;
      case 3:
        if (formData.images.length < 1) {
          addToast('Please upload at least 1 photo', 'error');
          return false;
        }
        return true;
      case 4:
        if (!formData.name.trim()) {
          addToast('Please enter a property title', 'error');
          return false;
        }
        if (!formData.description.trim()) {
          addToast('Please enter a description', 'error');
          return false;
        }
        if (!formData.address.trim()) {
          addToast('Please enter an address', 'error');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Mark step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      // Show rewards and confetti
      showStepReward(currentStep);

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const showStepReward = (step) => {
    const rewards = {
      1: { message: 'Great start! Your property type is set.', icon: '🏠' },
      2: { message: 'Looking good! Your details are complete.', icon: '✨' },
      3: { message: 'Professional! Your photos are uploaded.', icon: '📸' },
      4: { message: 'Almost there! Your description is ready.', icon: '✍️' },
      5: { message: 'Perfect! Everything looks amazing.', icon: '🌟' },
      6: { message: 'Welcome aboard! Your account is ready.', icon: '🎉' },
      7: { message: 'Excellent! Your property is now live.', icon: '🚀' }
    };

    if (rewards[step]) {
      setRewardMessage(rewards[step].message);
      setShowReward(rewards[step].icon);
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowReward(false);
        setShowConfetti(false);
      }, 3000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveExit = () => {
    saveDraft();
    addToast('Progress saved! You can continue later.', 'success');
    navigate('/host/dashboard');
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // First, create the unit
      const response = await fetch('http://localhost:5000/api/host/units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.propertyType,
          location: formData.address,
          description: formData.description,
          pricePerNight: formData.pricePerNight,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          maxGuests: formData.guests,
          amenities: formData.amenities,
          securityDeposit: formData.securityDeposit,
          houseRules: formData.houseRules,
          instantBooking: formData.instantBooking,
          baseGuestsIncluded: formData.guests,
          status: 'active'
        })
      });

      const data = await response.json();
      if (data.success) {
        // If we have images, upload them
        if (formData.images.length > 0) {
          const unitId = data.unit.id;
          
          // Convert base64 images to blobs and upload all at once
          const imageFormData = new FormData();
          
          for (let i = 0; i < formData.images.length; i++) {
            const base64Image = formData.images[i];
            
            // Convert base64 to blob
            const response = await fetch(base64Image);
            const blob = await response.blob();
            
            // Add to form data
            imageFormData.append('images', blob, `unit-image-${i}.jpg`);
          }
          
          // Upload all images at once
          await fetch(`http://localhost:5000/api/host/units/${unitId}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: imageFormData
          });
        }
        
        addToast('🎉 Your property has been listed successfully!', 'success');
        // Move to verification step instead of completing
        setCurrentStep(8);
      } else {
        addToast(data.message || 'Failed to create listing', 'error');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      addToast('Error creating listing', 'error');
    }
  };

  const handleVerificationComplete = () => {
    // Clear draft and complete onboarding
    localStorage.removeItem('hostOnboardingDraft');
    // Mark that onboarding was just completed
    localStorage.setItem('justCompletedOnboarding', 'true');
    addToast('🎉 Welcome to Smart Stay! You can now browse host features while we review your verification.', 'success');
    // Redirect to dashboard
    navigate('/host/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PropertyType
            value={formData.propertyType}
            onChange={(value) => updateFormData('propertyType', value)}
          />
        );
      case 2:
        return (
          <Step2BasicDetails
            guests={formData.guests}
            bedrooms={formData.bedrooms}
            beds={formData.beds}
            bathrooms={formData.bathrooms}
            onChange={updateFormData}
          />
        );
      case 3:
        return (
          <Step3Photos
            images={formData.images}
            onChange={(images) => updateFormData('images', images)}
          />
        );
      case 4:
        return (
          <Step4TitleDescription
            name={formData.name}
            description={formData.description}
            address={formData.address}
            onChange={updateFormData}
          />
        );
      case 5:
        return (
          <Step5Review
            formData={formData}
            onEdit={(step) => setCurrentStep(step)}
          />
        );
      case 6:
        return (
          <Step6Register
            onRegisterSuccess={() => setCurrentStep(7)}
          />
        );
      case 7:
        return (
          <Step7Publish
            formData={formData}
            onPublish={handlePublish}
          />
        );
      case 8:
        return (
          <Step8Verification
            onVerificationSubmit={handleVerificationComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Confetti Effect */}
      <Confetti show={showConfetti} />

      {/* Progress Reward */}
      {showReward && (
        <ProgressReward 
          step={currentStep - 1} 
          message={rewardMessage}
          icon={showReward}
        />
      )}

      {/* Exit Intent Modal */}
      <ExitIntentModal
        show={showExitModal}
        onClose={() => {
          setShowExitModal(false);
          handleSaveExit();
        }}
        onContinue={() => setShowExitModal(false)}
        progress={(currentStep / totalSteps) * 100}
        completedSteps={completedSteps}
      />

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Smart Stay</h1>
            <span className="text-sm text-gray-500">Host Onboarding</span>
          </div>
          <button
            onClick={handleSaveExit}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Save & Exit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {renderStep()}
          
          {/* Smart Tips */}
          <SmartTips step={currentStep} formData={formData} />
        </div>

        {/* Social Proof - Show on steps 1, 3, 5 */}
        {[1, 3, 5].includes(currentStep) && (
          <div className="mt-8">
            <SocialProof />
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentStep < 8 && (
        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

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
  );
};

export default OnboardingWizard;
