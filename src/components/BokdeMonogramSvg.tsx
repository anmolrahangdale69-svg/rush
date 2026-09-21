import React from 'react';

interface BokdeMonogramSvgProps {
  className?: string;
  variant?: 'dark' | 'light' | 'amber';
}

export const BokdeMonogramSvg: React.FC<BokdeMonogramSvgProps> = ({
  className = 'w-full h-full',
  variant = 'dark',
}) => {
  const strokeColor = variant === 'light' ? '#ffffff' : variant === 'amber' ? '#f59e0b' : '#0c0a09';
  const fillColor = strokeColor;

  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bokde Travels Monogram"
    >
      {/* Background fill subtle if needed */}
      <rect width="500" height="500" fill="transparent" />

      {/* Outer Calligraphic Circular Flourish on Left */}
      <path
        d="M 180 340 C 120 340 75 295 70 235 C 65 165 115 110 185 100 C 235 92 275 115 290 148"
        stroke={strokeColor}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M 180 340 C 130 340 90 300 85 240 C 80 180 125 125 190 115 C 230 110 265 128 280 155"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Main Letter 'B' - High-Contrast Didone Serif */}
      {/* Vertical Main Stem */}
      <rect x="175" y="155" width="26" height="185" fill={fillColor} />
      
      {/* Top Slab Serif on Stem */}
      <polygon points="152,155 218,155 218,164 152,164" fill={fillColor} />
      
      {/* Bottom Slab Serif on Stem */}
      <polygon points="152,331 224,331 224,340 152,340" fill={fillColor} />

      {/* Upper Bowl of B */}
      <path
        d="M 198 155 C 252 155 280 178 280 212 C 280 242 250 254 201 254 L 201 245 C 242 245 264 235 264 212 C 264 188 242 165 198 165 Z"
        fill={fillColor}
      />

      {/* Lower Bowl of B with Bodoni teardrop swelling */}
      <path
        d="M 198 250 C 258 250 292 268 292 302 C 292 338 254 340 198 340 L 198 331 C 244 331 274 326 274 302 C 274 272 244 259 198 259 Z"
        fill={fillColor}
      />

      {/* Letter 'T' - Graceful Calligraphic Crossbar & Flourish */}
      {/* Wavy Horizontal T Crossbar sweeping far to the right */}
      <path
        d="M 185 138 C 220 158 255 156 290 150 C 345 138 395 120 445 145 C 405 130 350 142 295 153 C 255 161 220 160 185 138 Z"
        fill={fillColor}
      />
      <path
        d="M 276 150 L 286 150 L 286 248 L 276 248 Z"
        fill={fillColor}
      />

      {/* Underline Serif Text: BOKDE TRAVELS */}
      <text
        x="250"
        y="390"
        textAnchor="middle"
        fontFamily="'Playfair Display', 'Bodoni MT', 'Cinzel', serif"
        fontSize="25"
        fontWeight="700"
        letterSpacing="8"
        fill={fillColor}
      >
        BOKDE TRAVELS
      </text>
    </svg>
  );
};
