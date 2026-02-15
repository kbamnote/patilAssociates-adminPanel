import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Dashboard from './components/pages/dashboard/Dashboard';
import Users from './components/pages/users/Users';
import RestaurantBookings from './components/pages/restaurant-bookings/RestaurantBookings';
import Tables from './components/pages/tables/Tables';
import MenuItems from './components/pages/menu-items/MenuItems';
import HotelRooms from './components/pages/hotel-rooms/HotelRooms';
import Bookings from './components/pages/bookings/Bookings';
import Properties from './components/pages/properties/Properties';
import PropertyListings from './components/pages/property-listings/PropertyListings';
import Layout from './components/common/Layout';
import RestaurantBookingDetails from './components/pages/restaurant-bookings/RestaurantBookingDetails';
import HotelBookingDetails from './components/pages/bookings/HotelBookingDetails';
import HotelRoomDetails from './components/pages/hotel-rooms/HotelRoomDetails';
import PropertyDetails from './components/pages/properties/PropertyDetails';
import PropertyListingDetails from './components/pages/property-listings/PropertyListingDetails';
import TableDetails from './components/pages/tables/TableDetails';
import UserDetails from './components/pages/users/UserDetails';
import MenuItemDetails from './components/pages/menu-items/MenuItemDetails';
import Orders from './components/pages/orders/Orders';
import OrderDetails from './components/pages/orders/OrderDetails';
import './App.css';
import Cookies from 'js-cookie';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('userRole');
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If allowedRoles is specified and userRole is not in allowedRoles, redirect to appropriate page
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // For other roles, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route Component (redirect to appropriate page if already logged in)
const PublicRoute = ({ children }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('userRole');
  
  if (token) {
    // For admin role, redirect to dashboard
    if (userRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    // For other roles, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route - redirect to appropriate page if already authenticated */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes with layout */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/restaurant-bookings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <RestaurantBookings />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tables" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Tables />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/menu-items" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <MenuItems />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/orders" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Orders />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/hotel-rooms" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <HotelRooms />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Bookings />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/properties" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Properties />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/property-listings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <PropertyListings />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Detail Pages Routes */}
          <Route 
            path="/restaurant-bookings/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <RestaurantBookingDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/bookings/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <HotelBookingDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/hotel-rooms/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <HotelRoomDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/properties/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <PropertyDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/property-listings/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <PropertyListingDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tables/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <TableDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/users/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <UserDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/menu-items/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <MenuItemDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/orders/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <OrderDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Catch all route - redirect to appropriate page */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
