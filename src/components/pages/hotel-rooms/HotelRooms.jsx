import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Building, Users, DollarSign, Star, Check, X } from 'lucide-react';
import { 
  getAllHotelRooms, 
  getHotelRoomStats, 
  getHotelRoomById, 
  updateHotelRoom, 
  deleteHotelRoom, 
  createHotelRoom 
} from '../../utils/Api';
import RoomModal from '../../common/modals/RoomModal';
import ConfirmationModal from '../../common/modals/ConfirmationModal';

const HotelRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [roomData, setRoomData] = useState({});
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeRooms: 0,
    inactiveRooms: 0,
    avgPrice: 0
  });

  useEffect(() => {
    fetchRooms();
    fetchStats();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getAllHotelRooms();
      setRooms(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to fetch rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getHotelRoomStats();
      setStats(response.data.data || {
        totalRooms: 0,
        activeRooms: 0,
        inactiveRooms: 0,
        avgPrice: 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRooms = rooms.filter(room =>
    room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.viewType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (room) => {
    setCurrentRoom(room);
    setRoomData(room);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (room) => {
    setCurrentRoom(room);
    setRoomData(room);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDelete = (room) => {
    setCurrentRoom(room);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteHotelRoom(currentRoom._id);
      fetchRooms();
      fetchStats();
      setShowDeleteModal(false);
      setCurrentRoom(null);
    } catch (err) {
      setError('Failed to delete room. Please try again.');
    }
  };

  const handleSave = async (data) => {
    try {
      if (isEditing) {
        await updateHotelRoom(currentRoom._id, data);
      } else {
        await createHotelRoom(data);
      }
      setShowModal(false);
      setCurrentRoom(null);
      setRoomData({});
      fetchRooms();
      fetchStats();
    } catch (err) {
      setError('Failed to save room. Please try again.');
    }
  };

  const getRoomTypeColor = (roomType) => {
    const colors = {
      single: 'bg-blue-100 text-blue-800',
      double: 'bg-green-100 text-green-800',
      twin: 'bg-yellow-100 text-yellow-800',
      suite: 'bg-purple-100 text-purple-800',
      deluxe: 'bg-indigo-100 text-indigo-800',
      family: 'bg-pink-100 text-pink-800',
      presidential: 'bg-red-100 text-red-800'
    };
    return colors[roomType] || 'bg-gray-100 text-gray-800';
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: '📶',
      ac: '❄️',
      mini_bar: '🍸',
      balcony: '🪟',
      tv: '📺',
      safe: '🔒',
      kitchenette: '🍳',
      private_bathroom: '🛁'
    };
    return icons[amenity] || '⭐';
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
            <p className="text-gray-600 mt-1">Manage hotel rooms and accommodations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentRoom(null);
                setRoomData({
                  roomNumber: '',
                  roomType: 'single',
                  floor: 1,
                  capacity: 1,
                  pricePerNight: '',
                  viewType: 'none',
                  bedType: 'single',
                  size: '',
                  description: '',
                  isActive: true,
                  amenities: []
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Room
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalRooms}</p>
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
              <p className="text-2xl font-semibold text-gray-800">{stats.activeRooms}</p>
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
              <p className="text-2xl font-semibold text-gray-800">{stats.inactiveRooms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
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

      {/* Rooms Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredRooms.map((room) => (
            <div 
              key={room._id} 
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                room.isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Room {room.roomNumber}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoomTypeColor(room.roomType)}`}>
                      {room.roomType}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(room)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(room)}
                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                    title="Edit Room"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete Room"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Floor:</span>
                  <span className="text-sm font-medium text-gray-800">{room.floor}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{room.capacity}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price/Night:</span>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-800">₹{room.pricePerNight?.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    room.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {room.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {room.viewType && room.viewType !== 'none' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">View:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600 capitalize">{room.viewType.replace('_', ' ')}</span>
                    </div>
                  </div>
                )}
                
                {room.amenities && room.amenities.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-1">Amenities:</div>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 4).map((amenity, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center"
                          title={amenity.replace('_', ' ')}
                        >
                          {getAmenityIcon(amenity)}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{room.amenities.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {room.description && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600">Description:</div>
                    <p className="text-sm text-gray-700 line-clamp-2">{room.description.substring(0, 60)}...</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No rooms match your search.' : 'No rooms found in the system.'}
            </p>
          </div>
        )}
      </div>

      {/* Room Modal */}
      <RoomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        roomData={roomData}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Room"
        message={`Are you sure you want to delete room ${currentRoom?.roomNumber}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default HotelRooms;