'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, calculateTotal } from '@/lib/utils';
import { FALLBACK_FOOD_IMAGE } from '@/lib/utils';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const { deliveryFee, tax, total } = calculateTotal(subtotal);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeCart]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={18} className="text-brand-orange" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-brand-dark">Your Cart</h2>
                  <p className="text-xs text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Restaurant badge */}
            {items.length > 0 && (
              <div className="mx-5 mt-4 px-3 py-2 bg-orange-50 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-600">Veer Ji Malai Chaap Wale</span>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-16"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={40} className="text-gray-300" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-700 mb-2">Cart is empty</h3>
                  <p className="text-gray-400 text-sm mb-6">Add delicious items from our menu!</p>
                  <button
                    onClick={closeCart}
                    className="btn-primary text-sm py-2.5"
                  >
                    Browse Menu
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      {/* Veg/Non-veg indicator */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-brand-orange font-bold text-sm mt-0.5">{formatPrice(item.price)}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="qty-btn bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="qty-btn bg-brand-orange text-white hover:bg-brand-orange-dark"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-sm">{formatPrice(item.price * item.quantity)}</span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Summary & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-4">
                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (5%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-1.5">
                      🎉 You saved ₹30 on delivery!
                    </p>
                  )}
                  {deliveryFee > 0 && subtotal < 399 && (
                    <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5">
                      Add {formatPrice(399 - subtotal)} more for free delivery
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-dashed border-gray-200">
                    <span>Total</span>
                    <span className="text-brand-orange">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-between bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold px-5 py-3.5 rounded-xl w-full transition-all hover:scale-[1.02] shadow-orange-glow"
                >
                  <span>Proceed to Checkout</span>
                  <div className="flex items-center gap-1">
                    <span>{formatPrice(total)}</span>
                    <ChevronRight size={18} />
                  </div>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
