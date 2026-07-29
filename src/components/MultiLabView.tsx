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
  isDarkMode?: boolean;
  onRefreshData: () => void;
}

export const MultiLabView: React.FC<MultiLabViewProps> = ({
  labs,
  activeLabId,
  isDarkMode = false,
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
      <div className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Layers className="w-5 h-5 text-[#9d4edd]" />
            Multi-Lab & Workspace Management
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
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
                  ? isDarkMode ? 'bg-[#18112c] border-[#7b2cbf] shadow-xl shadow-[#7b2cbf]/20' : 'bg-purple-50/80 border-purple-500 shadow-md'
                  : isDarkMode ? 'bg-[#11111a] border-[#222232] hover:border-[#7b2cbf]/40' : 'bg-white border-slate-200 hover:border-purple-300 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-5 h-5 ${isActive ? isDarkMode ? 'text-[#c77dff]' : 'text-purple-700' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{lab.name}</span>
                  </div>

                  {isActive && (
                    <span className="bg-[#7b2cbf] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                </div>

                <p className={`text-xs leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{lab.focusArea}</p>

                <div className={`space-y-1 text-xs p-3 rounded-xl border ${
                  isDarkMode ? 'bg-[#161622] border-[#222234] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span>Location: {lab.location}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 font-mono text-[11px] pt-1 border-t ${
                    isDarkMode ? 'border-[#222232]' : 'border-slate-200'
                  }`}>
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
                    : isDarkMode ? 'bg-[#181826] hover:bg-[#222238] text-slate-300 border border-[#2c2c42]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
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
          <div className={`border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl ${
            isDarkMode ? 'bg-[#12121c] border-[#2e2e48]' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Building2 className="w-5 h-5 text-[#9d4edd]" />
              Create New Lab Workspace
            </h3>

            <form onSubmit={handleCreateLab} className="space-y-3">
              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Lab / Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs border outline-none ${
                    isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                  placeholder="e.g. Rare Aroid Breeding Lab"
                  required
                />
              </div>

              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Location / Room Code</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs border outline-none ${
                    isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                  placeholder="e.g. Flow Hood Suite 02"
                />
              </div>

              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Focus Area / Plant Species Line</label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs border outline-none ${
                    isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                  placeholder="e.g. Variegated Monstera Multiplication"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewLabModal(false)}
                  className={`px-4 py-2 text-xs rounded-xl ${isDarkMode ? 'text-slate-400 hover:bg-[#1a1a28]' : 'text-slate-600 hover:bg-slate-100'}`}
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
