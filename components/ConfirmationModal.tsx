import React from 'react';
import { Sheet, Button } from './UI';
import { AlertCircle, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
}) => {
  const icons = {
    danger: { icon: XCircle, color: 'text-pushr-danger' },
    warning: { icon: AlertTriangle, color: 'text-pushr-warning' },
    info: { icon: Info, color: 'text-pushr-blue' },
    success: { icon: CheckCircle2, color: 'text-pushr-success' },
  };

  const Icon = icons[type].icon;
  const iconColor = icons[type].color;

  const buttonVariants = {
    danger: 'danger' as const,
    warning: 'secondary' as const,
    info: 'primary' as const,
    success: 'success' as const,
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center space-y-6 py-4">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
          type === 'danger' ? 'bg-red-100' :
          type === 'warning' ? 'bg-yellow-100' :
          type === 'info' ? 'bg-blue-100' :
          'bg-green-100'
        }`}>
          <Icon className={`${iconColor}`} size={32} />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            fullWidth={false}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariants[type]}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            fullWidth={false}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Sheet>
  );
};

