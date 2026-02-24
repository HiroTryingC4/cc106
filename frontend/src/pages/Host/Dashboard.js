import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

const HostDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await refreshUser();
    setTimeout(() => setRefreshing(false), 500);
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setRecentBookings(data.recentBookings);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      {/* Verification Banner for Unverified Hosts */}
      {!user?.verified && (
        <Card className="mb-6 bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">
                Complete Your Host Verification
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                Your account is not yet verified. Complete the verification process to unlock all host features including creating listings, accepting bookings, and receiving payments.
              </p>
              <div className="flex gap-2">
                <Link to="/host/verification">
                  <Button size="sm">
                    Start Verification Process
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

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your property overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Total Units</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUnits || 0}</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Total Guests</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalGuests || 0}</p>
          <p className="text-xs text-gray-500 mt-1">{stats?.monthlyGuests || 0} this month</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalBookings || 0}</p>
          <p className="text-xs text-gray-500 mt-1">{stats?.pendingBookings || 0} pending</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-orange-600">₱{stats?.totalRevenue || 0}</p>
          <p className="text-xs text-gray-500 mt-1">₱{stats?.monthlyRevenue || 0} this month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <Link to="/host/bookings">
              <Button size="sm" variant="secondary">View All</Button>
            </Link>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Booking #{booking.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{booking.unitName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-1">₱{booking.totalPrice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {user?.verified ? (
              <>
                <Link to="/host/units/new" className="block">
                  <Button className="w-full">+ Add New Unit</Button>
                </Link>
                <Link to="/host/units" className="block">
                  <Button className="w-full" variant="secondary">Manage Units</Button>
                </Link>
                <Link to="/host/bookings" className="block">
                  <Button className="w-full" variant="secondary">View Bookings</Button>
                </Link>
                <Link to="/host/analytics" className="block">
                  <Button className="w-full" variant="secondary">View Analytics</Button>
                </Link>
                <Link to="/host/financial" className="block">
                  <Button className="w-full" variant="secondary">Financial Reports</Button>
                </Link>
                <Link to="/host/guests" className="block">
                  <Button className="w-full" variant="secondary">Guest Management</Button>
                </Link>
                <Link to="/host/chatbot" className="block">
                  <Button className="w-full" variant="secondary">Chatbot Settings</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/host/verification" className="block">
                  <Button className="w-full">✅ Complete Verification</Button>
                </Link>
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-3">Preview features (read-only):</p>
                  <Link to="/host/units" className="block mb-2">
                    <Button className="w-full" variant="secondary" size="sm">View Units</Button>
                  </Link>
                  <Link to="/host/bookings" className="block mb-2">
                    <Button className="w-full" variant="secondary" size="sm">View Bookings</Button>
                  </Link>
                  <Link to="/host/analytics" className="block mb-2">
                    <Button className="w-full" variant="secondary" size="sm">View Analytics</Button>
                  </Link>
                  <Link to="/host/financial" className="block">
                    <Button className="w-full" variant="secondary" size="sm">View Financial</Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Security Deposits</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium">₱{stats?.pendingDeposits || 0}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HostDashboard;
