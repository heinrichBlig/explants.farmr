import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  Plus, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { Culture, ExplantType, GrowthStage, MediaRecipe } from '../types';
import { saveCulture } from '../services/storage';

interface NewCultureModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: MediaRecipe[];
  activeLabId: string;
  isDarkMode?: boolean;
  onCultureCreated: () => void;
}

export const NewCultureModal: React.FC<NewCultureModalProps> = ({
  isOpen,
  onClose,
  recipes,
  activeLabId,
  isDarkMode = false,
  onCultureCreated
}) => {
  const [speciesName, setSpeciesName] = useState('Monstera deliciosa');
  const [cultivar, setCultivar] = useState('Thai Constellation');
  const [code, setCode] = useState(`MON-TC-0${Math.floor(Math.random() * 90 + 10)}`);
  const [explantType, setExplantType] = useState<ExplantType>('Nodal Segment');
  const [stage, setStage] = useState<GrowthStage>('Initiation');
  const [mediaRecipeId, setMediaRecipeId] = useState(recipes[0]?.id || 'rec-1');
  const [vesselCount, setVesselCount] = useState(4);
  const [plantletsCount, setPlantletsCount] = useState(16);
  const [vesselType, setVesselType] = useState('500ml Vented Jar');
  const [subcultureIntervalDays, setSubcultureIntervalDays] = useState(28);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80');
  const [notes, setNotes] = useState('Initiated under laminar flow hood. Disinfected with 10% NaOCl + 2.0ml/L PPM.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selRecipe = recipes.find(r => r.id === mediaRecipeId);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + Number(subcultureIntervalDays));
    const nextDateStr = nextDate.toISOString().split('T')[0];

    const newCulture: Culture = {
      id: `cult-${Date.now()}`,
      labId: activeLabId,
      speciesName,
      cultivar,
      code,
      explantType,
      initiatedDate: todayStr,
      lastSubcultureDate: todayStr,
      nextSubcultureDate: nextDateStr,
      subcultureIntervalDays: Number(subcultureIntervalDays),
      mediaRecipeId,
      mediaRecipeName: selRecipe ? selRecipe.name : 'MS Proliferation Formula',
      stage,
      generationCount: 1,
      contaminationStatus: 'Healthy',
      vesselCount: Number(vesselCount),
      plantletsCount: Number(plantletsCount),
      vesselType,
      photoUrl,
      notes,
      tags: [stage, explantType]
    };

    saveCulture(newCulture);
    onCultureCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`border rounded-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 my-8 shadow-2xl ${
        isDarkMode ? 'bg-[#12121e] border-[#2e2e48]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${
          isDarkMode ? 'border-[#252538]' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#9d4edd]" />
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Log New Tissue Culture Initiation</h3>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-lg ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-[#1a1a28]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Species / Genus Name</label>
              <input
                type="text"
                value={speciesName}
                onChange={(e) => setSpeciesName(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 border outline-none ${
                  isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
                required
              />
            </div>

            <div>
              <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Cultivar / Clone ID</label>
              <input
                type="text"
                value={cultivar}
                onChange={(e) => setCultivar(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 border outline-none ${
                  isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Batch Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 font-mono border outline-none ${
                  isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
                required
              />
            </div>

            <div>
              <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Growth Stage</label>
              <select
                value={stage}
                onChange={(e: any) => setStage(e.target.value)}
                className={`w-full rounded-lg px-2.5 py-2 border outline-none ${
                  isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              >
                <option value="Initiation">Stage I: Initiation</option>
                <option value="Multiplication">Stage II: Multiplication</option>
                <option value="Rooting">Stage III: Rooting</option>
                <option value="Acclimatization">Stage IV: Acclimatization</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Explant Type</label>
              <select
                value={explantType}
                onChange={(e: any) => setExplantType(e.target.value)}
                className={`w-full rounded-lg px-2.5 py-2 border outline-none ${
                  isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              >
                <option value="Nodal Segment">Nodal Segment</option>
                <option value="Shoot Tip">Shoot Tip</option>
                <option value="Leaf Disk">Leaf Disk</option>
                <option value="Meristem">Meristem</option>
                <option value="Callus">Callus</option>
                <option value="Petiole">Petiole</option>
                <option value="Embryo/Seed">Embryo / Seed</option>
              </select>
            </div>

            <div>
              <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Subculture Cycle (Days)</label>
              <input
                type="number"
                value={subcultureIntervalDays}
                onChange={(e) => setSubcultureIntervalDays(Number(e.target.value))}
                className={`w-full rounded-lg px-3 py-2 font-mono border outline-none ${
                  isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Media Recipe Used</label>
            <select
              value={mediaRecipeId}
              onChange={(e) => setMediaRecipeId(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 border outline-none ${
                isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
              }`}
            >
              {recipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Vessels Count</label>
              <input
                type="number"
                value={vesselCount}
                onChange={(e) => setVesselCount(Number(e.target.value))}
                className={`w-full rounded-lg px-3 py-2 font-mono border outline-none ${
                  isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
                required
              />
            </div>

            <div>
              <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Plantlets Count</label>
              <input
                type="number"
                value={plantletsCount}
                onChange={(e) => setPlantletsCount(Number(e.target.value))}
                className={`w-full rounded-lg px-3 py-2 font-mono border outline-none ${
                  isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Photo URL Attachment</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-[11px] border outline-none ${
                isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
              }`}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className={`mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Notes & Disinfection Protocol</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 border outline-none ${
                isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
              }`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl ${isDarkMode ? 'text-slate-400 hover:bg-[#1a1a28]' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold bg-[#7b2cbf] hover:bg-[#9d4edd] text-white rounded-xl shadow-lg shadow-[#7b2cbf]/30"
            >
              Log Culture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
