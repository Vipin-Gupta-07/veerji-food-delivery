'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, calculateTotal } from '@/lib/utils';

export default function BottomCartBar() {
  const { items, openCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const { total } = calculateTotal(subtotal);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
        >
          <button
            onClick={openCart}
            className="w-full bg-brand-dark text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="relative bg-brand-orange rounded-xl p-2">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-white text-brand-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} added
                </div>
                <div className="text-xs text-gray-400">Tap to view cart</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-brand-orange font-bold">
              <span>{formatPrice(total)}</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
