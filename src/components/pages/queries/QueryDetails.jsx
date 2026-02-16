import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQueryById, updateQueryStatus, deleteQuery } from '../../utils/Api';
import { ArrowLeft, Edit, Trash2, Clock, CheckCircle, Phone, CheckCheck, XCircle, Mail, Phone as PhoneIcon, MapPin, Calendar } from 'lucide-react';

const QueryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  // Fetch query details
  const fetchQuery = async () => {
    try {
      setLoading(true);
      const response = await getQueryById(id);
      if (response.data.success) {
        setQuery(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching query details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateQueryStatus(id, { status: newStatus });
      // Refresh the query details
      fetchQuery();
    } catch (error) {
      console.error('Error updating query status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle delete query
  const handleDeleteQuery = async () => {
    if (window.confirm('Are you sure you want to delete this query? This action cannot be undone.')) {
      try {
        await deleteQuery(id);
        navigate('/queries');
      } catch (error) {
        console.error('Error deleting query:', error);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      contacted: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    const statusIcons = {
      pending: <Clock className="w-4 h-4 mr-1" />,
      reviewed: <Eye className="w-4 h-4 mr-1" />,
      contacted: <Phone className="w-4 h-4 mr-1" />,
      resolved: <CheckCheck className="w-4 h-4 mr-1" />,
      closed: <XCircle className="w-4 h-4 mr-1" />
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Product badge component
  const ProductBadge = ({ product }) => {
    const productStyles = {
      'bar & restaurant': 'bg-orange-100 text-orange-800',
      hotel: 'bg-indigo-100 text-indigo-800',
      properties: 'bg-teal-100 text-teal-800'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${productStyles[product] || 'bg-gray-100 text-gray-800'}`}>
        {product.charAt(0).toUpperCase() + product.slice(1)}
      </span>
    );
  };

  useEffect(() => {
    fetchQuery();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-2 text-gray-600">Loading query details...</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-center text-gray-600">Query not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/queries')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Queries
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Query Details</h1>
              <p className="text-gray-600 mt-2">Detailed information about the customer query</p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <StatusBadge status={query.status} />
                </div>
                
                <select
                  value={query.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info and Query Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="flex items-center">
                    <span className="text-gray-900">{query.fullName}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <a href={`mailto:${query.email}`} className="text-blue-600 hover:underline">
                      {query.email}
                    </a>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <a href={`tel:${query.phone}`} className="text-blue-600 hover:underline">
                      {query.phone}
                    </a>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{formatDate(query.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Query Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Query Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900 font-medium">{query.subject}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <div className="flex items-center">
                    <ProductBadge product={query.product} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{query.message}</p>
                  </div>
                </div>
                
                {query.propertyAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-gray-900">{query.propertyAddress}</p>
                    </div>
                  </div>
                )}
                
                {query.hotelRoomNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Room Number</label>
                    <p className="text-gray-900">{query.hotelRoomNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions and Timeline */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/queries/edit/${id}`)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Query
                </button>
                
                <button
                  onClick={handleDeleteQuery}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Query
                </button>
              </div>
            </div>

            {/* Status History Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status History</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Query Created</p>
                    <p className="text-sm text-gray-500">{formatDate(query.createdAt)}</p>
                  </div>
                </div>
                
                {query.updatedAt && query.updatedAt !== query.createdAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Status Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(query.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Query ID</label>
                  <p className="text-sm text-gray-900 font-mono">{query._id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                  <p className="text-sm text-gray-900">{query.createdBy?.name || 'Customer'}</p>
                </div>
                
                {query.priority && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      query.priority === 'high' ? 'bg-red-100 text-red-800' :
                      query.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {query.priority.charAt(0).toUpperCase() + query.priority.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDetails;