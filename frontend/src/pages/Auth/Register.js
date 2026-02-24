import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { userType } = useParams(); // 'guest' or 'host'
  const defaultRole = userType === 'host' ? 'host' : 'guest';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Update role when userType changes
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, role: defaultRole }));
  }, [defaultRole]);

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
    const result = await register(formData);
    
    if (result.success) {
      navigate(result.user.role === 'host' ? '/host/dashboard' : '/guest/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const isHost = formData.role === 'host';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isHost ? 'Become a Host' : 'Create Guest Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isHost ? 'Start earning by listing your property' : 'Book amazing stays with ease'}
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                type="text"
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                name="lastName"
                type="text"
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <input
              name="phone"
              type="tel"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
            
            {/* Role Selection - Hidden but can be toggled */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span className="text-sm text-gray-700">Registering as:</span>
              <div className="flex gap-2">
                <Link
                  to="/register/guest"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    !isHost
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Guest
                </Link>
                <Link
                  to="/register/host"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    isHost
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Host
                </Link>
              </div>
            </div>
            
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
            />
            
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Creating account...' : isHost ? 'Become a Host' : 'Create Account'}
          </button>

          {isHost && (
            <p className="text-xs text-center text-gray-500">
              By registering as a host, you agree to list your property and follow our hosting guidelines.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
