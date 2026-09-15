import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface LogoIntroAnimationProps {
  onComplete: () => void;
}

export const LogoIntroAnimation: React.FC<LogoIntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'drawing' | 'blooming' | 'illuminated' | 'exiting'>('drawing');
  const [isMuted, setIsMuted] = useState(soundFx.isMuted);

  useEffect(() => {
    // Sound chime on load
    const soundTimer = setTimeout(() => {
      soundFx.playArrivalChime();
    }, 400);

    // Timeline of royal logo unfold
    const bloomTimer = setTimeout(() => {
      setPhase('blooming');
    }, 800);

    const illuminatedTimer = setTimeout(() => {
      setPhase('illuminated');
    }, 1700);

    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 2800);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(bloomTimer);
      clearTimeout(illuminatedTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    setIsMuted(next);
    soundFx.isMuted = next;
  };

  const handleSkip = () => {
    setPhase('exiting');
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#090807] text-white transition-opacity duration-700 select-none overflow-hidden ${
        phase === 'exiting' ? 'opacity-0 pointer-events-none scale-105 transition-all duration-700' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Aura Voyages India Royal Logo Reveal"
    >
      {/* Ambient background golden radiance & stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gradient-radial from-amber-500/20 via-amber-900/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-2xl" />
        
        {/* Floating golden stardust particles */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-amber-300 rounded-full animate-ping" />
          <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-ping" />
          <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Centerpiece Logo Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center">
        
        {/* Sacred Geometry Lotus & Sunburst Emblem */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
          
          {/* Outer Celestial Ring with Rotating Filigree */}
          <svg
            viewBox="0 0 200 200"
            className={`absolute inset-0 w-full h-full text-amber-500 transition-all duration-1000 ${
              phase === 'drawing' ? 'scale-75 opacity-40 rotate-[-45deg]' : 'scale-100 opacity-90 rotate-0'
            }`}
            style={{ animation: 'spin 32s linear infinite' }}
          >
            {/* Outer dotted orbit */}
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 4"
              className="opacity-60"
            />
            {/* Fine outer ring */}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="opacity-80"
            />
            {/* 16 Radial Sunburst rays */}
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="12"
                x2="100"
                y2="2"
                stroke="currentColor"
                strokeWidth="1.5"
                transform={`rotate(${i * 22.5} 100 100)`}
                className="opacity-75"
              />
            ))}
          </svg>

          {/* Inner Blooming Lotus & Mandala Crest */}
          <svg
            viewBox="0 0 200 200"
            className={`relative z-10 w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all duration-1000 ease-out ${
              phase === 'drawing'
                ? 'scale-50 opacity-0 rotate-45'
                : phase === 'blooming'
                ? 'scale-100 opacity-90 rotate-0'
                : 'scale-105 opacity-100 rotate-0'
            }`}
          >
            <defs>
              <linearGradient id="royalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <linearGradient id="coreAura" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Sacred 8-Petal Royal Lotus */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 45} 100 100)`}>
                {/* Outer Petal Arch */}
                <path
                  d="M100 32 C92 56 86 76 100 95 C114 76 108 56 100 32 Z"
                  fill="url(#royalGoldGrad)"
                  fillOpacity="0.85"
                  stroke="#fef08a"
                  strokeWidth="0.8"
                  className="transition-transform duration-700"
                />
                {/* Inner fine gold filigree rib */}
                <line
                  x1="100"
                  y1="40"
                  x2="100"
                  y2="90"
                  stroke="#fffbeb"
                  strokeWidth="0.6"
                  opacity="0.9"
                />
              </g>
            ))}

            {/* Inner Ring with Sacred Geometric Knot */}
            <circle
              cx="100"
              cy="100"
              r="34"
              fill="none"
              stroke="url(#royalGoldGrad)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <circle
              cx="100"
              cy="100"
              r="26"
              fill="#1c1917"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />

            {/* Center Sacred Royal Diamond / Bindu */}
            <polygon
              points="100,82 114,100 100,118 86,100"
              fill="url(#coreAura)"
              filter="url(#goldGlow)"
            />
            {/* Center radiant diamond highlight */}
            <circle cx="100" cy="100" r="3.5" fill="#ffffff" />
          </svg>

          {/* Central Pulsing Halo */}
          <div className="absolute w-20 h-20 bg-amber-400/30 rounded-full blur-xl animate-pulse pointer-events-none" />
        </div>

        {/* Royal Crest Title & Typography Reveal */}
        <div className="space-y-3 overflow-hidden">
          
          {/* Ornamental Indian Motif Bar */}
          <div
            className={`flex items-center justify-center gap-3 transition-all duration-700 ${
              phase === 'drawing' ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-amber-500" />
            <div className="flex items-center gap-1.5 text-amber-400 font-serif text-[11px] tracking-[0.3em] uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>BHARAT • INDIA</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-amber-500" />
          </div>

          {/* Brand Name with expanding tracking */}
          <h1
            className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.22em] sm:tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 transition-all duration-1000 ${
              phase === 'drawing'
                ? 'opacity-0 tracking-normal scale-95'
                : 'opacity-100 scale-100'
            }`}
          >
            AURA VOYAGES
          </h1>

          {/* Brand Subtitle */}
          <p
            className={`text-xs sm:text-sm font-sans tracking-[0.25em] text-stone-300 uppercase transition-all duration-1000 delay-300 ${
              phase === 'drawing' || phase === 'blooming'
                ? 'opacity-0 translate-y-2'
                : 'opacity-100 translate-y-0'
            }`}
          >
            Curators of Bespoke Royal Expeditions
          </p>

          {/* Golden expanding divider line */}
          <div className="pt-2 flex justify-center">
            <div
              className={`h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-all duration-1000 ${
                phase === 'illuminated' || phase === 'exiting' ? 'w-48 sm:w-64' : 'w-0'
              }`}
            />
          </div>
        </div>

        {/* Enter / Skip Controls */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSkip}
            className="group px-6 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/20"
          >
            <span>Enter Sanctuary</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </button>

          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-amber-400 text-xs transition-colors cursor-pointer"
            title={isMuted ? 'Sound is muted' : 'Sound is active'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Subtle timer hint */}
        <div className="mt-4 text-[10px] text-stone-500 tracking-widest uppercase">
          Unfolding Incredible India...
        </div>
      </div>
    </div>
  );
};
