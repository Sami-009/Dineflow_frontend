// OrderConfirmationPage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { formatCurrency } from '../../utils/formatCurrency';
import { CheckCircle2, ShoppingBag, ArrowRight, ClipboardCheck } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const items = location.state?.items;

  useEffect(() => {
    // If navigation state doesn't contain order data, redirect to menu page
    if (!order) {
      navigate('/menu', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto py-8">
        {/* Success Card Header */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-900">Order Placed Successfully!</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              Thank you for ordering with DineFlow. Your order has been registered and is being prepared in the kitchen.
            </p>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-xl text-xs font-semibold">
            <span>Reference Code:</span>
            <span className="text-gray-900 font-extrabold">#DF-ORD-{order.id}</span>
          </div>

          {/* Receipt details */}
          <div className="border-t border-gray-50 pt-6 text-left space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Summary Receipt
            </h4>
            
            <div className="divide-y divide-gray-50 bg-gray-50/50 rounded-xl px-4 py-2 border border-gray-50">
              {items && items.map((item, idx) => (
                <div key={item.id || idx} className="flex justify-between py-2 text-sm">
                  <span className="font-semibold text-gray-800">
                    {item.name} <span className="text-xs text-gray-400 font-normal">x{item.quantity}</span>
                  </span>
                  <span className="font-bold text-gray-700">
                    {formatCurrency(parseFloat(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm pt-2 text-gray-500">
              <span>Payment Channel:</span>
              <span className="font-semibold text-gray-800">{order.payment_method}</span>
            </div>
            
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
              <span>Total Paid:</span>
              <span className="text-orange-500 text-lg">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="border-t border-gray-50 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/my-orders"
              className="inline-flex items-center justify-center space-x-1.5 px-5 py-3 border border-orange-200 text-sm font-semibold text-orange-600 rounded-xl hover:bg-orange-50/30 transition-colors"
            >
              <ClipboardCheck className="h-4.5 w-4.5" />
              <span>Track in My Orders</span>
            </Link>

            <Link
              to="/menu"
              className="inline-flex items-center justify-center space-x-1.5 px-5 py-3 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/10"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span>Browse Menu Again</span>
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default OrderConfirmationPage;
