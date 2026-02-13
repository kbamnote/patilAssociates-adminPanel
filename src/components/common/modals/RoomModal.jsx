import React from 'react';
import { X, Building, MapPin, Users, DollarSign, Star } from 'lucide-react';

const RoomModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  roomData = {},
  isEditing = false
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    onSave(roomData);
    onClose();
  };

  const handleAmenityChange = (amenity) => {
    const currentAmenities = roomData.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    onSave({...roomData, amenities: newAmenities});
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
              onClick={onClose}
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
                  value={roomData.roomNumber || ''}
                  onChange={(e) => onSave({...roomData, roomNumber: e.target.value})}
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
                  value={roomData.capacity || 1}
                  onChange={(e) => onSave({...roomData, capacity: parseInt(e.target.value)})}
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
                  value={roomData.roomType || 'single'}
                  onChange={(e) => onSave({...roomData, roomType: e.target.value})}
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
                  value={roomData.floor || 1}
                  onChange={(e) => onSave({...roomData, floor: parseInt(e.target.value)})}
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
                  value={roomData.pricePerNight || ''}
                  onChange={(e) => onSave({...roomData, pricePerNight: parseFloat(e.target.value)})}
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
                  value={roomData.viewType || 'none'}
                  onChange={(e) => onSave({...roomData, viewType: e.target.value})}
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
                  value={roomData.bedType || 'single'}
                  onChange={(e) => onSave({...roomData, bedType: e.target.value})}
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
                  value={roomData.size || ''}
                  onChange={(e) => onSave({...roomData, size: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="300"
                  min="0"
                />
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
                      checked={(roomData.amenities || []).includes(amenity)}
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
                value={roomData.description || ''}
                onChange={(e) => onSave({...roomData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Room description..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={roomData.isActive !== false}
                onChange={(e) => onSave({...roomData, isActive: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Active Room
              </label>
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
              {isEditing ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;