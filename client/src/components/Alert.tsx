import React from 'react';
import { X, AlertTriangle, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  title?: string;
  onClose?: () => void;
  closeable?: boolean;
}

const Alert: React.FC<AlertProps> = ({ type, message, title, onClose, closeable = true }) => {
  const typeStyles = {
    success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-4 ${typeStyles[type]}`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <p>{message}</p>
      </div>
      {closeable && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-inherit hover:opacity-70 transition"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Alert;
