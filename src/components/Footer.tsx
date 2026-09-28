import React from 'react';
import { PageId } from '../types.ts';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/5 bg-neutral-950 py-12 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-white">MENDEL DRUMZ</span>
              <span className="text-base">🥁</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-md">
              “Learn. Practice. Play. Master the Rhythm.” A modern, dedicated drumming platform tailored for rhythm mastery, stick control, and acoustic groove development.
            </p>
            <p className="text-xs text-neutral-400 italic">
              “Time is everything. If you don’t have good time, nothing else matters.” — Steve Gadd
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">Studio Modules</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('lessons')} className="hover:text-amber-400 transition-colors">
                  Structured Lessons
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kit')} className="hover:text-amber-400 transition-colors">
                  Virtual Acoustic Kit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('beat-studio')} className="hover:text-amber-400 transition-colors">
                  Beat Sequencer & Metronome
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rudiments')} className="hover:text-amber-400 transition-colors">
                  40 Rudiments Vault
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">Student Hub</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('tracker')} className="hover:text-amber-400 transition-colors">
                  Practice Tracker & Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('beat-studio')} className="hover:text-amber-400 transition-colors">
                  Rhythm Accuracy Trainer
                </button>
              </li>
              <li>
                <span className="text-xs text-neutral-400">Audio: Web Audio API (Low Latency)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} MENDEL DRUMZ. Engineered for drummers who love the groove.</p>
          <div className="flex items-center gap-6">
            <span>Bass Drum · Snare · Cymbals · Rudiments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
