import { Tour } from '../types';

export const INITIAL_TOURS: Tour[] = [
  {
    id: 'tour-rajasthan-royal-palaces',
    title: 'The Grand Maharaja: Royal Palaces of Rajasthan & Thar Desert Odyssey',
    slug: 'rajasthan-royal-palaces-thar-desert',
    destination: 'Udaipur, Jaipur, Jodhpur & Jaisalmer',
    country: 'India',
    region: 'North & West India',
    category: 'Luxury',
    tag: 'Royal Heritage Exclusive',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'
    ],
    durationDays: 8,
    durationNights: 7,
    pricePerPerson: 2950, // ~₹2,50,000 INR
    originalPrice: 3400,
    rating: 4.99,
    reviewCount: 218,
    maxGroupSize: 8,
    difficulty: 'Easy',
    featured: true,
    shortDescription: 'Stay at legendary lake palaces in Udaipur, enjoy private royal dinners in Amer Fort, and retreat to luxury tented camps in the Thar Desert.',
    fullDescription: 'Immerse yourself in the immortal splendor of Rajput royalty. Experience private boat arrivals at the floating white marble palaces of Lake Pichola, after-hours champagne access to the Sheesh Mahal in Amer Fort, private polo matches, and candlelit dinners under the constellation-rich skies of Jaisalmer dunes.',
    highlights: [
      'Exclusive suite stay at the historic Taj Lake Palace, Udaipur',
      'Private after-hours tour of the City Palace & Amer Fort mirror halls',
      'Luxury tented desert glamping with private folk musicians in Jaisalmer',
      'Chauffeured vintage car fleet transfers and private historian chaperone'
    ],
    included: [
      '7 nights in iconic 5-star palace heritage hotels & luxury desert pavilions',
      'Daily royal artisan breakfast & 5 curated regal multi-course banquets',
      'Private Mewar boat cruise on Lake Pichola with champagne service',
      'All VIP monument access, palace permits, taxes, and luggage porterage',
      'Dedicated 24/7 Royal Concierge and senior cultural historian'
    ],
    excluded: [
      'Domestic & international flights to/from Udaipur & Jaipur',
      'Personal boutique shopping (gemstones, textiles) and gratuities',
      'Comprehensive travel and medical insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in the City of Lakes: Udaipur & Private Lake Palace Check-in',
        description: 'Chauffeured airport greeting and transfer to the jetty. Private motorboat transfer across Lake Pichola to the iconic Taj Lake Palace with floral garland welcome.',
        meals: 'Welcome Royal Feast',
        stay: 'Taj Lake Palace, Udaipur'
      },
      {
        day: 2,
        title: 'City Palace Museum & Sunset Cruise on Lake Pichola',
        description: 'Private curator-led walk through the Mewar royal courtyards and crystal gallery. Evening chartered cruise viewing Jag Mandir Island.',
        meals: 'Breakfast, Lakeside Gourmet Dinner',
        stay: 'Taj Lake Palace, Udaipur'
      },
      {
        day: 3,
        title: 'En Route to Jodhpur: Ranakpur Jain Temples & Blue City Sunset',
        description: 'Scenic drive through the Aravalli hills visiting the 1,444 intricately carved marble pillars of Ranakpur. Arrive at Umaid Bhawan Palace in Jodhpur.',
        meals: 'Breakfast, Rajasthani Thali Lunch',
        stay: 'Umaid Bhawan Palace, Jodhpur'
      },
      {
        day: 4,
        title: 'Mehrangarh Fortress Ramparts & Jaisalmer Golden Citadel',
        description: 'Private morning elevator access to the cliffside ramparts of Mehrangarh. Journey into the golden sandstone desert citadel of Jaisalmer.',
        meals: 'Breakfast, Royal Banquet Dinner',
        stay: 'Suryagarh / The Serai'
      },
      {
        day: 5,
        title: 'Thar Desert Dunes: Private Camel Caravans & Stargazing Feast',
        description: 'Bespoke sunset camel safari across the rolling Sam Sand Dunes. Private Rajasthani Manganiyar musical performance around a desert campfire.',
        meals: 'Breakfast, Campfire Desert Feast',
        stay: 'The Serai Luxury Desert Camp'
      },
      {
        day: 6,
        title: 'Pink City of Jaipur: Private Amer Fort & Sheesh Mahal Entry',
        description: 'Private chartered transfer to Jaipur. Exclusive evening access to the Amer Fort mirror chambers followed by dinner at 1135 AD.',
        meals: 'Breakfast, Fine Dining at 1135 AD',
        stay: 'The Oberoi Rajvilas / Rambagh Palace'
      },
      {
        day: 7,
        title: 'Hawa Mahal, Royal Observatory & Block-Print Textile Masterclass',
        description: 'Sunrise photography at Hawa Mahal, private walk in Jantar Mantar, and hands-on royal block-printing masterclass with master artisans.',
        meals: 'Breakfast, Farewell Royal Gala',
        stay: 'Rambagh Palace, Jaipur'
      },
      {
        day: 8,
        title: 'Farewell Rajasthan: Chauffeur Transfer to Jaipur / Delhi',
        description: 'Leisurely champagne breakfast in the peacock courtyards before private executive chauffeur transfer to the airport.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ],
    availableDates: ['2026-10-10', '2026-11-05', '2026-12-12', '2026-01-15', '2026-02-20'],
    reviews: [
      {
        id: 'rev-raj-1',
        userName: 'Alistair & Vivienne Vance',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        userCountry: 'United Kingdom',
        rating: 5,
        date: 'February 2026',
        comment: 'The arrival by private boat at Taj Lake Palace Udaipur took our breath away. Having our own royal historian and seamless VIP access across Rajasthan made this the greatest trip of our lives.'
      },
      {
        id: 'rev-raj-2',
        userName: 'Devika Singhania',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        userCountry: 'India (Mumbai)',
        rating: 5,
        date: 'January 2026',
        comment: 'Even as someone from India, Aura Voyages curated access to private palace courtyards and desert camps that ordinary travelers simply cannot experience. Truly impeccable hospitality.'
      }
    ]
  },
  {
    id: 'tour-kerala-backwaters-ayurveda',
    title: 'Kerala Spice Coast: Private Kettuvallam Cruise, Tea Hills & Ayurvedic Haven',
    slug: 'kerala-backwaters-tea-hills-ayurveda',
    destination: 'Alleppey, Kumarakom & Munnar',
    country: 'India',
    region: 'South India',
    category: 'Wellness',
    tag: 'Pure Tranquility',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ],
    durationDays: 7,
    durationNights: 6,
    pricePerPerson: 2180, // ~₹1,85,000 INR
    originalPrice: 2550,
    rating: 4.97,
    reviewCount: 174,
    maxGroupSize: 6,
    difficulty: 'Easy',
    featured: true,
    shortDescription: 'Drift through palm-fringed lagoons aboard a private handcrafted teak houseboat, wander mist-kissed Munnar tea gardens, and rejuvenate with authentic Ayurvedic therapies.',
    fullDescription: 'God’s Own Country in pristine seclusion. Glide effortlessly along tranquil labyrinthine waterways on your private air-conditioned solar-teak Kettuvallam houseboat with private chef. Ascend to cloud-wrapped colonial tea plantations in Munnar, sample freshly picked cardamom and cinnamon, and experience holistic wellness consultations with master Ayurvedic physicians.',
    highlights: [
      '2 nights aboard a private luxury Kettuvallam houseboat with private chef',
      'Bespoke Ayurvedic rejuvenation treatments and daily sunrise yoga',
      'Private bungalow stay amidst lush organic tea estates in Munnar',
      'Kathakali classical dance and Kalaripayattu martial arts private recital'
    ],
    included: [
      '6 nights luxury accommodation (private houseboat + 5-star heritage resorts)',
      'All gourmet meals prepared fresh with organic Malabar spices & catch of the day',
      'Daily 90-minute traditional Ayurvedic wellness & herbal steam sessions',
      'All chauffeured private transfers in executive Mercedes MPV',
      'Private plantation naturalist and English/Hindi speaking tour host'
    ],
    excluded: [
      'Airfare to/from Cochin International Airport (COK)',
      'Personal boutique purchases & top-shelf imported spirits',
      'Travel and medical insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Fort Kochi: Portuguese Mansions & Chinese Fishing Nets',
        description: 'Chauffeur pickup from Cochin Airport. Private heritage walk through Mattancherry Jewish Synagogue and sunset watch by the iconic Chinese fishing nets.',
        meals: 'Welcome Malabar Dinner',
        stay: 'Brunton Boatyard / Malabar House'
      },
      {
        day: 2,
        title: 'Into the Emerald Lagoons: Boarding Private Teak Houseboat',
        description: 'Board your private double-deck teakwood Kettuvallam at Alleppey jetty. Float past coir villages, water lilies, and local fishermen under swaying coconut canopies.',
        meals: 'Breakfast, Karimeen Fish Curry Lunch, Dinner',
        stay: 'Private Luxury Houseboat, Alleppey'
      },
      {
        day: 3,
        title: 'Vembanad Lake Serenity & Sanctuary Arrival in Kumarakom',
        description: 'Early morning canoe ride along hidden canal tributaries observing migratory kingfishers. Dock at Kumarakom Lake Resort for restorative Ayurvedic oil therapy.',
        meals: 'Breakfast, Lunch, Seafood Banquet',
        stay: 'Kumarakom Lake Resort'
      },
      {
        day: 4,
        title: 'Ascent to the Cloud Forests: Munnar Tea & Spice Plantations',
        description: 'Scenic climb through Western Ghat waterfalls to the rolling emerald carpet of Munnar tea hills. Check into your private colonial plantation villa.',
        meals: 'Breakfast, Estate High Tea, Dinner',
        stay: 'Windermere Estate / Fragrant Nature'
      },
      {
        day: 5,
        title: 'Private Tea Factory Tour & Eravikulam Nilgiri Tahr Encounter',
        description: 'Harvest tea leaves alongside local artisans, sample rare white tea vintages, and take a gentle guided trek in Eravikulam National Park.',
        meals: 'Breakfast, Organic Garden Lunch, Dinner',
        stay: 'Windermere Estate, Munnar'
      },
      {
        day: 6,
        title: 'Spice Sanctuary Walk & Farewell Kathakali Performance',
        description: 'Discover wild cardamom, vanilla pods, and nutmeg in private spice groves. Evening private Kathakali performance with exclusive makeup dressing access.',
        meals: 'Breakfast, Kerala Sadhya Feast',
        stay: 'Windermere Estate'
      },
      {
        day: 7,
        title: 'Scenic Descent & Cochin Airport Executive Transfer',
        description: 'Final morning yoga session overlooking the misty tea valleys before your executive transfer to Cochin International Airport.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ],
    availableDates: ['2026-09-15', '2026-10-20', '2026-11-18', '2026-12-10', '2026-01-22'],
    reviews: [
      {
        id: 'rev-ker-1',
        userName: 'Marcus & Sophia Lindqvist',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userCountry: 'Sweden',
        rating: 5,
        date: 'January 2026',
        comment: 'Sipping fresh coconut water while gliding silently down the Alleppey backwaters on our own private houseboat was pure bliss. The Ayurvedic therapies erased a year of stress.'
      }
    ]
  },
  {
    id: 'tour-ladakh-himalayan-silkroute',
    title: 'Ladakh & Nubra Valley: The High Himalayan Silk Route & Pangong Tso Expedition',
    slug: 'ladakh-nubra-valley-himalayan-expedition',
    destination: 'Leh, Nubra Valley, Pangong Tso & Khardung La',
    country: 'India',
    region: 'Himalayan Frontier',
    category: 'Adventure',
    tag: 'High Altitude Odyssey',
    heroImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80'
    ],
    durationDays: 8,
    durationNights: 7,
    pricePerPerson: 2470, // ~₹2,10,000 INR
    originalPrice: 2890,
    rating: 4.98,
    reviewCount: 156,
    maxGroupSize: 8,
    difficulty: 'Moderate',
    featured: true,
    shortDescription: 'Cross Khardung La—one of the highest motorable passes on earth, stargaze at Pangong Tso lake, and ride Bactrian camels across the high-altitude sand dunes of Nubra.',
    fullDescription: 'Journey into the ethereal, high-altitude realm of Little Tibet. Marvel at 1,000-year-old cliffside Buddhist monasteries chanting morning mantras, gaze at the crystalline cobalt waters of Pangong Tso mirroring jagged snow peaks, and sleep in heated luxury geodesic glamping domes under the blazing Milky Way.',
    highlights: [
      'Traverse Khardung La Pass (17,982 ft) in luxury 4x4 expedition vehicles',
      'Private sunset over the sapphire expanse of Pangong Tso lake',
      'Stargazing astronomy session with high-powered telescope in Nubra Valley',
      'Private blessing with Buddhist monks at Thiksey and Hemis monasteries'
    ],
    included: [
      '7 nights in heated luxury glamping domes & 5-star boutique Himalayan retreats',
      'All organic Himalayan gourmet meals, warming mountain broths, and beverages',
      'Dedicated expedition fleet of Toyota Land Cruisers with oxygen support',
      'All inner-line frontier permits, environmental passes, and monastery fees',
      'Expedition doctor consultation, acclimatization protocol, and private guide'
    ],
    excluded: [
      'Flights to/from Kushok Bakula Rimpochee Airport, Leh (IXL)',
      'Personal high-altitude trekking gear and discretionary gratuities',
      'Travel and medical insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh (11,500 ft): Gentle Acclimatization & Herbal Teas',
        description: 'Executive arrival greeting at Leh Airport. Transfer to your luxury retreat with oxygen-enriched suites. Gentle relaxation and acclimatization briefing.',
        meals: 'Light Himalayan Dinner',
        stay: 'The Grand Dragon / Chamba Camp Thiksey'
      },
      {
        day: 2,
        title: 'Monastery Morning Chants: Thiksey & Shey Palace',
        description: 'Witness dawn conch shells and deep bass horn chanting at Thiksey Monastery. Private tour of the ancient copper Maitreya Buddha statue and Indus riverbanks.',
        meals: 'Breakfast, Ladakhi Lunch, Dinner',
        stay: 'The Grand Dragon, Leh'
      },
      {
        day: 3,
        title: 'Crossing Khardung La (17,982 ft) into the Nubra Valley',
        description: 'Ascend the legendary Khardung La pass with snow-capped Karakoram views. Descend into the lush oasis of Nubra Valley and check into luxury yurts.',
        meals: 'Breakfast, Mountain Pass Lunch, Dinner',
        stay: 'Lchang Nang Retreat / Chamba Camp'
      },
      {
        day: 4,
        title: 'Hunder White Sand Dunes & Double-Humped Bactrian Camels',
        description: 'Explore the surreal high-altitude white sand dunes of Hunder. Ride double-humped Bactrian camels and visit the 106-foot golden Buddha at Diskit Monastery.',
        meals: 'Breakfast, Picnic Lunch, Stargazing Dinner',
        stay: 'Lchang Nang Retreat, Nubra'
      },
      {
        day: 5,
        title: 'Shyok River Route to Cobalt Pangong Tso Lake',
        description: 'Drive along the turquoise Shyok River into the breathtaking basin of Pangong Tso. Watch the lake shift from turquoise to indigo as twilight descends.',
        meals: 'Breakfast, Lakeside Lunch, Campfire Feast',
        stay: 'Pangong Glamping Domes'
      },
      {
        day: 6,
        title: 'Sunrise Reflections on Pangong & Return via Chang La Pass',
        description: 'Wake to pink sunrise rays illuminating snow peaks mirrored in Pangong Tso. Journey back to Leh crossing Chang La Pass (17,590 ft).',
        meals: 'Breakfast, Picnic Lunch, Gala Dinner',
        stay: 'The Grand Dragon, Leh'
      },
      {
        day: 7,
        title: 'Old Town Leh Heritage Walk & Shanti Stupa Golden Hour',
        description: 'Explore ancient cobblestone alleys, Tibetan gemstone bazaars, and end at Shanti Stupa for panoramic sunset vistas of the Leh valley.',
        meals: 'Breakfast, Farewell Tibetan Banquet',
        stay: 'The Grand Dragon, Leh'
      },
      {
        day: 8,
        title: 'Departure from Leh: Mountain Flight over the Himalayas',
        description: 'Private transfer to Leh airport for your scenic flight over the snow-covered Himalayan peaks back to Delhi.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ],
    availableDates: ['2026-05-20', '2026-06-14', '2026-07-10', '2026-08-05', '2026-09-02'],
    reviews: [
      {
        id: 'rev-lad-1',
        userName: 'Rohan & Ananya Deshmukh',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        userCountry: 'India (Bengaluru)',
        rating: 5,
        date: 'July 2026',
        comment: 'Pangong Tso under a sky filled with a billion stars is something you remember forever. The luxury heated glamping domes made high altitude feel like a 5-star hotel.'
      }
    ]
  },
  {
    id: 'tour-ranthambore-tiger-safari',
    title: 'Ranthambore & Bandhavgarh: Royal Bengal Tiger Safari & Jungle Machan',
    slug: 'ranthambore-bandhavgarh-tiger-safari',
    destination: 'Ranthambore & Bandhavgarh National Parks',
    country: 'India',
    region: 'Central & West India',
    category: 'Eco & Wildlife',
    tag: 'Apex Wildlife Tracking',
    heroImage: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547407139-3c921a66005c?auto=format&fit=crop&w=1200&q=80'
    ],
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 2820, // ~₹2,40,000 INR
    originalPrice: 3200,
    rating: 4.99,
    reviewCount: 189,
    maxGroupSize: 6,
    difficulty: 'Easy',
    featured: true,
    shortDescription: 'Track majestic Royal Bengal Tigers through ancient banyan forests and ruins of 10th-century fortresses with India’s foremost wildlife naturalists.',
    fullDescription: 'Enter the ancestral hunting grounds of Maharajas. Board custom open-top 4x4 safaris equipped with telephoto lens mounts and private senior naturalists. Search for wild tigers, leopards, sloth bears, and sambar deer roaming around centuries-old cenotaphs, then retire to ultra-luxury tented safari lodges with private plunge pools.',
    highlights: [
      '6 private 4x4 open safari drives in premium high-sighting tiger zones',
      'Led by renowned veteran Indian tiger naturalists and track experts',
      'Stay in colonial luxury tented pavilions with private heated plunge pools',
      'Sunset champagne toast atop the ancient cliffside ruins of Ranthambore Fort'
    ],
    included: [
      '5 nights luxury safari lodge accommodation (e.g., Oberoi Vanyavilas / Suján Sher Bagh)',
      'All gourmet chef-curated meals & private candlelit bush dinners under the stars',
      'Exclusive private 4x4 gypsy vehicles (no sharing with outside travelers)',
      'All government park safari permits, zone allocations, and photography permits',
      'Complimentary pair of high-magnification Swarovski binoculars per guest'
    ],
    excluded: [
      'Flights to Jaipur / Delhi and onward regional domestic connections',
      'Heavy professional commercial film camera permit fees (if applicable)',
      'Personal purchases and discretionary tips to safari trackers'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jaipur & Chauffeur Transfer to Ranthambore',
        description: 'Meet your private wildlife concierge at Jaipur Airport. Drive through rural Rajasthan to your luxury tented lodge in Ranthambore. Evening naturalist briefing.',
        meals: 'Jungle Welcome Banquet',
        stay: 'The Oberoi Vanyavilas / Suján Sher Bagh'
      },
      {
        day: 2,
        title: 'Dawn & Dusk Safari Drives: Tracking the Royal Bengal Tiger',
        description: 'Early morning entry into Core Zone 1-5. Track pugmarks near Rajbagh Lake. Afternoon safari searching for marsh crocodiles and hunting leopards.',
        meals: 'Breakfast, Safari Lunch, Campfire Dinner',
        stay: 'The Oberoi Vanyavilas'
      },
      {
        day: 3,
        title: 'Ranthambore Fort Ramparts & Deep Forest Safari',
        description: 'Visit the UNESCO 10th-century cliff-top fortress with panoramic views over the jungle canopy. Late afternoon safari targeting dry deciduous riverbeds.',
        meals: 'Breakfast, Gourmet Lunch, Bush Dinner',
        stay: 'The Oberoi Vanyavilas'
      },
      {
        day: 4,
        title: 'Exclusive Morning Safari & Village Craft Immersion',
        description: 'Third morning safari capturing golden hour light. Afternoon visit to Dastkar Ranthambore women artisan cooperative to observe block-printing and pottery.',
        meals: 'Breakfast, Chef’s Garden Lunch, Dinner',
        stay: 'Suján Sher Bagh'
      },
      {
        day: 5,
        title: 'Final Apex Predator Safari & Stargazing Bush Dinner',
        description: 'Final game drive focused on elusive sloth bears and mother tigers with cubs. In the evening, gather for a private bush barbecue accompanied by local folk instruments.',
        meals: 'Breakfast, Lunch, Stargazing Gala Dinner',
        stay: 'Suján Sher Bagh'
      },
      {
        day: 6,
        title: 'Farewell to the Wild: Executive Chauffeur to Jaipur / Delhi',
        description: 'Relaxed breakfast in your private pavilion garden before your executive transfer to Jaipur or Delhi international airport.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ],
    availableDates: ['2026-10-05', '2026-11-12', '2026-12-08', '2026-02-14', '2026-03-20'],
    reviews: [
      {
        id: 'rev-saf-1',
        userName: 'Harrison & Claire Sterling',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userCountry: 'United States',
        rating: 5,
        date: 'November 2025',
        comment: 'We saw three different tigers in their wild habitat, including a magnificent male drinking at the edge of the lake near the ancient ruins. Our naturalist knew every tiger by name and pedigree.'
      }
    ]
  },
  {
    id: 'tour-varanasi-sacred-ganges',
    title: 'Varanasi, Khajuraho & Agra: The Golden Triangle & Sacred Ganges',
    slug: 'varanasi-khajuraho-agra-sacred-ganges',
    destination: 'Varanasi, Agra & Khajuraho',
    country: 'India',
    region: 'North & Central India',
    category: 'Cultural',
    tag: 'Spiritual & Sacred Heritage',
    heroImage: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598890777032-bde13fba5be3?auto=format&fit=crop&w=1200&q=80'
    ],
    durationDays: 7,
    durationNights: 6,
    pricePerPerson: 2290, // ~₹1,95,000 INR
    originalPrice: 2650,
    rating: 4.97,
    reviewCount: 162,
    maxGroupSize: 8,
    difficulty: 'Easy',
    featured: true,
    shortDescription: 'Witness evening Ganga Aarti from your private river barge in sacred Varanasi, marvel at sunrise on the Taj Mahal, and decipher ancient temple carvings at Khajuraho.',
    fullDescription: 'Walk the spiritual heart of civilization. Float along the sacred Ganges as thousands of earthen lamps illuminate the river ghats at twilight. Contemplate 5,000 years of living philosophy with Vedic scholars, marvel at the Taj Mahal at dawn before the crowds arrive, and behold the UNESCO World Heritage temples of Khajuraho.',
    highlights: [
      'Chartered wooden Bajra boat for the mystical evening Maha Aarti ceremony',
      'Sunrise VIP guided tour of the Taj Mahal with private architectural historian',
      'Exclusive private Sitar and Tabla classical performance at a riverside haveli',
      'Stay in riverside luxury heritage suites overlooking the sacred Ganges'
    ],
    included: [
      '6 nights in premier 5-star heritage hotels (e.g., BrijRama Palace Varanasi, The Oberoi Amarvilas Agra)',
      'Daily artisan breakfast & 4 curated regional Indian gastronomic banquets',
      'Private motorboats on the Ganges with flower offering ceremonies',
      'VIP monument fast-track permits and private air-conditioned Mercedes transport',
      'Dedicated cultural anthropologist chaperone throughout the voyage'
    ],
    excluded: [
      'Domestic flights between Delhi, Varanasi, Khajuraho, and Agra',
      'Personal shopping and discretionary gratuities to priests and boatmen',
      'Travel and medical insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in the Eternal City of Varanasi & Riverboat Check-in',
        description: 'Chauffeur greeting at Varanasi Airport. Transfer to the riverbank and board a private royal barge to reach BrijRama Palace, an 1812 riverside fortress.',
        meals: 'Welcome Sattvic Feast',
        stay: 'BrijRama Palace, Varanasi'
      },
      {
        day: 2,
        title: 'Subah-e-Banaras Sunrise Boat & Evening Maha Aarti',
        description: 'Dawn rowing boat along Manikarnika and Assi Ghats as morning prayers ring out. Evening private elevated barge seating for the spellbinding Dashashwamedh Aarti.',
        meals: 'Breakfast, Benarasi Tasting Lunch, Dinner',
        stay: 'BrijRama Palace, Varanasi'
      },
      {
        day: 3,
        title: 'Sarnath Deer Park & Classical Sitar Recital in Ancient Haveli',
        description: 'Visit Sarnath where Lord Buddha gave his first sermon 2,500 years ago. Evening private Sitar and Tabla recital with maestro musicians in a 200-year-old courtyard.',
        meals: 'Breakfast, Royal Thali Dinner',
        stay: 'BrijRama Palace, Varanasi'
      },
      {
        day: 4,
        title: 'Flight to Khajuraho: The UNESCO Chandela Temples',
        description: 'Flight to Khajuraho. Curator walk through the Western Group of Temples exploring the sublime 10th-century stone carvings and sculptures.',
        meals: 'Breakfast, Central Indian Dinner',
        stay: 'The Lalit Temple View, Khajuraho'
      },
      {
        day: 5,
        title: 'Express Train to Agra: The City of the Taj Mahal',
        description: 'Executive Gatimaan Express train to Agra. Check in to The Oberoi Amarvilas where every single suite boasts an unobstructed view of the Taj Mahal.',
        meals: 'Breakfast, Mughal Gourmet Dinner',
        stay: 'The Oberoi Amarvilas, Agra'
      },
      {
        day: 6,
        title: 'Sunrise at the Taj Mahal & Agra Fort Imperial Quarters',
        description: 'Private dawn entrance to the Taj Mahal as marble glows pink and amber. Afternoon exploration of the Jahangiri Mahal and red sandstone ramparts of Agra Fort.',
        meals: 'Breakfast, High Tea, Farewell Feast',
        stay: 'The Oberoi Amarvilas, Agra'
      },
      {
        day: 7,
        title: 'Fatehpur Sikri & Chauffeur Transfer to New Delhi',
        description: 'Visit the ghost city of Fatehpur Sikri en route to New Delhi for international departure or hotel transfer.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ],
    availableDates: ['2026-10-18', '2026-11-20', '2026-12-15', '2026-01-18', '2026-02-22'],
    reviews: [
      {
        id: 'rev-var-1',
        userName: 'Dr. Evelyn Sato',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        userCountry: 'Canada',
        rating: 5,
        date: 'December 2025',
        comment: 'Floating on the Ganges at dusk surrounded by thousands of glowing oil lamps and listening to the rhythmic chanting was deeply transformative. The view of the Taj Mahal from our Amarvilas suite balcony was unreal.'
      }
    ]
  },
  {
    id: 'tour-kashmir-paradise-on-earth',
    title: 'Kashmir Paradise: Dal Lake Cedar Houseboats & Gulmarg Alpine Peaks',
    slug: 'kashmir-dal-lake-gulmarg-alpine-paradise',
    destination: 'Srinagar, Gulmarg & Pahalgam',
    country: 'India',
    region: 'Northern Himalayas',
    category: 'Luxury',
    tag: 'Himalayan Paradise',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626014303757-656447731871?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
    ],
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 2060, // ~₹1,75,000 INR
    originalPrice: 2400,
    rating: 4.96,
    reviewCount: 148,
    maxGroupSize: 8,
    difficulty: 'Easy',
    featured: false,
    shortDescription: 'Stay on private hand-carved cedarwood houseboats on peaceful Nigeen Lake, take private Shikara rides, and ascend the Gulmarg alpine gondola.',
    fullDescription: 'Referred to by Mughal Emperor Jahangir as paradise on earth. Relax in hand-carved walnut-paneled cedar houseboats with personal butlers on serene Nigeen Lake. Traverse terraced Mughal gardens blooming with chinar trees, glide in cushioned Shikaras through floating vegetable markets, and ride the world’s highest ski gondola in Gulmarg.',
    highlights: [
      'Private luxury heritage cedarwood houseboat stay on tranquil Nigeen Lake',
      'Daily private Shikara rides with saffron Kehwa tea and Kashmiri cookies',
      'Phase 2 Gulmarg Gondola VIP pass ascending to Apharwat Peak (13,780 ft)',
      'Traditional 36-course royal Wazwan feast prepared by master Wazas'
    ],
    included: [
      '5 nights in luxury cedarwood suites & 5-star mountain chalets (The Khyber Gulmarg)',
      'All meals including authentic Kashmiri Wazwan banquets and high teas',
      'Private heated Shikara boat on call 24 hours a day',
      'All gondola passes, Mughal garden permits, and heating amenities',
      'Private executive 4x4 SUV transfers throughout Kashmir valley'
    ],
    excluded: [
      'Flights to/from Sheikh ul-Alam International Airport, Srinagar (SXR)',
      'Pashmina shawl purchases and personal walnut wood souvenirs',
      'Travel and medical insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar & Nigeen Lake Houseboat Check-in',
        description: 'Chauffeur greeting at Srinagar Airport. Transfer to Nigeen Lake and board your hand-carved cedar houseboat with warm saffron Kehwa tea.',
        meals: 'Traditional Kashmiri Dinner',
        stay: 'Sukoon Houseboat / Butt’s Clermont'
      },
      {
        day: 2,
        title: 'Dawn Floating Flower Market & The Royal Mughal Gardens',
        description: 'Silent sunrise Shikara row to the centuries-old floating vegetable and flower market. Afternoon walk through Nishat Bagh and Shalimar Bagh terraced fountains.',
        meals: 'Breakfast, Kashmiri Lunch, Dinner',
        stay: 'Sukoon Houseboat, Srinagar'
      },
      {
        day: 3,
        title: 'Ascent to Pine-Clad Gulmarg & The Khyber Himalayan Resort',
        description: 'Drive through apple orchards and pine forests to Gulmarg. Check in to The Khyber Himalayan Resort & Spa with panoramic snow peak vistas.',
        meals: 'Breakfast, Mountain Chalet Lunch, Dinner',
        stay: 'The Khyber Himalayan Resort & Spa'
      },
      {
        day: 4,
        title: 'Gulmarg Gondola to Apharwat Peak (13,780 ft)',
        description: 'VIP boarding of the Gulmarg Gondola Phase 1 and Phase 2 reaching snow-covered Apharwat Peak. Afternoon golf walk or heated indoor pool relaxation.',
        meals: 'Breakfast, Alpine Lunch, Dinner',
        stay: 'The Khyber Himalayan Resort'
      },
      {
        day: 5,
        title: 'Pashmina Artisan Workshops & 36-Course Royal Wazwan Feast',
        description: 'Return to Srinagar. Visit master weavers spinning authentic GI-tagged Cashmere Pashmina shawls. Celebrate your farewell night with a 36-course royal Wazwan banquet.',
        meals: 'Breakfast, Lunch, Royal Wazwan Gala',
        stay: 'Sukoon Houseboat / Vivanta Dal View'
      },
      {
        day: 6,
        title: 'Farewell Kashmir: Executive Airport Chauffeur Transfer',
        description: 'Final morning view of misty Dal Lake before your executive chauffeur transfer to Srinagar Airport.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ],
    availableDates: ['2026-04-10', '2026-05-18', '2026-06-22', '2026-09-12', '2026-10-15'],
    reviews: [
      {
        id: 'rev-kas-1',
        userName: 'Vikram & Radhika Nair',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        userCountry: 'India (New Delhi)',
        rating: 5,
        date: 'October 2025',
        comment: 'Staying on Sukoon Houseboat with hot Kehwa and roasted chestnuts while mist lifted over Nigeen Lake was unforgettable. The Wazwan dinner was out of this world.'
      }
    ]
  },
  {
    id: 'tour-goa-konkan-luxury-villas',
    title: 'Goa & Konkan Coast: Private Beachfront Villas, Spice Estates & Yacht Charter',
    slug: 'goa-konkan-private-villas-yacht-charter',
    destination: 'South Goa & Konkan Coast',
    country: 'India',
    region: 'West Coast India',
    category: 'Beach & Coast',
    tag: 'Coastal Elegance',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 1940, // ~₹1,65,000 INR
    originalPrice: 2250,
    rating: 4.95,
    reviewCount: 132,
    maxGroupSize: 8,
    difficulty: 'Easy',
    featured: false,
    shortDescription: 'Secluded private white-sand beach villas in South Goa, private catamaran charter on the Arabian Sea, and Portuguese heritage mansion dining.',
    fullDescription: 'Experience the refined, tranquil side of Goa far from the crowded tourist strips. Settle into an oceanfront private villa overlooking the pristine sands of South Goa. Charter a luxury catamaran across the Mandovi river and Arabian Sea, tour organic heritage spice plantations with a private masterchef, and dine in centuries-old Indo-Portuguese estates.',
    highlights: [
      'Exclusive private 4-bedroom oceanfront villa with infinity pool and butler',
      'Half-day private luxury catamaran cruise with dolphin spotting and champagne',
      'Private walking tour of Fontainhas Latin Quarter with resident historian',
      'Artisan Feni distillation workshop and multi-course Goan-Portuguese tasting'
    ],
    included: [
      '4 nights in a 5-star private beachfront villa (The Leela / Taj Exotica South Goa)',
      'Daily bespoke villa breakfast and 3 curated coastal gourmet dinners',
      'Private 42-foot catamaran charter with crew and open premium bar',
      'All heritage entry permits, airport transfers, and private chauffeur',
      'Dedicated personal concierge and local insider host'
    ],
    excluded: [
      'Flights to/from Goa MOPA (GOX) or Dabolim (GOI) airports',
      'Personal water sports and boutique purchases',
      'Travel and medical insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Goa: Private Chauffeur to Oceanfront South Villa',
        description: 'VIP airport greeting and chauffeur transfer to your private beach villa in South Goa. Welcome chilled coconut water and sunset stroll on pristine white sands.',
        meals: 'Welcome Goan Seafood Feast',
        stay: 'The Leela Goa / Private Beach Villa'
      },
      {
        day: 2,
        title: 'Private Catamaran Charter on the Arabian Sea',
        description: 'Board your chartered catamaran from Grand Island. Sail alongside playful pods of Indo-Pacific humpback dolphins, swim in calm coves, and enjoy a grilled lobster lunch.',
        meals: 'Breakfast, Catamaran Seafood Lunch, Dinner',
        stay: 'The Leela Goa'
      },
      {
        day: 3,
        title: 'Fontainhas Latin Quarter & Palácio do Deão Dining',
        description: 'Explore the pastel-hued Portuguese streets of Fontainhas in Panaji. Private lunch at the historic 18th-century Palácio do Deão estate in Quepem.',
        meals: 'Breakfast, Heritage Estate Lunch, Dinner',
        stay: 'The Leela Goa'
      },
      {
        day: 4,
        title: 'Heritage Spice Plantation Walk & Sunset Beach Barbecue',
        description: 'Explore a 130-acre organic spice plantation learning medicinal herbal uses. Evening private bonfire and barbecue on your secluded beach with live acoustic bossa nova.',
        meals: 'Breakfast, Traditional Plantain Leaf Lunch, Beach BBQ',
        stay: 'The Leela Goa'
      },
      {
        day: 5,
        title: 'Morning Yoga on the Sands & Airport Transfer',
        description: 'Gentle morning yoga overlooking the Arabian Sea followed by a relaxed tropical breakfast before your executive transfer to Goa Airport.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ],
    availableDates: ['2026-10-12', '2026-11-15', '2026-12-20', '2026-01-10', '2026-02-18'],
    reviews: [
      {
        id: 'rev-goa-1',
        userName: 'Arjun & Tara Kapur',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        userCountry: 'India (Mumbai)',
        rating: 5,
        date: 'January 2026',
        comment: 'South Goa with Aura Voyages was completely quiet, peaceful, and sublime. The private catamaran day was the highlight of our winter.'
      }
    ]
  },
  {
    id: 'tour-andaman-island-escape',
    title: 'Andaman & Nicobar: Havelock Island Radhanagar Beach & Coral Reefs',
    slug: 'andaman-nicobar-havelock-island-escape',
    destination: 'Havelock Island & Neil Island',
    country: 'India',
    region: 'Bay of Bengal Islands',
    category: 'Beach & Coast',
    tag: 'Tropical Eden',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    durationDays: 7,
    durationNights: 6,
    pricePerPerson: 2650, // ~₹2,25,000 INR
    originalPrice: 3000,
    rating: 4.98,
    reviewCount: 140,
    maxGroupSize: 8,
    difficulty: 'Moderate',
    featured: true,
    shortDescription: 'Unwind at world-renowned Radhanagar Beach, scuba dive untouched coral atolls, and kayak through glowing bioluminescent mangrove lagoons.',
    fullDescription: 'India’s premier island frontier. Venture across turquoise waters to Havelock and Neil Islands. Stay in eco-luxury teak villas tucked inside rainforest canopies steps from powdery white beaches. Embark on private scuba excursions over thriving coral gardens, enjoy candlelit seaside dinners, and witness nocturnal bioluminescent phytoplankton.',
    highlights: [
      'Stay in luxury villas at Taj Exotica Resort & Spa on Radhanagar Beach',
      'PADI Master certified private scuba diving at pristine offshore coral reefs',
      'Night kayaking through bioluminescent mangrove waters in Havelock',
      'Private luxury catamaran transfers between Port Blair, Havelock & Neil'
    ],
    included: [
      '6 nights in 5-star island beachfront villas (Taj Exotica Andaman)',
      'All gourmet tropical breakfasts and 4 curated seaside dining feasts',
      'Private scuba diving & snorkeling equipment with dedicated dive master',
      'All high-speed private catamaran tickets, port transfers, and permits',
      '24/7 dedicated Island Host and marine naturalist'
    ],
    excluded: [
      'Flights to/from Veer Savarkar International Airport, Port Blair (IXZ)',
      'Advanced deep wreck diving certification courses (optional)',
      'Travel and medical insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Port Blair & Historic Cellular Jail Light Show',
        description: 'Executive arrival greeting at Port Blair. Check in to seaside heritage hotel. Evening private pass to the Cellular Jail national memorial light and sound show.',
        meals: 'Welcome Island Dinner',
        stay: 'Welcomhotel by ITC, Port Blair'
      },
      {
        day: 2,
        title: 'Luxury Catamaran to Havelock & Radhanagar Sunset',
        description: 'Board premium class catamaran to Havelock Island. Check in to Taj Exotica Andaman. Walk the golden sands of Radhanagar Beach (voted Asia’s best beach) at sunset.',
        meals: 'Breakfast, Beachside Lunch, Dinner',
        stay: 'Taj Exotica Resort & Spa, Havelock'
      },
      {
        day: 3,
        title: 'Elephant Beach Coral Reef Snorkel & Scuba Experience',
        description: 'Private speedboat to Elephant Beach. Guided scuba dive observing sea turtles, clownfish, and staghorn corals in crystal-clear visibility.',
        meals: 'Breakfast, Seafood Lunch, Dinner',
        stay: 'Taj Exotica Resort & Spa'
      },
      {
        day: 4,
        title: 'Bioluminescent Mangrove Kayaking by Night',
        description: 'Leisurely daytime spa relaxation. At nightfall, paddle into serene mangrove lagoons where every paddle stroke ignites glowing blue bioluminescence.',
        meals: 'Breakfast, Lunch, Stargazing Dinner',
        stay: 'Taj Exotica Resort & Spa'
      },
      {
        day: 5,
        title: 'Neil Island Natural Rock Bridge & Bharatpur Beach',
        description: 'Day catamaran trip to Neil Island. Observe natural living coral rock formations and relax under ancient Mahua trees on secluded Laxmanpur Beach.',
        meals: 'Breakfast, Island Picnic, Dinner',
        stay: 'Taj Exotica Resort & Spa'
      },
      {
        day: 6,
        title: 'Rainforest Canopy Walk & Farewell Coastal Barbecue',
        description: 'Guided morning walk through virgin evergreen rainforest observing endemic Andaman birds. Evening private beachfront seafood barbecue with grilled king prawns.',
        meals: 'Breakfast, Lunch, Farewell Gala BBQ',
        stay: 'Taj Exotica Resort & Spa'
      },
      {
        day: 7,
        title: 'Catamaran Return to Port Blair & Flight Connections',
        description: 'Morning private catamaran return to Port Blair. Executive transfer to Veer Savarkar Airport for onward flights to Delhi, Chennai, or Kolkata.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ],
    availableDates: ['2026-10-15', '2026-11-25', '2026-12-18', '2026-01-20', '2026-02-15'],
    reviews: [
      {
        id: 'rev-and-1',
        userName: 'Siddharth & Tanya Roy',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userCountry: 'India (Kolkata)',
        rating: 5,
        date: 'February 2026',
        comment: 'Radhanagar Beach looks like a dream. Bioluminescent night kayaking through the mangroves was like paddling through the stars. The Taj Exotica villa was beyond luxury.'
      }
    ]
  }
];

export const POPULAR_DESTINATIONS = [
  'All Destinations',
  'Rajasthan & Palaces',
  'Kerala Backwaters',
  'Ladakh Himalayas',
  'Ranthambore Tigers',
  'Varanasi & Ganges',
  'Kashmir Paradise',
  'Goa & Konkan',
  'Andaman Islands'
];

export const TRAVEL_CATEGORIES = [
  'All',
  'Luxury',
  'Adventure',
  'Cultural',
  'Beach & Coast',
  'Eco & Wildlife',
  'Wellness'
] as const;

export const BOOKING_ADDONS = [
  {
    id: 'addon-airport-vip',
    name: 'VIP Royal Airport Chauffeur & Garland Greeting',
    price: 150,
    description: 'Executive sedan greeting with traditional Indian floral garland, fresh coconut water, and luggage porterage.'
  },
  {
    id: 'addon-ayurveda-spa',
    name: 'Holistic Ayurvedic Spa & Wellness Package',
    price: 280,
    description: 'Two 90-minute traditional herbal oil Abhyanga & Shirodhara therapies curated by an Ayurvedic doctor.'
  },
  {
    id: 'addon-carbon-offset',
    name: '200% Green Bharat Certified Carbon Offset',
    price: 45,
    description: 'Dedicated plantation of 30 indigenous Indian shade and fruit trees in Himalayan / Aravalli reforestation corridors.'
  },
  {
    id: 'addon-single-suite',
    name: 'Maharaja Heritage Suite Upgrade Guaranteed',
    price: 420,
    description: 'Upgrade to a premier lake-view, palace courtyard, or ocean-facing royal suite with no single supplement.'
  }
];

export const AGENCY_DETAILS = {
  name: 'Aura Voyages India',
  legalName: 'Aura Voyages India Pvt. Ltd.',
  tagline: 'Curators of Bespoke Indian Expeditions & Royal Heritage Journeys',
  ownerEmail: 'anmolrahangdale69@gmail.com',
  phone: '+91 (11) 4920-8800',
  whatsapp: '+91 98110 54321',
  address: 'Suite 402, Statesman House, Barakhamba Road, Connaught Place, New Delhi 110001, India',
  branches: 'New Delhi • Udaipur • Kochi • Srinagar',
  rating: 4.98,
  totalTripsCompleted: 4650,
  countriesCovered: 28,
  satisfactionRate: '99.4%'
};
