import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';

const Step6Register = ({ onRegisterSuccess }) => {
  const { user, register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    role: 'host'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Show registration form even if logged in (for testing/demo purposes)
  // Uncomment below to skip registration for logged-in hosts
  /*
  if (user && user.role === 'host') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            You're all set!
          </h2>
          <p className="text-lg text-gray-600">
            You're already logged in. Click Next to publish your listing.
          </p>
        </div>
      </div>
    );
  }
  */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      
      if (result && result.success) {
        onRegisterSuccess();
      } else {
        setError(result?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Create your host account
        </h2>
        <p className="text-lg text-gray-600">
          Just one more step! Create your account to publish your listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-12 max-w-2xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone
          </label>
          <input
            name="phone"
            type="tel"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company/Business Name (Optional)
          </label>
          <input
            name="companyName"
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
            placeholder="Your Company LLC"
            value={formData.companyName}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your business name if managing properties professionally
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 mt-6"
        >
          {loading ? 'Creating Account...' : 'Create Account & Continue'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </div>
  );
};

export default Step6Register;
