import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [copiedSql, setCopiedSql] = useState(false);

  const sampleSqlSnippet = `-- 1. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT NOT NULL UNIQUE,
  tour_id TEXT NOT NULL,
  tour_title TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  traveler_count INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  special_requests TEXT,
  total_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Automated Email Notifications Log
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const handleCopySql = () => {
    navigator.clipboard?.writeText(sampleSqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col relative"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Supabase, GitHub &amp; Vercel Integration
              </h2>
              <p className="text-xs text-stone-400">
                Cloud Database Architecture &amp; One-Click Deployment Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Resilient Dual-Mode Storage:</strong> Runs with zero downtime locally, and links to your Supabase project as soon as environment variables are added.
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">
            {isSupabaseConfigured ? 'Supabase Connected' : 'Ready to Connect'}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Step 1: Supabase Schema */}
          <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Supabase Database Schema (PostgreSQL)
                </h3>
              </div>

              <button
                onClick={handleCopySql}
                className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Run this in your <strong>Supabase Dashboard &gt; SQL Editor</strong> to create the tables for <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">tours</code>, <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">bookings</code>, and <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">notifications</code>:
            </p>

            <pre className="bg-stone-900 text-stone-200 text-[11px] p-3.5 rounded-xl font-mono overflow-x-auto max-h-40 scrollbar-thin">
              {sampleSqlSnippet}
            </pre>
          </div>

          {/* Step 2: Environment Variables */}
          <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Environment Variables Checklist
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="font-mono text-stone-800">VITE_SUPABASE_URL</span>
                <span className="text-stone-500 text-[11px]">Your Supabase Project URL</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="font-mono text-stone-800">VITE_SUPABASE_ANON_KEY</span>
                <span className="text-stone-500 text-[11px]">Public Client Key</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="font-mono text-stone-800">OWNER_EMAIL</span>
                <span className="text-amber-700 font-mono text-[11px]">anmolrahangdale69@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Step 3: Vercel & GitHub Deployment */}
          <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                3
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Deploying with GitHub &amp; Vercel
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-start gap-2">
                <Github className="w-4 h-4 text-stone-800 mt-0.5 shrink-0" />
                <span><strong>Step A:</strong> Push this repository to your GitHub account (all configuration, <code className="bg-stone-200 px-1 rounded">vercel.json</code>, and API routes are included).</span>
              </li>
              <li className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-stone-800 mt-0.5 shrink-0" />
                <span><strong>Step B:</strong> Log in to <strong className="text-stone-900">Vercel.com</strong> &gt; Add New Project &gt; Import from GitHub.</span>
              </li>
              <li className="flex items-start gap-2">
                <Terminal className="w-4 h-4 text-stone-800 mt-0.5 shrink-0" />
                <span><strong>Step C:</strong> Add your Supabase environment variables in Vercel's Environment Variables panel and click <strong>Deploy</strong>.</span>
              </li>
            </ul>
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
            >
              Close Guide
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
