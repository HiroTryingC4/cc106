import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

const HostVerification = () => {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
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
    additionalDocs: ''
  });

  useEffect(() => {
    fetchVerificationStatus();
    // Refresh user data every 10 seconds to check for approval
    const interval = setInterval(() => {
      refreshUser();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/verification/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setVerificationStatus(data.verification);
        if (data.verification && data.verification.status !== 'rejected') {
          // Pre-fill form if resubmitting
          setFormData(data.verification.documents || formData);
        }
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/verification/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ documents: formData })
      });

      const data = await response.json();

      if (data.success) {
        addToast('Verification documents submitted successfully!', 'success');
        fetchVerificationStatus();
      } else {
        addToast(data.message || 'Failed to submit documents', 'error');
      }
    } catch (error) {
      addToast('Error submitting documents', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  // If already verified
  if (user?.verified) {
    return (
      <DashboardLayout>
        <Card className="max-w-2xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Account Verified!</h2>
          <p className="text-gray-600 mb-6">
            Your host account has been verified. You now have full access to all features.
          </p>
          <Button onClick={() => navigate('/host/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  // Show status if pending or rejected
  if (verificationStatus) {
    if (verificationStatus.status === 'pending') {
      return (
        <DashboardLayout>
          <Card className="max-w-2xl mx-auto text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">Verification Pending</h2>
            <p className="text-gray-600 mb-4">
              Your verification documents are under review by our admin team.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Submitted on: {new Date(verificationStatus.submittedAt).toLocaleDateString()}
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                You can explore the host dashboard features while waiting for approval.
                Full functionality will be enabled once verified.
              </p>
            </div>
            <Button onClick={() => navigate('/host/dashboard')}>
              Explore Dashboard
            </Button>
          </Card>
        </DashboardLayout>
      );
    }

    if (verificationStatus.status === 'rejected') {
      return (
        <DashboardLayout>
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-8 mb-6">
              <div className="text-6xl mb-4">✗</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Rejected</h2>
              <p className="text-gray-600 mb-4">
                Unfortunately, your verification documents were not approved.
              </p>
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</p>
                <p className="text-sm text-red-700">{verificationStatus.rejectionReason}</p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Please review the feedback and resubmit your documents below.
              </p>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-6">Resubmit Verification Documents</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields will be rendered below */}
                <VerificationForm formData={formData} setFormData={setFormData} />
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Submitting...' : 'Resubmit Documents'}
                </Button>
              </form>
            </Card>
          </div>
        </DashboardLayout>
      );
    }
  }

  // Initial submission form
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Host Verification</h1>
          <p className="text-gray-600 mt-2">
            Complete your verification to unlock all host features
          </p>
        </div>

        <Card className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Why verify your account?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Create and manage property listings</li>
              <li>✓ Accept bookings from guests</li>
              <li>✓ Receive payments</li>
              <li>✓ Access financial reports and analytics</li>
              <li>✓ Build trust with potential guests</li>
            </ul>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-6">Submit Verification Documents</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <VerificationForm formData={formData} setFormData={setFormData} />
            
            <div className="pt-4 border-t">
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Separate component for the form fields
const VerificationForm = ({ formData, setFormData }) => {
  return (
    <>
      <div>
        <h3 className="font-semibold mb-3">Business Information</h3>
        <div className="space-y-4">
          <Input
            label="Business/Property Name"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            required
          />
          
          <Input
            label="Business Address"
            value={formData.businessAddress}
            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Identification</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Type
            </label>
            <select
              value={formData.idType}
              onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="national_id">National ID</option>
            </select>
          </div>
          
          <Input
            label="ID Number"
            value={formData.idNumber}
            onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
            required
          />
          
          <Input
            label="Tax ID / TIN"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Banking Information</h3>
        <div className="space-y-4">
          <Input
            label="Bank Name"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            required
          />
          
          <Input
            label="Bank Account Number"
            value={formData.bankAccount}
            onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Property Documents</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proof of Ownership (URL or Document ID)
            </label>
            <textarea
              value={formData.proofOfOwnership}
              onChange={(e) => setFormData({ ...formData, proofOfOwnership: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Property deed, title, or lease agreement"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Documents (Optional)
            </label>
            <textarea
              value={formData.additionalDocs}
              onChange={(e) => setFormData({ ...formData, additionalDocs: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Business permits, insurance, etc."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HostVerification;
