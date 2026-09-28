export type PageId = 'home' | 'lessons' | 'kit' | 'beat-studio' | 'rudiments' | 'tracker';

export interface Lesson {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  keyTakeaway: string;
  recommendedBpm: number;
  targetBpm: number;
  sticking: string[];
  pattern: {
    kick: boolean[];
    snare: boolean[];
    hihat: boolean[];
    toms?: boolean[];
  };
  tips: string[];
  sheetNotationText: string;
}

export interface Rudiment {
  id: string;
  name: string;
  category: 'Rolls' | 'Diddles' | 'Flams' | 'Drags';
  stickingSequence: ('R' | 'L')[];
  accents: boolean[]; // whether the note is accented
  description: string;
  practiceTip: string;
  suggestedTempo: { min: number; max: number };
}

export interface PracticeSession {
  id: string;
  date: string;
  durationMinutes: number;
  focusArea: string;
  bpm: number;
  notes: string;
  rating: number; // 1-5
}

export interface BeatPattern {
  name: string;
  bpm: number;
  description: string;
  tracks: {
    kick: boolean[];
    snare: boolean[];
    closedHat: boolean[];
    openHat: boolean[];
    highTom: boolean[];
    crash: boolean[];
  };
}

export interface DrumPad {
  id: string;
  name: string;
  shortName: string;
  key: string;
  color: string;
  type: 'kick' | 'snare' | 'hihatClosed' | 'hihatOpen' | 'highTom' | 'floorTom' | 'crash' | 'ride' | 'rimshot';
  position: { x: number; y: number }; // percentage on acoustic kit visual
  size: number;
}
