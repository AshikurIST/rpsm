import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';
import Loader from './Loader';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  icon: Icon = null
}) => {
  const variants = {
    danger: {
      icon: Trash2,
      confirmBtnClass: 'btn-danger',
      iconClass: 'text-red-600'
    },
    warning: {
      icon: AlertTriangle,
      confirmBtnClass: 'bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg',
      iconClass: 'text-yellow-600'
    },
    primary: {
      icon: AlertTriangle,
      confirmBtnClass: 'btn-primary',
      iconClass: 'text-primary-600'
    }
  };

  const variantConfig = variants[variant] || variants.danger;
  const IconComponent = Icon || variantConfig.icon;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <IconComponent className={`h-6 w-6 ${variantConfig.iconClass}`} />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-500 mb-6">
          {message}
        </p>
        
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`
              ${variantConfig.confirmBtnClass} 
              flex items-center space-x-2 min-w-[100px] justify-center
            `}
          >
            {isLoading ? (
              <Loader size="sm" centered={false} />
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
