/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, DollarSign, Ruler, Bed, Car, Wifi, Coffee, User, Mail, Phone, Check, X } from 'lucide-react';
import { getPropertyById } from '../../utils/Api';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await getPropertyById(id);
      console.log('Property API Response:', response.data);
      console.log('Property Data:', response.data.data);
      setProperty(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching property details:', err);
      setError('Failed to load property details. Please try again.');
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={fetchPropertyDetails}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Property not found</h3>
        <p className="text-gray-500 mt-1">The property you're looking for doesn't exist or you don't have permission to view it.</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Property Details</h1>
              <p className="text-gray-600 mt-1">Property ID: {property._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPropertyTypeColor(property.propertyType)}`}>
              <Home className="h-4 w-4 mr-1" />
              {property.propertyType}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getListingTypeColor(property.listingType)}`}>
              {property.listingType}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                <div className="text-gray-900 text-lg font-medium">{property.title}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Price</label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 text-lg font-medium">₹{property.price}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Area</label>
                <div className="flex items-center">
                  <Ruler className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{property.area} sq ft</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Bedrooms</label>
                <div className="flex items-center">
                  <Bed className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{property.bedrooms}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Bathrooms</label>
                <div className="text-gray-900">{property.bathrooms}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Parking</label>
                <div className="flex items-center">
                  <Car className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{property.parking}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {property.address && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Street</label>
                  <div className="text-gray-900">{property.address.street}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                  <div className="text-gray-900">{property.address.city}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                  <div className="text-gray-900">{property.address.state}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Zip Code</label>
                  <div className="text-gray-900">{property.address.zipCode}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
                  <div className="text-gray-900">{property.address.country}</div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {property.description}
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-lg mr-2">{getAmenityIcon(amenity)}</span>
                    <span className="text-gray-700 capitalize text-sm">
                      {amenity.replace('_', ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-gray-500">
                  No amenities available
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.features && property.features.length > 0 ? (
                property.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-lg mr-2">{getFeatureIcon(feature)}</span>
                    <span className="text-gray-700 capitalize text-sm">
                      {feature.replace('_', ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-gray-500">
                  No features available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property Images and Agent Info */}
        <div className="space-y-6">
          {/* Property Images */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Images</h2>
            {property.images && property.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {property.images.map((image, index) => {
                  // Handle different image response structures
                  const imageUrl = typeof image === 'string' 
                    ? image 
                    : image.url || image.path || '';
                  
                  return (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={`${property.title} - ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            e.target.src = 'https://placehold.co/400x400?text=Image+Not+Found';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <span>Invalid Image</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Home className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No images available</p>
              </div>
            )}
          </div>

          {/* Agent Information */}
          {property.agentId && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Agent Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Agent Name</label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{property.agentId.fullName}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{property.agentId.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{property.agentId.phoneNo}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Property Metadata */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Metadata</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <div className="text-gray-900">{new Date(property.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                <div className="text-gray-900">{new Date(property.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Property ID</label>
                <div className="text-gray-900 font-mono text-sm">{property._id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;