import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
// PropertyChatbot removed from Units list to avoid showing host chatbot globally

const GuestUnits = () => {
  const location = useLocation();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    minPrice: '',
    maxPrice: '',
    guests: '',
    bedrooms: '',
    location: '',
    sort: 'default'
  });

  useEffect(() => {
    console.log('Fetching units - Filters changed or page navigation'); // Debug log
    // Only fetch if we're on the units page (not on a detail page)
    if (location.pathname === '/guest/units') {
      fetchUnits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, location.pathname]); // Refetch when filters, page, or route changes

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
      if (filters.location) params.append('location', filters.location);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', pagination.page);
      params.append('limit', '9');

      console.log('Fetching units with params:', params.toString()); // Debug log
      
      const response = await axios.get(`http://localhost:5000/api/units?${params}`);
      
      console.log('Units API Response:', response.data); // Debug log
      console.log('Number of units received:', response.data?.units?.length || 0); // Debug log
      
      if (response.data && response.data.success && Array.isArray(response.data.units)) {
        setUnits(response.data.units);
        setPagination({
          page: response.data.page || 1,
          totalPages: response.data.totalPages || 1,
          total: response.data.total || 0
        });
        console.log('Units state updated with', response.data.units.length, 'units'); // Debug log
      } else {
        console.error('Invalid response format:', response.data);
        setUnits([]);
        setPagination({ page: 1, totalPages: 1, total: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch units:', error);
      console.error('Error details:', error.response?.data || error.message);
      setUnits([]); // Set empty array on error
      setPagination({ page: 1, totalPages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      minPrice: '',
      maxPrice: '',
      guests: '',
      bedrooms: '',
      location: '',
      sort: 'default'
    });
    setPagination({ ...pagination, page: 1 });
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'condo': return '🏢';
      case 'apartment': return '🏬';
      case 'house': return '🏠';
      case 'cottage': return '🏡';
      case 'penthouse': return '🏙️';
      case 'bungalow': return '🏘️';
      default: return '🏠';
    }
  };

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="mr-3">🏠</span>
          Available Units
        </h1>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <input
            type="text"
            name="search"
            placeholder="Search units..."
            value={filters.search}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E7B22]"
          />

          {/* Type */}
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E7B22]"
          >
            <option value="all">All Types</option>
            <option value="condo">Condo</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="cottage">Cottage</option>
            <option value="penthouse">Penthouse</option>
            <option value="bungalow">Bungalow</option>
          </select>

          {/* Guests */}
          <input
            type="number"
            name="guests"
            placeholder="Any Guests"
            value={filters.guests}
            onChange={handleFilterChange}
            min="1"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E7B22]"
          />

          {/* Bedrooms */}
          <input
            type="number"
            name="bedrooms"
            placeholder="Any Bedrooms"
            value={filters.bedrooms}
            onChange={handleFilterChange}
            min="1"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E7B22]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Any Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E7B22]"
          />

          {/* Min Price */}
          <input
            type="number"
            name="minPrice"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E7B22]"
          />

          {/* Max Price */}
          <input
            type="number"
            name="maxPrice"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E7B22]"
          />

          {/* Sort */}
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E7B22]"
          >
            <option value="default">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-[#4E7B22] hover:bg-[#3d6219] text-white rounded-lg transition font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Units Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading units...</div>
        </div>
      ) : units.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 text-lg">No units found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-[#4E7B22] hover:bg-[#3d6219] text-white rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {units.map((unit) => (
              <div
                key={unit.id}
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/guest/units/${unit.id}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/guest/units/${unit.id}`); }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={unit.images && unit.images[0] ? unit.images[0] : '/placeholder-unit.jpg'}
                    alt={unit.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <span>{getTypeIcon(unit.type)}</span>
                    <span className="uppercase text-xs">{unit.type}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-yellow-400 px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span>⭐</span>
                    <span>{unit.rating || '5.0'}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">
                    {unit.name}
                  </h3>
                  
                  {/* Host Profile Link */}
                  {unit.hostName && (
                    <div className="mb-2">
                      <Link
                        to={`/hosts/${unit.hostId}`}
                        className="text-sm text-[#4E7B22] hover:text-[#3d6219] font-medium flex items-center gap-1 w-fit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hosted by {unit.hostCompanyName || unit.hostName}
                      </Link>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {unit.description}
                  </p>
                  
                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {unit.capacity} guests
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {unit.bedrooms} beds
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <span className="text-2xl font-bold text-[#4E7B22]">
                        ₱{unit.pricePerNight}
                      </span>
                      <span className="text-sm text-gray-600">/night</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Chatbot for host intentionally not rendered here; appears on unit details only */}
    </DashboardLayout>
  );
};

export default GuestUnits;
