'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || form.phone.length < 10) e.phone = 'Valid 10-digit phone required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setUser({ ...data.data, token: data.data.token });
      document.cookie = `auth-token=${data.data.token}; path=/; max-age=${7 * 24 * 3600}`;
      toast.success(`Welcome to Veer Ji, ${data.data.name.split(' ')[0]}! 🎉`);
      router.push('/restaurant');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-8 pt-24">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card-hover p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-orange-glow">
              <span className="font-display font-extrabold text-2xl text-white">VJ</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-brand-dark mb-1">Create Account</h1>
            <p className="text-gray-500 text-sm">Join thousands of happy customers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
              { field: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'john@example.com' },
              { field: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '9876543210' },
            ].map(({ field, label, icon: Icon, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={type} value={form[field as keyof typeof form]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`input-field pl-10 ${errors[field] ? 'border-red-400' : ''}`}
                    placeholder={placeholder} maxLength={field === 'phone' ? 10 : undefined} />
                </div>
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  placeholder="Repeat your password" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={18} /><span>Create Account</span></>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-orange font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
