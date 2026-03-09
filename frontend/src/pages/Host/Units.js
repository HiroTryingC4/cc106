import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

const Units = () => {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, unitId: null });
  const [deleting, setDeleting] = useState(false);
  
  const isVerified = user?.verified;

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await refreshUser();
    setTimeout(() => setRefreshing(false), 500);
  };

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/units', {
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/units/${deleteModal.unitId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        addToast('Unit deleted successfully', 'success');
        fetchUnits();
      } else {
        addToast(data.message || 'Failed to delete unit', 'error');
      }
    } catch (error) {
      addToast('Error deleting unit', 'error');
    } finally {
      setDeleting(false);
      setDeleteModal({ show: false, unitId: null });
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

  return (
    <DashboardLayout>
      {/* Verification Warning Banner */}
      {!isVerified && (
        <Card className="mb-6 bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔒</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">
                Read-Only Mode - Verification Required
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                You're viewing your units in read-only mode. Complete verification to add, edit, or delete units.
              </p>
              <div className="flex gap-2">
                <Link to="/host/verification">
                  <Button size="sm">
                    Complete Verification
                  </Button>
                </Link>
                <Button size="sm" variant="secondary" onClick={handleRefreshStatus} disabled={refreshing}>
                  {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Status'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Units</h1>
          <p className="text-gray-500 mt-1">Manage your properties and AI assistants</p>
        </div>
        {isVerified ? (
          <Link to="/host/units/new">
            <Button className="bg-[#4E7B22] hover:bg-[#3d6219] text-white flex items-center gap-2">
              <span className="text-lg">⊕</span>
              Add new unit
            </Button>
          </Link>
        ) : (
          <Button disabled title="Verification required" className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            Add new unit
          </Button>
        )}
      </div>

      {units.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No units yet. {isVerified ? 'Add your first property!' : 'Complete verification to add properties.'}</p>
            {isVerified ? (
              <Link to="/host/units/new">
                <Button>Add New Unit</Button>
              </Link>
            ) : (
              <Link to="/host/verification">
                <Button>Complete Verification</Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {units.map(unit => (
            <Card key={unit.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  unit.available ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {unit.available ? 'active' : 'maintenance'}
                </span>
              </div>

              {/* Unit Image */}
              {unit.images && unit.images[0] ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={unit.images[0]}
                    alt={unit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">🏠</span>
                </div>
              )}

              {/* Unit Details */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-yellow-500 text-lg">🏠</span>
                  <h3 className="text-lg font-bold text-gray-900">{unit.name}</h3>
                </div>

                {unit.address && (
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {unit.address.split(',')[0]}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-1 font-medium text-gray-700">{unit.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Hourly Type:</span>
                    <span className="ml-1 font-medium text-gray-700">{unit.hourlyType || 'Flexible'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Bedrooms:</span>
                    <span className="ml-1 font-medium text-gray-700">{unit.bedrooms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <span className="ml-1 font-medium text-gray-700">
                      {unit.checkInTime || '1:00 pm'} - {unit.checkOutTime || '5:00pm'}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-600">Price: </span>
                  <span className="text-lg font-bold text-green-600">₱{unit.pricePerNight}/night</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isVerified ? (
                    <>
                      <Link to={`/host/units/${unit.id}/edit`} className="flex-1">
                        <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1">
                          <span>✏️</span>
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ show: true, unitId: unit.id })}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed" disabled>
                        <span>🔒</span> Edit
                      </button>
                      <button className="px-4 py-2 text-sm bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed" disabled>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, unitId: null })}
        title="Delete Unit"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this unit? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal({ show: false, unitId: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Unit'}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Units;
