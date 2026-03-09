import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Button from '../../components/Button';
import PropertyChatbot from '../../components/PropertyChatbot';
import CancellationPolicyDisplay from '../../components/CancellationPolicyDisplay';

const GuestUnitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isPropertyChatOpen, setIsPropertyChatOpen] = useState(false);

  useEffect(() => {
    fetchUnitDetails();
  }, [id]);

  const fetchUnitDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/units/${id}`);
      const data = await response.json();
      if (data.success) {
        setUnit(data.unit);
      }
    } catch (error) {
      console.error('Error fetching unit details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'condo': return '🏢';
      case 'apartment': return '🏬';
      case 'house': return '🏠';
      case 'cottage': return '🏡';
      case 'penthouse': return '🏙️';
      case 'bungalow': return '🏘️';
      default: return '🏠';
    }
  };

  const handleBookNow = () => {
    navigate(`/guest/booking/new/${id}`);
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

  if (!unit) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Unit not found</p>
          <Link to="/guest/units">
            <Button className="mt-4">Back to Units</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back Button */}
      <Link 
        to="/guest/units"
        className="inline-flex items-center text-gray-600 hover:text-[#4E7B22] mb-6 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to units
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Image */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src={unit.images && unit.images[0] ? unit.images[0] : '/placeholder-unit.jpg'}
            alt={unit.name}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                <span>{getTypeIcon(unit.type)}</span>
                <span className="uppercase">{unit.type}</span>
              </span>
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                <span className="text-yellow-600">⭐</span>
                <span className="font-bold text-yellow-800">{unit.rating || '4.8'}</span>
                <span className="text-sm text-gray-600">({unit.reviewCount || 45})</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{unit.name}</h1>
            
            {/* Host Profile Link */}
            {(unit.hostName || unit.hostCompanyName) && (
              <Link
                to={`/hosts/${unit.hostId}`}
                className="inline-flex items-center gap-2 text-[#4E7B22] hover:text-[#3d6219] hover:underline font-medium mb-3 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Hosted by {unit.hostCompanyName || unit.hostName}
              </Link>
            )}
            
            {unit.address && (
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {unit.address}
              </p>
            )}

            <p className="text-gray-700 mt-4">{unit.description}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                👥
              </div>
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="text-xl font-bold text-gray-900">{unit.capacity}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                🛏️
              </div>
              <div>
                <p className="text-sm text-gray-600">Bedrooms</p>
                <p className="text-xl font-bold text-gray-900">{unit.bedrooms}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
                🚿
              </div>
              <div>
                <p className="text-sm text-gray-600">Bathrooms</p>
                <p className="text-xl font-bold text-gray-900">{unit.bathrooms || 2}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                ₱
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-xl font-bold text-[#4E7B22]">₱{unit.pricePerNight}</p>
              </div>
            </div>
          </div>

          {/* Pricing & Booking */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                ✓ Air Conditioning
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                ✓ Kitchen
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                ✓ Parking
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                ✓ Pool
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-3xl font-bold text-[#4E7B22]">₱{unit.pricePerNight}</p>
                <p className="text-sm text-gray-600">/night</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsPropertyChatOpen(true)} className="px-6 py-3 border-2 border-[#4E7B22] text-[#4E7B22] rounded-lg hover:bg-[#4E7B22] hover:text-white transition font-medium">
                  Chat with Host
                </button>
                <button
                  onClick={handleBookNow}
                  className="px-8 py-3 bg-[#4E7B22] hover:bg-[#3d6219] text-white rounded-lg transition font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Amenities */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">TOP AMENITIES</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Wifi</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Air Conditioning</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Kitchen</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Parking</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Pool</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Beach Access</span>
          </div>
        </div>
      </div>

      {/* Location & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Location & Availability</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Location</p>
            <p className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {unit.address || '123 Ocean Drive, Miami Beach, FL'}
            </p>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map View</p>
          </div>
        </div>

        {/* Check Availability Calendar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Check Availability</h3>
          <p className="text-sm text-gray-600 mb-4">Select your check-in and check-out dates (85%)</p>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button className="p-2 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h4 className="font-semibold">February 2025</h4>
              <button className="p-2 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-semibold text-gray-600 py-2">{day}</div>
              ))}
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <div
                  key={day}
                  className={`py-2 rounded cursor-pointer ${
                    day === 9 ? 'bg-green-500 text-white' : 
                    day === 15 ? 'bg-yellow-200' :
                    day % 3 === 0 ? 'bg-orange-200' : 
                    'hover:bg-gray-100'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-200 rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      {unit.cancellationPolicy && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
          <CancellationPolicyDisplay 
            policy={unit.cancellationPolicy} 
            customPolicy={unit.customCancellation}
          />
        </div>
      )}

      {/* House Rules */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">House Rules</h2>
        <p className="text-red-600">
          No smoking. No pets. Check-in after 3PM. Check-out before 11AM.
        </p>
      </div>

      {/* Property Chatbot — only for unit details. Opens when user clicks 'Chat with Host' */}
      <PropertyChatbot
        unitId={id}
        hostId={unit.hostId}
        unitName={unit.name}
        isOpen={isPropertyChatOpen}
        onClose={() => setIsPropertyChatOpen(false)}
      />
    </DashboardLayout>
  );
};

export default GuestUnitDetails;
