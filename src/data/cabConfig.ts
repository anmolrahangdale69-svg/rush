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

// 4 Dedicated Vehicles with Rates
export const VEHICLES: VehicleConfig[] = [
  {
    id: 'kia-carens',
    name: 'Kia Carens',
    model: 'Carens (6 Seater)',
    category: 'MUV',
    passengers: 6,
    luggage: 4,
    ac: true,
    oneWayRate: 22,
    roundTripRate: 16,
    localHourlyRate: 800,
    visualId: 'kia-carens',
    imageUrl: '/images/fleet/kia-carens.jpg',
    description: 'Refined modern 6-seater MPV with generous legroom, premium upholstery, and advanced comfort on long highways.',
    features: ['Dedicated AC All Rows', 'One-Touch Tumble Seats', 'Comfortable Headrests', 'Ample Cabin Space']
  },
  {
    id: 'maruti-ertiga',
    name: 'Maruti Ertiga',
    model: 'Ertiga (6 Seater)',
    category: 'MUV',
    passengers: 6,
    luggage: 3,
    ac: true,
    oneWayRate: 20,
    roundTripRate: 14,
    localHourlyRate: 300,
    visualId: 'maruti-ertiga',
    imageUrl: '/images/fleet/maruti-ertiga.jpg',
    description: 'Spacious 6-passenger multi-utility vehicle designed for family outings, pilgrimages, and group road travel.',
    features: ['3-Row Flexible Seating', 'Roof-Mounted AC', 'Large Family Capacity', 'Smooth Suspension']
  },
  {
    id: 'suzuki-dzire',
    name: 'Suzuki Dzire',
    model: 'Dzire (4 Seater)',
    category: 'Sedan',
    passengers: 4,
    luggage: 3,
    ac: true,
    oneWayRate: 17,
    roundTripRate: 12,
    localHourlyRate: 250,
    visualId: 'suzuki-dzire',
    imageUrl: '/images/fleet/suzuki-dzire.jpg',
    description: 'India’s most trusted touring sedan with smooth highway ride, chilled AC comfort, and reliable boot space.',
    features: ['Silent AC Cabin', 'Dedicated Trunk Space', 'Plush Cushioned Seats', 'Highway Punctuality']
  },
  {
    id: 'toyota-innova-crysta',
    name: 'Toyota Innova Crysta',
    model: 'Innova Crysta (6 Seater)',
    category: 'Premium MPV',
    passengers: 6,
    luggage: 4,
    ac: true,
    oneWayRate: 31,
    roundTripRate: 18,
    localHourlyRate: 450,
    visualId: 'toyota-innova-crysta',
    imageUrl: '/images/fleet/toyota-innova-crysta.jpg',
    description: 'The gold standard of highway comfort. Unmatched ride stability, supreme passenger cushioning, and heavy luggage capacity.',
    features: ['Captain Seats', 'Dual Climate AC', 'Unrivalled Highway Stability', 'Massive Luggage Space']
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
    description: 'Return journey with same cab and driver. Clear round-trip per-km rates with Total Fare = Total Round-Trip Distance × Vehicle Rate.'
  },
  {
    id: 'local',
    title: 'Local City Cab',
    description: 'Nagpur city travel, medical visits, business meetings, and shopping tours with hourly packages (Dzire: ₹250/hr, Ertiga: ₹300/hr, Innova: ₹450/hr, Carens: ₹800/hr).'
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

// Important Client Confirmation Points
export const CLIENT_CONFIRMATION_POINTS: string[] = [
  'Driver and vehicle details will be shared via SMS/WhatsApp prior to scheduled departure.',
  'Toll taxes, state entry tax, and parking charges are payable directly by customer on actuals.',
  'Night driving allowance (10:00 PM – 6:00 AM) or multi-day halt charges payable to driver if applicable.',
  'Any extra kilometers traveled beyond the booked route or estimated package will be charged at the vehicle’s standard per-km rate.'
];

// FAQs for Bokde Travels
export const FAQS: FaqItem[] = [
  {
    question: 'How is the cab fare calculated?',
    answer: 'The fare is calculated transparently based on your trip type: For One-Way (Single), distance × vehicle rate (Dzire: ₹17/km, Ertiga: ₹20/km, Carens: ₹22/km, Innova: ₹31/km). For Round-Trip, total round-trip distance × round-trip rate (Dzire: ₹12/km, Ertiga: ₹14/km, Carens: ₹16/km, Innova: ₹18/km). For Local City rentals, fare is calculated hourly (Dzire: ₹250/hr, Ertiga: ₹300/hr, Innova: ₹450/hr, Carens: ₹800/hr).'
  },
  {
    question: 'How does round-trip pricing work?',
    answer: 'For Round Trip, Total Fare = Total Round-Trip Distance × Selected Vehicle Rate. Our round-trip rates are: Suzuki Dzire at ₹12/km, Maruti Ertiga at ₹14/km, Kia Carens at ₹16/km, and Toyota Innova Crysta at ₹18/km.'
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
    answer: 'We maintain 4 dedicated vehicle options: Suzuki Dzire (4 Seater), Maruti Ertiga (6 Seater), Kia Carens (6 Seater), and Toyota Innova Crysta (6 Seater). All vehicles are air-conditioned, commercially registered, and regularly serviced.'
  },
  {
    question: 'Can I book Nagpur Airport pickup and drop?',
    answer: 'Yes. We provide prompt transfers to and from Dr. Babasaheb Ambedkar International Airport (NAG) in Nagpur. You can select either Airport Pickup (Airport → Your Location) or Airport Drop (Your Location → Airport).'
  },
  {
    question: 'What payment options are available?',
    answer: 'You can pay comfortably via Cash on Delivery / Pay to Driver at the trip destination, or via direct UPI QR code / UPI ID transfer to sonalbokde786-7@okaxis using Google Pay, PhonePe, Paytm, or BHIM.'
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
    description: 'Choice of 4 reliable vehicles: Suzuki Dzire (4-seater sedan), Maruti Ertiga (6-seater MUV), Kia Carens (6-seater MUV), and Toyota Innova Crysta (6-seater MPV).'
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
