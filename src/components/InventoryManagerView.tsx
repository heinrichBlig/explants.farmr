import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  RefreshCw,
  Search,
  ShoppingCart
} from 'lucide-react';
import { InventoryItem, InventoryCategory } from '../types';
import { saveInventoryItem, deleteInventoryItem, restockInventoryItem, recordPctAffiliateClick } from '../services/storage';

interface InventoryManagerViewProps {
  inventory: InventoryItem[];
  activeLabId: string;
  onRefreshData: () => void;
}

export const InventoryManagerView: React.FC<InventoryManagerViewProps> = ({
  inventory,
  activeLabId,
  onRefreshData
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [newItemModal, setNewItemModal] = useState(false);

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('Media Salt');
  const [currentStock, setCurrentStock] = useState(10);
  const [unit, setUnit] = useState<'ml' | 'L' | 'g' | 'kg' | 'units' | 'packs'>('g');
  const [minThreshold, setMinThreshold] = useState(5);
  const [costEstimateUSD, setCostEstimateUSD] = useState(25);
  const [location, setLocation] = useState('Storage Shelf A');
  const [pctBuyUrl, setPctBuyUrl] = useState('https://plantcelltechnology.com/');

  const filteredItems = inventory.filter((item) => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const lowStockCount = inventory.filter(i => i.currentStock <= i.minThreshold).length;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      labId: activeLabId,
      name,
      category,
      currentStock: Number(currentStock),
      unit,
      minThreshold: Number(minThreshold),
      costEstimateUSD: Number(costEstimateUSD),
      location,
      pctBuyUrl: pctBuyUrl || 'https://plantcelltechnology.com/',
      isPctProduct: pctBuyUrl.includes('plantcelltechnology'),
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    saveInventoryItem(item);
    setNewItemModal(false);
    onRefreshData();
  };

  const handleQuickRestock = (id: string, amount: number) => {
    restockInventoryItem(id, amount);
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this inventory item?')) {
      deleteInventoryItem(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#11111a] border border-[#222232] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-[#9d4edd]" />
            Lab Reagent & Supplies Inventory
          </h2>
          <p className="text-xs text-slate-400">
            Monitor stock levels for PPM™ biocide, media salts, PGRs, gelling agents, and vessels with 1-click PCT restock links.
          </p>
        </div>

        <button
          onClick={() => setNewItemModal(true)}
          className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#7b2cbf]/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Reagent</span>
        </button>
      </div>

      {/* Low Stock Alert Header if any */}
      {lowStockCount > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300">{lowStockCount} Reagents Running Below Threshold!</h4>
              <p className="text-[11px] text-slate-300">Order directly from Plant Cell Technology to prevent culture subculture delays.</p>
            </div>
          </div>

          <button
            onClick={() => recordPctAffiliateClick('Low Stock Restock All Banner')}
            className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-[#7b2cbf]/20 shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Order All Low Stock from PCT</span>
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11111a] border border-[#222232] p-3 rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'PPM', 'Media Salt', 'PGR', 'Gelling Agent', 'Vessel', 'Sugar & Carbon'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat ? 'bg-[#7b2cbf] text-white' : 'bg-[#181826] text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181826] border border-[#28283e] focus:border-[#7b2cbf] text-xs text-white rounded-lg pl-8 pr-3 py-1.5 outline-none"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isLow = item.currentStock <= item.minThreshold;
          const percentage = Math.min(100, Math.round((item.currentStock / (item.minThreshold * 3)) * 100));

          return (
            <div
              key={item.id}
              className={`bg-[#11111a] border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all ${
                isLow ? 'border-amber-500/40 bg-amber-950/10' : 'border-[#222232] hover:border-[#7b2cbf]/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-[#181828] text-slate-400 px-2 py-0.5 rounded border border-[#2e2e42] mb-1 inline-block">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-white text-base leading-snug">{item.name}</h3>
                  </div>

                  {item.isPctProduct && (
                    <span className="bg-[#7b2cbf]/30 text-[#c77dff] border border-[#7b2cbf]/40 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0">
                      PCT Official
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-white font-mono">
                    {item.currentStock} <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Min: {item.minThreshold} {item.unit}
                  </div>
                </div>

                {/* Stock Gauge */}
                <div className="h-2 w-full bg-[#181828] rounded-full overflow-hidden border border-[#26263a]">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full transition-all duration-500 ${
                      isLow ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Location: {item.location}</span>
                  <span>Restocked: {item.lastRestocked}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#222232] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuickRestock(item.id, 10)}
                    className="text-[11px] bg-[#181826] hover:bg-[#222238] border border-[#2e2e42] text-slate-200 px-2 py-1 rounded-lg font-mono font-medium"
                  >
                    +10 {item.unit}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => recordPctAffiliateClick(item.name, item.pctBuyUrl)}
                  className="bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 shadow-md shadow-[#7b2cbf]/20"
                >
                  <span>Order from PCT</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW ITEM MODAL */}
      {newItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12121c] border border-[#2e2e48] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#9d4edd]" />
              Add Custom Reagent / Supply
            </h3>

            <form onSubmit={handleCreateItem} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-2.5 py-2 text-xs text-white"
                  >
                    <option value="PPM">PPM Biocide</option>
                    <option value="Media Salt">Media Salt</option>
                    <option value="PGR">PGR</option>
                    <option value="Gelling Agent">Gelling Agent</option>
                    <option value="Vessel">Vessel</option>
                    <option value="Sugar & Carbon">Sugar & Carbon</option>
                    <option value="Supplement & Vitamin">Supplement & Vitamin</option>
                    <option value="Tool & Equipment">Tool & Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Unit</label>
                  <select
                    value={unit}
                    onChange={(e: any) => setUnit(e.target.value)}
                    className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-2.5 py-2 text-xs text-white font-mono"
                  >
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="units">units</option>
                    <option value="packs">packs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Current Stock</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Min Alert Threshold</label>
                  <input
                    type="number"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Storage Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#181826] border border-[#2e2e42] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewItemModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:bg-[#1a1a28] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#7b2cbf] hover:bg-[#9d4edd] text-white rounded-xl shadow-lg shadow-[#7b2cbf]/30"
                >
                  Save Reagent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
