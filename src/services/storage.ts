import { 
  Culture, 
  MediaRecipe, 
  InventoryItem, 
  ContaminationEvent, 
  Lab 
} from '../types';
import { 
  INITIAL_CULTURES, 
  INITIAL_RECIPES, 
  INITIAL_INVENTORY, 
  INITIAL_CONTAMINATION_LOGS, 
  INITIAL_LABS 
} from '../data/mockData';

const STORAGE_KEYS = {
  LABS: 'tf_labs_v1',
  ACTIVE_LAB_ID: 'tf_active_lab_id_v1',
  CULTURES: 'tf_cultures_v1',
  RECIPES: 'tf_recipes_v1',
  INVENTORY: 'tf_inventory_v1',
  CONTAMINATION: 'tf_contamination_v1',
  AFFILIATE_STATS: 'tf_affiliate_stats_v1',
  THEME: 'tf_theme_v1'
};

export interface AffiliateStats {
  clicksCount: number;
  ordersCount: number;
  referredRevenueUSD: number;
  commissionEarnedUSD: number;
}

// Helper to safely load JSON from localStorage
function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error reading key ${key} from localStorage`, e);
    return fallback;
  }
}

// Helper to safely save JSON to localStorage
function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('storage_updated'));
  } catch (e) {
    console.error(`Error writing key ${key} to localStorage`, e);
  }
}

// Initialize default seed data if not present
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.LABS)) {
    setItem(STORAGE_KEYS.LABS, INITIAL_LABS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_LAB_ID)) {
    setItem(STORAGE_KEYS.ACTIVE_LAB_ID, INITIAL_LABS[0].id);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CULTURES)) {
    setItem(STORAGE_KEYS.CULTURES, INITIAL_CULTURES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
    setItem(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    setItem(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTAMINATION)) {
    setItem(STORAGE_KEYS.CONTAMINATION, INITIAL_CONTAMINATION_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AFFILIATE_STATS)) {
    setItem(STORAGE_KEYS.AFFILIATE_STATS, {
      clicksCount: 42,
      ordersCount: 8,
      referredRevenueUSD: 840.00,
      commissionEarnedUSD: 126.00 // 15% commission
    });
  }
}

// Reset data to initial demo state
export function resetStorageToDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(INITIAL_LABS));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_LAB_ID, JSON.stringify(INITIAL_LABS[0].id));
  localStorage.setItem(STORAGE_KEYS.CULTURES, JSON.stringify(INITIAL_CULTURES));
  localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(INITIAL_RECIPES));
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
  localStorage.setItem(STORAGE_KEYS.CONTAMINATION, JSON.stringify(INITIAL_CONTAMINATION_LOGS));
  localStorage.setItem(STORAGE_KEYS.AFFILIATE_STATS, JSON.stringify({
    clicksCount: 42,
    ordersCount: 8,
    referredRevenueUSD: 840.00,
    commissionEarnedUSD: 126.00
  }));
  window.dispatchEvent(new Event('storage_updated'));
}

// Clear all data
export function clearAllStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.LABS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_LAB_ID);
  localStorage.removeItem(STORAGE_KEYS.CULTURES);
  localStorage.removeItem(STORAGE_KEYS.RECIPES);
  localStorage.removeItem(STORAGE_KEYS.INVENTORY);
  localStorage.removeItem(STORAGE_KEYS.CONTAMINATION);
  localStorage.removeItem(STORAGE_KEYS.AFFILIATE_STATS);
  window.dispatchEvent(new Event('storage_updated'));
}

// --- LABS ---
export function getLabs(): Lab[] {
  return getItem<Lab[]>(STORAGE_KEYS.LABS, INITIAL_LABS);
}

export function saveLab(lab: Lab): void {
  const labs = getLabs();
  const index = labs.findIndex(l => l.id === lab.id);
  if (index >= 0) {
    labs[index] = lab;
  } else {
    labs.push(lab);
  }
  setItem(STORAGE_KEYS.LABS, labs);
}

export function getActiveLabId(): string {
  return getItem<string>(STORAGE_KEYS.ACTIVE_LAB_ID, INITIAL_LABS[0].id);
}

export function setActiveLabId(id: string): void {
  setItem(STORAGE_KEYS.ACTIVE_LAB_ID, id);
}

// --- CULTURES ---
export function getCultures(labId?: string): Culture[] {
  const cultures = getItem<Culture[]>(STORAGE_KEYS.CULTURES, INITIAL_CULTURES);
  if (labId && labId !== 'all') {
    return cultures.filter(c => c.labId === labId);
  }
  return cultures;
}

export function saveCulture(culture: Culture): void {
  const cultures = getItem<Culture[]>(STORAGE_KEYS.CULTURES, INITIAL_CULTURES);
  const index = cultures.findIndex(c => c.id === culture.id);
  if (index >= 0) {
    cultures[index] = culture;
  } else {
    cultures.unshift(culture);
  }
  setItem(STORAGE_KEYS.CULTURES, cultures);
}

export function deleteCulture(id: string): void {
  const cultures = getItem<Culture[]>(STORAGE_KEYS.CULTURES, INITIAL_CULTURES);
  const updated = cultures.filter(c => c.id !== id);
  setItem(STORAGE_KEYS.CULTURES, updated);
}

// Perform subculture action (updates last/next dates & increments generation count)
export function performSubcultureAction(cultureId: string, options?: {
  vesselCount?: number;
  plantletsCount?: number;
  nextIntervalDays?: number;
  newRecipeId?: string;
  newRecipeName?: string;
}): Culture | null {
  const cultures = getItem<Culture[]>(STORAGE_KEYS.CULTURES, INITIAL_CULTURES);
  const index = cultures.findIndex(c => c.id === cultureId);
  if (index === -1) return null;

  const cult = cultures[index];
  const today = new Date().toISOString().split('T')[0];
  const interval = options?.nextIntervalDays || cult.subcultureIntervalDays;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  const nextDateStr = nextDate.toISOString().split('T')[0];

  const updated: Culture = {
    ...cult,
    lastSubcultureDate: today,
    nextSubcultureDate: nextDateStr,
    subcultureIntervalDays: interval,
    generationCount: cult.generationCount + 1,
    vesselCount: options?.vesselCount ?? cult.vesselCount,
    plantletsCount: options?.plantletsCount ?? cult.plantletsCount,
    mediaRecipeId: options?.newRecipeId || cult.mediaRecipeId,
    mediaRecipeName: options?.newRecipeName || cult.mediaRecipeName
  };

  cultures[index] = updated;
  setItem(STORAGE_KEYS.CULTURES, cultures);
  return updated;
}

// --- RECIPES ---
export function getRecipes(labId?: string): MediaRecipe[] {
  const recipes = getItem<MediaRecipe[]>(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
  if (labId && labId !== 'all') {
    return recipes.filter(r => r.labId === labId || r.pctRecommended);
  }
  return recipes;
}

export function saveRecipe(recipe: MediaRecipe): void {
  const recipes = getItem<MediaRecipe[]>(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
  const index = recipes.findIndex(r => r.id === recipe.id);
  if (index >= 0) {
    recipes[index] = recipe;
  } else {
    recipes.unshift(recipe);
  }
  setItem(STORAGE_KEYS.RECIPES, recipes);
}

export function deleteRecipe(id: string): void {
  const recipes = getItem<MediaRecipe[]>(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
  const updated = recipes.filter(r => r.id !== id);
  setItem(STORAGE_KEYS.RECIPES, updated);
}

// --- INVENTORY ---
export function getInventory(labId?: string): InventoryItem[] {
  const items = getItem<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  if (labId && labId !== 'all') {
    return items.filter(i => i.labId === labId);
  }
  return items;
}

export function saveInventoryItem(item: InventoryItem): void {
  const items = getItem<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  const index = items.findIndex(i => i.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
  setItem(STORAGE_KEYS.INVENTORY, items);
}

export function deleteInventoryItem(id: string): void {
  const items = getItem<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  const updated = items.filter(i => i.id !== id);
  setItem(STORAGE_KEYS.INVENTORY, updated);
}

// Restock inventory item
export function restockInventoryItem(id: string, amount: number): void {
  const items = getItem<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  const index = items.findIndex(i => i.id === id);
  if (index >= 0) {
    items[index].currentStock += amount;
    items[index].lastRestocked = new Date().toISOString().split('T')[0];
    setItem(STORAGE_KEYS.INVENTORY, items);
  }
}

// --- CONTAMINATION ---
export function getContaminationLogs(labId?: string): ContaminationEvent[] {
  const logs = getItem<ContaminationEvent[]>(STORAGE_KEYS.CONTAMINATION, INITIAL_CONTAMINATION_LOGS);
  if (labId && labId !== 'all') {
    return logs.filter(l => l.labId === labId);
  }
  return logs;
}

export function saveContaminationLog(event: ContaminationEvent): void {
  const logs = getItem<ContaminationEvent[]>(STORAGE_KEYS.CONTAMINATION, INITIAL_CONTAMINATION_LOGS);
  const index = logs.findIndex(l => l.id === event.id);
  if (index >= 0) {
    logs[index] = event;
  } else {
    logs.unshift(event);
  }
  setItem(STORAGE_KEYS.CONTAMINATION, logs);

  // Update culture status if matched
  if (event.cultureId) {
    const cultures = getCultures();
    const cIndex = cultures.findIndex(c => c.id === event.cultureId);
    if (cIndex >= 0) {
      cultures[cIndex].contaminationStatus = event.actionTaken === 'Discarded' ? 'Discarded' : 'Contaminated';
      setItem(STORAGE_KEYS.CULTURES, cultures);
    }
  }
}

// --- AFFILIATE TRACKER ---
export function getAffiliateStats(): AffiliateStats {
  return getItem<AffiliateStats>(STORAGE_KEYS.AFFILIATE_STATS, {
    clicksCount: 42,
    ordersCount: 8,
    referredRevenueUSD: 840.00,
    commissionEarnedUSD: 126.00
  });
}

export function recordPctAffiliateClick(productName?: string, buyUrl?: string): void {
  const stats = getAffiliateStats();
  stats.clicksCount += 1;
  setItem(STORAGE_KEYS.AFFILIATE_STATS, stats);
  
  // Open PCT affiliate link in new tab or track
  const finalUrl = buyUrl || 'https://plantcelltechnology.com/?utm_source=tissue.farmr&utm_medium=affiliate';
  window.open(finalUrl, '_blank', 'noopener,noreferrer');
}

// --- CSV / JSON EXPORT & IMPORT ---
export function exportAllDataJSON(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    appName: 'tissue.farmr',
    version: '1.0',
    labs: getLabs(),
    cultures: getCultures(),
    recipes: getRecipes(),
    inventory: getInventory(),
    contaminationLogs: getContaminationLogs()
  };
  return JSON.stringify(data, null, 2);
}

export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportCulturesCSV(): string {
  const cultures = getCultures();
  const headers = ['Code', 'Species Name', 'Cultivar', 'Stage', 'Generation', 'Explant Type', 'Status', 'Vessels', 'Plantlets', 'Initiated Date', 'Next Subculture Date', 'Recipe Name', 'Notes'];
  const rows = cultures.map(c => [
    `"${c.code}"`,
    `"${c.speciesName}"`,
    `"${c.cultivar || ''}"`,
    `"${c.stage}"`,
    c.generationCount,
    `"${c.explantType}"`,
    `"${c.contaminationStatus}"`,
    c.vesselCount,
    c.plantletsCount,
    `"${c.initiatedDate}"`,
    `"${c.nextSubcultureDate}"`,
    `"${c.mediaRecipeName}"`,
    `"${(c.notes || '').replace(/"/g, '""')}"`
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function importDataJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.labs && Array.isArray(data.labs)) setItem(STORAGE_KEYS.LABS, data.labs);
    if (data.cultures && Array.isArray(data.cultures)) setItem(STORAGE_KEYS.CULTURES, data.cultures);
    if (data.recipes && Array.isArray(data.recipes)) setItem(STORAGE_KEYS.RECIPES, data.recipes);
    if (data.inventory && Array.isArray(data.inventory)) setItem(STORAGE_KEYS.INVENTORY, data.inventory);
    if (data.contaminationLogs && Array.isArray(data.contaminationLogs)) setItem(STORAGE_KEYS.CONTAMINATION, data.contaminationLogs);
    return true;
  } catch (e) {
    console.error('Failed to import JSON data', e);
    return false;
  }
}
