import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Calendar, 
  Tag, 
  Edit2, 
  Trash2, 
  Clock, 
  Image as ImageIcon, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  X,
  QrCode,
  Printer
} from 'lucide-react';
import { Culture, ExplantType, GrowthStage, ContaminationStatus, MediaRecipe } from '../types';
import { performSubcultureAction, saveCulture, deleteCulture } from '../services/storage';
import { CultureLabelModal } from './CultureLabelModal';

interface CultureTrackerViewProps {
  cultures: Culture[];
  recipes: MediaRecipe[];
  activeLabId: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isDarkMode?: boolean;
  onRefreshData: () => void;
  onOpenNewCultureModal: () => void;
}

export const CultureTrackerView: React.FC<CultureTrackerViewProps> = ({
  cultures,
  recipes,
  activeLabId,
  searchTerm,
  setSearchTerm,
  isDarkMode = false,
  onRefreshData,
  onOpenNewCultureModal
}) => {
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [editingCulture, setEditingCulture] = useState<Culture | null>(null);
  const [subculturingCulture, setSubculturingCulture] = useState<Culture | null>(null);
  const [selectedLabelCulture, setSelectedLabelCulture] = useState<Culture | null>(null);
  const [showBatchLabelModal, setShowBatchLabelModal] = useState<boolean>(false);

  const [subcultureForm, setSubcultureForm] = useState({
    vesselCount: 1,
    plantletsCount: 10,
    intervalDays: 28,
    recipeId: '',
    recipeName: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredCultures = cultures.filter((c) => {
    const matchesSearch = 
      c.speciesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.cultivar && c.cultivar.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.mediaRecipeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === 'All' || c.stage === stageFilter;
    const matchesStatus = statusFilter === 'All' || c.contaminationStatus === statusFilter;

    return matchesSearch && matchesStage && matchesStatus;
  });

  // Handle subculture submit
  const handlePerformSubculture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subculturingCulture) return;

    performSubcultureAction(subculturingCulture.id, {
      vesselCount: Number(subcultureForm.vesselCount),
      plantletsCount: Number(subcultureForm.plantletsCount),
      nextIntervalDays: Number(subcultureForm.intervalDays),
      newRecipeId: subcultureForm.recipeId || subculturingCulture.mediaRecipeId,
      newRecipeName: subcultureForm.recipeName || subculturingCulture.mediaRecipeName
    });

    setSubculturingCulture(null);
    onRefreshData();
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this culture record?')) {
      deleteCulture(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter Pills */}
          {['All', 'Initiation', 'Multiplication', 'Rooting', 'Acclimatization'].map((stg) => (
            <button
              key={stg}
              onClick={() => setStageFilter(stg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                stageFilter === stg
                  ? 'bg-[#7b2cbf] text-white shadow-md shadow-[#7b2cbf]/30'
                  : isDarkMode
                    ? 'bg-[#181826] text-slate-400 hover:text-slate-200 border border-[#26263a]'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {stg}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Contamination Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`text-xs rounded-lg px-2.5 py-1.5 focus:outline-none border ${
              isDarkMode 
                ? 'bg-[#181826] border-[#26263a] text-slate-300 focus:ring-1 focus:ring-[#7b2cbf]' 
                : 'bg-white border-slate-300 text-slate-800 focus:border-purple-600'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Quarantine">Quarantine</option>
            <option value="Contaminated">Contaminated</option>
            <option value="Discarded">Discarded</option>
          </select>

          {/* Grid / Table Toggle */}
          <div className={`flex items-center border rounded-lg p-0.5 ${
            isDarkMode ? 'bg-[#181826] border-[#26263a]' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#7b2cbf] text-white' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-[#7b2cbf] text-white' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Batch Print QR Labels */}
          <button
            onClick={() => setShowBatchLabelModal(true)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border ${
              isDarkMode 
                ? 'bg-[#181826] hover:bg-[#252538] border-[#2e2e42] text-slate-200' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
            }`}
            title="Print QR labels for all filtered cultures"
          >
            <Printer className="w-3.5 h-3.5 text-[#9d4edd]" />
            <span className="hidden sm:inline">Batch Labels</span>
          </button>

          {/* Add Culture Trigger */}
          <button
            onClick={onOpenNewCultureModal}
            className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-[#7b2cbf]/20"
          >
            <Plus className="w-4 h-4" />
            New Culture
          </button>
        </div>
      </div>

      {/* Cultures Count Bar */}
      <div className={`flex items-center justify-between text-xs px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        <span>Showing <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{filteredCultures.length}</strong> culture batches</span>
        <span className="font-mono">Lab ID: {activeLabId}</span>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCultures.map((c) => {
            const isOverdue = c.nextSubcultureDate < todayStr;
            const recipe = recipes.find(r => r.id === c.mediaRecipeId);

            return (
              <div 
                key={c.id}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl flex flex-col justify-between group ${
                  isDarkMode 
                    ? `bg-[#11111a] hover:shadow-[#7b2cbf]/10 ${isOverdue ? 'border-amber-500/40' : 'border-[#222232] hover:border-[#7b2cbf]/50'}` 
                    : `bg-white shadow-xs hover:shadow-md ${isOverdue ? 'border-amber-300' : 'border-slate-200 hover:border-purple-300'}`
                }`}
              >
                <div>
                  {/* Photo Thumbnail / Header */}
                  <div className={`relative h-44 overflow-hidden ${isDarkMode ? 'bg-[#181826]' : 'bg-slate-100'}`}>
                    {c.photoUrl ? (
                      <img 
                        src={c.photoUrl} 
                        alt={c.speciesName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className={`w-full h-full flex flex-col items-center justify-center ${
                        isDarkMode ? 'text-slate-600 bg-gradient-to-br from-[#12121e] to-[#181828]' : 'text-slate-400 bg-slate-100'
                      }`}>
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[10px]">No Photo Attached</span>
                      </div>
                    )}

                    {/* Stage & Code Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-[#0a0a0f]/80 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                        {c.code}
                      </span>
                      <span className="bg-[#7b2cbf]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        {c.stage}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-md ${
                        c.contaminationStatus === 'Healthy' 
                          ? (isDarkMode ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100/90 text-emerald-800 border-emerald-300')
                          : c.contaminationStatus === 'Quarantine' 
                          ? (isDarkMode ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' : 'bg-amber-100/90 text-amber-800 border-amber-300')
                          : (isDarkMode ? 'bg-rose-950/80 text-rose-300 border-rose-500/40' : 'bg-rose-100/90 text-rose-800 border-rose-300')
                      }`}>
                        {c.contaminationStatus}
                      </span>
                    </div>

                    {/* Generation Count Tag */}
                    <div className="absolute bottom-2.5 left-2.5 bg-[#0a0a0f]/80 backdrop-blur-md text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                      Gen {c.generationCount}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className={`font-bold text-base leading-snug group-hover:text-[#7b2cbf] transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {c.speciesName}
                      </h3>
                      {c.cultivar && (
                        <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>'{c.cultivar}'</p>
                      )}
                    </div>

                    {/* Media Recipe & Details */}
                    <div className={`space-y-1.5 text-xs p-2.5 rounded-xl border ${
                      isDarkMode 
                        ? 'bg-[#161622] border-[#222234] text-slate-300' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Media Recipe:</span>
                        <span className={`font-semibold truncate max-w-[140px] ${isDarkMode ? 'text-[#c77dff]' : 'text-purple-800'}`} title={c.mediaRecipeName}>
                          {c.mediaRecipeName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Vessels / Plantlets:</span>
                        <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-900 font-semibold'}`}>{c.vesselCount} jars • {c.plantletsCount} total</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Explant Type:</span>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>{c.explantType}</span>
                      </div>
                    </div>

                    {/* Notes if present */}
                    {c.notes && (
                      <p className={`text-[11px] line-clamp-2 italic p-2 rounded-lg ${
                        isDarkMode ? 'bg-[#141420] text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        "{c.notes}"
                      </p>
                    )}

                    {/* Subculture Due Countdown */}
                    <div className={`p-2 rounded-xl flex items-center justify-between text-xs font-mono border ${
                      isDarkMode
                        ? (isOverdue ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-[#161624] border-[#252538] text-slate-300')
                        : (isOverdue ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700')
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
                        <span>Subculture Due:</span>
                      </div>
                      <span className="font-bold">{c.nextSubcultureDate} {isOverdue && '(OVERDUE)'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSubculturingCulture(c);
                      setSubcultureForm({
                        vesselCount: c.vesselCount,
                        plantletsCount: Math.round(c.plantletsCount * 2.5),
                        intervalDays: c.subcultureIntervalDays || 28,
                        recipeId: c.mediaRecipeId,
                        recipeName: c.mediaRecipeName
                      });
                    }}
                    className="flex-1 bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/20 flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Subculture Now
                  </button>

                  <button
                    onClick={() => setSelectedLabelCulture(c)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isDarkMode 
                        ? 'bg-[#161622] hover:bg-[#222234] text-slate-300 border-[#242436]' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                    title="Generate QR & Barcode Label"
                  >
                    <QrCode className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#c77dff]' : 'text-purple-700'}`} />
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isDarkMode 
                        ? 'bg-[#161622] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border-[#242436]' 
                        : 'bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-300'
                    }`}
                    title="Delete Culture"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className={`border rounded-2xl overflow-hidden ${
          isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <thead className={`uppercase font-mono text-[10px] tracking-wider border-b ${
                isDarkMode ? 'bg-[#161624] text-slate-400 border-[#222232]' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Species / Cultivar</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Gen</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Jars / Plantlets</th>
                  <th className="py-3 px-4">Next Subculture</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-[#1e1e2d]' : 'divide-slate-200'}`}>
                {filteredCultures.map((c) => {
                  const isOverdue = c.nextSubcultureDate < todayStr;
                  return (
                    <tr key={c.id} className={`transition-colors ${isDarkMode ? 'hover:bg-[#161624]' : 'hover:bg-slate-50'}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.code}</td>
                      <td className="py-3 px-4">
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.speciesName}</div>
                        {c.cultivar && <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>'{c.cultivar}'</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-medium border ${
                          isDarkMode ? 'bg-[#7b2cbf]/20 text-[#c77dff] border-[#7b2cbf]/30' : 'bg-purple-100 text-purple-900 border-purple-200'
                        }`}>
                          {c.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">Gen {c.generationCount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          c.contaminationStatus === 'Healthy' 
                            ? (isDarkMode ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-800') 
                            : (isDarkMode ? 'bg-rose-950 text-rose-400' : 'bg-rose-100 text-rose-800')
                        }`}>
                          {c.contaminationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{c.vesselCount} / {c.plantletsCount}</td>
                      <td className="py-3 px-4 font-mono">
                        <span className={isOverdue ? 'text-amber-600 dark:text-amber-400 font-bold' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                          {c.nextSubcultureDate}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedLabelCulture(c)}
                          className={`border px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors ${
                            isDarkMode 
                              ? 'bg-[#181826] text-slate-200 border-[#2e2e42] hover:bg-[#222234]' 
                              : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                          }`}
                          title="Print QR / Barcode Label"
                        >
                          <QrCode className="w-3 h-3 text-[#7b2cbf]" /> Label
                        </button>
                        <button
                          onClick={() => {
                            setSubculturingCulture(c);
                            setSubcultureForm({
                              vesselCount: c.vesselCount,
                              plantletsCount: Math.round(c.plantletsCount * 2.5),
                              intervalDays: c.subcultureIntervalDays || 28,
                              recipeId: c.mediaRecipeId,
                              recipeName: c.mediaRecipeName
                            });
                          }}
                          className="bg-[#7b2cbf] text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-[#9d4edd]"
                        >
                          Subculture
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBCULTURE ACTION MODAL */}
      {subculturingCulture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 ${
            isDarkMode ? 'bg-[#12121c] border-[#2e2e48] text-slate-200' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isDarkMode ? 'border-[#252538]' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <RefreshCw className="w-5 h-5 text-[#9d4edd]" />
                  Log Subculture Generation
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{subculturingCulture.speciesName} ({subculturingCulture.code})</p>
              </div>
              <button 
                onClick={() => setSubculturingCulture(null)} 
                className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-[#1a1a28]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePerformSubculture} className="space-y-4">
              <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                isDarkMode ? 'bg-[#181826] border-[#26263a] text-slate-300' : 'bg-purple-50/70 border-purple-200 text-purple-950'
              }`}>
                <div>Current Generation: <strong className="font-mono">Gen {subculturingCulture.generationCount}</strong></div>
                <div>Next Generation will be: <strong className="text-[#7b2cbf] font-mono font-bold">Gen {subculturingCulture.generationCount + 1}</strong></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>New Vessel Count</label>
                  <input
                    type="number"
                    min="1"
                    value={subcultureForm.vesselCount}
                    onChange={(e) => setSubcultureForm({ ...subcultureForm, vesselCount: Number(e.target.value) })}
                    className={`w-full border rounded-lg px-3 py-2 text-xs outline-none ${
                      isDarkMode 
                        ? 'bg-[#181826] border-[#2e2e42] text-white focus:ring-1 focus:ring-[#7b2cbf]' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-600'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Estimated Plantlets Count</label>
                  <input
                    type="number"
                    min="1"
                    value={subcultureForm.plantletsCount}
                    onChange={(e) => setSubcultureForm({ ...subcultureForm, plantletsCount: Number(e.target.value) })}
                    className={`w-full border rounded-lg px-3 py-2 text-xs outline-none ${
                      isDarkMode 
                        ? 'bg-[#181826] border-[#2e2e42] text-white focus:ring-1 focus:ring-[#7b2cbf]' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-600'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Next Subculture Interval (Days)</label>
                <input
                  type="number"
                  min="7"
                  value={subcultureForm.intervalDays}
                  onChange={(e) => setSubcultureForm({ ...subcultureForm, intervalDays: Number(e.target.value) })}
                  className={`w-full border rounded-lg px-3 py-2 text-xs outline-none ${
                    isDarkMode 
                      ? 'bg-[#181826] border-[#2e2e42] text-white focus:ring-1 focus:ring-[#7b2cbf]' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Media Recipe for Next Subculture</label>
                <select
                  value={subcultureForm.recipeId}
                  onChange={(e) => {
                    const sel = recipes.find(r => r.id === e.target.value);
                    setSubcultureForm({ 
                      ...subcultureForm, 
                      recipeId: e.target.value,
                      recipeName: sel ? sel.name : subculturingCulture.mediaRecipeName 
                    });
                  }}
                  className={`w-full border rounded-lg px-3 py-2 text-xs outline-none ${
                    isDarkMode 
                      ? 'bg-[#181826] border-[#2e2e42] text-white focus:ring-1 focus:ring-[#7b2cbf]' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-600'
                  }`}
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubculturingCulture(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium ${
                    isDarkMode ? 'text-slate-400 hover:bg-[#1a1a28]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7b2cbf] hover:bg-[#9d4edd] text-white shadow-lg shadow-[#7b2cbf]/30"
                >
                  Confirm Subculture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR & BARCODE LABEL MODAL */}
      {(selectedLabelCulture || showBatchLabelModal) && (
        <CultureLabelModal
          culture={selectedLabelCulture}
          allCultures={filteredCultures}
          isDarkMode={isDarkMode}
          onClose={() => {
            setSelectedLabelCulture(null);
            setShowBatchLabelModal(false);
          }}
        />
      )}
    </div>
  );
};
