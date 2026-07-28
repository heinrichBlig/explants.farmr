import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Building2, 
  CheckCircle2, 
  Users, 
  Shield, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { Lab } from '../types';
import { saveLab, setActiveLabId } from '../services/storage';

interface MultiLabViewProps {
  labs: Lab[];
  activeLabId: string;
  onRefreshData: () => void;
}

export const MultiLabView: React.FC<MultiLabViewProps> = ({
  labs,
  activeLabId,
  onRefreshData
}) => {
  const [newLabModal, setNewLabModal] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Laminar Hood Room B');
  const [focusArea, setFocusArea] = useState('Exotic Plant Micropropagation');

  const handleCreateLab = (e: React.FormEvent) => {
    e.preventDefault();
    const newLab: Lab = {
      id: `lab-${Date.now()}`,
      name,
      location,
      focusArea,
      createdAt: new Date().toISOString().split('T')[0]
    };

    saveLab(newLab);
    setActiveLabId(newLab.id);
    setNewLabModal(false);
    onRefreshData();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#9d4edd]" />
            Multi-Lab & Workspace Management
          </h2>
          <p className="text-xs text-slate-400">
            Organize distinct physical clean rooms, species breeding projects, or nursery divisions with isolated culture schedules.
          </p>
        </div>

        <button
          onClick={() => setNewLabModal(true)}
          className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Lab Workspace</span>
        </button>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {labs.map((lab) => {
          const isActive = lab.id === activeLabId;

          return (
            <div
              key={lab.id}
              onClick={() => { setActiveLabId(lab.id); onRefreshData(); }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isActive
                  ? 'bg-[#18112c] border-[#7b2cbf] shadow-xl shadow-[#7b2cbf]/20'
                  : 'bg-[#11111a] border-[#222232] hover:border-[#7b2cbf]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-5 h-5 ${isActive ? 'text-[#c77dff]' : 'text-slate-400'}`} />
                    <span className="font-bold text-white text-base">{lab.name}</span>
                  </div>

                  {isActive && (
                    <span className="bg-[#7b2cbf] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-snug">{lab.focusArea}</p>

                <div className="space-y-1 text-xs text-slate-400 bg-[#161622] p-3 rounded-xl border border-[#222234]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Location: {lab.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] pt-1 border-t border-[#222232]">
                    <span>Created: {lab.createdAt}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLabId(lab.id);
                  onRefreshData();
                }}
                className={`w-full text-xs font-bold py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#7b2cbf] text-white shadow-md shadow-[#7b2cbf]/30'
                    : 'bg-[#181826] hover:bg-[#222238] text-slate-300 border border-[#2c2c42]'
                }`}
              >
                {isActive ? 'Currently Selected Workspace' : 'Switch to This Lab'}
              </button>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW LAB MODAL */}
      {newLabModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12121c] border border-[#2e2e48] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#9d4edd]" />
              Create New Lab Workspace
            </h3>

            <form onSubmit={handleCreateLab} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Lab / Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="e.g. Rare Aroid Breeding Lab"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Location / Room Code</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="e.g. Flow Hood Suite 02"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Focus Area / Plant Species Line</label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="e.g. Variegated Monstera Multiplication"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewLabModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-[#1a1a28] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#7b2cbf] hover:bg-[#9d4edd] text-white rounded-xl shadow-lg shadow-[#7b2cbf]/30"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
