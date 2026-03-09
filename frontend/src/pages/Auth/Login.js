import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('guest'); // 'guest' or 'host'
  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithCredentials(email, password);
    
    if (result.success) {
      // Verify the user has the selected role
      if (result.user.role !== selectedRole && result.user.role !== 'admin') {
        setError(`This account is registered as a ${result.user.role}, not a ${selectedRole}`);
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'host') {
        navigate('/host/dashboard');
      } else {
        navigate('/guest/dashboard');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gray-900">Smart Stay</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to your account
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('guest')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                selectedRole === 'guest'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">🏠</div>
              Guest
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('host')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                selectedRole === 'host'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">🔑</div>
              Host
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : `Sign in as ${selectedRole === 'guest' ? 'Guest' : 'Host'}`}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-semibold">Guest:</span> guest1@example.com / password123</p>
              <p><span className="font-semibold">Host:</span> host1@smartstay.com / password123</p>
              <p><span className="font-semibold">Admin:</span> admin@smartstay.com / password123</p>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to={`/register/${selectedRole}`} 
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                Sign up as {selectedRole === 'guest' ? 'Guest' : 'Host'}
              </Link>
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="mt-4 text-center">
            <Link 
              to="/admin/login" 
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Admin Login →
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
