import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };
  
  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    gray: 'border-gray-600',
  };
  
  return (
    <div className="flex justify-center items-center">
      <div 
        className={`rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${colorClasses[color]} animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner; 