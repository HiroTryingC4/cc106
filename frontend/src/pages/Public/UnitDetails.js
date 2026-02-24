import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import BookingCalendar from '../../components/BookingCalendar';
import PropertyChatbot from '../../components/PropertyChatbot';
import AuthModal from '../../components/AuthModal';
import { useAuth } from '../../context/AuthContext';

const UnitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const trackView = async (unitId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/guest/browsing-history/track',
        { unitId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      // Silently fail - tracking is not critical
      console.log('Failed to track view:', error);
    }
  };

  const fetchUnit = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/units/${id}`);
      setUnit(response.data.unit);
      
      // Track view if user is logged in as guest
      if (user && user.role === 'guest') {
        trackView(id);
      }
    } catch (error) {
      console.error('Failed to fetch unit:', error);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchUnit();
  }, [fetchUnit]);

  const handleBookNow = () => {
    if (user && user.role === 'guest') {
      // Pass selected dates to booking page if available
      const params = new URLSearchParams();
      if (checkInDate) params.append('checkIn', checkInDate);
      if (checkOutDate) params.append('checkOut', checkOutDate);
      const queryString = params.toString();
      navigate(`/guest/booking/new/${id}${queryString ? `?${queryString}` : ''}`);
    } else {
      // Show authentication modal for non-authenticated users
      setShowAuthModal(true);
    }
  };

  const handleDateSelect = (startDate, endDate) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!unit) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Unit not found</h2>
            <Link to="/units">
              <Button>Back to Units</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/units" className="hover:text-primary">Units</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{unit.name}</span>
          </div>

          {/* Hero Section - Side by Side Layout */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Image Gallery */}
              <div className="relative bg-gray-900">
                <img
                  src={unit.images[selectedImage]}
                  alt={`${unit.name} ${selectedImage + 1}`}
                  className="w-full h-full min-h-[500px] lg:min-h-[600px] object-cover"
                />
                
                {/* Image Navigation */}
                {unit.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? unit.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === unit.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {unit.images.length}
                </div>

                {/* Thumbnail Gallery - Overlay at bottom */}
                {unit.images.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {unit.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          onClick={() => setSelectedImage(index)}
                          className={`w-16 h-16 object-cover rounded cursor-pointer transition flex-shrink-0 ${
                            selectedImage === index ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Property Information */}
              <div className="p-8 flex flex-col justify-between">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-primary uppercase px-3 py-1 bg-blue-50 rounded-full">
                      {unit.type}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <span className="text-xl">★</span>
                      <span className="ml-1 text-sm font-semibold text-gray-900">{unit.rating}</span>
                      <span className="ml-1 text-xs text-gray-600">({unit.reviewCount})</span>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold mb-3">{unit.name}</h1>
                  
                  <p className="text-gray-600 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {unit.address}
                  </p>

                  <p className="text-gray-700 mb-6 leading-relaxed">{unit.description}</p>

                  {/* Quick Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl mb-1">🛏️</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                      <div className="font-semibold">{unit.bedrooms}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl mb-1">🚿</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                      <div className="font-semibold">{unit.bathrooms}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl mb-1">👥</div>
                      <div className="text-sm text-gray-600">Max Guests</div>
                      <div className="font-semibold">{unit.maxGuests}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl mb-1">💰</div>
                      <div className="text-sm text-gray-600">Per Night</div>
                      <div className="font-semibold text-primary">₱{unit.pricePerNight}</div>
                    </div>
                  </div>

                  {/* Stay Duration */}
                  {unit.stayDuration && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">⏱️</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-blue-900">Stay Duration</div>
                          <div className="text-sm text-blue-700">
                            {unit.stayDuration === 'flexible' && 'Flexible Stay (more than a day)'}
                            {unit.stayDuration === 'fixed_22' && 'Fixed 22 Hours'}
                            {unit.stayDuration === 'fixed_12' && 'Fixed 12 Hours'}
                            {unit.stayDuration === 'fixed_6' && 'Fixed 6 Hours'}
                          </div>
                          {(unit.stayDuration === 'fixed_22' || unit.stayDuration === 'fixed_12' || unit.stayDuration === 'fixed_6') && unit.fixedCheckInTime && unit.fixedCheckOutTime && (
                            <div className="mt-2 text-xs text-blue-600 bg-blue-100 rounded px-2 py-1 inline-block">
                              Check-in: {unit.fixedCheckInTime} | Check-out: {unit.fixedCheckOutTime}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Extra Guest Fee */}
                  {unit.extraGuestFee && unit.extraGuestFee > 0 && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">👥</div>
                        <div>
                          <div className="text-sm font-semibold text-green-900">Extra Guest Fee</div>
                          <div className="text-sm text-green-700">
                            ₱{unit.extraGuestFee} per additional guest per night
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hourly Pricing Options */}
                  {unit.hourlyPricing && unit.hourlyPricing.length > 0 && (
                    <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">⏰</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-purple-900 mb-2">Hourly Pricing Options</div>
                          <div className="space-y-1">
                            {unit.hourlyPricing.map((pricing, index) => (
                              pricing.hours && pricing.price && (
                                <div key={index} className="flex items-center justify-between text-sm text-purple-700">
                                  <span>{pricing.hours} {pricing.hours === '1' ? 'hour' : 'hours'}</span>
                                  <span className="font-semibold">₱{pricing.price}</span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top Amenities Preview */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-sm text-gray-600 uppercase mb-3">Top Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {unit.amenities.slice(0, 6).map((amenity, index) => (
                        <span key={index} className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center">
                          <span className="mr-1">✓</span>
                          {amenity}
                        </span>
                      ))}
                      {unit.amenities.length > 6 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          +{unit.amenities.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking CTA */}
                <div className="border-t pt-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        ₱{unit.pricePerNight}
                      </div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowChatbot(true)}
                        className="flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Ask
                      </Button>
                      <Button size="lg" onClick={handleBookNow} className="px-8">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Sections */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              {/* All Amenities */}
              <div className="mb-8 pb-8 border-b">
                <h3 className="font-semibold text-2xl mb-6">All Amenities</h3>
                <ul className="grid md:grid-cols-3 gap-3 text-gray-700">
                  {unit.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location Map & Availability Calendar - Side by Side */}
              <div className="mb-8 pb-8 border-b">
                <h3 className="font-semibold text-2xl mb-6">Location & Availability</h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Location Map */}
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-lg mb-3">Location</h4>
                    <p className="text-gray-600 mb-3 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {unit.address}
                    </p>
                    <div className="w-full flex-1 rounded-lg overflow-hidden border border-gray-200" style={{ minHeight: '400px' }}>
                      <iframe
                        title="Property Location"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(unit.address)}`}
                        allowFullScreen
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * Map shows approximate location for privacy
                    </p>
                  </div>

                  {/* Availability Calendar */}
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-lg mb-3">Check Availability</h4>
                    <p className="text-gray-600 mb-3 text-sm">Select your check-in and check-out dates</p>
                    <div className="flex-1">
                      <BookingCalendar
                        unitId={id}
                        onDateSelect={handleDateSelect}
                        selectedStartDate={checkInDate}
                        selectedEndDate={checkOutDate}
                        pricePerNight={unit.pricePerNight}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div>
                <h3 className="font-semibold text-2xl mb-6">House Rules</h3>
                <p className="text-gray-700 leading-relaxed">{unit.houseRules}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Chatbot */}
      {showChatbot && (
        <PropertyChatbot
          unitId={unit.id}
          hostId={unit.hostId}
          unitName={unit.name}
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectTo={`/guest/booking/new/${id}${checkInDate && checkOutDate ? `?checkIn=${checkInDate}&checkOut=${checkOutDate}` : ''}`}
      />
    </Layout>
  );
};

export default UnitDetails;
