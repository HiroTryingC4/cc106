import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const calculateChange = (current, previous) => {
    if (!previous) return '+0%';
    const change = ((current - previous) / previous * 100).toFixed(1);
    return change >= 0 ? `+${change}%` : `${change}%`;
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and analytics for Smart Stay AI</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Users</p>
              <p className="text-4xl font-bold text-gray-900">
                {formatNumber(stats?.totalUsers || 67000)}+
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium">
              ↗ {calculateChange(stats?.totalUsers || 67000, 64000)} vs last week
            </span>
          </div>
        </div>

        {/* Total Hosts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Hosts</p>
              <p className="text-4xl font-bold text-gray-900">
                {stats?.totalHosts || 248}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium">
              ↗ {calculateChange(stats?.totalHosts || 248, 240)} vs last week
            </span>
          </div>
        </div>

        {/* Total Units */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Units</p>
              <p className="text-4xl font-bold text-gray-900">
                {stats?.totalUnits || 1247}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium">
              ↗ {calculateChange(stats?.totalUnits || 1247, 1080)} vs last week
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <p className="text-4xl font-bold text-gray-900">
                ${formatNumber(stats?.totalRevenue || 811500)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium">
              ↗ {calculateChange(stats?.totalRevenue || 811500, 723000)} vs last week
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Revenue Trend</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {/* Simple bar chart representation */}
            {[60000, 55000, 70000, 80000, 65000, 60000].map((value, index) => {
              const height = (value / 80000) * 100;
              const dates = ['Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20'];
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-100 rounded-t-lg" style={{ height: `${height}%` }}>
                    <div className="w-full bg-blue-400 rounded-t-lg h-full opacity-50"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{dates[index]}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center">
            <span className="text-sm text-blue-600 font-medium">Revenue ($)</span>
          </div>
        </div>

        {/* Bookings Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Bookings Overview</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {/* Bar chart for bookings */}
            {[135, 90, 160, 65, 135, 155].map((value, index) => {
              const height = (value / 180) * 100;
              const dates = ['Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20'];
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500 rounded-t-lg transition-all hover:bg-purple-600" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <p className="text-xs text-gray-500 mt-2">{dates[index]}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center">
            <span className="text-sm text-purple-600 font-medium">■ Bookings</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
