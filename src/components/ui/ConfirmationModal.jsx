// MiniMart AI - Confirmation Modal Component for Important & Destructive Actions

import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed with this business action?',
  confirmText = 'Approve & Proceed',
  cancelText = 'Cancel',
  type = 'warning', // warning, danger, success, info
  loading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 rounded-2xl bg-[#E4F5E9] text-[#1F6B4F] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-[#FEF6E8] text-[#F2A93B] flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonClass = () => {
    if (type === 'danger') {
      return 'bg-red-600 hover:bg-red-700 text-white';
    }
    if (type === 'success') {
      return 'bg-[#1F6B4F] hover:bg-[#16523C] text-white';
    }
    return 'bg-[#1F6B4F] hover:bg-[#16523C] text-white';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={false}>
      <div className="text-center py-2">
        {getIcon()}
        <h3 className="font-display font-bold text-lg text-[#1E2521] mb-2">{title}</h3>
        <p className="text-sm text-[#697A71] leading-relaxed mb-6">{description}</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 btn-outline"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={loading}
            className={`flex-1 btn-primary ${getConfirmButtonClass()}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
