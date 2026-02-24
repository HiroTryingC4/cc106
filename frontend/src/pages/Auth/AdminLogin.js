import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [tempUser, setTempUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        if (data.requireMFA) {
          // MFA required - show verification code input
          setTempToken(data.tempToken);
          setTempUser(data.user);
          setShowMFA(true);
          addToast(`Verification code sent to your email: ${data.mfaCode}`, 'info');
        } else {
          // No MFA required (shouldn't happen for admin)
          login(data.token, data.user);
          addToast('Welcome back, Admin!', 'success');
          navigate('/admin/dashboard');
        }
      } else {
        addToast(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      addToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMFASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          mfaCode
        })
      });

      const data = await response.json();

      if (data.success) {
        login(data.token, tempUser);
        addToast('Welcome back, Admin!', 'success');
        navigate('/admin/dashboard');
      } else {
        addToast(data.message || 'Invalid verification code', 'error');
      }
    } catch (error) {
      addToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2">Smart Stay</h1>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1 w-12 bg-red-500 rounded"></div>
            <p className="text-red-400 font-semibold text-lg">Admin Portal</p>
            <div className="h-1 w-12 bg-red-500 rounded"></div>
          </div>
          <p className="text-gray-400">System Administration Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!showMFA ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
                <p className="text-gray-600 text-sm">Enter your admin credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@smartstay.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Demo Admin Credentials:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Email: <span className="font-mono bg-white px-2 py-1 rounded">admin@smartstay.com</span></p>
                  <p>Password: <span className="font-mono bg-white px-2 py-1 rounded">password123</span></p>
                  <p className="text-red-600 font-semibold mt-2">MFA Code will be displayed after login</p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-800">
                    This is a secure admin area with Multi-Factor Authentication. All actions are logged and monitored.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
                <p className="text-gray-600 text-sm">Enter the 6-digit verification code</p>
              </div>

              <form onSubmit={handleMFASubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength="6"
                    className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent tracking-widest"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Check the toast notification above for your code
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading || mfaCode.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMFA(false);
                    setMfaCode('');
                    setTempToken('');
                    setTempUser(null);
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
                >
                  ← Back to Login
                </button>
              </form>

              {/* MFA Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Multi-Factor Authentication</p>
                    <p>For demo purposes, the verification code is displayed in the notification. In production, this would be sent to your email or authenticator app.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
