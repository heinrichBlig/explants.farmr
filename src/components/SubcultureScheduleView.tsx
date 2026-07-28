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
  onRefreshData: () => void;
}

export const SubcultureScheduleView: React.FC<SubcultureScheduleViewProps> = ({
  cultures,
  recipes,
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
      <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#9d4edd]" />
            Subculture Cycle Schedule & Timeline
          </h2>
          <p className="text-xs text-slate-400">
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#11111a] border border-[#222232] p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-[#7b2cbf] text-white' : 'bg-[#181826] text-slate-400 hover:text-white'
            }`}
          >
            All Scheduled ({activeCultures.length})
          </button>

          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              filter === 'overdue' ? 'bg-amber-500 text-white' : 'bg-[#181826] text-amber-400 border border-amber-500/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue ({activeCultures.filter(c => c.nextSubcultureDate < todayStr).length})
          </button>

          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'today' ? 'bg-[#7b2cbf] text-white' : 'bg-[#181826] text-slate-400 hover:text-white'
            }`}
          >
            Due Today
          </button>

          <button
            onClick={() => setFilter('next7')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'next7' ? 'bg-[#7b2cbf] text-white' : 'bg-[#181826] text-slate-400 hover:text-white'
            }`}
          >
            Next 7 Days
          </button>

          <button
            onClick={() => setFilter('next30')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'next30' ? 'bg-[#7b2cbf] text-white' : 'bg-[#181826] text-slate-400 hover:text-white'
            }`}
          >
            Next 30 Days
          </button>
        </div>

        <button
          onClick={handleSelectAll}
          className="text-xs text-[#c77dff] hover:underline font-semibold flex items-center gap-1"
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
                  ? 'bg-[#1a122e] border-[#7b2cbf] shadow-md shadow-[#7b2cbf]/10'
                  : isOverdue
                  ? 'bg-[#181116] border-amber-500/40 hover:border-amber-500/70'
                  : 'bg-[#11111a] border-[#222232] hover:border-[#7b2cbf]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleSelect(c.id); }}
                  className="text-slate-400 hover:text-white"
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-[#9d4edd]" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <div className="w-10 h-10 rounded-xl bg-[#181828] border border-[#2e2e42] flex items-center justify-center text-[#c77dff] shrink-0 font-mono font-bold text-xs">
                  Gen {c.generationCount}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{c.speciesName}</span>
                    <span className="font-mono text-[10px] bg-[#1a1a28] text-slate-300 px-2 py-0.5 rounded border border-[#2e2e42]">
                      {c.code}
                    </span>
                    <span className="text-[10px] bg-[#7b2cbf]/20 text-[#c77dff] px-2 py-0.5 rounded border border-[#7b2cbf]/30">
                      {c.stage}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-3">
                    <span>Recipe: {c.mediaRecipeName}</span>
                    <span>• {c.vesselCount} jars ({c.plantletsCount} plantlets)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-[#222232] pt-2 sm:pt-0">
                <div className="text-right">
                  <div className={`text-xs font-mono font-bold flex items-center gap-1 ${
                    isOverdue ? 'text-amber-400' : 'text-slate-200'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {c.nextSubcultureDate} {isOverdue && '(OVERDUE)'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
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
          <div className="bg-[#12121c] border border-[#2e2e48] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#9d4edd]" />
              Confirm Batch Subculture ({selectedCultureIds.length} Cultures)
            </h3>
            <p className="text-xs text-slate-300">
              This action will increment the generation count for all selected cultures by +1, update last subculture date to today, and schedule next cycle dates automatically.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-[#1a1a28]"
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
