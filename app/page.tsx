'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Clock, ChefHat, Leaf, ArrowRight, MapPin, Phone, Sparkles, Flame } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import { MENU_ITEMS_DATA, RESTAURANT_DATA } from '@/lib/data';

const FEATURED_ITEMS = MENU_ITEMS_DATA.filter((i) => i.isBestseller).slice(0, 6);

const STATS = [
  { icon: Star, value: '4.3★', label: 'Rating', color: 'text-yellow-500' },
  { icon: Clock, value: '30 min', label: 'Delivery', color: 'text-blue-500' },
  { icon: Leaf, value: '100%', label: 'Pure Veg', color: 'text-green-500' },
  { icon: ChefHat, value: '10K+', label: 'Happy Orders', color: 'text-brand-orange' },
];

const FEATURES = [
  { icon: '🌿', title: 'Pure Vegetarian', desc: 'All dishes are 100% vegetarian, made with fresh soy chaap' },
  { icon: '🔥', title: 'Tandoor Fresh', desc: 'Every piece grilled fresh in our clay tandoor oven' },
  { icon: '⚡', title: 'Fast Delivery', desc: 'Hot food at your door in 30-35 minutes guaranteed' },
  { icon: '💯', title: 'Quality Promise', desc: 'Premium ingredients, authentic recipes, zero compromise' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="page-enter">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1600&q=80"
            alt="Veer Ji Malai Chaap"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 hero-overlay" />
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-brand-saffron/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="bg-brand-orange/20 text-brand-orange text-sm font-semibold px-4 py-1.5 rounded-full border border-brand-orange/30 backdrop-blur-sm flex items-center gap-2">
                <Sparkles size={14} />
                Noida&apos;s #1 Malai Chaap
              </span>
              <span className="bg-green-500/20 text-green-400 text-sm font-semibold px-3 py-1.5 rounded-full border border-green-500/30 backdrop-blur-sm">
                🟢 Open Now
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6"
            >
              Veer Ji{' '}
              <span className="text-brand-orange drop-shadow-[0_0_30px_rgba(255,107,53,0.5)]">
                Malai Chaap
              </span>{' '}
              Wale
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-white/80 mb-8 leading-relaxed max-w-xl"
            >
              Authentic Malai Chaap, Tandoori Delights & North Indian Vegetarian Specialties.
              Served fresh from our kitchen to your doorstep.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              {STATS.map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <Icon size={16} className={color} />
                  <span className="text-white font-bold">{value}</span>
                  <span className="text-white/60 text-sm">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/restaurant"
                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-2xl hover:shadow-orange-glow"
              >
                Order Now
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/restaurant#offers"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-2xl border border-white/30 backdrop-blur-sm transition-all hover:scale-105"
              >
                View Offers
              </Link>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 mt-8 text-white/60 text-sm"
            >
              <MapPin size={14} className="text-brand-orange" />
              <span>F Block Market, Sector 55, Noida, UP 201301</span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* OFFERS BANNER */}
      <section id="offers" className="bg-gradient-to-r from-brand-orange to-brand-saffron py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {RESTAURANT_DATA.offers.map((offer) => (
              <div key={offer.code} className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="text-white font-bold text-lg">🏷️</span>
                <div>
                  <span className="text-white font-bold text-sm">{offer.code}</span>
                  <span className="text-white/80 text-xs ml-2">{offer.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title mb-3">Why Choose Veer Ji?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We&apos;ve been serving authentic North Indian flavors since 2010</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="font-display font-bold text-lg text-brand-dark mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={20} className="text-brand-orange" />
                <span className="text-brand-orange font-semibold text-sm uppercase tracking-wide">Most Loved</span>
              </div>
              <h2 className="section-title">Our Bestsellers</h2>
            </div>
            <Link
              href="/restaurant"
              className="hidden md:flex items-center gap-1.5 text-brand-orange font-semibold hover:underline"
            >
              View Full Menu
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURED_ITEMS.map((item, i) => (
              <motion.div key={item.name} variants={itemVariants}>
                <FoodCard
                  id={`static-${i}`}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  image={item.image}
                  isVeg={item.isVeg}
                  isBestseller={item.isBestseller}
                  rating={item.rating}
                  calories={item.calories}
                  prepTime={item.prepTime}
                  tags={item.tags}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link href="/restaurant" className="btn-primary inline-flex items-center gap-2">
              Explore Full Menu
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">🍢</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
              Ready to Order?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Fresh Malai Chaap delivered to your door in 30-35 minutes. Order now and use code{' '}
              <span className="text-brand-orange font-bold">VEERJI50</span> for 50% off!
            </p>
            <Link href="/restaurant" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Start Your Order
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-orange rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-display font-bold">VJ</span>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-lg">Veer Ji</div>
                  <div className="text-xs text-brand-orange">Malai Chaap Wale</div>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Serving authentic North Indian vegetarian delicacies since 2010. Come experience the taste of tradition.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/restaurant" className="hover:text-brand-orange transition-colors">Menu</Link></li>
                <li><Link href="/restaurant#offers" className="hover:text-brand-orange transition-colors">Offers</Link></li>
                <li><Link href="/cart" className="hover:text-brand-orange transition-colors">Cart</Link></li>
                <li><Link href="/login" className="hover:text-brand-orange transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-brand-orange" />
                  <span>F Block Market, Sector 55, Noida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-brand-orange" />
                  <span>+91-9876543210</span>
                </div>
                <div className="text-xs text-gray-600 mt-3 leading-relaxed">
                  ⏰ Mon–Sun: 11:00 AM – 11:00 PM
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © 2024 Veer Ji Malai Chaap Wale. All rights reserved.
            </p>
            <p className="text-gray-700 text-xs">
              Built for demo/educational purposes. Menu data sourced from Swiggy listing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
