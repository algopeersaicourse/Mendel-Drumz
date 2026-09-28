import React from 'react';
import { PageId } from '../types.ts';
import { 
  Play, 
  BookOpen, 
  Sliders, 
  Flame, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Target, 
  Music2,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { drumAudio } from '../audio/drumSoundEngine.ts';

// Generated drum image assets
import heroDrumKitImg from '../assets/images/hero_acoustic_drum_kit_1790623049998.jpg';
import snareCloseupImg from '../assets/images/studio_snare_closeup_1790623063534.jpg';
import cymbalCloseupImg from '../assets/images/drummer_cymbals_action_1790623074638.jpg';
import studioPracticeImg from '../assets/images/drum_practice_station_1790623085852.jpg';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  streakDays: number;
  completedLessonsCount: number;
  totalPracticeMinutes: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  streakDays,
  completedLessonsCount,
  totalPracticeMinutes,
}) => {
  const handleQuickPlay = (sound: 'kick' | 'snare' | 'hihatClosed' | 'crash') => {
    drumAudio.ensureUnlocked();
    if (sound === 'kick') drumAudio.playKick();
    if (sound === 'snare') drumAudio.playSnare();
    if (sound === 'hihatClosed') drumAudio.playClosedHat();
    if (sound === 'crash') drumAudio.playCrash();
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Background Photo with Dark Gradient Studio Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroDrumKitImg}
            alt="Professional acoustic drum kit in mood-lit dark studio"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Multi-layered dark studio gradient overlay for guaranteed contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/85 to-neutral-950/65" />
          <div className="absolute inset-0 bg-radial-[at_center] from-amber-500/10 via-transparent to-black/80" />
        </div>

        {/* Ambient Subtle Studio Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Subtle Studio Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-neutral-900/80 px-4 py-1.5 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-300">
              Personal Drum Academy & Studio
            </span>
          </div>

          {/* Large MENDEL DRUMZ Heading */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-4">
            MENDEL DRUMZ <span className="inline-block text-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]">🥁</span>
          </h1>

          {/* Tagline */}
          <p className="font-display text-lg sm:text-2xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 mb-6 max-w-3xl">
            “Learn. Practice. Play. Master the Rhythm.”
          </p>

          {/* Short Welcome Message */}
          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed mb-10 text-balance">
            Welcome to your personal drum studio. Whether you are dialing in clean stick control, locking down driving 4/4 rock grooves, or polishing complex rudiments, your path to solid pocket starts right here.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={() => onNavigate('lessons')}
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Explore Drum Lessons</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigate('kit')}
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-neutral-900/80 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-neutral-800/90 hover:border-amber-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>Launch Virtual Drum Kit</span>
            </button>
          </div>

          {/* Interactive Quick Sound Pad Preview */}
          <div className="w-full max-w-xl studio-glass rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3 text-xs text-neutral-400 px-1">
              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                <Volume2 className="h-3.5 w-3.5" />
                Quick Sound Check (Low-Latency Web Audio)
              </span>
              <span className="text-neutral-400">Tap to test</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <button
                onClick={() => handleQuickPlay('kick')}
                className="group relative flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-neutral-900/90 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-95 transition-all text-center"
              >
                <span className="text-xs font-bold text-white group-hover:text-amber-400">KICK</span>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">Punchy 38Hz</span>
              </button>

              <button
                onClick={() => handleQuickPlay('snare')}
                className="group relative flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-neutral-900/90 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-95 transition-all text-center"
              >
                <span className="text-xs font-bold text-white group-hover:text-amber-400">SNARE</span>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">Dual-Snap</span>
              </button>

              <button
                onClick={() => handleQuickPlay('hihatClosed')}
                className="group relative flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-neutral-900/90 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-95 transition-all text-center"
              >
                <span className="text-xs font-bold text-white group-hover:text-amber-400">HI-HAT</span>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">Crisp Hat</span>
              </button>

              <button
                onClick={() => handleQuickPlay('crash')}
                className="group relative flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-neutral-900/90 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-95 transition-all text-center"
              >
                <span className="text-xs font-bold text-white group-hover:text-amber-400">CRASH</span>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">Bronze Shimmer</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT AT-A-GLANCE METRICS (Clean unboxed discipline) */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="studio-glass rounded-xl p-6 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Practice Streak</div>
              <div className="text-3xl font-display font-bold text-white tracking-tight tabular-nums">
                {streakDays} <span className="text-sm font-normal text-amber-400">Days Active</span>
              </div>
              <div className="text-xs text-neutral-400 mt-1">Keep the daily groove alive</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="h-6 w-6" />
            </div>
          </div>

          <div className="studio-glass rounded-xl p-6 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Curriculum Progress</div>
              <div className="text-3xl font-display font-bold text-white tracking-tight tabular-nums">
                {completedLessonsCount} <span className="text-sm font-normal text-neutral-400">/ 8 Lessons</span>
              </div>
              <div className="text-xs text-neutral-400 mt-1">Foundations to advanced linear fills</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Award className="h-6 w-6" />
            </div>
          </div>

          <div className="studio-glass rounded-xl p-6 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Logged Time</div>
              <div className="text-3xl font-display font-bold text-white tracking-tight tabular-nums">
                {totalPracticeMinutes} <span className="text-sm font-normal text-neutral-400">Minutes</span>
              </div>
              <div className="text-xs text-neutral-400 mt-1">Time behind the kit & pad</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </section>

      {/* CORE STUDIO PILLARS / MODULES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Your Comprehensive Drum Academy
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Four specialized modules crafted to develop coordination, tempo accuracy, and rhythmic vocabulary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Interactive Drum Kit */}
          <div
            onClick={() => onNavigate('kit')}
            className="group studio-glass rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-amber-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-colors" />
            
            <div className="flex items-start justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Play className="h-6 w-6 fill-current" />
              </div>
              <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Play Studio Kit <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Acoustic Kit & Pad Matrix
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Play an acoustic drum setup or studio MPC pad grid using your keyboard or touch. Features real synthesized kick, snare, cymbals, toms, and live groove recording.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span>9 Responsive Instruments</span>
              <span>Space, S, D, F, J, K Hotkeys</span>
            </div>
          </div>

          {/* Card 2: Structured Lessons */}
          <div
            onClick={() => onNavigate('lessons')}
            className="group studio-glass rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-amber-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-colors" />

            <div className="flex items-start justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-amber-300">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Browse Curriculum <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Interactive Drum Curriculum
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Step-by-step drum lessons covering basic stick grip, 4/4 rock backbeats, ghost notes, and tom fills with interactive audio playback and tempo training.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span>8 Comprehensive Modules</span>
              <span>Audio Playback & Sheet Guides</span>
            </div>
          </div>

          {/* Card 3: Beat Studio & Metronome */}
          <div
            onClick={() => onNavigate('beat-studio')}
            className="group studio-glass rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-amber-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-amber-400">
                <Sliders className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Open Sequencer <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Beat Studio & Rhythm Accuracy
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Program 16-step beats with classic presets (Rock, Funk, Four-on-the-Floor). Practice with the precision metronome or test your inner clock with the Rhythm Timing Game.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span>16-Step Grid & Presets</span>
              <span>Subdivisions & Millisecond Timing</span>
            </div>
          </div>

          {/* Card 4: Rudiments Vault */}
          <div
            onClick={() => onNavigate('rudiments')}
            className="group studio-glass rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-amber-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-amber-400">
                <Music2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Explore Rudiments <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                40 Rudiments Sticking Vault
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Single Stroke Rolls, Paradiddles, Flams, and Drags. Includes animated Right/Left hand color-coded sticking, speed challenges, and practice audio loops.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span>Visual R/L Sticking Guides</span>
              <span>Tempo Speed-Ups (60-180 BPM)</span>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL STUDIO SPOTLIGHT (Image cards showcasing instruments) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 h-72">
            <img
              src={snareCloseupImg}
              alt="Artisan Snare Drum"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent p-6 flex flex-col justify-end">
              <h4 className="font-display text-lg font-bold text-white mb-1">Snare Dynamics</h4>
              <p className="text-xs text-neutral-300">
                Master the delicate touch between 2-inch ghost notes and loud cracking backbeats on beats 2 & 4.
              </p>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 h-72">
            <img
              src={cymbalCloseupImg}
              alt="Hand-hammered Bronze Cymbal"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent p-6 flex flex-col justify-end">
              <h4 className="font-display text-lg font-bold text-white mb-1">Cymbal Articulation</h4>
              <p className="text-xs text-neutral-300">
                Explore hi-hat sizzles, crash accents on downbeats, and the bell ping of heavy ride cymbals.
              </p>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 h-72">
            <img
              src={studioPracticeImg}
              alt="Drum Practice Studio"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent p-6 flex flex-col justify-end">
              <h4 className="font-display text-lg font-bold text-white mb-1">Daily Discipline</h4>
              <p className="text-xs text-neutral-300">
                Log your practice sessions, keep your streak alive, and watch your BPM thresholds climb.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE INVITATION BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="studio-glass rounded-2xl p-8 sm:p-10 border border-amber-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Ready for your daily session?
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Start with the Foundational 4/4 Groove
            </h3>
            <p className="text-sm text-neutral-300 max-w-xl">
              Lock in your hi-hat, kick, and snare at 80 BPM. 15 minutes of focused practice builds muscle memory that lasts a lifetime.
            </p>
          </div>

          <button
            onClick={() => onNavigate('lessons')}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-neutral-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
          >
            <BookOpen className="h-4 w-4" />
            <span>Start Practice Lesson</span>
          </button>
        </div>
      </section>
    </div>
  );
};
