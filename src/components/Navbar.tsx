import React, { useState } from 'react';
import { PageId } from '../types.ts';
import { Volume2, VolumeX, Menu, X, Play } from 'lucide-react';
import { drumAudio } from '../audio/drumSoundEngine.ts';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isMuted, setIsMuted] = useState(drumAudio.isSoundMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const muted = drumAudio.toggleMute();
    setIsMuted(muted);
  };

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'lessons', label: 'Lessons' },
    { id: 'kit', label: 'Drum Kit' },
    { id: 'beat-studio', label: 'Beat Studio' },
    { id: 'rudiments', label: 'Rudiments' },
    { id: 'tracker', label: 'Progress' },
  ];

  const handleLinkClick = (id: PageId) => {
    drumAudio.ensureUnlocked();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="group flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
            MENDEL DRUMZ
          </span>
          <span className="text-lg" aria-hidden="true">🥁</span>
        </button>

        {/* Zone 2: 4–6 nav links, 1–2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative whitespace-nowrap py-1 transition-colors ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
          </button>

          <button
            onClick={() => handleLinkClick('kit')}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 shadow-md shadow-amber-500/10 hover:bg-amber-400 transition-all active:scale-98 whitespace-nowrap"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Play Kit</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-neutral-900 text-neutral-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950/95 px-4 pt-2 pb-4 backdrop-blur-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                </button>
              );
            })}
            <div className="pt-2">
              <button
                onClick={() => handleLinkClick('kit')}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Launch Interactive Drum Kit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
