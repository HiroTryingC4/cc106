import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';

const Users = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('hosts'); // 'hosts', 'guests', or 'disputes'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'guest',
    firstName: '',
    lastName: '',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchDisputes();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingUser 
        ? `http://localhost:5000/api/admin/users/${editingUser.id}`
        : 'http://localhost:5000/api/admin/users';
      
      const response = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(editingUser ? 'User updated successfully' : 'User created successfully', 'success');
        setShowModal(false);
        setEditingUser(null);
        setFormData({ email: '', password: '', role: 'guest', firstName: '', lastName: '', phone: '' });
        fetchUsers();
      } else {
        addToast(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      addToast('Error saving user', 'error');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || ''
    });
    setShowModal(true);
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('User deactivated successfully', 'success');
        fetchUsers();
      } else {
        addToast(data.message || 'Failed to deactivate user', 'error');
      }
    } catch (error) {
      addToast('Error deactivating user', 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('User role updated successfully', 'success');
        fetchUsers();
      } else {
        addToast(data.message || 'Failed to update role', 'error');
      }
    } catch (error) {
      addToast('Error updating role', 'error');
    }
  };

  const fetchDisputes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users/disputes/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDisputes(data.disputes);
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
    }
  };

  const handleVerifyHost = async (userId) => {
    if (!window.confirm('Are you sure you want to verify this host?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Host verified successfully', 'success');
        fetchUsers();
      } else {
        addToast(data.message || 'Failed to verify host', 'error');
      }
    } catch (error) {
      addToast('Error verifying host', 'error');
    }
  };

  const handleResolveDispute = async (disputeId, resolution) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/disputes/${disputeId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resolution })
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Dispute resolved successfully', 'success');
        fetchDisputes();
      } else {
        addToast(data.message || 'Failed to resolve dispute', 'error');
      }
    } catch (error) {
      addToast('Error resolving dispute', 'error');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const hosts = users.filter(u => u.role === 'host');
  const guests = users.filter(u => u.role === 'guest');
  const activeHosts = hosts.filter(h => h.status === 'active').length;
  const totalUnits = hosts.reduce((sum, host) => sum + (host.unitsCount || 0), 0);
  const totalRevenue = 180300; // This should come from backend

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all system users and disputes</p>
        </div>
        <Link to="/admin/verifications">
          <Button className="bg-[#4E7B22] hover:bg-[#3d6119] text-white px-4 py-2 rounded-lg">
            View Hosts Verification
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('hosts')}
            className={`pb-3 px-1 font-medium text-sm transition ${
              activeTab === 'hosts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Host ({hosts.length})
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`pb-3 px-1 font-medium text-sm transition ${
              activeTab === 'guests'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Guests ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`pb-3 px-1 font-medium text-sm transition ${
              activeTab === 'disputes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Disputes ({disputes.filter(d => d.status === 'open').length})
          </button>
        </div>
      </div>

      {/* Stats Cards - Only show for hosts tab */}
      {activeTab === 'hosts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Hosts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Hosts</p>
                <p className="text-4xl font-bold text-gray-900">{hosts.length}</p>
                <p className="text-xs text-gray-500 mt-2">{activeHosts} active</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Units */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Units</p>
                <p className="text-4xl font-bold text-gray-900">{totalUnits}</p>
                <p className="text-xs text-gray-500 mt-2">Across all hosts</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500 mt-2">This month</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table - Show for hosts and guests tabs */}
      {activeTab !== 'disputes' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">HOST ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NAME</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">EMAIL</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">UNITS</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">REVENUE</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">JOINED DATE</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(activeTab === 'hosts' ? hosts : guests).map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">H{String(index + 1).padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.unitsCount || Math.floor(Math.random() * 10) + 1}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <span className="text-lg">$</span>
                        {(Math.random() * 100 + 15).toFixed(3).replace('.', ',')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <Card>
          <div className="space-y-4">
            {disputes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No disputes found</p>
              </div>
            ) : (
              disputes.map(dispute => (
                <div key={dispute.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        dispute.status === 'open' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {dispute.status.toUpperCase()}
                      </span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {dispute.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{dispute.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    User ID: {dispute.userId} | Booking ID: {dispute.bookingId}
                  </div>
                  {dispute.status === 'open' ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter resolution..."
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            handleResolveDispute(dispute.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector('input');
                          if (input.value.trim()) {
                            handleResolveDispute(dispute.id, input.value);
                            input.value = '';
                          }
                        }}
                      >
                        Resolve
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs font-semibold text-green-800 mb-1">Resolution:</p>
                      <p className="text-sm text-green-700">{dispute.resolution}</p>
                      <p className="text-xs text-green-600 mt-1">
                        Resolved on {new Date(dispute.resolvedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* User Details/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
          setSelectedUser(null);
        }}
        title={selectedUser && !editingUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : (editingUser ? 'Edit User' : 'Add New User')}
      >
        {selectedUser && !editingUser ? (
          /* View User Details */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p className="text-gray-900">{selectedUser.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p className="text-gray-900">{selectedUser.lastName}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{selectedUser.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-gray-900 capitalize">{selectedUser.role}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{selectedUser.phone || 'N/A'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                selectedUser.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {selectedUser.status || 'active'}
              </span>
            </div>
            
            {selectedUser.role === 'host' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedUser.verified 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedUser.verified ? '✓ Verified' : 'Pending Verification'}
                </span>
              </div>
            )}
            
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingUser(selectedUser);
                  setFormData({
                    email: selectedUser.email,
                    password: '',
                    role: selectedUser.role,
                    firstName: selectedUser.firstName,
                    lastName: selectedUser.lastName,
                    phone: selectedUser.phone || ''
                  });
                  setSelectedUser(null);
                }}
              >
                Edit User
              </Button>
              
              {selectedUser.role === 'host' && !selectedUser.verified && (
                <Button
                  onClick={() => {
                    handleVerifyHost(selectedUser.id);
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Verify Host
                </Button>
              )}
              
              {selectedUser.status === 'active' && (
                <Button
                  onClick={() => {
                    handleDeactivate(selectedUser.id);
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Deactivate User
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Add/Edit User Form */
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="guest">Guest</option>
              <option value="host">Host</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Users;
