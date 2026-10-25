import React from 'react';
import {
  Sparkles,
  Users,
  Award,
  CalendarClock,
  CircleDollarSign,
  Send,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Scissors,
  Crown,
} from 'lucide-react';
import { DashboardMetrics, Client, Reminder } from '../types';
import { StatsCard } from './StatsCard';
import { RetentionChart } from './RetentionChart';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  clients: Client[];
  reminders: Reminder[];
  salonName: string;
  onNavigate: (tab: ActiveTab) => void;
  onSelectClient: (client: Client) => void;
  onSimulateSend: (reminderId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  clients,
  reminders,
  salonName,
  onNavigate,
  onSelectClient,
  onSimulateSend,
}) => {
  // Urgent reminders: due_soon or overdue
  const urgentReminders = reminders
    .filter((r) => r.status === 'queued' || r.status === 'scheduled')
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Editorial Welcome Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#281522] via-[#4A2038] to-[#281522] border border-[#C7A56A]/50 p-6 sm:p-8 text-[#FBF7F1] shadow-xl overflow-hidden">
        {/* Subtle decorative gold corner embellishments */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C7A56A]/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#C7A56A]/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C7A56A] font-semibold">
                Haute Coiffure Intelligence
              </span>
              <span className="text-[#C7A56A]/60" aria-hidden="true">·</span>
              <span className="text-xs text-[#E9D5D8]/80 font-mono">
                October 25, 2026
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FBF7F1] text-balance">
              Welcome back to {salonName}
            </h1>

            <p className="text-xs sm:text-sm text-[#E9D5D8]/85 leading-relaxed">
              Your automated revisit cadence has retained{' '}
              <strong className="text-[#FBF7F1] font-semibold">{metrics.activeClients} active luxury patrons</strong>{' '}
              with a current return rate of{' '}
              <strong className="text-[#DFC394] font-semibold">{metrics.retentionRate}%</strong>.
              There are {metrics.dueRemindersCount} priority guests due for cadence outreach this week.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigate('reminders')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C7A56A] hover:bg-[#d4b57e] text-[#1a0c16] text-xs font-bold rounded-lg shadow-lg shadow-black/20 transition-all active:scale-[0.98]"
            >
              <span>View Cadence Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('whatsapp')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#281522]/80 hover:bg-[#281522] text-[#FBF7F1] text-xs font-medium rounded-lg border border-[#C7A56A]/40 transition-colors"
            >
              <span>WhatsApp Atelier Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Redesigned Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Client Retention Rate"
          value={`${metrics.retentionRate}%`}
          delta={{
            value: `+${metrics.retentionRateDelta}%`,
            isPositive: true,
            label: 'vs Q3 cohort',
          }}
          icon={Award}
          sparklineData={[88, 89, 90, 91, 91.5, 92, 92.4]}
        />

        <StatsCard
          title="Active Salon Patrons"
          value={metrics.activeClients}
          delta={{
            value: `+${metrics.activeClientsDelta}`,
            isPositive: true,
            label: 'new clients',
          }}
          icon={Users}
          sparklineData={[210, 222, 230, 235, 240, 244, 248]}
        />

        <StatsCard
          title="Average Visit Ticket"
          value={`$${metrics.avgTicket}`}
          delta={{
            value: `+$${metrics.avgTicketDelta}`,
            isPositive: true,
            label: 'ticket expansion',
          }}
          icon={Crown}
          sparklineData={[240, 252, 260, 268, 275, 280, 285]}
        />

        <StatsCard
          title="Awaiting Cadence Outreach"
          value={metrics.dueRemindersCount}
          delta={{
            value: `${metrics.deliverySuccessRate}%`,
            isPositive: true,
            label: 'delivery success',
          }}
          icon={CalendarClock}
          sparklineData={[18, 16, 15, 17, 14, 15, 14]}
        />
      </div>

      {/* Real-Data Interactive Charts */}
      <RetentionChart metrics={metrics} />

      {/* Urgent Revisit Actions Strip */}
      <div className="bg-white rounded-xl p-6 border border-[#C7A56A]/25 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#281522] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C7A56A]" />
              <span>Priority Revisit Cadences Awaiting Dispatch</span>
            </h3>
            <p className="text-xs text-[#8A7D84]">
              High-value patrons currently due or overdue for recurring service touch-points
            </p>
          </div>

          <button
            onClick={() => onNavigate('reminders')}
            className="text-xs font-semibold text-[#4A2038] hover:text-[#281522] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Open complete operations queue</span>
            <ArrowRight className="w-3 h-3 text-[#C7A56A]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {urgentReminders.map((rem) => {
            const client = clients.find((c) => c.id === rem.clientId);
            return (
              <div
                key={rem.id}
                className="p-4 rounded-xl bg-[#FBF7F1] border border-[#C7A56A]/30 flex flex-col justify-between space-y-3 hover:border-[#C7A56A] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-[#C7A56A] tracking-wider">
                      {rem.clientTier}
                    </span>
                    <span className="font-mono text-[10px] text-[#4A2038] font-semibold">
                      Due: {rem.dueDate}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#281522]">
                    {rem.clientName}
                  </h4>
                  <p className="text-xs text-[#8A7D84] mt-0.5">{rem.serviceName}</p>
                </div>

                <div className="pt-2 border-t border-[#E9D5D8]/40 flex items-center justify-between gap-2">
                  {client && (
                    <button
                      onClick={() => onSelectClient(client)}
                      className="text-xs text-[#8A7D84] hover:text-[#281522] flex items-center gap-1 font-medium"
                    >
                      <Eye className="w-3 h-3 text-[#C7A56A]" />
                      <span>Folio</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSimulateSend(rem.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-[11px] font-semibold rounded-md border border-[#C7A56A]/40 transition-all active:scale-[0.98]"
                  >
                    <Send className="w-3 h-3 text-[#C7A56A]" />
                    <span>Send WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Cohort Breakdown Matrix */}
      <div className="bg-white rounded-xl p-6 border border-[#C7A56A]/25 shadow-xs space-y-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#281522]">
            Service Revisit Cadence Matrix
          </h3>
          <p className="text-xs text-[#8A7D84]">
            Optimal recommended cycles, retention benchmarks, and average spend by luxury treatment
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#C7A56A]/20 text-[#8A7D84] font-medium pb-2">
                <th className="py-2 font-serif">Treatment Service</th>
                <th className="py-2">Standard Cycle</th>
                <th className="py-2">Active Cohort</th>
                <th className="py-2">Return Retention</th>
                <th className="py-2 text-right">Avg Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FBF7F1]">
              {metrics.cohortRetention.map((cohort) => (
                <tr key={cohort.service} className="hover:bg-[#FBF7F1]/50">
                  <td className="py-2.5 font-medium text-[#281522] flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-[#C7A56A]" />
                    <span>{cohort.service}</span>
                  </td>
                  <td className="py-2.5 text-[#8A7D84] font-mono tabular-nums">
                    {cohort.cadenceWeeks} weeks
                  </td>
                  <td className="py-2.5 text-[#29252A] tabular-nums">
                    {cohort.clientCount} patrons
                  </td>
                  <td className="py-2.5 font-semibold text-[#4A2038] tabular-nums">
                    {cohort.revisitRate}%
                  </td>
                  <td className="py-2.5 text-right font-serif font-bold text-[#281522] tabular-nums">
                    ${cohort.avgSpend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
