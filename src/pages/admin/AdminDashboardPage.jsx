// AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardSummary } from '../../services/dashboardService';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';
import { ClipboardList, IndianRupee, RefreshCw, Eye, TrendingUp, DollarSign } from 'lucide-react';

export const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary(token);
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard summary stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Action */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Dashboard Metrics</h2>
            <p className="text-xs text-gray-400 mt-1">Real-time summaries of orders, revenue, and activities.</p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-600 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
        </div>

        {/* Loaders & Errors */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && stats && (
          <div className="space-y-8">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                label="Total Orders"
                value={stats.totalOrders}
                icon={ClipboardList}
                color="blue"
              />
              <StatCard
                label="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
                color="emerald"
              />
              <StatCard
                label="Current Operations"
                value="Active"
                icon={TrendingUp}
                color="orange"
              />
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Recent Customer Requests</h3>
                <Link
                  to="/admin/orders"
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 inline-flex items-center space-x-1"
                >
                  <span>View All Queue</span>
                  <Eye className="h-3.5 w-3.5" />
                </Link>
              </div>

              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="text-sm hover:bg-gray-50/30">
                          <td className="px-4 py-3.5 whitespace-nowrap font-extrabold text-gray-900">
                            #DF-ORD-{order.id}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-gray-700">
                            {order.customer_name}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-right font-bold text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-center text-xs text-gray-500">
                            {order.payment_method}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-center text-xs">
                            <span
                              className={`inline-block px-2 py-0.5 font-semibold rounded ${
                                order.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : order.status === 'Preparing'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No recent orders found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
