import React from 'react';
import {
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  Scissors,
  MessageSquare,
  History,
  Tag,
  Shield,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { Client } from '../types';

interface ClientDetailDrawerProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onSendReminder: (client: Client) => void;
}

export const ClientDetailDrawer: React.FC<ClientDetailDrawerProps> = ({
  client,
  isOpen,
  onClose,
  onEdit,
  onSendReminder,
}) => {
  if (!isOpen || !client) return null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond Atelier':
        return 'text-[#C7A56A] bg-[#281522] border-[#C7A56A]/60';
      case 'Gold Privé':
        return 'text-[#8c703d] bg-[#F6F0E7] border-[#C7A56A]/40';
      case 'Silver Silhouette':
        return 'text-[#574F55] bg-white border-slate-300';
      default:
        return 'text-[#8A7D84] bg-white border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return { label: 'Overdue for Cadence', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'due_soon':
        return { label: 'Revisit Due Soon', color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'rebooked':
        return { label: 'Rebooked & Confirmed', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      default:
        return { label: 'On Cadence Rhythm', color: 'text-[#4A2038] bg-[#E9D5D8]/30 border-[#C7A56A]/30' };
    }
  };

  const statusInfo = getStatusBadge(client.revisitStatus);

  // Generate WhatsApp web direct link
  const cleanPhone = client.phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(
    `Bonjour ${client.fullName}, warm greetings from Maison Gild & Glow. Vivienne Laurent wanted to ensure your ${client.lastService} is still looking luminous. Would you like to reserve your upcoming cadence appointment?`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a0c16]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF7F1] border-l border-[#C7A56A]/30 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 bg-[#281522] border-b border-[#C7A56A]/30 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#4A2038] border border-[#C7A56A]/50 flex items-center justify-center font-serif text-lg font-bold text-[#DFC394]">
                {client.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-semibold text-[#FBF7F1]">
                    {client.fullName}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm border ${getTierColor(
                      client.vipTier
                    )}`}
                  >
                    {client.vipTier}
                  </span>
                  <span className="text-[11px] text-[#E9D5D8]/70 font-mono">
                    ID: {client.id}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#E9D5D8]/70 hover:text-[#FBF7F1] rounded-md transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Spend Stats Bar */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-[#C7A56A]/30 text-center">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8A7D84]">
                  Lifetime Value
                </span>
                <span className="font-serif text-base font-bold text-[#281522] tabular-nums">
                  ${client.lifetimeValue.toLocaleString()}
                </span>
              </div>
              <div className="border-x border-[#FBF7F1]">
                <span className="block text-[10px] uppercase tracking-wider text-[#8A7D84]">
                  Total Visits
                </span>
                <span className="font-serif text-base font-bold text-[#281522] tabular-nums">
                  {client.totalVisits}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8A7D84]">
                  Avg Ticket
                </span>
                <span className="font-serif text-base font-bold text-[#4A2038] tabular-nums">
                  ${client.avgTicket}
                </span>
              </div>
            </div>

            {/* Revisit Cadence Status Card */}
            <div className="p-4 bg-white rounded-xl border border-[#C7A56A]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#29252A]">Revisit Intelligence</span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-[#8A7D84] block">Last Service Date</span>
                  <span className="font-medium text-[#29252A] font-mono tabular-nums">
                    {client.lastVisitDate}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8A7D84] block">Optimal Target Date</span>
                  <span className="font-medium text-[#4A2038] font-mono tabular-nums font-semibold">
                    {client.nextCadenceDate} ({client.cadenceWeeks}w cadence)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#FBF7F1] flex items-center justify-between text-xs text-[#8A7D84]">
                <span>Preferred Lead Stylist:</span>
                <span className="font-semibold text-[#281522]">{client.preferredStylist}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 text-xs">
              <h4 className="font-serif text-sm font-semibold text-[#281522]">
                Contact & Communication
              </h4>
              <div className="p-3 bg-white rounded-xl border border-[#C7A56A]/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#8A7D84]">
                    <Phone className="w-3.5 h-3.5 text-[#C7A56A]" /> WhatsApp
                  </span>
                  <span className="font-mono text-[#29252A] font-medium">{client.phone}</span>
                </div>
                {client.email && (
                  <div className="flex items-center justify-between border-t border-[#FBF7F1] pt-2">
                    <span className="flex items-center gap-2 text-[#8A7D84]">
                      <Mail className="w-3.5 h-3.5 text-[#C7A56A]" /> Email
                    </span>
                    <span className="text-[#29252A]">{client.email}</span>
                  </div>
                )}
                {client.preferredContactWindow && (
                  <div className="flex items-center justify-between border-t border-[#FBF7F1] pt-2">
                    <span className="flex items-center gap-2 text-[#8A7D84]">
                      <Clock className="w-3.5 h-3.5 text-[#C7A56A]" /> Best Window
                    </span>
                    <span className="text-[#29252A]">{client.preferredContactWindow}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Color Formula */}
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-semibold text-[#281522] flex items-center justify-between">
                <span>Color Formula & Prescription</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C7A56A]" />
              </h4>
              <div className="p-3 bg-gradient-to-br from-[#F6F0E7] to-white rounded-xl border border-[#C7A56A]/40 font-mono text-xs text-[#4A2038] leading-relaxed">
                {client.colorFormula || 'No custom formula recorded. Standard gloss base applied.'}
              </div>
            </div>

            {/* Concierge Notes */}
            {client.notes && (
              <div className="space-y-1.5 text-xs">
                <h4 className="font-serif text-sm font-semibold text-[#281522]">
                  Concierge & Hospitality Notes
                </h4>
                <p className="p-3 bg-white rounded-xl border border-[#C7A56A]/25 text-[#29252A] leading-relaxed">
                  {client.notes}
                </p>
              </div>
            )}

            {/* Tags */}
            {client.tags && client.tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#8A7D84] uppercase tracking-wider block font-medium">
                  Atelier Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {client.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-[#4A2038] bg-[#E9D5D8]/40 border border-[#C7A56A]/30 px-2.5 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-white border-t border-[#C7A56A]/25 flex items-center gap-2">
            <button
              onClick={() => onSendReminder(client)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-xs font-semibold rounded-lg border border-[#C7A56A]/50 shadow-md transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C7A56A]" />
              <span>Simulate Cadence Send</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#F6F0E7] hover:bg-[#E9D5D8] text-[#281522] rounded-lg border border-[#C7A56A]/30 transition-colors"
              title="Open WhatsApp Web Direct"
            >
              <ExternalLink className="w-4 h-4 text-[#4A2038]" />
            </a>

            <button
              onClick={() => onEdit(client)}
              className="p-2.5 bg-[#F6F0E7] hover:bg-[#E9D5D8] text-[#281522] rounded-lg border border-[#C7A56A]/30 transition-colors"
              title="Edit Profile"
            >
              <Edit className="w-4 h-4 text-[#4A2038]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
