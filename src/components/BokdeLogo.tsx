import React, { useState } from 'react';

interface BokdeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'white';
}

export const BokdeLogo: React.FC<BokdeLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
}) => {
  const [imgSrc, setImgSrc] = useState('/api/logo');
  const [loadError, setLoadError] = useState(false);

  // Height and responsive boundary definitions ensuring crisp visibility
  const sizeClasses = {
    sm: 'h-9 max-h-9 max-w-[140px]',
    md: 'h-11 sm:h-14 max-h-14 max-w-[200px]',
    lg: 'h-14 sm:h-16 max-h-16 max-w-[250px]',
    xl: 'h-20 max-h-20 max-w-[320px]',
  }[size];

  const handleImageError = () => {
    if (imgSrc === '/api/logo') {
      setImgSrc('/logo.png');
    } else if (imgSrc === '/logo.png') {
      setImgSrc('/logo.jpeg');
    } else if (imgSrc === '/logo.jpeg') {
      setImgSrc('/logo.jpg');
    } else {
      setLoadError(true);
    }
  };

  // If in dark footer, display on a crisp white backing so the black logo artwork is fully legible
  const wrapperClass = variant === 'white'
    ? 'bg-white p-1.5 rounded-xl inline-flex items-center shadow-xs'
    : 'inline-flex items-center';

  return (
    <div className={`${wrapperClass} select-none ${className}`}>
      {!loadError ? (
        <img
          src={imgSrc}
          alt="Bokde Travels Logo"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className={`${sizeClasses} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
        />
      ) : (
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg">
            BT
          </div>
          <span className="font-serif font-black text-xl tracking-tight text-stone-900">
            Bokde Travels
          </span>
        </div>
      )}
    </div>
  );
};
