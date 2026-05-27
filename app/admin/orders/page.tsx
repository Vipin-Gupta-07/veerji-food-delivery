'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Order {
  _id: string; orderId: string; customerName: string; customerPhone: string;
  total: number; status: string; paymentMethod: string; createdAt: string;
  items: Array<{ name: string; quantity: number }>;
  deliveryAddress: { city: string; pincode: string };
}

const STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchOrders();
  }, [user, router, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${statusFilter}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${user?.token}` } });
      const d = await res.json();
      if (d.success) setOrders(d.data);
    } catch { toast.error('Failed to fetch orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ status }),
      });
      const d = await res.json();
      if (d.success) {
        setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status } : o));
        toast.success(`Order ${orderId} → ${getStatusLabel(status)}`);
      }
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const filtered = orders.filter((o) =>
    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.customerPhone.includes(search)
  );

  const NEXT_STATUS: Record<string, string> = {
    pending: 'confirmed', confirmed: 'preparing',
    preparing: 'out_for_delivery', out_for_delivery: 'delivered',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-brand-dark">Order Management</h1>
            <p className="text-gray-500 mt-1">{filtered.length} orders</p>
          </div>
          <button onClick={fetchOrders} className="btn-ghost border border-gray-200 flex items-center gap-2">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10" placeholder="Search by order ID, name, phone..." />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  statusFilter === s ? 'bg-brand-orange text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-orange'
                }`}>
                {s === 'all' ? 'All' : getStatusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-card">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-display font-bold text-xl text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-400">Try a different filter or search</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono font-bold text-brand-orange">{order.orderId}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full capitalize">
                        {order.paymentMethod === 'cod' ? '💵 COD' : order.paymentMethod === 'upi' ? '📱 UPI' : '💳 Card'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="font-medium text-gray-800">{order.customerName}</span>
                      <span>{order.customerPhone}</span>
                      <span>{order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {order.items.map((i) => `${i.name} ×${i.quantity}`).join(' • ')}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-lg text-gray-800">{formatPrice(order.total)}</span>
                    {NEXT_STATUS[order.status] && (
                      <button
                        onClick={() => updateStatus(order.orderId, NEXT_STATUS[order.status])}
                        disabled={updating === order.orderId}
                        className="text-sm bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white font-medium px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
                      >
                        {updating === order.orderId ? '...' : `→ ${getStatusLabel(NEXT_STATUS[order.status])}`}
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => updateStatus(order.orderId, 'cancelled')}
                        disabled={updating === order.orderId}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
