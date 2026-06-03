// CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CustomerLayout from '../../components/layout/CustomerLayout';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export const CartPage = () => {
  const { cartItems, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      // Redirect to login page and return to checkout afterwards
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  const handleGoToMenu = () => {
    navigate('/menu');
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-150">
          <button
            onClick={handleGoToMenu}
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </button>
          
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <span>Your Cart</span>
          </h2>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <EmptyState
            message="Your shopping cart is currently empty. Explore our delicious categories to add something tasty!"
            actionLabel="Explore Menu"
            onAction={handleGoToMenu}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
                <span>Items Details</span>
                <span>Actions</span>
              </div>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 border border-gray-250 text-xs font-semibold text-gray-500 rounded-xl hover:bg-gray-100 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CartPage;
