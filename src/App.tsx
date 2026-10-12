import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AlmanacDashboard } from './components/AlmanacDashboard';
import { PublicApisExplorer } from './components/PublicApisExplorer';
import { ApiPlayground } from './components/ApiPlayground';
import { PUBLIC_APIS } from './data/apis';
import { Sprout } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'almanac' | 'directory' | 'playground' | 'saved'>('almanac');
  const [testUrl, setTestUrl] = useState<string>('https://api.open-meteo.com/v1/forecast?latitude=37.1276&longitude=-81.5187&current_weather=true');

  // Bookmarked / Saved APIs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cc_saved_apis');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cc_saved_apis', JSON.stringify(savedIds));
    } catch {
      // localStorage error fallback
    }
  }, [savedIds]);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTestApi = (url: string) => {
    setTestUrl(url);
    setActiveTab('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedIds.length}
        totalApisCount={PUBLIC_APIS.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'almanac' && <AlmanacDashboard />}

        {activeTab === 'directory' && (
          <PublicApisExplorer
            onTestApi={handleTestApi}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            savedOnly={false}
          />
        )}

        {activeTab === 'saved' && (
          <PublicApisExplorer
            onTestApi={handleTestApi}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            savedOnly={true}
          />
        )}

        {activeTab === 'playground' && (
          <ApiPlayground initialUrl={testUrl} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">🌿 Cultivation Culture LLC</span>
            <span>•</span>
            <span>Tazewell County, VA (Zone 7a/7b)</span>
            <span>•</span>
            <span>1,425+ Curated Public APIs</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('almanac')}
              className="hover:text-emerald-400 transition"
            >
              Smart Almanac
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className="hover:text-sky-400 transition"
            >
              APIs Directory
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className="hover:text-indigo-400 transition"
            >
              Tester
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
