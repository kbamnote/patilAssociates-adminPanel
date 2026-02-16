/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Mail, Phone, DollarSign, Home, MapPin, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { getPropertyListingById } from '../../utils/Api';

const PropertyListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const response = await getPropertyListingById(id);
      setListing(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching listing details:', err);
      setError('Failed to load listing details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      reviewed: <CheckCircle className="h-4 w-4" />,
      accepted: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
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
          onClick={fetchListingDetails}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Listing not found</h3>
        <p className="text-gray-500 mt-1">The listing you're looking for doesn't exist or you don't have permission to view it.</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Property Listing Details</h1>
              <p className="text-gray-600 mt-1">Listing ID: {listing._id}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
            {getStatusIcon(listing.status)}
            <span className="ml-1 capitalize">{listing.status}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Listing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Property Type</label>
                <div className="flex items-center">
                  <Home className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 capitalize">{listing.propertyType}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Listing Type</label>
                <div className="text-gray-900 capitalize">{listing.listingType}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Budget</label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">₹{listing.budget}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Preferred Location</label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{listing.preferredLocation}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Requirements</label>
              <div className="text-gray-900 min-h-[40px]">
                {listing.requirements || 'None specified'}
              </div>
            </div>
          </div>

          {/* Property Details */}
          {listing.propertyId && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Property Title</label>
                  <div className="text-gray-900">{listing.propertyId.title}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Property Type</label>
                  <div className="text-gray-900 capitalize">{listing.propertyId.propertyType}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Listing Type</label>
                  <div className="text-gray-900 capitalize">{listing.propertyId.listingType}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Price</label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">₹{listing.propertyId.price}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Viewing Schedule */}
          {listing.viewingSchedule && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Viewing Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                  <div className="text-gray-900">{new Date(listing.viewingSchedule.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Time</label>
                  <div className="text-gray-900">{listing.viewingSchedule.time}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.viewingSchedule.status)}`}>
                    {getStatusIcon(listing.viewingSchedule.status)}
                    <span className="ml-1 capitalize">{listing.viewingSchedule.status}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {listing.documents && listing.documents.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
              <div className="space-y-2">
                {listing.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">{document.name}</div>
                        <div className="text-sm text-gray-500">{document.type}</div>
                      </div>
                    </div>
                    <a 
                      href={document.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
            {listing.customerId ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.customerId.fullName}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.customerId.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.customerId.phoneNo}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.customerName}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.customerEmail}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.customerPhone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Agent Information */}
          {listing.agentId && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Agent Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Agent Name</label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.agentId.fullName}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.agentId.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{listing.agentId.phoneNo}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Listing Metadata */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Listing Metadata</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <div className="text-gray-900">{new Date(listing.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                <div className="text-gray-900">{new Date(listing.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Listing ID</label>
                <div className="text-gray-900 font-mono text-sm">{listing._id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingDetails;