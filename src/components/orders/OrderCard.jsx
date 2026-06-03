// OrderCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { cancelOrder } from '../../services/orderService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import OrderStatusStepper from './OrderStatusStepper';
import FeedbackForm from './FeedbackForm';
import { Calendar, CreditCard, DollarSign, Star } from 'lucide-react';

export const OrderCard = ({ order, onOrderChange }) => {
  const { token } = useAuth();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [feedback, setFeedback] = useState(order.feedback?.[0] || null);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Preparing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleCancel = async () => {
    setCancelError(null);
    setCancelling(true);
    try {
      await cancelOrder(order.id, token);
      onOrderChange?.();
    } catch (err) {
      console.error('Cancel order failed:', err);
      setCancelError(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = ['Pending', 'Preparing'].includes(order.status);
  const showFeedbackForm = order.status === 'Completed' && !feedback;
  const hasFeedback = Boolean(feedback);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
      {/* Top Details */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-50 gap-4">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Order Reference
          </span>
          <h4 className="text-base font-extrabold text-gray-900">#DF-ORD-{order.id}</h4>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatDate(order.created_at)}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            {order.payment_method === 'Card' ? (
              <CreditCard className="h-4 w-4 text-gray-400" />
            ) : (
              <DollarSign className="h-4 w-4 text-gray-400" />
            )}
            <span>Paid via {order.payment_method}</span>
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Items Ordered</h5>
        <div className="divide-y divide-gray-50 bg-gray-50/50 rounded-xl px-4 py-2 border border-gray-50">
          {order.items && order.items.map((item, idx) => (
            <div key={item.id || idx} className="flex items-center justify-between py-2.5 text-sm">
              <span className="font-semibold text-gray-800">
                {item.name || 'Menu Item'} <span className="text-xs text-gray-400 font-normal">x{item.quantity}</span>
              </span>
              <span className="font-bold text-gray-700">
                {formatCurrency(parseFloat(item.unit_price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stepper & Total */}
      <div className="pt-4 border-t border-gray-50 space-y-4">
        <OrderStatusStepper status={order.status} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status:</span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getStatusStyle(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 font-semibold block leading-none">Total Amount</span>
            <span className="text-base font-extrabold text-orange-500 mt-1 block">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>

        {canCancel && (
          <div className="pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
            {cancelError && <p className="mt-2 text-sm text-red-600">{cancelError}</p>}
          </div>
        )}

        {hasFeedback && (
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <h6 className="text-sm font-bold text-gray-900">Your Feedback</h6>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-xs uppercase text-gray-400">Rating:</span>
              <span className="inline-flex items-center gap-1">
                {Array.from({ length: feedback.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </div>
            <p className="text-sm text-gray-650 bg-gray-50/60 rounded-xl px-4 py-3 border border-gray-100/50 italic">
              "{feedback.comment || 'No comment provided.'}"
            </p>
          </div>
        )}

        {showFeedbackForm && (
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h6 className="text-sm font-bold text-gray-900">Leave Feedback</h6>
            <FeedbackForm
              order={order}
              token={token}
              onFeedbackSubmitted={(newFeedback) => setFeedback(newFeedback)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
