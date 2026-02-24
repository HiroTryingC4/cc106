import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

const GuestDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [browsingAnalytics, setBrowsingAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchBrowsingAnalytics();
    fetchRecommendations();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/guest/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setRecentBookings(data.bookings.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrowsingAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/guest/browsing-history/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBrowsingAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching browsing analytics:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/guest/recommendations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Guest Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your booking overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalBookings}</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Upcoming</h3>
          <p className="text-3xl font-bold text-green-600">{stats.upcomingBookings}</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Completed</h3>
          <p className="text-3xl font-bold text-gray-700">{stats.completedBookings}</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-purple-600">₱{stats.totalSpent}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <Link to="/guest/bookings">
              <Button size="sm" variant="secondary">View All</Button>
            </Link>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No bookings yet. Start exploring!</p>
              <Link to="/units">
                <Button>Browse Units</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Booking #{booking.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-1">₱{booking.totalPrice}</p>
                    </div>
                    <Link to={`/guest/bookings/${booking.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/units" className="block">
              <Button className="w-full">Browse Units</Button>
            </Link>
            <Link to="/guest/bookings" className="block">
              <Button className="w-full" variant="secondary">My Bookings</Button>
            </Link>
            <Link to="/guest/profile" className="block">
              <Button className="w-full" variant="secondary">Edit Profile</Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Browsing Analytics */}
      {browsingAnalytics && browsingAnalytics.totalViews > 0 && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Your Browsing Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Properties Viewed</h3>
              <p className="text-2xl font-bold text-blue-600">{browsingAnalytics.totalViews}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Preferred Property Types</h3>
              <div className="space-y-1">
                {browsingAnalytics.preferredTypes.slice(0, 3).map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type.type}</span>
                    <span className="text-xs text-gray-500">{type.count} views</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Your Price Range</h3>
              <p className="text-lg font-semibold">
                ₱{browsingAnalytics.averagePriceRange.min} - ₱{browsingAnalytics.averagePriceRange.max}
              </p>
              <p className="text-xs text-gray-500">Average: ₱{browsingAnalytics.averagePriceRange.average}/night</p>
            </div>
          </div>
          {browsingAnalytics.commonAmenities.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm text-gray-600 mb-2">Amenities You Look For</h3>
              <div className="flex flex-wrap gap-2">
                {browsingAnalytics.commonAmenities.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {item.amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <Card className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">✨ Recommended For You</h2>
            <Link to="/guest/recommendations">
              <Button size="sm" variant="secondary">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((unit) => (
              <Link
                key={unit.id}
                to={`/units/${unit.id}`}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition"
              >
                <img
                  src={unit.images[0]}
                  alt={unit.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase">{unit.type}</span>
                    {unit.matchScore > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {unit.matchScore}% Match
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{unit.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">₱{unit.pricePerNight}</span>
                    <div className="flex items-center text-xs">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{unit.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{unit.recommendationReason}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default GuestDashboard;
