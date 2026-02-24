import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';

const CheckoutPhoto = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchCheckoutInfo();
  }, [bookingId]);

  const fetchCheckoutInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/guest/checkout/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching checkout info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > 5) {
      addToast('Maximum 5 photos allowed', 'error');
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      addToast('Please select at least one photo', 'error');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      selectedFiles.forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch(`http://localhost:5000/api/guest/checkout/${bookingId}/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        addToast('Checkout photos uploaded successfully!', 'success');
        navigate(`/guest/bookings/${bookingId}`);
      } else {
        addToast(data.message || 'Failed to upload photos', 'error');
      }
    } catch (error) {
      addToast('Error uploading photos', 'error');
    } finally {
      setUploading(false);
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

  if (!booking) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Booking not found</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Checkout Photos</h1>
        <p className="text-gray-600 mt-2">Upload photos of the unit before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Upload Photos</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Photo Guidelines</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                    <li>Take clear photos of all rooms</li>
                    <li>Include photos of any existing damages</li>
                    <li>Capture the overall cleanliness of the unit</li>
                    <li>Maximum 5 photos allowed</li>
                    <li>Accepted formats: JPG, PNG (max 5MB each)</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="photo-upload"
                    multiple
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={selectedFiles.length >= 5}
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`cursor-pointer ${selectedFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {selectedFiles.length >= 5 ? 'Maximum photos reached' : 'Click to upload photos'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedFiles.length}/5 photos selected
                    </p>
                  </label>
                </div>

                {previewUrls.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Selected Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <Button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="w-full"
                >
                  {uploading ? 'Uploading...' : 'Submit Checkout Photos'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-xl font-semibold mb-4">Booking Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Booking ID</p>
                <p className="font-semibold">#{booking.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Unit</p>
                <p className="font-semibold">{booking.unit?.name || `Unit #${booking.unitId}`}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-out Date</p>
                <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Security Deposit</p>
                <p className="font-semibold">₱{booking.securityDeposit}</p>
              </div>
            </div>
          </Card>

          <Card className="mt-4">
            <h3 className="font-semibold mb-3">Why Upload Photos?</h3>
            <p className="text-sm text-gray-600">
              Checkout photos help protect your security deposit by documenting the condition 
              of the unit when you leave. This ensures a fair assessment and quick refund process.
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPhoto;
