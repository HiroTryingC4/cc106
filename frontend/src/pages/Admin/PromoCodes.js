import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    usageLimit: '',
    expiresAt: '',
    description: ''
  });

  useEffect(() => {
    fetchPromoCodes();
    fetchStats();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/promo-codes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPromoCodes(data.promoCodes);
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/promo-codes/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingPromo 
        ? `http://localhost:5000/api/admin/promo-codes/${editingPromo.id}`
        : 'http://localhost:5000/api/admin/promo-codes';
      
      const response = await fetch(url, {
        method: editingPromo ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(data.message, 'success');
        setShowModal(false);
        resetForm();
        fetchPromoCodes();
        fetchStats();
      } else {
        addToast(data.message, 'error');
      }
    } catch (error) {
      addToast('Error saving promo code', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promo code?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/promo-codes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(data.message, 'success');
        fetchPromoCodes();
        fetchStats();
      } else {
        addToast(data.message, 'error');
      }
    } catch (error) {
      addToast('Error deleting promo code', 'error');
    }
  };

  const handleToggleActive = async (promo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/promo-codes/${promo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: !promo.active })
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(data.message, 'success');
        fetchPromoCodes();
        fetchStats();
      } else {
        addToast(data.message, 'error');
      }
    } catch (error) {
      addToast('Error updating promo code', 'error');
    }
  };

  const openEditModal = (promo) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      usageLimit: promo.usageLimit || '',
      expiresAt: promo.expiresAt ? promo.expiresAt.split('T')[0] : '',
      description: promo.description || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      usageLimit: '',
      expiresAt: '',
      description: ''
    });
    setEditingPromo(null);
  };

  const getStatusBadge = (promo) => {
    if (!promo.active) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">Inactive</span>;
    }
    
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-200 text-red-700">Expired</span>;
    }
    
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return <span className="px-2 py-1 text-xs rounded-full bg-orange-200 text-orange-700">Limit Reached</span>;
    }
    
    return <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-700">Active</span>;
  };

  const getTypeBadge = (promo) => {
    if (promo.isPlatformWide) {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-700">Platform-Wide</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-purple-200 text-purple-700">Host Code</span>;
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Codes Management</h1>
          <p className="text-gray-600 mt-1">Manage all promo codes and create platform-wide promotions</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          + Create Platform-Wide Code
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Codes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCodes}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform Codes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.platformWideCodes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌐</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Host Codes</p>
                <p className="text-2xl font-bold text-purple-600">{stats.hostCodes}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Codes</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCodes}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalUsage}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Top Performing Codes */}
      {stats && stats.topCodes && stats.topCodes.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.topCodes.map((code, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-600">{code.code}</span>
                  <span className="text-2xl">#{index + 1}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{code.type === 'percentage' ? `${code.value}%` : `$${code.value}`} off</div>
                  <div className="font-semibold text-gray-900">{code.usage} uses</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Promo Codes List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Discount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Usage</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Expires</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No promo codes yet
                  </td>
                </tr>
              ) : (
                promoCodes.map((promo) => (
                  <tr key={promo.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">{promo.code}</div>
                        {promo.description && (
                          <div className="text-xs text-gray-500">{promo.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getTypeBadge(promo)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-purple-600">
                        {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <span className="font-medium">{promo.usageCount}</span>
                        {promo.usageLimit && (
                          <span className="text-gray-500"> / {promo.usageLimit}</span>
                        )}
                        {!promo.usageLimit && (
                          <span className="text-gray-500"> / ∞</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {promo.expiresAt ? (
                        <div className="text-sm">
                          {new Date(promo.expiresAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No expiry</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(promo)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(promo)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {promo.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => openEditModal(promo)}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingPromo ? 'Edit Promo Code' : 'Create Platform-Wide Promo Code'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promo Code *
            </label>
            <input
              type="text"
              required
              disabled={!!editingPromo}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent uppercase disabled:bg-gray-100"
              placeholder="WELCOME10"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            />
            <p className="text-xs text-gray-500 mt-1">Uppercase letters and numbers only</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type *
              </label>
              <select
                required
                disabled={!!editingPromo}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value *
              </label>
              <input
                type="number"
                required
                disabled={!!editingPromo}
                min="1"
                max={formData.type === 'percentage' ? '100' : undefined}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                placeholder={formData.type === 'percentage' ? '10' : '50'}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Unlimited"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires On
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Platform-wide welcome discount"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {!editingPromo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Platform-Wide Code:</span> This promo code will be available for all properties on the platform.
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setShowModal(false); resetForm(); }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingPromo ? 'Update' : 'Create'} Promo Code
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminPromoCodes;
