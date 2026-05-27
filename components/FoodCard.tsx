'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Star, Flame, Clock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { FALLBACK_FOOD_IMAGE } from '@/lib/utils';
import toast from 'react-hot-toast';

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
  rating?: number;
  calories?: number;
  prepTime?: string;
  tags?: string[];
}

export default function FoodCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  isVeg,
  isBestseller,
  rating,
  calories,
  prepTime,
  tags = [],
}: FoodCardProps) {
  const [imgError, setImgError] = useState(false);
  const { addItem, removeItem, updateQuantity, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(id);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem({ id, name, price, image, isVeg });
    toast.success(`${name.split(' ').slice(0, 2).join(' ')} added!`, {
      icon: '🍢',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="food-card bg-white rounded-2xl overflow-hidden shadow-card group cursor-pointer border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={imgError ? FALLBACK_FOOD_IMAGE : image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isBestseller && (
            <span className="badge-bestseller flex items-center gap-1">
              <Flame size={10} />
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="badge-offer">{discount}% OFF</span>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
            <Star size={12} fill="#F59E0B" className="text-brand-saffron" />
            <span className="text-xs font-bold text-gray-800">{rating}</span>
          </div>
        )}

        {/* Gradient at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Veg/Non-veg + Name */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            </div>
            <h3 className="font-display font-semibold text-base text-gray-900 leading-tight line-clamp-2">{name}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{description}</p>

        {/* Meta info */}
        <div className="flex items-center gap-3 mb-3">
          {prepTime && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              <span>{prepTime}</span>
            </div>
          )}
          {calories && (
            <div className="text-xs text-gray-400">{calories} kcal</div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-orange-50 text-brand-orange px-2 py-0.5 rounded-full font-medium capitalize">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + Add Button */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-display font-bold text-xl text-brand-dark">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{formatPrice(originalPrice)}</span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {quantity === 0 ? (
              <motion.button
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-orange-glow"
              >
                <Plus size={16} />
                <span>ADD</span>
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-2 bg-brand-dark rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => updateQuantity(id, quantity - 1)}
                  className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-white font-bold text-sm w-5 text-center">{quantity}</span>
                <button
                  onClick={() => {
                    updateQuantity(id, quantity + 1);
                  }}
                  className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
