import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Calendar, Clock, Users, Bed, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { 
  getAllBookings, 
  getBookingStats, 
  getBookingById, 
  updateBooking, 
  deleteBooking, 
  createBooking,
  getBookingsByDateRange
} from '../../utils/Api';
import BookingModal from '../../common/modals/BookingModal';
import ConfirmationModal from '../../common/modals/ConfirmationModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bookingData, setBookingData] = useState({});
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    checkedIn: 0,
    checkedOut: 0
  });
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByDateRange = async () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      fetchBookings();
      return;
    }
    
    try {
      setLoading(true);
      const response = await getBookingsByDateRange({
        startDate: dateFilter.startDate,
        endDate: dateFilter.endDate
      });
      setBookings(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings by date range:', err);
      setError('Failed to fetch bookings for the selected date range.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getBookingStats();
      setStats(response.data.data || {
        totalBookings: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        checkedIn: 0,
        checkedOut: 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    fetchBookingsByDateRange();
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
    fetchBookings();
  };

  const filteredBookings = bookings.filter(booking =>
    booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof booking.roomId === 'object' && booking.roomId ? 
      booking.roomId.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomId._id?.toLowerCase().includes(searchTerm.toLowerCase())
      : booking.roomId?.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    booking.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.guestPhone?.includes(searchTerm)
  );

  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setBookingData(booking);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (booking) => {
    setCurrentBooking(booking);
    setBookingData(booking);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDelete = (booking) => {
    setCurrentBooking(booking);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBooking(currentBooking._id);
      fetchBookings();
      fetchStats();
      setShowDeleteModal(false);
      setCurrentBooking(null);
    } catch (err) {
      setError('Failed to delete booking. Please try again.');
    }
  };

  const handleSave = async (data) => {
    try {
      if (isEditing) {
        await updateBooking(currentBooking._id, data);
      } else {
        await createBooking(data);
      }
      setShowModal(false);
      setCurrentBooking(null);
      setBookingData({});
      fetchBookings();
      fetchStats();
    } catch (err) {
      setError('Failed to save booking. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      checked_in: 'bg-purple-100 text-purple-800',
      checked_out: 'bg-indigo-100 text-indigo-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      checked_in: <Bed className="h-4 w-4" />,
      checked_out: <CheckCircle className="h-4 w-4" />,
      no_show: <XCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
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
            <p className="text-gray-600 mt-1">Manage hotel bookings and reservations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentBooking(null);
                setBookingData({
                  roomId: '',
                  checkInDate: '',
                  checkOutDate: '',
                  numberOfGuests: 1,
                  guestName: '',
                  guestEmail: '',
                  guestPhone: '',
                  specialRequests: '',
                  status: 'pending'
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

      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={applyDateFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={clearDateFilter}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="text-lg font-semibold text-gray-800">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Confirmed</p>
              <p className="text-lg font-semibold text-gray-800">{stats.confirmed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Pending</p>
              <p className="text-lg font-semibold text-gray-800">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Bed className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Checked In</p>
              <p className="text-lg font-semibold text-gray-800">{stats.checkedIn}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Checked Out</p>
              <p className="text-lg font-semibold text-gray-800">{stats.checkedOut}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Cancelled</p>
              <p className="text-lg font-semibold text-gray-800">{stats.cancelled}</p>
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
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room & Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
                      {booking.guestName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.guestEmail}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.guestPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {typeof booking.roomId === 'object' && booking.roomId 
                        ? `Room ${booking.roomId.roomNumber || booking.roomId._id}`
                        : `Room ${booking.roomId || 'N/A'}`}
                    </div>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{booking.numberOfGuests}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      <span className="mr-1">
                        {getStatusIcon(booking.status)}
                      </span>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        ₹{booking.totalPrice?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
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
                        onClick={() => handleDelete(booking)}
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        bookingData={bookingData}
        isEditing={isEditing}
        title={isEditing ? "Edit Booking" : "Create New Booking"}
        bookingType="hotel"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Booking"
        message={`Are you sure you want to delete the booking for ${currentBooking?.guestName}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Bookings;