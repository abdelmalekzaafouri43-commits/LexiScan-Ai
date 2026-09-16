import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { LayoutScanner } from './components/LayoutScanner';
import { Settings as SettingsView } from './components/Settings';
import { GetStartedTour } from './components/GetStartedTour';
import { Tab } from './types';
import { Bookmark, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [scannedPromptData, setScannedPromptData] = useState<{
    prompt: string;
    sampleWorksheet: string;
    metadata: { topic: string; gradeLevel: string; layoutTitle: string };
  } | null>(null);

  // Auto-launch tour for first-time visitors
  useEffect(() => {
    try {
      const completed = localStorage.getItem('lexiscan_onboarding_completed');
      if (!completed) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Could not read onboarding state:', e);
    }
  }, []);

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handleApplyScannedLayout = (
    prompt: string, 
    sampleWorksheet: string, 
    metadata: { topic: string; gradeLevel: string; layoutTitle: string }
  ) => {
    setScannedPromptData({ prompt, sampleWorksheet, metadata });
    setCurrentTab('generator');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleTabChange} onOpenTour={() => setIsTourOpen(true)} />;
      case 'generator':
        return (
          <WorksheetGenerator 
            scannedLayoutData={scannedPromptData}
            onClearScannedLayout={() => setScannedPromptData(null)}
            onNavigateToScanner={() => handleTabChange('scanner')}
          />
        );
      case 'scanner':
        return (
          <LayoutScanner 
            onApplyToGenerator={handleApplyScannedLayout}
          />
        );
      case 'saved':
        return <PlaceholderTab icon={<Bookmark className="w-12 h-12" />} title="Saved Sheets" description="Access and manage your previously generated worksheets." />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'generator': return 'Worksheet Generator';
      case 'scanner': return 'External Layout Scanner';
      case 'dashboard': return 'Dashboard';
      case 'saved': return 'Saved Sheets';
      case 'settings': return 'Settings';
      default: return 'LexiScan AI';
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-white dark:bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - responsive positioning */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={handleTabChange} 
          onOpenTour={() => setIsTourOpen(true)}
        />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 blur-[120px]" />
          <div className="absolute top-[40%] -left-[10%] w-[30%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        </div>

        <Header 
          title={getHeaderTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onOpenTour={() => setIsTourOpen(true)}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Get Started Tour Overlay */}
      <GetStartedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={handleTabChange}
        currentTab={currentTab}
      />
    </div>
  );
}

function PlaceholderTab({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="h-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-primary-400 mb-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">{title}</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md">{description}</p>
    </div>
  );
}
