import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { KnowledgeArticle } from '../types';
import { INITIAL_KNOWLEDGE_BASE } from '../data/mockData';
import { recordPctAffiliateClick } from '../services/storage';

interface KnowledgeBaseViewProps {
  isDarkMode?: boolean;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ isDarkMode = false }) => {
  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(INITIAL_KNOWLEDGE_BASE[0]);

  // Interactive Diagnostic Assistant state
  const [symptom, setSymptom] = useState<string>('browning');

  const filteredArticles = INITIAL_KNOWLEDGE_BASE.filter(a => {
    const matchesSkill = skillFilter === 'All' || a.skillLevel === skillFilter;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return matchesSkill && matchesSearch;
  });

  const diagnosticGuides: Record<string, { problem: string; cause: string; solution: string; pctProduct: string; pctUrl: string }> = {
    browning: {
      problem: 'Black / Brown Exudate in Media',
      cause: 'Phenolic oxidation released by explant cut vascular tissues during Stage I initiation.',
      solution: 'Soak explants in 150 mg/L Ascorbic Acid + 100 mg/L Citric Acid antioxidant bath for 30 mins before plating. Add 2.0 g/L Activated Charcoal to media.',
      pctProduct: 'PCT Activated Charcoal & Antioxidant Pack',
      pctUrl: 'https://plantcelltechnology.com/'
    },
    cloudiness: {
      problem: 'White / Milky Cloudiness Around Explant Base',
      cause: 'Bacterial contamination or latent vascular endophytic bacteria emerging.',
      solution: 'Dip explant in 5% PPM™ biocide bath for 15 minutes. Subculture onto media fortified with 2.0 - 3.0 ml/L PPM™.',
      pctProduct: 'Plant Preservative Mixture (PPM™) 100ml',
      pctUrl: 'https://plantcelltechnology.com/products/ppm-plant-preservative-mixture'
    },
    vitrification: {
      problem: 'Translucent, Glassy, Water-Soaked Leaves (Hyperhydricity)',
      cause: 'Excess free water on media surface, high relative humidity, or excessive cytokinin (BAP/TDZ) concentration.',
      solution: 'Increase gelling agent density (Gelrite to 2.5g/L or Agar to 8g/L). Lower cytokinin concentration by 50%. Ensure vessel vented lid airflow.',
      pctProduct: 'High Clarity Gellan Gum (Gelrite) 250g',
      pctUrl: 'https://plantcelltechnology.com/'
    },
    noshoots: {
      problem: 'Explant Alive but No Axillary Shoot Proliferation',
      cause: 'Sub-optimal Cytokinin-to-Auxin ratio or apical dominance inhibition.',
      solution: 'Increase BAP concentration (e.g. from 0.5 mg/L to 1.5 mg/L). Decapitate apical shoot tip to release axillary bud growth.',
      pctProduct: 'BAP (6-Benzylaminopurine) Stock Solution',
      pctUrl: 'https://plantcelltechnology.com/'
    }
  };

  const currentDiagnostic = diagnosticGuides[symptom] || diagnosticGuides.browning;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
        isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <GraduationCap className="w-5 h-5 text-[#9d4edd]" />
            Plant Cell Technology Knowledge Hub & Masterclasses
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Educational protocols, video masterclasses, sterilization guides, and diagnostic troubleshooting powered by PCT.
          </p>
        </div>

        <button
          onClick={() => recordPctAffiliateClick('Knowledge Base PCT Learning Hub')}
          className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/20 flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore PCT Learning Hub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Tissue Culture Diagnostic Assistant */}
      <div className={`p-5 rounded-2xl space-y-4 border ${
        isDarkMode 
          ? 'bg-gradient-to-r from-[#181226] via-[#201436] to-[#120e22] border-[#7b2cbf]/40' 
          : 'bg-purple-50/70 border-purple-200'
      }`}>
        <div className="flex items-center gap-2">
          <HelpCircle className={`w-5 h-5 ${isDarkMode ? 'text-[#c77dff]' : 'text-[#7b2cbf]'}`} />
          <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-purple-950'}`}>Interactive Tissue Culture Diagnostic Assistant</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`text-xs mb-1.5 block ${isDarkMode ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>Select Culture Symptom:</label>
            <div className="space-y-1.5">
              {[
                { id: 'browning', label: 'Black / Brown Exudate in Media' },
                { id: 'cloudiness', label: 'Milky Cloudiness at Stem Base' },
                { id: 'vitrification', label: 'Translucent Glassy Leaves' },
                { id: 'noshoots', label: 'No Shoot Proliferation' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSymptom(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                    symptom === item.id
                      ? 'bg-[#7b2cbf] text-white shadow-md shadow-[#7b2cbf]/20 border-transparent'
                      : isDarkMode 
                        ? 'bg-[#181828] text-slate-400 hover:text-white border-[#2e2e42]' 
                        : 'bg-white text-slate-700 hover:text-slate-900 border-purple-200/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-xl space-y-3 border ${
            isDarkMode ? 'bg-[#12121e] border-[#2e2e46]' : 'bg-white border-purple-200 shadow-xs'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDarkMode ? 'border-[#252538]' : 'border-purple-100'
            }`}>
              <span className={`text-xs font-bold uppercase font-mono tracking-wider ${isDarkMode ? 'text-[#c77dff]' : 'text-[#7b2cbf]'}`}>
                Diagnosis & Solution
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                PCT Verified Protocol
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className={`font-semibold block text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Primary Cause:</span>
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{currentDiagnostic.cause}</span>
              </div>

              <div>
                <span className={`font-semibold block text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Recommended Protocol Action:</span>
                <span className={`font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{currentDiagnostic.solution}</span>
              </div>
            </div>

            <div className={`pt-2 flex items-center justify-between border-t ${
              isDarkMode ? 'border-[#252538]' : 'border-purple-100'
            }`}>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Recommended Fix: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{currentDiagnostic.pctProduct}</strong>
              </span>
              <button
                onClick={() => recordPctAffiliateClick(currentDiagnostic.pctProduct, currentDiagnostic.pctUrl)}
                className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <span>Buy Solution</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Articles View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Article List */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3 rounded-xl border ${
            isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>PCT Articles ({filteredArticles.length})</span>
            <div className="relative w-40">
              <input
                type="text"
                placeholder="Filter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full text-xs rounded-lg px-2.5 py-1 outline-none border ${
                  isDarkMode 
                    ? 'bg-[#181826] border-[#28283e] text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredArticles.map((art) => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? isDarkMode ? 'bg-[#1d1430] border-[#7b2cbf] shadow-md' : 'bg-purple-50 border-purple-400 shadow-xs'
                      : isDarkMode ? 'bg-[#11111a] border-[#222232] hover:border-[#7b2cbf]/40' : 'bg-white border-slate-200 hover:border-purple-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={`font-bold ${isDarkMode ? 'text-[#c77dff]' : 'text-[#7b2cbf]'}`}>{art.category}</span>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{art.readTimeMinutes} min read</span>
                  </div>
                  <h4 className={`font-bold text-xs leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{art.title}</h4>
                  <p className={`text-[11px] line-clamp-2 mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{art.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Selected Article Details */}
        <div className={`lg:col-span-2 p-6 rounded-2xl space-y-5 border ${
          isDarkMode ? 'bg-[#11111a] border-[#222232]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {selectedArticle ? (
            <div className="space-y-4">
              <div className={`flex items-center justify-between pb-3 border-b ${
                isDarkMode ? 'border-[#222232]' : 'border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#7b2cbf]/10 text-[#7b2cbf] dark:bg-[#7b2cbf]/30 dark:text-[#c77dff] border border-[#7b2cbf]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      {selectedArticle.category}
                    </span>
                    <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>By {selectedArticle.author}</span>
                  </div>
                  <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedArticle.title}</h2>
                </div>

                <button
                  onClick={() => recordPctAffiliateClick(selectedArticle.title, selectedArticle.pctArticleUrl)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 border ${
                    isDarkMode ? 'bg-[#181826] hover:bg-[#222238] border-[#2e2e42] text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                >
                  <span>PCT Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Content Body */}
              <div className={`prose prose-sm max-w-none text-xs leading-relaxed space-y-3 whitespace-pre-line ${
                isDarkMode ? 'prose-invert text-slate-300' : 'text-slate-700'
              }`}>
                {selectedArticle.content}
              </div>

              {/* Tagged Reagents */}
              <div className={`p-4 rounded-xl border space-y-2 pt-3 ${
                isDarkMode ? 'bg-[#161624] border-[#222234]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-xs font-bold uppercase font-mono tracking-wider block ${
                  isDarkMode ? 'text-[#c77dff]' : 'text-[#7b2cbf]'
                }`}>
                  Reagents Used in This Protocol:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.pctProductTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => recordPctAffiliateClick(tag)}
                      className={`text-xs px-3 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors border ${
                        isDarkMode 
                          ? 'bg-[#1e1e32] hover:bg-[#2a2a46] border-[#363654] text-slate-200' 
                          : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{tag}</span>
                      <ExternalLink className={`w-3 h-3 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={`py-12 text-center text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select an article from the left list.</div>
          )}
        </div>
      </div>
    </div>
  );
};
