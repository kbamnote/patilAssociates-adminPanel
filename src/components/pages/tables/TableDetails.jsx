import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Square, Users, MapPin, Wifi, Car, Coffee, Check, X } from 'lucide-react';
import { getTableById } from '../../utils/Api';

const TableDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTableDetails();
  }, [id]);

  const fetchTableDetails = async () => {
    try {
      setLoading(true);
      const response = await getTableById(id);
      setTable(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching table details:', err);
      setError('Failed to load table details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLocationColor = (location) => {
    const colors = {
      indoor: 'bg-blue-100 text-blue-800',
      outdoor: 'bg-green-100 text-green-800',
      patio: 'bg-teal-100 text-teal-800',
      vip: 'bg-purple-100 text-purple-800',
      bar_area: 'bg-yellow-100 text-yellow-800'
    };
    return colors[location] || 'bg-gray-100 text-gray-800';
  };

  const getShapeIcon = (shape) => {
    const icons = {
      round: '⭕',
      square: '⬜',
      rectangle: '▭',
      oval: '⬭',
      semi_circle: '◗'
    };
    return icons[shape] || '⬜';
  };

  const getFeatureIcon = (feature) => {
    const icons = {
      window_view: '🪟',
      quiet_corner: '🤫',
      near_bar: '🍺',
      accessible: '♿',
      high_top: '🪑',
      booth: '🛋️'
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
          onClick={fetchTableDetails}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Table not found</h3>
        <p className="text-gray-500 mt-1">The table you're looking for doesn't exist or you don't have permission to view it.</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Table Details</h1>
              <p className="text-gray-600 mt-1">Table ID: {table._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${table.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {table.isActive ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
              {table.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLocationColor(table.location)}`}>
              <MapPin className="h-4 w-4 mr-1" />
              {table.location}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Table Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Table Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Table Number</label>
                <div className="flex items-center">
                  <Square className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 text-lg font-medium">{table.tableNumber}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Capacity</label>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{table.capacity} guests</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLocationColor(table.location)}`}>
                  {table.location.replace('_', ' ')}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Shape</label>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getShapeIcon(table.shape)}</span>
                  <span className="text-gray-900 capitalize">{table.shape.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {table.features && table.features.length > 0 ? (
                table.features.map((feature, index) => (
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

          {/* Notes */}
          {table.notes && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {table.notes}
              </div>
            </div>
          )}
        </div>

        {/* Table Visualization */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Table Visualization</h2>
            <div className="flex justify-center">
              <div className={`flex items-center justify-center ${
                table.shape === 'round' ? 'w-32 h-32 rounded-full' : 
                table.shape === 'square' ? 'w-32 h-32' : 
                table.shape === 'rectangle' ? 'w-40 h-24' : 
                table.shape === 'oval' ? 'w-32 h-24 rounded-full' : 
                'w-32 h-16 rounded-t-full'
              } border-4 border-blue-500 bg-blue-50 relative`}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">#{table.tableNumber}</div>
                  <div className="text-sm text-blue-600">{table.capacity} seats</div>
                </div>
                {table.features && table.features.includes('window_view') && (
                  <div className="absolute -top-2 -right-2 text-2xl">🪟</div>
                )}
                {table.features && table.features.includes('near_bar') && (
                  <div className="absolute -bottom-2 -right-2 text-2xl">🍺</div>
                )}
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLocationColor(table.location)}`}>
                {table.location.replace('_', ' ')} Location
              </span>
            </div>
          </div>

          {/* Table Metadata */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Table Metadata</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <div className="text-gray-900">{new Date(table.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                <div className="text-gray-900">{new Date(table.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Table ID</label>
                <div className="text-gray-900 font-mono text-sm">{table._id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDetails;