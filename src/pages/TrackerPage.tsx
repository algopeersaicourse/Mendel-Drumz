import React, { useState } from 'react';
import { PracticeSession } from '../types.ts';
import { 
  Flame, 
  Award, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Star, 
  Trash2, 
  Target, 
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface TrackerPageProps {
  streakDays: number;
  totalPracticeMinutes: number;
  completedLessonsCount: number;
  masteredRudimentsCount: number;
  sessions: PracticeSession[];
  onAddSession: (session: Omit<PracticeSession, 'id'>) => void;
  onDeleteSession: (id: string) => void;
  goals: { id: string; text: string; completed: boolean }[];
  onToggleGoal: (id: string) => void;
  onAddGoal: (text: string) => void;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({
  streakDays,
  totalPracticeMinutes,
  completedLessonsCount,
  masteredRudimentsCount,
  sessions,
  onAddSession,
  onDeleteSession,
  goals,
  onToggleGoal,
  onAddGoal,
}) => {
  // Modal / Form state for logging a session
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [focusArea, setFocusArea] = useState<string>('4/4 Rock Groove & Hi-Hat Independence');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [bpm, setBpm] = useState<number>(95);
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('Locked into the pocket on beats 2 and 4. Right wrist felt relaxed.');

  // Goal input state
  const [newGoalText, setNewGoalText] = useState<string>('');

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSession({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      focusArea,
      durationMinutes: Number(durationMinutes),
      bpm: Number(bpm),
      rating,
      notes,
    });
    setShowLogModal(false);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalText.trim()) {
      onAddGoal(newGoalText.trim());
      setNewGoalText('');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Target className="h-4 w-4" />
            <span>Personal Development & Journal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Drum Practice Tracker
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Monitor your daily streak, log metronome milestones, track completed masterclasses, and reflect on every session behind the kit.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>Log Practice Session</span>
        </button>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="studio-glass rounded-xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">Current Streak</div>
            <div className="text-3xl font-display font-bold text-white mt-1 tabular-nums">
              {streakDays} <span className="text-sm font-normal text-amber-400">Days</span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Consecutive practice days</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="h-5 w-5" />
          </div>
        </div>

        <div className="studio-glass rounded-xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">Total Practice</div>
            <div className="text-3xl font-display font-bold text-white mt-1 tabular-nums">
              {totalPracticeMinutes} <span className="text-sm font-normal text-neutral-400">Mins</span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Time logged behind kit</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="studio-glass rounded-xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">Curriculum Progress</div>
            <div className="text-3xl font-display font-bold text-white mt-1 tabular-nums">
              {Math.round((completedLessonsCount / 8) * 100)}%
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">{completedLessonsCount} / 8 Lessons Complete</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="studio-glass rounded-xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">Rudiments Mastered</div>
            <div className="text-3xl font-display font-bold text-white mt-1 tabular-nums">
              {masteredRudimentsCount} <span className="text-sm font-normal text-neutral-400">/ 12</span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">PAS standard sticking</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: GOALS & PRACTICE TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal Goals Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="studio-glass rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-400" />
                <span>Drumming Goals & Milestones</span>
              </h2>
              <span className="text-xs text-neutral-400">
                {goals.filter((g) => g.completed).length}/{goals.length}
              </span>
            </div>

            {/* Goals list */}
            <div className="space-y-2.5">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => onToggleGoal(goal.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    goal.completed
                      ? 'bg-neutral-900/40 border-white/5 text-neutral-400 line-through'
                      : 'bg-neutral-900/80 border-white/10 text-neutral-200 hover:border-amber-400/40'
                  }`}
                >
                  <button className="text-amber-400 mt-0.5">
                    {goal.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-neutral-400" />
                    )}
                  </button>
                  <span className="text-xs font-medium leading-relaxed">{goal.text}</span>
                </div>
              ))}
            </div>

            {/* Add Goal Input */}
            <form onSubmit={handleAddGoalSubmit} className="flex items-center gap-2 pt-2 border-t border-white/5">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Add custom goal (e.g. 130 BPM paradiddle)..."
                className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-neutral-800 text-amber-400 hover:bg-neutral-700 text-xs font-semibold border border-white/10 transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Practice Session Log Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="studio-glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span>Practice Journal History</span>
              </h2>
              <span className="text-xs text-neutral-400">
                {sessions.length} Sessions Logged
              </span>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 space-y-3">
                <Clock className="h-8 w-8 mx-auto opacity-40 text-amber-400" />
                <p className="text-sm">No practice sessions logged yet.</p>
                <button
                  onClick={() => setShowLogModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Log your first session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl bg-neutral-900/80 border border-white/10 hover:border-white/20 transition-all space-y-2 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                          <span className="font-mono text-amber-400 font-semibold">{session.date}</span>
                          <span>·</span>
                          <span className="tabular-nums">{session.durationMinutes} mins</span>
                          <span>·</span>
                          <span className="font-mono text-neutral-300">{session.bpm} BPM</span>
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {session.focusArea}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: session.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>

                        {/* Delete Session */}
                        <button
                          onClick={() => onDeleteSession(session.id)}
                          className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-400 transition-opacity p-1"
                          title="Delete Entry"
                          aria-label="Delete practice session entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {session.notes && (
                      <p className="text-xs text-neutral-300 italic pt-1 border-t border-white/5">
                        “{session.notes}”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOG PRACTICE SESSION MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="studio-glass rounded-2xl p-6 sm:p-8 border border-white/15 max-w-lg w-full shadow-2xl relative">
            <h3 className="font-display text-xl font-bold text-white mb-4">
              Log Drum Practice Session
            </h3>

            <form onSubmit={handleSubmitSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Focus Area / Exercise
                </label>
                <input
                  type="text"
                  required
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. 4/4 Rock Groove or Single Paradiddles"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Metronome BPM Reached
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="240"
                    required
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Session Feel & Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-neutral-400 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Personal Practice Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="What clicked today? Any wrist tension or timing observations?"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
