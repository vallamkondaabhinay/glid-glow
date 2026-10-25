import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Building2,
  Users,
  Calendar,
  Save,
  RotateCcw,
  Download,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SalonSettings, Client } from '../types';

interface SettingsViewProps {
  settings: SalonSettings;
  clients: Client[];
  onSaveSettings: (newSettings: Partial<SalonSettings>) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  clients,
  onSaveSettings,
  onResetData,
}) => {
  const [salonName, setSalonName] = useState(settings.salonName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [location, setLocation] = useState(settings.location);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [currency, setCurrency] = useState(settings.currency);
  const [cadences, setCadences] = useState<Record<string, number>>(settings.defaultCadences);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleCadenceChange = (serviceName: string, weeks: number) => {
    setCadences((prev) => ({
      ...prev,
      [serviceName]: weeks,
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      salonName,
      tagline,
      location,
      contactEmail,
      contactPhone,
      currency,
      defaultCadences: cadences,
    });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'VIP Tier', 'Preferred Stylist', 'Last Service', 'Last Visit Date', 'Next Cadence Date', 'Cadence Weeks', 'LTV', 'Total Visits'];
    const rows = clients.map((c) => [
      c.id,
      `"${c.fullName}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.vipTier}"`,
      `"${c.preferredStylist}"`,
      `"${c.lastService}"`,
      c.lastVisitDate,
      c.nextCadenceDate,
      c.cadenceWeeks,
      c.lifetimeValue,
      c.totalVisits,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gild_and_glow_guests_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281522] tracking-tight">
          Salon Profile & Cadence Configuration
        </h1>
        <p className="text-xs text-[#8A7D84] mt-0.5">
          Atelier branding, service cycle intervals, master stylists, and database export
        </p>
      </div>

      {/* Atelier Profile Card */}
      <div className="bg-white rounded-xl p-6 border border-[#C7A56A]/25 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-semibold text-[#281522] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#C7A56A]" />
            <span>Atelier Identity & Concierge Details</span>
          </h3>
          <span className="text-[11px] font-mono text-[#4A2038] bg-[#E9D5D8]/40 px-2 py-0.5 rounded border border-[#C7A56A]/30">
            Multi-Branch Active
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Personalized Salon Name
              </label>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBF7F1] border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] font-serif text-sm font-semibold text-[#281522]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Luxury Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBF7F1] border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] text-[#29252A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#29252A] mb-1">
              Physical Atelier Location & Branch Flagship
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-[#FBF7F1] border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] text-[#29252A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Concierge Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBF7F1] border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Concierge Phone Line
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBF7F1] border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-[#FBF7F1] border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A]"
              >
                <option value="$">$ USD (United States Dollar)</option>
                <option value="€">€ EUR (Euro)</option>
                <option value="£">£ GBP (British Pound)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-xs font-semibold rounded-lg border border-[#C7A56A]/50 shadow-md transition-all active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5 text-[#C7A56A]" />
              <span>Save Atelier Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recommended Revisit Cadence Intervals */}
      <div className="bg-white rounded-xl p-6 border border-[#C7A56A]/25 shadow-xs space-y-4">
        <div>
          <h3 className="font-serif text-base font-semibold text-[#281522] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C7A56A]" />
            <span>Service Revisit Cadence Rules</span>
          </h3>
          <p className="text-xs text-[#8A7D84]">
            These default week intervals automatically calculate upcoming cadence targets when a service is logged
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(cadences).map(([service, weeks]) => (
            <div
              key={service}
              className="p-3 bg-[#FBF7F1] rounded-lg border border-[#C7A56A]/25 flex items-center justify-between"
            >
              <span className="text-xs font-medium text-[#281522]">{service}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={weeks}
                  onChange={(e) => handleCadenceChange(service, Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs text-center bg-white border border-[#C7A56A]/40 rounded-md font-mono"
                />
                <span className="text-[11px] text-[#8A7D84]">weeks</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Stylists Team Roster */}
      <div className="bg-white rounded-xl p-6 border border-[#C7A56A]/25 shadow-xs space-y-4">
        <div>
          <h3 className="font-serif text-base font-semibold text-[#281522] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C7A56A]" />
            <span>Lead Stylists & Directrices</span>
          </h3>
          <p className="text-xs text-[#8A7D84]">
            Stylists assigned to client folios and personalized WhatsApp outreach signatures
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {settings.staff.map((stylist) => (
            <div
              key={stylist.id}
              className="p-3.5 rounded-xl bg-[#FBF7F1] border border-[#C7A56A]/25 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#281522] border border-[#C7A56A]/50 flex items-center justify-center font-serif text-xs font-bold text-[#DFC394]">
                  {stylist.avatarInitials}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#281522]">
                    {stylist.name}
                  </h4>
                  <span className="text-[11px] text-[#4A2038] font-medium block">
                    {stylist.title}
                  </span>
                  <span className="text-[10px] text-[#8A7D84] block">{stylist.specialty}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-[#281522]">
                  {stylist.activeClientsCount}
                </span>
                <span className="text-[10px] text-[#8A7D84] block">Patrons</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management & Export Card */}
      <div className="bg-white rounded-xl p-6 border border-[#C7A56A]/25 shadow-xs space-y-4">
        <div>
          <h3 className="font-serif text-base font-semibold text-[#281522]">
            Data Management & Export
          </h3>
          <p className="text-xs text-[#8A7D84]">
            Export complete customer records to CSV or restore the curated luxury atelier dataset
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#F6F0E7] hover:bg-[#E9D5D8] text-[#281522] text-xs font-semibold rounded-lg border border-[#C7A56A]/40 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#4A2038]" />
            <span>Export Guest Folios (CSV)</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded-lg border border-rose-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
            <span>Restore Curated Salon Dataset</span>
          </button>
        </div>

        {/* Confirmation dialog */}
        {showResetConfirm && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2 mt-3 animate-in fade-in">
            <span className="font-semibold text-rose-900 block">
              Confirm dataset restoration?
            </span>
            <p className="text-rose-800">
              This will re-populate all luxury patrons, reminders, and delivery logs to the fresh curated Maison Gild & Glow dataset.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 bg-white text-zinc-700 rounded-md border border-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1 bg-rose-700 text-white font-semibold rounded-md hover:bg-rose-800"
              >
                Yes, Restore Curated Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
