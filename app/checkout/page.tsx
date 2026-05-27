'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, Mail, ChevronRight, CreditCard, Banknote, Smartphone, Shield, Clock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, calculateTotal } from '@/lib/utils';
import toast from 'react-hot-toast';

type PaymentMethod = 'cod' | 'upi' | 'card';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const subtotal = getSubtotal();
  const { deliveryFee, tax, total } = calculateTotal(subtotal);

  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '',
    instructions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid 10-digit phone required';
    if (!form.street.trim()) e.street = 'Address is required';
    if (!form.pincode.trim() || form.pincode.length !== 6) e.pincode = 'Valid 6-digit pincode required';
    return e;
  };

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill all required fields');
      return;
    }

    setIsPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          items: items.map((i) => ({
            menuItem: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            isVeg: i.isVeg,
          })),
          deliveryAddress: {
            name: form.name,
            phone: form.phone,
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          paymentMethod,
          specialInstructions: form.instructions,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      clearCart();
      toast.success('Order placed successfully! 🎉');
      router.push(`/order-success?orderId=${data.data.orderId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add items before checking out</p>
        <button onClick={() => router.push('/restaurant')} className="btn-primary">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-extrabold text-brand-dark mb-2">Checkout</h1>
          <p className="text-gray-500 mb-8">Almost there! Complete your order details below.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <User size={18} className="text-brand-orange" />
                </div>
                <h2 className="font-display font-bold text-xl">Contact Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                    className={`input-field ${errors.name ? 'border-red-400 ring-red-200' : ''}`} placeholder="John Doe" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                      className={`input-field pl-9 ${errors.phone ? 'border-red-400' : ''}`} placeholder="9876543210" maxLength={10} />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                      className={`input-field pl-9 ${errors.email ? 'border-red-400' : ''}`} placeholder="john@example.com" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <MapPin size={18} className="text-brand-orange" />
                </div>
                <h2 className="font-display font-bold text-xl">Delivery Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                  <textarea value={form.street} onChange={(e) => handleChange('street', e.target.value)}
                    className={`input-field resize-none h-20 ${errors.street ? 'border-red-400' : ''}`}
                    placeholder="House No., Building, Street, Area" />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode *</label>
                  <input value={form.pincode} onChange={(e) => handleChange('pincode', e.target.value)}
                    className={`input-field ${errors.pincode ? 'border-red-400' : ''}`} placeholder="201301" maxLength={6} />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Instructions (optional)</label>
                  <input value={form.instructions} onChange={(e) => handleChange('instructions', e.target.value)}
                    className="input-field" placeholder="e.g. Ring bell twice, leave at door..." />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <CreditCard size={18} className="text-brand-orange" />
                </div>
                <h2 className="font-display font-bold text-xl">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'cod', icon: <Banknote size={22} />, label: 'Cash on Delivery', desc: 'Pay when food arrives' },
                  { id: 'upi', icon: <Smartphone size={22} />, label: 'UPI', desc: 'GPay, PhonePe, Paytm' },
                  { id: 'card', icon: <CreditCard size={22} />, label: 'Card', desc: 'Credit / Debit card' },
                ].map((method) => (
                  <button key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === method.id
                        ? 'border-brand-orange bg-brand-orange/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`mb-2 ${paymentMethod === method.id ? 'text-brand-orange' : 'text-gray-500'}`}>
                      {method.icon}
                    </div>
                    <div className={`font-semibold text-sm ${paymentMethod === method.id ? 'text-brand-orange' : 'text-gray-700'}`}>
                      {method.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{method.desc}</div>
                  </button>
                ))}
              </div>
              {(paymentMethod === 'upi' || paymentMethod === 'card') && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-700 text-sm font-medium flex items-center gap-2">
                    <Shield size={14} />
                    {paymentMethod === 'upi'
                      ? 'Demo: Enter any UPI ID (e.g. demo@upi). Payment is simulated.'
                      : 'Demo: Enter any card details. No real payment will be processed.'}
                  </p>
                  {paymentMethod === 'upi' && (
                    <input className="input-field mt-3 text-sm" placeholder="yourname@upi" />
                  )}
                  {paymentMethod === 'card' && (
                    <div className="mt-3 space-y-2">
                      <input className="input-field text-sm" placeholder="Card number: 4111 1111 1111 1111" />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="input-field text-sm" placeholder="MM/YY" />
                        <input className="input-field text-sm" placeholder="CVV" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-card p-6 sticky top-28">
              <h2 className="font-display font-bold text-xl mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">× {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (5%)</span><span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-brand-orange">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <Clock size={12} />
                <span>Estimated delivery: 30-35 mins</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="mt-5 w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPlacing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                <Shield size={11} />
                Safe & secure checkout
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
