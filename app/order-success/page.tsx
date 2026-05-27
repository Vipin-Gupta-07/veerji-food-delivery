'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Phone, ArrowRight, Package } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface OrderData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: Array<{ name: string; quantity: number; price: number; isVeg: boolean }>;
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  status: string;
  paymentMethod: string;
  estimatedDelivery: string;
  deliveryAddress: { street: string; city: string; pincode: string };
  createdAt: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then((d) => { if (d.success) setOrder(d.data); })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const STEPS = [
    { label: 'Order Placed', icon: CheckCircle, done: true },
    { label: 'Confirmed', icon: Package, done: true },
    { label: 'Preparing', icon: '👨‍🍳', done: false },
    { label: 'Out for Delivery', icon: '🛵', done: false },
    { label: 'Delivered', icon: '🏠', done: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
          <p className="text-gray-500">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={52} className="text-green-500" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-1 -right-1 text-3xl"
            >
              🎉
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-extrabold text-brand-dark mb-2"
          >
            Order Placed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-lg"
          >
            Your food is being prepared with love 🍢
          </motion.p>

          {orderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 bg-brand-orange/10 text-brand-orange px-5 py-2 rounded-xl font-mono font-bold text-lg"
            >
              {orderId}
            </motion.div>
          )}
        </motion.div>

        {/* ETA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand-dark rounded-2xl p-5 mb-6 flex items-center gap-4"
        >
          <div className="text-4xl">🛵</div>
          <div>
            <p className="text-white/60 text-sm">Estimated Delivery</p>
            <p className="text-white font-display font-bold text-xl">30–35 Minutes</p>
            {order?.estimatedDelivery && (
              <p className="text-white/50 text-xs mt-0.5">By {new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
            )}
          </div>
          <div className="ml-auto">
            <div className="w-12 h-12 bg-brand-orange/20 rounded-full flex items-center justify-center animate-pulse-orange">
              <Clock size={22} className="text-brand-orange" />
            </div>
          </div>
        </motion.div>

        {/* Order Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-card mb-6"
        >
          <h3 className="font-display font-bold text-lg mb-5">Order Tracking</h3>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
            <div className="absolute left-5 top-5 w-0.5 bg-brand-orange transition-all" style={{ height: '20%' }} />

            <div className="space-y-5">
              {STEPS.map((step, i) => (
                <div key={step.label} className={`flex items-center gap-4 ${i === 2 ? 'opacity-100' : i > 2 ? 'opacity-40' : ''}`}>
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.done ? 'bg-green-500' : i === 2 ? 'bg-brand-orange animate-pulse-orange' : 'bg-gray-100'
                  }`}>
                    {step.done ? (
                      <CheckCircle size={18} className="text-white" />
                    ) : typeof step.icon === 'string' ? (
                      <span className="text-lg">{step.icon}</span>
                    ) : (
                      <step.icon size={18} className={i === 2 ? 'text-white' : 'text-gray-400'} />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${step.done ? 'text-green-600' : i === 2 ? 'text-brand-orange' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {i === 2 && <p className="text-xs text-gray-400">Kitchen is working on your order</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-card mb-6"
          >
            <h3 className="font-display font-bold text-lg mb-4">Order Details</h3>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                    </div>
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-400">× {item.quantity}</span>
                  </div>
                  <span className="font-medium text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span><span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>GST</span><span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Total Paid</span>
                <span className="text-brand-orange">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Address + Payment */}
            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <MapPin size={11} />
                  <span>Delivery to</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{order.deliveryAddress.street}</p>
                <p className="text-xs text-gray-400">{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Phone size={11} />
                  <span>Payment</span>
                </div>
                <p className="text-sm text-gray-700 font-medium capitalize">
                  {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' :
                   order.paymentMethod === 'upi' ? '📱 UPI' : '💳 Card'}
                </p>
                <p className="text-xs text-gray-400">Ordered at {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href="/restaurant" className="flex-1 btn-primary text-center flex items-center justify-center gap-2">
            Order Again
            <ArrowRight size={16} />
          </Link>
          <Link href="/" className="flex-1 btn-outline text-center">
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
