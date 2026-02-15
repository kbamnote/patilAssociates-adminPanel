import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Square, Users, MapPin, Wifi, Car, Coffee, Check, X, Circle } from 'lucide-react';
import { 
  getAllTables, 
  getTableById, 
  updateTable, 
  deleteTable, 
  createTable 
} from '../../utils/Api';

const Tables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await getAllTables();
      setTables(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch tables. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTables = tables.filter(table =>
    table.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.capacity?.toString().includes(searchTerm) ||
    table.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.shape?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (table) => {
    setCurrentTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location,
      shape: table.shape,
      features: table.features || [],
      isActive: table.isActive,
      notes: table.notes || ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (table) => {
    navigate(`/tables/${table._id}`);
  };

  const handleDelete = async (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await deleteTable(tableId);
        fetchTables(); // Refresh the list
      } catch (err) {
        setError('Failed to delete table. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateTable(currentTable._id, formData);
      } else {
        await createTable(formData);
      }
      setShowModal(false);
      setCurrentTable(null);
      setFormData({
        tableNumber: '',
        capacity: 4,
        location: 'indoor',
        shape: 'square',
        features: [],
        isActive: true,
        notes: ''
      });
      fetchTables(); // Refresh the list
    } catch (err) {
      setError('Failed to save table. Please try again.');
    }
  };

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

  const getLocationColor = (location) => {
    switch (location) {
      case 'indoor':
        return 'bg-blue-100 text-blue-800';
      case 'outdoor':
        return 'bg-green-100 text-green-800';
      case 'patio':
        return 'bg-yellow-100 text-yellow-800';
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'bar_area':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShapeIcon = (shape) => {
    switch (shape) {
      case 'round':
        return <Circle className="h-4 w-4" />;
      case 'square':
        return <Square className="h-4 w-4" />;
      case 'rectangle':
        return <Square className="h-4 w-4" />;
      case 'oval':
        return <Circle className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-gray-600 mt-1">Manage restaurant tables and seating</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentTable(null);
                setFormData({
                  tableNumber: '',
                  capacity: 4,
                  location: 'indoor',
                  shape: 'square',
                  features: [],
                  isActive: true,
                  notes: ''
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Table
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Square className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tables</p>
              <p className="text-2xl font-semibold text-gray-800">{tables.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-800">
                {tables.filter(t => t.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-semibold text-gray-800">
                {tables.filter(t => !t.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Capacity</p>
              <p className="text-2xl font-semibold text-gray-800">
                {tables.length > 0 
                  ? Math.round(tables.reduce((sum, t) => sum + t.capacity, 0) / tables.length) 
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredTables.map((table) => (
            <div 
              key={table._id} 
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                table.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Table {table.tableNumber}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{table.capacity} seats</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(table)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(table)}
                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                    title="Edit Table"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(table._id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete Table"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getLocationColor(table.location)}`}>
                    {table.location}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shape:</span>
                  <div className="flex items-center">
                    {getShapeIcon(table.shape)}
                    <span className="ml-1 text-sm text-gray-600 capitalize">{table.shape}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    table.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {table.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {table.features && table.features.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-1">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {table.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {feature.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {table.notes && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600">Notes:</div>
                    <p className="text-sm text-gray-700 line-clamp-2">{table.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredTables.length === 0 && (
          <div className="text-center py-12">
            <Square className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tables</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No tables match your search.' : 'No tables found in the system.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal for View/Edit Table */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {isEditing ? 'Edit Table' : 'Create New Table'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

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
                  />
                </div>

                {currentTable && !isEditing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Table ID
                      </label>
                      <p className="text-gray-900 font-mono text-sm">{currentTable._id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created At
                      </label>
                      <p className="text-gray-900">
                        {currentTable.createdAt ? new Date(currentTable.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Updated At
                      </label>
                      <p className="text-gray-900">
                        {currentTable.updatedAt ? new Date(currentTable.updatedAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {isEditing ? 'Update Table' : 'Create Table'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;