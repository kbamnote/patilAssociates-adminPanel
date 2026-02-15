import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Calendar, User, Mail, Phone, CheckCircle, Clock, XCircle, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import { 
  getAllPropertyListings, 
  getPropertyListingStats,
  updatePropertyListing,
  getPropertyListingById
} from '../../utils/Api';
import ConfirmationModal from '../../common/modals/ConfirmationModal';

const PropertyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentListing, setCurrentListing] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [stats, setStats] = useState({
    totalListings: 0,
    inquiries: 0,
    offers: 0,
    pending: 0,
    accepted: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    listingType: ''
  });

  useEffect(() => {
    fetchListings();
    fetchStats();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getAllPropertyListings();
      setListings(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching property listings:', err);
      setError('Failed to fetch property listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getPropertyListingStats();
      setStats(response.data.data || {
        totalListings: 0,
        inquiries: 0,
        offers: 0,
        pending: 0,
        accepted: 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredListings = listings.filter(listing =>
    (listing.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.customerInfo?.phone?.includes(searchTerm) ||
    listing.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.listingType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof listing.propertyId === 'object' && listing.propertyId ?
      listing.propertyId._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.propertyId.title?.toLowerCase().includes(searchTerm.toLowerCase())
      : listing.propertyId?.toString().toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (filters.status === '' || listing.status === filters.status) &&
    (filters.listingType === '' || listing.listingType === filters.listingType)
  );

  const handleView = (listing) => {
    navigate(`/property-listings/${listing._id}`);
  };

  const handleUpdateStatus = async (listingId, newStatus) => {
    try {
      await updatePropertyListing(listingId, { status: newStatus });
      fetchListings();
      fetchStats();
    } catch (err) {
      setError('Failed to update listing status. Please try again.');
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
      reviewed: <Eye className="h-4 w-4" />,
      accepted: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const getListingTypeColor = (listingType) => {
    const colors = {
      inquiry: 'bg-blue-100 text-blue-800',
      offer: 'bg-purple-100 text-purple-800',
      booking: 'bg-green-100 text-green-800',
      sold: 'bg-indigo-100 text-indigo-800',
      rented: 'bg-yellow-100 text-yellow-800'
    };
    return colors[listingType] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-gray-600 mt-1">Manage property inquiries and listings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
            <select
              name="listingType"
              value={filters.listingType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="inquiry">Inquiry</option>
              <option value="offer">Offer</option>
              <option value="booking">Booking</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="text-lg font-semibold text-gray-800">{stats.totalListings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Inquiries</p>
              <p className="text-lg font-semibold text-gray-800">{stats.inquiries}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Offers</p>
              <p className="text-lg font-semibold text-gray-800">{stats.offers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Pending</p>
              <p className="text-lg font-semibold text-gray-800">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Accepted</p>
              <p className="text-lg font-semibold text-gray-800">{stats.accepted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.map((listing) => (
                <tr key={listing._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {listing.customerInfo?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.customerInfo?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      Property ID: {typeof listing.propertyId === 'object' && listing.propertyId 
                        ? listing.propertyId._id?.substring(0, 8) || 'N/A'
                        : listing.propertyId?.substring(0, 8) || 'N/A'}
                    </div>
                    {listing.offerPrice && (
                      <div className="text-sm text-gray-600 mt-1">
                        Offer: ₹{listing.offerPrice?.toLocaleString()}
                      </div>
                    )}
                    {listing.proposedRent && (
                      <div className="text-sm text-gray-600 mt-1">
                        Rent: ₹{listing.proposedRent?.toLocaleString()}/month
                      </div>
                    )}
                    {listing.customerInfo?.message && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {listing.customerInfo.message.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getListingTypeColor(listing.listingType)}`}>
                        {listing.listingType}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                        <span className="mr-1">
                          {getStatusIcon(listing.status)}
                        </span>
                        {listing.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        {listing.customerInfo?.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(listing)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {listing.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(listing._id, 'reviewed')}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                          title="Mark as Reviewed"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {(listing.status === 'pending' || listing.status === 'reviewed') && (
                        <button
                          onClick={() => handleUpdateStatus(listing._id, 'accepted')}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Accept"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {(listing.status === 'pending' || listing.status === 'reviewed') && (
                        <button
                          onClick={() => handleUpdateStatus(listing._id, 'rejected')}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No listings</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No listings match your search.' : 'No property listings found in the system.'}
            </p>
          </div>
        )}
      </div>

      {/* View Listing Modal */}
      {showViewModal && currentListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Listing Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">{currentListing.customerInfo?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{currentListing.customerInfo?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{currentListing.customerInfo?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Property ID</label>
                      <p className="text-gray-900 font-mono">
                        {typeof currentListing.propertyId === 'object' && currentListing.propertyId 
                          ? currentListing.propertyId._id || 'N/A'
                          : currentListing.propertyId || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">Listing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Listing Type</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getListingTypeColor(currentListing.listingType)}`}>
                        {currentListing.listingType}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentListing.status)}`}>
                        {getStatusIcon(currentListing.status)}
                        <span className="ml-1">{currentListing.status}</span>
                      </span>
                    </div>
                    {currentListing.offerPrice && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Offer Price</label>
                        <p className="text-gray-900">₹{currentListing.offerPrice?.toLocaleString()}</p>
                      </div>
                    )}
                    {currentListing.proposedRent && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Proposed Rent</label>
                        <p className="text-gray-900">₹{currentListing.proposedRent?.toLocaleString()}/month</p>
                      </div>
                    )}
                    {currentListing.leaseDuration && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Lease Duration</label>
                        <p className="text-gray-900">{currentListing.leaseDuration}</p>
                      </div>
                    )}
                  </div>
                </div>

                {currentListing.customerInfo?.message && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Customer Message</h3>
                    <p className="text-gray-700">{currentListing.customerInfo.message}</p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm text-gray-900">
                        {new Date(currentListing.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated</span>
                      <span className="text-sm text-gray-900">
                        {new Date(currentListing.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListings;