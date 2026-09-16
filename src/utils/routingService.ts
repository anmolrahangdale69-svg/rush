// Bokde Travels - Modular Routing & Distance Calculation Service
import { RouteCalculationResult, TripType, VehicleConfig } from '../types';

// Curated verified highway road distances (in km) connecting Nagpur and key cities/destinations
// These are real road distances via National & State Highways (NH 53, NH 44, NH 361, Samruddhi Mahamarg)
const VERIFIED_HIGHWAY_DISTANCES: Record<string, Record<string, number>> = {
  nagpur: {
    wardha: 78,
    amravati: 155,
    chandrapur: 150,
    bhandara: 65,
    gondia: 165,
    yavatmal: 152,
    akola: 250,
    gadchiroli: 180,
    nanded: 340,
    jalgaon: 410,
    aurangabad: 480,
    'chhatrapati sambhajinagar': 480,
    nashik: 650,
    pune: 710,
    mumbai: 810,
    shirdi: 590,
    thane: 790,
    navi_mumbai: 800,
    kolhapur: 820,
    solapur: 590,
    hyderabad: 500,
    raipur: 285,
    jabalpur: 275,
    bhopal: 350,
    indore: 450,
    delhi: 1080,
    bangalore: 1040,
    goa: 980,
    'nagpur airport': 12,
    'dr. babasaheb ambedkar international airport': 12,
    'dr babasaheb ambedkar international airport': 12,
    airport: 12,
    ramtek: 54,
    kanhan: 26,
    butibori: 28,
    umred: 45,
    katol: 60,
    saoner: 38,
    tadoba: 145,
    pench: 85
  },
  wardha: {
    amravati: 110,
    chandrapur: 140,
    yavatmal: 75,
    pune: 630,
    mumbai: 730
  },
  amravati: {
    akola: 95,
    yavatmal: 90,
    pune: 550,
    mumbai: 650
  },
  pune: {
    mumbai: 150,
    shirdi: 185,
    nashik: 210,
    kolhapur: 235,
    goa: 440,
    aurangabad: 235
  },
  mumbai: {
    pune: 150,
    shirdi: 240,
    nashik: 165,
    goa: 590
  }
};

// Clean location string for matching
function normalizeLocationName(loc: string): string {
  return loc
    .toLowerCase()
    .replace(/[,\.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check local verified highway table
function checkVerifiedHighwayDistance(pickup: string, drop: string): number | null {
  const normPickup = normalizeLocationName(pickup);
  const normDrop = normalizeLocationName(drop);

  // Check direct or reverse matches
  for (const [cityA, destinations] of Object.entries(VERIFIED_HIGHWAY_DISTANCES)) {
    const matchA_Pickup = normPickup.includes(cityA);
    const matchA_Drop = normDrop.includes(cityA);

    for (const [cityB, dist] of Object.entries(destinations)) {
      const matchB_Pickup = normPickup.includes(cityB);
      const matchB_Drop = normDrop.includes(cityB);

      if ((matchA_Pickup && matchB_Drop) || (matchA_Drop && matchB_Pickup)) {
        return dist;
      }
    }
  }

  return null;
}

/**
 * Geocode address to lat/lon using OpenStreetMap Nominatim
 */
async function geocodeAddress(query: string): Promise<{ lat: number; lon: number; displayName: string } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BokdeTravelsCabApp/1.0'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Fetch driving road route distance using Project OSRM (Open Source Routing Machine)
 */
async function fetchRoadRouteOSRM(
  coord1: { lat: number; lon: number },
  coord2: { lat: number; lon: number }
): Promise<{ distanceKm: number; durationMinutes: number } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://router.project-osrm.org/route/v1/driving/${coord1.lon},${coord1.lat};${coord2.lon},${coord2.lat}?overview=false`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    if (data && data.routes && data.routes.length > 0) {
      const meters = data.routes[0].distance;
      const seconds = data.routes[0].duration;
      const distanceKm = Math.round(meters / 1000);
      const durationMinutes = Math.round(seconds / 60);
      return { distanceKm, durationMinutes };
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Main Modular Function: Calculate actual driving distance between Pickup and Drop
 * Tries server-side / routing API first, then OSRM, then verified highway table.
 */
export async function calculateRouteDistance(
  pickup: string,
  drop: string
): Promise<RouteCalculationResult> {
  const p = pickup?.trim();
  const d = drop?.trim();

  if (!p || !d) {
    return {
      success: false,
      distanceKm: 0,
      error: 'Please enter both Pickup and Drop locations.'
    };
  }

  if (normalizeLocationName(p) === normalizeLocationName(d)) {
    return {
      success: false,
      distanceKm: 0,
      error: 'Pickup and Drop locations cannot be the exact same address.'
    };
  }

  // 1. Try Backend API first if running full-stack
  try {
    const serverRes = await fetch('/api/route-distance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pickup: p, drop: d })
    });
    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData && serverData.success && serverData.distanceKm > 0) {
        return serverData;
      }
    }
  } catch (e) {
    // Continue to client-side resolver
  }

  // 2. Check verified highway table for immediate, accurate resolution
  const verifiedDist = checkVerifiedHighwayDistance(p, d);
  if (verifiedDist !== null && verifiedDist > 0) {
    const hours = Math.floor(verifiedDist / 60);
    const mins = Math.round((verifiedDist % 60) * 0.9);
    const durationText = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

    return {
      success: true,
      distanceKm: verifiedDist,
      durationText,
      fromFormatted: p,
      toFormatted: d
    };
  }

  // 3. For any other locations (custom towns, landmarks), query road routing engine
  try {
    const [geoPickup, geoDrop] = await Promise.all([
      geocodeAddress(p.includes('Nagpur') ? p : `${p}, Maharashtra, India`),
      geocodeAddress(d.includes('Nagpur') ? d : `${d}, Maharashtra, India`)
    ]);

    if (geoPickup && geoDrop) {
      const roadRoute = await fetchRoadRouteOSRM(geoPickup, geoDrop);
      if (roadRoute && roadRoute.distanceKm > 0) {
        const hrs = Math.floor(roadRoute.durationMinutes / 60);
        const remainingMins = roadRoute.durationMinutes % 60;
        const durationText = hrs > 0 ? `${hrs} hr ${remainingMins} min` : `${remainingMins} min`;

        return {
          success: true,
          distanceKm: roadRoute.distanceKm,
          durationText,
          fromFormatted: geoPickup.displayName.split(',')[0],
          toFormatted: geoDrop.displayName.split(',')[0]
        };
      }
    }
  } catch (err) {
    // Handled below
  }

  // If distance could not be determined:
  return {
    success: false,
    distanceKm: 0,
    error: `Unable to automatically calculate driving route distance between "${p}" and "${d}". Please check city/landmark spelling or call Bokde Travels at 8983275497 for manual fare assistance.`
  };
}

/**
 * Centralized Fare Calculation
 * Distance × vehicle rate
 * 
 * ONE-WAY: distanceKm × vehicle.oneWayRate
 * ROUND-TRIP: (distanceKm × 2) × vehicle.roundTripRate (ALWAYS vehicle.oneWayRate - 1)
 */
export function calculateVehicleFare(
  vehicle: VehicleConfig,
  distanceKm: number,
  tripType: TripType
): {
  fare: number;
  ratePerKm: number;
  billableKm: number;
  formulaDescription: string;
} {
  const isRoundTrip = tripType === 'roundtrip';
  const ratePerKm = isRoundTrip ? vehicle.roundTripRate : vehicle.oneWayRate;
  const billableKm = isRoundTrip ? distanceKm * 2 : distanceKm;
  const fare = Math.round(billableKm * ratePerKm);

  const formulaDescription = isRoundTrip
    ? `${distanceKm} km × 2 = ${billableKm} km @ ₹${ratePerKm}/km (Round-trip discount ₹1/km applied)`
    : `${distanceKm} km @ ₹${ratePerKm}/km`;

  return {
    fare,
    ratePerKm,
    billableKm,
    formulaDescription
  };
}
