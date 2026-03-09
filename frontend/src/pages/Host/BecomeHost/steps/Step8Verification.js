import React, { useState } from 'react';
import { useToast } from '../../../../components/Toast';
import Input from '../../../../components/Input';

const Step8Verification = ({ onVerificationSubmit }) => {
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessType: 'individual',
    idType: 'passport',
    idNumber: '',
    taxId: '',
    bankAccount: '',
    bankName: '',
    proofOfOwnership: '',
    additionalDocs: '',
    idPhoto: null,
    selfieWithId: null
  });
  const [idPhotoPreview, setIdPhotoPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  const handleIdPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, idPhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, selfieWithId: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required files
    if (!formData.idPhoto || !formData.selfieWithId) {
      addToast('Please upload both ID photo and selfie with ID', 'error');
      return;
    }

    // Validate required fields
    if (!formData.businessName || !formData.businessAddress || !formData.idNumber || 
        !formData.taxId || !formData.bankAccount || !formData.bankName) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('businessName', formData.businessName);
      submitData.append('businessAddress', formData.businessAddress);
      submitData.append('businessType', formData.businessType);
      submitData.append('idType', formData.idType);
      submitData.append('idNumber', formData.idNumber);
      submitData.append('taxId', formData.taxId);
      submitData.append('bankAccount', formData.bankAccount);
      submitData.append('bankName', formData.bankName);
      submitData.append('proofOfOwnership', formData.proofOfOwnership);
      submitData.append('additionalDocs', formData.additionalDocs);
      
      // Append files
      if (formData.idPhoto) {
        submitData.append('idPhoto', formData.idPhoto);
      }
      if (formData.selfieWithId) {
        submitData.append('selfieWithId', formData.selfieWithId);
      }

      const response = await fetch('http://localhost:5000/api/host/verification/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (data.success) {
        addToast('Verification documents submitted successfully!', 'success');
        onVerificationSubmit();
      } else {
        addToast(data.message || 'Failed to submit documents', 'error');
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      addToast('Error submitting documents', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    addToast('You can complete verification later from your dashboard', 'info');
    onVerificationSubmit();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🛡️</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Host Verification
        </h2>
        <p className="text-lg text-gray-600">
          Verify your identity to unlock all host features and start accepting bookings
        </p>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>✅</span> What you'll unlock after verification:
        </h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-green-600">•</span> Accept bookings from guests
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">•</span> Receive payments
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">•</span> Access financial reports
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">•</span> Build trust with guests
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Business Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
          <div className="space-y-4">
            <Input
              label="Business/Property Name *"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
              placeholder="Your business or property name"
            />
            
            <Input
              label="Business Address *"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              required
              placeholder="Full business address"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
          </div>
        </div>

        {/* Identification */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Identification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Type *
              </label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            
            <Input
              label="ID Number *"
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              required
              placeholder="Enter your ID number"
            />
            
            <Input
              label="Tax ID / TIN *"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              required
              placeholder="Your tax identification number"
            />

            {/* ID Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Photo * <span className="text-red-500">(Required)</span>
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Upload a clear photo of your ID (front side). Make sure all details are visible.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleIdPhotoChange}
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100
                  cursor-pointer border border-gray-300 rounded-lg p-2"
              />
              {idPhotoPreview && (
                <div className="mt-3">
                  <img
                    src={idPhotoPreview}
                    alt="ID Preview"
                    className="w-full max-w-md h-48 object-contain border-2 border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Selfie with ID Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selfie Holding ID * <span className="text-red-500">(Required)</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Take a selfie while holding your ID next to your face. Both your face and ID should be clearly visible.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-yellow-800">
                  <strong>Tips:</strong> Good lighting, hold ID at chest level, make sure your face and ID details are clear and not blurry.
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleSelfieChange}
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100
                  cursor-pointer border border-gray-300 rounded-lg p-2"
              />
              {selfiePreview && (
                <div className="mt-3">
                  <img
                    src={selfiePreview}
                    alt="Selfie Preview"
                    className="w-full max-w-md h-48 object-contain border-2 border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banking Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Banking Information</h3>
          <div className="space-y-4">
            <Input
              label="Bank Name *"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              required
              placeholder="Your bank name"
            />
            
            <Input
              label="Bank Account Number *"
              value={formData.bankAccount}
              onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
              required
              placeholder="Your account number"
            />
          </div>
        </div>

        {/* Property Documents */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Property Documents</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proof of Ownership *
              </label>
              <textarea
                value={formData.proofOfOwnership}
                onChange={(e) => setFormData({ ...formData, proofOfOwnership: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
                placeholder="Property deed, title, or lease agreement details"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Documents (Optional)
              </label>
              <textarea
                value={formData.additionalDocs}
                onChange={(e) => setFormData({ ...formData, additionalDocs: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="2"
                placeholder="Business permits, insurance, etc."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit for Verification'}
          </button>
          
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Skip for Now
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            You can complete verification anytime from your dashboard. 
            <br />
            Verification typically takes 24-48 hours to review.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Step8Verification;