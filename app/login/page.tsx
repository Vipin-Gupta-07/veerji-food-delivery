'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email required';
    if (!form.password) newErrors.password = 'Password required';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setUser({ ...data.data, token: data.data.token });
      document.cookie = `auth-token=${data.data.token}; path=/; max-age=${7 * 24 * 3600}`;
      toast.success(`Welcome back, ${data.data.name.split(' ')[0]}! 👋`);
      router.push(data.data.role === 'admin' ? '/admin' : '/restaurant');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card-hover p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-orange-glow">
              <span className="font-display font-extrabold text-2xl text-white">VJ</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-brand-dark mb-1">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sign in to your Veer Ji account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                  className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-600 font-medium mb-1.5">🔑 Demo Credentials</p>
            <div className="space-y-1 text-xs text-blue-500">
              <p>Admin: <span className="font-mono">admin@veerji.com</span> / <span className="font-mono">Admin@123456</span></p>
              <p>User: <span className="font-mono">user@veerji.com</span> / <span className="font-mono">User@123456</span></p>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand-orange font-semibold hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
