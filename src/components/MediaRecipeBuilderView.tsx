import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Calculator, 
  Plus, 
  Trash2, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  DollarSign,
  Layers,
  FlaskConical
} from 'lucide-react';
import { MediaRecipe, PGRConcentration } from '../types';
import { saveRecipe } from '../services/storage';

interface MediaRecipeBuilderViewProps {
  activeLabId: string;
  isDarkMode?: boolean;
  onRecipeSaved: () => void;
}

export const MediaRecipeBuilderView: React.FC<MediaRecipeBuilderViewProps> = ({
  activeLabId,
  isDarkMode = false,
  onRecipeSaved
}) => {
  // Form state
  const [recipeName, setRecipeName] = useState('Custom Proliferation Formula');
  const [description, setDescription] = useState('High-efficiency shoot multiplication formula formulated for delicate exotics.');
  const [baseMedium, setBaseMedium] = useState<'MS' | 'WPM' | 'B5' | 'Nitsch' | 'DKW' | 'Custom'>('MS');
  const [baseStrength, setBaseStrength] = useState<'Full' | 'Half (1/2)' | 'Quarter (1/4)' | 'Double (2x)'>('Full');
  const [sucroseGramsPerL, setSucroseGramsPerL] = useState(30);
  const [gellingAgent, setGellingAgent] = useState<'Agar' | 'Gellan Gum (Gelrite)' | 'Phytagel' | 'Liquid (No Gelling)'>('Gellan Gum (Gelrite)');
  const [gellingGramsPerL, setGellingGramsPerL] = useState(2.5);
  const [ppmVolumeMlPerL, setPpmVolumeMlPerL] = useState(1.5);
  const [targetPh, setTargetPh] = useState(5.7);
  const [targetSpecies, setTargetSpecies] = useState('Monstera, Philodendron, Anthurium');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Commercial'>('Intermediate');
  const [notes, setNotes] = useState('Autoclave base medium at 121°C for 15 mins. Add PPM and filtered PGRs after cooling to 55°C.');

  // PGR list
  const [pgrs, setPgrs] = useState<PGRConcentration[]>([
    { id: 'pgr-init-1', name: 'BAP (6-Benzylaminopurine)', type: 'Cytokinin', concentrationMgL: 1.5 },
    { id: 'pgr-init-2', name: 'NAA (Naphthaleneacetic Acid)', type: 'Auxin', concentrationMgL: 0.1 }
  ]);

  // Batch Volume Scaling state (in Liters)
  const [batchVolumeL, setBatchVolumeL] = useState<number>(1.0); // Default 1 Liter

  // Status message
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add new PGR
  const handleAddPgr = () => {
    setPgrs([
      ...pgrs,
      { id: `pgr-${Date.now()}`, name: 'Kinetin', type: 'Cytokinin', concentrationMgL: 0.5 }
    ]);
  };

  const handleRemovePgr = (id: string) => {
    setPgrs(pgrs.filter(p => p.id !== id));
  };

  const handleUpdatePgr = (id: string, field: keyof PGRConcentration, val: any) => {
    setPgrs(pgrs.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  // Base salt multiplier per Liter
  const baseSaltGramsPerL = baseMedium === 'MS' ? 4.43 : baseMedium === 'WPM' ? 2.41 : baseMedium === 'B5' ? 3.10 : 3.50;
  const strengthMultiplier = baseStrength === 'Full' ? 1.0 : baseStrength === 'Half (1/2)' ? 0.5 : baseStrength === 'Quarter (1/4)' ? 0.25 : 2.0;

  // Batch calculated totals
  const totalBaseSaltsGrams = (baseSaltGramsPerL * strengthMultiplier * batchVolumeL).toFixed(2);
  const totalSucroseGrams = (sucroseGramsPerL * batchVolumeL).toFixed(1);
  const totalGellingGrams = (gellingGramsPerL * batchVolumeL).toFixed(2);
  const totalPpmMl = (ppmVolumeMlPerL * batchVolumeL).toFixed(2);

  // Handle Save
  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecipe: MediaRecipe = {
      id: `rec-${Date.now()}`,
      labId: activeLabId,
      name: recipeName,
      description,
      baseMedium,
      baseStrength,
      sucroseGramsPerL: Number(sucroseGramsPerL),
      gellingAgent,
      gellingGramsPerL: Number(gellingGramsPerL),
      ppmVolumeMlPerL: Number(ppmVolumeMlPerL),
      pH: Number(targetPh),
      pgrs,
      targetSpecies,
      difficulty,
      notes,
      author: 'tissue.farmr User'
    };

    saveRecipe(newRecipe);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRecipeSaved();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <BookOpenCheck className="w-5 h-5 text-[#9d4edd]" />
            Media Recipe Builder & Batch Calculator
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Design tissue culture formulations, adjust PGR ratios, and auto-scale batch preparations.
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Recipe saved to your lab library!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Formulation Form */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-5 ${
          isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <form onSubmit={handleSaveRecipe} className="space-y-5">
            {/* Basic Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-semibold mb-1 block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Recipe Name</label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs border outline-none ${
                    isDarkMode 
                      ? 'bg-[#161624] border-[#28283e] text-white focus:ring-1 focus:ring-[#7b2cbf]' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-xs font-semibold mb-1 block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Target Species / Genus</label>
                <input
                  type="text"
                  value={targetSpecies}
                  onChange={(e) => setTargetSpecies(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs border outline-none ${
                    isDarkMode 
                      ? 'bg-[#161624] border-[#28283e] text-white focus:ring-1 focus:ring-[#7b2cbf]' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`text-xs font-semibold mb-1 block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description & Purpose</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none ${
                  isDarkMode 
                    ? 'bg-[#161624] border-[#28283e] text-white focus:ring-1 focus:ring-[#7b2cbf]' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-600'
                }`}
              />
            </div>

            {/* Base Medium & Salts */}
            <div className={`p-4 rounded-xl border space-y-4 ${
              isDarkMode ? 'bg-[#161624] border-[#26263a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="text-xs font-bold text-[#7b2cbf] dark:text-[#c77dff] uppercase tracking-wider font-mono">1. Base Nutrient Medium</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`text-[11px] mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Base Salts Formulation</label>
                  <select
                    value={baseMedium}
                    onChange={(e: any) => setBaseMedium(e.target.value)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs border outline-none ${
                      isDarkMode 
                        ? 'bg-[#12121e] border-[#2a2a3e] text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="MS">Murashige & Skoog (MS)</option>
                    <option value="WPM">Woody Plant Medium (WPM)</option>
                    <option value="B5">Gamborg B5</option>
                    <option value="Nitsch">Nitsch & Nitsch</option>
                    <option value="DKW">Driver & Kuniyuki (DKW)</option>
                    <option value="Custom">Custom Basal Formula</option>
                  </select>
                </div>

                <div>
                  <label className={`text-[11px] mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Strength Multiplier</label>
                  <select
                    value={baseStrength}
                    onChange={(e: any) => setBaseStrength(e.target.value)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs border outline-none ${
                      isDarkMode 
                        ? 'bg-[#12121e] border-[#2a2a3e] text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Full">Full Strength (1.0x)</option>
                    <option value="Half (1/2)">Half Strength (0.5x)</option>
                    <option value="Quarter (1/4)">Quarter Strength (0.25x)</option>
                    <option value="Double (2x)">Double Strength (2.0x)</option>
                  </select>
                </div>

                <div>
                  <label className={`text-[11px] mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Target pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.5"
                    max="7.0"
                    value={targetPh}
                    onChange={(e) => setTargetPh(Number(e.target.value))}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-mono border outline-none ${
                      isDarkMode 
                        ? 'bg-[#12121e] border-[#2a2a3e] text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Carbon & Biocide PPM & Gelling */}
            <div className={`p-4 rounded-xl border space-y-4 ${
              isDarkMode ? 'bg-[#161624] border-[#26263a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="text-xs font-bold text-[#7b2cbf] dark:text-[#c77dff] uppercase tracking-wider font-mono">2. Carbon, Gelling & PPM™ Biocide</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`text-[11px] mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Sucrose (g/L)</label>
                  <input
                    type="number"
                    value={sucroseGramsPerL}
                    onChange={(e) => setSucroseGramsPerL(Number(e.target.value))}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-mono border outline-none ${
                      isDarkMode 
                        ? 'bg-[#12121e] border-[#2a2a3e] text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-[11px] mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Gelling Agent</label>
                  <select
                    value={gellingAgent}
                    onChange={(e: any) => setGellingAgent(e.target.value)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs border outline-none ${
                      isDarkMode 
                        ? 'bg-[#12121e] border-[#2a2a3e] text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Gellan Gum (Gelrite)">Gellan Gum (Gelrite)</option>
                    <option value="Agar">TC Micropropagation Agar</option>
                    <option value="Phytagel">Phytagel</option>
                    <option value="Liquid (No Gelling)">Liquid (No Gelling Agent)</option>
                  </select>
                </div>

                <div>
                  <label className={`text-[11px] mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Gelling Density (g/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={gellingGramsPerL}
                    onChange={(e) => setGellingGramsPerL(Number(e.target.value))}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-mono border outline-none ${
                      isDarkMode 
                        ? 'bg-[#12121e] border-[#2a2a3e] text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* PPM Biocide Slider */}
              <div className={`p-3 rounded-lg border ${
                isDarkMode ? 'bg-[#11111c] border-[#222236]' : 'bg-purple-50/60 border-purple-200'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    PPM™ (Plant Preservative Mixture) Concentration:
                  </span>
                  <span className="font-mono text-[#7b2cbf] dark:text-[#c77dff] font-bold">{ppmVolumeMlPerL} ml / L</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.1"
                  value={ppmVolumeMlPerL}
                  onChange={(e) => setPpmVolumeMlPerL(Number(e.target.value))}
                  className="w-full accent-[#7b2cbf] cursor-pointer"
                />
                <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Recommended: 1.0 - 1.5 ml/L for subculturing, 2.0 - 3.0 ml/L for Stage I initiation.
                </p>
              </div>
            </div>

            {/* PGR Section */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              isDarkMode ? 'bg-[#161624] border-[#26263a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#7b2cbf] dark:text-[#c77dff] uppercase tracking-wider font-mono">
                  3. Plant Growth Regulators (PGRs)
                </h4>
                <button
                  type="button"
                  onClick={handleAddPgr}
                  className="text-xs bg-[#7b2cbf]/10 dark:bg-[#7b2cbf]/30 hover:bg-[#7b2cbf]/20 text-[#7b2cbf] dark:text-[#c77dff] px-2.5 py-1 rounded-lg border border-[#7b2cbf]/40 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add PGR
                </button>
              </div>

              <div className="space-y-2">
                {pgrs.map((pgr) => (
                  <div key={pgr.id} className={`flex items-center gap-2 p-2 rounded-lg border ${
                    isDarkMode ? 'bg-[#12121e] border-[#222236]' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="text"
                      placeholder="PGR Name (e.g. BAP, NAA)"
                      value={pgr.name}
                      onChange={(e) => handleUpdatePgr(pgr.id, 'name', e.target.value)}
                      className={`flex-1 border rounded px-2 py-1 text-xs ${
                        isDarkMode ? 'bg-[#181828] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <select
                      value={pgr.type}
                      onChange={(e: any) => handleUpdatePgr(pgr.id, 'type', e.target.value)}
                      className={`w-28 border rounded px-2 py-1 text-xs ${
                        isDarkMode ? 'bg-[#181828] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Cytokinin">Cytokinin</option>
                      <option value="Auxin">Auxin</option>
                      <option value="Gibberellin">Gibberellin</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex items-center gap-1 w-28">
                      <input
                        type="number"
                        step="0.01"
                        value={pgr.concentrationMgL}
                        onChange={(e) => handleUpdatePgr(pgr.id, 'concentrationMgL', Number(e.target.value))}
                        className={`w-full border rounded px-2 py-1 text-xs font-mono ${
                          isDarkMode ? 'bg-[#181828] border-[#2e2e42] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>mg/L</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePgr(pgr.id)}
                      className={`p-1 ${isDarkMode ? 'text-slate-400 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Notes */}
            <div>
              <label className={`text-xs font-semibold mb-1 block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Preparation & Autoclaving Instructions</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none ${
                  isDarkMode 
                    ? 'bg-[#161624] border-[#28283e] text-white focus:ring-1 focus:ring-[#7b2cbf]' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-purple-600'
                }`}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#7b2cbf]/30 flex items-center gap-2 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Formula to Lab Library</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Batch Volume Calculator */}
        <div className="space-y-6">
          {/* Batch Calculator Box */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-[#222232]' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Calculator className="w-4 h-4 text-emerald-500" />
                Batch Scaling Calculator
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                Auto-Scale
              </span>
            </div>

            <div>
              <label className={`text-xs font-medium mb-1.5 block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Select Target Batch Preparation Volume:</label>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[0.25, 0.5, 1.0, 5.0].map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setBatchVolumeL(vol)}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      batchVolumeL === vol
                        ? 'bg-[#7b2cbf] text-white border-[#7b2cbf]'
                        : isDarkMode
                          ? 'bg-[#181826] text-slate-400 border-[#28283e] hover:text-white'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {vol >= 1 ? `${vol} L` : `${vol * 1000} ml`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Custom Volume:</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={batchVolumeL}
                  onChange={(e) => setBatchVolumeL(Number(e.target.value))}
                  className={`w-24 rounded-lg px-2.5 py-1 text-xs font-mono border outline-none ${
                    isDarkMode 
                      ? 'bg-[#181826] border-[#2e2e42] text-white' 
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Liters</span>
              </div>
            </div>

            {/* Calculated Quantities Table */}
            <div className={`p-3 rounded-xl border space-y-2 text-xs font-mono ${
              isDarkMode ? 'bg-[#161624] border-[#222234]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`flex justify-between py-1 border-b text-slate-500 ${isDarkMode ? 'border-[#222232]' : 'border-slate-200'}`}>
                <span>Ingredient</span>
                <span>Calculated Mass/Vol</span>
              </div>
              <div className={`flex justify-between py-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                <span>{baseMedium} Base Salts:</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalBaseSaltsGrams} g</span>
              </div>
              <div className={`flex justify-between py-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                <span>Sucrose:</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalSucroseGrams} g</span>
              </div>
              <div className={`flex justify-between py-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                <span>{gellingAgent}:</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalGellingGrams} g</span>
              </div>
              <div className="flex justify-between py-1 text-[#7b2cbf] dark:text-[#c77dff] font-bold">
                <span>PPM™ Biocide:</span>
                <span>{totalPpmMl} ml</span>
              </div>
              {pgrs.map((p) => (
                <div key={p.id} className="flex justify-between py-1 text-emerald-600 dark:text-emerald-300 font-semibold">
                  <span>{p.name}:</span>
                  <span>{(p.concentrationMgL * batchVolumeL).toFixed(2)} mg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
