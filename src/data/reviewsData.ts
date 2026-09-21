export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  route: string;
  tripType: 'Round Trip' | 'One Way' | 'Airport Transfer' | 'Outstation' | 'Local Rental';
  distanceText: string;
  rating: number;
  vehicle: string;
  date: string;
  reviewText: string;
  verifiedTrip: boolean;
  category: 'roundtrip' | 'oneway' | 'airport' | 'leisure';
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Ashish Deshmukh',
    location: 'Dharampeth, Nagpur',
    route: 'Nagpur ⇄ Pune',
    tripType: 'Round Trip',
    distanceText: 'Total: 1,440 km (Round Trip)',
    rating: 5,
    vehicle: 'Maruti Suzuki Ertiga',
    date: 'September 2026',
    reviewText: 'Booked a round trip from Nagpur to Pune via Samruddhi Mahamarg with family. The driver was exceptionally polite, kept a steady cruising speed, and the Ertiga AC was ice cold throughout. Exact per-km pricing with zero hidden charges.',
    verifiedTrip: true,
    category: 'roundtrip'
  },
  {
    id: 'rev-2',
    name: 'Sneha Kulkarni',
    location: 'Wardha, Maharashtra',
    route: 'Wardha → Nagpur Airport (NAG)',
    tripType: 'Airport Transfer',
    distanceText: 'Total: 76 km (One Way Drop)',
    rating: 5,
    vehicle: 'Suzuki Dzire',
    date: 'September 2026',
    reviewText: 'Had a 5:30 AM early morning flight from Dr. Babasaheb Ambedkar International Airport. The cab reached my doorstep in Wardha at 3:15 AM sharp. Smooth highway drive and dropped me right at the departure terminal with time to spare.',
    verifiedTrip: true,
    category: 'airport'
  },
  {
    id: 'rev-3',
    name: 'Dr. Rajesh Sharma',
    location: 'Ramdaspeth, Nagpur',
    route: 'Nagpur ⇄ Pench National Park',
    tripType: 'Round Trip',
    distanceText: 'Total: 180 km (Round Trip)',
    rating: 5,
    vehicle: 'Toyota Innova Crysta',
    date: 'September 2026',
    reviewText: 'Booked an Innova Crysta for a weekend jungle safari with visiting colleagues. The vehicle was pristine, plenty of luggage space, and our chauffeur knew the forest gate routes thoroughly. Coming and going journey was effortless.',
    verifiedTrip: true,
    category: 'leisure'
  },
  {
    id: 'rev-4',
    name: 'Priya Patel',
    location: 'Civil Lines, Nagpur',
    route: 'Nagpur → Amravati',
    tripType: 'One Way',
    distanceText: 'Total: 155 km (One Way)',
    rating: 5,
    vehicle: 'Suzuki Dzire',
    date: 'August 2026',
    reviewText: 'Travelled one way to Amravati for university work. Usually operators demand two-way return fare for outstation drops, but Bokde Travels charged only for the single journey. Very fair and professional service.',
    verifiedTrip: true,
    category: 'oneway'
  },
  {
    id: 'rev-5',
    name: 'Anand Verma',
    location: 'Manish Nagar, Nagpur',
    route: 'Nagpur ⇄ Shirdi',
    tripType: 'Round Trip',
    distanceText: 'Total: 1,180 km (Round Trip)',
    rating: 5,
    vehicle: 'Toyota Innova Crysta',
    date: 'August 2026',
    reviewText: 'Took my elderly parents for Sai Baba darshan at Shirdi. Our driver Narendra was attentive, took gentle breaks whenever requested, and navigated the expressway smoothly. Comfortable push-back seats made a long journey stress-free.',
    verifiedTrip: true,
    category: 'roundtrip'
  },
  {
    id: 'rev-6',
    name: 'Meera Nair',
    location: 'Pratap Nagar, Nagpur',
    route: 'Nagpur → Raipur',
    tripType: 'One Way',
    distanceText: 'Total: 285 km (One Way)',
    rating: 5,
    vehicle: 'Kia Carens',
    date: 'August 2026',
    reviewText: 'Needed urgent same-day transport to Raipur for an office conference. Bokde Travels confirmed the cab in under 15 minutes. The Kia Carens was modern, clean, and the driver was well-mannered. Reached Raipur right on schedule.',
    verifiedTrip: true,
    category: 'oneway'
  },
  {
    id: 'rev-7',
    name: 'Amit Joshi',
    location: 'Bhandara, Maharashtra',
    route: 'Bhandara → Nagpur AIIMS',
    tripType: 'Round Trip',
    distanceText: 'Total: 130 km (Round Trip)',
    rating: 5,
    vehicle: 'Suzuki Dzire',
    date: 'August 2026',
    reviewText: 'Had a routine hospital consultation at AIIMS MIHAN Nagpur from Bhandara. Driver waited patiently during the doctor appointment and brought us back safely. Transparent meter calculation without any unnecessary disputes.',
    verifiedTrip: true,
    category: 'roundtrip'
  },
  {
    id: 'rev-8',
    name: 'Pooja Khandelwal',
    location: 'Sadar, Nagpur',
    route: 'Nagpur ⇄ Pachmarhi',
    tripType: 'Round Trip',
    distanceText: 'Total: 460 km (Round Trip)',
    rating: 5,
    vehicle: 'Maruti Suzuki Ertiga',
    date: 'July 2026',
    reviewText: 'Monsoon family trip to Pachmarhi hill station. Ghat roads were tackled with supreme control and safety by the driver. No nausea, smooth braking, and clear communication on tolls and halt charges. Will definitely book again!',
    verifiedTrip: true,
    category: 'leisure'
  },
  {
    id: 'rev-9',
    name: 'Sachin Patil',
    location: 'Gondia, Maharashtra',
    route: 'Gondia → Nagpur Railway Station',
    tripType: 'One Way',
    distanceText: 'Total: 165 km (One Way)',
    rating: 5,
    vehicle: 'Suzuki Dzire',
    date: 'July 2026',
    reviewText: 'My train was delayed so I had to book a direct cab from Gondia to Nagpur Junction to catch a connecting Vande Bharat express. The driver arrived on time and navigated city traffic efficiently. Saved my connecting trip.',
    verifiedTrip: true,
    category: 'oneway'
  },
  {
    id: 'rev-10',
    name: 'Dr. Sunita Rao',
    location: 'Laxmi Nagar, Nagpur',
    route: 'Nagpur ⇄ Tadoba Andhari Tiger Reserve',
    tripType: 'Round Trip',
    distanceText: 'Total: 290 km (Round Trip)',
    rating: 5,
    vehicle: 'Toyota Innova Crysta',
    date: 'July 2026',
    reviewText: 'Took international wildlife photographers from Moharli gate back to Nagpur. The spacious Innova easily accommodated heavy camera gear and safari luggage. Punctual, safe, and courteous service.',
    verifiedTrip: true,
    category: 'leisure'
  },
  {
    id: 'rev-11',
    name: 'Rahul Tiwari',
    location: 'Kamptee, Nagpur',
    route: 'Nagpur → Hyderabad',
    tripType: 'One Way',
    distanceText: 'Total: 500 km (One Way)',
    rating: 5,
    vehicle: 'Kia Carens',
    date: 'June 2026',
    reviewText: 'Relocated to Hyderabad with personal luggage. Booked Kia Carens for the long NH44 stretch. The car was brand new with great suspension. We made good time with zero fatigue. Transparent toll policy.',
    verifiedTrip: true,
    category: 'oneway'
  },
  {
    id: 'rev-12',
    name: 'Kavita Agrawal',
    location: 'Wardhaman Nagar, Nagpur',
    route: 'Nagpur ⇄ Shegaon (Gajanan Maharaj)',
    tripType: 'Round Trip',
    distanceText: 'Total: 580 km (Round Trip)',
    rating: 5,
    vehicle: 'Maruti Suzuki Ertiga',
    date: 'June 2026',
    reviewText: 'Went for Gajanan Maharaj darshan at Shegaon with 5 family members. The round-trip package was very economical compared to other operators. Driver was deeply respectful and guided us to good family restaurants on the route.',
    verifiedTrip: true,
    category: 'roundtrip'
  },
  {
    id: 'rev-13',
    name: 'Vikram Singh',
    location: 'Chandrapur, Maharashtra',
    route: 'Chandrapur → Nagpur Airport',
    tripType: 'Airport Transfer',
    distanceText: 'Total: 150 km (One Way Drop)',
    rating: 5,
    vehicle: 'Suzuki Dzire',
    date: 'May 2026',
    reviewText: 'Direct pickup from Chandrapur thermal power station quarters to Nagpur airport. Clean vehicle, proper air conditioning, and peaceful driving without constant honking. Top-notch service.',
    verifiedTrip: true,
    category: 'airport'
  },
  {
    id: 'rev-14',
    name: 'Neha Choudhary',
    location: 'Trimurti Nagar, Nagpur',
    route: 'Nagpur ⇄ Kanha National Park',
    tripType: 'Round Trip',
    distanceText: 'Total: 520 km (Round Trip)',
    rating: 5,
    vehicle: 'Toyota Innova Crysta',
    date: 'May 2026',
    reviewText: 'Awesome experience traveling to Kanha Khatia gate. We booked the Crysta for 3 days. Driver stay and night charges were transparently explained upfront before booking, no surprises during the journey.',
    verifiedTrip: true,
    category: 'leisure'
  },
  {
    id: 'rev-15',
    name: 'Suresh Kale',
    location: 'Yavatmal, Maharashtra',
    route: 'Yavatmal → Nagpur',
    tripType: 'One Way',
    distanceText: 'Total: 152 km (One Way)',
    rating: 5,
    vehicle: 'Suzuki Dzire',
    date: 'April 2026',
    reviewText: 'Regularly travel from Yavatmal to Nagpur for business meetings. Bokde Travels has become my go-to choice. Clean seats, polite drivers, and straightforward billing via UPI QR.',
    verifiedTrip: true,
    category: 'oneway'
  },
  {
    id: 'rev-16',
    name: 'Deepak Gadkari',
    location: 'Besla, Nagpur',
    route: 'Nagpur ⇄ Jabalpur',
    tripType: 'Round Trip',
    distanceText: 'Total: 550 km (Round Trip)',
    rating: 5,
    vehicle: 'Kia Carens',
    date: 'April 2026',
    reviewText: 'Booked for an urgent commercial dispute hearing in Jabalpur High Court. The vehicle arrived right on time at 5 AM. Covered the distance through Seoni smoothly and returned by late evening. Very reliable.',
    verifiedTrip: true,
    category: 'roundtrip'
  },
  {
    id: 'rev-17',
    name: 'Shalini Dubey',
    location: 'Katol, Maharashtra',
    route: 'Katol → Nagpur Airport',
    tripType: 'Airport Transfer',
    distanceText: 'Total: 65 km (One Way Drop)',
    rating: 5,
    vehicle: 'Suzuki Dzire',
    date: 'March 2026',
    reviewText: 'Needed an airport transfer from Katol early morning. The driver coordinated on WhatsApp the night before and arrived 10 minutes ahead of time. Felt very secure traveling alone.',
    verifiedTrip: true,
    category: 'airport'
  },
  {
    id: 'rev-18',
    name: 'Manoj Rathore',
    location: 'Hinganghat, Maharashtra',
    route: 'Hinganghat ⇄ Nagpur',
    tripType: 'Round Trip',
    distanceText: 'Total: 160 km (Round Trip)',
    rating: 5,
    vehicle: 'Maruti Suzuki Ertiga',
    date: 'March 2026',
    reviewText: 'Attended a wedding reception in Nagpur with cousins. Having a dedicated round-trip cab meant nobody had to worry about driving late night. Driver was patient and waited until the function finished.',
    verifiedTrip: true,
    category: 'roundtrip'
  },
  {
    id: 'rev-19',
    name: 'Ritu Agrawal',
    location: 'Dhantoli, Nagpur',
    route: 'Nagpur ⇄ Bandhavgarh Tiger Reserve',
    tripType: 'Round Trip',
    distanceText: 'Total: 880 km (Round Trip)',
    rating: 5,
    vehicle: 'Toyota Innova Crysta',
    date: 'February 2026',
    reviewText: 'Extended outstation trip across MP wildlife circuit. Innova Crysta was super comfortable and had zero mechanical hiccups across 800+ kms. Drivers from Bokde Travels are true professionals.',
    verifiedTrip: true,
    category: 'leisure'
  },
  {
    id: 'rev-20',
    name: 'Nikhil Mohite',
    location: 'Nandanvan, Nagpur',
    route: 'Nagpur → Mumbai (Outstation)',
    tripType: 'One Way',
    distanceText: 'Total: 820 km (One Way Express)',
    rating: 5,
    vehicle: 'Toyota Innova Crysta',
    date: 'February 2026',
    reviewText: 'Took Samruddhi Expressway straight from Nagpur to Thane/Mumbai. Smooth high-speed highway driving without any rash maneuvers. Completed the distance comfortably with adequate halts. Highly recommended.',
    verifiedTrip: true,
    category: 'oneway'
  }
];

export const REVIEW_METRICS = {
  averageRating: 4.9,
  totalReviews: 1280,
  verifiedPercentage: 99.4,
  punctualityRate: '99.2%',
  cleanVehicles: '100%'
};
