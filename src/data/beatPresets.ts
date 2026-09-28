import { BeatPattern, DrumPad } from '../types.ts';

export const BEAT_PRESETS: BeatPattern[] = [
  {
    name: 'Classic 4/4 Rock',
    bpm: 100,
    description: 'The standard rock groove with 8th-note hi-hats, punchy kick on 1 & 3, and snare backbeat on 2 & 4.',
    tracks: {
      kick:      [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      snare:     [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      closedHat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      openHat:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      highTom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      crash:     [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    }
  },
  {
    name: 'Syncopated Funk Break',
    bpm: 94,
    description: 'Off-beat syncopated kick hits with quick open hi-hat barking on the off-beats.',
    tracks: {
      kick:      [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
      snare:     [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      closedHat: [true, false, true, false, true, false, true, false, true, false, true, false, false, false, true, false],
      openHat:   [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
      highTom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      crash:     [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    }
  },
  {
    name: 'Four On The Floor',
    bpm: 120,
    description: 'Driving disco / house groove with steady kick on every quarter note and open hi-hat on every upbeat.',
    tracks: {
      kick:      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      snare:     [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      closedHat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      openHat:   [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      highTom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      crash:     [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    }
  },
  {
    name: 'Half-Time Trap Pocket',
    bpm: 140,
    description: 'Slow, heavy half-time snare on beat 3 with rapid 16th-note hi-hat rolling patterns.',
    tracks: {
      kick:      [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
      snare:     [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      closedHat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      openHat:   [false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false],
      highTom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      crash:     [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    }
  },
  {
    name: 'Rock Fill Ending',
    bpm: 105,
    description: 'Groove leading into a thunderous high-tom and floor-tom cascade finish.',
    tracks: {
      kick:      [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      snare:     [false, false, false, false, true, false, false, false, false, false, true, true, false, false, false, false],
      closedHat: [true, false, true, false, true, false, true, false, false, false, false, false, false, false, false, false],
      openHat:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      highTom:   [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false],
      crash:     [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false],
    }
  }
];

export const DRUM_PADS: DrumPad[] = [
  { id: 'kick', name: 'Bass Drum / Kick', shortName: 'KICK', key: 'Space', color: 'from-amber-600 to-orange-700', type: 'kick', position: { x: 50, y: 72 }, size: 92 },
  { id: 'snare', name: 'Artisan Snare', shortName: 'SNARE', key: 'S', color: 'from-zinc-200 to-zinc-400 text-neutral-950', type: 'snare', position: { x: 34, y: 55 }, size: 78 },
  { id: 'hihatClosed', name: 'Closed Hi-Hat', shortName: 'HH CLOSED', key: 'D', color: 'from-amber-400 to-yellow-600 text-neutral-950', type: 'hihatClosed', position: { x: 20, y: 46 }, size: 68 },
  { id: 'hihatOpen', name: 'Open Hi-Hat', shortName: 'HH OPEN', key: 'F', color: 'from-yellow-400 to-amber-500 text-neutral-950', type: 'hihatOpen', position: { x: 16, y: 32 }, size: 70 },
  { id: 'highTom', name: 'Rack High Tom', shortName: 'HIGH TOM', key: 'E', color: 'from-neutral-700 to-neutral-800', type: 'highTom', position: { x: 42, y: 34 }, size: 70 },
  { id: 'floorTom', name: 'Deep Floor Tom', shortName: 'FLOOR TOM', key: 'G', color: 'from-neutral-700 to-neutral-800', type: 'floorTom', position: { x: 67, y: 56 }, size: 82 },
  { id: 'crash', name: '18" Crash Cymbal', shortName: 'CRASH', key: 'J', color: 'from-amber-400 to-yellow-500 text-neutral-950', type: 'crash', position: { x: 28, y: 18 }, size: 85 },
  { id: 'ride', name: '21" Sweet Ride', shortName: 'RIDE', key: 'K', color: 'from-amber-300 to-amber-600 text-neutral-950', type: 'ride', position: { x: 74, y: 26 }, size: 88 },
  { id: 'rimshot', name: 'Snare Rimshot', shortName: 'RIMSHOT', key: 'R', color: 'from-stone-600 to-stone-700', type: 'rimshot', position: { x: 50, y: 40 }, size: 60 },
];
