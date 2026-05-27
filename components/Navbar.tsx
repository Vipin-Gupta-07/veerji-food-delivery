'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, openCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
    setMobileMenuOpen(false);
  };

  const isHome = pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-orange rounded-xl flex items-center justify-center shadow-orange-glow group-hover:scale-105 transition-transform">
              <span className="text-white text-lg font-display font-bold">VJ</span>
            </div>
            <div>
              <div className={`font-display font-bold text-lg leading-tight transition-colors ${
                scrolled || !isHome ? 'text-brand-dark' : 'text-white'
              }`}>
                Veer Ji
              </div>
              <div className="text-xs text-brand-orange font-medium leading-tight">Malai Chaap Wale</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/restaurant"
              className={`font-medium transition-colors hover:text-brand-orange ${
                scrolled || !isHome ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              Menu
            </Link>
            <Link
              href="/restaurant#offers"
              className={`font-medium transition-colors hover:text-brand-orange ${
                scrolled || !isHome ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              Offers
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 font-medium text-brand-orange hover:underline"
                  >
                    <LayoutDashboard size={16} />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center">
                    <User size={16} className="text-brand-orange" />
                  </div>
                  <span className={`font-medium text-sm ${scrolled || !isHome ? 'text-gray-700' : 'text-white/90'}`}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className={`font-medium transition-colors hover:text-brand-orange ${scrolled || !isHome ? 'text-gray-700' : 'text-white/90'}`}>
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2.5 bg-brand-orange text-white rounded-xl hover:bg-brand-orange-dark transition-all hover:scale-105 shadow-md"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-brand-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={openCart}
              className="relative p-2 bg-brand-orange text-white rounded-xl"
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-dark text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${scrolled || !isHome ? 'text-gray-700' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="/restaurant" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 font-medium hover:text-brand-orange">
                Menu
              </Link>
              <Link href="/restaurant#offers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 font-medium hover:text-brand-orange">
                Offers
              </Link>
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <User size={16} className="text-brand-orange" />
                    <span className="text-gray-700 font-medium">{user.name}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-brand-orange font-medium">
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-red-500 font-medium w-full">
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-outline flex-1 text-center text-sm py-2">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary flex-1 text-center text-sm py-2">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
