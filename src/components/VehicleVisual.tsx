import React from 'react';
import { VehicleVisualId } from '../types';

interface VehicleVisualProps {
  visualId: VehicleVisualId;
  className?: string;
}

export const VehicleVisual: React.FC<VehicleVisualProps> = ({ visualId, className = 'w-full h-44' }) => {
  switch (visualId) {
    case 'maruti-swift':
      // Sporty Compact Hatchback - Clean white with dark accents, curved roof, C-pillar door handle
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <svg viewBox="0 0 360 160" className="w-full h-full max-h-40 drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ground Shadow */}
            <ellipse cx="180" cy="142" rx="140" ry="8" fill="#d6d3d1" opacity="0.6" />
            
            {/* Swift Body - Sporty Compact Hatchback */}
            {/* Main Body Shell */}
            <path d="M 45 110 L 60 78 L 105 74 L 140 46 L 240 46 L 275 75 L 315 88 L 320 110 L 310 118 L 290 118 C 290 102 260 102 260 118 L 115 118 C 115 102 85 102 85 118 L 48 118 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Floating Black Roof & A-B-C Pillars */}
            <path d="M 136 47 L 242 47 L 273 74 L 106 74 Z" fill="#1E293B" />
            {/* Windows */}
            <path d="M 112 72 L 142 50 L 195 50 L 195 72 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 200 50 L 238 50 L 268 72 L 200 72 Z" fill="#94A3B8" opacity="0.85" />
            
            {/* Swift Sporty Bonnet & Headlight */}
            <path d="M 275 75 L 314 88 L 305 96 L 270 82 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            {/* Front Grill - Honeycomb Style */}
            <rect x="306" y="94" width="13" height="14" rx="2" fill="#0F172A" />
            <line x1="308" y1="101" x2="317" y2="101" stroke="#94A3B8" strokeWidth="1.5" />
            
            {/* Character Shoulder Line */}
            <path d="M 60 78 Q 180 82 275 75" stroke="#CBD5E1" strokeWidth="2" fill="none" />
            <path d="M 52 104 Q 180 106 312 102" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
            
            {/* Rear Taillight */}
            <path d="M 46 86 L 56 86 L 52 100 L 45 98 Z" fill="#EF4444" />

            {/* Wheels */}
            {/* Rear Wheel */}
            <g transform="translate(100, 118)">
              <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="14" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#64748B" strokeWidth="2.5" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#64748B" strokeWidth="2.5" />
            </g>
            {/* Front Wheel */}
            <g transform="translate(275, 118)">
              <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="14" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#64748B" strokeWidth="2.5" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#64748B" strokeWidth="2.5" />
            </g>
            
            {/* Model Badge */}
            <rect x="14" y="14" width="76" height="20" rx="6" fill="#F59E0B" fillOpacity="0.15" />
            <text x="52" y="28" fill="#D97706" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">HATCHBACK</text>
          </svg>
        </div>
      );

    case 'suzuki-dzire':
      // Sub-compact Sedan - Distinct Boot/Trunk, elegant sedan profile, chrome grille
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <svg viewBox="0 0 360 160" className="w-full h-full max-h-40 drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="180" cy="142" rx="145" ry="8" fill="#d6d3d1" opacity="0.6" />
            
            {/* Dzire Sedan Profile: Distinct Boot / Trunk at rear */}
            <path d="M 32 94 L 56 93 L 88 74 L 140 45 L 230 45 L 272 73 L 320 85 L 326 110 L 316 118 L 292 118 C 292 102 262 102 262 118 L 115 118 C 115 102 85 102 85 118 L 36 118 L 30 106 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Sedan Window Frame */}
            <path d="M 94 72 L 140 48 L 190 48 L 190 72 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 195 48 L 226 48 L 264 72 L 195 72 Z" fill="#94A3B8" opacity="0.85" />
            {/* Chrome Window Beltline */}
            <line x1="88" y1="73" x2="268" y2="73" stroke="#CBD5E1" strokeWidth="2.5" />
            
            {/* Dzire Hexagonal Chrome Front Grille */}
            <path d="M 312 88 L 326 94 L 324 106 L 310 102 Z" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Projector Headlamp */}
            <path d="M 272 74 L 318 85 L 310 93 L 268 81 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            
            {/* Distinct Sedan Trunk Lid Crease */}
            <path d="M 32 94 L 58 93 L 86 76" stroke="#94A3B8" strokeWidth="2" fill="none" />
            {/* Dzire Wrap-around Taillight */}
            <path d="M 32 94 L 46 94 L 42 106 L 31 103 Z" fill="#DC2626" />
            
            {/* Wheels */}
            <g transform="translate(100, 118)">
              <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="14" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <path d="M -10 -5 L 10 5 M -10 5 L 10 -5 M 0 -11 L 0 11" stroke="#64748B" strokeWidth="2" />
            </g>
            <g transform="translate(277, 118)">
              <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="14" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <path d="M -10 -5 L 10 5 M -10 5 L 10 -5 M 0 -11 L 0 11" stroke="#64748B" strokeWidth="2" />
            </g>
            
            <rect x="14" y="14" width="56" height="20" rx="6" fill="#F59E0B" fillOpacity="0.15" />
            <text x="42" y="28" fill="#D97706" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">SEDAN</text>
          </svg>
        </div>
      );

    case 'hyundai-aura':
      // Modern Sharp Sedan - Boomerang LED DRLs, coupe-like roofline, stylish rear boot
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <svg viewBox="0 0 360 160" className="w-full h-full max-h-40 drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="180" cy="142" rx="145" ry="8" fill="#d6d3d1" opacity="0.6" />
            
            {/* Hyundai Aura Sculpted Sedan Body */}
            <path d="M 34 92 L 62 90 L 92 72 L 142 44 L 226 44 L 276 72 L 322 84 L 326 110 L 316 118 L 292 118 C 292 102 262 102 262 118 L 115 118 C 115 102 85 102 85 118 L 38 118 L 32 106 Z" fill="#F1F5F9" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Windows with Blacked out C-pillar */}
            <path d="M 98 70 L 142 48 L 188 48 L 188 70 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 193 48 L 222 48 L 268 70 L 193 70 Z" fill="#94A3B8" opacity="0.85" />
            {/* Black C-Pillar Accent (Aura signature) */}
            <path d="M 88 72 L 96 70 L 110 70 L 92 78 Z" fill="#0F172A" />

            {/* Aura Boomerang LED Front DRL & Jewel Grille */}
            <path d="M 314 86 L 326 94 L 324 106 L 308 102 Z" fill="#0F172A" />
            <path d="M 310 90 L 318 94 L 310 98" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 276 72 L 320 84 L 312 92 L 272 80 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            
            {/* Z-shaped 3D Taillight */}
            <path d="M 34 92 L 48 92 L 42 104 L 32 102 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
            
            {/* Wheels */}
            <g transform="translate(100, 118)">
              <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="14" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <polygon points="0,-12 4,-3 12,-3 5,2 8,11 0,6 -8,11 -5,2 -12,-3 -4,-3" fill="#E2E8F0" />
            </g>
            <g transform="translate(277, 118)">
              <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="14" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <polygon points="0,-12 4,-3 12,-3 5,2 8,11 0,6 -8,11 -5,2 -12,-3 -4,-3" fill="#E2E8F0" />
            </g>
            
            <rect x="14" y="14" width="56" height="20" rx="6" fill="#F59E0B" fillOpacity="0.15" />
            <text x="42" y="28" fill="#D97706" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">SEDAN</text>
          </svg>
        </div>
      );

    case 'maruti-fronx':
      // Muscular Crossover / Compact SUV - Higher stance, roof rails, cladding, split LED lights
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <svg viewBox="0 0 360 160" className="w-full h-full max-h-40 drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="180" cy="144" rx="146" ry="8" fill="#d6d3d1" opacity="0.6" />
            
            {/* Roof Rails */}
            <path d="M 130 38 L 225 38" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <line x1="140" y1="38" x2="140" y2="43" stroke="#475569" strokeWidth="2" />
            <line x1="215" y1="38" x2="215" y2="43" stroke="#475569" strokeWidth="2" />

            {/* Fronx Crossover Coupe-SUV Body (Elevated Ground Clearance) */}
            <path d="M 40 102 L 56 74 L 100 70 L 136 43 L 234 43 L 274 70 L 318 80 L 324 105 L 314 116 L 292 116 C 292 98 260 98 260 116 L 115 116 C 115 98 83 98 83 116 L 44 116 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Thick Dark SUV Wheel Cladding & Underbody Skid Guard */}
            <path d="M 78 116 C 78 94 120 94 120 116" stroke="#1E293B" strokeWidth="5" fill="none" />
            <path d="M 255 116 C 255 94 297 94 297 116" stroke="#1E293B" strokeWidth="5" fill="none" />
            <line x1="120" y1="116" x2="255" y2="116" stroke="#1E293B" strokeWidth="4" />
            
            {/* Windows */}
            <path d="M 106 68 L 138 47 L 192 47 L 192 68 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 197 47 L 230 47 L 266 68 L 197 68 Z" fill="#94A3B8" opacity="0.85" />
            
            {/* Fronx Split Headlamps: DRL on top, Tri-LED below */}
            <path d="M 276 70 L 316 79 L 308 83 L 272 75 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="306" y="87" width="12" height="12" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <rect x="312" y="99" width="12" height="8" rx="1" fill="#0F172A" />

            {/* Connecting Tail Light bar */}
            <path d="M 40 82 L 52 82 L 48 94 L 40 92 Z" fill="#DC2626" />
            
            {/* Big Alloy Wheels */}
            <g transform="translate(99, 116)">
              <circle cx="0" cy="0" r="24" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="15" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <path d="M -12 0 L 12 0 M 0 -12 L 0 12 M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#334155" strokeWidth="2" />
            </g>
            <g transform="translate(276, 116)">
              <circle cx="0" cy="0" r="24" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="15" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <path d="M -12 0 L 12 0 M 0 -12 L 0 12 M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#334155" strokeWidth="2" />
            </g>
            
            <rect x="14" y="14" width="76" height="20" rx="6" fill="#F59E0B" fillOpacity="0.15" />
            <text x="52" y="28" fill="#D97706" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">CROSSOVER</text>
          </svg>
        </div>
      );

    case 'maruti-ertiga':
      // 3-Row Family MUV / MPV - Long cabin, 3rd row window, spacious family carrier
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <svg viewBox="0 0 360 160" className="w-full h-full max-h-40 drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="180" cy="144" rx="148" ry="8" fill="#d6d3d1" opacity="0.6" />
            
            {/* Ertiga 3-Row Long MPV Body */}
            <path d="M 32 108 L 36 68 L 78 65 L 128 42 L 244 42 L 278 66 L 322 78 L 326 108 L 316 118 L 292 118 C 292 100 260 100 260 118 L 115 118 C 115 100 83 100 83 118 L 36 118 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* 3 Distinct Passenger Window Sections (Driver, Middle, 3rd Row) */}
            <path d="M 46 66 L 78 66 L 78 46 L 60 52 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 83 66 L 140 66 L 140 45 L 90 45 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 145 66 L 205 66 L 205 45 L 145 45 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 210 66 L 268 66 L 238 45 L 210 45 Z" fill="#94A3B8" opacity="0.85" />
            
            {/* Winged Chrome Front Grille */}
            <path d="M 314 82 L 326 88 L 324 104 L 308 100 Z" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Headlights */}
            <path d="M 276 66 L 320 77 L 312 85 L 272 74 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            
            {/* L-shaped Tall Vertical Taillight */}
            <path d="M 34 68 L 44 68 L 40 96 L 33 94 Z" fill="#DC2626" />
            
            {/* Character Crease Line */}
            <line x1="38" y1="90" x2="316" y2="88" stroke="#E2E8F0" strokeWidth="2" />
            
            {/* Wheels */}
            <g transform="translate(99, 118)">
              <circle cx="0" cy="0" r="23" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="15" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <circle cx="0" cy="0" r="9" stroke="#94A3B8" strokeWidth="2" fill="none" />
            </g>
            <g transform="translate(276, 118)">
              <circle cx="0" cy="0" r="23" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="15" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#0F172A" />
              <circle cx="0" cy="0" r="9" stroke="#94A3B8" strokeWidth="2" fill="none" />
            </g>
            
            <rect x="14" y="14" width="76" height="20" rx="6" fill="#F59E0B" fillOpacity="0.15" />
            <text x="52" y="28" fill="#D97706" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">MUV 6-7 SEAT</text>
          </svg>
        </div>
      );

    case 'kia-carens':
      // Modern Recreational MPV - Sculpted body, Star-map DRLs, modern roof line, 3 rows
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <svg viewBox="0 0 360 160" className="w-full h-full max-h-40 drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="180" cy="144" rx="148" ry="8" fill="#d6d3d1" opacity="0.6" />
            
            {/* Integrated Roof Rails */}
            <line x1="120" y1="36" x2="235" y2="36" stroke="#334155" strokeWidth="3" strokeLinecap="round" />

            {/* Carens Sculpted Modern Body */}
            <path d="M 30 106 L 36 65 L 82 62 L 126 40 L 246 40 L 280 64 L 324 76 L 328 106 L 318 118 L 292 118 C 292 98 260 98 260 118 L 115 118 C 115 98 83 98 83 118 L 34 118 Z" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Windows */}
            <path d="M 48 64 L 82 64 L 82 44 L 62 48 Z" fill="#64748B" opacity="0.75" />
            <path d="M 87 64 L 145 64 L 145 43 L 95 43 Z" fill="#64748B" opacity="0.75" />
            <path d="M 150 64 L 210 64 L 210 43 L 150 43 Z" fill="#64748B" opacity="0.75" />
            <path d="M 215 64 L 272 64 L 242 43 L 215 43 Z" fill="#64748B" opacity="0.75" />
            
            {/* Kia Star-Map Signature LED DRL Bar & Grille */}
            <path d="M 280 64 L 322 75 L 314 80 L 276 70 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="312" y="85" width="14" height="15" rx="2" fill="#0F172A" />
            <line x1="314" y1="92" x2="324" y2="92" stroke="#E2E8F0" strokeWidth="2" />

            {/* Angular Futuristic Taillight */}
            <path d="M 32 68 L 44 68 L 40 92 L 32 90 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
            
            {/* Modern Two-Tone Diamond Cut Alloy Wheels */}
            <g transform="translate(99, 118)">
              <circle cx="0" cy="0" r="23" fill="#0F172A" stroke="#000000" strokeWidth="2" />
              <circle cx="0" cy="0" r="15" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
              <polygon points="0,-12 4,-3 12,-3 5,2 8,11 0,6 -8,11 -5,2 -12,-3 -4,-3" fill="#0F172A" />
            </g>
            <g transform="translate(276, 118)">
              <circle cx="0" cy="0" r="23" fill="#0F172A" stroke="#000000" strokeWidth="2" />
              <circle cx="0" cy="0" r="15" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
              <polygon points="0,-12 4,-3 12,-3 5,2 8,11 0,6 -8,11 -5,2 -12,-3 -4,-3" fill="#0F172A" />
            </g>
            
            <rect x="14" y="14" width="76" height="20" rx="6" fill="#F59E0B" fillOpacity="0.15" />
            <text x="52" y="28" fill="#D97706" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">MODERN MPV</text>
          </svg>
        </div>
      );

    case 'toyota-innova-crysta':
    default:
      // Bold Large MPV - Imposing tall stance, prominent trapezoidal grille, heavy luggage overhang
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-xl p-4 overflow-hidden ${className}`}>
          <svg viewBox="0 0 360 160" className="w-full h-full max-h-40 drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="180" cy="144" rx="150" ry="8" fill="#d6d3d1" opacity="0.6" />
            
            {/* Bold Roof Rails */}
            <path d="M 110 32 L 235 32" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Innova Crysta Commanding Heavy MPV Body */}
            <path d="M 28 108 L 32 62 L 72 58 L 122 36 L 244 36 L 282 62 L 328 72 L 332 108 L 322 118 L 295 118 C 295 98 260 98 260 118 L 115 118 C 115 98 80 98 80 118 L 32 118 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Distinctive Triangular 3rd-Row Quarter Glass & Windows */}
            <path d="M 42 60 L 74 60 L 74 40 L 52 44 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 79 60 L 140 60 L 140 39 L 88 39 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 145 60 L 210 60 L 210 39 L 145 39 Z" fill="#94A3B8" opacity="0.85" />
            <path d="M 215 60 L 274 60 L 238 39 L 215 39 Z" fill="#94A3B8" opacity="0.85" />
            
            {/* Iconic Commanding Trapezoidal Front Grille */}
            <path d="M 314 76 L 330 82 L 328 102 L 308 98 Z" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="312" y1="84" x2="328" y2="86" stroke="#E2E8F0" strokeWidth="1.5" />
            <line x1="310" y1="92" x2="326" y2="94" stroke="#E2E8F0" strokeWidth="1.5" />

            {/* Sweptback High-Power Headlamp */}
            <path d="M 280 62 L 324 71 L 318 80 L 276 70 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            
            {/* Big Inverted Saber Taillight */}
            <path d="M 30 62 L 42 62 L 38 94 L 30 92 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
            
            {/* Distinct Crysta Body Crease */}
            <line x1="34" y1="86" x2="320" y2="82" stroke="#E2E8F0" strokeWidth="2.5" />
            
            {/* Heavy Duty 17" Highway Alloy Wheels */}
            <g transform="translate(98, 118)">
              <circle cx="0" cy="0" r="24" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="16" fill="#F1F5F9" stroke="#475569" strokeWidth="2" />
              <circle cx="0" cy="0" r="6" fill="#0F172A" />
              <line x1="-14" y1="0" x2="14" y2="0" stroke="#64748B" strokeWidth="2.5" />
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#64748B" strokeWidth="2.5" />
              <line x1="-10" y1="-10" x2="10" y2="10" stroke="#64748B" strokeWidth="2.5" />
              <line x1="-10" y1="10" x2="10" y2="-10" stroke="#64748B" strokeWidth="2.5" />
            </g>
            <g transform="translate(277, 118)">
              <circle cx="0" cy="0" r="24" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="0" cy="0" r="16" fill="#F1F5F9" stroke="#475569" strokeWidth="2" />
              <circle cx="0" cy="0" r="6" fill="#0F172A" />
              <line x1="-14" y1="0" x2="14" y2="0" stroke="#64748B" strokeWidth="2.5" />
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#64748B" strokeWidth="2.5" />
              <line x1="-10" y1="-10" x2="10" y2="10" stroke="#64748B" strokeWidth="2.5" />
              <line x1="-10" y1="10" x2="10" y2="-10" stroke="#64748B" strokeWidth="2.5" />
            </g>
            
            <rect x="14" y="14" width="90" height="20" rx="6" fill="#F59E0B" fillOpacity="0.15" />
            <text x="59" y="28" fill="#D97706" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">PREMIUM MPV 7S</text>
          </svg>
        </div>
      );
  }
};
