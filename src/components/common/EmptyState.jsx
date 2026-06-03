// EmptyState.jsx
import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ message, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="p-4 bg-gray-50 rounded-full text-gray-400 mb-4">
        <Inbox className="h-10 w-10 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        No items found
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
        {message || 'There is nothing to display here right now.'}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all-300 shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
