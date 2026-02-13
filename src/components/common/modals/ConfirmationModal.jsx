import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Yes, Confirm', 
  cancelText = 'Cancel',
  variant = 'default' // 'default', 'danger', 'warning'
}) => {
  if (!isOpen) return null;

  // Define color variants
  const variantStyles = {
    default: {
      confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: 'text-blue-500'
    },
    danger: {
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-500'
    },
    warning: {
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      icon: 'text-yellow-500'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <svg 
              className={`h-6 w-6 ${currentVariant.icon}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
            {title}
          </h3>
          
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
          
          <div className="mt-6 flex justify-center space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentVariant.confirmButton}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;