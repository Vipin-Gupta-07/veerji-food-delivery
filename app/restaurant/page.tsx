'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Clock, Leaf, X, ChevronDown, MapPin, Phone } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import { MENU_ITEMS_DATA, CATEGORIES_DATA, RESTAURANT_DATA } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

// Enrich items with stable IDs
const ITEMS_WITH_IDS = MENU_ITEMS_DATA.map((item, i) => ({
  ...item,
  id: `item-${i}-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
}));

export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    let items = ITEMS_WITH_IDS;

    if (activeCategory !== 'all') {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  // Group by category for display
  const grouped = useMemo(() => {
    if (activeCategory !== 'all' || searchQuery) {
      return { [activeCategory || 'results']: filteredItems };
    }
    const groups: Record<string, typeof filteredItems> = {};
    CATEGORIES_DATA.forEach((cat) => {
      const items = ITEMS_WITH_IDS.filter((i) => i.category === cat.slug);
      if (items.length > 0) groups[cat.slug] = items;
    });
    return groups;
  }, [activeCategory, searchQuery, filteredItems]);

  const allCategories = [
    { slug: 'all', name: 'All Items', icon: '🍽️' },
    ...CATEGORIES_DATA,
  ];

  const getCategoryName = (slug: string) =>
    CATEGORIES_DATA.find((c) => c.slug === slug)?.name || slug;
  const getCategoryIcon = (slug: string) =>
    CATEGORIES_DATA.find((c) => c.slug === slug)?.icon || '🍽️';

  return (
    <div className="page-enter min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={RESTAURANT_DATA.images.banner}
          alt="Restaurant banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">🟢 OPEN</span>
                  <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">Pure Veg</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-1">
                  {RESTAURANT_DATA.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
                  <span>{RESTAURANT_DATA.cuisines.join(', ')}</span>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{RESTAURANT_DATA.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <Star size={14} fill="#F59E0B" className="text-yellow-500" />
                <span className="font-bold text-gray-800">{RESTAURANT_DATA.rating}</span>
                <span className="text-gray-400 hidden md:inline">({RESTAURANT_DATA.totalRatings})</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock size={14} className="text-brand-orange" />
                <span>{RESTAURANT_DATA.deliveryTime}</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-gray-600">
                <span className="font-medium">Min: {formatPrice(RESTAURANT_DATA.minOrder)}</span>
              </div>
            </div>

            {/* Search Toggle */}
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                setTimeout(() => searchRef.current?.focus(), 100);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showSearch
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Search size={16} />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>

          {/* Search Input */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pb-3"
              >
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes... e.g. malai chaap, paneer tikka"
                    className="input-field pl-9 pr-9 py-2.5 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Offers */}
        <div id="offers" className="flex gap-3 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {RESTAURANT_DATA.offers.map((offer) => (
            <div
              key={offer.code}
              className="flex-shrink-0 bg-white border border-dashed border-brand-orange rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="text-2xl">🎁</div>
              <div>
                <div className="font-bold text-brand-orange text-sm">{offer.code}</div>
                <div className="text-xs text-gray-500">{offer.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Category Sidebar (desktop) */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-48 bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-display font-bold text-sm text-gray-500 uppercase tracking-wide">Categories</h3>
              </div>
              <nav className="p-2">
                {allCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left mb-1 ${
                      activeCategory === cat.slug
                        ? 'bg-brand-orange text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Category Tabs (mobile) */}
          <div className="lg:hidden w-full mb-4 -mx-4 px-4">
            <div ref={categoryBarRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {allCategories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat.slug
                      ? 'bg-brand-orange text-white shadow-md'
                      : 'bg-white text-gray-600 shadow-sm'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 min-w-0">
            {searchQuery && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-gray-500 text-sm">
                  {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                </span>
                <button onClick={() => setSearchQuery('')} className="text-brand-orange text-sm hover:underline">
                  Clear
                </button>
              </div>
            )}

            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display font-bold text-xl text-gray-700 mb-2">No items found</h3>
                <p className="text-gray-400 text-sm">Try a different search or category</p>
              </motion.div>
            ) : searchQuery || activeCategory !== 'all' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredItems.map((item) => (
                  <FoodCard key={item.id} {...item} originalPrice={item.originalPrice ?? undefined} />
                ))}
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(grouped).map(([slug, items]) => (
                  <motion.section
                    key={slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">{getCategoryIcon(slug)}</span>
                      <h2 className="font-display font-bold text-2xl text-brand-dark">{getCategoryName(slug)}</h2>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        {items.length} items
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {items.map((item) => (
                        <FoodCard key={item.id} {...item} originalPrice={item.originalPrice ?? undefined} />
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
