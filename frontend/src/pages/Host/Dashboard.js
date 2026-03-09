import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import VerificationModal from '../../components/VerificationModal';
import { useAuth } from '../../context/AuthContext';

const HostDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    
    // Check if user just completed onboarding
    const justCompleted = localStorage.getItem('justCompletedOnboarding');
    if (justCompleted === 'true' && !user?.verified) {
      // Show verification modal after a short delay
      setTimeout(() => {
        setShowVerificationModal(true);
        localStorage.removeItem('justCompletedOnboarding');
      }, 500);
    }
  }, [user]);

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
      {/* Verification Modal */}
      <VerificationModal 
        show={showVerificationModal} 
        onClose={() => setShowVerificationModal(false)} 
      />

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
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Total Units</h3>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUnits || 0}</p>
              <p className="text-xs text-gray-400 mt-1">+2 this month</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Active Bookings</h3>
              <p className="text-3xl font-bold text-gray-900">{stats?.activeBookings || 0}</p>
              <p className="text-xs text-gray-400 mt-1">{stats?.checkingInToday || 0} Checking in today</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Pending Deposits</h3>
              <p className="text-3xl font-bold text-gray-900">{stats?.pendingDepositsCount || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Requires action</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Pending Bookings</h3>
              <p className="text-3xl font-bold text-gray-900">{stats?.pendingBookings || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Requires action</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Revenue (MTD)</h3>
              <p className="text-3xl font-bold text-gray-900">{stats?.monthlyRevenue || 0}</p>
              <p className="text-xs text-gray-400 mt-1">+18% vs last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💵</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights & Recommendations */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-500">📈</span>
            <h2 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <h3 className="font-semibold text-gray-900 mb-1">Smart Pricing Opportunity</h3>
              <p className="text-sm text-gray-600">3 units can increase rates by 18% upcoming weekend</p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
              <h3 className="font-semibold text-gray-900 mb-1">Guest Response Needed</h3>
              <p className="text-sm text-gray-600">AI handled 17 guest inquiries today with 95% satisfaction</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <h3 className="font-semibold text-gray-900 mb-1">High Engagement</h3>
              <p className="text-sm text-gray-600">AI handled 17 guest inquiries today with 95% satisfaction</p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-500">ℹ️</span>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>

          <div className="space-y-4">
            {recentBookings.slice(0, 4).map((booking, index) => (
              <div key={booking.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  booking.status === 'confirmed' ? 'bg-green-500' : 
                  booking.status === 'pending' ? 'bg-orange-500' : 
                  'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{booking.unitName}</h4>
                  <p className="text-xs text-gray-600">
                    {booking.guestName || 'Guest'} • {booking.status === 'confirmed' ? 'Check-in confirmed' : 
                    booking.status === 'pending' ? 'Payment received' : 
                    booking.status === 'completed' ? 'AI requested human review' : 
                    'Booking confirmed'}
                  </p>
                  <p className="text-xs text-gray-400">{index + 2} hours ago</p>
                </div>
              </div>
            ))}

            {recentBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions - Floating Button */}
      {user?.verified && (
        <Link to="/host/chatbot" className="fixed bottom-8 right-8 z-50">
          <button className="bg-green-700 hover:bg-green-800 text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2 transition-all">
            <span className="text-xl">💬</span>
            <span className="font-medium">Chat</span>
          </button>
        </Link>
      )}
    </DashboardLayout>
  );
};

export default HostDashboard;
