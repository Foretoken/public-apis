import React, { useState, useMemo } from 'react';
import { generateDailyAlmanac, WeatherData, AlmanacVerdict } from '../../almanacLogic';
import { getMoonDetails } from '../utils/moonHelpers';
import {
  Calendar,
  CloudSun,
  Fish,
  Sprout,
  Moon,
  Gauge,
  Thermometer,
  CloudRain,
  Snowflake,
  Sun,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export const AlmanacDashboard: React.FC = () => {
  // Current date initialization (default to October 12, 2026 or real date)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(2026, 9, 12)); // Oct 12, 2026
  const [temp, setTemp] = useState<number>(62);
  const [pressure, setPressure] = useState<number>(1014);
  const [condition, setCondition] = useState<string>('Clear');

  // Compute daily almanac verdict using the imported logic
  const verdict: AlmanacVerdict = useMemo(() => {
    const weatherData: WeatherData = {
      temp,
      pressure,
      condition
    };
    return generateDailyAlmanac(selectedDate, weatherData);
  }, [selectedDate, temp, pressure, condition]);

  const moonDetails = useMemo(() => {
    return getMoonDetails(verdict.moonPhase);
  }, [verdict.moonPhase]);

  // Compute 7-day projection
  const weekForecast = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      const v = generateDailyAlmanac(d, { temp, pressure, condition });
      const m = getMoonDetails(v.moonPhase);
      days.push({
        date: d,
        verdict: v,
        moon: m
      });
    }
    return days;
  }, [selectedDate, temp, pressure, condition]);

  // Quick preset setters
  const applyPreset = (presetName: string) => {
    if (presetName === 'optimal-fishing') {
      // Find full moon or new moon, mild rain/cloud, pressure 1014
      setPressure(1014);
      setTemp(64);
      setCondition('Rain');
    } else if (presetName === 'spring-frost') {
      const aprilDate = new Date(selectedDate.getFullYear(), 3, 10); // Apr 10
      setSelectedDate(aprilDate);
      setTemp(48);
      setPressure(1012);
      setCondition('Clear');
    } else if (presetName === 'summer-heat') {
      const julyDate = new Date(selectedDate.getFullYear(), 6, 18); // July 18
      setSelectedDate(julyDate);
      setTemp(89);
      setPressure(1016);
      setCondition('Clear');
    } else if (presetName === 'fall-harvest') {
      const octDate = new Date(selectedDate.getFullYear(), 9, 14); // Oct 14
      setSelectedDate(octDate);
      setTemp(58);
      setPressure(1015);
      setCondition('Clear');
    } else if (presetName === 'winter-freeze') {
      const janDate = new Date(selectedDate.getFullYear(), 0, 15); // Jan 15
      setSelectedDate(janDate);
      setTemp(28);
      setPressure(1028);
      setCondition('Snow');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'from-emerald-500 to-teal-400 text-emerald-400 border-emerald-500/50';
    if (score >= 6) return 'from-sky-500 to-blue-400 text-sky-400 border-sky-500/50';
    if (score >= 4) return 'from-amber-500 to-orange-400 text-amber-400 border-amber-500/50';
    return 'from-rose-500 to-red-400 text-rose-400 border-rose-500/50';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Appalachian Branding */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-900/40 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cultivation Culture LLC • Automated Almanac Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Appalachian Smart Almanac
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Hyper-local agricultural and Clinch River fishing intelligence calculated for
              <strong className="text-emerald-400"> Zone 7a/7b (Tazewell County, Virginia)</strong>.
              Synthesizing synodic lunar cycles, barometric pressure shifts, and historical frost windows.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Tazewell, VA (Elev. 2,010–4,000 ft)
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Upper Clinch River Watershed
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Frost Dates: Apr 15 (Last) • Oct 15 (First)
              </span>
            </div>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 flex flex-col gap-2 min-w-[240px]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Scenario Presets
            </span>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                onClick={() => applyPreset('optimal-fishing')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-left transition flex items-center justify-between"
              >
                <span>🎣 Prime Clinch Fishing</span>
                <span className="text-[10px] text-emerald-400 font-mono">1014 hPa</span>
              </button>
              <button
                onClick={() => applyPreset('spring-frost')}
                className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-left transition flex items-center justify-between"
              >
                <span>🌱 Spring Planting (Apr 10)</span>
                <span className="text-[10px] text-sky-400 font-mono">Peas/Radish</span>
              </button>
              <button
                onClick={() => applyPreset('summer-heat')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-left transition flex items-center justify-between"
              >
                <span>☀️ Summer Peak (89°F)</span>
                <span className="text-[10px] text-amber-400 font-mono">Irrigation</span>
              </button>
              <button
                onClick={() => applyPreset('fall-harvest')}
                className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-left transition flex items-center justify-between"
              >
                <span>🍁 Fall Garlic & Harvest</span>
                <span className="text-[10px] text-purple-400 font-mono">Oct 14</span>
              </button>
              <button
                onClick={() => applyPreset('winter-freeze')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-left transition flex items-center justify-between"
              >
                <span>❄️ Winter Dormancy</span>
                <span className="text-[10px] text-slate-400 font-mono">28°F</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Environmental Simulator Controls & Daily Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Environmental Controls */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-emerald-400" />
              <span>Environmental Inputs</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
              Live Simulator
            </span>
          </div>

          {/* Date Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Target Date
              </span>
              <span className="text-emerald-400 font-mono">{formatDate(selectedDate)}</span>
            </label>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) {
                  const parts = e.target.value.split('-');
                  setSelectedDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d);
                }}
                className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                ← Prev Day
              </button>
              <button
                onClick={() => setSelectedDate(new Date(2026, 9, 12))}
                className="py-1 px-3 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d);
                }}
                className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                Next Day →
              </button>
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                Air Temperature (°F)
              </label>
              <span className="font-mono text-sm font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {temp}°F
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="100"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Freeze (15°F)</span>
              <span>Mild (60°F)</span>
              <span>Heatwave (100°F)</span>
            </div>
          </div>

          {/* Barometric Pressure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-sky-400" />
                Barometric Pressure (hPa)
              </label>
              <span className="font-mono text-sm font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
                {pressure} hPa
              </span>
            </div>
            <input
              type="range"
              min="995"
              max="1035"
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span className={pressure < 1005 ? 'text-emerald-400 font-bold' : ''}>
                &lt;1005 (Dropping/Front)
              </span>
              <span className={pressure >= 1010 && pressure <= 1022 ? 'text-emerald-400 font-bold' : ''}>
                1010-1022 (Prime)
              </span>
              <span className={pressure > 1025 ? 'text-rose-400 font-bold' : ''}>
                &gt;1025 (High/Sluggish)
              </span>
            </div>
          </div>

          {/* Weather Condition */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Weather Condition</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCondition('Clear')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                  condition === 'Clear'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={() => setCondition('Rain')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                  condition === 'Rain'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CloudRain className="w-4 h-4 text-sky-400" />
                <span>Rain (+1)</span>
              </button>

              <button
                type="button"
                onClick={() => setCondition('Snow')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                  condition === 'Snow'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Snowflake className="w-4 h-4 text-indigo-400" />
                <span>Snow (-4)</span>
              </button>
            </div>
          </div>

          {/* Clinch River Microclimate Note */}
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              Zone 7a/7b Elevation Microclimate
            </span>
            <p className="text-[11px] leading-relaxed">
              Tazewell's Appalachian ridge-and-valley topography delays frost dispersal in low creek bottoms while valley floors heat rapidly in July.
            </p>
          </div>
        </div>

        {/* Right Column: Almanac Verdict Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top 2 Verdict Cards: Fishing Score + Moon Phase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fishing Score Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Fish className="w-4 h-4 text-sky-400" />
                    Clinch River Fishing Index
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      verdict.fishingScore >= 8
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : verdict.fishingScore >= 6
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : verdict.fishingScore >= 4
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {verdict.fishingScore >= 10
                      ? 'PERFECT 10'
                      : verdict.fishingScore >= 8
                      ? 'EXCELLENT'
                      : verdict.fishingScore >= 6
                      ? 'FAVORABLE'
                      : verdict.fishingScore >= 4
                      ? 'FAIR'
                      : 'POOR'}
                  </span>
                </div>

                {/* Score Big Meter */}
                <div className="flex items-baseline gap-3 my-2">
                  <div className="text-5xl font-black font-mono tracking-tight text-white flex items-baseline">
                    <span
                      className={`text-6xl bg-gradient-to-r ${getScoreColor(
                        verdict.fishingScore
                      )} bg-clip-text text-transparent`}
                    >
                      {verdict.fishingScore}
                    </span>
                    <span className="text-xl text-slate-500 font-normal">/10</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <p className="font-semibold text-slate-200">
                      {verdict.fishingScore >= 8
                        ? 'High Aggression Window'
                        : verdict.fishingScore >= 5
                        ? 'Standard Forage Activity'
                        : 'Slow / Deep Structure Required'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Evaluated on lunar alignment, barometric shifts & water temp.
                    </p>
                  </div>
                </div>

                {/* Advice Box */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed">
                  <p className="font-medium text-sky-200">"{verdict.fishingAdvice}"</p>
                </div>
              </div>

              {/* Scoring breakdown badges */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800/60 font-mono">
                  Moon: {moonDetails.fishingBonus}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800/60 font-mono">
                  Pressure: {pressure} hPa
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800/60 font-mono">
                  Weather: {condition}
                </span>
              </div>
            </div>

            {/* Moon Phase Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Synodic Lunar Phase
                  </span>
                  <span className="font-mono text-xs text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {moonDetails.illumination} Lit
                  </span>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <div className="text-5xl filter drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                    {moonDetails.emoji}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{verdict.moonPhase}</h3>
                    <p className="text-xs text-purple-300 font-medium">
                      {moonDetails.fishingBonus}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {moonDetails.description}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Calculated via 2,551,443s synodic cycle</span>
                <span className="font-mono text-purple-400 font-semibold">Tazewell Zenith</span>
              </div>
            </div>
          </div>

          {/* Planting Verdict & Affiliate/Supply Trigger Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Agricultural & Planting Guidance
                  </h2>
                  <p className="text-xs text-slate-400">
                    Zone 7a / 7b Horticultural Calendar (Tazewell County, VA)
                  </p>
                </div>
              </div>

              {/* Planting Trigger Badge */}
              {verdict.plantingTrigger !== 'none' && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Automated Supply Trigger
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-300">
                      {verdict.plantingTrigger.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Advice Content */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-300">Seasonal Agronomic Directives:</h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {verdict.plantingAdvice}
                  </p>
                </div>
              </div>
            </div>

            {/* Zone 7a/7b Cultivation Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Frost Thresholds</span>
                <p className="text-xs text-slate-200 font-semibold">Apr 15 - Oct 15</p>
                <p className="text-[11px] text-slate-400">~180-day growing season window</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Phase Focus</span>
                <p className="text-xs text-emerald-300 font-semibold">
                  {selectedDate.getMonth() >= 10 || selectedDate.getMonth() <= 1
                    ? 'Dormancy & Soil Rest'
                    : selectedDate.getMonth() >= 2 && selectedDate.getMonth() <= 4
                    ? 'Brassicas & Seed Starts'
                    : selectedDate.getMonth() >= 5 && selectedDate.getMonth() <= 7
                    ? 'Nightshades & Squash'
                    : 'Garlic Bulbs & Fall Roots'}
                </p>
                <p className="text-[11px] text-slate-400">Almanac logic active</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Affiliate Engine</span>
                <p className="text-xs text-amber-300 font-semibold">
                  {verdict.plantingTrigger !== 'none' ? 'Campaign Triggered' : 'Standby'}
                </p>
                <p className="text-[11px] text-slate-400">Cultivation Culture catalog</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Almanac Projection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>7-Day Almanac Projections</span>
            </h3>
            <p className="text-xs text-slate-400">
              Synodic progression and expected fishing & planting windows
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Tazewell Basin (Zone 7a/7b)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {weekForecast.map((day, idx) => {
            const isToday = idx === 0;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-2 transition ${
                  isToday
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-300">
                  {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {day.date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                </div>
                <div className="text-3xl my-1">{day.moon.emoji}</div>
                <div className="text-[10px] font-medium text-purple-300 leading-tight">
                  {day.verdict.moonPhase}
                </div>
                <div className="pt-1 w-full border-t border-slate-800/80">
                  <div className="flex items-center justify-center gap-1">
                    <Fish className="w-3 h-3 text-sky-400" />
                    <span
                      className={`text-xs font-mono font-bold ${
                        day.verdict.fishingScore >= 8
                          ? 'text-emerald-400'
                          : day.verdict.fishingScore >= 5
                          ? 'text-sky-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {day.verdict.fishingScore}/10
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tazewell County Field Notes: Clinch River & Appalachian Flora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Fish className="w-4 h-4 text-sky-400" />
            <span>Clinch River Angling Insights</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Clinch River flows through Tazewell County and is celebrated as one of North America's most biologically diverse freshwater river systems.
          </p>
          <div className="space-y-2 text-xs pt-1">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="font-semibold text-sky-300">Smallmouth Bass</span>
              <span className="text-slate-400">Target rocky drop-offs & riffles on falling pressure</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="font-semibold text-sky-300">Muskellunge (Musky)</span>
              <span className="text-slate-400">Peak feeding during Full Moon & pre-storm windows</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="font-semibold text-sky-300">Rainbow & Brown Trout</span>
              <span className="text-slate-400">Higher elevation cool creeks (Maiden Spring, Cove Creek)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Appalachian Agricultural Traditions</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Cultivation Culture LLC combines centuries of Appalachian mountain folk wisdom with modern meteorological science to guide community growers.
          </p>
          <div className="space-y-2 text-xs pt-1">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="font-semibold text-emerald-300">Waxing Phase</span>
              <span className="text-slate-400">Sow crops producing yields above ground</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="font-semibold text-emerald-300">Waning Phase</span>
              <span className="text-slate-400">Plant root crops, bulbs (garlic, potatoes) & prune</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="font-semibold text-emerald-300">Barometric Alert</span>
              <span className="text-slate-400">Deep watering recommended when dry heat exceeds 85°F</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
