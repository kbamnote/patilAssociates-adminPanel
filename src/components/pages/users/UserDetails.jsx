import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';
import { getUserById } from '../../utils/Api';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getUserById(id);
      setUser(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      customer: 'bg-blue-100 text-blue-800',
      agent: 'bg-green-100 text-green-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: <Shield className="h-4 w-4" />,
      customer: <User className="h-4 w-4" />,
      agent: <User className="h-4 w-4" />,
      user: <User className="h-4 w-4" />
    };
    return icons[role] || <User className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={fetchUserDetails}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">User not found</h3>
        <p className="text-gray-500 mt-1">The user you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
              <p className="text-gray-600 mt-1">User ID: {user._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user.roles && user.roles.map((role, index) => (
              <span key={index} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role)}`}>
                {getRoleIcon(role)}
                <span className="ml-1 capitalize">{role}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 text-lg font-medium">{user.fullName}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{user.phoneNo || 'Not provided'}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
                <div className="flex items-center">
                  {user.isActive !== false ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className={user.isActive !== false ? 'text-green-700' : 'text-red-700'}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Roles Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Roles & Permissions</h2>
            <div className="space-y-3">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 ${getRoleColor(role).replace('text-', 'bg-').replace('800', '500')} p-2 rounded-lg`}>
                        {getRoleIcon(role)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 capitalize">{role}</div>
                        <div className="text-sm text-gray-500">
                          {role === 'admin' && 'Full system access and administrative privileges'}
                          {role === 'customer' && 'Customer account with booking and viewing permissions'}
                          {role === 'agent' && 'Property agent with listing management permissions'}
                          {role === 'user' && 'Standard user account'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No roles assigned
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {user.additionalInfo && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(user.additionalInfo).map(([key, value], index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-500 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="text-gray-900">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Metadata and Avatar */}
        <div className="space-y-6">
          {/* User Avatar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                {user.isActive !== false ? (
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1">
                    <XCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-lg font-medium text-gray-900">{user.fullName}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Account Metadata */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Metadata</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{new Date(user.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                <div className="text-gray-900 font-mono text-sm">{user._id}</div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Verified</span>
                <span className={user.isEmailVerified ? 'text-green-600' : 'text-gray-400'}>
                  {user.isEmailVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Phone Verified</span>
                <span className={user.isPhoneVerified ? 'text-green-600' : 'text-gray-400'}>
                  {user.isPhoneVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Two-Factor Auth</span>
                <span className="text-gray-400">Not enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;