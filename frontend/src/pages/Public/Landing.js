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
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-28 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold">
              Everything You Need in One Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Smart Stay — Ready to Get Started?
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Join thousands of satisfied users and experience the future of property management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/units">
                <Button size="lg" className="!bg-white !text-blue-600 hover:!bg-gray-100 shadow-xl font-bold">
                  🏠 Browse Properties
                </Button>
              </Link>
              <Link to="/host-home">
                <Button size="lg" className="!bg-white !text-purple-600 hover:!bg-gray-100 shadow font-bold">
                  💼 List Your Property
                </Button>
              </Link>
            </div>
            
            {/* User Type Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Guest Card */}
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Smart Search & Filters</h3>
                <p className="text-emerald-700 mb-4">Advanced search with filters for price, location, amenities, and more</p>
              </div>

              {/* Host Card */}
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition">
                <div className="text-4xl mb-3">🧾</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Property Management</h3>
                <p className="text-emerald-700 mb-4">Easily list, edit, and manage multiple properties with photos and details</p>
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
              <div className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-bold text-lg">
                For Guests
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Smart Search & Filters</h3>
                <p className="text-emerald-700">Advanced search with filters for price, location, amenities, and more</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">AI Recommendations</h3>
                <p className="text-emerald-700">Personalized property suggestions based on your preferences and browsing history</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Real-Time Availability</h3>
                <p className="text-emerald-700">Check availability instantly with interactive calendar and instant booking</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Secure QR Payments</h3>
                <p className="text-emerald-700">Fast and secure payment processing with QR code technology</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Reviews & Ratings</h3>
                <p className="text-emerald-700">Share your experience with photos and help others make informed decisions</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">24/7 AI Chatbot</h3>
                <p className="text-emerald-700">Get instant answers to your questions anytime, anywhere</p>
              </div>
            </div>
          </div>

          {/* Host Features */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-bold text-lg">
                For Hosts
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Advanced Analytics</h3>
                <p className="text-emerald-700">Track bookings, occupancy rates, revenue trends, and guest statistics</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Financial Dashboard</h3>
                <p className="text-emerald-700">Monitor revenue, expenses, payroll, and calculate net profit automatically</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🧾</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Expense Tracking</h3>
                <p className="text-emerald-700">Track all property expenses by category with detailed reports</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Custom Reports</h3>
                <p className="text-emerald-700">Generate detailed financial and booking reports with export options</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Flexible Time Units</h3>
                <p className="text-emerald-700">Set customizable work hours, track time logs, and manage shift-based schedules with ease</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2 text-emerald-800">Secure Payments</h3>
                <p className="text-emerald-700">Multiple secure payment options with clear payout schedules</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 bg-gradient-to-r from-emerald-700 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Powered by Artificial Intelligence
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
      <section className="py-16 bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Trusted by Thousands</h2>
            <p className="opacity-90">Join our growing community of hosts and guests</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-emerald-500 p-6 rounded-xl shadow-md">
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <p className="font-semibold">Properties Listed</p>
            </div>
            <div className="bg-emerald-500 p-6 rounded-xl shadow-md">
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <p className="font-semibold">Happy Guests</p>
            </div>
            <div className="bg-emerald-500 p-6 rounded-xl shadow-md">
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="font-semibold">Verified Hosts</p>
            </div>
            <div className="bg-emerald-500 p-6 rounded-xl shadow-md">
              <div className="text-4xl font-bold mb-2">4.8</div>
              <p className="font-semibold">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-800 mb-2">How SmartStay Works</h2>
            <p className="text-sm text-emerald-600">Get started in just a few simple steps</p>
          </div>

          {/* For Guests */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-center mb-8 text-emerald-800">For Guests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start">
              {[{
                n: 1, title: 'Browse Properties', desc: 'Search and filter through our curated selection'
              },{
                n: 2, title: 'Select Dates', desc: 'Check availability and choose your dates'
              },{
                n: 3, title: 'Book & Pay', desc: 'Secure booking with QR code payment'
              },{
                n: 4, title: 'Enjoy Your Stay', desc: 'Check-in and have a wonderful experience'
              }].map((s) => (
                <div key={s.n} className="text-center">
                  <div className="w-14 h-14 bg-emerald-400 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">{s.n}</div>
                  <h4 className="font-semibold mb-1 text-emerald-800">{s.title}</h4>
                  <p className="text-xs text-emerald-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* For Hosts */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-center mb-8 text-emerald-800">For Hosts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start">
              {[{
                n: 1, title: 'List Property', desc: 'Add photos, details, and amenities'
              },{
                n: 2, title: 'Get Verified', desc: 'Complete verification process'
              },{
                n: 3, title: 'Receive Bookings', desc: 'Approve or manage booking requests'
              },{
                n: 4, title: 'Earn Income', desc: 'Track earnings and manage finances'
              }].map((s) => (
                <div key={s.n} className="text-center">
                  <div className="w-14 h-14 bg-emerald-400 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">{s.n}</div>
                  <h4 className="font-semibold mb-1 text-emerald-800">{s.title}</h4>
                  <p className="text-xs text-emerald-600">{s.desc}</p>
                </div>
              ))}
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/95 drop-shadow-md">
            Join thousands of satisfied users and experience the future of property management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/units">
              <Button size="lg" className="!bg-white !text-green-600 hover:!bg-gray-100 shadow-xl font-bold">
                Explore Properties
              </Button>
            </Link>
            <Link to="/units">
              <Button size="lg" className="!bg-white !text-green-600 hover:!bg-gray-100 shadow-xl font-bold">
                Explore Properties
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
