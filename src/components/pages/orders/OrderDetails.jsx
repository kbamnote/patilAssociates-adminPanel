import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, IndianRupee, Receipt, Clock, CheckCircle, Printer, Edit3 } from 'lucide-react';
import { getOrderById, updateOrder } from '../../utils/Api';
import ConfirmationModal from '../../common/modals/ConfirmationModal';
import EditOrderModal from '../../common/modals/EditOrderModal';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    paymentReference: ''
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(id);
      setOrder(response.data.data);
      setPaymentData({
        paymentStatus: response.data.data.paymentStatus || 'pending',
        paymentMethod: response.data.data.paymentMethod || 'cash',
        paymentReference: response.data.data.paymentReference || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async () => {
    try {
      await updateOrder(id, paymentData);
      setShowPaymentModal(false);
      fetchOrderDetails(); // Refresh order details
    } catch (err) {
      setError('Failed to update payment status');
    }
  };

  const handleUpdateOrder = async (updateData) => {
    try {
      setUpdateLoading(true);
      await updateOrder(id, updateData);
      setShowEditModal(false);
      fetchOrderDetails(); // Refresh order details
    } catch (err) {
      setError(`Failed to update order: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      paid: <CheckCircle className="h-4 w-4" />,
      cancelled: <Clock className="h-4 w-4" />,
      refunded: <Clock className="h-4 w-4" />
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

  if (error || !order) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
        <p className="text-gray-500 mb-6">{error || 'The requested order could not be found.'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Orders
        </button>
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
              onClick={() => navigate('/orders')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
              <p className="text-gray-600">View and manage order #{order.billNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Order
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Update Payment
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                <p className="text-gray-800 font-medium">{order.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-800">{order.customerEmail || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                <p className="text-gray-800">{order.customerPhone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Table Number</label>
                <p className="text-gray-800">{order.tableNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Party Size</label>
                <p className="text-gray-800">{order.partySize || 'N/A'} people</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Booking ID</label>
                <p className="text-gray-800 font-mono">{order.bookingId}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.itemName}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                    {item.dietaryOptions && item.dietaryOptions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.dietaryOptions.map((option, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {option}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{item.quantity} × ₹{item.unitPrice}</p>
                    <p className="text-sm text-gray-600">Total: ₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount ({order.discountPercentage || 0}%):</span>
                  <span className="text-red-600">-₹{order.discountAmount?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST ({order.gstPercentage || 18}%):</span>
                  <span className="font-medium">₹{order.gstAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-lg font-bold text-gray-800">₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Bill Number</label>
                  <p className="text-gray-800 font-medium">{order.billNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Bill Date</label>
                  <p className="text-gray-800">{new Date(order.billDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Payment Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {getPaymentStatusIcon(order.paymentStatus)}
                    <span className="ml-1 capitalize">{order.paymentStatus}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Payment Method</label>
                  <p className="text-gray-800 capitalize">{order.paymentMethod || 'Not specified'}</p>
                </div>
                {order.paymentReference && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Payment Reference</label>
                    <p className="text-gray-800 font-mono">{order.paymentReference}</p>
                  </div>
                )}
              </div>
            </div>
            {order.billNotes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{order.billNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Payment Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Status</h3>
            <div className="text-center">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {getPaymentStatusIcon(order.paymentStatus)}
                <span className="ml-2 capitalize">{order.paymentStatus}</span>
              </span>
              <div className="mt-4">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Order Created</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Receipt className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Bill Generated</p>
                  <p className="text-sm text-gray-500">{new Date(order.billDate).toLocaleString()}</p>
                </div>
              </div>
              {order.updatedAt && order.updatedAt !== order.createdAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Edit3 className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">Last Updated</p>
                    <p className="text-sm text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Staff Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Staff Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
                <p className="text-gray-800">{order.createdBy?.fullName || 'Unknown'}</p>
              </div>
              {order.updatedBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated By</label>
                  <p className="text-gray-800">{order.updatedBy?.fullName || 'Unknown'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Update Modal */}
      <ConfirmationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentUpdate}
        title="Update Payment Status"
        confirmText="Update Payment"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              value={paymentData.paymentStatus}
              onChange={(e) => setPaymentData({...paymentData, paymentStatus: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
            <input
              type="text"
              value={paymentData.paymentReference}
              onChange={(e) => setPaymentData({...paymentData, paymentReference: e.target.value})}
              placeholder="Transaction ID or reference number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </ConfirmationModal>

      {/* Edit Order Modal */}
      <EditOrderModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        order={order}
        onUpdate={handleUpdateOrder}
        loading={updateLoading}
      />
    </div>
  );
};

export default OrderDetails;