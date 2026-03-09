import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMobileSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return `/${user.role}/dashboard`;
  };

  const isGuest = user?.role === 'guest';
  const isHost = user?.role === 'host';
  const navbarBg = (isGuest || isHost) ? 'bg-[#F8FFD3]' : 'bg-white';
  const textColor = (isGuest || isHost) ? 'text-[#0C1805]' : 'text-gray-700';
  const hoverColor = (isGuest || isHost) ? 'hover:text-[#4E7B22]' : 'hover:text-primary';
  const buttonBg = (isGuest || isHost) ? 'bg-[#4E7B22]' : 'bg-primary';
  const buttonHover = (isGuest || isHost) ? 'hover:bg-[#3d6219]' : 'hover:bg-blue-700';

  return (
    <nav className={`${navbarBg} shadow-sm sticky top-0 z-50`}>
      <div className="max-w-full mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Responsive sizing: smaller on mobile, larger on desktop */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to={user ? getDashboardLink() : "/"}
              className={`flex flex-col ${(isGuest || isHost) ? 'text-[#4E7B22]' : 'text-primary'} transition-all`}
            >
              <span className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Smart Stay
              </span>
              <span className="text-xs md:text-sm text-gray-600 font-medium -mt-1">
                Property Management System
              </span>
            </Link>
          </div>

          {/* Right Side - Guest/Host Simplified View */}
          {(isGuest || isHost) && user ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Hamburger Menu Button for Guest/Host - Opens MobileSidebar */}
              <button
                onClick={onMobileSidebarToggle}
                className="lg:hidden p-2 hover:bg-[#4E7B22] hover:bg-opacity-10 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center border-2 border-[#4E7B22] relative z-50 bg-[#F8FFD3]"
                aria-label="Open navigation menu"
              >
                <svg
                  className="w-6 h-6 text-[#4E7B22]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Notification Bell - Touch-optimized with 44px minimum */}
              <Link
                to={`/${user.role}/notifications`}
                className="relative p-2 hover:bg-[#4E7B22] hover:bg-opacity-10 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#4E7B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>

              {/* Date Display - Hidden on mobile, visible on tablet+ */}
              <div className="hidden md:flex items-center px-3 py-2 lg:px-4 bg-[#4E7B22] text-white rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs lg:text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          ) : (
            /* Desktop Menu - Non-Guest Users - Hidden on mobile (< 1024px) */
            <>
              <div className="hidden lg:flex items-center space-x-6">
                {!user && (
                  <Link to="/" className={`${textColor} ${hoverColor} transition`}>
                    Home
                  </Link>
                )}
                <Link to="/units" className={`${textColor} ${hoverColor} transition`}>
                  Units
                </Link>
                <Link to="/recommendations" className={`${textColor} ${hoverColor} transition`}>
                  Recommendations
                </Link>
                <Link to="/faq" className={`${textColor} ${hoverColor} transition`}>
                  FAQ
                </Link>

                {user ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      className={`${textColor} ${hoverColor} transition`}
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {user.firstName} ({user.role})
                      </span>
                      <button
                        onClick={handleLogout}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition min-h-[44px]"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`${textColor} ${hoverColor} transition`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`${buttonBg} text-white px-4 py-2 rounded-md ${buttonHover} transition min-h-[44px] inline-flex items-center`}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Hamburger Menu Button - Visible on mobile/tablet (< 1024px) */}
              {/* Meets 44px touch target requirement */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`${textColor} ${hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition`}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {mobileMenuOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu - Visible when hamburger is clicked on mobile/tablet (< 1024px) */}
      {mobileMenuOpen && !isGuest && !isHost && (
        <div className={`lg:hidden ${navbarBg} border-t`}>
          <div className="px-4 pt-2 pb-4 space-y-1">
            {!user && (
              <Link
                to="/"
                className={`block px-3 py-3 ${textColor} hover:bg-gray-100 rounded transition min-h-[44px] flex items-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            )}
            <Link
              to="/units"
              className={`block px-3 py-3 ${textColor} hover:bg-gray-100 rounded transition min-h-[44px] flex items-center`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Units
            </Link>
            <Link
              to="/recommendations"
              className={`block px-3 py-3 ${textColor} hover:bg-gray-100 rounded transition min-h-[44px] flex items-center`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Recommendations
            </Link>
            <Link
              to="/faq"
              className={`block px-3 py-3 ${textColor} hover:bg-gray-100 rounded transition min-h-[44px] flex items-center`}
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className={`block px-3 py-3 ${textColor} hover:bg-gray-100 rounded transition min-h-[44px] flex items-center`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-3 py-3 text-sm text-gray-600 min-h-[44px] flex items-center">
                  {user.firstName} ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-3 py-3 ${textColor} hover:bg-gray-100 rounded transition min-h-[44px] flex items-center`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-3 ${textColor} hover:bg-gray-100 rounded transition min-h-[44px] flex items-center`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block px-3 py-3 ${buttonBg} text-white ${buttonHover} rounded text-center transition min-h-[44px] flex items-center justify-center`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
