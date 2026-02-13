import React from 'react';
import { X, Home, MapPin, DollarSign, Ruler, Car, Wifi, Coffee } from 'lucide-react';

const PropertyModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  propertyData = {},
  isEditing = false
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    onSave(propertyData);
    onClose();
  };

  const handleFeatureChange = (feature) => {
    const currentFeatures = propertyData.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    onSave({...propertyData, features: newFeatures});
  };

  const handleAmenityChange = (amenity) => {
    const currentAmenities = propertyData.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    onSave({...propertyData, amenities: newAmenities});
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Home className="inline h-4 w-4 mr-1" />
                  Property Title
                </label>
                <input
                  type="text"
                  value={propertyData.title || ''}
                  onChange={(e) => onSave({...propertyData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Luxury Apartment in Downtown"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={propertyData.propertyType || 'residential'}
                  onChange={(e) => onSave({...propertyData, propertyType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={propertyData.description || ''}
                onChange={(e) => onSave({...propertyData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detailed description of the property..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Price
                </label>
                <input
                  type="number"
                  value={propertyData.price || ''}
                  onChange={(e) => onSave({...propertyData, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5000000"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Ruler className="inline h-4 w-4 mr-1" />
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  value={propertyData.area || ''}
                  onChange={(e) => onSave({...propertyData, area: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Listing Type
                </label>
                <select
                  value={propertyData.listingType || 'sale'}
                  onChange={(e) => onSave({...propertyData, listingType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Lease</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={propertyData.bedrooms || 0}
                  onChange={(e) => onSave({...propertyData, bedrooms: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={propertyData.bathrooms || 0}
                  onChange={(e) => onSave({...propertyData, bathrooms: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Car className="inline h-4 w-4 mr-1" />
                  Parking
                </label>
                <input
                  type="number"
                  value={propertyData.parking || 0}
                  onChange={(e) => onSave({...propertyData, parking: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  City
                </label>
                <input
                  type="text"
                  value={propertyData.address?.city || ''}
                  onChange={(e) => onSave({
                    ...propertyData, 
                    address: {...propertyData.address, city: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mumbai"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wifi className="inline h-4 w-4 mr-1" />
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['gym', 'swimming_pool', 'parking', 'ac', 'heating', 'balcony', 'garden', 'security'].map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(propertyData.amenities || []).includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {amenity.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Coffee className="inline h-4 w-4 mr-1" />
                Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['fully_furnished', 'semi_furnished', 'unfurnished', 'central_ac', 'modern_kitchen', 'hardwood_floors', 'natural_light', 'storage_space'].map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(propertyData.features || []).includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {feature.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isEditing ? 'Update Property' : 'Create Property'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;