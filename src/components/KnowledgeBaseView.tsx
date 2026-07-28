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

export const KnowledgeBaseView: React.FC = () => {
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
      <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#9d4edd]" />
            Plant Cell Technology Knowledge Hub & Masterclasses
          </h2>
          <p className="text-xs text-slate-400">
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
      <div className="bg-gradient-to-r from-[#181226] via-[#201436] to-[#120e22] border border-[#7b2cbf]/40 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#c77dff]" />
          <h3 className="text-sm font-bold text-white">Interactive Tissue Culture Diagnostic Assistant</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-300 mb-1.5 block">Select Culture Symptom:</label>
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
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    symptom === item.id
                      ? 'bg-[#7b2cbf] text-white shadow-md shadow-[#7b2cbf]/20'
                      : 'bg-[#181828] text-slate-400 hover:text-white border border-[#2e2e42]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-[#12121e] border border-[#2e2e46] p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#252538]">
              <span className="text-xs font-bold text-[#c77dff] uppercase font-mono tracking-wider">
                Diagnosis & Solution
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                PCT Verified Protocol
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Primary Cause:</span>
                <span className="text-slate-200">{currentDiagnostic.cause}</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Recommended Protocol Action:</span>
                <span className="text-emerald-300 font-medium">{currentDiagnostic.solution}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#252538]">
              <span className="text-xs font-medium text-slate-300">
                Recommended Fix: <strong className="text-white">{currentDiagnostic.pctProduct}</strong>
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
          <div className="flex items-center justify-between bg-[#11111a] border border-[#222232] p-3 rounded-xl">
            <span className="text-xs font-bold text-white">PCT Articles ({filteredArticles.length})</span>
            <div className="relative w-40">
              <input
                type="text"
                placeholder="Filter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#181826] border border-[#28283e] text-xs text-white rounded-lg px-2.5 py-1 outline-none"
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
                      ? 'bg-[#1d1430] border-[#7b2cbf] shadow-md'
                      : 'bg-[#11111a] border-[#222232] hover:border-[#7b2cbf]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-[#c77dff] font-bold">{art.category}</span>
                    <span className="text-slate-400">{art.readTimeMinutes} min read</span>
                  </div>
                  <h4 className="font-bold text-white text-xs leading-snug">{art.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{art.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Selected Article Details */}
        <div className="lg:col-span-2 bg-[#11111a] border border-[#222232] p-6 rounded-2xl space-y-5">
          {selectedArticle ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#222232]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#7b2cbf]/30 text-[#c77dff] border border-[#7b2cbf]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">By {selectedArticle.author}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedArticle.title}</h2>
                </div>

                <button
                  onClick={() => recordPctAffiliateClick(selectedArticle.title, selectedArticle.pctArticleUrl)}
                  className="bg-[#181826] hover:bg-[#222238] border border-[#2e2e42] text-slate-200 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0"
                >
                  <span>PCT Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 text-xs leading-relaxed space-y-3 whitespace-pre-line">
                {selectedArticle.content}
              </div>

              {/* Tagged Reagents */}
              <div className="bg-[#161624] p-4 rounded-xl border border-[#222234] space-y-2 pt-3">
                <span className="text-xs font-bold text-[#c77dff] uppercase font-mono tracking-wider block">
                  Reagents Used in This Protocol:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.pctProductTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => recordPctAffiliateClick(tag)}
                      className="bg-[#1e1e32] hover:bg-[#2a2a46] border border-[#363654] text-slate-200 text-xs px-3 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tag}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">Select an article from the left list.</div>
          )}
        </div>
      </div>
    </div>
  );
};
