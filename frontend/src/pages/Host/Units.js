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
          <p className="text-gray-600 mt-2">Manage your property listings</p>
        </div>
        {isVerified ? (
          <Link to="/host/units/new">
            <Button>+ Add New Unit</Button>
          </Link>
        ) : (
          <Button disabled title="Verification required">
            🔒 Add New Unit
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map(unit => (
            <Card key={unit.id}>
              {unit.images && unit.images[0] && (
                <img
                  src={unit.images[0]}
                  alt={unit.name}
                  className="w-full h-48 object-cover rounded-t-lg -mt-6 -mx-6 mb-4"
                />
              )}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{unit.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  unit.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {unit.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{unit.location}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{unit.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-1 font-medium">{unit.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="ml-1 font-medium">{unit.bedrooms}</span>
                </div>
                <div>
                  <span className="text-gray-600">Max Guests:</span>
                  <span className="ml-1 font-medium">{unit.maxGuests}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-1 font-medium text-blue-600">₱{unit.pricePerNight}/night</span>
                </div>
              </div>

              <div className="flex gap-2">
                {isVerified ? (
                  <>
                    <Link to={`/host/units/${unit.id}/edit`} className="flex-1">
                      <Button size="sm" variant="secondary" className="w-full">Edit</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteModal({ show: true, unitId: unit.id })}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="secondary" className="flex-1" disabled title="Verification required">
                      🔒 Edit
                    </Button>
                    <Button size="sm" variant="danger" disabled title="Verification required">
                      🔒 Delete
                    </Button>
                  </>
                )}
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
