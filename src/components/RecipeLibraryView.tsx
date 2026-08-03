import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpenCheck, 
  Search, 
  Plus, 
  ShieldCheck, 
  Bookmark, 
  FlaskConical
} from 'lucide-react';
import { MediaRecipe } from '../types';
import { saveRecipe } from '../services/storage';

interface RecipeLibraryViewProps {
  recipes: MediaRecipe[];
  activeLabId: string;
  isDarkMode?: boolean;
  onRecipeSaved: () => void;
  onNavigateToBuilder: () => void;
}

export const RecipeLibraryView: React.FC<RecipeLibraryViewProps> = ({
  recipes,
  activeLabId,
  isDarkMode = false,
  onRecipeSaved,
  onNavigateToBuilder
}) => {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (r.targetSpecies && r.targetSpecies.toLowerCase().includes(search.toLowerCase()));

    const matchesSpecies = speciesFilter === 'All' || (r.targetSpecies && r.targetSpecies.toLowerCase().includes(speciesFilter.toLowerCase()));

    return matchesSearch && matchesSpecies;
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
      {/* Header */}
      <div className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-5 h-5 text-[#9d4edd]" />
            Tissue Culture Recipe & Protocol Library
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Browse benchmark protocols and community formulations for exotics, woodies, and rare clones.
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

      {/* Filter Tabs & Search */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Total Formulations ({filteredRecipes.length})
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search recipes, species..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full text-xs rounded-lg pl-8 pr-3 py-1.5 outline-none border ${
              isDarkMode 
                ? 'bg-[#181826] border-[#28283e] focus:border-[#7b2cbf] text-white' 
                : 'bg-slate-50 border-slate-300 focus:border-purple-600 text-slate-900 focus:bg-white'
            }`}
          />
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecipes.map((r) => (
          <div 
            key={r.id} 
            className={`p-5 rounded-2xl transition-all space-y-4 flex flex-col justify-between border ${
              isDarkMode 
                ? 'bg-[#11111a] border-[#222232] hover:border-[#7b2cbf]/50' 
                : 'bg-white border-slate-200 hover:border-purple-400 shadow-xs'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isDarkMode ? 'bg-[#181828] text-slate-400 border-[#2a2a3e]' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {r.baseMedium} ({r.baseStrength})
                    </span>
                  </div>
                  <h3 className={`font-bold text-base leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{r.name}</h3>
                </div>

                <span className="text-[10px] font-semibold bg-[#7b2cbf]/10 text-[#7b2cbf] dark:bg-[#7b2cbf]/20 dark:text-[#c77dff] px-2 py-0.5 rounded border border-[#7b2cbf]/30 shrink-0">
                  {r.difficulty}
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{r.description}</p>

              {/* Formulation Stats Grid */}
              <div className={`p-3 rounded-xl border space-y-2 text-xs ${
                isDarkMode ? 'bg-[#161622] border-[#222234]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500 font-medium'}>Target Species:</span>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{r.targetSpecies || 'General Exotics'}</span>
                </div>

                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500 font-medium'}>Sucrose & Gelling:</span>
                  <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{r.sucroseGramsPerL}g/L • {r.gellingAgent} ({r.gellingGramsPerL}g/L)</span>
                </div>

                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500 font-medium'}>PPM™ Biocide:</span>
                  <span className="font-mono text-[#7b2cbf] dark:text-[#c77dff] font-bold">{r.ppmVolumeMlPerL} ml/L</span>
                </div>

                <div className={`pt-1 border-t ${isDarkMode ? 'border-[#222232]' : 'border-slate-200'}`}>
                  <span className={`text-[11px] block mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>PGR Concentrations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.pgrs.map((p) => (
                      <span key={p.id} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-medium">
                        {p.name}: {p.concentrationMgL} mg/L
                      </span>
                    ))}
                    {r.pgrs.length === 0 && <span className={`text-[10px] italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hormone-free medium</span>}
                  </div>
                </div>
              </div>

              {r.notes && (
                <p className={`text-[11px] italic p-2 rounded-lg ${
                  isDarkMode ? 'text-slate-400 bg-[#141420]' : 'text-slate-600 bg-slate-100'
                }`}>
                  "{r.notes}"
                </p>
              )}
            </div>

            {/* Card Actions */}
            <div className={`pt-2 border-t flex items-center justify-between gap-2 ${isDarkMode ? 'border-[#222232]' : 'border-slate-200'}`}>
              <button
                onClick={() => handleCopyRecipeToLab(r)}
                className={`w-full text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 border ${
                  isDarkMode 
                    ? 'bg-[#181826] hover:bg-[#222238] border-[#2c2c42] text-slate-200' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-[#9d4edd]" />
                <span>Save to My Lab</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
