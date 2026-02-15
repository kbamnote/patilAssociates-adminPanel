import React, { useState, useEffect } from 'react';
import { X, Users, MapPin, Square, Circle } from 'lucide-react';

const TableModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  tableData = null,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 4,
    location: 'indoor',
    shape: 'square',
    features: [],
    isActive: true,
    notes: ''
  });

  useEffect(() => {
    if (isEditing && tableData) {
      setFormData({
        tableNumber: tableData.tableNumber || '',
        capacity: tableData.capacity || 4,
        location: tableData.location || 'indoor',
        shape: tableData.shape || 'square',
        features: tableData.features || [],
        isActive: tableData.isActive !== undefined ? tableData.isActive : true,
        notes: tableData.notes || ''
      });
    } else {
      setFormData({
        tableNumber: '',
        capacity: 4,
        location: 'indoor',
        shape: 'square',
        features: [],
        isActive: true,
        notes: ''
      });
    }
  }, [isEditing, tableData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSave = () => {
    onSave(formData, isEditing ? tableData._id : null);
  };

  const getTitle = () => {
    if (isEditing) return 'Edit Table';
    if (tableData) return 'View Table Details';
    return 'Create New Table';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto z-10">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {getTitle()}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Number
                </label>
                <input
                  type="text"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={!!tableData && !isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={!!tableData && !isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={!!tableData && !isEditing}
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="patio">Patio</option>
                  <option value="vip">VIP</option>
                  <option value="bar_area">Bar Area</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shape
                </label>
                <select
                  name="shape"
                  value={formData.shape}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={!!tableData && !isEditing}
                >
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="rectangle">Rectangle</option>
                  <option value="oval">Oval</option>
                  <option value="semi_circle">Semi-Circle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'window_view', 'quiet_corner', 'near_bar', 
                  'accessible', 'high_top', 'booth'
                ].map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      disabled={!!tableData && !isEditing}
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {feature.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                disabled={!!tableData && !isEditing}
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Active
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Additional notes about this table..."
                disabled={!!tableData && !isEditing}
              />
            </div>

            {/* View Mode - Show additional details */}
            {tableData && !isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table ID
                  </label>
                  <p className="text-gray-900 font-mono text-sm">{tableData._id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900">
                    {tableData.createdAt ? new Date(tableData.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Updated At
                  </label>
                  <p className="text-gray-900">
                    {tableData.updatedAt ? new Date(tableData.updatedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            {(isEditing || !tableData) && (
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {isEditing ? 'Update Table' : 'Create Table'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableModal;