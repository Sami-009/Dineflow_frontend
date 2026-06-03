// CartSummary.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export const CartSummary = ({ onCheckout }) => {
  const { cartTotal, cartCount } = useCart();
  const deliveryCharges = 0; // Free delivery for demo purposes
  const finalTotal = cartTotal + deliveryCharges;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-50 flex items-center space-x-2">
        <ShoppingCart className="h-5 w-5 text-orange-500" />
        <span>Order Summary</span>
      </h3>

      <div className="space-y-2.5 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Total Items</span>
          <span className="font-semibold text-gray-800">{cartCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-800">{formatCurrency(cartTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className="text-emerald-600 font-semibold">Free</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-base font-extrabold text-gray-900">
        <span>Grand Total</span>
        <span className="text-orange-500">{formatCurrency(finalTotal)}</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={cartCount === 0}
        className="w-full mt-4 inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all-300 shadow-md shadow-orange-500/10 active:scale-98"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CartSummary;
