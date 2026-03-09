import React, { useState, useCallback } from 'react';
import Navbar from './Navbar';
import MobileSidebar from './MobileSidebar';
import Footer from './Footer';

const Layout = ({ children, showFooter = true }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMobileSidebarToggle={handleToggle} />
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={handleClose} 
      />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
