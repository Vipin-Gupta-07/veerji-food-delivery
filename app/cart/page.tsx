'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, calculateTotal } from '@/lib/utils';
import { FALLBACK_FOOD_IMAGE } from '@/lib/utils';
import { RESTAURANT_DATA } from '@/lib/data';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const { deliveryFee, tax, total } = calculateTotal(subtotal);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-28 md:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-3xl font-extrabold text-brand-dark">Your Cart</h1>
          <p className="text-gray-500">{items.length > 0 ? `${items.reduce((s, i) => s + i.quantity, 0)} items from Veer Ji` : 'No items added yet'}</p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mb-5">
              <ShoppingBag size={52} className="text-brand-orange/40" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-700 mb-2">Cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven&apos;t added anything yet</p>
            <Link href="/restaurant" className="btn-primary flex items-center gap-2">
              Explore Menu <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Restaurant info */}
              <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="font-semibold text-gray-800">{RESTAURANT_DATA.name}</p>
                  <p className="text-xs text-gray-400">{RESTAURANT_DATA.deliveryTime} delivery • Min order {formatPrice(RESTAURANT_DATA.minOrder)}</p>
                </div>
              </div>

              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl p-4 shadow-card flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image src={item.image || FALLBACK_FOOD_IMAGE} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</h3>
                          </div>
                          <p className="text-brand-orange font-bold">{formatPrice(item.price)}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-brand-orange/10 hover:bg-brand-orange hover:text-white text-brand-orange rounded-lg flex items-center justify-center transition-all">
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-brand-orange text-white hover:bg-brand-orange-dark rounded-lg flex items-center justify-center transition-all">
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Offers */}
              <div className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-brand-orange" />
                  <span className="font-semibold text-sm text-gray-700">Available Offers</span>
                </div>
                <div className="space-y-2">
                  {RESTAURANT_DATA.offers.map((o) => (
                    <div key={o.code} className="flex items-center gap-3 border border-dashed border-brand-orange/40 rounded-xl p-3 bg-orange-50/50">
                      <span className="font-mono font-bold text-brand-orange text-sm">{o.code}</span>
                      <span className="text-gray-500 text-xs flex-1">{o.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 ml-2">
                <Trash2 size={14} />
                Clear cart
              </button>
            </div>

            {/* Summary */}
            <div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-card p-6 sticky top-28">
                <h2 className="font-display font-bold text-xl mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-bold' : 'font-medium'}>
                      {deliveryFee === 0 ? '🎉 FREE' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (5%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>

                  {deliveryFee > 0 && (
                    <div className="text-xs text-blue-600 bg-blue-50 rounded-xl px-3 py-2">
                      Add {formatPrice(399 - subtotal)} more for free delivery!
                    </div>
                  )}
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-4 mb-5">
                  <span>Total</span>
                  <span className="text-brand-orange">{formatPrice(total)}</span>
                </div>
                <Link href="/checkout"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Link>
                <Link href="/restaurant" className="block text-center text-sm text-gray-400 hover:text-brand-orange mt-3 transition-colors">
                  + Add more items
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
