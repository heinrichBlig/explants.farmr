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
  onRefreshData: () => void;
}

export const ContaminationLogView: React.FC<ContaminationLogViewProps> = ({
  contaminationLogs,
  cultures,
  activeLabId,
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
      <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Biohazard className="w-5 h-5 text-rose-400" />
            Contamination Audit & Incident Tracker
          </h2>
          <p className="text-xs text-slate-400">
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
      <div className="bg-gradient-to-r from-[#1c1228] via-[#241338] to-[#120f20] border border-[#7b2cbf]/40 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7b2cbf]/20 border border-[#7b2cbf]/40 text-[#c77dff] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Plant Cell Technology PPM™ Rescue Bath Protocol
            </h3>
            <p className="text-xs text-slate-300">
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
            className="bg-[#11111a] border border-[#222232] hover:border-rose-500/30 p-5 rounded-2xl transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#222232]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                  {log.contaminationType}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">{log.cultureCode}</span>
                <span className="text-sm font-bold text-white">{log.speciesName}</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Detected: {log.dateDetected}</span>
                <span className="bg-[#181826] text-slate-300 px-2 py-0.5 rounded border border-[#28283e]">
                  Action: {log.actionAction || log.actionTaken}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#161622] p-3 rounded-xl border border-[#222234] space-y-1">
                <div className="text-slate-400 text-[11px] font-semibold">Suspected Contamination Vector:</div>
                <div className="text-slate-200">{log.suspectedCause}</div>
              </div>

              <div className="bg-[#161622] p-3 rounded-xl border border-[#222234] space-y-1">
                <div className="text-slate-400 text-[11px] font-semibold">PPM™ Biocide Status:</div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>{log.ppmUsed ? `PPM Included (${log.ppmConcentrationMlL || 1.0} ml/L)` : 'No PPM in Media'}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.ppmUsed ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                    {log.ppmUsed ? 'PPM Protected' : 'Unprotected'}
                  </span>
                </div>
              </div>
            </div>

            {log.notes && (
              <p className="text-xs text-slate-400 italic bg-[#141420] p-2.5 rounded-xl border border-[#222232]">
                "{log.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* LOG INCIDENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12121c] border border-[#2e2e48] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252538]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Biohazard className="w-5 h-5 text-rose-400" />
                Log Contamination Event
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Select Affected Culture</label>
                <select
                  value={cultureId}
                  onChange={(e) => setCultureId(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
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
                <label className="text-xs text-slate-400 mb-1 block">Contamination Type</label>
                <select
                  value={contaminationType}
                  onChange={(e: any) => setContaminationType(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Bacterial">Bacterial (Milky ooze/cloudiness)</option>
                  <option value="Fungal">Fungal (Fuzzy spore mold)</option>
                  <option value="Endophytic">Endophytic (Systemic vascular bacterium)</option>
                  <option value="Mite/Pest">Mite or Thrip Vector</option>
                  <option value="Vitrification/Hyperhydricity">Vitrification / Glassiness</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Suspected Cause</label>
                <input
                  type="text"
                  value={suspectedCause}
                  onChange={(e) => setSuspectedCause(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Action Taken</label>
                <select
                  value={actionTaken}
                  onChange={(e: any) => setActionTaken(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="PPM Rescue Bath">PPM Rescue Bath (5% Soak)</option>
                  <option value="Quarantined">Quarantined for Observation</option>
                  <option value="Autoclaved">Autoclaved & Sterilized</option>
                  <option value="Discarded">Discarded Immediately</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Notes & Observations</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-[#1a1a28] rounded-xl"
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
