import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ImageUpload from '../../components/ImageUpload';
import LocationPicker from '../../components/LocationPicker';
import ToggleSwitch from '../../components/ToggleSwitch';
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
  const [availablePromoCodes, setAvailablePromoCodes] = useState([]);
  const [assignedPromoCodes, setAssignedPromoCodes] = useState([]);
  const [showQuickPromoModal, setShowQuickPromoModal] = useState(false);
  const [creatingPromo, setCreatingPromo] = useState(false);
  const [quickPromoData, setQuickPromoData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    usageLimit: '',
    expiresAt: '',
    description: ''
  });
  
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
    latitude: null,
    longitude: null,
    description: '',
    pricePerNight: '',
    baseGuestsIncluded: '2',
    nightHours: '22',
    bedrooms: '1',
    bathrooms: '1',
    maxGuests: '2',
    securityDeposit: '200',
    paymentMethod: 'full',
    cancellationPolicy: 'moderate',
    customCancellation: {
      fullRefundDays: '7',
      partialRefundDays: '3',
      partialRefundPercent: '50',
      noRefundDays: '1'
    },
    extraGuestFee: '200',
    available: true,
    instantBooking: false,
    acceptsMinors: false,
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
      fetchPromoCodes();
    } else {
      fetchPromoCodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPromoCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/promo-codes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAvailablePromoCodes(data.promoCodes);
        
        // If editing, filter assigned codes for this unit
        if (isEdit && id) {
          const assigned = data.promoCodes.filter(p => 
            (Array.isArray(p.unitIds) && p.unitIds.length === 0) || // Empty array = all units (global)
            (Array.isArray(p.unitIds) && p.unitIds.includes(id)) // Specific unit
          );
          setAssignedPromoCodes(assigned);
        }
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

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
          latitude: data.unit.latitude || null,
          longitude: data.unit.longitude || null,
          description: data.unit.description || '',
          pricePerNight: data.unit.pricePerNight,
          baseGuestsIncluded: data.unit.baseGuestsIncluded || '2',
          nightHours: data.unit.nightHours || '22',
          bedrooms: data.unit.bedrooms,
          bathrooms: data.unit.bathrooms,
          maxGuests: data.unit.maxGuests,
          securityDeposit: data.unit.securityDeposit,
          paymentMethod: data.unit.paymentMethod || 'full',
          cancellationPolicy: data.unit.cancellationPolicy || 'moderate',
          customCancellation: data.unit.customCancellation || {
            fullRefundDays: '7',
            partialRefundDays: '3',
            partialRefundPercent: '50',
            noRefundDays: '1'
          },
          extraGuestFee: data.unit.extraGuestFee || 200,
          available: data.unit.available,
          instantBooking: data.unit.instantBooking || false,
          acceptsMinors: data.unit.acceptsMinors || false,
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

  const handleAssignPromoCode = async (promoCodeId) => {
    if (!isEdit) {
      addToast('Please save the unit first before assigning promo codes', 'info');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/promo-codes/assign-to-unit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promoCodeId, unitId: id })
      });

      const data = await response.json();
      if (data.success) {
        addToast(data.message, 'success');
        fetchPromoCodes();
      } else {
        addToast(data.message, 'error');
      }
    } catch (error) {
      addToast('Error assigning promo code', 'error');
    }
  };

  const handleRemovePromoCode = async (promoCodeId) => {
    if (!window.confirm('Remove this promo code from this unit?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/promo-codes/remove-from-unit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promoCodeId, unitId: id })
      });

      const data = await response.json();
      if (data.success) {
        addToast(data.message, 'success');
        fetchPromoCodes();
      } else {
        addToast(data.message, 'error');
      }
    } catch (error) {
      addToast('Error removing promo code', 'error');
    }
  };

  const handleQuickCreatePromo = async (e) => {
    e.preventDefault();
    
    if (!isEdit) {
      addToast('Please save the unit first before creating promo codes', 'info');
      return;
    }

    if (creatingPromo) {
      return; // Prevent multiple submissions
    }

    setCreatingPromo(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/promo-codes/for-unit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quickPromoData)
      });

      const data = await response.json();
      if (data.success) {
        addToast(data.message, 'success');
        setShowQuickPromoModal(false);
        setQuickPromoData({
          code: '',
          type: 'percentage',
          value: '',
          usageLimit: '',
          expiresAt: '',
          description: ''
        });
        fetchPromoCodes();
      } else {
        addToast(data.message || 'Error creating promo code', 'error');
        console.error('Promo code creation error:', data);
      }
    } catch (error) {
      addToast('Error creating promo code: ' + error.message, 'error');
      console.error('Promo code creation exception:', error);
    } finally {
      setCreatingPromo(false);
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
      {/* Enhanced Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              {isEdit ? (
                <>
                  <span className="text-blue-600">✏️</span> Edit Unit
                </>
              ) : (
                <>
                  <span className="text-green-600">➕</span> Add New Unit
                </>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? 'Update your property details and settings' : 'Fill in the details to list your property'}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/host/units')}
            size="sm"
          >
            ← Back to Units
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Information */}
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-600">Property name, type, and location</p>
              </div>
            </div>
          </div>

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
                <option value="Apartment">🏢 Apartment</option>
                <option value="Condo">🏙️ Condo</option>
                <option value="House">🏠 House</option>
                <option value="Studio">🛋️ Studio</option>
                <option value="Villa">🏰 Villa</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location * 📍
              </label>
              <LocationPicker
                value={formData.location}
                onChange={(address, lat, lng) => {
                  setFormData({ 
                    ...formData, 
                    location: address,
                    latitude: lat,
                    longitude: lng
                  });
                  setErrors({ ...errors, location: false });
                }}
                error={errors.location}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">⚠️ Location is required</p>
              )}
            </div>
          </div>
        </Card>

        {/* SECTION 2: Pricing & Capacity */}
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                2
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pricing & Capacity</h2>
                <p className="text-sm text-gray-600">Set your rates and guest limits</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Price Per Night (₱)"
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                min="0"
                placeholder="e.g., 1500"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Included
                </label>
                <select
                  value={formData.nightHours}
                  onChange={(e) => setFormData({ ...formData, nightHours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="12">12 hours</option>
                  <option value="22">22 hours</option>
                  <option value="24">24 hours (Full day)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Persons Included
                </label>
                <select
                  value={formData.baseGuestsIncluded}
                  onChange={(e) => setFormData({ ...formData, baseGuestsIncluded: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1 person</option>
                  <option value="2">2 persons</option>
                  <option value="3">3 persons</option>
                  <option value="4">4 persons</option>
                  <option value="5">5 persons</option>
                  <option value="6">6 persons</option>
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-3">
                💡 <strong>Per Night Pricing:</strong> Set your overnight rate, hours covered, and how many persons are included. Example: ₱1500 for 22 hours with 2 persons means the base price covers up to 2 guests from 2 PM to 12 PM next day. Additional guests will incur extra fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Security Deposit (₱)"
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

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.paymentMethod === 'full' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="full"
                    checked={formData.paymentMethod === 'full'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">
                      💳 Full Payment
                    </span>
                    <span className="block text-xs text-gray-600 mt-1">
                      Guest pays the entire booking amount upfront (including security deposit)
                    </span>
                  </div>
                </label>

                <label className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.paymentMethod === 'deposit' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="deposit"
                    checked={formData.paymentMethod === 'deposit'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">
                      🔒 Deposit First
                    </span>
                    <span className="block text-xs text-gray-600 mt-1">
                      Guest pays security deposit first, remaining balance before check-in
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Cancellation Policy Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Policy
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Flexible Policy */}
                <label className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.cancellationPolicy === 'flexible' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="cancellationPolicy"
                    value="flexible"
                    checked={formData.cancellationPolicy === 'flexible'}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    className="mb-2"
                  />
                  <span className="block text-sm font-semibold text-gray-900 mb-1">
                    😊 Flexible
                  </span>
                  <span className="block text-xs text-gray-600 mb-2">
                    Full refund if cancelled 24 hours before check-in
                  </span>
                  <div className="text-xs text-gray-500 space-y-1 mt-auto">
                    <div>• 24+ hours: 100% refund</div>
                    <div>• &lt;24 hours: 50% refund</div>
                  </div>
                </label>

                {/* Moderate Policy */}
                <label className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.cancellationPolicy === 'moderate' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="cancellationPolicy"
                    value="moderate"
                    checked={formData.cancellationPolicy === 'moderate'}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    className="mb-2"
                  />
                  <span className="block text-sm font-semibold text-gray-900 mb-1">
                    ⚖️ Moderate
                  </span>
                  <span className="block text-xs text-gray-600 mb-2">
                    Full refund if cancelled 5 days before check-in
                  </span>
                  <div className="text-xs text-gray-500 space-y-1 mt-auto">
                    <div>• 5+ days: 100% refund</div>
                    <div>• 2-4 days: 50% refund</div>
                    <div>• &lt;2 days: No refund</div>
                  </div>
                </label>

                {/* Strict Policy */}
                <label className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.cancellationPolicy === 'strict' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="cancellationPolicy"
                    value="strict"
                    checked={formData.cancellationPolicy === 'strict'}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    className="mb-2"
                  />
                  <span className="block text-sm font-semibold text-gray-900 mb-1">
                    🔒 Strict
                  </span>
                  <span className="block text-xs text-gray-600 mb-2">
                    Full refund if cancelled 14 days before check-in
                  </span>
                  <div className="text-xs text-gray-500 space-y-1 mt-auto">
                    <div>• 14+ days: 100% refund</div>
                    <div>• 7-13 days: 50% refund</div>
                    <div>• &lt;7 days: No refund</div>
                  </div>
                </label>

                {/* Custom Policy */}
                <label className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.cancellationPolicy === 'custom' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="cancellationPolicy"
                    value="custom"
                    checked={formData.cancellationPolicy === 'custom'}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    className="mb-2"
                  />
                  <span className="block text-sm font-semibold text-gray-900 mb-1">
                    ⚙️ Custom
                  </span>
                  <span className="block text-xs text-gray-600 mb-2">
                    Set your own refund rules
                  </span>
                  <div className="text-xs text-gray-500 mt-auto">
                    Define custom timeframes and refund percentages
                  </div>
                </label>
              </div>

              {/* Custom Policy Configuration */}
              {formData.cancellationPolicy === 'custom' && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Custom Cancellation Rules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Full Refund (100%) - Days Before Check-in
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.customCancellation.fullRefundDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          customCancellation: {
                            ...formData.customCancellation,
                            fullRefundDays: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="7"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Guests get 100% refund if cancelled this many days before check-in
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Partial Refund - Days Before Check-in
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.customCancellation.partialRefundDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          customCancellation: {
                            ...formData.customCancellation,
                            partialRefundDays: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="3"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum days before check-in for partial refund
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Partial Refund Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.customCancellation.partialRefundPercent}
                        onChange={(e) => setFormData({
                          ...formData,
                          customCancellation: {
                            ...formData.customCancellation,
                            partialRefundPercent: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Percentage of refund for partial refund period
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        No Refund - Days Before Check-in
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.customCancellation.noRefundDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          customCancellation: {
                            ...formData.customCancellation,
                            noRefundDays: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Less than this many days = no refund
                      </p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-2">📋 Policy Preview:</p>
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>• {formData.customCancellation.fullRefundDays}+ days before: 100% refund</div>
                      <div>• {formData.customCancellation.partialRefundDays}-{parseInt(formData.customCancellation.fullRefundDays) - 1} days before: {formData.customCancellation.partialRefundPercent}% refund</div>
                      <div>• Less than {formData.customCancellation.noRefundDays} day(s): No refund</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                💡 <strong>Extra Guest Fee:</strong> Additional charge per extra guest beyond base capacity. Example: If base capacity is 2 and booking is for 3 guests, the extra guest fee will be added per night.
              </p>
            </div>

            {/* Accept Minors Toggle */}
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Accept Guests Under 18 Years Old
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formData.acceptsMinors 
                        ? 'When enabled, guests under 18 can book with parental/guardian consent.' 
                        : 'When disabled, all guests must be 18 years or older to book this unit.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={formData.acceptsMinors}
                      onChange={(e) => setFormData({ ...formData, acceptsMinors: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {/* Status Message */}
                {formData.acceptsMinors ? (
                  <div className="mt-3 flex items-start bg-green-50 border border-green-200 rounded-lg p-3">
                    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold text-green-900 text-sm">Minors Accepted</div>
                      <div className="text-xs text-green-800 mt-1">
                        Guests under 18 can book this unit. Parental or guardian consent is required for minors.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-start bg-gray-100 border border-gray-300 rounded-lg p-3">
                    <svg className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Adults Only (18+)</div>
                      <div className="text-xs text-gray-700 mt-1">
                        All guests must be 18 years or older. Bookings with guests under 18 will be automatically rejected.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 3: Hourly Pricing Options */}
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                3
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hourly Pricing Options</h2>
                <p className="text-sm text-gray-600">Add flexible time-based pricing (optional)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                💡 <strong>Extra Guest Fee:</strong> Additional charge per extra guest beyond base capacity. Example: If max guests is 4 and booking is for 3 guests, the extra guest fee will be added to the total price.
              </p>
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
        </Card>

        {/* SECTION 4: Description & Rules */}
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                4
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Description & House Rules</h2>
                <p className="text-sm text-gray-600">Tell guests about your property</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
        </Card>

        {/* SECTION 5: Amenities */}
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                5
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Amenities & Features</h2>
                <p className="text-sm text-gray-600">Select available amenities</p>
              </div>
            </div>
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
        </Card>

        {/* SECTION 6: Booking Settings & Images */}
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                6
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Booking Settings & Images</h2>
                <p className="text-sm text-gray-600">Configure availability and upload photos</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
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

            {/* Instant Booking Toggle */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ToggleSwitch
                id="instantBooking"
                checked={formData.instantBooking}
                onChange={(e) => setFormData({ ...formData, instantBooking: e.target.checked })}
                label="Auto-Confirmation (Instant Booking)"
                description="When enabled, bookings are automatically confirmed without requiring your approval. Guests can book instantly."
              />
              
              {formData.instantBooking && (
                <div className="mt-3 flex items-start space-x-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold">Instant Booking is ON</div>
                    <div className="text-xs mt-1">Guests can book immediately without waiting for approval. This increases booking rates!</div>
                  </div>
                </div>
              )}
              
              {!formData.instantBooking && (
                <div className="mt-3 flex items-start space-x-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold">Manual Approval Required</div>
                    <div className="text-xs mt-1">You'll need to manually approve each booking request. Guests will wait for your confirmation.</div>
                  </div>
                </div>
              )}
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
        </Card>

        {/* SECTION 7: Promotional Offers */}
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                7
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Promotional Offers</h2>
                <p className="text-sm text-gray-600">Assign promo codes to this unit</p>
              </div>
            </div>
          </div>

          {!isEdit ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-sm text-yellow-800">
                💡 Save the unit first to assign promo codes
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Assign Existing Promo Codes with Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Promo Codes to Assign
                </label>
                {availablePromoCodes.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">No promo codes available</p>
                    <p className="text-xs text-gray-400 mt-1">Create promo codes from the Promo Codes page first</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {availablePromoCodes.map(promo => {
                      const isAssigned = assignedPromoCodes.find(a => a.id === promo.id);
                      const isGlobal = Array.isArray(promo.unitIds) && promo.unitIds.length === 0; // Empty array = all units
                      
                      return (
                        <div
                          key={promo.id}
                          className={`flex items-start p-3 rounded-lg border-2 transition ${
                            isAssigned
                              ? 'bg-purple-50 border-purple-300'
                              : 'bg-white border-gray-200 hover:border-purple-200'
                          } ${isGlobal ? 'opacity-75' : ''}`}
                        >
                          <input
                            type="checkbox"
                            id={`promo-${promo.id}`}
                            checked={!!isAssigned}
                            disabled={isGlobal}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleAssignPromoCode(promo.id);
                              } else {
                                handleRemovePromoCode(promo.id);
                              }
                            }}
                            className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <label htmlFor={`promo-${promo.id}`} className="ml-3 flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-gray-900">{promo.code}</span>
                              <span className="text-sm text-purple-600">
                                {promo.type === 'percentage' ? `${promo.value}%` : `₱${promo.value}`} off
                              </span>
                              {isGlobal && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  All Units (Auto-assigned)
                                </span>
                              )}
                              {promo.usageLimit && (
                                <span className="text-xs text-gray-500">
                                  {promo.usageCount}/{promo.usageLimit} used
                                </span>
                              )}
                            </div>
                            {promo.description && (
                              <p className="text-xs text-gray-500 mt-1">{promo.description}</p>
                            )}
                            {promo.expiresAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                Expires: {new Date(promo.expiresAt).toLocaleDateString()}
                              </p>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  💡 Check the boxes to assign promo codes to this unit. Global codes (All Units) are automatically assigned.
                </p>
              </div>

              {/* Quick Create Promo Code */}
              <div className="border-t pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowQuickPromoModal(true)}
                  size="sm"
                >
                  + Create New Promo Code for This Unit
                </Button>
              </div>

              {/* Summary of Assigned Promo Codes */}
              {assignedPromoCodes.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">
                    📋 Summary: {assignedPromoCodes.length} Promo Code{assignedPromoCodes.length !== 1 ? 's' : ''} Active
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                      {assignedPromoCodes.map(promo => (
                        <span key={promo.id} className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-green-300">
                          <span className="font-semibold text-green-700">{promo.code}</span>
                          <span className="text-gray-600">
                            ({promo.type === 'percentage' ? `${promo.value}%` : `₱${promo.value}`})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {assignedPromoCodes.length === 0 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-2">No promo codes assigned yet</p>
                  <p className="text-sm text-gray-400">Assign existing codes or create a new one</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Form Action Buttons */}
        <div className="flex gap-3 justify-end">
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

      {/* Quick Create Promo Modal */}
      {showQuickPromoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Create Promo Code</h3>
                <button
                  type="button"
                  onClick={() => setShowQuickPromoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleQuickCreatePromo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent uppercase"
                    placeholder="SUMMER20"
                    value={quickPromoData.code}
                    onChange={(e) => setQuickPromoData({ ...quickPromoData, code: e.target.value.toUpperCase() })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Uppercase letters and numbers only</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      value={quickPromoData.type}
                      onChange={(e) => setQuickPromoData({ ...quickPromoData, type: e.target.value })}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={quickPromoData.type === 'percentage' ? '100' : undefined}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder={quickPromoData.type === 'percentage' ? '20' : '500'}
                      value={quickPromoData.value}
                      onChange={(e) => setQuickPromoData({ ...quickPromoData, value: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Unlimited"
                      value={quickPromoData.usageLimit}
                      onChange={(e) => setQuickPromoData({ ...quickPromoData, usageLimit: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expires On
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      value={quickPromoData.expiresAt}
                      onChange={(e) => setQuickPromoData({ ...quickPromoData, expiresAt: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Special offer for this unit"
                    value={quickPromoData.description}
                    onChange={(e) => setQuickPromoData({ ...quickPromoData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowQuickPromoModal(false)}
                    disabled={creatingPromo}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creatingPromo}>
                    {creatingPromo ? 'Creating...' : 'Create Promo Code'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UnitForm;
