import React, { useState, useEffect } from 'react';
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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    propertyType: '',
    listingType: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllProperties();
      setProperties(response.data.data || []);
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
    // Filter logic would be implemented here
    // For now, we'll just refetch all properties
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
    fetchProperties();
  };

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.propertyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.listingType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (property) => {
    setCurrentProperty(property);
    setPropertyData(property);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (property) => {
    setCurrentProperty(property);
    setPropertyData(property);
    setIsEditing(false);
    setShowModal(true);
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
      if (isEditing) {
        await updateProperty(currentProperty._id, data);
      } else {
        await createProperty(data);
      }
      setShowModal(false);
      setCurrentProperty(null);
      setPropertyData({});
      fetchProperties();
      fetchStats();
    } catch (err) {
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
                onChange={handleSearch}
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
                  propertyType: 'residential',
                  listingType: 'sale',
                  address: {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'India'
                  },
                  price: '',
                  area: '',
                  bedrooms: 0,
                  bathrooms: 0,
                  parking: 0,
                  amenities: [],
                  features: [],
                  isActive: true,
                  isFeatured: false
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
          {filteredProperties.map((property) => (
            <div 
              key={property._id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow border-blue-200 bg-blue-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {property.address?.city || 'N/A'}, {property.address?.state || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
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
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPropertyTypeColor(property.propertyType)}`}>
                    {property.propertyType}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Listing:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getListingTypeColor(property.listingType)}`}>
                    {property.listingType}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-800">
                      ₹{property.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Area:</span>
                  <div className="flex items-center">
                    <Ruler className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{property.area?.toLocaleString()} sq ft</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <Bed className="h-4 w-4 text-gray-400 mx-auto" />
                    <span className="text-xs text-gray-600">{property.bedrooms || 0}</span>
                  </div>
                  <div>
                    <span className="text-lg">🛁</span>
                    <span className="text-xs text-gray-600">{property.bathrooms || 0}</span>
                  </div>
                  <div>
                    <Car className="h-4 w-4 text-gray-400 mx-auto" />
                    <span className="text-xs text-gray-600">{property.parking || 0}</span>
                  </div>
                </div>
                
                {property.amenities && property.amenities.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-1">Amenities:</div>
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center"
                          title={amenity.replace('_', ' ')}
                        >
                          {getAmenityIcon(amenity)}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{property.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {property.features && property.features.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-1">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {property.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center"
                          title={feature.replace('_', ' ')}
                        >
                          {getFeatureIcon(feature)}
                        </span>
                      ))}
                      {property.features.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{property.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No properties match your search.' : 'No properties found in the system.'}
            </p>
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