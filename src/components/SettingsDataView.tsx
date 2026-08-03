import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet
} from 'lucide-react';
import { 
  exportAllDataJSON, 
  exportCulturesCSV, 
  downloadCSV, 
  importDataJSON, 
  resetStorageToDemoData, 
  clearAllStorage 
} from '../services/storage';
import { PRICING_TIERS } from '../data/mockData';

interface SettingsDataViewProps {
  isDarkMode?: boolean;
  onRefreshData: () => void;
}

export const SettingsDataView: React.FC<SettingsDataViewProps> = ({
  isDarkMode = false,
  onRefreshData
}) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

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
      <div className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Settings className="w-5 h-5 text-[#9d4edd]" />
            Data Backup & Settings
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Export client-side backups as CSV/JSON and manage app configuration.
          </p>
        </div>
      </div>

      {/* Backup & Data Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Data Box */}
        <div className={`p-5 rounded-2xl space-y-4 border ${
          isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Download className="w-4 h-4 text-[#9d4edd]" />
            Data Export & Local Backup
          </h3>
          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
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
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border ${
                isDarkMode 
                  ? 'bg-[#181826] hover:bg-[#222238] border-[#2c2c42] text-slate-200' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Export Cultures CSV</span>
            </button>
          </div>
        </div>

        {/* Restore / Import Box */}
        <div className={`p-5 rounded-2xl space-y-4 border ${
          isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Upload className="w-4 h-4 text-emerald-500" />
            Import / Restore JSON Backup
          </h3>

          <form onSubmit={handleImportSubmit} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Paste JSON backup contents here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className={`w-full text-xs rounded-xl p-3 font-mono outline-none border ${
                isDarkMode 
                  ? 'bg-[#181826] border-[#28283e] text-white focus:border-[#7b2cbf]' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-400'
              }`}
            />

            {importStatus && (
              <div className="text-xs font-semibold text-emerald-500">{importStatus}</div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetDemo}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
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
      <div className={`p-6 rounded-2xl space-y-5 border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Subscription & Licensing Tiers</h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>tissue.farmr plan tiers for hobbyists, microprop labs, and commercial nurseries.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                tier.highlighted
                  ? isDarkMode ? 'bg-[#18102a] border-[#7b2cbf] shadow-xl shadow-[#7b2cbf]/20' : 'bg-purple-50 border-purple-400 shadow-md'
                  : isDarkMode ? 'bg-[#141420] border-[#222234]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tier.name}</span>
                  {tier.highlighted && (
                    <span className="bg-[#7b2cbf] text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">POPULAR</span>
                  )}
                </div>

                <div className={`text-xl font-black font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tier.priceMonthly}</div>

                <div className={`space-y-1 pt-2 border-t text-[11px] ${
                  isDarkMode ? 'border-[#222232] text-slate-300' : 'border-slate-200 text-slate-700'
                }`}>
                  {tier.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#c77dff]' : 'text-[#7b2cbf]'}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={`w-full text-xs font-bold py-2 rounded-xl transition-colors border ${
                isDarkMode 
                  ? 'bg-[#1d1d2e] hover:bg-[#28283e] text-white border-[#34344e]' 
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
              }`}>
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
