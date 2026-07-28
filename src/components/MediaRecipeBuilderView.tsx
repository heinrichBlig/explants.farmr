import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Calculator, 
  Plus, 
  Trash2, 
  Sparkles, 
  ExternalLink, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  DollarSign,
  Layers,
  FlaskConical
} from 'lucide-react';
import { MediaRecipe, PGRConcentration } from '../types';
import { saveRecipe, recordPctAffiliateClick } from '../services/storage';

interface MediaRecipeBuilderViewProps {
  activeLabId: string;
  onRecipeSaved: () => void;
}

export const MediaRecipeBuilderView: React.FC<MediaRecipeBuilderViewProps> = ({
  activeLabId,
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
      pctRecommended: ppmVolumeMlPerL > 0,
      pctProductCode: 'PCT-CUSTOM-REC',
      pctBuyUrl: 'https://plantcelltechnology.com/products/ppm-plant-preservative-mixture',
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
      <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-[#9d4edd]" />
            Media Recipe Builder & Batch Calculator
          </h2>
          <p className="text-xs text-slate-400">
            Design tissue culture formulations, adjust PGR ratios, and auto-scale batch preparations with PCT reagent specs.
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
        <div className="lg:col-span-2 bg-[#11111a] border border-[#222232] p-6 rounded-2xl space-y-5">
          <form onSubmit={handleSaveRecipe} className="space-y-5">
            {/* Basic Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Recipe Name</label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full bg-[#161624] border border-[#28283e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7b2cbf]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Species / Genus</label>
                <input
                  type="text"
                  value={targetSpecies}
                  onChange={(e) => setTargetSpecies(e.target.value)}
                  className="w-full bg-[#161624] border border-[#28283e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7b2cbf]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Description & Purpose</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#161624] border border-[#28283e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7b2cbf]"
              />
            </div>

            {/* Base Medium & Salts */}
            <div className="bg-[#161624] p-4 rounded-xl border border-[#26263a] space-y-4">
              <h4 className="text-xs font-bold text-[#c77dff] uppercase tracking-wider font-mono">1. Base Nutrient Medium</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Base Salts Formulation</label>
                  <select
                    value={baseMedium}
                    onChange={(e: any) => setBaseMedium(e.target.value)}
                    className="w-full bg-[#12121e] border border-[#2a2a3e] rounded-lg px-2.5 py-1.5 text-xs text-white"
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
                  <label className="text-[11px] text-slate-400 mb-1 block">Strength Multiplier</label>
                  <select
                    value={baseStrength}
                    onChange={(e: any) => setBaseStrength(e.target.value)}
                    className="w-full bg-[#12121e] border border-[#2a2a3e] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Full">Full Strength (1.0x)</option>
                    <option value="Half (1/2)">Half Strength (0.5x)</option>
                    <option value="Quarter (1/4)">Quarter Strength (0.25x)</option>
                    <option value="Double (2x)">Double Strength (2.0x)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Target pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.5"
                    max="7.0"
                    value={targetPh}
                    onChange={(e) => setTargetPh(Number(e.target.value))}
                    className="w-full bg-[#12121e] border border-[#2a2a3e] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Carbon & Biocide PPM & Gelling */}
            <div className="bg-[#161624] p-4 rounded-xl border border-[#26263a] space-y-4">
              <h4 className="text-xs font-bold text-[#c77dff] uppercase tracking-wider font-mono">2. Carbon, Gelling & PPM™ Biocide</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Sucrose (g/L)</label>
                  <input
                    type="number"
                    value={sucroseGramsPerL}
                    onChange={(e) => setSucroseGramsPerL(Number(e.target.value))}
                    className="w-full bg-[#12121e] border border-[#2a2a3e] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Gelling Agent</label>
                  <select
                    value={gellingAgent}
                    onChange={(e: any) => setGellingAgent(e.target.value)}
                    className="w-full bg-[#12121e] border border-[#2a2a3e] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Gellan Gum (Gelrite)">Gellan Gum (Gelrite)</option>
                    <option value="Agar">TC Micropropagation Agar</option>
                    <option value="Phytagel">Phytagel</option>
                    <option value="Liquid (No Gelling)">Liquid (No Gelling Agent)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Gelling Density (g/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={gellingGramsPerL}
                    onChange={(e) => setGellingGramsPerL(Number(e.target.value))}
                    className="w-full bg-[#12121e] border border-[#2a2a3e] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* PPM Biocide Slider */}
              <div className="bg-[#11111c] p-3 rounded-lg border border-[#222236]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    PPM™ (Plant Preservative Mixture) Concentration:
                  </span>
                  <span className="font-mono text-[#c77dff] font-bold">{ppmVolumeMlPerL} ml / L</span>
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
                <p className="text-[10px] text-slate-400 mt-1">
                  Recommended: 1.0 - 1.5 ml/L for subculturing, 2.0 - 3.0 ml/L for Stage I initiation.
                </p>
              </div>
            </div>

            {/* PGR Section */}
            <div className="bg-[#161624] p-4 rounded-xl border border-[#26263a] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#c77dff] uppercase tracking-wider font-mono">
                  3. Plant Growth Regulators (PGRs)
                </h4>
                <button
                  type="button"
                  onClick={handleAddPgr}
                  className="text-xs bg-[#7b2cbf]/30 hover:bg-[#7b2cbf]/60 text-[#c77dff] px-2.5 py-1 rounded-lg border border-[#7b2cbf]/40 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add PGR
                </button>
              </div>

              <div className="space-y-2">
                {pgrs.map((pgr) => (
                  <div key={pgr.id} className="flex items-center gap-2 bg-[#12121e] p-2 rounded-lg border border-[#222236]">
                    <input
                      type="text"
                      placeholder="PGR Name (e.g. BAP, NAA)"
                      value={pgr.name}
                      onChange={(e) => handleUpdatePgr(pgr.id, 'name', e.target.value)}
                      className="flex-1 bg-[#181828] border border-[#2e2e42] rounded px-2 py-1 text-xs text-white"
                    />
                    <select
                      value={pgr.type}
                      onChange={(e: any) => handleUpdatePgr(pgr.id, 'type', e.target.value)}
                      className="w-28 bg-[#181828] border border-[#2e2e42] rounded px-2 py-1 text-xs text-white"
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
                        className="w-full bg-[#181828] border border-[#2e2e42] rounded px-2 py-1 text-xs text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-400">mg/L</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePgr(pgr.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Preparation & Autoclaving Instructions</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#161624] border border-[#28283e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#7b2cbf]"
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

        {/* Right Col: Batch Volume Calculator & PCT Affiliate Reagents */}
        <div className="space-y-6">
          {/* Batch Calculator Box */}
          <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#222232]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Batch Batch Scaling Calculator
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                Auto-Scale
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium mb-1.5 block">Select Target Batch Preparation Volume:</label>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[0.25, 0.5, 1.0, 5.0].map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setBatchVolumeL(vol)}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      batchVolumeL === vol
                        ? 'bg-[#7b2cbf] text-white border-[#7b2cbf]'
                        : 'bg-[#181826] text-slate-400 border-[#28283e] hover:text-white'
                    }`}
                  >
                    {vol >= 1 ? `${vol} L` : `${vol * 1000} ml`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Custom Volume:</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={batchVolumeL}
                  onChange={(e) => setBatchVolumeL(Number(e.target.value))}
                  className="w-24 bg-[#181826] border border-[#2e2e42] rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                />
                <span className="text-xs text-slate-400">Liters</span>
              </div>
            </div>

            {/* Calculated Quantities Table */}
            <div className="bg-[#161624] p-3 rounded-xl border border-[#222234] space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#222232] text-slate-400">
                <span>Ingredient</span>
                <span>Calculated Mass/Vol</span>
              </div>
              <div className="flex justify-between py-1 text-slate-200">
                <span>{baseMedium} Base Salts:</span>
                <span className="font-bold text-white">{totalBaseSaltsGrams} g</span>
              </div>
              <div className="flex justify-between py-1 text-slate-200">
                <span>Sucrose:</span>
                <span className="font-bold text-white">{totalSucroseGrams} g</span>
              </div>
              <div className="flex justify-between py-1 text-slate-200">
                <span>{gellingAgent}:</span>
                <span className="font-bold text-white">{totalGellingGrams} g</span>
              </div>
              <div className="flex justify-between py-1 text-[#c77dff] font-bold">
                <span>PPM™ Biocide:</span>
                <span>{totalPpmMl} ml</span>
              </div>
              {pgrs.map((p) => (
                <div key={p.id} className="flex justify-between py-1 text-emerald-300">
                  <span>{p.name}:</span>
                  <span>{(p.concentrationMgL * batchVolumeL).toFixed(2)} mg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Cell Technology Reagents Card */}
          <div className="bg-gradient-to-br from-[#181828] to-[#12121d] border border-[#382256] p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c77dff]" />
                <span className="text-xs font-bold text-white">Buy Formula Reagents from PCT</span>
              </div>
              <span className="text-[10px] bg-[#7b2cbf]/30 text-[#c77dff] px-2 py-0.5 rounded font-mono font-bold">
                AFFILIATE LINK
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Plant Cell Technology provides pre-sterilized MS & WPM media packs, lab grade PPM™, certified PGR stock, and BioTilt™ bioreactor systems.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => recordPctAffiliateClick('PCT PPM 100ml Order')}
                className="w-full bg-[#1e1e30] hover:bg-[#282840] border border-[#343452] p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors group"
              >
                <div className="text-left">
                  <div className="font-semibold text-white group-hover:text-[#c77dff]">PPM™ Biocide 100ml</div>
                  <div className="text-[10px] text-slate-400">Broad-spectrum preservative</div>
                </div>
                <span className="text-xs font-bold text-[#c77dff] flex items-center gap-1">
                  $34.99 <ExternalLink className="w-3 h-3" />
                </span>
              </button>

              <button
                onClick={() => recordPctAffiliateClick('PCT MS Salts Pack Order')}
                className="w-full bg-[#1e1e30] hover:bg-[#282840] border border-[#343452] p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors group"
              >
                <div className="text-left">
                  <div className="font-semibold text-white group-hover:text-[#c77dff]">MS Salts with Vitamins (50L)</div>
                  <div className="text-[10px] text-slate-400">High purity TC grade</div>
                </div>
                <span className="text-xs font-bold text-[#c77dff] flex items-center gap-1">
                  $28.50 <ExternalLink className="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
