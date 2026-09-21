import React from 'react';
import { BokdeMonogramSvg } from './BokdeMonogramSvg';

interface BokdeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'white';
  showSubtitle?: boolean;
}

export const BokdeLogo: React.FC<BokdeLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
}) => {
  // Sizing definitions matching the classic navbar icon
  const dimensions = {
    sm: { box: 'w-8 h-8 rounded-lg p-0.5', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-1', text: 'text-xl sm:text-2xl', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1.5', text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20 rounded-2xl p-2', text: 'text-3xl', sub: 'text-sm' },
  }[size];

  const textColor = variant === 'white' 
    ? 'text-white' 
    : variant === 'light' 
      ? 'text-stone-100' 
      : 'text-stone-900';

  const subColor = variant === 'white' || variant === 'light'
    ? 'text-amber-400'
    : 'text-amber-700';

  const boxBg = variant === 'white' || variant === 'light'
    ? 'bg-white border-stone-700/60 shadow-xs'
    : 'bg-white border-stone-200/90 shadow-xs';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon badge on top left - exactly like before */}
      <div 
        className={`relative ${dimensions.box} shrink-0 border ${boxBg} flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 duration-200`}
      >
        <BokdeMonogramSvg 
          className="w-full h-full object-contain" 
          variant="dark"
        />
      </div>

      {/* Brand Typography next to the icon - exactly like before */}
      <div className="flex flex-col justify-center">
        <span className={`font-display font-black ${dimensions.text} ${textColor} tracking-tight block leading-tight font-serif`}>
          Bokde Travels
        </span>
        {showSubtitle && (
          <span className={`${dimensions.sub} font-bold ${subColor} tracking-wider uppercase block mt-0.5`}>
            Nagpur Cab Service
          </span>
        )}
      </div>
    </div>
  );
};
