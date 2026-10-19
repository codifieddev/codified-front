'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, RefreshCw, CheckCircle2, Clock, FileText } from 'lucide-react';

interface Lead {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  requirement?: string;
  message: string;
  resumeName?: string | null;
  emailStatus: 'sent' | 'pending_hostinger';
  smtpError?: string | null;
}

export default function LeadsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error('Failed to fetch leads', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen]);

  const handleRetry = async (leadId: string) => {
    try {
      setRetryingId(leadId);
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
      } else {
        alert(`Retry failed: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setRetryingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-white/10 bg-[#070b14] text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">Contact Enquiries &amp; Leads</h2>
            <span className="rounded-full bg-cyan/10 border border-cyan/20 px-2 py-0.5 text-xs font-mono text-cyan">
              {leads.length} Total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {leads.length === 0 ? (
            <div className="py-12 text-center text-white/40 font-mono text-sm">
              {loading ? 'Loading enquiries...' : 'No enquiries received yet.'}
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs transition-colors hover:border-white/20"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-white font-medium">{lead.name}</strong>
                    {lead.requirement && (
                      <span className="rounded bg-cyan/10 border border-cyan/30 px-2 py-0.5 text-[10px] font-mono text-cyan">
                        {lead.requirement}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-white/40">
                    <Calendar size={12} />
                    <span>{new Date(lead.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-white/70">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-cyan shrink-0" />
                    <a href={`mailto:${lead.email}`} className="text-white hover:underline truncate">
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-cyan shrink-0" />
                      <a href={`tel:${lead.phone}`} className="text-white hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-black/40 p-3 text-white/80 font-sans whitespace-pre-wrap mb-3 border border-white/5">
                  {lead.message}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    {lead.emailStatus === 'sent' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                        <CheckCircle2 size={13} />
                        <span>Email Delivered (Hostinger SMTP)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-400 font-mono text-[11px]" title={lead.smtpError || 'Pending'}>
                        <Clock size={13} />
                        <span>Saved Locally (Hostinger Outbound Suspended)</span>
                      </span>
                    )}
                    {lead.resumeName && (
                      <span className="inline-flex items-center gap-1 text-white/50 text-[11px] font-mono">
                        <FileText size={12} />
                        <span>{lead.resumeName}</span>
                      </span>
                    )}
                  </div>

                  {lead.emailStatus !== 'sent' && (
                    <button
                      onClick={() => handleRetry(lead.id)}
                      disabled={retryingId === lead.id}
                      className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[11px] font-mono text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={11} className={retryingId === lead.id ? 'animate-spin' : ''} />
                      <span>{retryingId === lead.id ? 'Retrying...' : 'Retry Send'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
