import React, { useState } from 'react';
import { 
  X, 
  Inbox, 
  Mail, 
  Send, 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Search, 
  Eye, 
  Database,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { BookingSubmission, OwnerEmailNotification, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';
import { AGENCY_DETAILS } from '../data/toursData';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingSubmission[];
  notifications: OwnerEmailNotification[];
  currency: CurrencyCode;
  onRefresh: () => void;
  onOpenSupabaseModal: () => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  bookings,
  notifications,
  currency,
  onRefresh,
  onOpenSupabaseModal
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'inbox' | 'bookings' | 'overview'>('inbox');
  const [selectedNotification, setSelectedNotification] = useState<OwnerEmailNotification | null>(
    notifications[0] || null
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalGuests = bookings.reduce((sum, b) => sum + b.travelerCount, 0);

  // Filtered notifications
  const filteredNotifs = notifications.filter(n => 
    n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.bookingData?.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col relative"
        role="dialog"
      >
        {/* Top Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  Agency Owner Portal &amp; Email Dispatch Center
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Incoming notifications configured for:{' '}
                <strong className="text-amber-300 font-mono">{AGENCY_DETAILS.ownerEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors text-xs flex items-center gap-1"
              title="Refresh Records"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Sync</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between px-6 bg-stone-100 border-b border-stone-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'inbox'
                  ? 'border-amber-600 text-amber-800 bg-white shadow-sm'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mail className="w-4 h-4 text-amber-600" />
              <span>Owner Email Inbox ({notifications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'border-amber-600 text-amber-800 bg-white shadow-sm'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>All Bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-amber-600 text-amber-800 bg-white shadow-sm'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Agency Overview</span>
            </button>
          </div>

          <button
            onClick={onOpenSupabaseModal}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-900 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-lg font-medium cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span>Supabase DB &amp; Vercel Setup</span>
          </button>
        </div>

        {/* Tab 1: Owner Email Inbox Viewer */}
        {activeTab === 'inbox' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
            {/* Left: Email Notification List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-stone-200 bg-stone-50 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-stone-200">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search sent email alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-xs rounded-xl pl-8 pr-3 py-1.5 border border-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-stone-200">
                {filteredNotifs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500">
                    No matching email alerts found. Book a tour to see immediate notifications!
                  </div>
                ) : (
                  filteredNotifs.map((notif) => {
                    const isSelected = selectedNotification?.id === notif.id;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => setSelectedNotification(notif)}
                        className={`p-3.5 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-100/70 border-l-4 border-amber-600'
                            : 'hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                          <span className="font-mono font-semibold text-amber-800">
                            {notif.bookingReference}
                          </span>
                          <span className="text-[10px]">
                            {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-stone-900 line-clamp-1 mb-1">
                          {notif.bookingData?.tourTitle || notif.subject}
                        </div>

                        <div className="text-[11px] text-stone-600 flex items-center justify-between">
                          <span>Guest: {notif.bookingData?.customerName}</span>
                          <span className="font-mono text-emerald-700 font-semibold">
                            ${notif.bookingData?.totalPrice.toLocaleString()}
                          </span>
                        </div>

                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Delivered to {notif.toEmail}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Rendered HTML Email Preview */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {selectedNotification ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Email Header Bar */}
                  <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs text-stone-700 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-stone-900">
                        {selectedNotification.subject}
                      </span>
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                        Dispatched Immediately
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[11px] text-stone-500 pt-1">
                      <span><strong>To:</strong> {selectedNotification.toEmail}</span>
                      <span><strong>From:</strong> Aura Voyages Automated Dispatch &lt;bookings@auravoyages.com&gt;</span>
                      <span><strong>Date:</strong> {new Date(selectedNotification.sentAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Rendered HTML Email Frame */}
                  <div className="flex-1 overflow-y-auto p-4 bg-stone-100">
                    <div 
                      className="max-w-2xl mx-auto shadow-md rounded-xl overflow-hidden bg-white"
                      dangerouslySetInnerHTML={{ __html: selectedNotification.htmlPreview }} 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-stone-400">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  <p className="text-sm">Select an email alert from the left to view the complete transmitted dossier.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: All Bookings List */}
        {activeTab === 'bookings' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Expedition</th>
                    <th className="py-3 px-4">Departure</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {bookings.map((b) => (
                    <tr key={b.bookingReference} className="hover:bg-stone-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                        {b.bookingReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{b.customerName}</div>
                        <div className="text-[11px] text-stone-500">{b.customerEmail}</div>
                        {b.customerPhone && <div className="text-[10px] text-stone-400">{b.customerPhone}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800">{b.tourTitle}</div>
                        <div className="text-[11px] text-stone-500">{b.destination}</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700">
                        {new Date(b.departureDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-stone-700">
                        {b.travelerCount} Guests
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {formatPrice(b.totalPrice, currency)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Agency Overview & Statistics */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                  Total Confirmed Value
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-950 mt-1">
                  {formatPrice(totalRevenue, currency)}
                </div>
                <span className="text-xs text-amber-700 mt-1 block">Across {bookings.length} reservations</span>
              </div>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-xs uppercase font-bold text-stone-600 tracking-wider">
                  Total Guests Hosted
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 mt-1">
                  {totalGuests}
                </div>
                <span className="text-xs text-stone-500 mt-1 block">Worldwide expeditions</span>
              </div>

              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                  Owner Email Delivery
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-950 mt-1">
                  100%
                </div>
                <span className="text-xs text-emerald-700 mt-1 block">Immediate dispatch to {AGENCY_DETAILS.ownerEmail}</span>
              </div>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <h3 className="font-display font-bold text-lg text-stone-900">
                Database &amp; Deployment Architecture
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                This project is configured with a PostgreSQL schema ready for <strong>Supabase</strong>, full-stack server integration on Express, and ready for deployment to <strong>Vercel</strong> and synchronization with <strong>GitHub</strong>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onOpenSupabaseModal}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Open Supabase &amp; Vercel Guide
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
