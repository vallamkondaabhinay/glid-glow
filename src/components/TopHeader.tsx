import React from 'react';
import { Menu, Plus, Search, Sparkles } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  activeTab: ActiveTab;
  onOpenRegisterModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSimulationMode: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileMenu,
  activeTab,
  onOpenRegisterModal,
  searchQuery,
  setSearchQuery,
  isSimulationMode,
}) => {
  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview & Retention Intelligence';
      case 'clients':
        return 'Guest Directory & Client Records';
      case 'reminders':
        return 'Cadence Reminders & Operations';
      case 'logs':
        return 'Message Delivery & Audit Logs';
      case 'whatsapp':
        return 'WhatsApp Atelier & Simulator';
      case 'settings':
        return 'Salon Profile & Cadence Configuration';
      default:
        return 'Retention Suite';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FBF7F1]/95 backdrop-blur-md border-b border-[#C7A56A]/20 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
      {/* Zone 1: Mobile Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#281522] hover:bg-[#E9D5D8]/40 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8A7D84]">
          <span className="font-serif font-semibold text-[#281522] tracking-wide hidden sm:inline">
            Maison Gild & Glow
          </span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-[#4A2038] font-medium truncate max-w-[160px] sm:max-w-none">
            {getTabBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Zone 2: Contextual Global Search & Simulation Pill */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8A7D84] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guests, phone, formula, or stylist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#C7A56A]/30 rounded-lg focus:outline-none focus:border-[#C7A56A] focus:ring-1 focus:ring-[#C7A56A] text-[#29252A] placeholder:text-[#8A7D84]/70 transition-all shadow-xs"
          />
        </div>

        {/* Quiet Simulation State indicator */}
        {isSimulationMode && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E9D5D8]/40 border border-[#C7A56A]/30 text-[11px] text-[#4A2038] whitespace-nowrap shrink-0 font-medium">
            <Sparkles className="w-3 h-3 text-[#C7A56A]" />
            <span>Simulation Mode</span>
          </div>
        )}
      </div>

      {/* Zone 3: Primary Action Button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenRegisterModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#281522] hover:bg-[#4A2038] text-[#FBF7F1] text-xs font-semibold rounded-lg border border-[#C7A56A]/50 shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 text-[#C7A56A]" />
          <span>Register New Guest</span>
        </button>
      </div>
    </header>
  );
};
