import React from 'react';
import { 
  FlaskConical, 
  Biohazard, 
  Calendar, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Culture, InventoryItem, ContaminationEvent, MediaRecipe } from '../types';
import { recordPctAffiliateClick } from '../services/storage';

interface DashboardViewProps {
  cultures: Culture[];
  inventory: InventoryItem[];
  contaminationLogs: ContaminationEvent[];
  recipes: MediaRecipe[];
  isDarkMode?: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenCultureModal: () => void;
  onOpenRecipeModal: () => void;
  onOpenContaminationModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cultures,
  inventory,
  contaminationLogs,
  recipes,
  isDarkMode = false,
  onNavigateTab,
  onOpenCultureModal,
  onOpenRecipeModal,
  onOpenContaminationModal
}) => {
  const activeCultures = cultures.filter(c => c.contaminationStatus !== 'Discarded');
  const totalPlantlets = activeCultures.reduce((acc, c) => acc + c.plantletsCount, 0);

  // Overdue cultures calculation
  const today = new Date().toISOString().split('T')[0];
  const overdueCultures = activeCultures.filter(c => c.nextSubcultureDate < today);

  // Contamination rate % calculation
  const totalLogs = contaminationLogs.length;
  const contaminationRate = activeCultures.length > 0 
    ? ((totalLogs / (activeCultures.length + totalLogs)) * 100).toFixed(1)
    : '0.0';

  // Low inventory items
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minThreshold);

  // Stage distribution
  const stageCounts = {
    Initiation: activeCultures.filter(c => c.stage === 'Initiation').length,
    Multiplication: activeCultures.filter(c => c.stage === 'Multiplication').length,
    Rooting: activeCultures.filter(c => c.stage === 'Rooting').length,
    Acclimatization: activeCultures.filter(c => c.stage === 'Acclimatization').length,
  };

  const cardBg = isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const subCardBg = isDarkMode ? 'bg-[#161622] border-[#222234]' : 'bg-slate-50 border-slate-200';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner - PCT Partner Highlight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e1338] via-[#28174d] to-[#140f28] border border-[#7b2cbf]/40 p-6 shadow-xl shadow-[#7b2cbf]/10">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#7b2cbf]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#7b2cbf] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono tracking-wider">
                POWERED BY PLANT CELL TECHNOLOGY
              </span>
              <span className="text-slate-300 text-xs flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Official Reagent Partner
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Optimize Proliferation & Suppress Contamination with PPM™
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Integrated with PCT's broad-spectrum biocide (PPM™), tissue culture media, PGR formulations, and BioTilt™ bioreactors. Reduce lab loss by up to 85%.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => recordPctAffiliateClick('Dashboard Primary PPM Promo')}
              className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#7b2cbf]/30 flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Order PPM™ Reagents</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </button>
            <button
              onClick={() => onNavigateTab('knowledge')}
              className="bg-purple-950/60 hover:bg-purple-900/80 border border-purple-400/30 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Explore PCT Masterclasses</span>
              <ChevronRight className="w-4 h-4 text-purple-200" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Cultures */}
        <div 
          onClick={() => onNavigateTab('cultures')}
          className={`${cardBg} border hover:border-[#7b2cbf]/50 p-4 rounded-xl transition-all cursor-pointer group`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${textMuted}`}>Active Cultures</span>
            <div className="w-8 h-8 rounded-lg bg-[#7b2cbf]/15 flex items-center justify-center text-[#7b2cbf]">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${textPrimary}`}>{activeCultures.length}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              {totalPlantlets} plantlets
            </span>
          </div>
          <div className={`mt-2 text-[10px] ${textMuted} flex items-center justify-between`}>
            <span>Across all culture stages</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Contamination Rate */}
        <div 
          onClick={() => onNavigateTab('contamination')}
          className={`${cardBg} border hover:border-[#7b2cbf]/50 p-4 rounded-xl transition-all cursor-pointer group`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${textMuted}`}>Contamination Rate</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-500">
              <Biohazard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${textPrimary}`}>{contaminationRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" />
              PPM Protected
            </span>
          </div>
          <div className={`mt-2 text-[10px] ${textMuted} flex items-center justify-between`}>
            <span>{totalLogs} recorded events</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Overdue Subcultures */}
        <div 
          onClick={() => onNavigateTab('schedule')}
          className={`${cardBg} border hover:border-[#7b2cbf]/50 p-4 rounded-xl transition-all cursor-pointer group`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${textMuted}`}>Overdue Subcultures</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${overdueCultures.length > 0 ? 'bg-amber-500/20 text-amber-500 animate-pulse' : 'bg-emerald-500/15 text-emerald-500'}`}>
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${overdueCultures.length > 0 ? 'text-amber-600 dark:text-amber-400' : textPrimary}`}>
              {overdueCultures.length}
            </span>
            <span className={`text-xs font-medium ${textMuted}`}>
              Next 7 days: {activeCultures.length}
            </span>
          </div>
          <div className={`mt-2 text-[10px] ${textMuted} flex items-center justify-between`}>
            <span>{overdueCultures.length > 0 ? 'Action required!' : 'Schedule on track'}</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Low Inventory Items */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className={`${cardBg} border hover:border-[#7b2cbf]/50 p-4 rounded-xl transition-all cursor-pointer group`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${textMuted}`}>Low Stock Reagents</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lowStockItems.length > 0 ? 'bg-rose-500/20 text-rose-500' : 'bg-[#7b2cbf]/15 text-[#7b2cbf]'}`}>
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${lowStockItems.length > 0 ? 'text-rose-600 dark:text-rose-400' : textPrimary}`}>
              {lowStockItems.length}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); recordPctAffiliateClick('Low Stock Card 1 Click'); }}
              className="text-[10px] bg-purple-100 dark:bg-[#7b2cbf]/30 hover:bg-purple-200 dark:hover:bg-[#7b2cbf]/60 text-purple-900 dark:text-[#c77dff] px-2 py-0.5 rounded font-bold border border-purple-300 dark:border-[#7b2cbf]/40 flex items-center gap-1"
            >
              1-Click Restock
            </button>
          </div>
          <div className={`mt-2 text-[10px] ${textMuted} flex items-center justify-between`}>
            <span>{inventory.length} items total in inventory</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid Section: Growth Stages & Overdue Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Culture Stage Distribution & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Culture Pipeline by Stage */}
          <div className={`${cardBg} border p-5 rounded-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-sm font-bold tracking-tight flex items-center gap-2 ${textPrimary}`}>
                  <Layers className="w-4 h-4 text-[#7b2cbf]" />
                  Growth Stage Pipeline
                </h3>
                <p className={`text-xs ${textMuted}`}>Distribution of cultures from Stage I initiation to Stage IV acclimatization</p>
              </div>
              <button
                onClick={() => onNavigateTab('cultures')}
                className="text-xs font-semibold text-[#7b2cbf] hover:text-purple-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Visual Bar */}
            <div className={`h-3.5 w-full rounded-full overflow-hidden flex gap-0.5 mb-4 p-0.5 border ${
              isDarkMode ? 'bg-[#181826] border-[#26263a]' : 'bg-slate-100 border-slate-200'
            }`}>
              <div 
                style={{ width: `${(stageCounts.Initiation / (activeCultures.length || 1)) * 100}%` }} 
                className="bg-blue-500 h-full rounded-l-full transition-all duration-500" 
                title={`Initiation: ${stageCounts.Initiation}`}
              />
              <div 
                style={{ width: `${(stageCounts.Multiplication / (activeCultures.length || 1)) * 100}%` }} 
                className="bg-[#7b2cbf] h-full transition-all duration-500" 
                title={`Multiplication: ${stageCounts.Multiplication}`}
              />
              <div 
                style={{ width: `${(stageCounts.Rooting / (activeCultures.length || 1)) * 100}%` }} 
                className="bg-emerald-500 h-full transition-all duration-500" 
                title={`Rooting: ${stageCounts.Rooting}`}
              />
              <div 
                style={{ width: `${(stageCounts.Acclimatization / (activeCultures.length || 1)) * 100}%` }} 
                className="bg-amber-500 h-full rounded-r-full transition-all duration-500" 
                title={`Acclimatization: ${stageCounts.Acclimatization}`}
              />
            </div>

            {/* Stage Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`${subCardBg} p-2.5 rounded-xl border`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className={`text-xs font-semibold ${textPrimary}`}>Stage I</span>
                </div>
                <span className={`text-xs font-mono ${textMuted}`}>{stageCounts.Initiation} Cultures</span>
              </div>

              <div className={`${subCardBg} p-2.5 rounded-xl border`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7b2cbf]" />
                  <span className={`text-xs font-semibold ${textPrimary}`}>Stage II</span>
                </div>
                <span className={`text-xs font-mono ${textMuted}`}>{stageCounts.Multiplication} Cultures</span>
              </div>

              <div className={`${subCardBg} p-2.5 rounded-xl border`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className={`text-xs font-semibold ${textPrimary}`}>Stage III</span>
                </div>
                <span className={`text-xs font-mono ${textMuted}`}>{stageCounts.Rooting} Cultures</span>
              </div>

              <div className={`${subCardBg} p-2.5 rounded-xl border`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className={`text-xs font-semibold ${textPrimary}`}>Stage IV</span>
                </div>
                <span className={`text-xs font-mono ${textMuted}`}>{stageCounts.Acclimatization} Cultures</span>
              </div>
            </div>
          </div>

          {/* Quick Action Hub & Recent Cultures Preview */}
          <div className={`${cardBg} border p-5 rounded-2xl space-y-4`}>
            <h3 className={`text-sm font-bold tracking-tight flex items-center gap-2 ${textPrimary}`}>
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Operations Hub
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={onOpenCultureModal}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 group text-center ${
                  isDarkMode 
                    ? 'bg-[#181826] hover:bg-[#202034] border-[#2c2c42] hover:border-[#7b2cbf]' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-[#7b2cbf]/20 text-[#7b2cbf] dark:text-[#c77dff] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${textPrimary}`}>Log New Culture</span>
              </button>

              <button
                onClick={onOpenRecipeModal}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 group text-center ${
                  isDarkMode 
                    ? 'bg-[#181826] hover:bg-[#202034] border-[#2c2c42] hover:border-[#7b2cbf]' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-[#7b2cbf]/20 text-[#7b2cbf] dark:text-[#c77dff] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${textPrimary}`}>Build Recipe</span>
              </button>

              <button
                onClick={onOpenContaminationModal}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 group text-center ${
                  isDarkMode 
                    ? 'bg-[#181826] hover:bg-[#202034] border-[#2c2c42] hover:border-[#7b2cbf]' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Biohazard className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${textPrimary}`}>Log Contamination</span>
              </button>

              <button
                onClick={() => recordPctAffiliateClick('Quick Order PPM Button')}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 group text-center ${
                  isDarkMode 
                    ? 'bg-[#181826] hover:bg-[#202034] border-[#2c2c42] hover:border-[#7b2cbf]' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${textPrimary}`}>Order PPM Reagents</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Low Stock Items & Overdue List */}
        <div className="space-y-6">
          {/* Low Stock Alert Box */}
          <div className={`${cardBg} border p-4 rounded-2xl`}>
            <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isDarkMode ? 'border-[#222232]' : 'border-slate-200'}`}>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${textPrimary}`}>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Reagent Stock Alerts ({lowStockItems.length})
              </span>
              <button
                onClick={() => recordPctAffiliateClick('Low Stock Banner All Restock')}
                className="text-[10px] text-purple-700 dark:text-[#c77dff] hover:underline font-bold"
              >
                Order from PCT
              </button>
            </div>

            {lowStockItems.length === 0 ? (
              <div className={`py-4 text-center text-xs ${textMuted}`}>
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                All media salts, PPM, and PGRs are stocked!
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockItems.map((item) => (
                  <div key={item.id} className={`${subCardBg} p-2.5 rounded-xl border flex items-center justify-between`}>
                    <div>
                      <div className={`text-xs font-medium truncate max-w-[150px] ${textPrimary}`}>{item.name}</div>
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                        Stock: {item.currentStock} {item.unit} (Min: {item.minThreshold})
                      </div>
                    </div>
                    <button
                      onClick={() => recordPctAffiliateClick(`Restock ${item.name}`, item.pctBuyUrl)}
                      className="text-[10px] bg-[#7b2cbf] hover:bg-[#9d4edd] text-white px-2 py-1 rounded-lg font-semibold transition-colors shrink-0"
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue Subculture Action Card */}
          <div className={`${cardBg} border p-4 rounded-2xl`}>
            <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isDarkMode ? 'border-[#222232]' : 'border-slate-200'}`}>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${textPrimary}`}>
                <Calendar className="w-4 h-4 text-rose-500" />
                Overdue Cultures ({overdueCultures.length})
              </span>
              <button
                onClick={() => onNavigateTab('schedule')}
                className="text-[10px] text-[#7b2cbf] hover:underline font-semibold"
              >
                Schedule
              </button>
            </div>

            {overdueCultures.length === 0 ? (
              <div className={`py-4 text-center text-xs ${textMuted}`}>
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                No overdue subcultures today.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {overdueCultures.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => onNavigateTab('schedule')}
                    className={`p-2.5 border rounded-xl cursor-pointer transition-colors ${
                      isDarkMode 
                        ? 'bg-rose-950/20 border-rose-500/30 hover:bg-rose-950/40' 
                        : 'bg-rose-50 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <div className={`flex items-center justify-between text-xs font-semibold ${isDarkMode ? 'text-rose-200' : 'text-rose-900'}`}>
                      <span>{c.speciesName}</span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        isDarkMode ? 'bg-rose-500/20' : 'bg-rose-200 text-rose-900 font-bold'
                      }`}>{c.code}</span>
                    </div>
                    <div className={`flex items-center justify-between text-[10px] mt-1 ${textMuted}`}>
                      <span>Stage: {c.stage} (Gen {c.generationCount})</span>
                      <span className="text-rose-600 dark:text-rose-400 font-mono font-semibold">Due: {c.nextSubcultureDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
