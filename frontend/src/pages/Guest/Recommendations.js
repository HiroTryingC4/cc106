import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPersonalizedData, setHasPersonalizedData] = useState(false);

  useEffect(() => {
    fetchRecommendations();
    fetchTrending();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/guest/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
        setHasPersonalizedData(data.hasPersonalizedData);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/guest/recommendations/trending');
      const data = await response.json();
      if (data.success) {
        setTrending(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const PropertyCard = ({ unit, showMatchScore = false }) => (
    <Link
      to={`/units/${unit.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        <img
          src={unit.images[0]}
          alt={unit.name}
          className="w-full h-48 object-cover"
        />
        {showMatchScore && unit.matchScore > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {unit.matchScore}% Match
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          {unit.recommendationReason}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase">{unit.type}</span>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm font-semibold">{unit.rating}</span>
            <span className="ml-1 text-xs text-gray-500">({unit.reviewCount})</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{unit.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{unit.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ₱{unit.pricePerNight}
            <span className="text-sm text-gray-600 font-normal">/night</span>
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {unit.bedrooms} bed • {unit.bathrooms} bath • {unit.maxGuests} guests
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading recommendations...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {hasPersonalizedData ? '✨ Recommended For You' : '🏠 Popular Properties'}
        </h1>
        <p className="text-gray-600 mt-2">
          {hasPersonalizedData
            ? 'Properties we think you\'ll love based on your preferences'
            : 'Start browsing to get personalized recommendations'}
        </p>
      </div>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {hasPersonalizedData ? 'Perfect Matches' : 'Popular Choices'}
            </h2>
            {!hasPersonalizedData && (
              <Link to="/units">
                <Button size="sm" variant="secondary">Browse All</Button>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((unit) => (
              <PropertyCard key={unit.id} unit={unit} showMatchScore={hasPersonalizedData} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Properties */}
      {trending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">🔥 Trending Now</h2>
            <Link to="/units">
              <Button size="sm" variant="secondary">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.slice(0, 6).map((unit) => (
              <PropertyCard key={unit.id} unit={unit} />
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!hasPersonalizedData && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get Personalized Recommendations
            </h3>
            <p className="text-gray-600 mb-6">
              Browse properties to help us understand your preferences and show you the perfect matches
            </p>
            <Link to="/units">
              <Button size="lg">Start Browsing</Button>
            </Link>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Recommendations;
