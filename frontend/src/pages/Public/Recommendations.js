import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import { useAuth } from '../../context/AuthContext';

const PublicRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
    fetchTrending();
  }, []);

  const fetchRecommendations = async () => {
    try {
      // Try to fetch personalized recommendations if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:5000/api/guest/recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setRecommendations(data.recommendations);
        }
      } else {
        // Fetch trending for non-authenticated users
        const response = await fetch('http://localhost:5000/api/guest/recommendations/trending');
        const data = await response.json();
        if (data.success) {
          setRecommendations(data.recommendations.slice(0, 8));
        }
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

  const handleBookClick = (unit) => {
    if (user && user.role === 'guest') {
      navigate(`/guest/booking/new/${unit.id}`);
    } else {
      setSelectedUnit(unit);
      setShowAuthModal(true);
    }
  };

  const PropertyCard = ({ unit, showMatchScore = false }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/units/${unit.id}`} className="block">
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
          {unit.recommendationReason && (
            <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              {unit.recommendationReason}
            </div>
          )}
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
      <div className="px-4 pb-4">
        <Button
          fullWidth
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            handleBookClick(unit);
          }}
        >
          Book Now
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading recommendations...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {user ? '✨ Recommended For You' : '🏠 Discover Amazing Properties'}
            </h1>
            <p className="text-gray-600 text-lg">
              {user
                ? 'Properties we think you\'ll love based on your preferences'
                : 'Browse our curated selection of top-rated properties'}
            </p>
          </div>

          {/* Main Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user ? 'Perfect Matches' : 'Featured Properties'}
                </h2>
                <Link to="/units">
                  <Button size="sm" variant="secondary">View All Properties</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map((unit) => (
                  <PropertyCard key={unit.id} unit={unit} showMatchScore={!!user} />
                ))}
              </div>
            </div>
          )}

          {/* Trending Properties */}
          {trending.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
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

          {/* Call to Action for Non-Authenticated Users */}
          {!user && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="text-center py-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Get Personalized Recommendations
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                  Sign up now to receive personalized property recommendations based on your preferences and browsing history
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" onClick={() => setShowAuthModal(true)}>
                    Sign Up Free
                  </Button>
                  <Link to="/units">
                    <Button size="lg" variant="secondary">
                      Browse Properties
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSelectedUnit(null);
        }}
        redirectTo={selectedUnit ? `/guest/booking/new/${selectedUnit.id}` : undefined}
      />
    </Layout>
  );
};

export default PublicRecommendations;
