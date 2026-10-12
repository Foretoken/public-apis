import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Code2,
  Send
} from 'lucide-react';

interface ApiPlaygroundProps {
  initialUrl?: string;
  initialMethod?: string;
}

const PRESET_APIS = [
  {
    name: 'Tazewell, VA Weather (Open-Meteo)',
    category: 'Weather',
    method: 'GET',
    url: 'https://api.open-meteo.com/v1/forecast?latitude=37.1276&longitude=-81.5187&current_weather=true',
    notes: 'Free, no API key required, CORS supported'
  },
  {
    name: 'Cat Facts',
    category: 'Animals',
    method: 'GET',
    url: 'https://catfact.ninja/fact',
    notes: 'No auth, CORS enabled JSON API'
  },
  {
    name: 'Dog CEO Random Breed Image',
    category: 'Animals',
    method: 'GET',
    url: 'https://dog.ceo/api/breeds/image/random',
    notes: 'Stanford dogs dataset image API'
  },
  {
    name: 'IPify Public IP',
    category: 'Development',
    method: 'GET',
    url: 'https://api.ipify.org?format=json',
    notes: 'Simple public IPv4 address responder'
  },
  {
    name: 'Public Holidays 2026 (US)',
    category: 'Calendar',
    method: 'GET',
    url: 'https://date.nager.at/api/v3/PublicHolidays/2026/US',
    notes: 'Worldwide public holidays JSON feed'
  },
  {
    name: 'Bitcoin Price Index',
    category: 'Cryptocurrency',
    method: 'GET',
    url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
    notes: 'Real-time cryptocurrency ticker'
  }
];

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  initialUrl = 'https://api.open-meteo.com/v1/forecast?latitude=37.1276&longitude=-81.5187&current_weather=true',
  initialMethod = 'GET'
}) => {
  const [method, setMethod] = useState<string>(initialMethod);
  const [url, setUrl] = useState<string>(initialUrl);
  const [headers, setHeaders] = useState<string>('{\n  "Accept": "application/json"\n}');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  const generateCurl = () => {
    let headerArgs = '';
    try {
      const parsed = JSON.parse(headers);
      for (const [k, v] of Object.entries(parsed)) {
        headerArgs += ` -H "${k}: ${v}"`;
      }
    } catch {
      // ignore
    }
    return `curl -X ${method} "${url}"${headerArgs}`;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(generateCurl());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyResponse = () => {
    if (responseData) {
      navigator.clipboard.writeText(responseData);
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleSend = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setResponseStatus(null);
    setResponseTime(null);
    setResponseData(null);

    const startTime = performance.now();

    try {
      let customHeaders: Record<string, string> = {};
      try {
        if (headers.trim()) {
          customHeaders = JSON.parse(headers);
        }
      } catch (err) {
        throw new Error('Invalid JSON in custom headers input.');
      }

      const res = await fetch(url, {
        method,
        headers: customHeaders
      });

      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponseData(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setResponseData(text);
      }
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      let msg = err.message || 'Network error';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        msg = `Failed to fetch: This API endpoint may be blocking cross-origin browser requests (CORS). Try testing APIs labeled "CORS: Yes", or use the generated cURL command directly in your terminal.`;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Request Builder & Debugger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Public API Playground
            </h1>
            <p className="text-slate-400 text-sm">
              Execute live HTTP requests, test CORS support, inspect JSON payloads, and generate copyable cURL commands.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurl}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
              title="Copy cURL snippet"
            >
              {copiedCurl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied cURL!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy cURL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Test Presets (Zero-Config)
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_APIS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMethod(preset.method);
                  setUrl(preset.url);
                  setResponseData(null);
                  setErrorMessage(null);
                  setResponseStatus(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition text-left flex items-center gap-1.5 ${
                  url === preset.url
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  {preset.category}
                </span>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Request Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Request Configuration Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>HTTP Request Setup</span>
          </h2>

          {/* Method and URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Endpoint URL</label>
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/v1/..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Headers Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Headers (JSON)</label>
              <button
                type="button"
                onClick={() => setHeaders('{\n  "Accept": "application/json"\n}')}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition"
              >
                Reset Default
              </button>
            </div>
            <textarea
              rows={4}
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* cURL Preview */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Generated cURL</label>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-400 overflow-x-auto whitespace-pre-wrap break-all">
              {generateCurl()}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading || !url.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Sending Request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Execute Request</span>
              </>
            )}
          </button>

          {/* CORS Info Box */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-slate-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Browser CORS Note:</span>
            </div>
            <p>
              APIs marked <code>CORS: No</code> restrict direct in-browser calls. Those can be called from backend servers, cURL, or local Node.js apps without restrictions.
            </p>
          </div>
        </div>

        {/* Response Viewer Panel */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-white text-base">Response Payload</h2>
              {responseStatus !== null && (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  Status {responseStatus}
                </span>
              )}
              {responseTime !== null && (
                <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <Clock className="w-3 h-3" />
                  {responseTime} ms
                </span>
              )}
            </div>

            {responseData && (
              <button
                onClick={handleCopyResponse}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                {copiedResponse ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Response Body Box */}
          <div className="flex-1 min-h-[360px] bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-16">
                <RotateCcw className="w-6 h-6 animate-spin text-indigo-400" />
                <span>Dispatching HTTP request...</span>
              </div>
            ) : errorMessage ? (
              <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Request Failed</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">{errorMessage}</p>
              </div>
            ) : responseData ? (
              <pre className="text-emerald-300/90 whitespace-pre-wrap break-all">
                {responseData}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-16">
                <Terminal className="w-8 h-8 text-slate-700" />
                <p className="font-sans text-xs text-slate-400">
                  Select a preset above or input a public API endpoint and click "Execute Request".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
