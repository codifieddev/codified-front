'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { logoutUser } from '@/redux/slices/auth/authSlice';
import { setEditMode } from '@/redux/slices/pages/pagesSlice';
import EditModeToggle from '@/components/layout/EditModeToggle/EditModeToggle';
import LeadsModal from '@/components/layout/AdminBar/LeadsModal';
import { LogOut, ExternalLink, ShieldCheck, Loader2, Inbox } from 'lucide-react';

const OPERATOR_ROLES = new Set(['admin', 'staff', 'business_admin', 'tenant_admin', 'platform_admin', 'super_admin']);

export default function AdminBar() {
  const dispatch = useAppDispatch();
  const { authUser, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLeads, setShowLeads] = useState(false);

  const role = authUser?.role?.toLowerCase() || '';
  if (!isAuthenticated || !OPERATOR_ROLES.has(role)) return null;

  const base = (process.env.NEXT_PUBLIC_KALP_ADMIN_URL || 'https://zero.kalptree.xyz').replace(/\/+$/, '');
  const tenant = process.env.NEXT_PUBLIC_TENANT_SLUG || 'codified-web-solution';

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      dispatch(setEditMode(false));
      await dispatch(logoutUser()).unwrap();
    } catch {
      // ignore
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-[10000] flex min-h-10 items-center justify-between gap-3 border-b border-cyan/20 bg-[#070b14]/95 px-4 py-2 text-xs text-white backdrop-blur shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan/15 text-cyan border border-cyan/30">
            <ShieldCheck size={13} />
          </span>
          <strong className="font-medium tracking-tight">Kalp Operator</strong>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] font-mono text-cyan-300 border border-white/10 uppercase">
            {role.replaceAll('_', ' ')}
          </span>
          {authUser?.email && (
            <span className="hidden md:inline text-white/40 text-[11px] font-mono">
              ({authUser.email})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowLeads(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/90 hover:bg-white/10 hover:border-cyan/50 hover:text-cyan transition-all duration-200 cursor-pointer"
            title="View Contact Enquiries & Leads"
          >
            <Inbox size={13} />
            <span>Leads</span>
          </button>
          <EditModeToggle />
          <a
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 text-xs font-mono text-cyan hover:bg-cyan/20 hover:border-cyan/50 transition-all duration-200"
            href={`${base}/${tenant}/dashboard`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Admin Dashboard"
          >
            <span>Open Admin</span>
            <ExternalLink size={12} />
          </a>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-mono text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="Logout from admin session"
          >
            {loggingOut ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <LogOut size={12} />
            )}
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>

      <LeadsModal isOpen={showLeads} onClose={() => setShowLeads(false)} />
    </>
  );
}
