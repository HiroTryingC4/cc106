import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <div className="text-6xl mb-4">🏠</div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg">
              Go to Home
            </Button>
          </Link>
          <Link to="/units">
            <Button size="lg" variant="secondary">
              Browse Properties
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? <Link to="/" className="text-blue-600 hover:underline">Contact Support</Link></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
