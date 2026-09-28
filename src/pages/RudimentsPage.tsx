import React, { useState, useEffect, useRef } from 'react';
import { RUDIMENTS } from '../data/rudimentsData.ts';
import { Rudiment, PageId } from '../types.ts';
import { drumAudio } from '../audio/drumSoundEngine.ts';
import { 
  Play, 
  Square, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Music2, 
  Sparkles, 
  Award,
  ArrowRight
} from 'lucide-react';

interface RudimentsPageProps {
  masteredRudiments: string[];
  onToggleMastered: (id: string) => void;
  onNavigate: (page: PageId) => void;
}

export const RudimentsPage: React.FC<RudimentsPageProps> = ({
  masteredRudiments,
  onToggleMastered,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Rolls' | 'Diddles' | 'Flams' | 'Drags'>('All');
  const [activeRudiment, setActiveRudiment] = useState<Rudiment>(RUDIMENTS[2]); // Single Paradiddle default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(90);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number>(-1);

  // Speed challenge timer (e.g. 60s)
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);

  // Playback loop ref
  const timerRef = useRef<number | null>(null);
  const noteIdxRef = useRef<number>(0);
  const challengeIntervalRef = useRef<number | null>(null);

  const filteredRudiments = RUDIMENTS.filter(
    (r) => selectedCategory === 'All' || r.category === selectedCategory
  );

  const stopAudio = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setActiveNoteIdx(-1);
    noteIdxRef.current = 0;
  };

  const startAudio = () => {
    drumAudio.ensureUnlocked();
    stopAudio();
    setIsPlaying(true);

    // 16th note subdivision timing based on BPM
    const intervalMs = (60 / tempo / 2) * 1000;

    timerRef.current = window.setInterval(() => {
      const idx = noteIdxRef.current;
      const isAccented = activeRudiment.accents[idx];

      // Play snare sound (accented or regular)
      if (isAccented) {
        drumAudio.playSnare();
      } else {
        // slightly quieter for non-accented tap
        drumAudio.playSnare();
      }

      setActiveNoteIdx(idx);
      noteIdxRef.current = (idx + 1) % activeRudiment.stickingSequence.length;
    }, intervalMs);
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    }
  }, [tempo, activeRudiment]);

  // Handle Challenge Timer
  const startTimer = (seconds: number) => {
    if (challengeIntervalRef.current) clearInterval(challengeIntervalRef.current);
    setTimerSecondsLeft(seconds);
    startAudio();

    challengeIntervalRef.current = window.setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(challengeIntervalRef.current!);
          challengeIntervalRef.current = null;
          stopAudio();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (challengeIntervalRef.current) {
      clearInterval(challengeIntervalRef.current);
      challengeIntervalRef.current = null;
    }
    setTimerSecondsLeft(null);
    stopAudio();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (challengeIntervalRef.current) clearInterval(challengeIntervalRef.current);
    };
  }, []);

  const isMastered = masteredRudiments.includes(activeRudiment.id);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Music2 className="h-4 w-4" />
            <span>Percussive Arts Society Standard</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            40 Rudiments Sticking Vault
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Master the essential rolls, paradiddles, flams, and ruffs that form the DNA of stick control and fluid drum kit fills.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 bg-neutral-900/90 border border-white/10 p-1 rounded-xl">
          {(['All', 'Rolls', 'Diddles', 'Flams', 'Drags'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Rudiment Vault Directory */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 px-1">
            <span>Essential Rudiments ({filteredRudiments.length})</span>
            <span>{masteredRudiments.length} Mastered</span>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredRudiments.map((rudiment) => {
              const isSelected = activeRudiment.id === rudiment.id;
              const mastered = masteredRudiments.includes(rudiment.id);

              return (
                <div
                  key={rudiment.id}
                  onClick={() => {
                    stopAudio();
                    setActiveRudiment(rudiment);
                  }}
                  className={`studio-glass rounded-xl p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-neutral-900/95 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'border-white/5 hover:border-white/20 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                        {rudiment.category}
                      </span>
                      <h3 className={`text-sm font-bold tracking-tight ${
                        isSelected ? 'text-white' : 'text-neutral-200'
                      }`}>
                        {rudiment.name}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMastered(rudiment.id);
                      }}
                      className="text-neutral-400 hover:text-amber-400 transition-colors p-1"
                      title={mastered ? 'Mark as learning' : 'Mark as mastered'}
                    >
                      {mastered ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Sticking sequence preview */}
                  <div className="flex items-center gap-1 font-mono text-xs mb-2">
                    {rudiment.stickingSequence.map((hand, idx) => (
                      <span
                        key={idx}
                        className={`h-5 w-5 rounded flex items-center justify-center font-bold text-[11px] ${
                          hand === 'R'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-neutral-800 text-neutral-300 border border-white/10'
                        }`}
                      >
                        {hand}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-neutral-400">
                    Recommended: {rudiment.suggestedTempo.min} - {rudiment.suggestedTempo.max} BPM
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Practice Stage */}
        <div className="lg:col-span-7">
          <div className="studio-glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            {/* Title & Mastered Action */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {activeRudiment.category} Rudiment
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                  {activeRudiment.name}
                </h2>
              </div>

              <button
                onClick={() => onToggleMastered(activeRudiment.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isMastered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white border border-white/10'
                }`}
              >
                {isMastered ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Award className="h-4 w-4" />}
                <span>{isMastered ? 'Mastered!' : 'Mark Mastered'}</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-300 leading-relaxed">
              {activeRudiment.description}
            </p>

            {/* INTERACTIVE STICKING VISUALIZER (Large animated R/L boxes) */}
            <div className="bg-neutral-900/90 rounded-2xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-neutral-300">STICKING VISUALIZER</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded bg-amber-400 inline-block" />
                    Right Hand (R)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded bg-neutral-400 inline-block" />
                    Left Hand (L)
                  </span>
                </div>
              </div>

              {/* Animated Notes Strip */}
              <div className="flex flex-wrap gap-2 justify-center py-4">
                {activeRudiment.stickingSequence.map((hand, idx) => {
                  const isActive = activeNoteIdx === idx;
                  const isAccent = activeRudiment.accents[idx];

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      {/* Accent marker */}
                      <span className={`text-xs font-bold font-mono h-4 ${
                        isAccent ? 'text-amber-400' : 'opacity-0'
                      }`}>
                        &gt;
                      </span>

                      {/* Sticking Block */}
                      <div
                        className={`h-14 w-12 rounded-xl flex items-center justify-center font-display text-xl font-bold border transition-all duration-75 ${
                          hand === 'R'
                            ? isActive
                              ? 'bg-amber-400 text-neutral-950 border-amber-300 scale-110 shadow-[0_0_25px_rgba(245,158,11,0.6)] ring-2 ring-white'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : isActive
                            ? 'bg-white text-neutral-950 border-white scale-110 shadow-[0_0_25px_rgba(255,255,255,0.6)] ring-2 ring-amber-400'
                            : 'bg-neutral-800 text-neutral-200 border-white/10'
                        }`}
                      >
                        {hand}
                      </div>

                      <span className="text-[10px] font-mono text-neutral-400">
                        {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Audio Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={isPlaying ? stopAudio : startAudio}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                  >
                    {isPlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                    <span>{isPlaying ? 'Stop Loop' : 'Practice Loop'}</span>
                  </button>
                  <span className="text-xs text-neutral-400">
                    {isPlaying ? 'Auditioning sticking tempo...' : 'Listen to rhythmic sticking'}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-neutral-950 border border-white/10 px-3.5 py-1.5 rounded-xl">
                  <span className="text-xs text-neutral-400 font-mono">BPM:</span>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="w-24 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-amber-400 font-mono tabular-nums w-8">
                    {tempo}
                  </span>
                </div>
              </div>
            </div>

            {/* Practice Tip */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-200">
              <span className="font-bold text-amber-400">Mastery Drill: </span>
              {activeRudiment.practiceTip}
            </div>

            {/* Timed Rudiment Endurance Challenge */}
            <div className="studio-glass rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>Timed Speed & Endurance Challenge</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Play continuously for 1 to 3 minutes without stopping to lock in muscle memory.
                </p>
              </div>

              {timerSecondsLeft !== null ? (
                <div className="flex items-center gap-3">
                  <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
                    {timerSecondsLeft}s Left
                  </span>
                  <button
                    onClick={stopTimer}
                    className="px-3.5 py-1.5 rounded-lg bg-neutral-800 text-xs text-red-400 hover:text-white border border-red-500/30"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startTimer(60)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-white/10 text-xs text-neutral-200 hover:border-amber-400 hover:text-white transition-colors"
                  >
                    1 Min
                  </button>
                  <button
                    onClick={() => startTimer(180)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-white/10 text-xs text-neutral-200 hover:border-amber-400 hover:text-white transition-colors"
                  >
                    3 Mins
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
