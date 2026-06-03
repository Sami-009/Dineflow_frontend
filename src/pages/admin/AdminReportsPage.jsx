import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReportSummary } from '../../services/reportService';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatCurrency } from '../../utils/formatCurrency';
import { Clock3, BarChart3, ListChecks, Award, Users, CheckCircle2, XCircle, ShoppingBag, FolderHeart, Calendar } from 'lucide-react';

export const AdminReportsPage = () => {
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportSummary(token);
      setReport(data);
    } catch (err) {
      console.error('Error fetching report summary:', err);
      setError(err.response?.data?.message || 'Unable to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReport();
    }
  }, [token]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Reports Overview</h2>
            <p className="text-xs text-gray-400 mt-1">Full financial audits, category popularity, and detailed sales data.</p>
          </div>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-600 transition-colors shadow-sm"
          >
            <BarChart3 className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Reports</span>
          </button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && report && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards - Grid with 6 items for all requested values */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              <StatCard label="Total Orders" value={report.totalOrders} icon={ListChecks} color="blue" />
              <StatCard label="Total Revenue" value={formatCurrency(report.totalRevenue)} icon={Award} color="emerald" />
              <StatCard label="Customers" value={report.totalCustomers} icon={Users} color="violet" />
              <StatCard label="Completed" value={report.completedOrders} icon={CheckCircle2} color="emerald" />
              <StatCard label="Pending" value={report.pendingOrders} icon={Clock3} color="amber" />
              <StatCard label="Cancelled" value={report.cancelledOrders} icon={XCircle} color="red" />
            </div>

            {/* Grid 1: Top Selling Items and Top Categories */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Top Selling Menu Items */}
              <section className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-orange-500" />
                    <span>Top Selling Menu Items</span>
                  </h3>
                  <span className="text-xs text-gray-400">Based on orders</span>
                </div>
                {report.topSellingItems.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-10 flex-grow flex items-center justify-center">No sales data available yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                      <thead>
                        <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <th className="pb-3">Item Name</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3 text-center">Qty Sold</th>
                          <th className="pb-3 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {report.topSellingItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-55/30">
                            <td className="py-3 font-semibold text-gray-800">{item.name}</td>
                            <td className="py-3 text-gray-500">{item.category}</td>
                            <td className="py-3 text-center font-bold text-gray-700">{item.quantity_sold}</td>
                            <td className="py-3 text-right font-extrabold text-orange-500">{formatCurrency(item.revenue_generated)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Most Ordered Categories */}
              <section className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FolderHeart className="h-4 w-4 text-violet-500" />
                    <span>Most Ordered Categories</span>
                  </h3>
                  <span className="text-xs text-gray-400">By total portions</span>
                </div>
                {report.topCategories.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-10 flex-grow flex items-center justify-center">No category data available yet.</p>
                ) : (
                  <div className="space-y-4 flex-grow">
                    {report.topCategories.map((cat, idx) => {
                      const maxQty = report.topCategories[0]?.quantity_sold || 1;
                      const percentage = Math.round((cat.quantity_sold / maxQty) * 100);
                      return (
                        <div key={cat.category || idx} className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                            <span className="font-bold text-gray-900">{cat.category}</span>
                            <span className="text-gray-500">{cat.quantity_sold} items ({formatCurrency(cat.revenue)})</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-orange-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Grid 2: Daily Sales (Last 7 Days) and Monthly Revenue */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Daily Sales (Last 7 Days) */}
              <section className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Daily Revenue (Last 7 Days)</span>
                  </h3>
                  <span className="text-xs text-gray-400">Trend list</span>
                </div>
                {report.dailyRevenue.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-10">No daily sales logs published.</p>
                ) : (
                  <div className="space-y-3">
                    {report.dailyRevenue.map((row) => (
                      <div key={row.date} className="flex items-center justify-between text-sm py-2 px-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                        <span className="font-medium text-gray-700">{row.date}</span>
                        <div className="flex items-center gap-6">
                          <span className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">{row.order_count} orders</span>
                          <span className="font-bold text-gray-900 min-w-[80px] text-right">{formatCurrency(row.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Monthly Revenue */}
              <section className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-500" />
                    <span>Monthly Revenue Statistics</span>
                  </h3>
                  <span className="text-xs text-gray-400">Aggregated monthly</span>
                </div>
                {report.monthlyRevenue.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-10">No monthly revenue logs available.</p>
                ) : (
                  <div className="space-y-3">
                    {report.monthlyRevenue.map((row) => (
                      <div key={row.month} className="flex items-center justify-between text-sm py-2 px-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                        <span className="font-medium text-gray-700">{row.month}</span>
                        <div className="flex items-center gap-6">
                          <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">{row.order_count} orders</span>
                          <span className="font-bold text-gray-900 min-w-[80px] text-right">{formatCurrency(row.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
