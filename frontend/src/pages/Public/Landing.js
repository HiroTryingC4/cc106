import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';

const Landing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              🎉 AI-Powered Property Management Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-white drop-shadow-lg">SmartStay</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md max-w-3xl mx-auto">
              Your Complete AI-Driven Property Management Solution for Intelligent Booking, Financial Analytics, and Seamless Guest Experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/units">
                <Button size="lg" className="!bg-white !text-blue-600 hover:!bg-gray-100 shadow-xl font-bold">
                  🏠 Explore Properties
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="!border-2 !border-white !text-white hover:!bg-white hover:!text-blue-600 shadow-xl font-bold"
                onClick={() => setShowAuthModal(true)}
              >
                ✨ Get Started Free
              </Button>
            </div>
            
            {/* User Type Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Guest Card */}
              <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">For Guests</h3>
                <p className="text-white/90 mb-6 drop-shadow-sm">
                  Find & book your perfect stay with AI-powered recommendations
                </p>
                <Link to="/units">
                  <Button className="w-full !bg-white !text-blue-600 hover:!bg-gray-100 font-bold">
                    Browse Properties
                  </Button>
                </Link>
              </div>

              {/* Host Card */}
              <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">For Hosts</h3>
                <p className="text-white/90 mb-6 drop-shadow-sm">
                  List your property & earn income with powerful analytics
                </p>
                <Link to="/host-home">
                  <Button className="w-full !bg-white !text-purple-600 hover:!bg-gray-100 font-bold">
                    Become a Host
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SmartStay combines cutting-edge AI technology with intuitive design to deliver the ultimate property management experience
            </p>
          </div>

          {/* Guest Features */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-bold text-lg">
                🏠 For Guests
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Smart Search & Filters</h3>
                <p className="text-gray-700">Advanced search with filters for price, location, amenities, and more</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">AI Recommendations</h3>
                <p className="text-gray-700">Personalized property suggestions based on your preferences and browsing history</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Real-Time Availability</h3>
                <p className="text-gray-700">Check availability instantly with interactive calendar and instant booking</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Secure QR Payments</h3>
                <p className="text-gray-700">Fast and secure payment processing with QR code technology</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Reviews & Ratings</h3>
                <p className="text-gray-700">Share your experience with photos and help others make informed decisions</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">24/7 AI Chatbot</h3>
                <p className="text-gray-700">Get instant answers to your questions anytime, anywhere</p>
              </div>
            </div>
          </div>

          {/* Host Features */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="bg-purple-100 text-purple-600 px-6 py-2 rounded-full font-bold text-lg">
                💼 For Hosts
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold mb-2 text-purple-900">Property Management</h3>
                <p className="text-gray-700">Easily list, edit, and manage multiple properties with photos and details</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2 text-purple-900">Advanced Analytics</h3>
                <p className="text-gray-700">Track bookings, occupancy rates, revenue trends, and guest statistics</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2 text-purple-900">Financial Dashboard</h3>
                <p className="text-gray-700">Monitor revenue, expenses, payroll, and calculate net profit automatically</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-2 text-purple-900">Expense Tracking</h3>
                <p className="text-gray-700">Track all property expenses by category with detailed reports</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2 text-purple-900">Payroll Management</h3>
                <p className="text-gray-700">Manage employee salaries, track payments, and generate payroll reports</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2 text-purple-900">Custom Reports</h3>
                <p className="text-gray-700">Generate detailed financial and booking reports with export options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              🤖 Powered by Artificial Intelligence
            </h2>
            <p className="text-xl text-white/95 max-w-3xl mx-auto drop-shadow-md">
              Experience the future of property management with our AI-driven features
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <div className="flex items-start gap-4">
                <div className="text-5xl">🧠</div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">Smart Recommendations</h3>
                  <p className="text-white/95 mb-4 drop-shadow-sm">
                    Our ML algorithm analyzes your browsing history, preferences, and booking patterns to suggest properties you'll love. The more you use SmartStay, the smarter it gets!
                  </p>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li>✓ Personalized match scores</li>
                    <li>✓ Preference-based filtering</li>
                    <li>✓ Trending property detection</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <div className="flex items-start gap-4">
                <div className="text-5xl">💬</div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">Intelligent Chatbot</h3>
                  <p className="text-white/95 mb-4 drop-shadow-sm">
                    Get instant answers 24/7 with our AI-powered chatbot. It understands context, provides smart suggestions, and can even check real-time availability!
                  </p>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li>✓ Natural language understanding</li>
                    <li>✓ Context-aware responses</li>
                    <li>✓ Real-time availability checks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Trusted by Thousands</h2>
            <p className="text-gray-600">Join our growing community of hosts and guests</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-5xl font-bold text-blue-600 mb-2">1,000+</div>
              <p className="text-gray-600 font-semibold">Properties Listed</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-5xl font-bold text-purple-600 mb-2">5,000+</div>
              <p className="text-gray-600 font-semibold">Happy Guests</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-5xl font-bold text-pink-600 mb-2">500+</div>
              <p className="text-gray-600 font-semibold">Verified Hosts</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-5xl font-bold text-green-600 mb-2">4.8★</div>
              <p className="text-gray-600 font-semibold">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How SmartStay Works</h2>
            <p className="text-xl text-gray-600">Get started in just a few simple steps</p>
          </div>

          {/* For Guests */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">For Guests</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h4 className="font-bold mb-2">Browse Properties</h4>
                <p className="text-sm text-gray-600">Search and filter through our curated selection</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h4 className="font-bold mb-2">Select Dates</h4>
                <p className="text-sm text-gray-600">Check availability and choose your dates</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h4 className="font-bold mb-2">Book & Pay</h4>
                <p className="text-sm text-gray-600">Secure booking with QR code payment</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                <h4 className="font-bold mb-2">Enjoy Your Stay</h4>
                <p className="text-sm text-gray-600">Check-in and have a wonderful experience</p>
              </div>
            </div>
          </div>

          {/* For Hosts */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-purple-600">For Hosts</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h4 className="font-bold mb-2">List Property</h4>
                <p className="text-sm text-gray-600">Add photos, details, and amenities</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h4 className="font-bold mb-2">Get Verified</h4>
                <p className="text-sm text-gray-600">Complete verification process</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h4 className="font-bold mb-2">Receive Bookings</h4>
                <p className="text-sm text-gray-600">Approve or manage booking requests</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                <h4 className="font-bold mb-2">Earn Income</h4>
                <p className="text-sm text-gray-600">Track earnings and manage finances</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Real experiences from real people</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-3">👤</div>
                <div>
                  <div className="font-bold">Sarah M.</div>
                  <div className="text-sm text-gray-600">Guest</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-2">★★★★★</div>
              <p className="text-gray-700">"The AI recommendations are spot on! Found my perfect vacation rental in minutes. The booking process was seamless."</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mr-3">👤</div>
                <div>
                  <div className="font-bold">John D.</div>
                  <div className="text-sm text-gray-600">Host</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-2">★★★★★</div>
              <p className="text-gray-700">"Managing my properties has never been easier. The financial dashboard gives me complete visibility into my earnings and expenses."</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mr-3">👤</div>
                <div>
                  <div className="font-bold">Maria L.</div>
                  <div className="text-sm text-gray-600">Guest</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-2">★★★★★</div>
              <p className="text-gray-700">"The chatbot answered all my questions instantly. Customer service is available 24/7 which is amazing!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">5000+</div>
              <p className="text-gray-600">Happy Guests</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">500+</div>
              <p className="text-gray-600">Trusted Hosts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/95 drop-shadow-md">
            Join thousands of satisfied users and experience the future of property management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/units">
              <Button size="lg" className="!bg-white !text-blue-600 hover:!bg-gray-100 shadow-xl font-bold">
                🏠 Browse Properties
              </Button>
            </Link>
            <Link to="/host-home">
              <Button size="lg" className="!bg-white !text-purple-600 hover:!bg-gray-100 shadow-xl font-bold">
                💼 List Your Property
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/90 mb-8 drop-shadow-sm">
            No credit card required • Free to browse • Instant booking
          </p>
          
          {/* FAQ Link */}
          <div className="mb-6">
            <Link 
              to="/faq" 
              className="text-white/90 hover:text-white transition-colors inline-flex items-center gap-2 text-sm font-medium drop-shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Have questions? Check our FAQ
            </Link>
          </div>
          
          {/* Hidden Admin Access */}
          <div className="pt-8 border-t border-white/20">
            <Link 
              to="/admin/login" 
              className="text-xs text-white/40 hover:text-white/60 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Staff Access
            </Link>
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </Layout>
  );
};

export default Landing;
