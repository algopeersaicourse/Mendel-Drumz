import React, { useState, useEffect, useRef, useCallback } from 'react';
import { drumAudio } from '../audio/drumSoundEngine.ts';
import { BEAT_PRESETS } from '../data/beatPresets.ts';
import { BeatPattern } from '../types.ts';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Activity, 
  Volume2, 
  Target, 
  Flame, 
  Clock,
  Shuffle
} from 'lucide-react';

export const BeatStudioPage: React.FC = () => {
  // Mode toggle: Sequencer vs Metronome / Timing Game
  const [activeTab, setActiveTab] = useState<'sequencer' | 'metronome' | 'trainer'>('sequencer');

  // Sequencer State
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedPresetName, setSelectedPresetName] = useState<string>(BEAT_PRESETS[0].name);

  // 6 Tracks: kick, snare, closedHat, openHat, highTom, crash
  const [grid, setGrid] = useState<{
    kick: boolean[];
    snare: boolean[];
    closedHat: boolean[];
    openHat: boolean[];
    highTom: boolean[];
    crash: boolean[];
  }>(BEAT_PRESETS[0].tracks);

  // Sequencer loop ref
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);

  // Metronome State
  const [metronomePlaying, setMetronomePlaying] = useState<boolean>(false);
  const [metronomeBpm, setMetronomeBpm] = useState<number>(100);
  const [subdivision, setSubdivision] = useState<'quarter' | 'eighth' | 'sixteenth' | 'triplet'>('quarter');
  const [metronomeTickIndex, setMetronomeTickIndex] = useState<number>(0);
  const metronomeTimerRef = useRef<number | null>(null);

  // Timing Accuracy Game State
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; offsetMs: number; rating: 'perfect' | 'great' | 'good' | 'miss' } | null>(null);
  const [gameScore, setGameScore] = useState<{ totalHits: number; perfectHits: number; streak: number; maxStreak: number }>({
    totalHits: 0,
    perfectHits: 0,
    streak: 0,
    maxStreak: 0,
  });
  const expectedBeatTimeRef = useRef<number>(0);

  // Load Preset
  const handleLoadPreset = (preset: BeatPattern) => {
    setSelectedPresetName(preset.name);
    setBpm(preset.bpm);
    setGrid({
      kick: [...preset.tracks.kick],
      snare: [...preset.tracks.snare],
      closedHat: [...preset.tracks.closedHat],
      openHat: [...preset.tracks.openHat],
      highTom: [...preset.tracks.highTom],
      crash: [...preset.tracks.crash],
    });
  };

  // Toggle step
  const toggleStep = (track: keyof typeof grid, index: number) => {
    drumAudio.ensureUnlocked();
    // Audition sound
    if (!grid[track][index]) {
      if (track === 'kick') drumAudio.playKick();
      if (track === 'snare') drumAudio.playSnare();
      if (track === 'closedHat') drumAudio.playClosedHat();
      if (track === 'openHat') drumAudio.playOpenHat();
      if (track === 'highTom') drumAudio.playHighTom();
      if (track === 'crash') drumAudio.playCrash();
    }

    setGrid((prev) => ({
      ...prev,
      [track]: prev[track].map((val, i) => (i === index ? !val : val)),
    }));
  };

  // Sequencer Playback
  const stopSequencer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    stepRef.current = 0;
  };

  const startSequencer = () => {
    drumAudio.ensureUnlocked();
    stopSequencer();
    setIsPlaying(true);

    const stepIntervalMs = (60 / bpm / 4) * 1000;

    timerRef.current = window.setInterval(() => {
      const s = stepRef.current;

      if (grid.kick[s]) drumAudio.playKick();
      if (grid.snare[s]) drumAudio.playSnare();
      if (grid.closedHat[s]) drumAudio.playClosedHat();
      if (grid.openHat[s]) drumAudio.playOpenHat();
      if (grid.highTom[s]) drumAudio.playHighTom();
      if (grid.crash[s]) drumAudio.playCrash();

      setCurrentStep(s);
      stepRef.current = (s + 1) % 16;
    }, stepIntervalMs);
  };

  useEffect(() => {
    if (isPlaying) {
      startSequencer();
    }
  }, [bpm, grid]);

  // Tap tempo handler
  const handleTapTempo = () => {
    const now = performance.now();
    const taps = tapTimesRef.current;
    // reset if idle for > 2 seconds
    if (taps.length > 0 && now - taps[taps.length - 1] > 2000) {
      tapTimesRef.current = [now];
      return;
    }

    taps.push(now);
    if (taps.length > 4) taps.shift();

    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setBpm(calculatedBpm);
        setMetronomeBpm(calculatedBpm);
      }
    }
  };

  // Clear Grid
  const handleClearGrid = () => {
    const empty = Array(16).fill(false);
    setGrid({
      kick: [...empty],
      snare: [...empty],
      closedHat: [...empty],
      openHat: [...empty],
      highTom: [...empty],
      crash: [...empty],
    });
  };

  // Randomize Beat
  const handleRandomize = () => {
    drumAudio.ensureUnlocked();
    const rand = (prob: number) => Array.from({ length: 16 }, () => Math.random() < prob);
    setGrid({
      kick: [true, false, false, false, false, false, Math.random() > 0.5, false, true, false, false, false, false, false, Math.random() > 0.5, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      closedHat: Array.from({ length: 16 }, (_, i) => i % 2 === 0 || Math.random() > 0.4),
      openHat: rand(0.1),
      highTom: rand(0.08),
      crash: [true, ...Array(15).fill(false)],
    });
  };

  // METRONOME LOGIC
  const stopMetronome = () => {
    if (metronomeTimerRef.current !== null) {
      clearInterval(metronomeTimerRef.current);
      metronomeTimerRef.current = null;
    }
    setMetronomePlaying(false);
    setMetronomeTickIndex(0);
  };

  const startMetronome = () => {
    drumAudio.ensureUnlocked();
    stopMetronome();
    setMetronomePlaying(true);

    let multiplier = 1;
    if (subdivision === 'eighth') multiplier = 2;
    if (subdivision === 'sixteenth') multiplier = 4;
    if (subdivision === 'triplet') multiplier = 3;

    const intervalMs = (60 / metronomeBpm / multiplier) * 1000;
    let tickCount = 0;

    metronomeTimerRef.current = window.setInterval(() => {
      const isAccent = tickCount % (4 * multiplier) === 0;
      drumAudio.playMetronomeTick(isAccent);
      setMetronomeTickIndex(tickCount % (4 * multiplier));
      expectedBeatTimeRef.current = performance.now();
      tickCount++;
    }, intervalMs);
  };

  useEffect(() => {
    if (metronomePlaying) {
      startMetronome();
    }
  }, [metronomeBpm, subdivision]);

  // TIMING GAME TAP HANDLER
  const handleTimingGameHit = useCallback(() => {
    if (!gameActive) return;
    drumAudio.ensureUnlocked();
    drumAudio.playSnare();

    const now = performance.now();
    const expected = expectedBeatTimeRef.current;
    const beatIntervalMs = (60 / metronomeBpm) * 1000;

    // calculate difference to closest beat
    let diff = now - expected;
    if (diff > beatIntervalMs / 2) {
      diff -= beatIntervalMs;
    }

    const absDiff = Math.abs(diff);

    let rating: 'perfect' | 'great' | 'good' | 'miss' = 'miss';
    let label = '';

    if (absDiff < 18) {
      rating = 'perfect';
      label = `PERFECT! 🎯 (${Math.round(diff)}ms)`;
    } else if (absDiff < 40) {
      rating = 'great';
      label = `GREAT! ⚡ (${Math.round(diff > 0 ? diff : diff)}ms)`;
    } else if (absDiff < 75) {
      rating = 'good';
      label = diff < 0 ? `EARLY (${Math.round(diff)}ms)` : `LATE (+${Math.round(diff)}ms)`;
    } else {
      rating = 'miss';
      label = diff < 0 ? `WAY EARLY (${Math.round(diff)}ms)` : `WAY LATE (+${Math.round(diff)}ms)`;
    }

    setLastFeedback({ text: label, offsetMs: diff, rating });

    setGameScore((prev) => {
      const isGoodHit = rating === 'perfect' || rating === 'great';
      const newStreak = isGoodHit ? prev.streak + 1 : 0;
      return {
        totalHits: prev.totalHits + 1,
        perfectHits: prev.perfectHits + (rating === 'perfect' ? 1 : 0),
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
      };
    });
  }, [gameActive, metronomeBpm]);

  // Keyboard spacebar listener for timing game
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeTab === 'trainer' && gameActive && e.code === 'Space') {
        e.preventDefault();
        handleTimingGameHit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeTab, gameActive, handleTimingGameHit]);

  // Clean timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Sliders className="h-4 w-4" />
            <span>Rhythm Programming & Timing Tools</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Beat Studio & Rhythm Trainer
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Program 16-step patterns, practice with the precision subdivision metronome, and test your internal clock timing accuracy.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-neutral-900/90 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => {
              stopMetronome();
              setActiveTab('sequencer');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'sequencer'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Step Sequencer
          </button>
          <button
            onClick={() => {
              stopSequencer();
              setActiveTab('metronome');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'metronome'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pro Metronome
          </button>
          <button
            onClick={() => {
              stopSequencer();
              stopMetronome();
              setActiveTab('trainer');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'trainer'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Timing Accuracy Game
          </button>
        </div>
      </div>

      {/* VIEW 1: 16-STEP SEQUENCER */}
      {activeTab === 'sequencer' && (
        <div className="space-y-6">
          {/* Controls Bar: Play, BPM, Tap Tempo, Presets */}
          <div className="studio-glass rounded-2xl p-5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={isPlaying ? stopSequencer : startSequencer}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20"
              >
                {isPlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{isPlaying ? 'Stop Beat' : 'Play Beat'}</span>
              </button>

              <button
                onClick={handleTapTempo}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-amber-400 hover:border-amber-400/40 active:scale-95 transition-all"
                title="Tap repeatedly to set tempo"
              >
                <span>Tap Tempo</span>
              </button>
            </div>

            {/* Tempo Slider */}
            <div className="flex items-center gap-3 bg-neutral-900/90 border border-white/10 px-4 py-2 rounded-xl">
              <span className="text-xs text-neutral-400 font-mono">BPM:</span>
              <input
                type="range"
                min="40"
                max="200"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-28 accent-amber-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-amber-400 font-mono tabular-nums w-8">
                {bpm}
              </span>
            </div>

            {/* Presets and actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 hidden sm:inline">Presets:</span>
              <select
                value={selectedPresetName}
                onChange={(e) => {
                  const preset = BEAT_PRESETS.find((p) => p.name === e.target.value);
                  if (preset) handleLoadPreset(preset);
                }}
                className="bg-neutral-900 border border-white/10 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                {BEAT_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} ({p.bpm} BPM)
                  </option>
                ))}
              </select>

              <button
                onClick={handleRandomize}
                className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-amber-400 transition-colors"
                title="Randomize Beat"
                aria-label="Randomize Beat"
              >
                <Shuffle className="h-4 w-4" />
              </button>

              <button
                onClick={handleClearGrid}
                className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-colors"
                title="Clear Grid"
                aria-label="Clear Grid"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 16-Step Sequencer Grid */}
          <div className="studio-glass rounded-2xl p-6 border border-white/10 overflow-x-auto">
            {/* Beat Header Timeline */}
            <div className="min-w-[680px]">
              <div className="flex items-center mb-3">
                <div className="w-24 text-xs font-mono text-neutral-400 font-bold">INSTRUMENT</div>
                <div className="grid grid-cols-16 gap-1.5 flex-1">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const isQuarter = i % 4 === 0;
                    return (
                      <div
                        key={`col-${i}`}
                        className={`text-center font-mono text-[10px] pb-1 ${
                          isPlaying && currentStep === i
                            ? 'text-amber-400 font-bold'
                            : isQuarter
                            ? 'text-neutral-300 font-semibold'
                            : 'text-neutral-400'
                        }`}
                      >
                        {isQuarter ? Math.floor(i / 4) + 1 : '·'}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracks */}
              {(
                [
                  { key: 'crash', label: 'CRASH', color: 'bg-yellow-500' },
                  { key: 'openHat', label: 'OPEN HAT', color: 'bg-amber-400' },
                  { key: 'closedHat', label: 'CLOSED HAT', color: 'bg-amber-500' },
                  { key: 'highTom', label: 'HIGH TOM', color: 'bg-orange-400' },
                  { key: 'snare', label: 'SNARE', color: 'bg-neutral-100 text-neutral-950' },
                  { key: 'kick', label: 'KICK', color: 'bg-amber-600' },
                ] as const
              ).map((track) => (
                <div key={track.key} className="flex items-center gap-2 mb-2">
                  <div className="w-24 text-xs font-mono font-medium text-neutral-300 truncate">
                    {track.label}
                  </div>
                  <div className="grid grid-cols-16 gap-1.5 flex-1">
                    {grid[track.key].map((active, stepIdx) => {
                      const isCurrent = isPlaying && currentStep === stepIdx;
                      const isQuarterStart = stepIdx % 4 === 0;

                      return (
                        <button
                          key={`${track.key}-${stepIdx}`}
                          onClick={() => toggleStep(track.key, stepIdx)}
                          className={`h-11 rounded-lg border transition-all duration-75 flex items-center justify-center cursor-pointer select-none active:scale-95 ${
                            active
                              ? `${track.color} font-bold shadow-md shadow-amber-500/20 ${
                                  isCurrent ? 'ring-2 ring-white scale-105 brightness-125' : ''
                                }`
                              : isCurrent
                              ? 'bg-neutral-800 border-amber-400/50'
                              : isQuarterStart
                              ? 'bg-neutral-900/90 border-white/15 hover:border-amber-400/50'
                              : 'bg-neutral-950/70 border-white/5 hover:border-white/20'
                          }`}
                          aria-label={`Toggle ${track.label} on step ${stepIdx + 1}`}
                        >
                          {active && <span className="h-2 w-2 rounded-full bg-current opacity-80" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PRO METRONOME */}
      {activeTab === 'metronome' && (
        <div className="max-w-xl mx-auto studio-glass rounded-3xl p-8 border border-white/10 text-center space-y-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
              Timing Standard
            </div>
            <h2 className="font-display text-4xl font-bold text-white tabular-nums">
              {metronomeBpm} <span className="text-lg text-neutral-400 font-normal">BPM</span>
            </h2>
          </div>

          {/* Visual Pendulum / Pulse Bar */}
          <div className="relative h-16 w-full bg-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="grid grid-cols-4 w-full h-full divide-x divide-white/5">
              {[0, 1, 2, 3].map((beat) => {
                const isActiveBeat = metronomePlaying && Math.floor(metronomeTickIndex / (subdivision === 'quarter' ? 1 : subdivision === 'eighth' ? 2 : 4)) % 4 === beat;
                return (
                  <div
                    key={beat}
                    className={`flex flex-col items-center justify-center transition-colors ${
                      isActiveBeat
                        ? beat === 0
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-neutral-700 text-white font-semibold'
                        : 'text-neutral-400'
                    }`}
                  >
                    <span className="font-mono text-sm">Beat {beat + 1}</span>
                    {isActiveBeat && <span className="h-1.5 w-6 rounded-full bg-current mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tempo Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-400 font-mono">
              <span>Largo (40)</span>
              <span>Andante (80)</span>
              <span>Moderato (110)</span>
              <span>Allegro (140+)</span>
            </div>
            <input
              type="range"
              min="40"
              max="220"
              value={metronomeBpm}
              onChange={(e) => setMetronomeBpm(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />
          </div>

          {/* Subdivision Selectors */}
          <div className="flex items-center justify-center gap-2">
            {(
              [
                { id: 'quarter', label: '1/4 Notes' },
                { id: 'eighth', label: '1/8 Notes' },
                { id: 'triplet', label: 'Triplets' },
                { id: 'sixteenth', label: '1/16 Notes' },
              ] as const
            ).map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSubdivision(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  subdivision === sub.id
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Start / Stop Metronome */}
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={metronomePlaying ? stopMetronome : startMetronome}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
            >
              {metronomePlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{metronomePlaying ? 'Stop Metronome' : 'Start Metronome'}</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: RHYTHM ACCURACY TIMING TRAINER GAME */}
      {activeTab === 'trainer' && (
        <div className="max-w-2xl mx-auto studio-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-neutral-900 px-3 py-1 text-xs font-semibold text-amber-300">
              <Activity className="h-3.5 w-3.5" />
              <span>Inner Clock Precision Test</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white">
              Drummer Rhythm Accuracy Game
            </h2>
            <p className="text-sm text-neutral-300">
              Listen to the pulse and tap in sync. See how many milliseconds early or late your strikes land.
            </p>
          </div>

          {/* Scoreboard */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-neutral-900/90 rounded-xl p-3 border border-white/5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Total Strikes</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {gameScore.totalHits}
              </div>
            </div>

            <div className="bg-neutral-900/90 rounded-xl p-3 border border-white/5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Current Streak</div>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {gameScore.streak} 🔥
              </div>
            </div>

            <div className="bg-neutral-900/90 rounded-xl p-3 border border-white/5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Accuracy</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {gameScore.totalHits > 0
                  ? `${Math.round((gameScore.perfectHits / gameScore.totalHits) * 100)}%`
                  : '0%'}
              </div>
            </div>
          </div>

          {/* Feedback Display */}
          <div className="h-28 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col items-center justify-center p-4">
            {lastFeedback ? (
              <div className="text-center space-y-1">
                <span
                  className={`text-2xl sm:text-3xl font-black font-display tracking-tight ${
                    lastFeedback.rating === 'perfect'
                      ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                      : lastFeedback.rating === 'great'
                      ? 'text-amber-400'
                      : lastFeedback.rating === 'good'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {lastFeedback.text}
                </span>
                <p className="text-xs text-neutral-400 font-mono">
                  {Math.abs(Math.round(lastFeedback.offsetMs))} milliseconds off target
                </p>
              </div>
            ) : (
              <span className="text-sm text-neutral-400">
                {gameActive ? 'Tap SPACE or the button on the beat!' : 'Press "Start Accuracy Test" to begin'}
              </span>
            )}
          </div>

          {/* Interactive Trigger Button */}
          <div className="flex flex-col items-center gap-4">
            {!gameActive ? (
              <button
                onClick={() => {
                  setGameActive(true);
                  setGameScore({ totalHits: 0, perfectHits: 0, streak: 0, maxStreak: 0 });
                  setLastFeedback(null);
                  startMetronome();
                }}
                className="px-8 py-3.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
              >
                Start Accuracy Test ({metronomeBpm} BPM)
              </button>
            ) : (
              <>
                <button
                  onClick={handleTimingGameHit}
                  className="w-full h-24 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xl tracking-wider active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex flex-col items-center justify-center select-none"
                >
                  <span>HIT ON THE BEAT!</span>
                  <span className="text-xs font-mono font-medium text-neutral-900 mt-1">
                    (or Press Spacebar)
                  </span>
                </button>

                <button
                  onClick={() => {
                    setGameActive(false);
                    stopMetronome();
                  }}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  End Session
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
