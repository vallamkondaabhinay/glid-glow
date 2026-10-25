import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Check,
  CheckCheck,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { MessageLog, MessageDeliveryStatus } from '../types';

interface MessageLogsViewProps {
  logs: MessageLog[];
  onRetryMessage: (logId: string) => void;
}

export const MessageLogsView: React.FC<MessageLogsViewProps> = ({ logs, onRetryMessage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone.includes(searchTerm) ||
      log.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.messageBody.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: MessageDeliveryStatus) => {
    switch (status) {
      case 'sent':
        return {
          label: 'Sent',
          icon: Check,
          class: 'text-zinc-600 bg-zinc-100 border-zinc-200',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          icon: CheckCheck,
          class: 'text-blue-700 bg-blue-50 border-blue-200',
        };
      case 'read':
        return {
          label: 'Read by Guest',
          icon: CheckCheck,
          class: 'text-sky-700 bg-sky-50 border-sky-200',
        };
      case 'responded':
        return {
          label: 'Responded',
          icon: MessageSquare,
          class: 'text-purple-700 bg-purple-50 border-purple-200',
        };
      case 'failed':
        return {
          label: 'Delivery Failed',
          icon: AlertTriangle,
          class: 'text-rose-700 bg-rose-50 border-rose-200',
        };
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toISOString().split('T')[0];
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281522] tracking-tight">
            Message Delivery & Audit Logs
          </h1>
          <p className="text-xs text-[#8A7D84] mt-0.5">
            Complete deliverability history, guest responses, and diagnostic dispatch traces
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-[#8A7D84]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
          <span>Webhook Live Feed Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#C7A56A]/25 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patron, phone, or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FBF7F1] border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A]"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#FBF7F1] rounded-lg border border-[#C7A56A]/20">
          {['all', 'delivered', 'read', 'responded', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-white text-[#281522] shadow-xs font-semibold'
                  : 'text-[#8A7D84] hover:text-[#281522]'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-[#C7A56A]/25 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#281522] text-[#FBF7F1] border-b border-[#C7A56A]/30">
                <th className="py-3 px-4 font-serif font-semibold">Sent Timestamp</th>
                <th className="py-3 px-3 font-serif font-semibold">Patron Recipient</th>
                <th className="py-3 px-3 font-serif font-semibold">Target Service</th>
                <th className="py-3 px-3 font-serif font-semibold">Status & Delivery Timeline</th>
                <th className="py-3 px-3 font-serif font-semibold">Outbound Message Preview</th>
                <th className="py-3 px-4 text-center font-serif font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FBF7F1]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8A7D84]">
                    <Sparkles className="w-6 h-6 text-[#C7A56A]/60 mx-auto mb-2" />
                    <p className="font-serif text-sm text-[#281522]">No message logs found</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const statusInfo = getStatusBadge(log.status);
                  const Icon = statusInfo.icon;
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-[#FBF7F1]/80 transition-colors">
                        {/* Timestamp */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#29252A] tabular-nums">
                          <div>{formatDate(log.sentAt)}</div>
                          <div className="text-[#8A7D84]">{formatTime(log.sentAt)}</div>
                        </td>

                        {/* Recipient */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-[#281522]">{log.clientName}</div>
                          <div className="text-[11px] text-[#8A7D84] font-mono">{log.phone}</div>
                        </td>

                        {/* Service */}
                        <td className="py-3.5 px-3 text-[#29252A]">
                          <span className="font-medium">{log.serviceName}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border ${statusInfo.class}`}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{statusInfo.label}</span>
                            </span>
                          </div>

                          {/* Failure reason if failed */}
                          {log.failureReason && (
                            <div className="text-[10px] text-rose-700 mt-1 max-w-xs leading-tight">
                              {log.failureReason}
                            </div>
                          )}

                          {/* Response snippet if responded */}
                          {log.responseBody && (
                            <div className="text-[10px] text-purple-800 italic mt-1 max-w-xs truncate">
                              "{log.responseBody}"
                            </div>
                          )}
                        </td>

                        {/* Message Preview */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <p className="text-[11px] text-[#29252A] line-clamp-2 leading-relaxed">
                            {log.messageBody}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                              className="text-[11px] text-[#4A2038] hover:underline font-medium"
                            >
                              {isExpanded ? 'Hide' : 'Inspect'}
                            </button>

                            {/* Retry button if failed */}
                            {log.status === 'failed' && (
                              <button
                                onClick={() => onRetryMessage(log.id)}
                                className="flex items-center gap-1 px-2 py-1 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] rounded text-[10px] font-medium transition-colors"
                              >
                                <RotateCcw className="w-2.5 h-2.5 text-[#C7A56A]" />
                                <span>Retry</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Inspector Row */}
                      {isExpanded && (
                        <tr className="bg-[#F6F0E7]/60">
                          <td colSpan={6} className="p-4 border-t border-[#C7A56A]/20">
                            <div className="space-y-3 max-w-3xl">
                              <div className="flex items-center justify-between text-xs border-b border-[#C7A56A]/20 pb-2">
                                <span className="font-semibold text-[#281522]">
                                  Dispatch Audit Metadata
                                </span>
                                <span className="font-mono text-[#8A7D84]">Log ID: {log.id}</span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div>
                                  <span className="text-[#8A7D84] block text-[10px]">
                                    Outbound Sent
                                  </span>
                                  <span className="font-mono">{formatTime(log.sentAt)}</span>
                                </div>
                                <div>
                                  <span className="text-[#8A7D84] block text-[10px]">
                                    Handset Delivered
                                  </span>
                                  <span className="font-mono">{formatTime(log.deliveredAt)}</span>
                                </div>
                                <div>
                                  <span className="text-[#8A7D84] block text-[10px]">
                                    Guest Read (Blue ticks)
                                  </span>
                                  <span className="font-mono">{formatTime(log.readAt)}</span>
                                </div>
                                <div>
                                  <span className="text-[#8A7D84] block text-[10px]">
                                    Guest Inbound Reply
                                  </span>
                                  <span className="font-mono">{formatTime(log.respondedAt)}</span>
                                </div>
                              </div>

                              <div className="p-3 bg-white rounded-lg border border-[#C7A56A]/30 text-xs">
                                <span className="font-semibold text-[#281522] block mb-1">
                                  Full Message Payload:
                                </span>
                                <p className="leading-relaxed whitespace-pre-wrap text-[#29252A]">
                                  {log.messageBody}
                                </p>
                              </div>

                              {log.responseBody && (
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900">
                                  <span className="font-semibold block mb-0.5">
                                    Guest Inbound Response:
                                  </span>
                                  <p>"{log.responseBody}"</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
