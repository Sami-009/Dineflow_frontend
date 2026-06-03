// StatCard.jsx
import React from 'react';

export const StatCard = ({ label, value, icon: Icon, color = 'orange' }) => {
  const colorMap = {
    orange: 'from-orange-500 to-amber-500 text-orange-600 bg-orange-50',
    blue: 'from-blue-500 to-indigo-500 text-blue-600 bg-blue-50',
    emerald: 'from-emerald-500 to-teal-500 text-emerald-600 bg-emerald-50',
  };

  const scheme = colorMap[color] || colorMap.orange;
  const gradientClass = scheme.split(' ')[0] + ' ' + scheme.split(' ')[1];
  const textClass = scheme.split(' ')[2];
  const bgClass = scheme.split(' ')[3];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-2xl font-extrabold text-gray-900 block">
          {value}
        </span>
      </div>

      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${bgClass} ${textClass}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatCard;
