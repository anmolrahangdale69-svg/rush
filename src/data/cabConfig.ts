import { VehicleConfig, PopularRoute, FaqItem } from '../types';

export const BUSINESS_CONFIG = {
  name: 'Bokde Travels',
  tagline: 'Reliable Cabs in Nagpur for Local & Outstation Travel',
  city: 'Nagpur',
  state: 'Maharashtra',
  country: 'India',
  phone: '8983275497',
  displayPhone: '+91 8983275497',
  email: 'bokdetravels@gmail.com',
  upiId: 'sonalbokde786-7@okaxis',
  whatsappNumber: '918983275497',
  address: 'Nagpur, Maharashtra, India',
  airportName: 'Dr. Babasaheb Ambedkar International Airport (NAG), Nagpur',
};

// 7 Exact Vehicles with Rates (One-Way & Round-Trip = One-Way - ₹1/km)
export const VEHICLES: VehicleConfig[] = [
  {
    id: 'maruti-swift',
    name: 'Maruti Swift',
    model: 'Swift ZXi / VXi',
    category: 'Hatchback',
    passengers: 4,
    luggage: 2,
    ac: true,
    oneWayRate: 18,
    roundTripRate: 17,
    visualId: 'maruti-swift',
    description: 'Agile & fuel-efficient hatchback, ideal for solo travelers, couples & quick city or intercity trips.',
    features: ['Chilled AC', 'Clean Fabric Seats', 'Compact & Smooth Ride', 'Luggage Boot']
  },
  {
    id: 'maruti-fronx',
    name: 'Maruti Fronx',
    model: 'Fronx Turbo / Delta',
    category: 'Crossover',
    passengers: 4,
    luggage: 2,
    ac: true,
    oneWayRate: 17,
    roundTripRate: 16,
    visualId: 'maruti-fronx',
    description: 'Modern crossover with higher ground clearance, quiet cabin and superior highway ride quality.',
    features: ['High Ground Clearance', 'Dual Airbags & AC', 'Quiet Highway Stance', 'Spacious Cabin']
  },
  {
    id: 'hyundai-aura',
    name: 'Hyundai Aura',
    model: 'Aura SX / S',
    category: 'Sedan',
    passengers: 4,
    luggage: 3,
    ac: true,
    oneWayRate: 18,
    roundTripRate: 17,
    visualId: 'hyundai-aura',
    description: 'Comfortable family sedan with smooth suspension, plush rear seating and deep dedicated boot space.',
    features: ['Rear AC Vents', 'Ample Legroom', 'Generous 402L Boot', 'Ergonomic Seats']
  },
  {
    id: 'suzuki-dzire',
    name: 'Suzuki Dzire',
    model: 'Dzire ZXi / VXi',
    category: 'Sedan',
    passengers: 4,
    luggage: 3,
    ac: true,
    oneWayRate: 18,
    roundTripRate: 17,
    visualId: 'suzuki-dzire',
    description: 'India’s most trusted commercial touring sedan with smooth highway ride, comfort and reliable mileage.',
    features: ['Silent AC Cabin', 'Dedicated Trunk Space', 'Plush Cushioned Seats', 'Highway Punctuality']
  },
  {
    id: 'maruti-ertiga',
    name: 'Maruti Ertiga',
    model: 'Ertiga ZXi (7 Seater)',
    category: 'MUV',
    passengers: 6,
    luggage: 3,
    ac: true,
    oneWayRate: 21,
    roundTripRate: 20,
    visualId: 'maruti-ertiga',
    description: 'Spacious 6-7 passenger multi-utility vehicle designed for family outings, pilgrimages and group road travel.',
    features: ['3-Row Flexible Seating', 'Roof-Mounted AC', 'Large Family Capacity', 'Smooth Suspension']
  },
  {
    id: 'kia-carens',
    name: 'Kia Carens',
    model: 'Carens Prestige Plus',
    category: 'MUV',
    passengers: 6,
    luggage: 4,
    ac: true,
    oneWayRate: 22.99,
    roundTripRate: 21.99,
    visualId: 'kia-carens',
    description: 'Refined modern 6-7 seater MPV with generous legroom, premium upholstery and advanced comfort on long highways.',
    features: ['Dedicated AC All Rows', 'One-Touch Tumble Seats', 'Comfortable Headrests', 'Ample Cabin Space']
  },
  {
    id: 'toyota-innova-crysta',
    name: 'Toyota Innova Crysta',
    model: 'Innova Crysta 2.4 VX/GX',
    category: 'Premium MPV',
    passengers: 7,
    luggage: 4,
    ac: true,
    oneWayRate: 32,
    roundTripRate: 31,
    visualId: 'toyota-innova-crysta',
    description: 'The gold standard of highway comfort. Unmatched ride stability, supreme passenger cushioning and heavy luggage capacity.',
    features: ['Captain / Bench Seats', 'Dual Climate AC', 'Unrivalled Highway Stability', 'Massive Luggage Space']
  }
];

// Services offered
export const CAB_SERVICES = [
  {
    id: 'oneway',
    title: 'One-Way Outstation',
    description: 'Direct point-to-point drop from Nagpur to any town, district, or city. Pay only for one-way distance with no return charge obligation.'
  },
  {
    id: 'roundtrip',
    title: 'Round-Trip Cab',
    description: 'Return journey with same cab and driver. Enjoy our special round-trip discount of ₹1/km lower than one-way rates across all vehicle models.'
  },
  {
    id: 'local',
    title: 'Local City Cab',
    description: 'Nagpur city travel, medical visits, business meetings, and shopping tours with prompt door-to-door driver pickup.'
  },
  {
    id: 'airport',
    title: 'Nagpur Airport Transfer',
    description: 'Punctual airport pickup and drop services for Dr. Babasaheb Ambedkar International Airport (NAG) with flight schedule tracking.'
  }
];

// Popular Routes From Nagpur (Examples for fast selection — clicking calculates route distance dynamically)
export const POPULAR_ROUTES_FROM_NAGPUR: PopularRoute[] = [
  {
    id: 'nagpur-wardha',
    from: 'Nagpur',
    to: 'Wardha',
    distanceKm: 78,
    duration: '1 hr 30 min',
    estimatedKm: 78,
    via: 'NH 361 Highway',
    description: 'Smooth 1.5 hr drive connecting Nagpur and Wardha / Sevagram with doorstep pickup.'
  },
  {
    id: 'nagpur-amravati',
    from: 'Nagpur',
    to: 'Amravati',
    distanceKm: 155,
    duration: '2 hr 45 min',
    estimatedKm: 155,
    via: 'NH 53 Highway',
    description: 'Express four-lane highway connectivity across Vidarbha with verified highway drivers.'
  },
  {
    id: 'nagpur-chandrapur',
    from: 'Nagpur',
    to: 'Chandrapur',
    distanceKm: 150,
    duration: '3 hr',
    estimatedKm: 150,
    via: 'SH 264 / NH 353B',
    description: 'Reliable industrial and city route linking Nagpur with Chandrapur and Tadoba gateway.'
  },
  {
    id: 'nagpur-bhandara',
    from: 'Nagpur',
    to: 'Bhandara',
    distanceKm: 65,
    duration: '1 hr 15 min',
    estimatedKm: 65,
    via: 'NH 53 Highway',
    description: 'Quick intercity transfer with on-time morning and evening pickup availability.'
  },
  {
    id: 'nagpur-gondia',
    from: 'Nagpur',
    to: 'Gondia',
    distanceKm: 165,
    duration: '3 hr 30 min',
    estimatedKm: 165,
    via: 'NH 53 & SH 275',
    description: 'Comfortable family and business cab service connecting Nagpur with Gondia.'
  },
  {
    id: 'nagpur-yavatmal',
    from: 'Nagpur',
    to: 'Yavatmal',
    distanceKm: 152,
    duration: '3 hr',
    estimatedKm: 152,
    via: 'NH 361 / Wardha-Yavatmal Rd',
    description: 'Prompt doorstep cab service between Nagpur and Yavatmal district center.'
  }
];

export const POPULAR_NAGPUR_ROUTES = POPULAR_ROUTES_FROM_NAGPUR;

// 3 Configurable Client Confirmation Points
export const CLIENT_CONFIRMATION_POINTS: string[] = [
  'Driver and vehicle details will be shared via SMS/WhatsApp prior to scheduled departure.',
  'Toll taxes, state entry tax, and parking charges are payable directly by customer on actuals.',
  'Night driving allowance (10:00 PM – 6:00 AM) or multi-day halt charges payable to driver if applicable.'
];

// FAQs for Bokde Travels
export const FAQS: FaqItem[] = [
  {
    question: 'How is the cab fare calculated?',
    answer: 'The fare is calculated simply as: Distance (in km) × Vehicle Per-Km Rate. For One-Way trips, the fare is based on the single route distance. For Round-Trip bookings, the total running distance (pickup to destination and return) is multiplied by the discounted round-trip rate (which is ₹1/km lower than the one-way rate).'
  },
  {
    question: 'How does round-trip pricing work?',
    answer: 'Our round-trip rate is always ₹1/km cheaper than the one-way rate across all vehicles. For instance, if Suzuki Dzire is ₹18/km one-way, it is ₹17/km on round-trip bookings. The fare accounts for the complete round-trip distance.'
  },
  {
    question: 'Do I have to pay toll and parking charges?',
    answer: 'Yes. Toll taxes, state border permits (if crossing Maharashtra into MP, Telangana, etc.), and airport/station parking fees are payable directly by the customer on actual receipts.'
  },
  {
    question: 'Can I book an outstation one-way cab?',
    answer: 'Yes. Bokde Travels specializes in dedicated one-way outstation drops from Nagpur to any destination (Wardha, Amravati, Chandrapur, Bhandara, Gondia, Yavatmal, Pune, Mumbai, etc.) with no return fare obligation.'
  },
  {
    question: 'What vehicles are available in your fleet?',
    answer: 'We maintain 7 dedicated vehicle models: Maruti Swift, Maruti Fronx, Hyundai Aura, Suzuki Dzire, Maruti Ertiga, Kia Carens, and Toyota Innova Crysta. All vehicles are air-conditioned, commercially registered, and regularly serviced.'
  },
  {
    question: 'Can I book Nagpur Airport pickup and drop?',
    answer: 'Yes. We provide prompt transfers to and from Dr. Babasaheb Ambedkar International Airport (NAG) in Nagpur. You can select either Airport Pickup (Airport → Your Location) or Airport Drop (Your Location → Airport).'
  },
  {
    question: 'What payment options are available?',
    answer: 'You can pay directly in Cash / Pay to Driver at the end of the trip, or via UPI to our official business ID: sonalbokde786-7@okaxis (Google Pay, PhonePe, Paytm, BHIM).'
  }
];

export const FAQ_ITEMS = FAQS;

// Factual Why Choose Bokde Travels points (No invented guarantees or awards)
export const WHY_BOKDE_TRAVELS = [
  {
    id: 'nagpur-based',
    title: 'Nagpur-Based Cab Service',
    description: 'Locally operated in Nagpur with deep knowledge of Vidarbha city routes and Maharashtra highway corridors.'
  },
  {
    id: 'local-outstation',
    title: 'Local & Outstation Travel',
    description: 'Cabs available for point-to-point city commutes, airport transfers, and one-way or round-trip outstation journeys.'
  },
  {
    id: 'transparent-fare',
    title: 'Transparent Fare Calculation',
    description: 'Exact distance multiplied by per-km vehicle rate. No hidden charges or unexpected peak surge multipliers.'
  },
  {
    id: 'fleet-options',
    title: 'Multiple Vehicle Options',
    description: 'Choice of 7 specific car models ranging from compact hatchbacks (Swift) and sedans (Dzire, Aura) to 6-7 seaters (Ertiga, Carens, Innova Crysta).'
  },
  {
    id: 'easy-booking',
    title: 'Easy & Fast Booking',
    description: 'Book your ride in under a minute with instant trip summary and direct WhatsApp confirmation.'
  },
  {
    id: 'payment-options',
    title: 'Multiple Payment Options',
    description: 'Pay comfortably via Cash to Driver (COD) or direct UPI transfer to sonalbokde786-7@okaxis.'
  }
];
