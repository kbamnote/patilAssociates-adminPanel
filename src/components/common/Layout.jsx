import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const LAYOUT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');

  :root {
    --layout-sidebar: 256px;
    --layout-header: 64px;
    --layout-bg: #f8fafc;
    --layout-surface: #ffffff;
  }

  * {
    box-sizing: border-box;
  }

  .layout-root {
    display: flex;
    min-height: 100vh;
    background: var(--layout-bg);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .layout-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding-top: var(--layout-header);
  }

  @media (min-width: 1024px) {
    .layout-main {
      margin-left: var(--layout-sidebar);
    }
  }

  .layout-content {
    flex: 1;
    padding: 32px 32px;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    background: var(--layout-surface);
    min-height: calc(100vh - var(--layout-header));
  }

  @media (max-width: 639px) {
    .layout-content {
      padding: 24px 16px;
    }
  }

  /* Subtle dot-grid background texture */
  .layout-root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image: radial-gradient(circle, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .layout-content {
    position: relative;
    z-index: 2;
  }
`;

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userToggled, setUserToggled] = useState(false);

  useEffect(() => {
    let timer;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.innerWidth < 1024 && !userToggled) {
          setIsSidebarOpen(false);
        }
      }, 250);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [userToggled]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setUserToggled(true);
    setTimeout(() => setUserToggled(false), 500);
  };

  return (
    <>
      <style>{LAYOUT_STYLES}</style>
      <div className="layout-root">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="layout-main">
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="layout-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;