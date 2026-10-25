import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, Phone, Mail, Scissors, Calendar, Clock, Heart } from 'lucide-react';
import { Client, VIPTier } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<Client> & { fullName: string; phone: string }) => void;
  initialClient?: Client | null;
  stylists: Array<{ name: string; specialty: string }>;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClient,
  stylists,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vipTier, setVipTier] = useState<VIPTier>('Gold Privé');
  const [preferredStylist, setPreferredStylist] = useState(stylists[0]?.name || 'Vivienne Laurent');
  const [lastService, setLastService] = useState('Balayage & Gloss Ritual');
  const [cadenceWeeks, setCadenceWeeks] = useState(6);
  const [lastVisitDate, setLastVisitDate] = useState('2026-10-15');
  const [colorFormula, setColorFormula] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredContactWindow, setPreferredContactWindow] = useState('Mornings (10 AM - 12 PM)');
  const [tagsInput, setTagsInput] = useState('Balayage Couture, VIP Care');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialClient) {
      setFullName(initialClient.fullName);
      setPhone(initialClient.phone);
      setEmail(initialClient.email || '');
      setVipTier(initialClient.vipTier);
      setPreferredStylist(initialClient.preferredStylist);
      setLastService(initialClient.lastService);
      setCadenceWeeks(initialClient.cadenceWeeks);
      setLastVisitDate(initialClient.lastVisitDate);
      setColorFormula(initialClient.colorFormula || '');
      setNotes(initialClient.notes || '');
      setPreferredContactWindow(initialClient.preferredContactWindow || 'Mornings');
      setTagsInput(initialClient.tags?.join(', ') || '');
    } else {
      setFullName('');
      setPhone('');
      setEmail('');
      setVipTier('Gold Privé');
      setPreferredStylist(stylists[0]?.name || 'Vivienne Laurent');
      setLastService('Balayage & Gloss Ritual');
      setCadenceWeeks(6);
      setLastVisitDate(new Date().toISOString().split('T')[0]);
      setColorFormula('');
      setNotes('');
      setPreferredContactWindow('Mornings (10 AM - 12 PM)');
      setTagsInput('Balayage Couture, VIP Care');
    }
    setErrors({});
  }, [initialClient, isOpen, stylists]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full guest name is required';
    if (!phone.trim()) newErrors.phone = 'Valid phone number is required';
    if (!lastService.trim()) newErrors.lastService = 'Service is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      id: initialClient?.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      vipTier,
      preferredStylist,
      lastService,
      cadenceWeeks: Number(cadenceWeeks),
      lastVisitDate,
      colorFormula: colorFormula.trim(),
      notes: notes.trim(),
      preferredContactWindow,
      tags,
    });

    onClose();
  };

  const services = [
    { name: 'Balayage & Gloss Ritual', defaultWeeks: 6 },
    { name: 'Bespoke Precision Cut & Blowout', defaultWeeks: 5 },
    { name: 'Caviar Scalp & Fiber Spa', defaultWeeks: 4 },
    { name: 'Keratin Smoothing Infusion', defaultWeeks: 12 },
    { name: 'Root Touch-up & Couture Color', defaultWeeks: 4 },
    { name: 'Bridal Styling & Radiance Trial', defaultWeeks: 3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a0c16]/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FBF7F1] rounded-2xl border border-[#C7A56A]/40 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Banner */}
        <div className="bg-[#281522] px-6 py-5 border-b border-[#C7A56A]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4A2038] border border-[#C7A56A]/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#C7A56A]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#FBF7F1] tracking-wide">
                {initialClient ? 'Edit Guest Profile' : 'Register Bespoke Guest'}
              </h2>
              <p className="text-xs text-[#E9D5D8]/70">
                Maison Gild & Glow Client Folio & Cadence Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#E9D5D8]/70 hover:text-[#FBF7F1] rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Guest Identity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Full Legal / Preferred Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Éléonore de Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.fullName
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-[#C7A56A]/40 focus:border-[#C7A56A] focus:ring-[#C7A56A]'
                  }`}
                />
              </div>
              {errors.fullName && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.fullName}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                WhatsApp / Mobile Phone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="+1 (212) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-[#C7A56A]/40 focus:border-[#C7A56A] focus:ring-[#C7A56A]'
                  }`}
                />
              </div>
              {errors.phone && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Email & Tier Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="guest@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] focus:ring-1 focus:ring-[#C7A56A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                VIP Patron Tier
              </label>
              <select
                value={vipTier}
                onChange={(e) => setVipTier(e.target.value as VIPTier)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] focus:ring-1 focus:ring-[#C7A56A]"
              >
                <option value="Diamond Atelier">Diamond Atelier (Signature Couture)</option>
                <option value="Gold Privé">Gold Privé (Bi-monthly Regular)</option>
                <option value="Silver Silhouette">Silver Silhouette (Seasonal Patron)</option>
                <option value="Member">Member (New Guest)</option>
              </select>
            </div>
          </div>

          {/* Stylist & Service Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Lead Master Stylist
              </label>
              <div className="relative">
                <Scissors className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={preferredStylist}
                  onChange={(e) => setPreferredStylist(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] focus:ring-1 focus:ring-[#C7A56A]"
                >
                  {stylists.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({s.specialty})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Primary / Last Service
              </label>
              <select
                value={lastService}
                onChange={(e) => {
                  const s = e.target.value;
                  setLastService(s);
                  const matched = services.find((srv) => srv.name === s);
                  if (matched) setCadenceWeeks(matched.defaultWeeks);
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] focus:ring-1 focus:ring-[#C7A56A]"
              >
                {services.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} (Recommended: {s.defaultWeeks} weeks)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Revisit Cadence & Visit Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-white rounded-xl border border-[#C7A56A]/30">
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Last Service Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={lastVisitDate}
                  onChange={(e) => setLastVisitDate(e.target.value)}
                  className="w-full pl-9 pr-2 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Revisit Cadence (Weeks)
              </label>
              <input
                type="number"
                min="1"
                max="26"
                value={cadenceWeeks}
                onChange={(e) => setCadenceWeeks(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A] font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Contact Preference
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Mornings"
                  value={preferredContactWindow}
                  onChange={(e) => setPreferredContactWindow(e.target.value)}
                  className="w-full pl-9 pr-2 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A]"
                />
              </div>
            </div>
          </div>

          {/* Color Formula Prescription */}
          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1">
              Bespoke Color Formula / Scalp Prescription
            </label>
            <input
              type="text"
              placeholder="e.g. Wella Blondor 20vol + Redken Shades EQ 09P/09V roots 07N"
              value={colorFormula}
              onChange={(e) => setColorFormula(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] focus:ring-1 focus:ring-[#C7A56A] font-mono text-[#4A2038]"
            />
          </div>

          {/* Consultation Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1">
              Concierge Notes & Guest Preferences
            </label>
            <textarea
              rows={2}
              placeholder="Beverage preference, suite requests, sensitivities, anniversary..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] focus:ring-1 focus:ring-[#C7A56A] resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1">
              Guest Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="Balayage Specialist, High LTV, Champagne VIP"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A]"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#C7A56A]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#8A7D84] hover:text-[#281522] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-xs font-semibold rounded-lg border border-[#C7A56A]/50 shadow-md transition-all active:scale-[0.98]"
            >
              {initialClient ? 'Update Guest Profile' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
