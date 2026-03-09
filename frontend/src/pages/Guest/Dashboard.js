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
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Guest Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500">Welcome back! Here's your booking overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Bookings</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.totalBookings}</p>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Upcoming</h3>
          <p className="text-4xl font-bold text-green-600">{stats.upcomingBookings}</p>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Completed</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.completedBookings}</p>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Spend</h3>
          <p className="text-4xl font-bold text-purple-600">₱{stats.totalSpent}</p>
        </Card>
      </div>

      <Card className="mb-6 md:mb-8 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recent Bookings</h2>
          <Link to="/guest/bookings">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors min-h-[44px]">
              View all
            </button>
          </Link>
        </div>
        
        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No bookings yet. Start exploring!</p>
            <Link to="/units">
              <Button>Browse Units</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {recentBookings.map(booking => (
              <div key={booking.id} className="bg-gray-50 rounded-lg p-3 md:p-4 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                      <span className="font-semibold text-sm md:text-base text-gray-900">Booking #{booking.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-sm md:text-base font-bold text-gray-900">₱{booking.totalPrice}</p>
                  </div>
                  <Link to={`/guest/bookings/${booking.id}`}>
                    <button className="w-full sm:w-auto px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors min-h-[44px]">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Browsing Analytics */}
      {browsingAnalytics && browsingAnalytics.totalViews > 0 && (
        <Card className="mb-6 md:mb-8 bg-white shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">📊 Your Browsing Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-xs md:text-sm text-gray-500 font-medium mb-2 md:mb-3">Properties Viewed</h3>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">{browsingAnalytics.totalViews}</p>
            </div>
            <div>
              <h3 className="text-xs md:text-sm text-gray-500 font-medium mb-2 md:mb-3">Preferred Property Types</h3>
              <div className="space-y-2">
                {browsingAnalytics.preferredTypes.slice(0, 3).map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs md:text-sm capitalize font-medium text-gray-700">{type.type}</span>
                    <span className="text-xs md:text-sm text-gray-500">{type.count} views</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs md:text-sm text-gray-500 font-medium mb-2 md:mb-3">Your Price Range</h3>
              <p className="text-lg md:text-xl font-bold text-gray-900">
                ₱{browsingAnalytics.averagePriceRange.min} - ₱{browsingAnalytics.averagePriceRange.max}
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Average: ₱{browsingAnalytics.averagePriceRange.average}/night</p>
            </div>
          </div>
          {browsingAnalytics.commonAmenities.length > 0 && (
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <h3 className="text-xs md:text-sm text-gray-500 font-medium mb-2 md:mb-3">Amenities You Look For:</h3>
              <div className="flex flex-wrap gap-2">
                {browsingAnalytics.commonAmenities.map((item, index) => (
                  <span key={index} className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-50 text-blue-700 rounded-full text-xs md:text-sm font-medium">
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
        <Card className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 md:mb-4 gap-3">
            <h2 className="text-lg md:text-xl font-semibold">✨ Recommended For You</h2>
            <Link to="/guest/recommendations">
              <Button size="sm" variant="secondary">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
                  {unit.address && (
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1 line-clamp-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {unit.address}
                    </p>
                  )}
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
