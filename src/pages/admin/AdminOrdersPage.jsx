// AdminOrdersPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { updateOrderStatus, cancelOrder } from '../../services/orderService';
import AdminLayout from '../../components/layout/AdminLayout';
import OrdersTable from '../../components/admin/OrdersTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { RefreshCw, ClipboardList } from 'lucide-react';

export const AdminOrdersPage = () => {
  const { token } = useAuth();
  const { orders, loading, error, refetch } = useOrders(); // Auto resolves all orders for Admin
  const [actionError, setActionError] = useState('');

  const handleStatusChange = async (orderId, newStatus) => {
    setActionError('');
    try {
      await updateOrderStatus(orderId, newStatus, token);
      refetch(); // Refresh list on success
    } catch (err) {
      console.error('Failed to update order status:', err);
      setActionError(err.response?.data?.message || 'Error occurred while updating order status.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    setActionError('');
    try {
      await cancelOrder(orderId, token);
      refetch();
    } catch (err) {
      console.error('Failed to cancel order:', err);
      setActionError(err.response?.data?.message || 'Error occurred while canceling the order.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Manage Orders Queue</h2>
            <p className="text-xs text-gray-400 mt-1">Review active customer requests and update preparing status.</p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-600 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 text-xs font-semibold text-red-700 rounded-xl">
            {actionError}
          </div>
        )}

        {/* Loaders / Errors / Table */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <EmptyState
                message="No customer orders have been placed in the system yet. Once placed, they will appear in this queue!"
              />
            ) : (
              <OrdersTable orders={orders} onStatusChange={handleStatusChange} onCancel={handleCancelOrder} />
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
