import React from 'react';
import { VehicleVisualId } from '../types';

interface VehicleVisualProps {
  visualId: VehicleVisualId;
  className?: string;
  altText?: string;
}

const VEHICLE_PHOTO_MAP: Record<VehicleVisualId, { src: string; alt: string }> = {
  'kia-carens': {
    src: '/images/fleet/kia-carens.jpg',
    alt: 'Kia Carens / Equivalent - Bokde Travels Nagpur'
  },
  'maruti-ertiga': {
    src: '/images/fleet/maruti-ertiga.jpg',
    alt: 'Maruti Ertiga / Equivalent - Bokde Travels Nagpur'
  },
  'suzuki-dzire': {
    src: '/images/fleet/suzuki-dzire.jpg',
    alt: 'Suzuki Dzire / Equivalent - Bokde Travels Nagpur'
  },
  'toyota-innova-crysta': {
    src: '/images/fleet/toyota-innova-crysta.jpg',
    alt: 'Toyota Innova Crysta / Equivalent - Bokde Travels Nagpur'
  }
};

export const VehicleVisual: React.FC<VehicleVisualProps> = ({ visualId, className = 'w-full h-48', altText }) => {
  const vehicle = VEHICLE_PHOTO_MAP[visualId] || VEHICLE_PHOTO_MAP['kia-carens'];

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-stone-100 ${className}`}>
      <img
        src={vehicle.src}
        alt={altText || vehicle.alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
};
