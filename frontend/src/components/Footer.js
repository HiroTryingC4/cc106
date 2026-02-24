import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Smart Stay</h3>
            <p className="text-gray-400 text-sm">
              Your trusted platform for booking amazing properties with ease and confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/units" className="text-gray-400 hover:text-white transition">
                  Browse Units
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@smartstay.com</li>
              <li>Phone: +1 (234) 567-8900</li>
              <li>Address: 123 Main St, City, State</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Smart Stay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
