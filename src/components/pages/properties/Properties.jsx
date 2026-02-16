/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Home, MapPin, DollarSign, Ruler, Bed, Car, Check, X } from 'lucide-react';
import { 
  getAllProperties, 
  getPropertyStats, 
  getPropertyById, 
  updateProperty, 
  deleteProperty, 
  createProperty 
} from '../../utils/Api';
import PropertyModal from '../../common/modals/PropertyModal';
import ConfirmationModal from '../../common/modals/ConfirmationModal';

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [propertyData, setPropertyData] = useState({});
  const [stats, setStats] = useState({
    totalProperties: 0,
    forSale: 0,
    forRent: 0,
    avgPrice: 0
  });
  const [filters, setFilters] = useState({
    propertyType: searchParams.get('propertyType') || '',
    listingType: searchParams.get('listingType') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit')) || 12);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, [page, limit]);

  useEffect(() => {
    // Update URL parameters when filters or search change
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.listingType) params.listingType = filters.listingType;
    if (filters.city) params.city = filters.city;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (page !== 1) params.page = page.toString();
    if (limit !== 12) params.limit = limit.toString();
    
    setSearchParams(params);
  }, [searchTerm, filters, page, limit]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: searchTerm || undefined,
        propertyType: filters.propertyType || undefined,
        listingType: filters.listingType || undefined,
        city: filters.city || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined
      };
      
      const response = await getAllProperties(params);
      setProperties(response.data.data || []);
      
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to fetch properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getPropertyStats();
      setStats(response.data.data || {
        totalProperties: 0,
        forSale: 0,
        forRent: 0,
        avgPrice: 0
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

  const applyFilters = () => {
    setPage(1); // Reset to first page when applying filters
    fetchProperties();
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      listingType: '',
      city: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchTerm('');
    setPage(1);
    fetchProperties();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(parseInt(newLimit));
    setPage(1); // Reset to first page when changing limit
  };

  const handleEdit = (property) => {
    setCurrentProperty(property);
    setPropertyData(property);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (property) => {
    navigate(`/properties/${property._id}`);
  };

  const handleDelete = (property) => {
    setCurrentProperty(property);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProperty(currentProperty._id);
      fetchProperties();
      fetchStats();
      setShowDeleteModal(false);
      setCurrentProperty(null);
    } catch (err) {
      setError('Failed to delete property. Please try again.');
    }
  };

  const handleSave = async (data) => {
    try {
      // Ensure isActive is properly set
      const propertyData = {
        ...data,
        isActive: data.isActive !== undefined ? data.isActive : true
      };
      
      if (isEditing) {
        await updateProperty(currentProperty._id, propertyData);
        // Handle image upload for editing
        if (data.images && data.images.length > 0) {
          // This would require a separate endpoint for updating images
          // For now, we'll just update the property data
        }
      } else {
        // Create property first
        const response = await createProperty(propertyData);
        const newPropertyId = response.data.data._id;
        
        // Handle image upload after property creation
        // This would typically be handled in the modal component
        // or we would need to modify the API to accept images during creation
      }
      setShowModal(false);
      setCurrentProperty(null);
      setPropertyData({});
      fetchProperties();
      fetchStats();
    } catch (err) {
      console.error('Error saving property:', err);
      setError('Failed to save property. Please try again.');
    }
  };

  const getPropertyTypeColor = (propertyType) => {
    const colors = {
      residential: 'bg-blue-100 text-blue-800',
      commercial: 'bg-green-100 text-green-800',
      industrial: 'bg-yellow-100 text-yellow-800',
      agricultural: 'bg-green-100 text-green-800',
      land: 'bg-brown-100 text-brown-800'
    };
    return colors[propertyType] || 'bg-gray-100 text-gray-800';
  };

  const getListingTypeColor = (listingType) => {
    const colors = {
      sale: 'bg-purple-100 text-purple-800',
      rent: 'bg-indigo-100 text-indigo-800',
      lease: 'bg-pink-100 text-pink-800'
    };
    return colors[listingType] || 'bg-gray-100 text-gray-800';
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      gym: '💪',
      swimming_pool: '🏊',
      parking: '🚗',
      ac: '❄️',
      heating: '🔥',
      balcony: '🪟',
      garden: '🌳',
      security: '🛡️'
    };
    return icons[amenity] || '⭐';
  };

  const getFeatureIcon = (feature) => {
    const icons = {
      fully_furnished: '🛋️',
      semi_furnished: '🪑',
      unfurnished: '📦',
      central_ac: '❄️',
      modern_kitchen: '🍳',
      hardwood_floors: '🪵',
      natural_light: '☀️',
      storage_space: '📦'
    };
    return icons[feature] || '⭐';
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
            <p className="text-gray-600 mt-1">Manage property listings and real estate</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentProperty(null);
                setPropertyData({
                  title: '',
                  description: '',
                  propertyType: 'villa',
                  location: 'Beach Road',
                  price: 5000000,
                  bedrooms: 4,
                  bathrooms: 3,
                  area: 2500,
                  isActive: true
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Property
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="agricultural">Agricultural</option>
              <option value="land">Land</option>
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
              <option value="">All Listings</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="lease">For Lease</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="City"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalProperties}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">For Sale</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.forSale}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Ruler className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">For Rent</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.forRent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-semibold text-gray-800">
                ₹{stats.avgPrice?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {properties.map((property) => (
            <div 
              key={property._id} 
              className="border rounded-lg p-3 hover:shadow-md transition-shadow border-gray-200 bg-white"
            >
              {/* Property Image */}
              <div className="relative mb-3">
                {property.images && property.images.length > 0 ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url || property.images[0].path || ''}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span>No Image</span></div>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              
              {/* Property Name */}
              <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                {property.title}
              </h3>
              
              {/* Action Buttons */}
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleView(property)}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(property)}
                  className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                  title="Edit Property"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(property)}
                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                  title="Delete Property"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
        
        {properties.length === 0 && (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No properties match your search.' : 'No properties found in the system.'}
            </p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {pagination.totalItems > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, pagination.totalItems)}</span> of{' '}
                <span className="font-medium">{pagination.totalItems}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Items per page:</span>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-3 py-1 rounded text-sm ${!pagination.hasPrevPage ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded text-sm ${page === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-3 py-1 rounded text-sm ${!pagination.hasNextPage ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Modal */}
      <PropertyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        propertyData={propertyData}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${currentProperty?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Properties;