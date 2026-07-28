import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpenCheck, 
  Search, 
  Plus, 
  ShieldCheck, 
  ExternalLink, 
  Bookmark, 
  ChevronRight,
  FlaskConical
} from 'lucide-react';
import { MediaRecipe } from '../types';
import { saveRecipe, recordPctAffiliateClick } from '../services/storage';

interface RecipeLibraryViewProps {
  recipes: MediaRecipe[];
  activeLabId: string;
  onRecipeSaved: () => void;
  onNavigateToBuilder: () => void;
}

export const RecipeLibraryView: React.FC<RecipeLibraryViewProps> = ({
  recipes,
  activeLabId,
  onRecipeSaved,
  onNavigateToBuilder
}) => {
  const [filterType, setFilterType] = useState<'all' | 'pct' | 'community'>('all');
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');

  const filteredRecipes = recipes.filter((r) => {
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'pct' && r.pctRecommended) || 
      (filterType === 'community' && !r.pctRecommended);

    const matchesSearch = 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (r.targetSpecies && r.targetSpecies.toLowerCase().includes(search.toLowerCase()));

    const matchesSpecies = speciesFilter === 'All' || (r.targetSpecies && r.targetSpecies.toLowerCase().includes(speciesFilter.toLowerCase()));

    return matchesFilter && matchesSearch && matchesSpecies;
  });

  const handleCopyRecipeToLab = (recipe: MediaRecipe) => {
    const copy: MediaRecipe = {
      ...recipe,
      id: `rec-copy-${Date.now()}`,
      labId: activeLabId,
      name: `${recipe.name} (My Copy)`,
      author: 'Saved from Library'
    };
    saveRecipe(copy);
    onRecipeSaved();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & PCT Banner */}
      <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#9d4edd]" />
            Tissue Culture Recipe & Protocol Library
          </h2>
          <p className="text-xs text-slate-400">
            Browse verified Plant Cell Technology protocols and community formulation benchmarks for exotics, woodies, and rare clones.
          </p>
        </div>

        <button
          onClick={onNavigateToBuilder}
          className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Build Custom Recipe</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11111a] border border-[#222232] p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all' ? 'bg-[#7b2cbf] text-white' : 'bg-[#181826] text-slate-400 hover:text-white'
            }`}
          >
            All Protocols ({recipes.length})
          </button>
          <button
            onClick={() => setFilterType('pct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              filterType === 'pct' ? 'bg-[#7b2cbf] text-white' : 'bg-[#181826] text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            PCT Recommended
          </button>
          <button
            onClick={() => setFilterType('community')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'community' ? 'bg-[#7b2cbf] text-white' : 'bg-[#181826] text-slate-400 hover:text-white'
            }`}
          >
            Community Formulations
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search recipes, species..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181826] border border-[#28283e] focus:border-[#7b2cbf] text-xs text-white rounded-lg pl-8 pr-3 py-1.5 outline-none"
          />
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecipes.map((r) => (
          <div 
            key={r.id} 
            className="bg-[#11111a] border border-[#222232] hover:border-[#7b2cbf]/50 p-5 rounded-2xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {r.pctRecommended && (
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> PCT Verified
                      </span>
                    )}
                    <span className="bg-[#181828] text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-[#2a2a3e]">
                      {r.baseMedium} ({r.baseStrength})
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{r.name}</h3>
                </div>

                <span className="text-[10px] font-semibold bg-[#7b2cbf]/20 text-[#c77dff] px-2 py-0.5 rounded border border-[#7b2cbf]/30 shrink-0">
                  {r.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>

              {/* Formulation Stats Grid */}
              <div className="bg-[#161622] p-3 rounded-xl border border-[#222234] space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Target Species:</span>
                  <span className="font-medium text-white">{r.targetSpecies || 'General Exotics'}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Sucrose & Gelling:</span>
                  <span className="font-mono text-slate-200">{r.sucroseGramsPerL}g/L • {r.gellingAgent} ({r.gellingGramsPerL}g/L)</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">PPM™ Biocide:</span>
                  <span className="font-mono text-[#c77dff] font-bold">{r.ppmVolumeMlPerL} ml/L</span>
                </div>

                <div className="pt-1 border-t border-[#222232]">
                  <span className="text-slate-400 text-[11px] block mb-1">PGR Concentrations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.pgrs.map((p) => (
                      <span key={p.id} className="bg-[#1a1a28] text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
                        {p.name}: {p.concentrationMgL} mg/L
                      </span>
                    ))}
                    {r.pgrs.length === 0 && <span className="text-[10px] text-slate-500 italic">Hormone-free medium</span>}
                  </div>
                </div>
              </div>

              {r.notes && (
                <p className="text-[11px] text-slate-400 italic bg-[#141420] p-2 rounded-lg">
                  "{r.notes}"
                </p>
              )}
            </div>

            {/* Card Actions */}
            <div className="pt-2 border-t border-[#222232] flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopyRecipeToLab(r)}
                className="flex-1 bg-[#181826] hover:bg-[#222238] border border-[#2c2c42] text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#9d4edd]" />
                <span>Save to My Lab</span>
              </button>

              {r.pctBuyUrl && (
                <button
                  onClick={() => recordPctAffiliateClick(r.name, r.pctBuyUrl)}
                  className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1 shadow-md shadow-[#7b2cbf]/20 shrink-0"
                >
                  <span>Buy Reagents</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
