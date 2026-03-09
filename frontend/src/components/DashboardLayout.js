import React, { useState, useCallback } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isGuest = user?.role === 'guest';
  const isHost = user?.role === 'host';
  const bgColor = (isGuest || isHost) ? 'bg-[#F5F5DC]' : 'bg-gray-50';

  const handleToggle = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${bgColor}`}>
      <Navbar onMobileSidebarToggle={handleToggle} />
      <div className="flex flex-1">
        <Sidebar />
        <MobileSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={handleClose} 
        />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
