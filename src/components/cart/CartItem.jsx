// CartItem.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus, Minus, Trash2 } from 'lucide-react';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const subtotal = parseFloat(item.price) * item.quantity;

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-x-4">
      {/* Product Image & Info */}
      <div className="flex items-center space-x-4 flex-grow min-w-0">
        <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-grow">
          <h4 className="text-sm font-bold text-gray-900 truncate">
            {item.name}
          </h4>
          <p className="text-xs text-orange-500 font-semibold mt-0.5">
            {formatCurrency(item.price)} each
          </p>
        </div>
      </div>

      {/* Quantity adjustment & Subtotal */}
      <div className="flex items-center space-x-6 flex-shrink-0">
        {/* Quantity control */}
        <div className="flex items-center space-x-2 border border-gray-100 bg-gray-50 p-1 rounded-xl">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-lg text-gray-500 hover:bg-white hover:shadow-sm active:scale-95 transition-all"
            title="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          
          <span className="w-8 text-center text-xs font-bold text-gray-800">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-lg text-gray-500 hover:bg-white hover:shadow-sm active:scale-95 transition-all"
            title="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[80px] hidden sm:block">
          <span className="text-sm font-extrabold text-gray-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all-300"
          title="Remove item"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
