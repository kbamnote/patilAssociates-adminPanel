import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'; // Note: We'll need to install lucide-react
import Cookies from 'js-cookie';
import { login } from '../../utils/Api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the actual login API
      const response = await login({ email, password });
      
      // Check if login was successful
      if (response.data.success) {
        // Check if the user is an admin (based on the backend logic)
        const userRole = response.data.user?.roles?.includes('admin') ? 'admin' : response.data.user?.roles?.[0];
        
        if (userRole === 'admin') {
          // Set cookies for admin user
          Cookies.set('token', response.data.token, { expires: 7 });
          Cookies.set('userRole', userRole, { expires: 7 });
          
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          // Not an admin user
          setError('Access denied. Admin privileges required.');
          // Remove any tokens that might have been set
          Cookies.remove('token');
          Cookies.remove('userRole');
        }
      } else {
        setError(response.data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-800">Patil Associates Admin</h2>
          <p className="mt-2 text-sm text-gray-600">Manage properties, bookings, restaurants & more</p>
          <p className="mt-2 text-sm text-gray-500">Sign in to your admin account</p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-gray-900 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="admin@patilassociates.in"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white text-gray-900 block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;