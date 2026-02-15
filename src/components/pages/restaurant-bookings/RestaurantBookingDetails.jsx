import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, MapPin, CreditCard, User, Mail, Phone, Utensils, FileText, CheckCircle, XCircle, Clock as ClockIcon, Edit, Save, X } from 'lucide-react';
import { getRestaurantBookingById, updateRestaurantBooking } from '../../utils/Api';

const RestaurantBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await getRestaurantBookingById(id);
      console.log('Booking data:', response.data.data);
      setBooking(response.data.data);
      setEditForm({
        partySize: response.data.data.partySize,
        bookingDate: response.data.data.bookingDate,
        bookingTime: response.data.data.bookingTime,
        specialRequests: response.data.data.specialRequests || '',
        status: response.data.data.status,
        tableNumber: response.data.data.tableNumber || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'checked_in':
        return <User className="h-4 w-4" />;
      case 'checked_out':
        return <User className="h-4 w-4" />;
      case 'no_show':
        return <XCircle className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    setEditForm({
      partySize: booking.partySize,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      specialRequests: booking.specialRequests || '',
      status: booking.status,
      tableNumber: booking.tableNumber || ''
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateRestaurantBooking(id, editForm);
      console.log('Update response:', response.data);
      setBooking(response.data.data);
      setIsEditing(false);
      // Show success message
      alert('Booking updated successfully!');
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
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
          onClick={fetchBookingDetails}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Booking not found</h3>
        <p className="text-gray-500 mt-1">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div>
              <p className="text-gray-600 mt-1">Booking ID: {booking._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="ml-1 capitalize">{booking.status}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Party Size</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.partySize}
                    onChange={(e) => handleInputChange('partySize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                ) : (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.partySize} guests</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Booking Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.bookingDate ? new Date(editForm.bookingDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Booking Time</label>
                {isEditing ? (
                  <input
                    type="time"
                    value={editForm.bookingTime}
                    onChange={(e) => handleInputChange('bookingTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.bookingTime}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Table Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.tableNumber}
                    onChange={(e) => handleInputChange('tableNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Table number"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.tableNumber || 'Not assigned'}</span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
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
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Special Requests</label>
              {isEditing ? (
                <textarea
                  value={editForm.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Special requests or notes"
                />
              ) : (
                <div className="text-gray-900 min-h-[40px]">
                  {booking.specialRequests || 'None'}
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          {booking.orderDetails && booking.orderDetails.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
              <div className="space-y-3">
                {booking.orderDetails.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">{order.itemName}</div>
                        <div className="text-sm text-gray-500">{order.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">Qty: {order.quantity}</div>
                      <div className="text-sm text-gray-500">₹{order.price * order.quantity}</div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{booking.totalAmount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table Details */}
          {booking.tableDetails && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Table Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Table Number</label>
                  <div className="text-gray-900">{booking.tableDetails.tableNumber}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Capacity</label>
                  <div className="text-gray-900">{booking.tableDetails.capacity} guests</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <div className="text-gray-900 capitalize">{booking.tableDetails.location}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Shape</label>
                  <div className="text-gray-900 capitalize">{booking.tableDetails.shape}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                  <div className="text-gray-900">{booking.tableDetails.notes || 'No additional notes'}</div>
                </div>
              </div>
              {booking.tableDetails.features && booking.tableDetails.features.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Features</label>
                  <div className="flex flex-wrap gap-2">
                    {booking.tableDetails.features.map((feature, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {feature.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.tableDetails.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {booking.tableDetails.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
            {booking.customerId ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.customerId.fullName}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.customerId.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.customerId.phoneNo}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.customerName}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.customerEmail}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.customerPhone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Metadata */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Metadata</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Booking Type</label>
                <div className="text-gray-900 capitalize">{booking.bookingType || 'table'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <div className="text-gray-900">{new Date(booking.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                <div className="text-gray-900">{new Date(booking.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Database ID</label>
                <div className="text-gray-900 font-mono text-sm">{booking._id}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Version</label>
                <div className="text-gray-900">{booking.__v || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBookingDetails;