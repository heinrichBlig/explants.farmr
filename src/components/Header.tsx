import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  ShieldAlert, 
  ExternalLink, 
  Building2, 
  Sparkles,
  Download,
  Terminal,
  Menu
} from 'lucide-react';
import { Lab, Culture, InventoryItem } from '../types';
import { recordPctAffiliateClick } from '../services/storage';

interface HeaderProps {
  currentTabLabel: string;
  activeLab: Lab;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  overdueCultures: Culture[];
  lowStockItems: InventoryItem[];
  isDarkMode?: boolean;
  onOpenQuickCulture: () => void;
  onNavigateToTab: (tab: string) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTabLabel,
  activeLab,
  searchTerm,
  setSearchTerm,
  overdueCultures,
  lowStockItems,
  isDarkMode = false,
  onOpenQuickCulture,
  onNavigateToTab,
  onOpenMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const totalAlerts = overdueCultures.length + lowStockItems.length;

  return (
    <header className={`h-16 border-b ${isDarkMode ? 'bg-[#0a0a0f]/80 border-[#222232]' : 'bg-white/90 border-slate-200'} backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200`}>
      {/* Title & Active Lab Pill & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className={`lg:hidden p-2 rounded-lg border transition-colors shrink-0 ${
            isDarkMode 
              ? 'bg-[#141420] border-[#2a2a3e] text-slate-200 hover:bg-[#1f1f30]' 
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
          }`}
          title="Open menu"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h1 className={`text-base sm:text-lg font-bold tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentTabLabel}</h1>
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium shrink-0 ${
          isDarkMode 
            ? 'bg-[#161624] border-[#2e2e42] text-slate-300' 
            : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          <Building2 className="w-3 h-3 text-[#9d4edd]" />
          <span className="truncate max-w-[120px]">{activeLab.name}</span>
        </div>
      </div>

      {/* Global Search & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative w-28 sm:w-44 md:w-64">
          <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full text-xs rounded-lg pl-7 pr-2 sm:pr-3 py-1.5 transition-all outline-none border ${
              isDarkMode 
                ? 'bg-[#141420] border-[#2a2a3e] focus:border-[#7b2cbf] focus:ring-1 focus:ring-[#7b2cbf] text-slate-200 placeholder-slate-500' 
                : 'bg-slate-50 border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:bg-white text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* PCT Shop Link */}
        <button
          onClick={() => recordPctAffiliateClick('Header PPM Store Link')}
          className={`hidden lg:flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/40 to-[#7b2cbf]/30 hover:from-purple-900/60 hover:to-[#7b2cbf]/50 border-[#7b2cbf]/40 text-[#c77dff]' 
              : 'bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-900 font-bold shadow-xs'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>PCT Store</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg border relative transition-colors ${
              isDarkMode 
                ? 'bg-[#141420] border-[#2a2a3e] hover:border-[#7b2cbf]/50 text-slate-300 hover:text-white' 
                : 'bg-slate-100 border-slate-300 hover:border-purple-400 text-slate-700 hover:text-slate-900'
            }`}
            title="Alerts & Overdue"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {totalAlerts}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 border rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 ${
              isDarkMode 
                ? 'bg-[#12121c] border-[#2e2e48]' 
                : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center justify-between pb-2 mb-2 border-b ${isDarkMode ? 'border-[#252538]' : 'border-slate-200'}`}>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Lab Alerts ({totalAlerts})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className={`text-[10px] ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Close
                </button>
              </div>

              {totalAlerts === 0 ? (
                <p className={`text-xs py-3 text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>All cultures and inventory levels look optimal!</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {overdueCultures.map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => { setShowNotifications(false); onNavigateToTab('schedule'); }}
                      className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                        isDarkMode 
                          ? 'bg-rose-950/20 border-rose-500/30 hover:bg-rose-950/40' 
                          : 'bg-rose-50 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <div className={`flex items-center justify-between text-xs font-medium ${isDarkMode ? 'text-rose-300' : 'text-rose-900'}`}>
                        <span>{c.speciesName}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isDarkMode ? 'bg-rose-500/20' : 'bg-rose-200 text-rose-900'
                        }`}>OVERDUE</span>
                      </div>
                      <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Subculture was due on {c.nextSubcultureDate}</p>
                    </div>
                  ))}

                  {lowStockItems.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => { setShowNotifications(false); onNavigateToTab('inventory'); }}
                      className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                        isDarkMode 
                          ? 'bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/40' 
                          : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <div className={`flex items-center justify-between text-xs font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                        <span>{item.name}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isDarkMode ? 'bg-amber-500/20' : 'bg-amber-200 text-amber-900'
                        }`}>LOW STOCK</span>
                      </div>
                      <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Stock: {item.currentStock} {item.unit} (Min: {item.minThreshold})</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Quick Culture Trigger */}
        <button
          onClick={onOpenQuickCulture}
          className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-[#7b2cbf]/30 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Culture</span>
        </button>
      </div>
    </header>
  );
};
