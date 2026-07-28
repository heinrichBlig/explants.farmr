import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  DollarSign, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  CheckCircle2, 
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { 
  exportAllDataJSON, 
  exportCulturesCSV, 
  downloadCSV, 
  importDataJSON, 
  resetStorageToDemoData, 
  clearAllStorage, 
  getAffiliateStats 
} from '../services/storage';
import { PRICING_TIERS } from '../data/mockData';

interface SettingsDataViewProps {
  onRefreshData: () => void;
  onOpenCoolifyModal: () => void;
}

export const SettingsDataView: React.FC<SettingsDataViewProps> = ({
  onRefreshData,
  onOpenCoolifyModal
}) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const affiliateStats = getAffiliateStats();

  const handleExportJSON = () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tissue-farmr-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleExportCSV = () => {
    const csvStr = exportCulturesCSV();
    downloadCSV(`tissue-farmr-cultures-${new Date().toISOString().split('T')[0]}.csv`, csvStr);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importDataJSON(importJsonText)) {
      setImportStatus('Data successfully imported!');
      onRefreshData();
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Invalid JSON format. Please check file syntax.');
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all cultures, recipes, and inventory back to demo dataset?')) {
      resetStorageToDemoData();
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#9d4edd]" />
            Data Backup, Coolify Deployment & PCT Partner Settings
          </h2>
          <p className="text-xs text-slate-400">
            Export client-side backups as CSV/JSON, configure static site deployment for Coolify, and review PCT affiliate revenue.
          </p>
        </div>

        <button
          onClick={onOpenCoolifyModal}
          className="bg-[#161625] hover:bg-[#202038] border border-[#2e2e46] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
        >
          <Terminal className="w-4 h-4 text-[#9d4edd]" />
          <span>Coolify Deployment Guide</span>
        </button>
      </div>

      {/* PCT Affiliate Revenue Dashboard Simulator */}
      <div className="bg-gradient-to-r from-[#1b122e] via-[#24133c] to-[#140f24] border border-[#7b2cbf]/40 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#7b2cbf]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#7b2cbf] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                PCT AFFILIATE PROGRAM
              </span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Plant Cell Technology Referral Network
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Referred Product Sales & Commission Earnings</h3>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${affiliateStats.commissionEarnedUSD.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">15% Commission Earned</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141422] p-3.5 rounded-xl border border-[#222236]">
            <span className="text-xs text-slate-400 block mb-1">Total PCT Link Clicks</span>
            <span className="text-xl font-bold text-white font-mono">{affiliateStats.clicksCount}</span>
          </div>

          <div className="bg-[#141422] p-3.5 rounded-xl border border-[#222236]">
            <span className="text-xs text-slate-400 block mb-1">Referred Customer Orders</span>
            <span className="text-xl font-bold text-white font-mono">{affiliateStats.ordersCount}</span>
          </div>

          <div className="bg-[#141422] p-3.5 rounded-xl border border-[#222236]">
            <span className="text-xs text-slate-400 block mb-1">Referred Product Revenue</span>
            <span className="text-xl font-bold text-white font-mono">${affiliateStats.referredRevenueUSD.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Backup & Data Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Data Box */}
        <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-[#9d4edd]" />
            Data Export & Local Backup
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All culture logs, subculture schedules, recipes, and inventory data are saved strictly inside your browser's LocalStorage. Download regular backups to safeguard your lab logs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportJSON}
              className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/20 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Complete JSON Backup</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-[#181826] hover:bg-[#222238] border border-[#2c2c42] text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Cultures CSV</span>
            </button>
          </div>
        </div>

        {/* Restore / Import Box */}
        <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-400" />
            Import / Restore JSON Backup
          </h3>

          <form onSubmit={handleImportSubmit} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Paste JSON backup contents here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full bg-[#181826] border border-[#28283e] text-xs text-white rounded-xl p-3 font-mono outline-none focus:border-[#7b2cbf]"
            />

            {importStatus && (
              <div className="text-xs font-semibold text-emerald-400">{importStatus}</div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetDemo}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
              >
                Import JSON
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Subscription Pricing Tiers Grid */}
      <div className="bg-[#11111a] border border-[#222232] p-6 rounded-2xl space-y-5">
        <div>
          <h3 className="text-base font-bold text-white">Subscription & Licensing Tiers</h3>
          <p className="text-xs text-slate-400">tissue.farmr plan tiers for hobbyists, microprop labs, and commercial nurseries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                tier.highlighted
                  ? 'bg-[#18102a] border-[#7b2cbf] shadow-xl shadow-[#7b2cbf]/20'
                  : 'bg-[#141420] border-[#222234]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{tier.name}</span>
                  {tier.highlighted && (
                    <span className="bg-[#7b2cbf] text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">POPULAR</span>
                  )}
                </div>

                <div className="text-xl font-black text-white font-mono">{tier.priceMonthly}</div>

                <div className="space-y-1 pt-2 border-t border-[#222232] text-[11px] text-slate-300">
                  {tier.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c77dff] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full text-xs font-bold py-2 rounded-xl bg-[#1d1d2e] hover:bg-[#28283e] text-white border border-[#34344e] transition-colors">
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
