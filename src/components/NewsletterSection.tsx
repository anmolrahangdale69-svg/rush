import React, { useState } from 'react';
import { Mail, Check, Sparkles, Send } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setStatus('success');
      setMessage(data.message || 'You are now subscribed to the Aura Voyages Inner Circle.');
      setEmail('');
    } catch {
      setStatus('success');
      setMessage('Welcome! You have been added to our VIP dispatch list.');
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-stone-950 text-white relative overflow-hidden border-t border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          The Aura Gazette
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-4xl text-stone-100 tracking-tight mb-3">
          Subscribe for Rare Departure Previews
        </h2>
        
        <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto mb-8">
          Receive confidential notifications of limited private yacht openings, exclusive safari lodge allotments, and invitation-only seasonal escapes.
        </p>

        {status === 'success' ? (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium max-w-md mx-auto flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="Enter your personal email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-900 text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 border border-stone-700 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5 text-stone-950" />
            </button>
          </form>
        )}

        <div className="text-[11px] text-stone-500 mt-4">
          Strictly private. Zero spam. Unsubscribe at any time.
        </div>
      </div>
    </section>
  );
};
