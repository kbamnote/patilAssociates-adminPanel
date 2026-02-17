import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Utensils,
  Building,
  Home,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ConfirmationModal from './modals/ConfirmationModal';

const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

  :root {
    --sb-bg: #0f172a;
    --sb-surface: #1e293b;
    --sb-border: rgba(148, 163, 184, 0.1);
    --sb-accent: #3b82f6;
    --sb-accent-dim: rgba(59, 130, 246, 0.7);
    --sb-text: #e2e8f0;
    --sb-text-muted: #94a3b8;
    --sb-active-bg: rgba(59, 130, 246, 0.15);
    --sb-hover-bg: rgba(255, 255, 255, 0.05);
    --sb-width: 256px;
  }

  .sb-root {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .sb-overlay {
    position: fixed;
    inset: 0;
    z-index: 30;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(2px);
  }

  .sb-panel {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 40;
    width: var(--sb-width);
    background: linear-gradient(180deg, var(--sb-bg) 0%, #1e293b 100%);
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--sb-border);
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
    transform: translateX(-100%);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sb-panel.is-open {
    transform: translateX(0);
    opacity: 1;
  }

  @media (min-width: 1024px) {
    .sb-panel { transform: translateX(0); }
  }

  /* Brand */
  .sb-brand {
    padding: 32px 24px 24px;
    border-bottom: 1px solid var(--sb-border);
    flex-shrink: 0;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  }

  .sb-brand-mark {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
  }

  .sb-diamond-wrap {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 2px;
  }

  .sb-diamond {
    width: 22px;
    height: 22px;
    border: 1.5px solid var(--sb-accent-dim);
    transform: rotate(45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
  }

  .sb-diamond-inner {
    width: 7px;
    height: 7px;
    background: var(--sb-accent);
    transform: rotate(0deg);
  }

  .sb-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: var(--sb-text);
  }

  .sb-brand-sub {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--sb-accent);
    padding-left: 42px;
    opacity: 0.8;
  }

  /* Nav */
  .sb-nav {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0;
    scrollbar-width: none;
  }
  .sb-nav::-webkit-scrollbar { display: none; }

  .sb-section-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--sb-text-muted);
    padding: 0 20px 8px;
    margin-top: 8px;
    position: relative;
  }

  .sb-section-label::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--sb-border) 50%, transparent 100%);
  }

  .sb-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    width: 100%;
    cursor: pointer;
    border: none;
    background: none;
    text-align: left;
    position: relative;
    transition: all 0.2s ease;
    text-decoration: none;
    border-radius: 8px;
    margin: 0 8px;
  }

  .sb-item:hover {
    background: var(--sb-hover-bg);
    transform: translateX(2px);
  }

  .sb-item.is-active {
    background: var(--sb-active-bg);
    position: relative;
    overflow: hidden;
  }

  .sb-item.is-active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at left center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .sb-item.is-active::before {
    content: '';
    position: absolute;
    left: 0; top: 6px; bottom: 6px;
    width: 2px;
    background: var(--sb-accent);
    border-radius: 0 2px 2px 0;
  }

  .sb-item-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  .sb-item.is-active .sb-item-icon {
    background: rgba(59, 130, 246, 0.2);
  }

  .sb-item-icon svg {
    width: 15px;
    height: 15px;
    color: var(--sb-text-muted);
    transition: color 0.2s;
  }

  .sb-item.is-active .sb-item-icon svg,
  .sb-item:hover .sb-item-icon svg {
    color: var(--sb-accent);
  }

  .sb-item-label {
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: var(--sb-text);
    flex: 1;
    transition: color 0.2s;
  }

  .sb-item.is-active .sb-item-label,
  .sb-item:hover .sb-item-label {
    color: var(--sb-text);
  }

  .sb-chevron {
    width: 16px;
    height: 16px;
    color: var(--sb-text-muted);
    transition: transform 0.25s ease, color 0.2s;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .sb-chevron.is-open {
    transform: rotate(180deg);
    color: var(--sb-accent);
  }

  .sb-item:hover .sb-chevron {
    color: var(--sb-accent);
    opacity: 1;
  }

  /* Submenu */
  .sb-sub {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sb-sub.is-open {
    max-height: 300px;
  }

  .sb-sub-inner {
    padding: 4px 0 4px 60px;
    position: relative;
    margin-left: 8px;
  }

  .sb-sub-inner::before {
    content: '';
    position: absolute;
    left: 36px;
    top: 8px; bottom: 8px;
    width: 1px;
    background: var(--sb-border);
    opacity: 0.5;
  }

  .sb-sub-link {
    display: block;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: var(--sb-text-muted);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;
    margin: 2px 0;
  }

  .sb-sub-link:hover {
    color: var(--sb-text);
    background: var(--sb-hover-bg);
    transform: translateX(4px);
  }

  .sb-sub-link.is-active {
    color: var(--sb-accent);
    font-weight: 600;
    background: rgba(59, 130, 246, 0.1);
  }

  .sb-sub-link.is-active::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--sb-accent);
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
  }

  .sb-sub-link.is-active:hover {
    background: rgba(59, 130, 246, 0.2);
  }

  /* Footer */
  .sb-footer {
    padding: 16px;
    border-top: 1px solid var(--sb-border);
    flex-shrink: 0;
    background: linear-gradient(0deg, rgba(30, 41, 59, 0.3) 0%, transparent 100%);
  }

  .sb-user-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    background: var(--sb-hover-bg);
  }

  .sb-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--sb-accent) 0%, #1e293b 100%);
    border: 1px solid var(--sb-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .sb-avatar svg {
    width: 14px;
    height: 14px;
    color: var(--sb-text);
    opacity: 0.8;
  }

  .sb-user-info {
    flex: 1;
    min-width: 0;
  }

  .sb-user-name {
    font-size: 12px;
    font-weight: 400;
    color: var(--sb-text);
    letter-spacing: 0.04em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sb-user-role {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--sb-accent);
    opacity: 0.8;
  }

  .sb-logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    width: 100%;
    border: 1px solid transparent;
    background: none;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .sb-logout-btn:hover {
    border-color: rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.06);
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
  }

  .sb-logout-btn svg {
    width: 14px;
    height: 14px;
    color: #94a3b8;
    transition: color 0.2s;
  }

  .sb-logout-btn:hover svg {
    color: #ef4444;
  }

  .sb-logout-btn span {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.1em;
    color: #94a3b8;
    transition: color 0.2s;
  }

  .sb-logout-btn:hover span {
    color: #ef4444;
  }
`;

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Management',
    icon: Shield,
    submenu: [
      { name: 'Users', href: '/users' },
      { name: 'Queries', href: '/queries' },
    ],
  },
  {
    name: 'Restaurant',
    icon: Utensils,
    submenu: [
      { name: 'Bookings', href: '/restaurant-bookings' },
      { name: 'Tables', href: '/tables' },
      { name: 'Menu Items', href: '/menu-items' },
      { name: 'Orders', href: '/orders' },
    ],
  },
  {
    name: 'Hotels',
    icon: Building,
    submenu: [
      { name: 'Rooms', href: '/hotel-rooms' },
      { name: 'Bookings', href: '/bookings' },
    ],
  },
  {
    name: 'Properties',
    icon: Home,
    submenu: [
      { name: 'Properties', href: '/properties' },
      { name: 'Listings', href: '/property-listings' },
    ],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMenu = (name) =>
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));

  const isActive = (path) => location.pathname === path;
  const isActiveSubmenu = (items) => items.some((i) => isActive(i.href));

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('userRole');
    navigate('/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) toggleSidebar();
  };

  return (
    <div className="sb-root">
      <style>{SIDEBAR_STYLES}</style>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="sb-overlay lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Panel */}
      <aside className={`sb-panel ${isOpen ? 'is-open' : ''}`}>
        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-brand-mark">
            <div className="sb-diamond-wrap">
              <div className="sb-diamond">
                <div className="sb-diamond-inner" />
              </div>
            </div>
            <span className="sb-brand-name">Patil Associates</span>
          </div>
          <div className="sb-brand-sub">Admin Console</div>
        </div>

        {/* Navigation */}
        <nav className="sb-nav">
          <div className="sb-section-label">Navigation</div>

          {navItems.map((item) =>
            item.submenu ? (
              <div key={item.name}>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`sb-item ${isActiveSubmenu(item.submenu) ? 'is-active' : ''}`}
                >
                  <div className="sb-item-icon">
                    <item.icon />
                  </div>
                  <span className="sb-item-label">{item.name}</span>
                  <ChevronDown
                    className={`sb-chevron ${openMenus[item.name] ? 'is-open' : ''}`}
                  />
                </button>

                <div className={`sb-sub ${openMenus[item.name] ? 'is-open' : ''}`}>
                  <div className="sb-sub-inner">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        onClick={handleNavClick}
                        className={`sb-sub-link ${isActive(sub.href) ? 'is-active' : ''}`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleNavClick}
                className={`sb-item ${isActive(item.href) ? 'is-active' : ''}`}
              >
                <div className="sb-item-icon">
                  <item.icon />
                </div>
                <span className="sb-item-label">{item.name}</span>
              </Link>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          <div className="sb-user-row">
            <div className="sb-avatar">
              <Shield />
            </div>
            <div className="sb-user-info">
              <div className="sb-user-name">Administrator</div>
              <div className="sb-user-role">Admin</div>
            </div>
          </div>

          <button
            className="sb-logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out? You will need to sign in again to access the admin panel."
        confirmText="Yes, Sign Out"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Sidebar;