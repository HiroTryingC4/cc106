import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const Units = () => {
  const { addToast } = useToast();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [contentForm, setContentForm] = useState({
    name: '',
    description: '',
    images: []
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [flagReason, setFlagReason] = useState('');

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/units', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUnits(data.units);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (unitId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/units/${unitId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Unit status updated successfully', 'success');
        fetchUnits();
      } else {
        addToast(data.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      addToast('Error updating status', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/units/${selectedUnit.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Unit deleted successfully', 'success');
        setShowModal(false);
        setSelectedUnit(null);
        fetchUnits();
      } else {
        addToast(data.message || 'Failed to delete unit', 'error');
      }
    } catch (error) {
      addToast('Error deleting unit', 'error');
    }
  };

  const handleApprove = async (unitId) => {
    if (!window.confirm('Approve this listing?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/units/${unitId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Listing approved successfully', 'success');
        fetchUnits();
      } else {
        addToast(data.message || 'Failed to approve listing', 'error');
      }
    } catch (error) {
      addToast('Error approving listing', 'error');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      addToast('Please provide a rejection reason', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/units/${selectedUnit.id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Listing rejected successfully', 'success');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedUnit(null);
        fetchUnits();
      } else {
        addToast(data.message || 'Failed to reject listing', 'error');
      }
    } catch (error) {
      addToast('Error rejecting listing', 'error');
    }
  };

  const handleFlag = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/units/${selectedUnit.id}/flag`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: flagReason })
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(data.message, 'success');
        setShowFlagModal(false);
        setFlagReason('');
        setSelectedUnit(null);
        fetchUnits();
      } else {
        addToast(data.message || 'Failed to flag listing', 'error');
      }
    } catch (error) {
      addToast('Error flagging listing', 'error');
    }
  };

  const handleContentUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/units/${selectedUnit.id}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contentForm)
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Content updated successfully', 'success');
        setShowContentModal(false);
        setSelectedUnit(null);
        fetchUnits();
      } else {
        addToast(data.message || 'Failed to update content', 'error');
      }
    } catch (error) {
      addToast('Error updating content', 'error');
    }
  };

  const openContentModal = (unit) => {
    setSelectedUnit(unit);
    setContentForm({
      name: unit.name,
      description: unit.description,
      images: unit.images || []
    });
    setShowContentModal(true);
  };

  const filteredUnits = filterStatus === 'all' 
    ? units 
    : units.filter(u => {
        if (filterStatus === 'pending') return !u.moderationStatus || u.moderationStatus === 'pending';
        if (filterStatus === 'approved') return u.moderationStatus === 'approved';
        if (filterStatus === 'rejected') return u.moderationStatus === 'rejected';
        if (filterStatus === 'flagged') return u.flagged;
        return true;
      });

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
          <h1 className="text-3xl font-bold text-gray-900">Property & Content Moderation</h1>
          <p className="text-gray-600 mt-2">Review, approve, and moderate property listings</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Listings</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Host</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Price/Night</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Moderation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUnits.map(unit => (
                <tr key={unit.id} className={unit.flagged ? 'bg-red-50' : ''}>
                  <td className="px-4 py-3 text-sm">#{unit.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {unit.name}
                    {unit.flagged && (
                      <span className="ml-2 text-red-600" title={unit.flagReason}>🚩</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{unit.host?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm capitalize">{unit.type}</td>
                  <td className="px-4 py-3 text-sm">₱{unit.pricePerNight}</td>
                  <td className="px-4 py-3 text-sm">{unit.rating} ⭐ ({unit.reviewCount})</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      unit.moderationStatus === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : unit.moderationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {unit.moderationStatus === 'approved' ? '✓ Approved' : 
                       unit.moderationStatus === 'rejected' ? '✗ Rejected' : 
                       '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={unit.status || 'available'}
                      onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2 flex-wrap">
                      {(!unit.moderationStatus || unit.moderationStatus === 'pending') && (
                        <>
                          <button
                            onClick={() => handleApprove(unit.id)}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUnit(unit);
                              setShowRejectModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openContentModal(unit)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Edit Content
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUnit(unit);
                          setFlagReason(unit.flagReason || '');
                          setShowFlagModal(true);
                        }}
                        className={`${unit.flagged ? 'text-orange-600 hover:text-orange-800' : 'text-yellow-600 hover:text-yellow-800'} text-xs`}
                      >
                        {unit.flagged ? 'Unflag' : 'Flag'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUnit(unit);
                          setShowModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUnit(null);
        }}
        title="Delete Unit"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{selectedUnit?.name}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setSelectedUnit(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Delete Unit
          </Button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
          setSelectedUnit(null);
        }}
        title="Reject Listing"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Rejecting: <strong>{selectedUnit?.name}</strong>
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
              placeholder="Explain why this listing is being rejected..."
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedUnit(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
            >
              Reject Listing
            </Button>
          </div>
        </div>
      </Modal>

      {/* Flag Modal */}
      <Modal
        isOpen={showFlagModal}
        onClose={() => {
          setShowFlagModal(false);
          setFlagReason('');
          setSelectedUnit(null);
        }}
        title={selectedUnit?.flagged ? "Remove Flag" : "Flag Listing"}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedUnit?.flagged ? 'Removing flag from' : 'Flagging'}: <strong>{selectedUnit?.name}</strong>
          </p>
          {!selectedUnit?.flagged && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flag Reason
              </label>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Why is this listing suspicious?"
              />
            </div>
          )}
          {selectedUnit?.flagged && (
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Current flag reason:</strong> {selectedUnit.flagReason}
              </p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowFlagModal(false);
                setFlagReason('');
                setSelectedUnit(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFlag}
            >
              {selectedUnit?.flagged ? 'Remove Flag' : 'Flag Listing'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Content Moderation Modal */}
      <Modal
        isOpen={showContentModal}
        onClose={() => {
          setShowContentModal(false);
          setSelectedUnit(null);
        }}
        title="Moderate Content"
      >
        <form onSubmit={handleContentUpdate} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded mb-4">
            <p className="text-sm text-blue-800">
              Edit photos and descriptions to ensure quality standards
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Name
            </label>
            <input
              type="text"
              value={contentForm.name}
              onChange={(e) => setContentForm({ ...contentForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={contentForm.description}
              onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo URLs (one per line)
            </label>
            <textarea
              value={contentForm.images.join('\n')}
              onChange={(e) => setContentForm({ 
                ...contentForm, 
                images: e.target.value.split('\n').filter(url => url.trim()) 
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="https://example.com/photo1.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current photos: {contentForm.images.length}
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowContentModal(false);
                setSelectedUnit(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Content
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Units;
