import React, { useState, useEffect } from 'react';
import { X, Printer, IndianRupee, User, Calendar, Receipt, Edit3 } from 'lucide-react';
import { generateBill, updateOrder } from '../../utils/Api';
import ConfirmationModal from './ConfirmationModal';

const BillModal = ({ isOpen, onClose, orderId, billData }) => {
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    paymentReference: ''
  });

  useEffect(() => {
    if (isOpen && orderId) {
      fetchBillDetails();
    }
  }, [isOpen, orderId]);

  const fetchBillDetails = async () => {
    try {
      setLoading(true);
      const response = await generateBill(orderId);
      setBillDetails(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bill:', err);
      setError('Failed to load bill details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('bill-print-content');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Refresh to restore original content
  };

  const handlePaymentUpdate = async () => {
    try {
      await updateOrder(orderId, paymentData);
      setShowPaymentModal(false);
      fetchBillDetails(); // Refresh bill details
    } catch (err) {
      setError('Failed to update payment status');
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading bill...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Error</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!billDetails) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Order Bill</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Update Payment
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Bill Content for Printing */}
            <div id="bill-print-content" className="hidden">
              <div className="p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">PATIL ASSOCIATES</h1>
                  <p className="text-gray-600">Restaurant & Bar</p>
                  <p className="text-sm text-gray-500 mt-2">123 Restaurant Street, City, State 123456</p>
                  <p className="text-sm text-gray-500">Phone: +91 98765 43210</p>
                </div>

                <div className="border-t border-b border-gray-300 py-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Bill Number:</p>
                      <p className="font-semibold">{billDetails.billNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date:</p>
                      <p className="font-semibold">{new Date(billDetails.billDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer:</p>
                      <p className="font-semibold">{billDetails.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Table:</p>
                      <p className="font-semibold">{billDetails.tableNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billDetails.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-2">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                          </td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">₹{item.unitPrice}</td>
                          <td className="text-right py-2 font-medium">₹{item.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="grid grid-cols-2 gap-4 max-w-xs ml-auto">
                    <div className="text-gray-600">Subtotal:</div>
                    <div className="text-right font-medium">₹{billDetails.calculations.subtotal}</div>
                    
                    {billDetails.calculations.discountAmount > 0 && (
                      <>
                        <div className="text-gray-600">
                          Discount ({billDetails.calculations.discountPercentage}%):
                        </div>
                        <div className="text-right text-red-600">-₹{billDetails.calculations.discountAmount}</div>
                      </>
                    )}
                    
                    <div className="text-gray-600">
                      GST ({billDetails.calculations.gstPercentage}%):
                    </div>
                    <div className="text-right font-medium">₹{billDetails.calculations.gstAmount}</div>
                    
                    <div className="text-lg font-bold text-gray-800 border-t border-gray-300 pt-2 mt-2">
                      Total Amount:
                    </div>
                    <div className="text-lg font-bold text-gray-800 text-right border-t border-gray-300 pt-2 mt-2">
                      ₹{billDetails.calculations.totalAmount}
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>Thank you for dining with us!</p>
                  <p>Visit again soon.</p>
                </div>
              </div>
            </div>

            {/* Bill Display for Screen */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">PATIL ASSOCIATES</h1>
                <p className="text-gray-600">Restaurant & Bar</p>
                <p className="text-sm text-gray-500 mt-2">123 Restaurant Street, City, State 123456</p>
                <p className="text-sm text-gray-500">Phone: +91 98765 43210</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Receipt className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Bill Number</p>
                      <p className="font-semibold">{billDetails.billNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{new Date(billDetails.billDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold">{billDetails.customer.name}</p>
                      <p className="text-sm text-gray-500">{billDetails.customer.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Table/Party</p>
                      <p className="font-semibold">Table {billDetails.tableNumber || 'N/A'} - {billDetails.partySize} people</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {billDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.quantity} × ₹{item.unitPrice}</div>
                        <div className="text-sm text-gray-600">Total: ₹{item.totalPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 max-w-xs ml-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{billDetails.calculations.subtotal}</span>
                  </div>
                  
                  {billDetails.calculations.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Discount ({billDetails.calculations.discountPercentage}%):
                      </span>
                      <span className="text-red-600">-₹{billDetails.calculations.discountAmount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      GST ({billDetails.calculations.gstPercentage}%):
                    </span>
                    <span className="font-medium">₹{billDetails.calculations.gstAmount}</span>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                    <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-800">₹{billDetails.calculations.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    billDetails.payment.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {billDetails.payment.status === 'paid' ? '✓ Paid' : '● Pending'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Generated by: {billDetails.generatedBy}
                </div>
              </div>
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
    </>
  );
};

export default BillModal;