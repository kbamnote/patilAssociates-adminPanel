import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed, let lg:translate-x-0 handle desktop default

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      // On mobile, close sidebar; on desktop, let CSS handle default visibility
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // Always close on mobile
      }
    };

    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 mt-8 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;