import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', text }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin`} />
      {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
