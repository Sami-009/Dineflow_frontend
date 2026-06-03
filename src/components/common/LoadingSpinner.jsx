// LoadingSpinner.jsx
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-6">
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="h-16 w-16 rounded-full border-4 border-orange-100 animate-pulse"></div>
        {/* Spinning arc */}
        <div className="absolute h-16 w-16 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        Preparing delicious details...
      </p>
    </div>
  );
};

export default LoadingSpinner;
