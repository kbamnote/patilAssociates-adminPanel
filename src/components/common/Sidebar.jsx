import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Utensils, 
  Building, 
  Home, 
  Calendar,
  Menu as MenuIcon,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  BarChart3,
  FileText,
  Shield,
  Receipt
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ConfirmationModal from './modals/ConfirmationModal';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { 
      name: 'Management', 
      icon: Shield,
      submenu: [
        { name: 'Users', href: '/users' }
      ]
    },
    { 
      name: 'Restaurant', 
      icon: Utensils,
      submenu: [
        { name: 'Bookings', href: '/restaurant-bookings' },
        { name: 'Tables', href: '/tables' },
        { name: 'Menu Items', href: '/menu-items' },
        { name: 'Orders', href: '/orders' }
      ]
    },
    { 
      name: 'Hotels', 
      icon: Building,
      submenu: [
        { name: 'Rooms', href: '/hotel-rooms' },
        { name: 'Bookings', href: '/bookings' }
      ]
    },
    { 
      name: 'Properties', 
      icon: Home,
      submenu: [
        { name: 'Properties', href: '/properties' },
        { name: 'Listings', href: '/property-listings' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isActiveSubmenu = (submenuItems) => {
    return submenuItems.some(item => isActive(item.href));
  };

  const handleLogout = () => {
    // Remove token and role from cookies
    Cookies.remove('token');
    Cookies.remove('userRole');
    // Redirect to login
    navigate('/login');
  };

  return (
    <>\n      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-4 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-white" />
              <h1 className="text-xl font-bold text-white">Patil Associates</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {navItems.map((item) => (
                item.submenu ? (
                  // Dropdown menu item
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActiveSubmenu(item.submenu)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                      </div>
                      {openMenus[item.name] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {openMenus[item.name] && (
                      <div className="ml-6 mt-1 space-y-1 pl-2 border-l-2 border-gray-700">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            onClick={() => {
                              if (window.innerWidth < 1024) {
                                toggleSidebar();
                              }
                            }}
                            className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                              isActive(subItem.href)
                                ? 'bg-indigo-500 text-white shadow-inner'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Logout */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out? You will need to sign in again to access the admin panel."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default Sidebar;