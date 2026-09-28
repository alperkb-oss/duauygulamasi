import { useState } from 'react';
import { BottomNav, type TabKey } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { Plans } from '@/components/Plans';
import { Library } from '@/components/Library';
import { Settings } from '@/components/Settings';
import { PrayerTimes } from '@/components/PrayerTimes';
import { Tasbih } from '@/components/Tasbih';
import { I18nProvider } from '@/lib/i18n';

type Page = 'dashboard' | 'plans' | 'library' | 'settings' | 'prayer-times' | 'tasbih';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [page, setPage] = useState<Page>('dashboard');

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(tab);
  };

  const navigateTo = (p: Page) => {
    setPage(p);
    if (p === 'dashboard' || p === 'plans' || p === 'library') {
      setActiveTab(p as TabKey);
    }
  };

  const goBack = () => {
    setPage(activeTab);
  };

  const showBottomNav = page === 'dashboard' || page === 'plans' || page === 'library';

  return (
    <div className="min-h-screen text-midnight-100 max-w-md mx-auto relative">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {page === 'dashboard' && (
          <Dashboard onNavigate={navigateTo} />
        )}
        {page === 'plans' && <Plans />}
        {page === 'library' && <Library />}
        {page === 'settings' && <Settings onBack={goBack} />}
        {page === 'prayer-times' && <PrayerTimes onBack={goBack} />}
        {page === 'tasbih' && <Tasbih onBack={goBack} />}
      </div>

      {showBottomNav && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
