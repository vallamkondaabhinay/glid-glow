import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Smartphone,
  Check,
  CheckCheck,
  Send,
  Sliders,
  Settings,
  ShieldCheck,
  RefreshCw,
  Info,
  Clock,
  PhoneCall,
  User,
} from 'lucide-react';
import { SalonSettings, MessageTemplate } from '../types';

interface WhatsAppViewProps {
  settings: SalonSettings;
  onSaveSettings: (newSettings: Partial<SalonSettings>) => void;
  onSimulateGuestReply: (text: string) => void;
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({
  settings,
  onSaveSettings,
  onSimulateGuestReply,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    settings.templates[0]?.id || 'tpl-cadence-balayage'
  );
  const [editingTemplateText, setEditingTemplateText] = useState<string>(
    settings.templates[0]?.text || ''
  );
  const [simulatedReplies, setSimulatedReplies] = useState<string[]>([]);
  const [replyInput, setReplyInput] = useState('');

  const currentTemplate =
    settings.templates.find((t) => t.id === selectedTemplateId) || settings.templates[0];

  const handleSelectTemplate = (tpl: MessageTemplate) => {
    setSelectedTemplateId(tpl.id);
    setEditingTemplateText(tpl.text);
  };

  const handleSaveTemplate = () => {
    const updated = settings.templates.map((t) =>
      t.id === selectedTemplateId ? { ...t, text: editingTemplateText } : t
    );
    onSaveSettings({ templates: updated });
  };

  const insertVariable = (variable: string) => {
    setEditingTemplateText((prev) => prev + ` ${variable} `);
  };

  // Substitute sample data for the phone preview
  const previewText = editingTemplateText
    .replace(/{{guest_name}}/g, 'Éléonore de Vance')
    .replace(/{{customer_name}}/g, 'Éléonore de Vance')
    .replace(/{{service}}/g, 'Balayage & Gloss Ritual')
    .replace(/{{stylist}}/g, 'Vivienne Laurent')
    .replace(/{{salon_name}}/g, settings.salonName)
    .replace(/{{due_date}}/g, 'October 24, 2026')
    .replace(/{{booking_link}}/g, 'https://gildandglow.com/reserve/eleonore');

  const handleSendSimulatedReply = (reply: string) => {
    if (!reply.trim()) return;
    setSimulatedReplies((prev) => [...prev, reply]);
    onSimulateGuestReply(reply);
    setReplyInput('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281522] tracking-tight">
          WhatsApp Atelier & Delivery Engine
        </h1>
        <p className="text-xs text-[#8A7D84] mt-0.5">
          Configure automated client revisit triggers, bespoke message templates, and live message simulations
        </p>
      </div>

      {/* Simulation Banner Notice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#281522] via-[#4A2038] to-[#281522] text-[#FBF7F1] border border-[#C7A56A]/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C7A56A]/20 border border-[#C7A56A] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#C7A56A]" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold text-[#FBF7F1] flex items-center gap-2">
              <span>Simulation Engine Active</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
                Safe Mode
              </span>
            </h3>
            <p className="text-xs text-[#E9D5D8]/80 mt-0.5 leading-relaxed">
              All WhatsApp dispatches, webhook confirmations, and client replies are executed in a realistic hermetic simulator. Zero real SMS costs or unwanted outbound texts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-[#C7A56A] uppercase tracking-wider block font-medium">
              Concierge Line
            </span>
            <span className="text-xs font-mono text-[#FBF7F1]">
              {settings.whatsappPhoneNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Settings & Templates, Right Phone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Configuration & Template Studio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Provider Settings Card */}
          <div className="bg-white rounded-xl p-5 border border-[#C7A56A]/25 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold text-[#281522] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C7A56A]" />
                <span>Engine & Provider Settings</span>
              </h3>
              <span className="text-xs text-[#8A7D84]">Provider: Hermetic Simulator</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#29252A] mb-1">
                  Active Dispatch Provider
                </label>
                <select
                  value={settings.whatsappProvider}
                  onChange={(e) => onSaveSettings({ whatsappProvider: e.target.value as any })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A]"
                >
                  <option value="simulation">Hermetic Simulation Engine (Recommended)</option>
                  <option value="cloud_api">Meta WhatsApp Cloud API (Simulated)</option>
                  <option value="twilio">Twilio Programmable Messaging (Simulated)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#29252A] mb-1">
                  Sender Business Number
                </label>
                <input
                  type="text"
                  value={settings.whatsappPhoneNumber}
                  onChange={(e) => onSaveSettings({ whatsappPhoneNumber: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A] font-mono"
                />
              </div>
            </div>

            {/* Automation Toggles */}
            <div className="pt-3 border-t border-[#FBF7F1] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#29252A] block">
                    Automated Cadence Revisit Triggers
                  </span>
                  <span className="text-[11px] text-[#8A7D84]">
                    Queue WhatsApp reminders when client reaches 6-week or 12-week service interval
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoCadenceEnabled}
                  onChange={(e) => onSaveSettings({ autoCadenceEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#4A2038] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Template Studio Card */}
          <div className="bg-white rounded-xl p-5 border border-[#C7A56A]/25 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#281522]">
                  Bespoke Template Studio
                </h3>
                <p className="text-xs text-[#8A7D84]">
                  Edit copy, dynamic placeholders, and triggers for client outreach
                </p>
              </div>
            </div>

            {/* Template Selector Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#FBF7F1] rounded-lg border border-[#C7A56A]/20">
              {settings.templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedTemplateId === tpl.id
                      ? 'bg-white text-[#281522] shadow-xs font-semibold'
                      : 'text-[#8A7D84] hover:text-[#281522]'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>

            {/* Placeholder helper buttons */}
            <div>
              <span className="text-[11px] font-semibold text-[#8A7D84] block mb-1.5">
                Insert Dynamic Attributes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '{{guest_name}}',
                  '{{service}}',
                  '{{stylist}}',
                  '{{salon_name}}',
                  '{{due_date}}',
                  '{{booking_link}}',
                ].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="px-2 py-1 text-[11px] font-mono bg-[#FBF7F1] hover:bg-[#E9D5D8]/50 text-[#4A2038] border border-[#C7A56A]/30 rounded-md transition-colors"
                  >
                    + {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Textarea */}
            <div>
              <label className="block text-xs font-semibold text-[#29252A] mb-1">
                WhatsApp Message Body
              </label>
              <textarea
                rows={5}
                value={editingTemplateText}
                onChange={(e) => setEditingTemplateText(e.target.value)}
                className="w-full p-3 text-xs bg-white border border-[#C7A56A]/40 rounded-xl focus:outline-none focus:border-[#C7A56A] focus:ring-1 focus:ring-[#C7A56A] leading-relaxed resize-none text-[#29252A]"
              />
              <div className="flex items-center justify-between text-[11px] text-[#8A7D84] mt-1">
                <span>{editingTemplateText.length} characters</span>
                <span>Category: {currentTemplate?.category}</span>
              </div>
            </div>

            {/* Save Template Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-xs font-semibold rounded-lg border border-[#C7A56A]/40 shadow-xs transition-all active:scale-[0.98]"
              >
                Save Template Changes
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Phone Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-[#1a0c16] p-3 rounded-[38px] shadow-2xl border-4 border-[#281522] relative">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-10 h-1 bg-zinc-800 rounded-full" />
            </div>

            {/* Simulated Phone Screen */}
            <div className="bg-[#EFEAE2] rounded-[28px] overflow-hidden flex flex-col h-[520px] shadow-inner text-[#111B21]">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#281522] border border-[#C7A56A] flex items-center justify-center text-[10px] font-serif font-bold text-[#DFC394] shrink-0">
                    G&G
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold truncate leading-tight">
                        Maison Gild & Glow
                      </span>
                      <ShieldCheck className="w-3 h-3 text-emerald-300 shrink-0" />
                    </div>
                    <span className="text-[10px] text-white/80 leading-none">
                      Verified Business Account
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Chat Viewport */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#EFEAE2] text-xs">
                {/* Security encryption banner */}
                <div className="text-center">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#FFF3C4] text-[10px] text-[#54656F] shadow-xs">
                    Messages are end-to-end encrypted.
                  </span>
                </div>

                {/* Outbound Salon Message Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-[#D9FDD3] rounded-lg p-2.5 shadow-xs text-xs text-[#111B21] relative space-y-1">
                    <p className="leading-relaxed whitespace-pre-wrap">{previewText}</p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] pt-0.5">
                      <span>10:24 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                    </div>
                  </div>
                </div>

                {/* Simulated Inbound Client Replies */}
                {simulatedReplies.map((reply, idx) => (
                  <div key={idx} className="flex justify-start">
                    <div className="max-w-[85%] bg-white rounded-lg p-2.5 shadow-xs text-xs text-[#111B21] space-y-1">
                      <p className="leading-relaxed">{reply}</p>
                      <div className="flex items-center justify-end text-[10px] text-[#667781]">
                        <span>10:28 AM</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Preset Reply Chips */}
              <div className="p-2 bg-[#F0F2F5] border-t border-zinc-200 space-y-2">
                <span className="text-[10px] text-[#54656F] block font-medium">
                  Simulate Client Inbound Response:
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Yes, Friday at 2:30 PM with Vivienne works perfectly!',
                    'Could we adjust to Saturday morning at 10 AM?',
                    'Already rebooked through concierge, thank you!',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSendSimulatedReply(preset)}
                      className="text-[10px] text-[#075E54] bg-white border border-zinc-300 px-2 py-0.5 rounded-full hover:bg-zinc-100 transition-colors text-left truncate max-w-full"
                    >
                      "{preset.slice(0, 32)}..."
                    </button>
                  ))}
                </div>

                {/* Custom simulated reply input */}
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Type simulated client reply..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendSimulatedReply(replyInput);
                    }}
                    className="flex-1 px-2.5 py-1 text-xs bg-white border border-zinc-300 rounded-full focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendSimulatedReply(replyInput)}
                    className="p-1.5 bg-[#075E54] text-white rounded-full hover:bg-[#128C7E] transition-colors"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
