// OrdersTable.jsx
import React from 'react';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { CreditCard, DollarSign } from 'lucide-react';

export const OrdersTable = ({ orders = [], onStatusChange, onCancel }) => {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Preparing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-250';
    }
  };

  return (
    <div className="overflow-x-auto bg-white border border-gray-150 rounded-2xl shadow-sm">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/50">
          <tr>
            <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Order ID
            </th>
            <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Delivery Address
            </th>
            <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              City
            </th>
            <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
              Total Amount
            </th>
            <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
              Payment
            </th>
            <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
              Current Status
            </th>
            <th scope="col" className="px-6 py-4.5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              Manage Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
              {/* Order ID */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900">
                #DF-ORD-{order.id}
              </td>
              
              {/* Customer */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">{order.customer_name}</span>
                  <span className="text-xs text-gray-400 mt-0.5">Order #{order.id}</span>
                </div>
              </td>

              {/* Contact */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col text-sm text-gray-600">
                  {order.customer_phone ? (
                    <span>{order.customer_phone}</span>
                  ) : null}
                  <span className="text-xs text-gray-400 truncate">{order.customer_email}</span>
                </div>
              </td>
              
              {/* Delivery Address */}
              <td className="px-6 py-4 max-w-[220px] text-sm text-gray-700">
                {order.delivery_address || '-'}
              </td>

              {/* Delivery City */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {order.delivery_city || '-'}
              </td>

              {/* Total */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900 text-right">
                {formatCurrency(order.total_amount)}
              </td>
              
              {/* Payment Method */}
              <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-gray-600">
                  {order.payment_method === 'Card' ? (
                    <CreditCard className="h-3.5 w-3.5" />
                  ) : (
                    <DollarSign className="h-3.5 w-3.5" />
                  )}
                  <span>{order.payment_method}</span>
                </span>
              </td>

              {/* Status Badge */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg border ${getStatusBadgeStyle(order.status)}`}>
                  {order.status}
                </span>
              </td>
              
              {/* Action Dropdown */}
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex flex-col items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {['Pending', 'Preparing'].includes(order.status) && onCancel && (
                    <button
                      type="button"
                      onClick={() => onCancel(order.id)}
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 hover:bg-red-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
