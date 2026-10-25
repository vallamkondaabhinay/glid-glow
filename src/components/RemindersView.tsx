import React, { useState } from 'react';
import {
  CalendarClock,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Reminder, ReminderStatus, VIPTier } from '../types';

interface RemindersViewProps {
  reminders: Reminder[];
  onSimulateSend: (reminderId: string) => void;
  onReschedule: (reminderId: string, newDate: string) => void;
  onSnooze: (reminderId: string) => void;
  onMarkConfirmed: (reminderId: string) => void;
  onSimulateBatch: () => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onSimulateSend,
  onReschedule,
  onSnooze,
  onMarkConfirmed,
  onSimulateBatch,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rescheduleModalId, setRescheduleModalId] = useState<string | null>(null);
  const [newDateInput, setNewDateInput] = useState<string>('2026-11-01');

  // Counts
  const queuedCount = reminders.filter((r) => r.status === 'queued' || r.status === 'scheduled').length;
  const sentCount = reminders.filter((r) => r.status === 'sent' || r.status === 'responded').length;
  const confirmedCount = reminders.filter((r) => r.status === 'confirmed').length;

  const filteredReminders = reminders.filter((r) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'queued') return r.status === 'queued' || r.status === 'scheduled';
    if (filterStatus === 'sent') return r.status === 'sent' || r.status === 'responded';
    if (filterStatus === 'confirmed') return r.status === 'confirmed';
    if (filterStatus === 'snoozed') return r.status === 'snoozed';
    return true;
  });

  const getStatusBadge = (status: ReminderStatus) => {
    switch (status) {
      case 'queued':
        return { label: 'Queued for Dispatch', class: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'scheduled':
        return { label: 'Scheduled', class: 'text-[#4A2038] bg-[#E9D5D8]/30 border-[#C7A56A]/30' };
      case 'sent':
        return { label: 'Dispatched via WhatsApp', class: 'text-blue-800 bg-blue-50 border-blue-200' };
      case 'responded':
        return { label: 'Guest Responded', class: 'text-purple-800 bg-purple-50 border-purple-200' };
      case 'confirmed':
        return { label: 'Appointment Confirmed', class: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      case 'snoozed':
        return { label: 'Snoozed (+7d)', class: 'text-slate-600 bg-slate-100 border-slate-200' };
    }
  };

  const getDueDaysText = (dueDateStr: string) => {
    const today = new Date('2026-10-25');
    const due = new Date(dueDateStr);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, isOverdue: true };
    }
    if (diffDays === 0) {
      return { text: 'Due Today', isOverdue: false, isToday: true };
    }
    return { text: `In ${diffDays} days`, isOverdue: false };
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Dispatch Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281522] tracking-tight">
            Retention Operations Center
          </h1>
          <p className="text-xs text-[#8A7D84] mt-0.5">
            Cadence check-ins, automated WhatsApp outreach queue, and booking confirmations
          </p>
        </div>

        {queuedCount > 0 && (
          <button
            onClick={onSimulateBatch}
            className="flex items-center gap-2 px-4 py-2 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-xs font-semibold rounded-lg border border-[#C7A56A]/50 shadow-md transition-all self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5 text-[#C7A56A]" />
            <span>Simulate Dispatch All Due ({queuedCount})</span>
          </button>
        )}
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#C7A56A]/25 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8A7D84] block font-medium">
              Awaiting Dispatch
            </span>
            <span className="font-serif text-2xl font-bold text-[#281522] tabular-nums">
              {queuedCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#FBF7F1] border border-[#C7A56A]/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#4A2038]" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#C7A56A]/25 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8A7D84] block font-medium">
              Dispatched Outbound
            </span>
            <span className="font-serif text-2xl font-bold text-[#4A2038] tabular-nums">
              {sentCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#FBF7F1] border border-[#C7A56A]/30 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-[#C7A56A]" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#C7A56A]/25 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8A7D84] block font-medium">
              Confirmed Re-bookings
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-800 tabular-nums">
              {confirmedCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#C7A56A]/25 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8A7D84] block font-medium">
              Cadence Conversion
            </span>
            <span className="font-serif text-2xl font-bold text-[#281522] tabular-nums">
              74.2%
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#FBF7F1] border border-[#C7A56A]/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#C7A56A]" />
          </div>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#C7A56A]/25 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#FBF7F1] rounded-lg border border-[#C7A56A]/20">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-white text-[#281522] shadow-xs'
                : 'text-[#8A7D84] hover:text-[#281522]'
            }`}
          >
            All ({reminders.length})
          </button>
          <button
            onClick={() => setFilterStatus('queued')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'queued'
                ? 'bg-white text-[#281522] shadow-xs font-semibold'
                : 'text-[#8A7D84] hover:text-[#281522]'
            }`}
          >
            Due / Queued ({queuedCount})
          </button>
          <button
            onClick={() => setFilterStatus('sent')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'sent'
                ? 'bg-white text-[#281522] shadow-xs'
                : 'text-[#8A7D84] hover:text-[#281522]'
            }`}
          >
            Dispatched ({sentCount})
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'confirmed'
                ? 'bg-white text-[#281522] shadow-xs'
                : 'text-[#8A7D84] hover:text-[#281522]'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>
        </div>

        <span className="text-xs text-[#8A7D84]">
          Automated WhatsApp triggers simulated safely without external SMS fees
        </span>
      </div>

      {/* Operations Queue Table */}
      <div className="bg-white rounded-xl border border-[#C7A56A]/25 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#281522] text-[#FBF7F1] border-b border-[#C7A56A]/30">
                <th className="py-3 px-4 font-serif font-semibold">Guest & VIP Tier</th>
                <th className="py-3 px-3 font-serif font-semibold">Target Service Cadence</th>
                <th className="py-3 px-3 font-serif font-semibold">Due Target</th>
                <th className="py-3 px-3 font-serif font-semibold">Delivery Status</th>
                <th className="py-3 px-3 font-serif font-semibold">Channel</th>
                <th className="py-3 px-4 text-center font-serif font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FBF7F1]">
              {filteredReminders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8A7D84]">
                    <Sparkles className="w-6 h-6 text-[#C7A56A]/60 mx-auto mb-2" />
                    <p className="font-serif text-sm text-[#281522]">No reminders in this queue</p>
                  </td>
                </tr>
              ) : (
                filteredReminders.map((rem) => {
                  const status = getStatusBadge(rem.status);
                  const dueInfo = getDueDaysText(rem.dueDate);
                  return (
                    <tr
                      key={rem.id}
                      className="hover:bg-[#FBF7F1]/80 transition-colors"
                    >
                      {/* Guest */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#281522]">{rem.clientName}</div>
                        <div className="flex items-center gap-2 text-[11px] text-[#8A7D84]">
                          <span className="font-mono">{rem.clientPhone}</span>
                          <span>·</span>
                          <span className="text-[#C7A56A] font-medium">{rem.clientTier}</span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#281522]">{rem.serviceName}</div>
                        <span className="text-[10px] text-[#8A7D84]">
                          {rem.cadenceWeeks}-week cadence refresh
                        </span>
                      </td>

                      {/* Due date */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-medium text-[#29252A] tabular-nums">
                          {rem.dueDate}
                        </div>
                        <span
                          className={`text-[10px] font-medium ${
                            dueInfo.isOverdue
                              ? 'text-rose-700 font-semibold'
                              : dueInfo.isToday
                              ? 'text-amber-800 font-semibold'
                              : 'text-[#8A7D84]'
                          }`}
                        >
                          {dueInfo.text}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border inline-block ${status.class}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Channel */}
                      <td className="py-3.5 px-3">
                        <span className="text-[11px] font-mono text-[#4A2038] font-medium">
                          {rem.channel}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Send WhatsApp Simulate */}
                          {rem.status !== 'confirmed' && (
                            <button
                              onClick={() => onSimulateSend(rem.id)}
                              className="px-2.5 py-1 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-[11px] font-medium rounded-md transition-all border border-[#C7A56A]/40"
                              title="Simulate WhatsApp Send"
                            >
                              Simulate Send
                            </button>
                          )}

                          {/* Reschedule Button */}
                          <button
                            onClick={() => {
                              setRescheduleModalId(rem.id);
                              setNewDateInput(rem.dueDate);
                            }}
                            className="p-1.5 text-[#8A7D84] hover:text-[#281522] hover:bg-[#FBF7F1] rounded-md transition-colors"
                            title="Reschedule Due Date"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>

                          {/* Snooze 7 Days */}
                          <button
                            onClick={() => onSnooze(rem.id)}
                            className="p-1.5 text-[#8A7D84] hover:text-[#4A2038] hover:bg-[#FBF7F1] rounded-md transition-colors"
                            title="Snooze 7 Days"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>

                          {/* Mark Confirmed */}
                          {rem.status !== 'confirmed' && (
                            <button
                              onClick={() => onMarkConfirmed(rem.id)}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Mark Confirmed / Rebooked"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a0c16]/60 backdrop-blur-xs">
          <div className="bg-[#FBF7F1] rounded-xl p-5 border border-[#C7A56A]/40 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-serif text-base font-semibold text-[#281522]">
              Reschedule Revisit Cadence
            </h3>
            <p className="text-xs text-[#8A7D84]">
              Select a new target date for the automated WhatsApp cadence trigger.
            </p>
            <input
              type="date"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#C7A56A]/40 rounded-lg focus:outline-none focus:border-[#C7A56A]"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleModalId(null)}
                className="px-3 py-1.5 text-xs text-[#8A7D84] hover:text-[#281522]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReschedule(rescheduleModalId, newDateInput);
                  setRescheduleModalId(null);
                }}
                className="px-4 py-1.5 bg-[#281522] text-[#FBF7F1] text-xs font-semibold rounded-lg border border-[#C7A56A]/40 hover:bg-[#4A2038]"
              >
                Confirm New Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
