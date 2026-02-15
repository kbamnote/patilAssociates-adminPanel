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
import DeleteModal from '../../common/modals/DeleteModal';
import TableModal from '../../common/modals/TableModal';

const Tables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);

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
    setIsEditing(true);
    setShowTableModal(true);
  };

  const handleView = (table) => {
    navigate(`/tables/${table._id}`);
  };

  const handleDeleteClick = (table) => {
    setTableToDelete(table);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTable(tableToDelete._id);
      setShowDeleteModal(false);
      setTableToDelete(null);
      fetchTables(); // Refresh the list
    } catch (err) {
      setError('Failed to delete table. Please try again.');
      setShowDeleteModal(false);
    }
  };

  const handleTableSave = async (formData, tableId) => {
    try {
      if (isEditing) {
        await updateTable(tableId, formData);
      } else {
        await createTable(formData);
      }
      setShowTableModal(false);
      setCurrentTable(null);
      fetchTables(); // Refresh the list
    } catch (err) {
      setError('Failed to save table. Please try again.');
    }
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
                setShowTableModal(true);
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
                    onClick={() => handleDeleteClick(table)}
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

      {/* Table Modal */}
      <TableModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        onSave={handleTableSave}
        tableData={currentTable}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Table"
        itemName={tableToDelete ? `Table ${tableToDelete.tableNumber}` : ''}
        confirmText="Delete Table"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Tables;