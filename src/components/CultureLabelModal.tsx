import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Printer, 
  X, 
  QrCode, 
  Barcode, 
  Copy, 
  Check, 
  Layers, 
  ExternalLink,
  FlaskConical,
  Tag,
  Download
} from 'lucide-react';
import { Culture } from '../types';

interface CultureLabelModalProps {
  culture: Culture | null; // Single culture or null
  allCultures?: Culture[]; // Optional batch cultures
  isDarkMode?: boolean;
  onClose: () => void;
}

export const CultureLabelModal: React.FC<CultureLabelModalProps> = ({
  culture,
  allCultures = [],
  isDarkMode = false,
  onClose
}) => {
  const [selectedCultureId, setSelectedCultureId] = useState<string>(culture ? culture.id : (allCultures[0]?.id || ''));
  const [copiesCount, setCopiesCount] = useState<number>(culture ? (culture.vesselCount || 1) : 1);
  const [labelSize, setLabelSize] = useState<'vessel' | 'jar' | 'badge'>('vessel');
  const [codeType, setCodeType] = useState<'qr' | 'barcode' | 'both'>('both');
  const [isBatchMode, setIsBatchMode] = useState<boolean>(!culture && allCultures.length > 0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const activeCulture = culture || allCultures.find(c => c.id === selectedCultureId) || allCultures[0];

  if (!activeCulture && !isBatchMode) return null;

  // Scan URL that links directly back to this culture record
  const scanUrl = activeCulture 
    ? `${window.location.origin}${window.location.pathname}?culture=${encodeURIComponent(activeCulture.code)}`
    : '';

  // Generate simple SVG Barcode lines based on string characters hash
  const renderBarcodeLines = (str: string) => {
    // Generate deterministic bar widths based on ASCII values
    const bars: { width: number; space: number }[] = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      bars.push({ width: (code % 3) + 1.5, space: ((code * 3) % 3) + 1.2 });
    }
    // Repeat sequence to give standard barcode density
    const fullBars = [...bars, ...bars].slice(0, 24);

    let currentX = 0;
    return (
      <svg className="h-10 w-full max-w-[200px]" viewBox="0 0 200 40">
        <rect x="0" y="0" width="200" height="40" fill="#ffffff" />
        {/* Quiet zones */}
        {fullBars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width + bar.space;
          if (x > 185) return null;
          return (
            <rect 
              key={idx} 
              x={x + 10} 
              y="2" 
              width={bar.width} 
              height="36" 
              fill="#000000" 
            />
          );
        })}
      </svg>
    );
  };

  const handleCopyLink = () => {
    if (!scanUrl) return;
    navigator.clipboard.writeText(scanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const listToPrint = isBatchMode ? allCultures : [activeCulture];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 my-8 ${
        isDarkMode ? 'bg-[#12121c] border-[#2e2e48] text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDarkMode ? 'border-[#252538] bg-[#161625]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-[#9d4edd] flex items-center justify-center border border-purple-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isBatchMode ? `Batch Culture Labels (${allCultures.length})` : 'Culture QR & Barcode Label'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBatchMode ? 'Print scan labels for all matching culture batches' : `${activeCulture.speciesName} • ${activeCulture.code}`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-[#222234] text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className={`p-4 border-b grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs ${
          isDarkMode ? 'border-[#222238] bg-[#141420]' : 'border-slate-200 bg-slate-100/60'
        }`}>
          {/* Label Size Selection */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Label Format</label>
            <select
              value={labelSize}
              onChange={(e) => setLabelSize(e.target.value as any)}
              className={`w-full border rounded-lg px-2.5 py-1.5 font-medium outline-none ${
                isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-slate-200' : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="vessel">Vessel Sticker (2.5" x 1.25")</option>
              <option value="jar">Jar Cap Label (2" Circle / Square)</option>
              <option value="badge">Lab Card (3.5" x 2.25")</option>
            </select>
          </div>

          {/* Code Type Selection */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Code Type</label>
            <select
              value={codeType}
              onChange={(e) => setCodeType(e.target.value as any)}
              className={`w-full border rounded-lg px-2.5 py-1.5 font-medium outline-none ${
                isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-slate-200' : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="both">QR Code + Barcode</option>
              <option value="qr">QR Code Only</option>
              <option value="barcode">Barcode Only</option>
            </select>
          </div>

          {/* Copies Count */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              {isBatchMode ? 'Copies per Culture' : 'Number of Label Copies'}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={copiesCount}
              onChange={(e) => setCopiesCount(Math.max(1, Number(e.target.value)))}
              className={`w-full border rounded-lg px-2.5 py-1.5 font-medium outline-none ${
                isDarkMode ? 'bg-[#181826] border-[#2e2e42] text-slate-200' : 'bg-white border-slate-300 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* Modal Body: Label Preview Area */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Print Preview Container */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#9d4edd]" />
                Label Print Preview ({labelSize.toUpperCase()})
              </span>
              {activeCulture && (
                <button
                  onClick={handleCopyLink}
                  className={`text-xs font-medium flex items-center gap-1 text-purple-600 dark:text-[#c77dff] hover:underline`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Scan Link Copied!' : 'Copy Scan URL'}</span>
                </button>
              )}
            </div>

            {/* Printable Label Display Card */}
            <div className="flex justify-center p-4 bg-slate-200 dark:bg-[#0a0a10] rounded-xl border border-slate-300 dark:border-[#222234]">
              <div 
                id="printable-labels-area"
                className="space-y-4 max-w-full print:m-0 print:p-0"
              >
                {listToPrint.map((cult) => {
                  const cultUrl = `${window.location.origin}${window.location.pathname}?culture=${encodeURIComponent(cult.code)}`;
                  
                  return Array.from({ length: copiesCount }).map((_, copyIdx) => (
                    <div 
                      key={`${cult.id}-${copyIdx}`}
                      className={`printable-label bg-white text-slate-900 border-2 border-slate-800 rounded-lg p-3 shadow-md select-none font-sans print:border-black print:shadow-none print:break-inside-avoid ${
                        labelSize === 'vessel' 
                          ? 'w-[320px] min-h-[140px]' 
                          : labelSize === 'jar' 
                          ? 'w-[240px] min-h-[240px] flex flex-col items-center justify-center text-center' 
                          : 'w-[420px] min-h-[220px]'
                      }`}
                    >
                      {/* Label Header */}
                      <div className="flex items-start justify-between border-b border-slate-300 pb-1.5 mb-2 w-full">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-sm bg-slate-900 text-white px-1.5 py-0.5 rounded text-xs">
                              {cult.code}
                            </span>
                            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-tight">
                              {cult.stage}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs leading-tight text-slate-900 mt-1 line-clamp-1">
                            {cult.speciesName}
                          </h4>
                          {cult.cultivar && (
                            <p className="text-[10px] text-slate-600 font-semibold italic">'{cult.cultivar}'</p>
                          )}
                        </div>
                        <div className="text-right font-mono text-[9px] text-slate-500 shrink-0 ml-2">
                          <div>Gen {cult.generationCount}</div>
                          <div>{cult.initiatedDate}</div>
                        </div>
                      </div>

                      {/* Label Center Content (QR / Barcode) */}
                      <div className="flex items-center justify-between gap-3 my-1 w-full">
                        <div className="space-y-1 text-[10px] text-slate-700 font-medium flex-1 min-w-0">
                          <div className="truncate">
                            <strong className="text-slate-900">Recipe:</strong> {cult.mediaRecipeName}
                          </div>
                          <div>
                            <strong className="text-slate-900">Vessels:</strong> {cult.vesselCount} ({cult.plantletsCount} plantlets)
                          </div>
                          <div>
                            <strong className="text-slate-900">Subculture Due:</strong> {cult.nextSubcultureDate}
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono pt-0.5 border-t border-slate-200">
                            tissue.farmr • Lab ID: {cult.labId}
                          </div>
                        </div>

                        {/* Codes Area */}
                        <div className="flex flex-col items-center justify-center shrink-0 space-y-1 bg-slate-50 p-1.5 rounded border border-slate-200">
                          {(codeType === 'qr' || codeType === 'both') && (
                            <div className="p-1 bg-white rounded border border-slate-300">
                              <QRCodeSVG 
                                value={cultUrl} 
                                size={labelSize === 'vessel' ? 56 : labelSize === 'jar' ? 72 : 80}
                                level="M"
                              />
                            </div>
                          )}

                          {(codeType === 'barcode' || codeType === 'both') && (
                            <div className="text-center">
                              {renderBarcodeLines(cult.code)}
                              <span className="font-mono text-[8px] tracking-widest text-slate-600 block -mt-0.5">
                                {cult.code}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })}
              </div>
            </div>
          </div>

          {/* Quick Scanner Tester / Explainer */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
            isDarkMode ? 'bg-[#181826] border-[#2a2a3e] text-slate-300' : 'bg-purple-50 border-purple-200 text-purple-950'
          }`}>
            <div className="font-bold flex items-center gap-1.5 text-purple-700 dark:text-[#c77dff]">
              <QrCode className="w-4 h-4" />
              How Scanning Works in tissue.farmr:
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Scanning this QR code with any smartphone camera or USB barcode scanner will open the app and automatically select and highlight the culture record <strong className="text-slate-900 dark:text-white font-mono">{activeCulture?.code}</strong>.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDarkMode ? 'border-[#252538] bg-[#161625]' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-[#222234]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#7b2cbf]/30 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print {isBatchMode ? `${allCultures.length * copiesCount} Labels` : `${copiesCount} Label${copiesCount > 1 ? 's' : ''}`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global CSS for Clean Label Printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-labels-area, #printable-labels-area * {
            visibility: visible;
          }
          #printable-labels-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            padding: 10px;
            background: white !important;
          }
          .printable-label {
            box-shadow: none !important;
            border: 1px solid #000 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};
