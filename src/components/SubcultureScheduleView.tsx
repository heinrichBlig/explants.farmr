import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  FlaskConical, 
  ChevronRight,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { Culture, MediaRecipe } from '../types';
import { performSubcultureAction } from '../services/storage';

interface SubcultureScheduleViewProps {
  cultures: Culture[];
  recipes: MediaRecipe[];
  isDarkMode?: boolean;
  onRefreshData: () => void;
}

export const SubcultureScheduleView: React.FC<SubcultureScheduleViewProps> = ({
  cultures,
  recipes,
  isDarkMode = false,
  onRefreshData
}) => {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'next7' | 'next30'>('all');
  const [selectedCultureIds, setSelectedCultureIds] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const inSevenDays = new Date();
  inSevenDays.setDate(inSevenDays.getDate() + 7);
  const next7Str = inSevenDays.toISOString().split('T')[0];

  const inThirtyDays = new Date();
  inThirtyDays.setDate(inThirtyDays.getDate() + 30);
  const next30Str = inThirtyDays.toISOString().split('T')[0];

  const activeCultures = cultures.filter(c => c.contaminationStatus !== 'Discarded');

  const filteredCultures = activeCultures.filter((c) => {
    if (filter === 'overdue') return c.nextSubcultureDate < todayStr;
    if (filter === 'today') return c.nextSubcultureDate === todayStr;
    if (filter === 'next7') return c.nextSubcultureDate >= todayStr && c.nextSubcultureDate <= next7Str;
    if (filter === 'next30') return c.nextSubcultureDate >= todayStr && c.nextSubcultureDate <= next30Str;
    return true;
  }).sort((a, b) => a.nextSubcultureDate.localeCompare(b.nextSubcultureDate));

  // Toggle selection for batch subculture
  const toggleSelect = (id: string) => {
    if (selectedCultureIds.includes(id)) {
      setSelectedCultureIds(selectedCultureIds.filter(i => i !== id));
    } else {
      setSelectedCultureIds([...selectedCultureIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCultureIds.length === filteredCultures.length) {
      setSelectedCultureIds([]);
    } else {
      setSelectedCultureIds(filteredCultures.map(c => c.id));
    }
  };

  const handleBatchSubcultureConfirm = () => {
    selectedCultureIds.forEach((id) => {
      const cult = cultures.find(c => c.id === id);
      if (cult) {
        performSubcultureAction(id, {
          vesselCount: cult.vesselCount,
          plantletsCount: Math.round(cult.plantletsCount * 2),
          nextIntervalDays: cult.subcultureIntervalDays || 28
        });
      }
    });

    setSelectedCultureIds([]);
    setShowBatchModal(false);
    onRefreshData();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Calendar className="w-5 h-5 text-[#9d4edd]" />
            Subculture Cycle Schedule & Timeline
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Track subculture due dates, schedule transfers, and batch-log tissue culture divisions across all plant lines.
          </p>
        </div>

        {selectedCultureIds.length > 0 && (
          <button
            onClick={() => setShowBatchModal(true)}
            className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#7b2cbf]/30 flex items-center gap-2 animate-bounce"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Batch Subculture ({selectedCultureIds.length} Selected)</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' 
                ? 'bg-[#7b2cbf] text-white' 
                : isDarkMode ? 'bg-[#181826] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Scheduled ({activeCultures.length})
          </button>

          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              filter === 'overdue' 
                ? 'bg-amber-500 text-white' 
                : isDarkMode 
                  ? 'bg-[#181826] text-amber-400 border border-amber-500/30' 
                  : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue ({activeCultures.filter(c => c.nextSubcultureDate < todayStr).length})
          </button>

          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'today' 
                ? 'bg-[#7b2cbf] text-white' 
                : isDarkMode ? 'bg-[#181826] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Due Today
          </button>

          <button
            onClick={() => setFilter('next7')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'next7' 
                ? 'bg-[#7b2cbf] text-white' 
                : isDarkMode ? 'bg-[#181826] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Next 7 Days
          </button>

          <button
            onClick={() => setFilter('next30')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'next30' 
                ? 'bg-[#7b2cbf] text-white' 
                : isDarkMode ? 'bg-[#181826] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Next 30 Days
          </button>
        </div>

        <button
          onClick={handleSelectAll}
          className="text-xs text-[#7b2cbf] dark:text-[#c77dff] hover:underline font-semibold flex items-center gap-1"
        >
          {selectedCultureIds.length === filteredCultures.length ? 'Deselect All' : 'Select All Filtered'}
        </button>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {filteredCultures.map((c) => {
          const isOverdue = c.nextSubcultureDate < todayStr;
          const isSelected = selectedCultureIds.includes(c.id);

          return (
            <div
              key={c.id}
              onClick={() => toggleSelect(c.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? isDarkMode ? 'bg-[#1a122e] border-[#7b2cbf] shadow-md shadow-[#7b2cbf]/10' : 'bg-purple-50 border-purple-500 shadow-xs'
                  : isOverdue
                  ? isDarkMode ? 'bg-[#181116] border-amber-500/40 hover:border-amber-500/70' : 'bg-amber-50/70 border-amber-300 hover:border-amber-400'
                  : isDarkMode ? 'bg-[#11111a] border-[#222232] hover:border-[#7b2cbf]/50' : 'bg-white border-slate-200 hover:border-purple-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleSelect(c.id); }}
                  className={isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-[#9d4edd]" />
                  ) : (
                    <Square className={`w-5 h-5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  )}
                </button>

                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  isDarkMode ? 'bg-[#181828] border-[#2e2e42] text-[#c77dff]' : 'bg-purple-50 border-purple-200 text-purple-700'
                }`}>
                  Gen {c.generationCount}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.speciesName}</span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                      isDarkMode ? 'bg-[#1a1a28] text-slate-300 border-[#2e2e42]' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {c.code}
                    </span>
                    <span className="text-[10px] bg-[#7b2cbf]/10 text-[#7b2cbf] dark:bg-[#7b2cbf]/20 dark:text-[#c77dff] px-2 py-0.5 rounded border border-[#7b2cbf]/30">
                      {c.stage}
                    </span>
                  </div>
                  <div className={`text-xs mt-0.5 flex flex-wrap items-center gap-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>Recipe: {c.mediaRecipeName}</span>
                    <span>• {c.vesselCount} jars ({c.plantletsCount} plantlets)</span>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-2 sm:pt-0 ${
                isDarkMode ? 'border-[#222232]' : 'border-slate-200'
              }`}>
                <div className="text-right">
                  <div className={`text-xs font-mono font-bold flex items-center gap-1 ${
                    isOverdue ? isDarkMode ? 'text-amber-400' : 'text-amber-700' : isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {c.nextSubcultureDate} {isOverdue && '(OVERDUE)'}
                  </div>
                  <div className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    Last subcultured: {c.lastSubcultureDate}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    performSubcultureAction(c.id, {
                      vesselCount: c.vesselCount,
                      plantletsCount: Math.round(c.plantletsCount * 2),
                      nextIntervalDays: c.subcultureIntervalDays || 28
                    });
                    onRefreshData();
                  }}
                  className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/20 shrink-0"
                >
                  Subculture 1-Click
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BATCH SUBCULTURE CONFIRMATION MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl ${
            isDarkMode ? 'bg-[#12121c] border-[#2e2e48]' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <RefreshCw className="w-5 h-5 text-[#9d4edd]" />
              Confirm Batch Subculture ({selectedCultureIds.length} Cultures)
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              This action will increment the generation count for all selected cultures by +1, update last subculture date to today, and schedule next cycle dates automatically.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowBatchModal(false)}
                className={`px-4 py-2 rounded-xl text-xs ${isDarkMode ? 'text-slate-400 hover:bg-[#1a1a28]' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleBatchSubcultureConfirm}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7b2cbf] hover:bg-[#9d4edd] text-white shadow-lg shadow-[#7b2cbf]/30"
              >
                Confirm Batch Subculture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
