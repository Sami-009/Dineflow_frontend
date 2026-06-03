// CartDrawer.jsx
import React, { useEffect, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartDrawer = ({ isOpen, onClose, onCheckout, onContinueShopping }) => {
  const { cartItems } = useCart();
  const [renderDrawer, setRenderDrawer] = useState(isOpen);
  const [drawerVisible, setDrawerVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRenderDrawer(true);
      requestAnimationFrame(() => setDrawerVisible(true));
      return;
    }
    setDrawerVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isOpen]);

  if (!renderDrawer) {
    return null;
  }

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setRenderDrawer(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end overflow-hidden"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        className={`relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-[380px] ${
          drawerVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(event) => event.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm shadow-orange-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
              <p className="text-sm text-gray-500">
                {cartItems.length > 0
                  ? `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart.`
                  : 'Start adding fresh dishes now.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {cartItems.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <div className="mb-4 rounded-full bg-orange-100 p-4 text-orange-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Your cart is empty</h4>
              <p className="mt-2 text-sm text-gray-500">
                Add delicious items from the menu to start your order.
              </p>
              <button
                type="button"
                onClick={onContinueShopping}
                className="mt-6 inline-flex items-center justify-center rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-500 shadow-sm shadow-orange-500/10 transition hover:bg-orange-50"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-5">
          <CartSummary onCheckout={onCheckout} />
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
