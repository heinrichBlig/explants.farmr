import React, { useState } from 'react';
import { 
  Biohazard, 
  Plus, 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle, 
  Trash2, 
  Info, 
  Sparkles,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { ContaminationEvent, ContaminationType, Culture } from '../types';
import { saveContaminationLog, recordPctAffiliateClick } from '../services/storage';

interface ContaminationLogViewProps {
  contaminationLogs: ContaminationEvent[];
  cultures: Culture[];
  activeLabId: string;
  isDarkMode?: boolean;
  onRefreshData: () => void;
}

export const ContaminationLogView: React.FC<ContaminationLogViewProps> = ({
  contaminationLogs,
  cultures,
  activeLabId,
  isDarkMode = false,
  onRefreshData
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // New Log Form
  const [cultureId, setCultureId] = useState('');
  const [contaminationType, setContaminationType] = useState<ContaminationType>('Bacterial');
  const [suspectedCause, setSuspectedCause] = useState('Explant surface contamination on wild field tissue');
  const [ppmUsed, setPpmUsed] = useState(true);
  const [ppmConcentrationMlL, setPpmConcentrationMlL] = useState(1.0);
  const [actionTaken, setActionTaken] = useState<'Discarded' | 'Autoclaved' | 'PPM Rescue Bath' | 'Quarantined'>('PPM Rescue Bath');
  const [notes, setNotes] = useState('Submersed explant in 5% PPM solution for 15 minutes before re-plating on fresh 2.0ml/L PPM media.');

  const filteredLogs = contaminationLogs.filter(l => 
    l.speciesName.toLowerCase().includes(search.toLowerCase()) ||
    l.cultureCode.toLowerCase().includes(search.toLowerCase()) ||
    l.contaminationType.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const selCulture = cultures.find(c => c.id === cultureId);

    const newLog: ContaminationEvent = {
      id: `cont-${Date.now()}`,
      labId: activeLabId,
      cultureId,
      cultureCode: selCulture ? selCulture.code : 'EX-01',
      speciesName: selCulture ? selCulture.speciesName : 'Unknown Plant',
      dateDetected: new Date().toISOString().split('T')[0],
      contaminationType,
      suspectedCause,
      ppmUsed,
      ppmConcentrationMlL: Number(ppmConcentrationMlL),
      vesselType: selCulture ? selCulture.vesselType : '500ml Vented Jar',
      actionTaken,
      notes
    };

    saveContaminationLog(newLog);
    setModalOpen(false);
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
            <Biohazard className="w-5 h-5 text-rose-500" />
            Contamination Audit & Incident Tracker
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Log bacterial clouding, fungal spores, endophytes, and vitrification to identify contamination vectors and apply PPM™ rescue protocols.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Incident</span>
        </button>
      </div>

      {/* PCT PPM Biocide Rescue Banner */}
      <div className={`p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${
        isDarkMode 
          ? 'bg-gradient-to-r from-[#1c1228] via-[#241338] to-[#120f20] border-[#7b2cbf]/40' 
          : 'bg-purple-50 border-purple-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
            isDarkMode ? 'bg-[#7b2cbf]/20 border-[#7b2cbf]/40 text-[#c77dff]' : 'bg-purple-100 border-purple-300 text-purple-700'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-purple-950'}`}>
              Plant Cell Technology PPM™ Rescue Bath Protocol
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-purple-800'}`}>
              Recover valuable rare culture explants infected with surface bacteria or fungal spores using a 5% PPM™ soak for 15 minutes.
            </p>
          </div>
        </div>

        <button
          onClick={() => recordPctAffiliateClick('Contamination PPM Rescue Button')}
          className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/30 flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Order PPM™ Rescue Kit</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              isDarkMode 
                ? 'bg-[#11111a] border-[#222232] hover:border-rose-500/30' 
                : 'bg-white border-slate-200 hover:border-rose-400 shadow-xs'
            }`}
          >
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b ${
              isDarkMode ? 'border-[#222232]' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold border px-2 py-0.5 rounded ${
                  isDarkMode ? 'bg-rose-950/80 text-rose-300 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {log.contaminationType}
                </span>
                <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{log.cultureCode}</span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.speciesName}</span>
              </div>

              <div className={`flex items-center gap-2 text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>Detected: {log.dateDetected}</span>
                <span className={`px-2 py-0.5 rounded border ${
                  isDarkMode ? 'bg-[#181826] text-slate-300 border-[#28283e]' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  Action: {log.actionAction || log.actionTaken}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className={`p-3 rounded-xl border space-y-1 ${
                isDarkMode ? 'bg-[#161622] border-[#222234]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Suspected Contamination Vector:</div>
                <div className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{log.suspectedCause}</div>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${
                isDarkMode ? 'bg-[#161622] border-[#222234]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>PPM™ Biocide Status:</div>
                <div className={`flex items-center justify-between ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  <span>{log.ppmUsed ? `PPM Included (${log.ppmConcentrationMlL || 1.0} ml/L)` : 'No PPM in Media'}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.ppmUsed 
                      ? isDarkMode ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-800' 
                      : isDarkMode ? 'bg-amber-950 text-amber-400' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {log.ppmUsed ? 'PPM Protected' : 'Unprotected'}
                  </span>
                </div>
              </div>
            </div>

            {log.notes && (
              <p className={`text-xs italic p-2.5 rounded-xl border ${
                isDarkMode ? 'text-slate-400 bg-[#141420] border-[#222232]' : 'text-slate-600 bg-slate-50 border-slate-200'
              }`}>
                "{log.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* LOG INCIDENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl ${
            isDarkMode ? 'bg-[#12121c] border-[#2e2e48]' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDarkMode ? 'border-[#252538]' : 'border-slate-200'
            }`}>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Biohazard className="w-5 h-5 text-rose-500" />
                Log Contamination Event
              </h3>
              <button onClick={() => setModalOpen(false)} className={isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3">
              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Select Affected Culture</label>
                <select
                  value={cultureId}
                  onChange={(e) => setCultureId(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs border outline-none ${
                    isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                  required
                >
                  <option value="">-- Choose Culture --</option>
                  {cultures.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.speciesName} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Contamination Type</label>
                <select
                  value={contaminationType}
                  onChange={(e: any) => setContaminationType(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs border outline-none ${
                    isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                >
                  <option value="Bacterial">Bacterial (Milky ooze/cloudiness)</option>
                  <option value="Fungal">Fungal (Fuzzy spore mold)</option>
                  <option value="Endophytic">Endophytic (Systemic vascular bacterium)</option>
                  <option value="Mite/Pest">Mite or Thrip Vector</option>
                  <option value="Vitrification/Hyperhydricity">Vitrification / Glassiness</option>
                </select>
              </div>

              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Suspected Cause</label>
                <input
                  type="text"
                  value={suspectedCause}
                  onChange={(e) => setSuspectedCause(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs border outline-none ${
                    isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Action Taken</label>
                <select
                  value={actionTaken}
                  onChange={(e: any) => setActionTaken(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs border outline-none ${
                    isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                >
                  <option value="PPM Rescue Bath">PPM Rescue Bath (5% Soak)</option>
                  <option value="Quarantined">Quarantined for Observation</option>
                  <option value="Autoclaved">Autoclaved & Sterilized</option>
                  <option value="Discarded">Discarded Immediately</option>
                </select>
              </div>

              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Notes & Observations</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs border outline-none ${
                    isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 text-xs rounded-xl ${isDarkMode ? 'text-slate-400 hover:bg-[#1a1a28]' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-600/30"
                >
                  Save Incident Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
