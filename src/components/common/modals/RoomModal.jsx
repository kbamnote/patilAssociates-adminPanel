import React, { useState, useEffect } from 'react';
import { X, Building, MapPin, Users, DollarSign, Star } from 'lucide-react';

const RoomModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  roomData = {},
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: 1,
    roomType: 'single',
    floor: 1,
    pricePerNight: '',
    viewType: 'none',
    bedType: 'single',
    size: '',
    description: '',
    isActive: true,
    amenities: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (roomData && isEditing) {
      setFormData({
        roomNumber: roomData.roomNumber || '',
        capacity: roomData.capacity || 1,
        roomType: roomData.roomType || 'single',
        floor: roomData.floor || 1,
        pricePerNight: roomData.pricePerNight || '',
        viewType: roomData.viewType || 'none',
        bedType: roomData.bedType || 'single',
        size: roomData.size || '',
        description: roomData.description || '',
        isActive: roomData.isActive !== false,
        amenities: roomData.amenities || []
      });
      if (roomData.images && roomData.images.length > 0) {
        setImagePreview(roomData.images[0]); // Show first image as preview
      }
    } else {
      resetForm();
    }
  }, [roomData, isEditing, isOpen]);

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      capacity: 1,
      roomType: 'single',
      floor: 1,
      pricePerNight: '',
      viewType: 'none',
      bedType: 'single',
      size: '',
      description: '',
      isActive: true,
      amenities: []
    });
    setImageFile(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'capacity' || name === 'floor' || name === 'pricePerNight' || name === 'size' ? 
        (value === '' ? (name === 'capacity' || name === 'floor' ? 1 : '') : parseFloat(value)) : value)
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const submitData = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'amenities') {
        formData[key].forEach(item => submitData.append(key, item));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Add image file if selected
    if (imageFile) {
      submitData.append('images', imageFile);
    }

    onSave(submitData, roomData._id);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing ? 'Edit Room' : 'Add New Room'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="inline h-4 w-4 mr-1" />
                  Room Number
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="101"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="inline h-4 w-4 mr-1" />
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="twin">Twin</option>
                  <option value="suite">Suite</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="family">Family</option>
                  <option value="presidential">Presidential</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Price per Night
                </label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Star className="inline h-4 w-4 mr-1" />
                  View Type
                </label>
                <select
                  name="viewType"
                  value={formData.viewType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">None</option>
                  <option value="city">City View</option>
                  <option value="ocean">Ocean View</option>
                  <option value="mountain">Mountain View</option>
                  <option value="garden">Garden View</option>
                  <option value="pool">Pool View</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bed Type
                </label>
                <select
                  name="bedType"
                  value={formData.bedType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="queen">Queen</option>
                  <option value="king">King</option>
                  <option value="sofa_bed">Sofa Bed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Size (sq ft)
                </label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="300"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {(imagePreview || (roomData && roomData.images && roomData.images.length > 0 && !isEditing)) && (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={imagePreview || roomData.images[0]} 
                      alt="Room Preview" 
                      className="h-16 w-16 object-cover rounded-lg border"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, images: [] }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['wifi', 'ac', 'mini_bar', 'balcony', 'tv', 'safe', 'kitchenette', 'private_bathroom'].map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Room description..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Active Room
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isEditing ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;