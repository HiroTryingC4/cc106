import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import PrivateRoute from './components/PrivateRoute';
import ChatbotWidget from './components/ChatbotWidget';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Auth Pages - Keep these loaded immediately
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import GuestLogin from './pages/Auth/GuestLogin';
import HostLogin from './pages/Auth/HostLogin';
import AdminLogin from './pages/Auth/AdminLogin';

// Public Pages - Keep landing pages loaded immediately
import Landing from './pages/Public/Landing';
import GuestLanding from './pages/Public/GuestLanding';
import HostLanding from './pages/Public/HostLanding';

// Lazy load other pages for better performance
const NotFound = lazy(() => import('./pages/NotFound'));
const Units = lazy(() => import('./pages/Public/Units'));
const UnitDetails = lazy(() => import('./pages/Public/UnitDetails'));
const PublicRecommendations = lazy(() => import('./pages/Public/Recommendations'));
const FAQ = lazy(() => import('./pages/Public/FAQ'));

// Guest Pages - Lazy loaded
const GuestDashboard = lazy(() => import('./pages/Guest/Dashboard'));
const Bookings = lazy(() => import('./pages/Guest/Bookings'));
const BookingDetails = lazy(() => import('./pages/Guest/BookingDetails'));
const CreateBooking = lazy(() => import('./pages/Guest/CreateBooking'));
const Payment = lazy(() => import('./pages/Guest/Payment'));
const Profile = lazy(() => import('./pages/Guest/Profile'));
const CheckoutPhoto = lazy(() => import('./pages/Guest/CheckoutPhoto'));
const Review = lazy(() => import('./pages/Guest/Review'));
const Recommendations = lazy(() => import('./pages/Guest/Recommendations'));

// Host Pages - Lazy loaded
const HostDashboard = lazy(() => import('./pages/Host/Dashboard'));
const HostUnits = lazy(() => import('./pages/Host/Units'));
const UnitForm = lazy(() => import('./pages/Host/UnitForm'));
const HostBookings = lazy(() => import('./pages/Host/Bookings'));
const Analytics = lazy(() => import('./pages/Host/Analytics'));
const Financial = lazy(() => import('./pages/Host/Financial'));
const Expenses = lazy(() => import('./pages/Host/Expenses'));
const Payroll = lazy(() => import('./pages/Host/Payroll'));
const FinancialManagement = lazy(() => import('./pages/Host/FinancialManagement'));
const HostReports = lazy(() => import('./pages/Host/Reports'));
const Guests = lazy(() => import('./pages/Host/Guests'));
const ChatbotManage = lazy(() => import('./pages/Host/ChatbotManage'));
const HostVerification = lazy(() => import('./pages/Host/Verification'));

// Admin Pages - Lazy loaded
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminFinancial = lazy(() => import('./pages/Admin/Financial'));
const AdminReports = lazy(() => import('./pages/Admin/Reports'));
const AdminSystem = lazy(() => import('./pages/Admin/System'));
const AdminUnits = lazy(() => import('./pages/Admin/Units'));
const AdminReviews = lazy(() => import('./pages/Admin/Reviews'));
const AdminLogs = lazy(() => import('./pages/Admin/Logs'));
const AdminChatbot = lazy(() => import('./pages/Admin/Chatbot'));
const AdminChatbotAnalytics = lazy(() => import('./pages/Admin/ChatbotAnalytics'));
const AdminVerifications = lazy(() => import('./pages/Admin/Verifications'));
const AdminSecurity = lazy(() => import('./pages/Admin/Security'));

// Shared Pages - Lazy loaded
const Notifications = lazy(() => import('./pages/Shared/Notifications'));
const Messages = lazy(() => import('./pages/Shared/Messages'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/guest-home" element={<GuestLanding />} />
          <Route path="/host-home" element={<HostLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guest/login" element={<GuestLogin />} />
          <Route path="/host/login" element={<HostLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:userType" element={<Register />} />
          <Route path="/units" element={<Units />} />
          <Route path="/units/:id" element={<UnitDetails />} />
          <Route path="/recommendations" element={<PublicRecommendations />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Guest Routes */}
          <Route 
            path="/guest/dashboard" 
            element={
              <PrivateRoute role="guest">
                <GuestDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/bookings" 
            element={
              <PrivateRoute role="guest">
                <Bookings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/bookings/:id" 
            element={
              <PrivateRoute role="guest">
                <BookingDetails />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/booking/new/:unitId" 
            element={
              <PrivateRoute role="guest">
                <CreateBooking />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/payment/:bookingId" 
            element={
              <PrivateRoute role="guest">
                <Payment />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/profile" 
            element={
              <PrivateRoute role="guest">
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/checkout/:bookingId" 
            element={
              <PrivateRoute role="guest">
                <CheckoutPhoto />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/review/:bookingId" 
            element={
              <PrivateRoute role="guest">
                <Review />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/recommendations" 
            element={
              <PrivateRoute role="guest">
                <Recommendations />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/notifications" 
            element={
              <PrivateRoute role="guest">
                <Notifications />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/guest/messages" 
            element={
              <PrivateRoute role="guest">
                <Messages />
              </PrivateRoute>
            } 
          />

          {/* Host Routes */}
          <Route 
            path="/host/dashboard" 
            element={
              <PrivateRoute role="host">
                <HostDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/verification" 
            element={
              <PrivateRoute role="host">
                <HostVerification />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/units" 
            element={
              <PrivateRoute role="host">
                <HostUnits />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/units/new" 
            element={
              <PrivateRoute role="host">
                <UnitForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/units/:id/edit" 
            element={
              <PrivateRoute role="host">
                <UnitForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/bookings" 
            element={
              <PrivateRoute role="host">
                <HostBookings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/analytics" 
            element={
              <PrivateRoute role="host">
                <Analytics />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/financial-management" 
            element={
              <PrivateRoute role="host">
                <FinancialManagement />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/financial" 
            element={
              <PrivateRoute role="host">
                <Financial />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/expenses" 
            element={
              <PrivateRoute role="host">
                <Expenses />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/payroll" 
            element={
              <PrivateRoute role="host">
                <Payroll />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/reports" 
            element={
              <PrivateRoute role="host">
                <HostReports />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/guests" 
            element={
              <PrivateRoute role="host">
                <Guests />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/chatbot" 
            element={
              <PrivateRoute role="host">
                <ChatbotManage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/notifications" 
            element={
              <PrivateRoute role="host">
                <Notifications />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/host/messages" 
            element={
              <PrivateRoute role="host">
                <Messages />
              </PrivateRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <PrivateRoute role="admin">
                <AdminUsers />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/financial" 
            element={
              <PrivateRoute role="admin">
                <AdminFinancial />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <PrivateRoute role="admin">
                <AdminReports />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/system" 
            element={
              <PrivateRoute role="admin">
                <AdminSystem />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/units" 
            element={
              <PrivateRoute role="admin">
                <AdminUnits />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <PrivateRoute role="admin">
                <AdminReviews />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/logs" 
            element={
              <PrivateRoute role="admin">
                <AdminLogs />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/chatbot" 
            element={
              <PrivateRoute role="admin">
                <AdminChatbot />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/chatbot-analytics" 
            element={
              <PrivateRoute role="admin">
                <AdminChatbotAnalytics />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/verifications" 
            element={
              <PrivateRoute role="admin">
                <AdminVerifications />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/security" 
            element={
              <PrivateRoute role="admin">
                <AdminSecurity />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/notifications" 
            element={
              <PrivateRoute role="admin">
                <Notifications />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/messages" 
            element={
              <PrivateRoute role="admin">
                <Messages />
              </PrivateRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        
        {/* Chatbot Widget - Available on all pages */}
        <ChatbotWidget />
      </Router>
      </ToastProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
