/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, PracticeSession } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LessonsPage } from './pages/LessonsPage.tsx';
import { DrumKitPage } from './pages/DrumKitPage.tsx';
import { BeatStudioPage } from './pages/BeatStudioPage.tsx';
import { RudimentsPage } from './pages/RudimentsPage.tsx';
import { TrackerPage } from './pages/TrackerPage.tsx';
import { drumAudio } from './audio/drumSoundEngine.ts';

// Pre-seeded initial practice sessions
const INITIAL_SESSIONS: PracticeSession[] = [
  {
    id: 'session-1',
    date: 'Sep 26, 2026',
    durationMinutes: 30,
    focusArea: 'The Foundational 4/4 Rock Groove',
    bpm: 85,
    rating: 5,
    notes: 'Locked into the pocket with the hi-hat 8th notes. Kick and snare alignment felt very solid.',
  },
  {
    id: 'session-2',
    date: 'Sep 27, 2026',
    durationMinutes: 25,
    focusArea: 'Single Paradiddle Sticking Drills',
    bpm: 105,
    rating: 4,
    notes: 'Worked on accenting the downbeats while keeping internal diddles light and relaxed.',
  },
  {
    id: 'session-3',
    date: 'Sep 28, 2026',
    durationMinutes: 35,
    focusArea: 'Syncopated Bass Drum & Hi-Hat Barks',
    bpm: 90,
    rating: 5,
    notes: 'The open hi-hat on the & of 4 is sounding crisp. Practicing pedal foot release timing.',
  },
];

const INITIAL_GOALS = [
  { id: 'g-1', text: 'Reach clean 120 BPM on Single Paradiddles with accents', completed: false },
  { id: 'g-2', text: 'Master 4/4 Rock Groove with syncopated bass drum on beat 3', completed: true },
  { id: 'g-3', text: 'Play 3-minute continuous Double Stroke Roll endurance drill', completed: false },
  { id: 'g-4', text: 'Achieve >85% accuracy in the Rhythm Timing Game at 100 BPM', completed: true },
  { id: 'g-5', text: 'Complete Level 1 & Level 2 Drum Lessons Curriculum', completed: false },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  // Completed Lessons State
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mendel_drumz_completed_lessons');
      return saved ? JSON.parse(saved) : ['lesson-1-grip-posture'];
    } catch {
      return ['lesson-1-grip-posture'];
    }
  });

  // Mastered Rudiments State
  const [masteredRudiments, setMasteredRudiments] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mendel_drumz_mastered_rudiments');
      return saved ? JSON.parse(saved) : ['single-stroke-roll'];
    } catch {
      return ['single-stroke-roll'];
    }
  });

  // Practice Sessions State
  const [sessions, setSessions] = useState<PracticeSession[]>(() => {
    try {
      const saved = localStorage.getItem('mendel_drumz_sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  // Goals State
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('mendel_drumz_goals');
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  // Streak state
  const [streakDays, setStreakDays] = useState<number>(5);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('mendel_drumz_completed_lessons', JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem('mendel_drumz_mastered_rudiments', JSON.stringify(masteredRudiments));
  }, [masteredRudiments]);

  useEffect(() => {
    localStorage.setItem('mendel_drumz_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('mendel_drumz_goals', JSON.stringify(goals));
  }, [goals]);

  // Audio Context unlock on first user interaction anywhere
  useEffect(() => {
    const handleFirstInteraction = () => {
      drumAudio.ensureUnlocked();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Handlers
  const handleToggleLessonComplete = (id: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleMastered = (id: string) => {
    setMasteredRudiments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddSession = (newSessionData: Omit<PracticeSession, 'id'>) => {
    const newSession: PracticeSession = {
      ...newSessionData,
      id: `session-${Date.now()}`,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleGoal = (id: string) => {
    setGoals((prev: typeof INITIAL_GOALS) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleAddGoal = (text: string) => {
    setGoals((prev: typeof INITIAL_GOALS) => [
      ...prev,
      { id: `goal-${Date.now()}`, text, completed: false },
    ]);
  };

  // Scroll to top on page switch
  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPracticeMinutes = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0c] text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            streakDays={streakDays}
            completedLessonsCount={completedLessonIds.length}
            totalPracticeMinutes={totalPracticeMinutes}
          />
        )}

        {currentPage === 'lessons' && (
          <LessonsPage
            completedLessonIds={completedLessonIds}
            onToggleLessonComplete={handleToggleLessonComplete}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'kit' && <DrumKitPage />}

        {currentPage === 'beat-studio' && <BeatStudioPage />}

        {currentPage === 'rudiments' && (
          <RudimentsPage
            masteredRudiments={masteredRudiments}
            onToggleMastered={handleToggleMastered}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'tracker' && (
          <TrackerPage
            streakDays={streakDays}
            totalPracticeMinutes={totalPracticeMinutes}
            completedLessonsCount={completedLessonIds.length}
            masteredRudimentsCount={masteredRudiments.length}
            sessions={sessions}
            onAddSession={handleAddSession}
            onDeleteSession={handleDeleteSession}
            goals={goals}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
