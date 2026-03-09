import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Layout from '../../../components/Layout';
import Button from '../../../components/Button';

const BecomeHostLanding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Always go to wizard first, regardless of login status
    // Registration will happen at the end of the wizard
    navigate('/host/onboarding');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Become a Host
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
              Share your space and earn extra income. It's easy to get started on Smart Stay.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="!bg-white !text-purple-600 hover:!bg-gray-100 !text-xl !px-12 !py-4 !font-bold shadow-2xl"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Steps Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              It's easy to get started
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🏠</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  1. Tell us about your place
                </div>
                <p className="text-gray-600">
                  Share some basic info, like where it is and how many guests can stay.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">📸</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  2. Make it stand out
                </div>
                <p className="text-gray-600">
                  Add photos plus a title and description—we'll help you out.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🚀</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  3. Finish up and publish
                </div>
                <p className="text-gray-600">
                  Set your pricing, verify details, then publish your listing.
                </p>
              </div>
            </div>

            <div className="text-center mt-16">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="!bg-gradient-to-r !from-purple-600 !to-blue-600 !text-white !text-xl !px-12 !py-4 !font-bold"
              >
                Start Your Listing
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Why host on Smart Stay?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Earn extra income
                </h3>
                <p className="text-gray-600">
                  Set your own prices and availability. You're in control of your earnings.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Host with confidence
                </h3>
                <p className="text-gray-600">
                  We verify guest identities and provide secure payment processing.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Easy to manage
                </h3>
                <p className="text-gray-600">
                  Update your calendar, respond to guests, and track earnings all in one place.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Support when you need it
                </h3>
                <p className="text-gray-600">
                  Our team is here to help you succeed as a host, every step of the way.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of hosts earning extra income on Smart Stay
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="!bg-white !text-purple-600 hover:!bg-gray-100 !text-xl !px-12 !py-4 !font-bold shadow-2xl"
            >
              Create Your Listing
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BecomeHostLanding;
