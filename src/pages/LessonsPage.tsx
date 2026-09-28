import React, { useState, useEffect, useRef } from 'react';
import { LESSONS } from '../data/lessonsData.ts';
import { Lesson, PageId } from '../types.ts';
import { drumAudio } from '../audio/drumSoundEngine.ts';
import { 
  Play, 
  Square, 
  CheckCircle2, 
  Circle, 
  Sliders, 
  Clock, 
  Target, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Volume2
} from 'lucide-react';

interface LessonsPageProps {
  completedLessonIds: string[];
  onToggleLessonComplete: (id: string) => void;
  onNavigate: (page: PageId) => void;
}

export const LessonsPage: React.FC<LessonsPageProps> = ({
  completedLessonIds,
  onToggleLessonComplete,
  onNavigate,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [activeLesson, setActiveLesson] = useState<Lesson>(LESSONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [tempo, setTempo] = useState<number>(LESSONS[0].recommendedBpm);

  // Playback timer ref
  const timerRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(0);

  // Filter lessons
  const filteredLessons = LESSONS.filter(
    (l) => selectedLevel === 'All' || l.level === selectedLevel
  );

  // Reset tempo when changing active lesson
  const handleSelectLesson = (lesson: Lesson) => {
    stopLessonAudio();
    setActiveLesson(lesson);
    setTempo(lesson.recommendedBpm);
  };

  const stopLessonAudio = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    currentStepRef.current = 0;
  };

  const startLessonAudio = () => {
    drumAudio.ensureUnlocked();
    stopLessonAudio();
    setIsPlaying(true);

    const stepIntervalMs = (60 / tempo / 4) * 1000; // 16th note timing

    timerRef.current = window.setInterval(() => {
      const step = currentStepRef.current;

      // Trigger audio based on lesson pattern
      if (activeLesson.pattern.kick[step]) {
        drumAudio.playKick();
      }
      if (activeLesson.pattern.snare[step]) {
        drumAudio.playSnare();
      }
      if (activeLesson.pattern.hihat[step]) {
        // If last step or special open hat notation
        if (activeLesson.id === 'lesson-4-hihat-openings' && step === 15) {
          drumAudio.playOpenHat();
        } else {
          drumAudio.playClosedHat();
        }
      }
      if (activeLesson.pattern.toms && activeLesson.pattern.toms[step]) {
        if (step > 11) {
          drumAudio.playFloorTom();
        } else {
          drumAudio.playHighTom();
        }
      }

      setCurrentStep(step);
      currentStepRef.current = (step + 1) % 16;
    }, stepIntervalMs);
  };

  // Re-sync interval if tempo changes while playing
  useEffect(() => {
    if (isPlaying) {
      startLessonAudio();
    }
  }, [tempo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const isCompleted = completedLessonIds.includes(activeLesson.id);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Structured Drum Curriculum</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Drum Lessons & Masterclasses
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Systematic training from first stick fulcrum grip to advanced funk syncopation. Listen to the beats at custom tempos and practice along.
          </p>
        </div>

        {/* Level Filter Buttons */}
        <div className="flex items-center gap-1 bg-neutral-900/90 border border-white/10 p-1 rounded-xl">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedLevel === lvl
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Zone Layout: Left List, Right Active Lesson Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lesson Directory */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 px-1">
            <span>Lesson Plan ({filteredLessons.length} Modules)</span>
            <span>{completedLessonIds.length} Completed</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredLessons.map((lesson, index) => {
              const isSelected = activeLesson.id === lesson.id;
              const completed = completedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`group studio-glass rounded-xl p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-neutral-900/95 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'border-white/5 hover:border-white/20 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-400 font-semibold">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <h3 className={`text-sm font-bold tracking-tight ${
                        isSelected ? 'text-white' : 'text-neutral-200 group-hover:text-white'
                      }`}>
                        {lesson.title}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLessonComplete(lesson.id);
                      }}
                      className="text-neutral-400 hover:text-amber-400 transition-colors p-1"
                      title={completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                    {lesson.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className={`font-semibold ${
                      lesson.level === 'Beginner'
                        ? 'text-emerald-400'
                        : lesson.level === 'Intermediate'
                        ? 'text-amber-400'
                        : 'text-orange-400'
                    }`}>
                      {lesson.level}
                    </span>
                    <span>·</span>
                    <span className="tabular-nums">{lesson.durationMinutes} mins</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{lesson.recommendedBpm} BPM</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Interactive Lesson Stage */}
        <div className="lg:col-span-7">
          <div className="studio-glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
                  <span className="font-semibold text-amber-400 uppercase tracking-wider">{activeLesson.level} Level</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activeLesson.durationMinutes} min practice goal
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {activeLesson.title}
                </h2>
              </div>

              <button
                onClick={() => onToggleLessonComplete(activeLesson.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white border border-white/10'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Circle className="h-4 w-4" />}
                <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
              </button>
            </div>

            {/* Description & Key Takeaway */}
            <div className="space-y-3">
              <p className="text-sm text-neutral-300 leading-relaxed">
                {activeLesson.description}
              </p>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <span className="font-bold text-amber-400">Key Takeaway: </span>
                {activeLesson.keyTakeaway}
              </div>
            </div>

            {/* INTERACTIVE AUDIO PLAYER & STEP SEQUENCER VISUALIZER */}
            <div className="bg-neutral-900/90 rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={isPlaying ? stopLessonAudio : startLessonAudio}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                  >
                    {isPlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                    <span>{isPlaying ? 'Pause Audio' : 'Listen to Groove'}</span>
                  </button>
                  <span className="text-xs text-neutral-400">
                    {isPlaying ? 'Playing in sync...' : 'Hear how this beat sounds'}
                  </span>
                </div>

                {/* Tempo Slider */}
                <div className="flex items-center gap-3 bg-neutral-950 border border-white/10 px-3.5 py-1.5 rounded-xl">
                  <span className="text-xs text-neutral-400 font-mono">BPM:</span>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="w-24 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-amber-400 font-mono tabular-nums w-8">
                    {tempo}
                  </span>
                </div>
              </div>

              {/* Step Sequencer Visualization Grid */}
              <div className="pt-2">
                <div className="text-[11px] font-mono text-neutral-400 mb-2 flex items-center justify-between">
                  <span>RHYTHM GRID (16 STEPS / 4 BEATS)</span>
                  <span>Beat 1 · Beat 2 · Beat 3 · Beat 4</span>
                </div>

                {/* 16 Steps Timeline Grid */}
                <div className="space-y-1.5 font-mono text-xs">
                  {/* Hi-Hat Track */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-[10px] text-neutral-400 font-medium">HI-HAT</span>
                    <div className="grid grid-cols-16 gap-1 flex-1">
                      {activeLesson.pattern.hihat.map((active, idx) => (
                        <div
                          key={`hh-${idx}`}
                          className={`h-6 rounded flex items-center justify-center text-[9px] border transition-all ${
                            active
                              ? isPlaying && currentStep === idx
                                ? 'bg-amber-400 text-neutral-950 font-bold border-amber-300 scale-105'
                                : 'bg-amber-500/30 text-amber-300 border-amber-500/40'
                              : 'bg-neutral-950 border-white/5 text-neutral-700'
                          } ${isPlaying && currentStep === idx ? 'ring-2 ring-white' : ''}`}
                        >
                          {active ? 'x' : '·'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Snare Track */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-[10px] text-neutral-400 font-medium">SNARE</span>
                    <div className="grid grid-cols-16 gap-1 flex-1">
                      {activeLesson.pattern.snare.map((active, idx) => (
                        <div
                          key={`sn-${idx}`}
                          className={`h-6 rounded flex items-center justify-center text-[9px] border transition-all ${
                            active
                              ? isPlaying && currentStep === idx
                                ? 'bg-white text-neutral-950 font-bold border-white scale-105'
                                : 'bg-neutral-200/30 text-neutral-200 border-white/30'
                              : 'bg-neutral-950 border-white/5 text-neutral-700'
                          } ${isPlaying && currentStep === idx ? 'ring-2 ring-white' : ''}`}
                        >
                          {active ? 'O' : '·'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kick Track */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-[10px] text-neutral-400 font-medium">KICK</span>
                    <div className="grid grid-cols-16 gap-1 flex-1">
                      {activeLesson.pattern.kick.map((active, idx) => (
                        <div
                          key={`bd-${idx}`}
                          className={`h-6 rounded flex items-center justify-center text-[9px] border transition-all ${
                            active
                              ? isPlaying && currentStep === idx
                                ? 'bg-orange-500 text-neutral-950 font-bold border-orange-400 scale-105'
                                : 'bg-orange-500/30 text-orange-300 border-orange-500/40'
                              : 'bg-neutral-950 border-white/5 text-neutral-700'
                          } ${isPlaying && currentStep === idx ? 'ring-2 ring-white' : ''}`}
                        >
                          {active ? '●' : '·'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Beat marker ticks */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-12 text-[10px] text-neutral-400">BEAT</span>
                  <div className="grid grid-cols-4 gap-1 flex-1 text-center font-mono text-[10px] text-neutral-400">
                    <div className="border-t border-white/10 pt-1">Beat 1</div>
                    <div className="border-t border-white/10 pt-1">Beat 2</div>
                    <div className="border-t border-white/10 pt-1">Beat 3</div>
                    <div className="border-t border-white/10 pt-1">Beat 4</div>
                  </div>
                </div>
              </div>

              {/* Simplified Sheet Notation Summary */}
              <div className="pt-2 text-xs font-mono text-neutral-300 bg-neutral-950/80 p-2.5 rounded-lg border border-white/5">
                <span className="text-amber-400 font-semibold">Notation Guide: </span>
                {activeLesson.sheetNotationText}
              </div>
            </div>

            {/* Practical Sticking Breakdown & Tips */}
            <div className="space-y-4">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Coach's Practice Guide & Drills</span>
              </h3>

              <div className="space-y-2">
                {activeLesson.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <span className="h-5 w-5 rounded bg-neutral-800 text-amber-400 font-mono flex items-center justify-center shrink-0 text-[10px] font-bold border border-white/5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Launch to Virtual Kit Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Ready to play it on the drum pads?
              </span>
              <button
                onClick={() => {
                  stopLessonAudio();
                  onNavigate('kit');
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Open Virtual Drum Kit</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
