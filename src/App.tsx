import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CultureTrackerView } from './components/CultureTrackerView';
import { MediaRecipeBuilderView } from './components/MediaRecipeBuilderView';
import { RecipeLibraryView } from './components/RecipeLibraryView';
import { SubcultureScheduleView } from './components/SubcultureScheduleView';
import { InventoryManagerView } from './components/InventoryManagerView';
import { ContaminationLogView } from './components/ContaminationLogView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { MultiLabView } from './components/MultiLabView';
import { SettingsDataView } from './components/SettingsDataView';
import { NewCultureModal } from './components/NewCultureModal';

import { 
  initializeStorage, 
  getLabs, 
  getActiveLabId, 
  setActiveLabId, 
  getCultures, 
  getRecipes, 
  getInventory, 
  getContaminationLogs 
} from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Storage states
  const [labs, setLabs] = useState(getLabs());
  const [activeLabIdState, setActiveLabIdState] = useState(getActiveLabId());
  const [cultures, setCultures] = useState(getCultures(activeLabIdState));
  const [recipes, setRecipes] = useState(getRecipes(activeLabIdState));
  const [inventory, setInventory] = useState(getInventory(activeLabIdState));
  const [contaminationLogs, setContaminationLogs] = useState(getContaminationLogs(activeLabIdState));

  // Modal & Mobile Menu triggers
  const [showNewCultureModal, setShowNewCultureModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Initialize storage on first load & handle scanned QR link
  useEffect(() => {
    initializeStorage();
    refreshAllData();

    // Check if opened via scanned QR code (e.g. ?culture=TC-MON-001)
    const urlParams = new URLSearchParams(window.location.search);
    const scannedCode = urlParams.get('culture') || urlParams.get('code') || urlParams.get('scan');
    if (scannedCode) {
      setCurrentTab('cultures');
      setSearchTerm(scannedCode);
    }

    const handleStorageUpdate = () => {
      refreshAllData();
    };

    window.addEventListener('storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('storage_updated', handleStorageUpdate);
  }, []);

  const refreshAllData = () => {
    const activeId = getActiveLabId();
    setLabs(getLabs());
    setActiveLabIdState(activeId);
    setCultures(getCultures(activeId));
    setRecipes(getRecipes(activeId));
    setInventory(getInventory(activeId));
    setContaminationLogs(getContaminationLogs(activeId));
  };

  const handleSwitchLab = (newId: string) => {
    setActiveLabId(newId);
    setActiveLabIdState(newId);
    setCultures(getCultures(newId));
    setRecipes(getRecipes(newId));
    setInventory(getInventory(newId));
    setContaminationLogs(getContaminationLogs(newId));
  };

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const activeLab = labs.find(l => l.id === activeLabIdState) || labs[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCultures = cultures.filter(c => c.contaminationStatus !== 'Discarded' && c.nextSubcultureDate < todayStr);
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minThreshold);

  const tabTitles: Record<string, string> = {
    dashboard: 'Lab Dashboard Overview',
    cultures: 'Culture Tracker',
    schedule: 'Subculture Schedule',
    builder: 'Media Recipe Builder',
    library: 'Recipe & Protocol Library',
    inventory: 'Inventory Manager',
    contamination: 'Contamination Log',
    knowledge: 'Knowledge Base & Guides',
    multilab: 'Multi-Lab Workspaces',
    settings: 'Settings & Data Backup'
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-[#0a0a0f] text-slate-200' : 'bg-slate-50 text-slate-900'} flex transition-colors duration-200`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        labs={labs}
        activeLabId={activeLabIdState}
        setActiveLabId={handleSwitchLab}
        overdueCount={overdueCultures.length}
        lowStockCount={lowStockItems.length}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenQuickCulture={() => setShowNewCultureModal(true)}
        onOpenQuickRecipe={() => setCurrentTab('builder')}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentTabLabel={tabTitles[currentTab] || 'Dashboard'}
          activeLab={activeLab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          overdueCultures={overdueCultures}
          lowStockItems={lowStockItems}
          isDarkMode={isDarkMode}
          onOpenQuickCulture={() => setShowNewCultureModal(true)}
          onNavigateToTab={(tab) => setCurrentTab(tab)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-3 sm:p-6 max-w-7xl w-full mx-auto flex-1">
          {currentTab === 'dashboard' && (
            <DashboardView
              cultures={cultures}
              inventory={inventory}
              contaminationLogs={contaminationLogs}
              recipes={recipes}
              isDarkMode={isDarkMode}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenCultureModal={() => setShowNewCultureModal(true)}
              onOpenRecipeModal={() => setCurrentTab('builder')}
              onOpenContaminationModal={() => setCurrentTab('contamination')}
            />
          )}

          {currentTab === 'cultures' && (
            <CultureTrackerView
              cultures={cultures}
              recipes={recipes}
              activeLabId={activeLabIdState}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDarkMode={isDarkMode}
              onRefreshData={refreshAllData}
              onOpenNewCultureModal={() => setShowNewCultureModal(true)}
            />
          )}

          {currentTab === 'builder' && (
            <MediaRecipeBuilderView
              activeLabId={activeLabIdState}
              isDarkMode={isDarkMode}
              onRecipeSaved={refreshAllData}
            />
          )}

          {currentTab === 'library' && (
            <RecipeLibraryView
              recipes={recipes}
              activeLabId={activeLabIdState}
              isDarkMode={isDarkMode}
              onRecipeSaved={refreshAllData}
              onNavigateToBuilder={() => setCurrentTab('builder')}
            />
          )}

          {currentTab === 'schedule' && (
            <SubcultureScheduleView
              cultures={cultures}
              recipes={recipes}
              isDarkMode={isDarkMode}
              onRefreshData={refreshAllData}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryManagerView
              inventory={inventory}
              activeLabId={activeLabIdState}
              isDarkMode={isDarkMode}
              onRefreshData={refreshAllData}
            />
          )}

          {currentTab === 'contamination' && (
            <ContaminationLogView
              contaminationLogs={contaminationLogs}
              cultures={cultures}
              activeLabId={activeLabIdState}
              isDarkMode={isDarkMode}
              onRefreshData={refreshAllData}
            />
          )}

          {currentTab === 'knowledge' && (
            <KnowledgeBaseView isDarkMode={isDarkMode} />
          )}

          {currentTab === 'multilab' && (
            <MultiLabView
              labs={labs}
              activeLabId={activeLabIdState}
              isDarkMode={isDarkMode}
              onRefreshData={refreshAllData}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsDataView
              isDarkMode={isDarkMode}
              onRefreshData={refreshAllData}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewCultureModal
        isOpen={showNewCultureModal}
        onClose={() => setShowNewCultureModal(false)}
        recipes={recipes}
        activeLabId={activeLabIdState}
        isDarkMode={isDarkMode}
        onCultureCreated={refreshAllData}
      />
    </div>
  );
}
