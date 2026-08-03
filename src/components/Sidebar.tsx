import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  BookOpenCheck, 
  Calendar, 
  Package, 
  Biohazard, 
  GraduationCap, 
  Layers, 
  Settings, 
  ExternalLink, 
  Sun, 
  Moon, 
  Plus, 
  Sparkles,
  Building2,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { Lab } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  labs: Lab[];
  activeLabId: string;
  setActiveLabId: (id: string) => void;
  overdueCount: number;
  lowStockCount: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenQuickCulture: () => void;
  onOpenQuickRecipe: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  labs,
  activeLabId,
  setActiveLabId,
  overdueCount,
  lowStockCount,
  isDarkMode,
  setIsDarkMode,
  onOpenQuickCulture,
  onOpenQuickRecipe,
  mobileOpen = false,
  onCloseMobile
}) => {
  const activeLab = labs.find(l => l.id === activeLabId) || labs[0];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cultures', label: 'Culture Tracker', icon: FlaskConical },
    { id: 'schedule', label: 'Subculture Schedule', icon: Calendar, badge: overdueCount > 0 ? overdueCount : undefined, badgeColor: isDarkMode ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-700 border-rose-200' },
    { id: 'builder', label: 'Recipe Builder', icon: BookOpenCheck },
    { id: 'library', label: 'Recipe Library', icon: Sparkles },
    { id: 'inventory', label: 'Inventory Manager', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: isDarkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'contamination', label: 'Contamination Log', icon: Biohazard },
    { id: 'knowledge', label: 'Knowledge Base', icon: GraduationCap },
    { id: 'multilab', label: 'Labs & Projects', icon: Layers },
    { id: 'settings', label: 'Settings & Export', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`w-64 h-screen ${isDarkMode ? 'bg-[#0d0d14] border-[#222232] text-slate-300' : 'bg-white border-slate-200 text-slate-800'} border-r flex-col justify-between select-none sticky top-0 shrink-0 z-50 transition-colors duration-200 ${
        mobileOpen ? 'fixed inset-y-0 left-0 flex shadow-2xl' : 'hidden lg:flex'
      }`}>
        <div>
          {/* Logo & Brand Header */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-[#222232]' : 'border-slate-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b2cbf] to-[#9d4edd] flex items-center justify-center shadow-lg shadow-[#7b2cbf]/30 border border-purple-400/20">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-lg tracking-tight font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>tissue<span className="text-[#9d4edd]">.farmr</span></span>
                </div>
                <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tissue Culture Management</p>
              </div>
            </div>

            {/* Close Button on Mobile */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className={`lg:hidden p-1.5 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-[#151522] border-[#2a2a3e] text-slate-400 hover:text-white' 
                    : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        {/* Lab Switcher */}
        <div className="px-3 pt-3 pb-1">
          <label className={`text-[10px] font-semibold uppercase tracking-wider px-2 mb-1 block ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Active Workspace</label>
          <div className="relative">
            <select
              value={activeLabId}
              onChange={(e) => setActiveLabId(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-xs font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7b2cbf] transition-colors pr-8 truncate ${
                isDarkMode 
                  ? 'bg-[#151522] border-[#2a2a3e] text-slate-200 hover:border-[#7b2cbf]/50' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 hover:border-purple-400'
              }`}
            >
              {labs.map((lab) => (
                <option key={lab.id} value={lab.id} className={isDarkMode ? 'bg-[#12121e] text-slate-200' : 'bg-white text-slate-900'}>
                  {lab.name}
                </option>
              ))}
            </select>
            <Building2 className={`w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="px-3 my-2 flex gap-1.5">
          <button
            onClick={() => { onOpenQuickCulture(); if (onCloseMobile) onCloseMobile(); }}
            className="flex-1 bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1 shadow-md shadow-[#7b2cbf]/20 active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            Culture
          </button>
          <button
            onClick={() => { onOpenQuickRecipe(); if (onCloseMobile) onCloseMobile(); }}
            className={`flex-1 border text-xs font-medium py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1 active:scale-[0.98] ${
              isDarkMode 
                ? 'bg-[#1a1a28] hover:bg-[#252538] border-[#2e2e44] text-slate-200' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-[#9d4edd]" />
            Recipe
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-0.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-[#7b2cbf]/20 to-purple-900/10 text-white border border-[#7b2cbf]/40 shadow-sm'
                      : 'bg-purple-100/80 text-purple-950 font-bold border border-purple-300 shadow-xs'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-[#161622]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? (isDarkMode ? 'text-[#c77dff]' : 'text-purple-700') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Version */}
      <div className={`p-3 border-t ${isDarkMode ? 'border-[#222232]' : 'border-slate-200'}`}>
        {/* Theme Toggle & Version */}
        <div className={`flex items-center justify-between text-xs px-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
          <span className="font-mono text-[10px]">v1.0.4 • explants.farmr</span>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-[#1a1a28] text-slate-400 hover:text-slate-200' 
                : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle light / dark mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  </>
  );
};
