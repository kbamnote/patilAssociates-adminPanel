import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, MapPin, Users, DollarSign, Star, Ruler, Bed, Wifi, Car, Coffee, Check, X } from 'lucide-react';
import { getHotelRoomById } from '../../utils/Api';

const HotelRoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await getHotelRoomById(id);
      setRoom(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching room details:', err);
      setError('Failed to load room details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi className="h-4 w-4" />,
      ac: <Star className="h-4 w-4" />,
      mini_bar: <Coffee className="h-4 w-4" />,
      balcony: <MapPin className="h-4 w-4" />,
      tv: <Star className="h-4 w-4" />,
      safe: <Star className="h-4 w-4" />,
      kitchenette: <Coffee className="h-4 w-4" />,
      private_bathroom: <Star className="h-4 w-4" />
    };
    return icons[amenity] || <Star className="h-4 w-4" />;
  };

  const getViewTypeColor = (viewType) => {
    const colors = {
      none: 'bg-gray-100 text-gray-800',
      city: 'bg-blue-100 text-blue-800',
      ocean: 'bg-teal-100 text-teal-800',
      mountain: 'bg-green-100 text-green-800',
      garden: 'bg-emerald-100 text-emerald-800',
      pool: 'bg-cyan-100 text-cyan-800'
    };
    return colors[viewType] || 'bg-gray-100 text-gray-800';
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
          onClick={fetchRoomDetails}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Room not found</h3>
        <p className="text-gray-500 mt-1">The room you're looking for doesn't exist or you don't have permission to view it.</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Room Details</h1>
              <p className="text-gray-600 mt-1">Room ID: {room._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${room.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {room.isActive ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
              {room.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {room.isAvailable ? 'Available' : 'Booked'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Room Number</label>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 text-lg font-medium">{room.roomNumber}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Room Type</label>
                <div className="text-gray-900 capitalize">{room.roomType}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Floor</label>
                <div className="text-gray-900">{room.floor}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Capacity</label>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{room.capacity} guests</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Price per Night</label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 text-lg font-medium">₹{room.pricePerNight}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">View Type</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getViewTypeColor(room.viewType)}`}>
                  {room.viewType.replace('_', ' ')}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Bed Type</label>
                <div className="text-gray-900 capitalize">{room.bedType}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Size</label>
                <div className="flex items-center">
                  <Ruler className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{room.size} sq ft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-blue-600 mr-2">
                      {getAmenityIcon(amenity)}
                    </div>
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

          {/* Description */}
          {room.description && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {room.description}
              </div>
            </div>
          )}
        </div>

        {/* Room Images */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Images</h2>
            {room.images && room.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {room.images.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={image} 
                      alt={`Room ${room.roomNumber} - ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No images available</p>
              </div>
            )}
          </div>

          {/* Room Metadata */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Metadata</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <div className="text-gray-900">{new Date(room.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                <div className="text-gray-900">{new Date(room.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Room ID</label>
                <div className="text-gray-900 font-mono text-sm">{room._id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRoomDetails;