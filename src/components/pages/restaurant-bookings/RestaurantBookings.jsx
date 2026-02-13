import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Calendar, Clock, Users, MapPin, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { 
  getAllRestaurants, 
  getRestaurantBookingById, 
  updateRestaurantBooking, 
  deleteRestaurantBooking, 
  createRestaurantBooking 
} from '../../utils/Api';

const RestaurantBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    partySize: 2,
    bookingDate: '',
    bookingTime: '',
    specialRequests: '',
    tableNumber: '',
    status: 'pending',
    customerId: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllRestaurants();
      console.log('Restaurant bookings response:', response.data);
      
      // Ensure we're getting an array of bookings
      const bookingsData = Array.isArray(response.data.data) ? response.data.data : [];
      console.log('Processed bookings data:', bookingsData);
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(`Failed to fetch bookings: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBookings = bookings.filter(booking =>
    booking.partySize?.toString().includes(searchTerm) ||
    booking.bookingDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof booking.customerId === 'object' && booking.customerId
      ? (booking.customerId._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         booking.customerId.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         booking.customerId.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
      : booking.customerId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    booking.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setFormData({
      partySize: booking.partySize,
      bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0],
      bookingTime: booking.bookingTime,
      specialRequests: booking.specialRequests || '',
      tableNumber: booking.tableNumber || '',
      status: booking.status,
      customerId: typeof booking.customerId === 'object' && booking.customerId
        ? booking.customerId._id || booking.customerId.email || ''
        : booking.customerName || booking.customerId || ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (booking) => {
    setCurrentBooking(booking);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteRestaurantBooking(bookingId);
        fetchBookings(); // Refresh the list
      } catch (err) {
        setError('Failed to delete booking. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving booking:', { isEditing, currentBooking, formData });
      
      // Prepare data for API - ensure we're sending the right structure
      const apiData = {
        ...formData,
        partySize: parseInt(formData.partySize),
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        status: formData.status
      };
      
      console.log('API data being sent:', apiData);
      
      if (isEditing) {
        const response = await updateRestaurantBooking(currentBooking._id, apiData);
        console.log('Update response:', response);
      } else {
        await createRestaurantBooking(apiData);
      }
      setShowModal(false);
      setCurrentBooking(null);
      setFormData({
        partySize: 2,
        bookingDate: '',
        bookingTime: '',
        specialRequests: '',
        tableNumber: '',
        status: 'pending',
        customerId: ''
      });
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error saving booking:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(`Failed to save booking: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'checked_in':
        return 'bg-purple-100 text-purple-800';
      case 'checked_out':
        return 'bg-indigo-100 text-indigo-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="bg-white rounded-xl shadow-lg p-6 mt-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-gray-600 mt-1">Manage all restaurant reservations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentBooking(null);
                setFormData({
                  partySize: 2,
                  bookingDate: '',
                  bookingTime: '',
                  specialRequests: '',
                  tableNumber: '',
                  status: 'pending',
                  customerId: ''
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Booking
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-800">{bookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-semibold text-gray-800">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-800">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-semibold text-gray-800">
                {bookings.filter(b => b.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {typeof booking.customerId === 'object' && booking.customerId 
                        ? `${booking.customerId.fullName || booking.customerId.email || booking.customerId._id}`
                        : booking.customerName || booking.customerId || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.tableNumber ? `Table ${booking.tableNumber}` : 'N/A'}
                    </div>
                    {booking.specialRequests && (
                      <div className="text-sm text-gray-500 mt-1">
                        {booking.specialRequests.substring(0, 30)}...
                      </div>
                    )}
                    {(booking.customerEmail || booking.customerPhone) && (
                      <div className="text-sm text-gray-500 mt-1">
                        {booking.customerEmail} • {booking.customerPhone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{booking.partySize}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {booking.bookingTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(booking)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(booking)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Edit Booking"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Booking"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No bookings match your search.' : 'No bookings found in the system.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal for View/Edit Booking */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {isEditing ? 'Edit Booking' : 'Create New Booking'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    name="customerId"
                    value={typeof formData.customerId === 'object' && formData.customerId
                      ? formData.customerId._id || formData.customerId.email || ''
                      : formData.customerId || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Size
                    </label>
                    <input
                      type="number"
                      name="partySize"
                      value={formData.partySize}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="bookingTime"
                      value={formData.bookingTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Any special requests..."
                  />
                </div>

                {currentBooking && !isEditing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Booking ID
                      </label>
                      <p className="text-gray-900 font-mono text-sm">{currentBooking._id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created At
                      </label>
                      <p className="text-gray-900">
                        {currentBooking.createdAt ? new Date(currentBooking.createdAt).toLocaleString() : 'N/A'}
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
                  {isEditing ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantBookings;