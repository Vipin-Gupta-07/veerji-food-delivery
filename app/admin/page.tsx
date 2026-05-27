'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, TrendingUp, Package, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

interface Stats { total: number; pending: number; preparing: number; delivered: number; revenue: number; }
interface Order {
  _id: string; orderId: string; customerName: string; total: number;
  status: string; createdAt: string; items: Array<{ name: string }>;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }

    fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setStats(d.stats);
          setOrders(d.data.slice(0, 8));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  const STAT_CARDS = [
    { label: 'Total Orders', value: stats?.total || 0, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
    { label: 'Revenue', value: formatPrice(stats?.revenue || 0), icon: TrendingUp, color: 'bg-green-50 text-green-600', trend: '+8%' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'bg-yellow-50 text-yellow-600', trend: '' },
    { label: 'Delivered', value: stats?.delivered || 0, icon: CheckCircle, color: 'bg-orange-50 text-brand-orange', trend: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-brand-dark">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your restaurant operations</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/menu" className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                <Package size={16} />
                Manage Menu
              </Link>
              <Link href="/admin/orders" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                <ShoppingBag size={16} />
                All Orders
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-card"
            >
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon size={20} />
              </div>
              <p className="font-display font-bold text-2xl text-brand-dark">{card.value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{card.label}</p>
              {card.trend && (
                <span className="text-xs text-green-600 font-medium">{card.trend} this week</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { href: '/admin/menu', title: 'Menu Management', desc: 'Add, edit or remove menu items', icon: '🍢', color: 'from-orange-500 to-red-500' },
            { href: '/admin/orders', title: 'Order Management', desc: 'View and update order statuses', icon: '📦', color: 'from-blue-500 to-purple-500' },
            { href: '/api/scrape-swiggy', title: 'Refresh Data', desc: 'Re-seed menu from Swiggy data', icon: '🔄', color: 'from-green-500 to-teal-500' },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all group flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-gray-800">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.desc}</p>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-orange transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-brand-dark">Recent Orders</h2>
            <Link href="/admin/orders" className="text-brand-orange text-sm font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle size={40} className="text-gray-200 mb-3" />
                <p className="text-gray-400">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Items</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-bold text-brand-orange">{order.orderId}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-800">{order.customerName}</span>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-xs text-gray-400">{order.items.map((i) => i.name.split(' ').slice(0, 2).join(' ')).slice(0, 2).join(', ')}{order.items.length > 2 ? '...' : ''}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-sm text-gray-800">{formatPrice(order.total)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
