import React from 'react';
import { Compass, Database, Terminal, Bookmark, Sparkles, Sprout } from 'lucide-react';

interface NavbarProps {
  activeTab: 'almanac' | 'directory' | 'playground' | 'saved';
  setActiveTab: (tab: 'almanac' | 'directory' | 'playground' | 'saved') => void;
  savedCount: number;
  totalApisCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  totalApisCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-950/40">
              <Sprout className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Cultivation Culture
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Tazewell, VA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Appalachian Smart Almanac & Public APIs
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('almanac')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'almanac'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Smart Almanac</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'directory'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-sky-400" />
              <span>APIs Directory</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[11px] rounded-full bg-slate-800 text-slate-300 font-mono">
                {totalApisCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'playground'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>API Tester</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'saved'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500/30 text-amber-300 font-mono font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
