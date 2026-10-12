import React, { useState, useMemo } from 'react';
import { PUBLIC_APIS, PublicApiItem } from '../data/apis';
import {
  Search,
  Filter,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Sparkles,
  Shuffle,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Database,
  ArrowRight,
  Terminal,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
  X
} from 'lucide-react';

interface PublicApisExplorerProps {
  onTestApi: (url: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  savedOnly?: boolean;
}

const APILAYER_FEATURED = [
  {
    name: 'IPstack',
    url: 'https://ipstack.com/?utm_source=Github&utm_medium=Referral&utm_campaign=Public-apis-repo-Best-sellers',
    desc: 'Locate and Identify Website Visitors by IP Address with precision geolocation data.',
    badge: 'Best Seller • Geolocation'
  },
  {
    name: 'Marketstack',
    url: 'https://marketstack.com/?utm_source=Github&utm_medium=Referral&utm_campaign=Public-apis-repo-Best-sellers',
    desc: 'REST API interface delivering worldwide stock market data and tickers in JSON format.',
    badge: 'Finance • Stocks'
  },
  {
    name: 'Weatherstack',
    url: 'https://weatherstack.com/?utm_source=Github&utm_medium=Referral&utm_campaign=Public-apis-repo-Best-sellers',
    desc: 'Retrieve instant, accurate weather conditions and forecasts for any location worldwide.',
    badge: 'Weather • Forecast'
  },
  {
    name: 'Numverify',
    url: 'https://numverify.com/?utm_source=Github&utm_medium=Referral&utm_campaign=Public-apis-repo-Best-sellers',
    desc: 'Global phone number validation, international format standardization & lookup JSON API.',
    badge: 'Validation • Telecom'
  },
  {
    name: 'Fixer',
    url: 'https://fixer.io/?utm_source=Github&utm_medium=Referral&utm_campaign=Public-apis-repo-Best-sellers',
    desc: 'Lightweight API for current and historical foreign exchange (forex) rates and currency conversion.',
    badge: 'Currencies • Forex'
  },
  {
    name: 'Aviationstack',
    url: 'https://aviationstack.com/?utm_source=Github&utm_medium=Referral&utm_campaign=Public-apis-repo-Best-sellers',
    desc: 'Real-time flight status, airline timetables, airports, and historical aviation data API.',
    badge: 'Aviation • Flights'
  }
];

export const PublicApisExplorer: React.FC<PublicApisExplorerProps> = ({
  onTestApi,
  savedIds,
  onToggleSave,
  savedOnly = false
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAuth, setSelectedAuth] = useState<string>('all');
  const [selectedHttps, setSelectedHttps] = useState<string>('all');
  const [selectedCors, setSelectedCors] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [randomApiModal, setRandomApiModal] = useState<PublicApiItem | null>(null);

  const ITEMS_PER_PAGE = 24;

  // Extract all categories & counts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of PUBLIC_APIS) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
    return sorted;
  }, []);

  // Filtered APIs
  const filteredApis = useMemo(() => {
    return PUBLIC_APIS.filter((api) => {
      if (savedOnly && !savedIds.includes(api.id)) {
        return false;
      }

      if (selectedCategory !== 'all' && api.category !== selectedCategory) {
        return false;
      }

      if (selectedAuth !== 'all') {
        if (selectedAuth === 'No Auth' && api.auth.toLowerCase() !== 'no auth') {
          return false;
        }
        if (selectedAuth === 'apiKey' && !api.auth.toLowerCase().includes('apikey')) {
          return false;
        }
        if (selectedAuth === 'OAuth' && !api.auth.toLowerCase().includes('oauth')) {
          return false;
        }
      }

      if (selectedHttps !== 'all') {
        const isHttps = selectedHttps === 'yes';
        if (api.https !== isHttps) return false;
      }

      if (selectedCors !== 'all') {
        if (api.cors.toLowerCase() !== selectedCors.toLowerCase()) return false;
      }

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = api.name.toLowerCase().includes(query);
        const matchesDesc = api.description.toLowerCase().includes(query);
        const matchesCat = api.category.toLowerCase().includes(query);
        const matchesAuth = api.auth.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCat || matchesAuth;
      }

      return true;
    });
  }, [search, selectedCategory, selectedAuth, selectedHttps, selectedCors, savedOnly, savedIds]);

  // Total pages & sliced items
  const totalPages = Math.ceil(filteredApis.length / ITEMS_PER_PAGE) || 1;
  const paginatedApis = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApis.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredApis, currentPage]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSurpriseMe = () => {
    if (PUBLIC_APIS.length === 0) return;
    const randomIndex = Math.floor(Math.random() * PUBLIC_APIS.length);
    setRandomApiModal(PUBLIC_APIS[randomIndex]);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredApis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `public-apis-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getAuthBadgeColor = (auth: string) => {
    const lower = auth.toLowerCase();
    if (lower === 'no auth') {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
    if (lower.includes('apikey')) {
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
    if (lower.includes('oauth')) {
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Community Curated Collective • 1,425+ Free & Public Endpoints</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              {savedOnly ? 'Your Saved Public APIs' : 'Public APIs Directory'}
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Explore the web's largest curated library of free developer APIs. Filter by authentication method, CORS headers, SSL security, and industry category.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSurpriseMe}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-sky-950/40 transition"
            >
              <Shuffle className="w-4 h-4" />
              <span>Surprise Me (Random API)</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
              title="Export filtered list to JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>

        {/* Featured APILayer Best Sellers Strip */}
        {!savedOnly && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Featured APILayer Ecosystem
              </span>
              <span className="text-[11px] text-slate-400">High-Availability Production APIs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {APILAYER_FEATURED.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/50 transition flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs group-hover:text-sky-300 transition">
                        {item.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-sky-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-[9px] font-semibold text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40 w-fit">
                    {item.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by API name, keyword, description..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Categories ({PUBLIC_APIS.length})</option>
              {categoryStats.map(([cat, count]) => (
                <option key={cat} value={cat}>
                  {cat} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* Auth Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedAuth}
              onChange={(e) => {
                setSelectedAuth(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">Auth: Any</option>
              <option value="No Auth">No Auth (Open)</option>
              <option value="apiKey">apiKey</option>
              <option value="OAuth">OAuth</option>
            </select>
          </div>

          {/* CORS Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCors}
              onChange={(e) => {
                setSelectedCors(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">CORS: Any</option>
              <option value="Yes">CORS: Yes</option>
              <option value="No">CORS: No</option>
              <option value="Unknown">CORS: Unknown</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <strong className="text-white font-mono">{filteredApis.length}</strong>
            <span>of</span>
            <span className="font-mono">{PUBLIC_APIS.length}</span>
            <span>APIs</span>
            {(selectedCategory !== 'all' || selectedAuth !== 'all' || selectedCors !== 'all' || search) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedAuth('all');
                  setSelectedCors('all');
                  setSelectedHttps('all');
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="ml-2 text-sky-400 hover:underline text-[11px]"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Page</span>
            <span className="font-mono text-white">{currentPage}</span>
            <span>of</span>
            <span className="font-mono text-white">{totalPages}</span>
          </div>
        </div>
      </div>

      {/* APIs Cards Grid */}
      {paginatedApis.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Database className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Public APIs Match Your Criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search terms, changing the category, or resetting auth/CORS filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedAuth('all');
              setSelectedCors('all');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-medium transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedApis.map((api) => {
            const isSaved = savedIds.includes(api.id);
            const isCopied = copiedId === api.id;

            return (
              <div
                key={api.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition shadow-sm hover:shadow-md"
              >
                <div className="space-y-2.5">
                  {/* Top Bar: Category & Save Bookmark */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {api.category}
                    </span>
                    <button
                      onClick={() => onToggleSave(api.id)}
                      className={`p-1.5 rounded-lg transition ${
                        isSaved
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save API'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title and Direct Link */}
                  <div>
                    <a
                      href={api.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-bold text-white hover:text-sky-300 transition flex items-center gap-1.5 group"
                    >
                      <span>{api.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {api.description}
                  </p>
                </div>

                {/* Bottom Badges & Actions */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    {/* Auth */}
                    <span className={`px-2 py-0.5 rounded border font-semibold ${getAuthBadgeColor(api.auth)}`}>
                      {api.auth}
                    </span>

                    {/* HTTPS */}
                    <span
                      className={`px-1.5 py-0.5 rounded border ${
                        api.https
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {api.https ? 'HTTPS' : 'HTTP'}
                    </span>

                    {/* CORS */}
                    <span
                      className={`px-1.5 py-0.5 rounded border ${
                        api.cors.toLowerCase() === 'yes'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                          : api.cors.toLowerCase() === 'no'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      CORS: {api.cors}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopyUrl(api.url, api.id)}
                      className="flex-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 flex items-center justify-center gap-1 transition"
                      title="Copy URL"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onTestApi(api.url)}
                      className="flex-1 py-1.5 px-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-500/30 flex items-center justify-center gap-1 transition"
                      title="Test in HTTP Playground"
                    >
                      <Terminal className="w-3 h-3 text-indigo-400" />
                      <span>Test API</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{' '}
            <strong className="text-white">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredApis.length)}
            </strong>{' '}
            of <strong className="text-white">{filteredApis.length}</strong> items
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition disabled:opacity-40"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono px-3 text-slate-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition disabled:opacity-40"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Surprise Me / Random API Modal */}
      {randomApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sky-400">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-sm">Discovered Random API!</span>
              </div>
              <button
                onClick={() => setRandomApiModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {randomApiModal.category}
                </span>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                  {randomApiModal.auth}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{randomApiModal.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {randomApiModal.description}
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-sky-300 truncate">
              {randomApiModal.url}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={randomApiModal.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition"
              >
                <span>Visit Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  onTestApi(randomApiModal.url);
                  setRandomApiModal(null);
                }}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Test in Playground</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
