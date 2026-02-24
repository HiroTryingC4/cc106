import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

const GuestLanding = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Book comfortable condos and apartments for your next trip
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/units">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Browse Properties
                </Button>
              </Link>
              <Link to="/guest/login">
                <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Book With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">Quality Properties</h3>
              <p className="text-gray-600">
                Verified condos and apartments with detailed descriptions and photos
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Easy Payment</h3>
              <p className="text-gray-600">
                Secure QR code payments and instant booking confirmation
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Guest Reviews</h3>
              <p className="text-gray-600">
                Read reviews from real guests and share your experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
              <h3 className="font-semibold mb-2">Search</h3>
              <p className="text-sm text-gray-600">
                Browse available properties by location, price, and amenities
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-3">2</div>
              <h3 className="font-semibold mb-2">Book</h3>
              <p className="text-sm text-gray-600">
                Select your dates and complete your booking in minutes
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-3">3</div>
              <h3 className="font-semibold mb-2">Pay</h3>
              <p className="text-sm text-gray-600">
                Secure payment via QR code with instant confirmation
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-3">4</div>
              <h3 className="font-semibold mb-2">Enjoy</h3>
              <p className="text-sm text-gray-600">
                Check in and enjoy your comfortable stay
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied guests who found their perfect accommodation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/guest">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Create Account
              </Button>
            </Link>
            <Link to="/units">
              <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-blue-600">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GuestLanding;
