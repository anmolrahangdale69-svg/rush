import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Julian & Camilla Mercer',
      location: 'London, United Kingdom',
      tour: 'Heritage of Rajasthan & Thar Desert',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'From the private boat arrival at Taj Lake Palace Udaipur to the starlit desert camp in Jaisalmer, every second was sheer magic. The owner concierge dispatched assistance instantly. Unmatched warm hospitality.'
    },
    {
      name: 'Harrison Sterling',
      location: 'San Francisco, CA',
      tour: 'Ranthambore Tiger Safari',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'We saw three Bengal Tigers in their natural sanctuary with veteran naturalists who knew every trail. The luxury tented lodge and private plunge pool exceeded any safari in Africa.'
    },
    {
      name: 'Dr. Evelyn Sato',
      location: 'Toronto, Canada',
      tour: 'Varanasi, Khajuraho & Sacred Ganges',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'The private evening Ganga Aarti boat in Varanasi and watching sunrise over the Taj Mahal from our Amarvilas balcony brought tears to my eyes. Flawless cultural curation.'
    }
  ];

  return (
    <section id="testimonials" className="py-18 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Real Stories, Memorable Journeys
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight mt-1">
            Endorsed by Discerning Explorers
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Read unedited feedback from travelers who booked our signature Indian expeditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-amber-200 absolute top-6 right-6 pointer-events-none" />

              <div>
                <div className="flex text-amber-500 mb-3">
                  {Array.from({ length: rev.rating }).map((_, rIdx) => (
                    <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-stone-500">{rev.location}</div>
                  <div className="text-[10px] text-amber-700 font-semibold font-mono">{rev.tour}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
