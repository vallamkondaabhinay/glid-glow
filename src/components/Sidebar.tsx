import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  History,
  MessageSquare,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Building2,
  X,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'clients' | 'reminders' | 'logs' | 'whatsapp' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  dueCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentBranch: string;
  onSwitchBranch: (branch: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  dueCount,
  isOpenMobile,
  onCloseMobile,
  currentBranch,
  onSwitchBranch,
}) => {
  const [showBranchMenu, setShowBranchMenu] = React.useState(false);

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Overview & Retention',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'clients' as ActiveTab,
      label: 'Guest Directory',
      icon: Users,
      badge: null,
    },
    {
      id: 'reminders' as ActiveTab,
      label: 'Cadence Reminders',
      icon: CalendarClock,
      badge: dueCount > 0 ? dueCount : null,
    },
    {
      id: 'logs' as ActiveTab,
      label: 'Message Delivery Logs',
      icon: History,
      badge: null,
    },
    {
      id: 'whatsapp' as ActiveTab,
      label: 'WhatsApp Atelier',
      icon: MessageSquare,
      badge: 'Live',
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Atelier Settings',
      icon: SlidersHorizontal,
      badge: null,
    },
  ];

  const branches = [
    'Madison Ave Flagship · New York',
    'Place Vendôme · Paris',
    'Mayfair Sanctuary · London',
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-[#1a0c16]/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#281522] border-r border-[#C7A56A]/20 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Crest Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            {/* Monogram Crest */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-[#4A2038] to-[#1a0c16] border border-[#C7A56A]/60 flex items-center justify-center shadow-lg shadow-black/20 group">
                {/* Decorative gold hairline corner accents */}
                <span className="absolute top-1 left-1 w-1 h-1 border-t border-l border-[#C7A56A]" />
                <span className="absolute bottom-1 right-1 w-1 h-1 border-b border-r border-[#C7A56A]" />
                <span className="font-serif text-[#C7A56A] text-lg font-bold tracking-wider select-none">
                  G&G
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-wider text-[#FBF7F1] font-semibold leading-tight">
                  Gild & Glow
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#C7A56A] font-medium">
                  Retention Suite
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-[#E9D5D8]/70 hover:text-[#FBF7F1] rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Branch Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowBranchMenu(!showBranchMenu)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#3a1c32]/60 hover:bg-[#3a1c32] border border-[#C7A56A]/20 text-left transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-3.5 h-3.5 text-[#C7A56A] shrink-0" />
                <span className="text-xs text-[#E9D5D8] truncate font-medium">
                  {currentBranch}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#C7A56A] shrink-0 transition-transform ${
                  showBranchMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Branch dropdown */}
            {showBranchMenu && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-1 bg-[#1a0c16] border border-[#C7A56A]/30 rounded-lg shadow-2xl z-30">
                {branches.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      onSwitchBranch(b);
                      setShowBranchMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                      currentBranch === b
                        ? 'bg-[#4A2038] text-[#FBF7F1] font-medium text-[#C7A56A]'
                        : 'text-[#E9D5D8]/80 hover:bg-[#281522] hover:text-[#FBF7F1]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-4 py-2 flex-1 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 pt-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A7D84] font-semibold">
              Atelier Management
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4A2038] to-[#3a1c32] text-[#FBF7F1] border-l-2 border-[#C7A56A] shadow-md shadow-black/20'
                    : 'text-[#E9D5D8]/80 hover:text-[#FBF7F1] hover:bg-[#3a1c32]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#C7A56A]' : 'text-[#8A7D84] group-hover:text-[#DFC394]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-sm ${
                      isActive
                        ? 'bg-[#C7A56A] text-[#1a0c16] font-bold'
                        : 'bg-[#4A2038] text-[#DFC394]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Cadence Intelligence Box */}
          <div className="mt-6 mx-1 p-3.5 rounded-xl bg-gradient-to-br from-[#3a1c32]/70 to-[#1a0c16]/90 border border-[#C7A56A]/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C7A56A]" />
              <span className="text-xs font-serif font-semibold text-[#FBF7F1]">
                Smart Cadence Engine
              </span>
            </div>
            <p className="text-[11px] text-[#E9D5D8]/80 leading-relaxed">
              Predictive WhatsApp revisit triggers active. 92.4% average return rate this quarter.
            </p>
          </div>
        </div>

        {/* Staff / Directrice Profile Footer */}
        <div className="p-4 border-t border-[#C7A56A]/15 bg-[#1f0f1a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C7A56A] to-[#8c703d] p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-[#281522] flex items-center justify-center text-xs font-serif font-bold text-[#DFC394]">
                  VL
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#FBF7F1] truncate">
                  Vivienne Laurent
                </span>
                <span className="text-[11px] text-[#8A7D84] truncate">
                  Directrice de Salon
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#C7A56A] font-mono shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C7A56A]" />
              <span>Verified</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
