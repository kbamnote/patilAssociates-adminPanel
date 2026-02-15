import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed, let lg:translate-x-0 handle desktop default
  const [userToggled, setUserToggled] = useState(false); // Track if user manually toggled

  // Effect to handle window resize
  useEffect(() => {
    let resizeTimer;
    
    const handleResize = () => {
      // Clear the previous timer
      clearTimeout(resizeTimer);
      
      // Set a new timer to only run after resizing stops
      resizeTimer = setTimeout(() => {
        // On small screens (< 1024px), close sidebar by default; on desktop, let CSS handle default visibility
        if (window.innerWidth < 1024 && !userToggled) {
          setIsSidebarOpen(false); // Close on mobile and tablets by default
        }
      }, 250);
    };

    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [userToggled]); // Add userToggled as dependency

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setUserToggled(true); // Mark that user has manually toggled
    // Reset the userToggled flag after a delay to allow for window resizing
    setTimeout(() => setUserToggled(false), 500);
  };

  return (
    <div className={`flex min-h-screen bg-gray-50 ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 sm:p-6 mt-16 lg:mt-8 transition-all duration-300 lg:ml-64">
          <div className="mobile-padding">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;