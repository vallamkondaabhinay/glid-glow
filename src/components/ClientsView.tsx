import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  MessageSquare,
  Eye,
  Edit2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Scissors,
} from 'lucide-react';
import { Client, VIPTier, RevisitStatus } from '../types';

interface ClientsViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onSendReminder: (client: Client) => void;
  onOpenRegisterModal: () => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onSelectClient,
  onEditClient,
  onSendReminder,
  onOpenRegisterModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stylistFilter, setStylistFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'cadence' | 'ltv' | 'lastVisit' | 'name'>('cadence');

  // Unique stylists list
  const stylists = useMemo(() => {
    return Array.from(new Set(clients.map((c) => c.preferredStylist)));
  }, [clients]);

  // Filtered and sorted clients
  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        const matchesSearch =
          searchTerm === '' ||
          client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm) ||
          client.preferredStylist.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.lastService.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTier = tierFilter === 'all' || client.vipTier === tierFilter;
        const matchesStatus = statusFilter === 'all' || client.revisitStatus === statusFilter;
        const matchesStylist = stylistFilter === 'all' || client.preferredStylist === stylistFilter;

        return matchesSearch && matchesTier && matchesStatus && matchesStylist;
      })
      .sort((a, b) => {
        if (sortBy === 'cadence') {
          return new Date(a.nextCadenceDate).getTime() - new Date(b.nextCadenceDate).getTime();
        }
        if (sortBy === 'ltv') {
          return b.lifetimeValue - a.lifetimeValue;
        }
        if (sortBy === 'lastVisit') {
          return new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime();
        }
        if (sortBy === 'name') {
          return a.fullName.localeCompare(b.fullName);
        }
        return 0;
      });
  }, [clients, searchTerm, tierFilter, statusFilter, stylistFilter, sortBy]);

  const getStatusBadge = (status: RevisitStatus) => {
    switch (status) {
      case 'overdue':
        return { label: 'Overdue', class: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'due_soon':
        return { label: 'Due Soon', class: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'rebooked':
        return { label: 'Rebooked', class: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      default:
        return { label: 'On Cadence', class: 'text-[#4A2038] bg-[#E9D5D8]/30 border-[#C7A56A]/30' };
    }
  };

  const getTierBadge = (tier: VIPTier) => {
    switch (tier) {
      case 'Diamond Atelier':
        return 'text-[#C7A56A] font-semibold';
      case 'Gold Privé':
        return 'text-[#8c703d] font-medium';
      case 'Silver Silhouette':
        return 'text-[#574F55]';
      default:
        return 'text-[#8A7D84]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281522] tracking-tight">
            Guest Directory & Client Records
          </h1>
          <p className="text-xs text-[#8A7D84] mt-0.5">
            Bespoke patron profiles, revisit cadence countdowns, and salon service histories
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-xs font-semibold rounded-lg border border-[#C7A56A]/50 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C7A56A]" />
          <span>Register New Guest</span>
        </button>
      </div>

      {/* Modern Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#C7A56A]/25 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, formula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A]"
            />
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A] text-[#29252A]"
            >
              <option value="all">All VIP Tiers</option>
              <option value="Diamond Atelier">Diamond Atelier</option>
              <option value="Gold Privé">Gold Privé</option>
              <option value="Silver Silhouette">Silver Silhouette</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {/* Revisit Cadence Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A] text-[#29252A]"
            >
              <option value="all">All Revisit Cadences</option>
              <option value="due_soon">Due Soon (&le; 7 days)</option>
              <option value="overdue">Overdue for Visit</option>
              <option value="on_cadence">On Cadence Rhythm</option>
              <option value="rebooked">Rebooked / Confirmed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A] text-[#29252A]"
            >
              <option value="cadence">Sort: Cadence Due Date (Urgent)</option>
              <option value="ltv">Sort: Highest Lifetime Value</option>
              <option value="lastVisit">Sort: Most Recent Visit</option>
              <option value="name">Sort: Guest Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Count */}
        <div className="flex items-center justify-between text-xs text-[#8A7D84] pt-2 border-t border-[#FBF7F1]">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <strong className="text-[#281522] font-semibold tabular-nums">
              {filteredClients.length}
            </strong>
            <span>of</span>
            <strong className="text-[#281522] font-semibold tabular-nums">
              {clients.length}
            </strong>
            <span>patrons in database</span>
          </div>

          {(searchTerm || tierFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTierFilter('all');
                setStatusFilter('all');
                setStylistFilter('all');
              }}
              className="text-xs text-[#4A2038] hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Clients Luxury Table */}
      <div className="bg-white rounded-xl border border-[#C7A56A]/25 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#281522] text-[#FBF7F1] border-b border-[#C7A56A]/30 font-medium">
                <th className="py-3 px-4 font-serif tracking-wider font-semibold">Guest Folio</th>
                <th className="py-3 px-3 font-serif tracking-wider font-semibold">VIP Tier</th>
                <th className="py-3 px-3 font-serif tracking-wider font-semibold">Lead Stylist</th>
                <th className="py-3 px-3 font-serif tracking-wider font-semibold">Last Service</th>
                <th className="py-3 px-3 font-serif tracking-wider font-semibold">Next Cadence Target</th>
                <th className="py-3 px-3 font-serif tracking-wider font-semibold text-right">LTV & Visits</th>
                <th className="py-3 px-4 text-center font-serif tracking-wider font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FBF7F1]">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8A7D84]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-6 h-6 text-[#C7A56A]/60" />
                      <p className="text-sm font-serif text-[#281522]">No guest profiles match this criteria</p>
                      <button
                        onClick={onOpenRegisterModal}
                        className="mt-2 text-xs text-[#4A2038] font-semibold underline"
                      >
                        Register a new guest
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const status = getStatusBadge(client.revisitStatus);
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-[#FBF7F1]/80 transition-colors group"
                    >
                      {/* Name & Phone */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectClient(client)}
                          className="text-left group-hover:text-[#4A2038]"
                        >
                          <div className="font-semibold text-[#281522] text-xs">
                            {client.fullName}
                          </div>
                          <div className="text-[11px] text-[#8A7D84] font-mono">
                            {client.phone}
                          </div>
                        </button>
                      </td>

                      {/* Tier */}
                      <td className="py-3 px-3">
                        <span className={`text-[11px] ${getTierBadge(client.vipTier)}`}>
                          {client.vipTier}
                        </span>
                      </td>

                      {/* Stylist */}
                      <td className="py-3 px-3 text-[#29252A]">
                        <span>{client.preferredStylist}</span>
                      </td>

                      {/* Last Service & Date */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#281522]">{client.lastService}</div>
                        <div className="text-[11px] text-[#8A7D84] font-mono tabular-nums">
                          {client.lastVisitDate}
                        </div>
                      </td>

                      {/* Next Cadence & Status */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-[#29252A] tabular-nums">
                            {client.nextCadenceDate}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${status.class}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8A7D84]">
                          {client.cadenceWeeks}-week standard interval
                        </span>
                      </td>

                      {/* LTV & Visits */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-serif font-bold text-[#281522] tabular-nums">
                          ${client.lifetimeValue.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-[#8A7D84] tabular-nums">
                          {client.totalVisits} appointments
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectClient(client)}
                            className="p-1.5 text-[#4A2038] hover:bg-[#E9D5D8]/50 rounded-md transition-colors"
                            title="View Guest Folio"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSendReminder(client)}
                            className="p-1.5 text-[#C7A56A] hover:bg-[#281522] hover:text-[#FBF7F1] rounded-md transition-colors"
                            title="Simulate WhatsApp Cadence Send"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditClient(client)}
                            className="p-1.5 text-[#8A7D84] hover:text-[#281522] hover:bg-[#FBF7F1] rounded-md transition-colors"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
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
    </div>
  );
};
