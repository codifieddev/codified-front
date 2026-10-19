import fs from 'fs';
import path from 'path';

export interface LeadItem {
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

const LEADS_FILE = path.join(process.cwd(), 'src', 'data', 'leads.json');

export function getLeads(): LeadItem[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('[LeadsStore] Failed to read leads:', err);
    return [];
  }
}

export function saveLead(lead: Omit<LeadItem, 'id' | 'createdAt'>): LeadItem {
  const newLead: LeadItem = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const existing = getLeads();
    existing.unshift(newLead); // Newest first
    fs.writeFileSync(LEADS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.error('[LeadsStore] Failed to save lead:', err);
  }

  return newLead;
}

export function updateLeadStatus(id: string, status: 'sent' | 'pending_hostinger', error?: string | null): boolean {
  try {
    const existing = getLeads();
    const idx = existing.findIndex((l) => l.id === id);
    if (idx !== -1) {
      existing[idx].emailStatus = status;
      if (error !== undefined) {
        existing[idx].smtpError = error;
      }
      fs.writeFileSync(LEADS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
      return true;
    }
    return false;
  } catch (err) {
    console.error('[LeadsStore] Failed to update lead status:', err);
    return false;
  }
}
