// MenuCard.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus } from 'lucide-react';

export const MenuCard = ({ item }) => {
  const { addToCart } = useCart();
  
  const isAvailable = item.is_available ?? true;

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(item);
    }
  };

  return (
    <div className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full ${
      !isAvailable ? 'opacity-65 grayscale-[20%] border-red-100/50 shadow-none' : ''
    }`}>
      {/* Product Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={item.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white tracking-wider uppercase shadow-md">
              Currently Unavailable
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100 uppercase tracking-wide">
          {item.category}
        </div>
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm border uppercase tracking-wide ${
          isAvailable
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {isAvailable ? 'Available' : '🔴 Unavailable'}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-gray-955 group-hover:text-orange-500 transition-colors">
          {item.name}
        </h3>
        
        {/* Description & Availability warnings */}
        <div className="mt-1.5 flex-grow flex flex-col justify-between">
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {item.description || 'No description provided.'}
          </p>
          {!isAvailable && (
            <p className="mt-2.5 text-[10px] font-bold text-red-600 bg-red-50/50 p-2 rounded-lg border border-red-100/50">
              Currently Unavailable. This item cannot be ordered right now.
            </p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price</span>
            <span className="text-base font-extrabold text-gray-900">
              {formatCurrency(item.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm ${
              isAvailable
                ? 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-500/10 active:scale-95'
                : 'bg-red-50 border border-red-200 text-red-700 cursor-not-allowed shadow-none'
            }`}
          >
            {isAvailable ? (
              <>
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </>
            ) : (
              <span>Unavailable</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
