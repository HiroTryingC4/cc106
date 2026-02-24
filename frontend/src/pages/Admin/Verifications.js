import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const Verifications = () => {
  const { addToast } = useToast();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/verifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setVerifications(data.verifications);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId) => {
    if (!window.confirm('Approve this host verification?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/verifications/${verificationId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        addToast('Host verified successfully', 'success');
        setShowDetailsModal(false);
        fetchVerifications();
      } else {
        addToast(data.message || 'Failed to approve', 'error');
      }
    } catch (error) {
      addToast('Error approving verification', 'error');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      addToast('Please provide a rejection reason', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/verifications/${selectedVerification.id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      const data = await response.json();

      if (data.success) {
        addToast('Verification rejected', 'success');
        setShowRejectModal(false);
        setShowDetailsModal(false);
        setRejectionReason('');
        setSelectedVerification(null);
        fetchVerifications();
      } else {
        addToast(data.message || 'Failed to reject', 'error');
      }
    } catch (error) {
      addToast('Error rejecting verification', 'error');
    }
  };

  const filteredVerifications = filterStatus === 'all'
    ? verifications
    : verifications.filter(v => v.status === filterStatus);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Host Verifications</h1>
          <p className="text-gray-600 mt-2">Review and approve host verification requests</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Host Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Business Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVerifications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No verification requests found
                  </td>
                </tr>
              ) : (
                filteredVerifications.map(verification => (
                  <tr key={verification.id}>
                    <td className="px-4 py-3 text-sm">#{verification.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{verification.hostName}</td>
                    <td className="px-4 py-3 text-sm">{verification.hostEmail}</td>
                    <td className="px-4 py-3 text-sm">{verification.documents?.businessName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(verification.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        verification.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : verification.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {verification.status === 'approved' ? '✓ Approved' :
                         verification.status === 'rejected' ? '✗ Rejected' :
                         '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => {
                          setSelectedVerification(verification);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedVerification(null);
        }}
        title="Verification Details"
      >
        {selectedVerification && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Host Information</h3>
              <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{selectedVerification.hostName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{selectedVerification.hostEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">
                    {new Date(selectedVerification.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Business Information</h3>
              <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-medium">{selectedVerification.documents?.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium">{selectedVerification.documents?.businessAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{selectedVerification.documents?.businessType}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Identification</h3>
              <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Type:</span>
                  <span className="font-medium capitalize">{selectedVerification.documents?.idType?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Number:</span>
                  <span className="font-medium">{selectedVerification.documents?.idNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ID:</span>
                  <span className="font-medium">{selectedVerification.documents?.taxId}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Banking Information</h3>
              <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-medium">{selectedVerification.documents?.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium">{selectedVerification.documents?.bankAccount}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Property Documents</h3>
              <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 block mb-1">Proof of Ownership:</span>
                  <p className="text-gray-800">{selectedVerification.documents?.proofOfOwnership}</p>
                </div>
                {selectedVerification.documents?.additionalDocs && (
                  <div>
                    <span className="text-gray-600 block mb-1">Additional Documents:</span>
                    <p className="text-gray-800">{selectedVerification.documents?.additionalDocs}</p>
                  </div>
                )}
              </div>
            </div>

            {selectedVerification.status === 'rejected' && (
              <div className="bg-red-50 p-4 rounded">
                <h3 className="font-semibold text-red-800 mb-2">Rejection Reason:</h3>
                <p className="text-sm text-red-700">{selectedVerification.rejectionReason}</p>
              </div>
            )}

            {selectedVerification.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleApprove(selectedVerification.id)}
                  className="flex-1"
                >
                  Approve Host
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowRejectModal(true);
                  }}
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
        }}
        title="Reject Verification"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Rejecting verification for: <strong>{selectedVerification?.hostName}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Explain why the verification is being rejected..."
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
            >
              Reject Verification
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Verifications;
