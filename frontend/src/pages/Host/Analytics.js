import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';

const Analytics = () => {
  const [guestAnalytics, setGuestAnalytics] = useState(null);
  const [bookingAnalytics, setBookingAnalytics] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [guestRes, bookingRes, revenueRes] = await Promise.all([
        fetch('http://localhost:5000/api/host/analytics/guests', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/analytics/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/analytics/revenue', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [guestData, bookingData, revenueData] = await Promise.all([
        guestRes.json(),
        bookingRes.json(),
        revenueRes.json()
      ]);

      if (guestData.success) setGuestAnalytics(guestData.analytics);
      if (bookingData.success) setBookingAnalytics(bookingData.analytics);
      if (revenueData.success) setRevenueAnalytics(revenueData.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-2">Track your property performance</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Guest Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Total Guests</h3>
              <p className="text-2xl font-bold text-blue-600">{guestAnalytics?.totalGuests || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Monthly Guests</h3>
              <p className="text-2xl font-bold text-green-600">{guestAnalytics?.monthlyGuests || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">New Guests</h3>
              <p className="text-2xl font-bold text-purple-600">{guestAnalytics?.newGuests || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Returning Guests</h3>
              <p className="text-2xl font-bold text-orange-600">{guestAnalytics?.returningGuests || 0}</p>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Booking Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Total Bookings</h3>
              <p className="text-2xl font-bold text-blue-600">{bookingAnalytics?.totalBookings || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Confirmed</h3>
              <p className="text-2xl font-bold text-green-600">{bookingAnalytics?.confirmedBookings || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">{bookingAnalytics?.pendingBookings || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Occupancy Rate</h3>
              <p className="text-2xl font-bold text-purple-600">{bookingAnalytics?.occupancyRate || 0}%</p>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">₱{revenueAnalytics?.totalRevenue || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">This Month</h3>
              <p className="text-2xl font-bold text-blue-600">₱{revenueAnalytics?.currentMonthRevenue || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Expenses</h3>
              <p className="text-2xl font-bold text-red-600">₱{revenueAnalytics?.estimatedExpenses?.toFixed(0) || 0}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Net Profit</h3>
              <p className="text-2xl font-bold text-purple-600">₱{revenueAnalytics?.netProfit?.toFixed(0) || 0}</p>
            </Card>
          </div>
        </div>

        {bookingAnalytics?.monthlyTrends && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Booking Trends (Last 6 Months)</h2>
            <div className="space-y-2">
              {bookingAnalytics.monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-24">{trend.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.min((trend.bookings / 10) * 100, 100)}%` }}
                    >
                      <span className="text-xs text-white font-medium">{trend.bookings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
