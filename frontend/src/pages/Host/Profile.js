import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';

const HostProfile = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, faqs, security
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    companyName: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    website: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          bio: data.user.bio || '',
          companyName: data.user.companyName || '',
          facebook: data.user.facebook || '',
          instagram: data.user.instagram || '',
          tiktok: data.user.tiktok || '',
          website: data.user.website || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      addToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        addToast('Profile updated successfully!', 'success');
      } else {
        addToast(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast('Error updating profile', 'error');
    } finally {
      setSaving(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="inline-flex gap-2 bg-gray-200 p-2 rounded-full">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'faqs'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </div>
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Change Photo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 resize-none"
                placeholder="Experienced host with a passion for hospitality. I love sharing my properties and helping guests have memorable stays. pa-cute lang"
              />
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media & Website</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    value={formData.tiktok}
                    onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    placeholder="https://tiktok.com/@yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t mt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#4E7B22] text-white rounded-lg hover:bg-[#3d6119] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={fetchProfile}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }
                }}
                className="ml-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* FAQs Tab - FAQ Responses */}
      {activeTab === 'faqs' && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">FAQ Responses</h2>
            <button
              type="button"
              className="px-4 py-2 bg-[#4E7B22] text-white rounded-lg hover:bg-[#3d6119] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New FAQ
            </button>
          </div>
          
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">How do I book a unit?</h3>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                  <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                To book a unit, browse available properties, select your desired unit, choose your check-in and check-out dates, and complete the booking with payment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Book</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Booking</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Reserve</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Reservation</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">How to book</span>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">What payment methods do you accept?</h3>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                  <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                We accept payments via QR code. After booking, you'll receive a QR code to scan and complete your payment securely.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">pay</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">qr code</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">payment</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">payment method</span>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">What is the cancellation policy?</h3>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                  <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                You can cancel your booking up to 48 hours before check-in for a full refund. Cancellations within 48 hours are subject to a 50% fee.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">cancel</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">refund</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">policy</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">cancellation</span>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">How do I check in?</h3>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                  <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Check-in instructions will be sent to your email 24 hours before your arrival. You'll receive the unit access code and any special instructions.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">arrival</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">check in</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">access code</span>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">What about security deposits?</h3>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                  <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                A security deposit is required for all bookings. It will be returned within 7 days after checkout if there are no damages or issues.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">fee</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">deposit</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">refund</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">security deposit</span>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">Can I modify my booking?</h3>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                  <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Yes, you can modify your booking dates from your dashboard. Changes are subject to availability and may affect the total price.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">change</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">modify</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">edit booking</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">update booking</span>
              </div>
            </div>

            {/* FAQ Item 7 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">How do I contact the host?</h3>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                  <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                You can message the host directly through your booking details page. The host will receive your message and respond promptly.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">talk to host</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">contact host</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">message host</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
          
          {/* Change Password Section */}
          <div className="mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="button"
                className="px-6 py-2 bg-[#4E7B22] text-white rounded-lg hover:bg-[#3d6119] transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Two Factor Authentication Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Two Factor Authentication</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable 2FA</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4E7B22]"></div>
              </label>
            </div>
          </div>

          {/* Active Sessions Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
            <div className="space-y-3">
              {/* Current Session */}
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">MacBook Pro - Chrome</p>
                  <p className="text-sm text-gray-600">San Francisco, CA • Active now</p>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  Current
                </span>
              </div>

              {/* Other Session */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">iPhone 14 - Safari</p>
                  <p className="text-sm text-gray-600">San Francisco, CA • 2 hours ago</p>
                </div>
                <button className="px-3 py-1 text-gray-600 hover:text-red-600 text-sm">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default HostProfile;
