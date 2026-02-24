import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ImageUpload from '../../components/ImageUpload';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

const UnitForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Redirect if not verified
  useEffect(() => {
    if (!user?.verified) {
      addToast('Please complete verification to manage units', 'error');
      navigate('/host/verification');
    }
  }, [user, navigate, addToast]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Apartment',
    location: '',
    description: '',
    pricePerNight: '',
    bedrooms: '1',
    bathrooms: '1',
    maxGuests: '2',
    securityDeposit: '200',
    extraGuestFee: '200',
    available: true,
    instantBooking: false,
    houseRules: '',
    amenities: [],
    hourlyPricing: [],
    fixedCheckInTime: '14:00',
    fixedCheckOutTime: '12:00'
  });

  const amenitiesList = [
    'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Pool', 'Gym',
    'TV', 'Washer', 'Dryer', 'Balcony', 'Pet Friendly', 'Elevator'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchUnit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUnit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/units/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFormData({
          name: data.unit.name,
          type: data.unit.type,
          location: data.unit.location,
          description: data.unit.description || '',
          pricePerNight: data.unit.pricePerNight,
          bedrooms: data.unit.bedrooms,
          bathrooms: data.unit.bathrooms,
          maxGuests: data.unit.maxGuests,
          securityDeposit: data.unit.securityDeposit,
          extraGuestFee: data.unit.extraGuestFee || 200,
          available: data.unit.available,
          instantBooking: data.unit.instantBooking || false,
          houseRules: data.unit.houseRules || '',
          amenities: data.unit.amenities || [],
          hourlyPricing: data.unit.hourlyPricing || [],
          fixedCheckInTime: data.unit.fixedCheckInTime || '14:00',
          fixedCheckOutTime: data.unit.fixedCheckOutTime || '12:00'
        });
        setUploadedImages(data.unit.images || []);
      }
    } catch (error) {
      console.error('Error fetching unit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addHourlyPricing = () => {
    setFormData(prev => ({
      ...prev,
      hourlyPricing: [...prev.hourlyPricing, { hours: '', price: '', checkInTime: '', checkOutTime: '', isFlexible: true }]
    }));
  };

  const removeHourlyPricing = (index) => {
    setFormData(prev => ({
      ...prev,
      hourlyPricing: prev.hourlyPricing.filter((_, i) => i !== index)
    }));
  };

  const updateHourlyPricing = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      hourlyPricing: prev.hourlyPricing.map((item, i) => {
        if (i !== index) return item;
        
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate checkout time when check-in time or hours change (only for fixed time)
        if (updatedItem.isFlexible === false && (field === 'checkInTime' || field === 'hours')) {
          const checkInTime = field === 'checkInTime' ? value : item.checkInTime;
          const hours = field === 'hours' ? value : item.hours;
          
          if (checkInTime && hours) {
            // Parse check-in time
            const [checkInHour, checkInMinute] = checkInTime.split(':').map(Number);
            
            // Calculate checkout time by adding hours
            const checkInDate = new Date();
            checkInDate.setHours(checkInHour, checkInMinute, 0, 0);
            
            const checkOutDate = new Date(checkInDate.getTime() + (parseInt(hours) * 60 * 60 * 1000));
            
            // Format checkout time as HH:MM
            const checkOutHour = String(checkOutDate.getHours()).padStart(2, '0');
            const checkOutMinute = String(checkOutDate.getMinutes()).padStart(2, '0');
            const checkOutTime = `${checkOutHour}:${checkOutMinute}`;
            
            updatedItem.checkOutTime = checkOutTime;
          }
        }
        
        return updatedItem;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate required fields
    const newErrors = {};
    const missingFields = [];
    
    if (!formData.name) {
      newErrors.name = true;
      missingFields.push('Unit Name');
    }
    
    if (!formData.location) {
      newErrors.location = true;
      missingFields.push('Location');
    }
    
    // If there are errors, show toast with all missing fields and scroll to first error
    if (missingFields.length > 0) {
      setErrors(newErrors);
      
      // Show toast with all missing fields
      const fieldsText = missingFields.join(', ');
      addToast(`Missing required fields: ${fieldsText}`, 'error');
      
      // Scroll to first missing field
      setTimeout(() => {
        if (newErrors.name) {
          const element = document.querySelector('input[placeholder*="Cozy Downtown"]');
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element?.focus();
        } else if (newErrors.location) {
          const element = document.querySelector('input[placeholder*="Manila"]');
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element?.focus();
        }
      }, 100);
      
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = isEdit 
        ? `http://localhost:5000/api/host/units/${id}`
        : 'http://localhost:5000/api/host/units';
      
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        // If creating new unit and has pending images, upload them
        if (!isEdit && pendingImages.length > 0) {
          try {
            const newUnitId = data.unit.id;
            await uploadPendingImages(newUnitId, token);
            addToast('Unit created with images successfully!', 'success');
          } catch (imgError) {
            addToast('Unit created but some images failed to upload', 'warning');
          }
        } else {
          addToast(`Unit ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        }
        navigate('/host/units');
      } else {
        addToast(data.message || `Failed to ${isEdit ? 'update' : 'create'} unit`, 'error');
      }
    } catch (error) {
      addToast(`Error ${isEdit ? 'updating' : 'creating'} unit`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadPendingImages = async (unitId, token) => {
    const formData = new FormData();
    pendingImages.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`http://localhost:5000/api/host/units/${unitId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  };

  const handlePendingImagesSelect = (files) => {
    setPendingImages(prev => [...prev, ...files]);
  };

  const removePendingImage = (index) => {
    setPendingImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleImageUpload = async (files) => {
    try {
      const token = localStorage.getItem('token');
      
      // If creating new unit, need to save unit first
      if (!isEdit) {
        addToast('Please save the unit first before uploading images', 'info');
        return;
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`http://localhost:5000/api/host/units/${id}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setUploadedImages(prev => [...prev, ...data.images]);
        addToast('Images uploaded successfully!', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to upload images');
    }
  };

  const handleRemoveImage = async (imageUrl) => {
    if (!window.confirm('Are you sure you want to remove this image?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/units/${id}/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl })
      });

      const data = await response.json();
      if (data.success) {
        setUploadedImages(prev => prev.filter(img => img !== imageUrl));
        addToast('Image removed successfully!', 'success');
      } else {
        addToast(data.message || 'Failed to remove image', 'error');
      }
    } catch (error) {
      addToast('Error removing image', 'error');
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
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Unit' : 'Add New Unit'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? 'Update your property details' : 'Add a new property to your listings'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Unit Name *"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: false });
                }}
                placeholder="e.g., Cozy Downtown Apartment"
                required
                className={errors.name ? 'border-red-500 ring-2 ring-red-200' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">⚠️ Unit name is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div>
              <Input
                label="Location *"
                type="text"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  setErrors({ ...errors, location: false });
                }}
                placeholder="e.g., Manila, Philippines"
                required
                className={errors.location ? 'border-red-500 ring-2 ring-red-200' : ''}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">⚠️ Location is required</p>
              )}
            </div>

            <Input
              label="Bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              min="1"
            />

            <Input
              label="Bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              min="1"
            />

            <Input
              label="Max Guests"
              type="number"
              value={formData.maxGuests}
              onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
              min="1"
            />

            <Input
              label="Security Deposit"
              type="number"
              value={formData.securityDeposit}
              onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
              min="0"
            />

            <Input
              label="Extra Guest Fee (per person/night)"
              type="number"
              value={formData.extraGuestFee}
              onChange={(e) => setFormData({ ...formData, extraGuestFee: e.target.value })}
              min="0"
              placeholder="200"
            />
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-3">
              💡 <strong>Extra Guest Fee:</strong> Additional charge per extra guest beyond base capacity. Example: If max guests is 4 and booking is for 3 guests, the extra guest fee will be added to the total price.
            </p>
          </div>

          {/* Hourly Pricing Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hourly Pricing Options</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add multiple time-based pricing options for your guests (e.g., 6 hours for ₱599, 10 hours for ₱999)
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={addHourlyPricing}
                size="sm"
              >
                + Add Pricing
              </Button>
            </div>

            {formData.hourlyPricing.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-2">No hourly pricing options added yet</p>
                <p className="text-sm text-gray-400">Click "Add Pricing" to create time-based pricing options</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.hourlyPricing.map((pricing, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        {/* Hours and Price Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Hours *
                            </label>
                            <input
                              type="number"
                              value={pricing.hours}
                              onChange={(e) => updateHourlyPricing(index, 'hours', e.target.value)}
                              placeholder="e.g., 6"
                              min="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Price (₱) *
                            </label>
                            <input
                              type="number"
                              value={pricing.price}
                              onChange={(e) => updateHourlyPricing(index, 'price', e.target.value)}
                              placeholder="e.g., 599"
                              min="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Time Type Selection */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Check-in/Check-out Time
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                checked={pricing.isFlexible === true}
                                onChange={() => updateHourlyPricing(index, 'isFlexible', true)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Flexible Time</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                checked={pricing.isFlexible === false}
                                onChange={() => updateHourlyPricing(index, 'isFlexible', false)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Fixed Time</span>
                            </label>
                          </div>
                        </div>

                        {/* Fixed Time Inputs */}
                        {pricing.isFlexible === false && (
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Check-in Time
                              </label>
                              <input
                                type="time"
                                value={pricing.checkInTime || ''}
                                onChange={(e) => updateHourlyPricing(index, 'checkInTime', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Check-out Time
                              </label>
                              <input
                                type="time"
                                value={pricing.checkOutTime || ''}
                                onChange={(e) => updateHourlyPricing(index, 'checkOutTime', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}

                        {/* Flexible Time Note */}
                        {pricing.isFlexible === true && (
                          <p className="text-xs text-gray-500 italic">
                            Guests can choose their own check-in/check-out times for this option
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeHourlyPricing(index)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                        title="Remove pricing option"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.hourlyPricing.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  Preview: Guests will see these pricing options:
                </p>
                <ul className="space-y-2">
                  {formData.hourlyPricing.map((pricing, index) => (
                    pricing.hours && pricing.price && (
                      <li key={index} className="text-sm text-blue-700 bg-white rounded px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {pricing.hours} {pricing.hours === '1' ? 'hour' : 'hours'} - ₱{pricing.price}
                          </span>
                          {pricing.isFlexible === false && pricing.checkInTime && pricing.checkOutTime ? (
                            <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                              Fixed: {pricing.checkInTime} - {pricing.checkOutTime}
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Flexible Time
                            </span>
                          )}
                        </div>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your property..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              House Rules
            </label>
            <textarea
              value={formData.houseRules}
              onChange={(e) => setFormData({ ...formData, houseRules: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., No smoking, No pets, Check-in after 3 PM, Check-out before 11 AM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="available" className="text-sm font-medium text-gray-700">
                Unit is available for booking
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="instantBooking"
                checked={formData.instantBooking}
                onChange={(e) => setFormData({ ...formData, instantBooking: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="instantBooking" className="text-sm font-medium text-gray-700">
                Enable instant booking (guests can book without approval)
              </label>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Property Images</h3>
            
            {/* Existing Images (Edit Mode) */}
            {isEdit && uploadedImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Images ({uploadedImages.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Unit ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imageUrl)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Images (Create Mode) */}
            {!isEdit && pendingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Images ({pendingImages.length}) - Will be uploaded when you save
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pendingImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePendingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Interface */}
            {isEdit ? (
              <ImageUpload
                onUpload={handleImageUpload}
                multiple={true}
                maxSize={5}
                label="Add More Images"
              />
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Property Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    handlePendingImagesSelect(files);
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Max size: 5MB per file. Multiple files allowed. Images will be uploaded when you create the unit.
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-6 flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/host/units')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Unit' : 'Create Unit'}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default UnitForm;
