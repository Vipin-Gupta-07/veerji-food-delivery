'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Search, AlertTriangle, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import { CATEGORIES_DATA, MENU_ITEMS_DATA } from '@/lib/data';
import toast from 'react-hot-toast';

interface MenuItem {
  _id: string; name: string; description: string; price: number;
  originalPrice?: number; category: string; isVeg: boolean;
  isBestseller: boolean; isAvailable: boolean; rating: number;
  image: string; tags: string[];
}

const EMPTY_FORM = {
  name: '', description: '', price: 0, originalPrice: 0, category: 'bestsellers',
  isVeg: true, isBestseller: false, isAvailable: true, rating: 4.0,
  image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80', tags: '',
};

export default function AdminMenuPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchItems();
  }, [user, router]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/menu', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const d = await res.json();
      if (d.success) setItems(d.data);
      else {
        // Fallback to static data for demo
        setItems(MENU_ITEMS_DATA.map((item, i) => ({ ...item, _id: `static-${i}`, originalPrice: item.originalPrice || 0 })) as unknown as MenuItem[]);
      }
    } catch {
      setItems(MENU_ITEMS_DATA.map((item, i) => ({ ...item, _id: `static-${i}`, originalPrice: item.originalPrice || 0 })) as unknown as MenuItem[]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({
      name: item.name, description: item.description, price: item.price,
      originalPrice: item.originalPrice || 0, category: item.category,
      isVeg: item.isVeg, isBestseller: item.isBestseller, isAvailable: item.isAvailable,
      rating: item.rating, image: item.image, tags: item.tags?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { toast.error('Name and price required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean), originalPrice: form.originalPrice || undefined };
      const url = editItem ? `/api/menu/${editItem._id}` : '/api/menu';
      const method = editItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(editItem ? 'Item updated!' : 'Item added!');
        setShowForm(false);
        fetchItems();
      } else throw new Error(d.error);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/menu/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } });
      toast.success('Item deleted');
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch { toast.error('Delete failed'); }
    setDeleteId(null);
  };

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-brand-dark">Menu Management</h1>
            <p className="text-gray-500 mt-1">{items.length} items in menu</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Item
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10" placeholder="Search menu items..." />
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Item', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded border flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                            </div>
                            <span className="font-medium text-sm text-gray-800">{item.name}</span>
                            {item.isBestseller && <span className="text-xs bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded font-bold">★</span>}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{item.category.replace(/-/g, ' ')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-sm text-gray-800">{formatPrice(item.price)}</span>
                      {item.originalPrice && item.originalPrice > 0 && (
                        <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(item.originalPrice)}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl font-bold">{editItem ? 'Edit Item' : 'Add Menu Item'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Malai Chaap (4 Pcs)" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none h-20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (₹)</label>
                    <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: +e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                      {CATEGORIES_DATA.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
                    <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                    <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
                    <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="spicy, creamy, bestseller" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Pure Veg</label>
                    <button onClick={() => setForm({ ...form, isVeg: !form.isVeg })}
                      className={`w-10 h-5 rounded-full transition-colors ${form.isVeg ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.isVeg ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Bestseller</label>
                    <button onClick={() => setForm({ ...form, isBestseller: !form.isBestseller })}
                      className={`w-10 h-5 rounded-full transition-colors ${form.isBestseller ? 'bg-brand-orange' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.isBestseller ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Available</label>
                    <button onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                      className={`w-10 h-5 rounded-full transition-colors ${form.isAvailable ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.isAvailable ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowForm(false)} className="btn-ghost flex-1 border border-gray-200">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-70">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                    {editItem ? 'Update' : 'Add Item'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl z-50 w-80">
              <div className="text-center">
                <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
                <h3 className="font-display font-bold text-xl mb-2">Delete Item?</h3>
                <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 border border-gray-200">Cancel</button>
                  <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">Delete</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
