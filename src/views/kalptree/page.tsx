'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginUser, logout, clearError } from '@/redux/slices/auth/authSlice';
import Navigation from '@/components/layout/Navigation/Navigation';
import Footer from '@/components/layout/Footer/Footer';
import CinematicInit from '@/components/providers/CinematicInit/CinematicInit';
import {
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Layers,
  Activity,
  ArrowRight,
  LogOut,
  ExternalLink,
  Lock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function KalpTreePage({ locale = 'en' }: { locale?: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, authUser, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('business@codified.com');
  const [password, setPassword] = useState('1234567899');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const adminBase = (
    process.env.NEXT_PUBLIC_KALP_ADMIN_URL || 'https://zero.kalptree.xyz'
  ).replace(/\/+$/, '');
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'codified-web-solution';
  const adminDashboardUrl = `${adminBase}/${tenantSlug}/dashboard`;

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    dispatch(loginUser({ email: email.trim(), password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <CinematicInit />
      <Navigation />

      <main className="relative min-h-screen flex items-center justify-center px-4 py-28 md:py-36 overflow-hidden">
        {/* Subtle Atmospheric Background Gradients */}
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, rgba(29, 195, 243, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(243, 0, 166, 0.05) 0%, transparent 50%), #04060d',
          }}
        />

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Login Card OR Authenticated Status Card     */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div
              className="card relative p-7 sm:p-10 rounded-2xl border border-[var(--line-strong)] backdrop-blur-xl shadow-2xl"
              style={{
                background: 'rgba(7, 11, 24, 0.85)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(29, 195, 243, 0.05)',
              }}
            >
              <span className="corner tl"></span>
              <span className="corner tr"></span>
              <span className="corner bl"></span>
              <span className="corner br"></span>

              {isAuthenticated ? (
                /* ── ALREADY LOGGED IN VIEW ── */
                <div className="flex flex-col items-center text-center py-4">
                  <div className="relative mb-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white"
                      style={{
                        background: 'linear-gradient(135deg, rgba(29, 195, 243, 0.2), rgba(7, 11, 24, 0.9))',
                        border: '1px solid var(--primary)',
                        boxShadow: '0 0 25px rgba(29, 195, 243, 0.3)',
                      }}
                    >
                      <ShieldCheck size={38} className="text-[var(--cyan)]" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#070b18] flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
                    <CheckCircle2 size={13} />
                    Authorized Session Active
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-sm text-white/60 mb-1 font-mono">
                    {authUser?.email || 'Administrator'}
                  </p>
                  <p className="text-xs text-[var(--cyan)] font-mono uppercase tracking-wider mb-8">
                    Role: {authUser?.role?.replaceAll('_', ' ') || 'Admin Operator'}
                  </p>

                  <div className="w-full flex flex-col gap-3">
                    <a
                      href={adminDashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-full justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
                      style={{
                        background: 'var(--primary)',
                        color: '#04060d',
                      }}
                    >
                      <span>Open Admin Dashboard</span>
                      <ExternalLink size={16} />
                    </a>

                    <Link
                      href="/"
                      className="btn ghost w-full justify-center gap-2 py-3.5 rounded-xl text-sm border border-white/10 hover:border-white/20 transition-all"
                    >
                      <span>Return to Website</span>
                      <ArrowRight size={16} />
                    </Link>

                    <button
                      onClick={handleLogout}
                      type="button"
                      className="mt-2 flex items-center justify-center gap-2 py-2 text-xs text-white/40 hover:text-rose-400 transition-colors font-mono"
                    >
                      <LogOut size={14} />
                      <span>Sign Out of Session</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ── LOGIN FORM VIEW ── */
                <div>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest text-[var(--cyan)] bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                        <Lock size={12} />
                        KalpTree Portal
                      </span>
                      <span className="text-xs text-white/40 font-mono">v2.4</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                      Admin Login
                    </h1>
                    <p className="text-xs sm:text-sm text-white/50">
                      Enter your credentials to access the administration dashboard.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@codified.com"
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--primary)] transition-all font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-white/60">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[var(--primary)] transition-all font-sans pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 pb-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-white/50 select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 accent-[var(--primary)] cursor-pointer"
                        />
                        <span>Remember session</span>
                      </label>
                      <span className="text-[11px] text-white/40 font-mono">
                        Protected by Kalp
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn w-full justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
                      style={{
                        background: loading
                          ? 'rgba(255,255,255,0.1)'
                          : 'var(--primary)',
                        color: loading ? '#fff' : '#04060d',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                    <Link
                      href="/"
                      className="hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <span>← Back to Storefront</span>
                    </Link>
                    <span className="font-mono text-[11px] text-white/30">
                      SSL 256-Bit
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Store & Platform Administration Showcase   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 rounded-2xl border border-white/5 bg-gradient-to-br from-[#070b18]/80 to-[#04060d]/80 backdrop-blur-md">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[var(--cyan)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6">
                <Sparkles size={13} />
                Store Administration
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
                Manage Your Platform with <span className="grad-text">Complete Control</span>
              </h2>

              <p className="text-sm sm:text-base text-white/60 mb-8 max-w-xl leading-relaxed">
                Access your centralized operations dashboard to manage pages, customize content, monitor analytics, and track platform performance in real time.
              </p>

              {/* 3 Feature Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[var(--primary)]/30 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 text-[var(--cyan)] flex items-center justify-center mb-3">
                    <Layers size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">
                    Catalog &amp; Content
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Organize pages, update text, configure variants, and deploy changes effortlessly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[var(--primary)]/30 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 text-[var(--cyan)] flex items-center justify-center mb-3">
                    <Activity size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">
                    Tracking &amp; Orders
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Review user activity, process submissions, and view live operational statistics.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[var(--primary)]/30 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 text-[var(--cyan)] flex items-center justify-center mb-3">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">
                    Secure Controls
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Protected operator console with encrypted sessions and multi-tenant isolation.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Metadata Info Pill */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Portal: Codified Web Solutions</span>
              </div>
              <div>
                <span>Access: Authorized Personnel Only</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
