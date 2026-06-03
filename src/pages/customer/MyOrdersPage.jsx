// MyOrdersPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import CustomerLayout from '../../components/layout/CustomerLayout';
import OrderCard from '../../components/orders/OrderCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { RefreshCw, ClipboardList } from 'lucide-react';

export const MyOrdersPage = () => {
  const { orders, loading, error, refetch } = useOrders();
  const navigate = useNavigate();

  const handleBrowseMenu = () => {
    navigate('/menu');
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header section with refresh button */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-150 gap-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-orange-500" />
            <span>My Orders History</span>
          </h2>

          <button
            onClick={refetch}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-gray-250 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50"
            title="Refresh status"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Loaders / Errors / List */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <EmptyState
                message="You have not placed any orders yet. Click below to browse our delicious menu items!"
                actionLabel="Browse Menu"
                onAction={handleBrowseMenu}
              />
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} onOrderChange={refetch} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MyOrdersPage;
