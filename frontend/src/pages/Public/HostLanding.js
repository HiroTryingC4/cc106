import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

const HostLanding = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              List Your Property Today
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Earn extra income by hosting guests in your condo or apartment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/host">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Become a Host
                </Button>
              </Link>
              <Link to="/host/login">
                <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Host Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Host With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Earn More Income</h3>
              <p className="text-gray-600">
                Set your own prices and earn money from your unused space
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Track bookings, revenue, and guest analytics in real-time
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Get paid securely with security deposit protection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Host Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-purple-600">Property Management</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Add unlimited properties</li>
                <li>✓ Upload multiple photos</li>
                <li>✓ Set amenities and features</li>
                <li>✓ Manage availability</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-purple-600">Booking Management</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Approve or reject bookings</li>
                <li>✓ Calendar view</li>
                <li>✓ Guest contact information</li>
                <li>✓ Payment tracking</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-purple-600">Financial Tracking</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Revenue analytics</li>
                <li>✓ Expense tracking</li>
                <li>✓ Monthly reports</li>
                <li>✓ Security deposit management</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-purple-600">Guest Analytics</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Total guest count</li>
                <li>✓ New vs returning guests</li>
                <li>✓ Booking trends</li>
                <li>✓ Occupancy rates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Getting Started is Easy</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-3">1</div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-sm text-gray-600">
                Create your host account in minutes
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-3">2</div>
              <h3 className="font-semibold mb-2">List Property</h3>
              <p className="text-sm text-gray-600">
                Add your property details and photos
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-3">3</div>
              <h3 className="font-semibold mb-2">Get Bookings</h3>
              <p className="text-sm text-gray-600">
                Approve bookings and welcome guests
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-3">4</div>
              <h3 className="font-semibold mb-2">Earn Money</h3>
              <p className="text-sm text-gray-600">
                Receive payments and track your earnings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Hosting Today</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join our community of successful hosts and start earning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/host">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Become a Host
              </Button>
            </Link>
            <Link to="/host/login">
              <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-purple-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HostLanding;
