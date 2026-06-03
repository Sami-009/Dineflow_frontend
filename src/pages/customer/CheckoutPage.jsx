// CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrder } from '../../services/orderService';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowLeft, Wallet, CreditCard, ShoppingBag, ShieldAlert } from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token, isLoggedIn, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryCity, setDeliveryCity] = useState(user?.city || '');
  const [deliveryLatitude, setDeliveryLatitude] = useState(user?.latitude || '');
  const [deliveryLongitude, setDeliveryLongitude] = useState(user?.longitude || '');
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  // Guard route in code as well
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    } else if (cartItems.length === 0) {
      navigate('/menu', { replace: true });
    }
  }, [isLoggedIn, cartItems, navigate]);

  useEffect(() => {
    if (user) {
      setDeliveryAddress(user.address || '');
      setDeliveryCity(user.city || '');
      setDeliveryLatitude(user.latitude || '');
      setDeliveryLongitude(user.longitude || '');
    }
  }, [user]);

  const validateDelivery = () => {
    const newErrors = {};
    if (!deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required.';
    }
    if (!deliveryCity.trim()) {
      newErrors.deliveryCity = 'City is required.';
    }
    setDeliveryErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) return;
    if (!validateDelivery()) return;

    setLoading(true);
    setErrorMessage('');
    
    // Prepare items payload format expected by the backend
    const itemsPayload = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await placeOrder(
        {
          items: itemsPayload,
          payment_method: paymentMethod,
          delivery_address: deliveryAddress,
          delivery_city: deliveryCity,
          delivery_latitude: deliveryLatitude || null,
          delivery_longitude: deliveryLongitude || null,
        },
        token
      );
      
      // Copy cart items snapshot for confirmation details display before clearing
      const cartSnapshot = [...cartItems];
      
      // Clear shopping cart state
      clearCart();
      
      // Redirect to confirmation screen passing order details
      navigate('/confirmation', {
        state: {
          order: response.order || { id: response.order_id, total_amount: response.total_amount, payment_method: paymentMethod, status: 'Pending', created_at: new Date().toISOString() },
          items: cartSnapshot,
        },
        replace: true
      });
    } catch (err) {
      console.error('Order checkout placement failed:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Please review your server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-2 pb-4 border-b border-gray-150">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-extrabold text-gray-900">Checkout</h2>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-red-700 text-xs font-medium">
            <ShieldAlert className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left panel: Summary & Payments */}
          <div className="md:col-span-3 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Delivery Details</h3>
                <p className="text-xs text-gray-500">Pre-filled from your account. Edit before placing the order.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Delivery Address</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      if (deliveryErrors.deliveryAddress) {
                        setDeliveryErrors((prev) => ({ ...prev, deliveryAddress: '' }));
                      }
                    }}
                    rows={3}
                    placeholder="e.g. 123 Maple Street, Apt 4B"
                    className={`block w-full pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${
                      deliveryErrors.deliveryAddress
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                        : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                    }`}
                  />
                  {deliveryErrors.deliveryAddress && <p className="mt-1 text-xs text-red-600">{deliveryErrors.deliveryAddress}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City</label>
                  <input
                    value={deliveryCity}
                    onChange={(e) => {
                      setDeliveryCity(e.target.value);
                      if (deliveryErrors.deliveryCity) {
                        setDeliveryErrors((prev) => ({ ...prev, deliveryCity: '' }));
                      }
                    }}
                    type="text"
                    placeholder="e.g. Foodtown"
                    className={`block w-full pl-3 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${
                      deliveryErrors.deliveryCity
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                        : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                    }`}
                  />
                  {deliveryErrors.deliveryCity && <p className="mt-1 text-xs text-red-600">{deliveryErrors.deliveryCity}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Select Payment Method</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash option */}
                <label
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'Cash'
                      ? 'border-orange-500 bg-orange-50/20 ring-2 ring-orange-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'Cash' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-gray-800">Cash on Delivery</span>
                      <span className="text-[10px] text-gray-400">Pay cash upon delivery</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="Cash"
                    checked={paymentMethod === 'Cash'}
                    onChange={() => setPaymentMethod('Cash')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                </label>

                {/* Card option */}
                <label
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'Card'
                      ? 'border-orange-500 bg-orange-50/20 ring-2 ring-orange-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'Card' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-gray-800">Credit / Debit Card</span>
                      <span className="text-[10px] text-gray-400">Pay via credit processor</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                </label>
              </div>
            </div>
            
            {/* Confirm order button */}
            <button
              onClick={handleConfirmOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all rounded-xl shadow-md shadow-orange-500/10 active:scale-98"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Placing order...</span>
                </span>
              ) : (
                <span>Confirm Order ({formatCurrency(cartTotal)})</span>
              )}
            </button>
          </div>

          {/* Right panel: Sticky Basket details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-1.5 pb-2 border-b border-gray-55">
                <ShoppingBag className="h-4.5 w-4.5 text-orange-500" />
                <span>Order Basket</span>
              </h3>

              <div className="divide-y divide-gray-50 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-3 text-sm">
                    <div className="flex flex-col pr-4 min-w-0">
                      <span className="font-semibold text-gray-800 truncate">{item.name}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Quantity: x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900 flex-shrink-0">
                      {formatCurrency(parseFloat(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-50">
                  <span>Grand Total</span>
                  <span className="text-orange-500 text-base">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CheckoutPage;
