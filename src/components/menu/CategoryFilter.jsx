// CategoryFilter.jsx
import React from 'react';

export const CategoryFilter = ({ categories = [], selected, onSelect }) => {
  // Ensure 'All' is the first category in the filter tabs
  const list = ['All', ...categories.filter((cat) => cat !== 'All')];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0">
      {list.map((category) => {
        const isSelected = selected === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all-300 border ${
              isSelected
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/10'
                : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
