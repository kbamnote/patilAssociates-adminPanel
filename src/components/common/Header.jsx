/* eslint-disable no-unused-vars */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft, ChevronRight } from 'lucide-react';

const HEADER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');

  :root {
    --hdr-bg: #ffffff;
    --hdr-border: rgba(148, 163, 184, 0.2);
    --hdr-accent: #3b82f6;
    --hdr-text: #1e293b;
    --hdr-muted: #64748b;
    --hdr-height: 64px;
    --hdr-sidebar: 256px;
  }

  .hdr-root {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .hdr-bar {
    position: fixed;
    top: 0; right: 0; left: 0;
    height: var(--hdr-height);
    background: var(--hdr-bg);
    border-bottom: 1px solid var(--hdr-border);
    z-index: 20;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 20px;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 1024px) {
    .hdr-bar {
      left: var(--hdr-sidebar);
    }
  }

  /* Accent rule left edge */
  .hdr-bar::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to right, var(--hdr-accent), transparent 40%);
    opacity: 0.3;
  }

  .hdr-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--hdr-border);
    background: none;
    border-radius: 8px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .hdr-toggle:hover {
    border-color: var(--hdr-accent);
    background: rgba(59, 130, 246, 0.08);
    transform: translateY(-1px);
  }

  .hdr-toggle svg {
    width: 16px;
    height: 16px;
    color: var(--hdr-muted);
  }

  .hdr-back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--hdr-border);
    background: none;
    border-radius: 8px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .hdr-back:hover {
    border-color: var(--hdr-accent);
    background: rgba(59, 130, 246, 0.08);
    transform: translateY(-1px);
  }

  .hdr-back svg {
    width: 14px;
    height: 14px;
    color: var(--hdr-muted);
  }

  /* Breadcrumb / title area */
  .hdr-title-area {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .hdr-section {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--hdr-accent);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .hdr-sep {
    width: 12px;
    height: 1px;
    background: var(--hdr-border);
    flex-shrink: 0;
    margin-bottom: 2px;
  }

  .hdr-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--hdr-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Right side */
  .hdr-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .hdr-date-block {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .hdr-date-day {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: var(--hdr-text);
    white-space: nowrap;
  }

  .hdr-date-full {
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: var(--hdr-muted);
    white-space: nowrap;
  }

  .hdr-divider {
    width: 1px;
    height: 28px;
    background: var(--hdr-border);
  }

  .hdr-status {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .hdr-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    animation: hdr-pulse 2.5s ease-in-out infinite;
  }

  @keyframes hdr-pulse {
    0%, 100% { box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }
    50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
  }

  .hdr-status-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #10b981;
  }

  @media (max-width: 639px) {
    .hdr-date-block { display: none; }
    .hdr-divider { display: none; }
    .hdr-section { display: none; }
    .hdr-sep { display: none; }
  }
`;

const routeMap = {
  '/dashboard': { section: 'Overview', title: 'Dashboard' },
  '/users': { section: 'Management', title: 'Users' },
  '/queries': { section: 'Management', title: 'Queries' },
  '/restaurant-bookings': { section: 'Restaurant', title: 'Bookings' },
  '/tables': { section: 'Restaurant', title: 'Tables' },
  '/menu-items': { section: 'Restaurant', title: 'Menu Items' },
  '/orders': { section: 'Restaurant', title: 'Orders' },
  '/hotel-rooms': { section: 'Hotels', title: 'Rooms' },
  '/bookings': { section: 'Hotels', title: 'Bookings' },
  '/properties': { section: 'Properties', title: 'Properties' },
  '/property-listings': { section: 'Properties', title: 'Listings' },
};

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();



  const route = routeMap[location.pathname];

  const getPageInfo = () => {
    if (route) return route;

    const parts = location.pathname.split('/').filter(Boolean);
    const title = parts
      .filter((p) => !(p.length === 24 && /^[0-9a-fA-F]+$/.test(p)))
      .map((p) => p.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      .join(' › ') || 'Admin Panel';
    return { section: 'Patil Associates', title };
  };

  const { section, title } = getPageInfo();

  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateFull = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="hdr-root">
      <style>{HEADER_STYLES}</style>
      <header className="hdr-bar">
        {/* Mobile toggle */}
        <button
          className="hdr-toggle lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu />
        </button>

        {/* Title area */}
        <div className="hdr-title-area">
          <span className="hdr-section">{section}</span>
          <div className="hdr-sep" />
          <h1 className="hdr-page-title">{title}</h1>
        </div>

        {/* Right side */}
        <div className="hdr-right">
          <div className="hdr-date-block">
            <span className="hdr-date-day">{dayName}</span>
            <span className="hdr-date-full">{dateFull}</span>
          </div>
          <div className="hdr-divider" />
          <div className="hdr-status">
            <div className="hdr-status-dot" />
            <span className="hdr-status-label">Live</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;