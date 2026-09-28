import React, { useState, useEffect, useCallback, useRef } from 'react';
import { drumAudio } from '../audio/drumSoundEngine.ts';
import { DRUM_PADS } from '../data/beatPresets.ts';
import { DrumPad } from '../types.ts';
import { Volume2, Play, Square, RotateCcw, CircleDot, Sparkles, Music, Sliders } from 'lucide-react';

interface RecordedHit {
  type: string;
  timestamp: number;
}

export const DrumKitPage: React.FC = () => {
  const [activePadId, setActivePadId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kit' | 'pads'>('kit');
  const [masterVolume, setMasterVolume] = useState<number>(0.85);

  // Groove Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlayingBack, setIsPlayingBack] = useState<boolean>(false);
  const [recordedHits, setRecordedHits] = useState<RecordedHit[]>([]);
  const recordStartTimeRef = useRef<number>(0);
  const playbackTimeoutRefs = useRef<number[]>([]);

  // Trigger sound and visual feedback
  const handleTrigger = useCallback((pad: DrumPad) => {
    drumAudio.ensureUnlocked();
    drumAudio.triggerPad(pad.type);

    setActivePadId(pad.id);
    setTimeout(() => {
      setActivePadId((prev) => (prev === pad.id ? null : prev));
    }, 150);

    // If recording, log the strike
    if (isRecording) {
      const offset = performance.now() - recordStartTimeRef.current;
      setRecordedHits((prev) => [...prev, { type: pad.type, timestamp: offset }]);
    }
  }, [isRecording]);

  // Global Keyboard listener for drum hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.code === 'Space' ? 'Space' : e.key.toUpperCase();
      const matchedPad = DRUM_PADS.find((p) => p.key.toUpperCase() === key);

      if (matchedPad) {
        e.preventDefault();
        handleTrigger(matchedPad);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTrigger]);

  // Recording controls
  const toggleRecording = () => {
    drumAudio.ensureUnlocked();
    if (!isRecording) {
      // Start recording
      setRecordedHits([]);
      recordStartTimeRef.current = performance.now();
      setIsRecording(true);
      if (isPlayingBack) stopPlayback();
    } else {
      // Stop recording
      setIsRecording(false);
    }
  };

  const startPlayback = () => {
    if (recordedHits.length === 0) return;
    drumAudio.ensureUnlocked();
    setIsPlayingBack(true);

    const totalDuration = recordedHits[recordedHits.length - 1].timestamp + 600;

    recordedHits.forEach((hit) => {
      const timeoutId = window.setTimeout(() => {
        drumAudio.triggerPad(hit.type);
        const pad = DRUM_PADS.find((p) => p.type === hit.type);
        if (pad) {
          setActivePadId(pad.id);
          setTimeout(() => setActivePadId(null), 120);
        }
      }, hit.timestamp);
      playbackTimeoutRefs.current.push(timeoutId);
    });

    // Auto loop or reset when done
    const loopTimeout = window.setTimeout(() => {
      setIsPlayingBack(false);
    }, totalDuration);
    playbackTimeoutRefs.current.push(loopTimeout);
  };

  const stopPlayback = () => {
    playbackTimeoutRefs.current.forEach((id) => clearTimeout(id));
    playbackTimeoutRefs.current = [];
    setIsPlayingBack(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterVolume(val);
    drumAudio.setVolume(val);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Music className="h-4 w-4" />
            <span>Interactive Studio Instrument</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Virtual Drum Studio
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Play responsive acoustic drum samples with zero latency. Use your keyboard hotkeys, mouse, or touch screen.
          </p>
        </div>

        {/* View Switcher & Master Volume */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 bg-neutral-900/90 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kit')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'kit'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Acoustic Kit View
            </button>
            <button
              onClick={() => setViewMode('pads')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'pads'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              MPC Studio Pads
            </button>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <Volume2 className="h-4 w-4 text-amber-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={handleVolumeChange}
              className="w-20 accent-amber-500 cursor-pointer"
              title="Master Volume"
              aria-label="Master Volume"
            />
            <span className="text-xs font-mono text-neutral-400 w-8 tabular-nums">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* QUICK KEYBOARD MAPPING REFERENCE STRIP */}
      <div className="studio-glass rounded-xl px-4 py-3 border border-white/5 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-300">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>Keyboard Shortcuts:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-[11px]">
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-amber-300">Space = Kick</span>
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-white">S = Snare</span>
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-amber-300">D = Closed Hat</span>
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-amber-300">F = Open Hat</span>
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-white">E = High Tom</span>
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-white">G = Floor Tom</span>
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-amber-300">J = Crash</span>
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-amber-300">K = Ride</span>
          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-white">R = Rimshot</span>
        </div>
      </div>

      {/* MAIN PLAYING STAGE */}
      {viewMode === 'kit' ? (
        /* ACOUSTIC KIT VISUAL LAYOUT */
        <div className="relative w-full aspect-[16/10] max-h-[580px] studio-glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-4 sm:p-8 flex items-center justify-center bg-gradient-to-b from-neutral-900/60 to-neutral-950/95 mb-8">
          {/* Subtle Stage Lighting Ring */}
          <div className="absolute inset-0 bg-radial-[at_center_bottom] from-amber-500/10 via-transparent to-neutral-950/80 pointer-events-none" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

          {/* Interactive Acoustic Drums in Perspective */}
          <div className="relative w-full h-full max-w-4xl">
            {DRUM_PADS.map((pad) => {
              const isActive = activePadId === pad.id;
              const isCymbal = ['crash', 'ride', 'hihatClosed', 'hihatOpen'].includes(pad.type);
              const isBass = pad.type === 'kick';

              return (
                <button
                  key={pad.id}
                  onClick={() => handleTrigger(pad)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleTrigger(pad);
                  }}
                  style={{
                    left: `${pad.position.x}%`,
                    top: `${pad.position.y}%`,
                    width: `${pad.size}px`,
                    height: `${pad.size}px`,
                    transform: `translate(-50%, -50%) ${isActive ? 'scale(0.94)' : 'scale(1)'}`,
                  }}
                  className={`absolute rounded-full flex flex-col items-center justify-center select-none cursor-pointer transition-all duration-75 shadow-lg active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isBass
                      ? 'border-4 border-amber-600/70 bg-gradient-to-b from-neutral-800 to-neutral-950 shadow-2xl'
                      : isCymbal
                      ? 'border-2 border-amber-400/80 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 text-neutral-950 shadow-amber-500/20'
                      : 'border-2 border-white/30 bg-gradient-to-b from-neutral-700 to-neutral-900 text-white'
                  } ${
                    isActive
                      ? 'ring-4 ring-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.6)] brightness-125'
                      : 'hover:brightness-110 hover:border-amber-400/60'
                  }`}
                  aria-label={`Play ${pad.name}`}
                >
                  {/* Concentric rings on drumheads / cymbals */}
                  <div className="absolute inset-2 rounded-full border border-black/10 pointer-events-none" />
                  <div className="absolute inset-4 rounded-full border border-black/10 pointer-events-none" />

                  <span className={`text-[10px] sm:text-xs font-bold tracking-tight text-center leading-tight ${
                    isCymbal ? 'text-neutral-950' : 'text-white'
                  }`}>
                    {pad.shortName}
                  </span>

                  <span className={`mt-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${
                    isCymbal
                      ? 'bg-neutral-950/20 border-neutral-950/30 text-neutral-950'
                      : 'bg-black/40 border-white/10 text-amber-300'
                  }`}>
                    {pad.key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* MPC STUDIO PAD GRID VIEW */
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-8">
          {DRUM_PADS.map((pad) => {
            const isActive = activePadId === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => handleTrigger(pad)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleTrigger(pad);
                }}
                className={`relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-between border select-none transition-all duration-75 active:scale-95 shadow-xl ${
                  isActive
                    ? 'bg-amber-500 border-amber-300 text-neutral-950 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-[0.97]'
                    : 'studio-glass border-white/10 text-white hover:border-amber-500/40 hover:bg-neutral-900/90'
                }`}
                aria-label={`Play ${pad.name}`}
              >
                <div className="w-full flex items-center justify-between text-[11px] font-mono">
                  <span className={isActive ? 'text-neutral-900 font-bold' : 'text-neutral-400'}>PAD</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    isActive
                      ? 'bg-neutral-950 text-amber-400 border-neutral-900'
                      : 'bg-neutral-800 text-amber-300 border-white/10'
                  }`}>
                    {pad.key}
                  </span>
                </div>

                <div className="text-center my-auto">
                  <span className="block font-display text-sm sm:text-base font-bold tracking-tight">
                    {pad.name}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                    {pad.shortName}
                  </span>
                </div>

                <div className="w-full flex justify-center">
                  <span className={`h-1.5 w-12 rounded-full ${isActive ? 'bg-neutral-950' : 'bg-white/10'}`} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* MINI GROOVE RECORDER TOOLBAR */}
      <div className="studio-glass rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-white/10'
              }`}
            >
              {isRecording ? <Square className="h-3.5 w-3.5 fill-current" /> : <CircleDot className="h-3.5 w-3.5 text-red-500" />}
              <span>{isRecording ? 'Stop Recording' : 'Record Groove'}</span>
            </button>

            {recordedHits.length > 0 && !isRecording && (
              <>
                <button
                  onClick={isPlayingBack ? stopPlayback : startPlayback}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
                >
                  {isPlayingBack ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  <span>{isPlayingBack ? 'Stop Loop' : 'Play Loop'}</span>
                </button>

                <button
                  onClick={() => {
                    stopPlayback();
                    setRecordedHits([]);
                  }}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors border border-white/5"
                  title="Clear Recording"
                  aria-label="Clear Recording"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <div className="text-xs text-neutral-400">
            {isRecording ? (
              <span className="text-red-400 font-medium">Recording live hits... ({recordedHits.length} notes)</span>
            ) : recordedHits.length > 0 ? (
              <span>Captured {recordedHits.length} drum strikes</span>
            ) : (
              <span>Hit "Record Groove" to capture your live beats</span>
            )}
          </div>
        </div>

        <div className="text-xs text-neutral-400 text-center sm:text-right">
          <span className="font-semibold text-neutral-300">Pro Tip:</span> Play Kick with Spacebar & Snare with S for classic natural rock pulse.
        </div>
      </div>
    </div>
  );
};
