import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import { useAuth } from '../../context/AuthContext';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: '', type: 'all', minPrice: '', maxPrice: '', guests: '', bedrooms: '', stayDuration: 'all', sort: 'default'
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRedirectTo, setAuthRedirectTo] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchUnits(); /* eslint-disable-next-line */ }, [filters, pagination.page]);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.guests) params.append('guests', filters.guests);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.stayDuration !== 'all') params.append('stayDuration', filters.stayDuration);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', pagination.page);
      params.append('limit', '50');

      const response = await axios.get(`http://localhost:5000/api/units?${params}`);
      setUnits(response.data.units);
      setPagination({ page: response.data.page, totalPages: response.data.totalPages, total: response.data.total });
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const clearFilters = () => { setFilters({ search: '', type: 'all', minPrice: '', maxPrice: '', guests: '', bedrooms: '', stayDuration: 'all', sort: 'default' }); setPagination({ ...pagination, page: 1 }); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏠</span>
            <h1 className="text-3xl font-bold text-gray-900">Available Units</h1>
          </div>
          <p className="text-gray-600">Discover amazing places to stay for your next adventure</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input 
              type="text" 
              name="search" 
              placeholder="Search units..." 
              value={filters.search} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="condo">Condo</option>
              <option value="studio">Studio</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="penthouse">Penthouse</option>
              <option value="cottage">Cottage</option>
            </select>
            <select 
              name="guests" 
              value={filters.guests} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Any Guests</option>
              <option value="1">1+ Guest</option>
              <option value="2">2+ Guests</option>
              <option value="4">4+ Guests</option>
              <option value="6">6+ Guests</option>
            </select>
            <select 
              name="bedrooms" 
              value={filters.bedrooms} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1+ Bedroom</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input 
              type="number" 
              name="minPrice" 
              placeholder="Min Price" 
              value={filters.minPrice} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input 
              type="number" 
              name="maxPrice" 
              placeholder="Max Price" 
              value={filters.maxPrice} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <select 
              name="stayDuration" 
              value={filters.stayDuration} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Any Duration</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select 
              name="sort" 
              value={filters.sort} 
              onChange={handleFilterChange} 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="default">Default</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <div className="text-xl text-gray-600">Loading amazing places...</div>
            </div>
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-xl text-gray-600 mb-6">No units found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">Showing {units.length} of {pagination.total} units</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {units.map((unit) => (
                <div key={unit.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <Link to={`/units/${unit.id}`} className="block">
                    <div className="relative">
                      <img 
                        src={unit.images && unit.images[0] ? unit.images[0] : '/api/placeholder/400/250'} 
                        alt={unit.name} 
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 uppercase tracking-wide">
                          {unit.type}
                        </span>
                      </div>
                      {unit.instantBooking && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⚡ Instant Booking
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4">
                        <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-2 py-1">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="ml-1 text-sm font-semibold text-gray-900">{unit.rating || '4.5'}</span>
                          <span className="ml-1 text-xs text-gray-600">({unit.reviewCount || '0'})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {unit.name}
                      </h3>
                      
                      {unit.address && (
                        <p className="text-sm text-gray-500 mb-3 flex items-center">
                          <span className="mr-1">📍</span>
                          <span className="line-clamp-1">{unit.address}</span>
                        </p>
                      )}
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {unit.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600 flex items-center gap-4">
                          <span className="flex items-center">
                            <span className="mr-1">🛏️</span>
                            {unit.bedrooms} bed
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">🚿</span>
                            {unit.bathrooms} bath
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">👥</span>
                            {unit.maxGuests} guests
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-green-600">
                            ₱{unit.pricePerNight}
                            <span className="text-sm text-gray-600 font-normal">/night</span>
                          </span>
                          {unit.nightHours && (
                            <div className="text-xs text-gray-500 mt-1">
                              ({unit.nightHours} hours included)
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (user && user.role === 'guest') {
                              navigate(`/guest/booking/new/${unit.id}`);
                            } else {
                              setAuthRedirectTo(`/guest/booking/new/${unit.id}`);
                              setShowAuthModal(true);
                            }
                          }}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Auth modal for booking */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => { 
            setShowAuthModal(false); 
            setAuthRedirectTo(null); 
          }} 
          redirectTo={authRedirectTo} 
        />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Units;
