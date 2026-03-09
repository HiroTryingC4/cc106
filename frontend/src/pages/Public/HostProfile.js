import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';

const HostProfile = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [units, setUnits] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostProfile();
  }, [hostId]);

  const fetchHostProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/public/hosts/${hostId}`);
      if (response.data.success) {
        setHost(response.data.host);
        setUnits(response.data.units);
        setPromoCodes(response.data.promoCodes || []);
      }
    } catch (error) {
      console.error('Failed to fetch host profile:', error);
    } finally {
      setLoading(false);
    }
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

  if (!host) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Host not found</h2>
            <Link to="/units">
              <Button>Browse All Units</Button>
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
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
          </div>

          {/* Host Header */}
          <Card className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Left: Avatar & quick info */}
                  <div className="col-span-1 bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                        {host.name ? host.name.charAt(0).toUpperCase() : 'H'}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{host.name}</h2>
                      {host.email && (
                        <a href={`mailto:${host.email}`} className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.94 6.34A2 2 0 014 6h12a2 2 0 011.06.34L10 11 2.94 6.34z"/><path d="M18 8.12v5.38A2.5 2.5 0 0115.5 16H4.5A2.5 2.5 0 012 13.5V8.12l7.11 4.22a1 1 0 001.78 0L18 8.12z"/></svg>
                          {host.email}
                        </a>
                      )}

                      {host.companyName && (
                        <div className="mt-3 text-sm text-gray-700">{host.companyName}</div>
                      )}

                      <div className="mt-4 w-full flex flex-col gap-2">
                        <a href={`mailto:${host.email || ''}`} className="w-full text-center inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-95">Contact Host</a>
                        <Link to="/units" className="w-full text-center inline-flex items-center justify-center gap-2 border border-gray-200 px-4 py-2 rounded-lg">Browse Units</Link>
                      </div>
                    </div>
                  </div>

                  {/* Right: Main info & stats */}
                  <div className="col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{host.name}</h1>
                        {host.bio && <p className="text-gray-700 mb-3">{host.bio}</p>}
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-3xl font-bold text-gray-900">{host.rating || '5.0'}</div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{host.reviewCount || 0} reviews</p>

                        <div className="mt-4 grid grid-cols-3 gap-6 pt-4 border-t">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{units.length}</div>
                            <div className="text-sm text-gray-600">Properties</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">{host.totalBookings || 0}</div>
                            <div className="text-sm text-gray-600">Total Bookings</div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                              {host.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">Status</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social / Promo areas remain below */}
                  </div>
                </div>
              </Card>

          {/* Active Promo Codes */}
          {promoCodes.length > 0 && (
            <Card className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🎉 Active Promotions</h2>
                  <p className="text-gray-600">Special offers available for bookings</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promoCodes.map((promo) => (
                  <div
                    key={promo.id}
                    className="relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 hover:shadow-lg transition"
                  >
                    {/* Promo Code Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {promo.type === 'percentage' ? `${promo.value}% OFF` : `₱${promo.value} OFF`}
                      </span>
                    </div>

                    {/* Code */}
                    <div className="mb-3">
                      <div className="text-xs text-purple-600 font-semibold mb-1">PROMO CODE</div>
                      <div className="bg-white border-2 border-dashed border-purple-300 rounded-lg px-4 py-2 text-center">
                        <span className="text-2xl font-bold text-purple-900 tracking-wider">{promo.code}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {promo.description && (
                      <p className="text-sm text-gray-700 mb-3">{promo.description}</p>
                    )}

                    {/* Details */}
                    <div className="space-y-2 text-xs text-gray-600">
                      {/* Applies To */}
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="font-medium">
                          {promo.appliesTo === 'all' ? (
                            <span className="text-green-600">✓ All Properties</span>
                          ) : (
                            <span>{promo.appliesTo.length} {promo.appliesTo.length === 1 ? 'Property' : 'Properties'}</span>
                          )}
                        </span>
                      </div>

                      {/* Usage */}
                      {promo.usageLimit && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span>
                            {promo.usageLimit - promo.usageCount} uses remaining
                          </span>
                        </div>
                      )}

                      {/* Expiry */}
                      {promo.expiresAt && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>
                            Valid until {new Date(promo.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Copy Code Button */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                        alert(`Promo code "${promo.code}" copied to clipboard!`);
                      }}
                      className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy Code
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">How to use promo codes:</p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Copy the promo code you want to use</li>
                      <li>Select a property and proceed to booking</li>
                      <li>Enter the promo code during checkout</li>
                      <li>Enjoy your discount!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Host's Units */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {host.companyName ? `${host.companyName}'s Properties` : `${host.name}'s Properties`}
            </h2>
            <p className="text-gray-600">Browse all available units from this host</p>
          </div>

          {units.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No units available at the moment</p>
                <Link to="/units">
                  <Button>Browse Other Units</Button>
                </Link>
              </div>
            </Card>
          ) : (
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary uppercase">{unit.type}</span>
                        {unit.instantBooking && (
                          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Instant
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm font-semibold">{unit.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({unit.reviewCount})</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{unit.name}</h3>
                    {unit.address && (
                      <p className="text-xs text-gray-500 mb-2 flex items-center">
                        <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="line-clamp-1">{unit.address}</span>
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {unit.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ₱{unit.pricePerNight}
                          <span className="text-sm text-gray-600 font-normal">/night</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Hourly Pricing Badge */}
                    {unit.hourlyPricing && unit.hourlyPricing.length > 0 && (
                      <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-2">
                        <div className="text-xs font-semibold text-purple-900">⏰ Hourly options available</div>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 mt-2">
                      {unit.bedrooms} bed • {unit.bathrooms} bath • {unit.maxGuests} guests
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HostProfile;
