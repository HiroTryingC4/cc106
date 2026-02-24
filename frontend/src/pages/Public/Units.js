import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    minPrice: '',
    maxPrice: '',
    guests: '',
    bedrooms: '',
    stayDuration: 'all',
    sort: 'default'
  });

  useEffect(() => {
    fetchUnits();
  }, [filters]);

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

      const response = await axios.get(`http://localhost:5000/api/units?${params}`);
      setUnits(response.data.units);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      minPrice: '',
      maxPrice: '',
      guests: '',
      bedrooms: '',
      stayDuration: 'all',
      sort: 'default'
    });
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Available Units</h1>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <input
                type="text"
                name="search"
                placeholder="Search units..."
                value={filters.search}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Type */}
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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

              {/* Guests */}
              <select
                name="guests"
                value={filters.guests}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Any Guests</option>
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="4">4+ Guests</option>
                <option value="6">6+ Guests</option>
              </select>

              {/* Bedrooms */}
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1+ Bedroom</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>

              {/* Stay Duration */}
              <select
                name="stayDuration"
                value={filters.stayDuration}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Any Duration</option>
                <option value="flexible">Flexible Stay</option>
                <option value="fixed_22">Fixed 22 Hours</option>
                <option value="fixed_12">Fixed 12 Hours</option>
                <option value="fixed_6">Fixed 6 Hours</option>
              </select>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {/* Min Price */}
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Max Price */}
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Sort */}
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="default">Default</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>

              {/* Clear Filters */}
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-xl text-gray-600">Loading units...</div>
            </div>
          ) : units.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No units found matching your criteria</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">{units.length} units found</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit) => (
                  <Link
                    key={unit.id}
                    to={`/units/${unit.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={unit.images[0]}
                      alt={unit.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary uppercase">{unit.type}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-sm font-semibold">{unit.rating}</span>
                          <span className="ml-1 text-xs text-gray-500">({unit.reviewCount})</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{unit.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {unit.description}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-primary">
                          ₱{unit.pricePerNight}
                          <span className="text-sm text-gray-600 font-normal">/night</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {unit.bedrooms} bed • {unit.bathrooms} bath • {unit.maxGuests} guests
                      </div>
                      {unit.stayDuration && (
                        <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                          ⏱️ {unit.stayDuration === 'flexible' && 'Flexible Stay'}
                          {unit.stayDuration === 'fixed_22' && 'Fixed 22hrs'}
                          {unit.stayDuration === 'fixed_12' && 'Fixed 12hrs'}
                          {unit.stayDuration === 'fixed_6' && 'Fixed 6hrs'}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Units;
