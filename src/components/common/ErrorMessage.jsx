// ErrorMessage.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message }) => {
  return (
    <div className="mx-auto max-w-2xl my-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 shadow-sm shadow-red-500/5">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-sm font-semibold text-red-800">
          Something went wrong
        </h3>
        <p className="mt-1 text-sm text-red-700 leading-relaxed">
          {message || 'An unexpected error occurred. Please try again later.'}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
