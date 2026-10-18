import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  Unsubscribe 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';

export interface FirestoreBooking {
  id?: string;
  userId: string;
  destination: string;
  tripName: string;
  pickupLocation: string;
  dropLocation: string;
  travelDates: string;
  travelDate: string;
  travelTime: string;
  returnDate?: string;
  returnTime?: string;
  tripType: string;
  travellers: number;
  totalPrice: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingReference: string;
  vehicleId?: string;
  vehicleName: string;
  paymentMethod: string;
  distanceKm?: number;
  createdAt: string;
}

/**
 * Creates and persists a booking document in Firestore under /bookings/{bookingId}
 */
export async function createBooking(booking: Omit<FirestoreBooking, 'id'>): Promise<string> {
  const bookingId = booking.bookingReference 
    ? booking.bookingReference.replace(/[^a-zA-Z0-9_-]/g, '')
    : `BT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const path = `bookings/${bookingId}`;
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    
    // Clean and validate payload to strictly match schema blueprint
    const payload: Record<string, any> = {
      userId: booking.userId,
      destination: booking.destination.substring(0, 250),
      tripName: booking.tripName.substring(0, 250),
      pickupLocation: (booking.pickupLocation || '').substring(0, 200),
      dropLocation: (booking.dropLocation || '').substring(0, 200),
      travelDates: (booking.travelDates || '').substring(0, 100),
      travelDate: (booking.travelDate || '').substring(0, 50),
      travelTime: (booking.travelTime || '').substring(0, 50),
      tripType: (booking.tripType || '').substring(0, 50),
      travellers: Number(booking.travellers) || 1,
      totalPrice: Number(booking.totalPrice) || 0,
      contactName: (booking.contactName || '').substring(0, 100),
      contactPhone: (booking.contactPhone || '').substring(0, 50),
      status: booking.status || 'confirmed',
      bookingReference: (booking.bookingReference || bookingId).substring(0, 100),
      vehicleName: (booking.vehicleName || '').substring(0, 100),
      paymentMethod: (booking.paymentMethod || 'cod').substring(0, 50),
      createdAt: booking.createdAt || new Date().toISOString()
    };

    if (booking.returnDate) payload.returnDate = booking.returnDate.substring(0, 50);
    if (booking.returnTime) payload.returnTime = booking.returnTime.substring(0, 50);
    if (booking.contactEmail) payload.contactEmail = booking.contactEmail.substring(0, 200);
    if (booking.specialRequests) payload.specialRequests = booking.specialRequests.substring(0, 1000);
    if (booking.vehicleId) payload.vehicleId = booking.vehicleId.substring(0, 100);
    if (typeof booking.distanceKm === 'number') payload.distanceKm = booking.distanceKm;

    await setDoc(bookingDocRef, payload);
    return bookingId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Subscribes to real-time changes for a specific user's bookings.
 * Enforces security rule query compliance (where userId == request.auth.uid).
 */
export function subscribeUserBookings(
  userId: string,
  onData: (bookings: FirestoreBooking[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (!userId) {
    onData([]);
    return () => {};
  }

  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const bookings: FirestoreBooking[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestoreBooking;
        bookings.push({
          ...data,
          id: docSnap.id
        });
      });

      // Sort newest first client-side
      bookings.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      onData(bookings);
    },
    (error) => {
      console.error('Error listening to bookings:', error);
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    }
  );
}

// Local storage helpers for immediate responsive feedback
// Local storage keys
const LOCAL_BOOKINGS_KEY = 'bokde_recent_rides';
const SECONDARY_BOOKINGS_KEY = 'bokde_bookings';

export function saveBookingLocally(booking: FirestoreBooking): void {
  try {
    const list = getRecentLocalBookings();
    const filtered = list.filter(b => 
      b.bookingReference !== booking.bookingReference && 
      b.id !== booking.id
    );
    filtered.unshift(booking);
    const json = JSON.stringify(filtered.slice(0, 20));
    localStorage.setItem(LOCAL_BOOKINGS_KEY, json);
    localStorage.setItem(SECONDARY_BOOKINGS_KEY, json);
  } catch (e) {
    console.warn('Local booking storage error:', e);
  }
}

export function getRecentLocalBookings(): FirestoreBooking[] {
  try {
    const map = new Map<string, FirestoreBooking>();

    const raw1 = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (raw1) {
      const arr: any[] = JSON.parse(raw1);
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          const key = item.bookingReference || item.id;
          if (key) map.set(key, item);
        });
      }
    }

    const raw2 = localStorage.getItem(SECONDARY_BOOKINGS_KEY);
    if (raw2) {
      const arr: any[] = JSON.parse(raw2);
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          const key = item.bookingReference || item.id;
          if (key && !map.has(key)) map.set(key, item);
        });
      }
    }

    const result = Array.from(map.values());
    result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return result;
  } catch {
    return [];
  }
}

export function updateLocalBookingStatus(bookingIdOrRef: string, status: 'confirmed' | 'pending' | 'cancelled'): void {
  try {
    const list = getRecentLocalBookings();
    const cleanTarget = bookingIdOrRef.trim().toLowerCase().replace(/^#/, '');
    const updated = list.map(b => {
      const bRef = (b.bookingReference || '').toLowerCase().replace(/^#/, '');
      const bId = (b.id || '').toLowerCase().replace(/^#/, '');
      if (bRef === cleanTarget || bId === cleanTarget) {
        return { ...b, status };
      }
      return b;
    });
    const json = JSON.stringify(updated);
    localStorage.setItem(LOCAL_BOOKINGS_KEY, json);
    localStorage.setItem(SECONDARY_BOOKINGS_KEY, json);
  } catch (e) {
    console.warn('Local update error:', e);
  }
}

/**
 * Searches and fetches specific booking details by booking ID, reference code, or phone number.
 * Checks local storage, backend server endpoint, and Firestore.
 */
export async function lookupBookingDetails(queryTerm: string): Promise<FirestoreBooking | null> {
  if (!queryTerm || !queryTerm.trim()) return null;
  const cleanTerm = queryTerm.trim().toLowerCase().replace(/^#/, '');

  // 1. Check local storage
  const localList = getRecentLocalBookings();
  const localMatch = localList.find(b => {
    const ref = (b.bookingReference || '').toLowerCase().replace(/^#/, '');
    const id = (b.id || '').toLowerCase().replace(/^#/, '');
    const phone = (b.contactPhone || '').replace(/\D/g, '');
    const searchPhone = cleanTerm.replace(/\D/g, '');
    return ref === cleanTerm || id === cleanTerm || ref.includes(cleanTerm) || (searchPhone.length >= 6 && phone.includes(searchPhone));
  });

  if (localMatch) {
    return localMatch;
  }

  // 2. Query backend server endpoint
  try {
    const response = await fetch(`/api/bookings/lookup?query=${encodeURIComponent(queryTerm.trim())}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.booking) {
        const b = data.booking;
        const normalized: FirestoreBooking = {
          id: b.id || b.bookingReference,
          userId: b.userId || 'guest',
          destination: b.dropLocation || b.destination || 'Nagpur Route',
          tripName: b.tripName || `${b.vehicleName || 'AC Cab'} (${b.tripType || 'Trip'})`,
          pickupLocation: b.pickupLocation || 'Nagpur',
          dropLocation: b.dropLocation || b.destination || 'Wardha',
          travelDates: b.travelDate || b.travelDates || new Date().toISOString().split('T')[0],
          travelDate: b.travelDate || new Date().toISOString().split('T')[0],
          travelTime: b.travelTime || '09:00 AM',
          returnDate: b.returnDate,
          returnTime: b.returnTime,
          tripType: b.tripType || 'oneway',
          travellers: b.passengers || b.travellers || 1,
          totalPrice: b.estimatedFare || b.totalPrice || 0,
          contactName: b.customerName || b.contactName || 'Passenger',
          contactPhone: b.customerPhone || b.contactPhone || '',
          contactEmail: b.customerEmail || b.contactEmail || '',
          specialRequests: b.specialRequests || '',
          status: b.status || 'confirmed',
          bookingReference: b.bookingReference || queryTerm.trim(),
          vehicleId: b.vehicleId || 'suzuki-dzire',
          vehicleName: b.vehicleName || 'Suzuki Dzire',
          paymentMethod: b.paymentMethod || 'cod',
          distanceKm: b.distanceKm || 0,
          createdAt: b.createdAt || new Date().toISOString()
        };
        // Save locally so future lookups are instant
        saveBookingLocally(normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Backend lookup notice:', err);
  }

  // 3. Fallback: Query Firestore directly by ID
  try {
    const sanitizedId = queryTerm.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    const docRef = doc(db, 'bookings', sanitizedId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as FirestoreBooking;
      const result: FirestoreBooking = {
        ...data,
        id: snap.id
      };
      saveBookingLocally(result);
      return result;
    }
  } catch (firestoreErr) {
    console.warn('Firestore direct lookup notice:', firestoreErr);
  }

  return null;
}

/**
 * Cancels a user's booking by setting status to 'cancelled' across server, local storage, and Firestore.
 */
export async function cancelBooking(bookingIdOrRef: string): Promise<boolean> {
  const cleanId = bookingIdOrRef.trim().replace(/^#/, '');
  updateLocalBookingStatus(cleanId, 'cancelled');

  // 1. Call server cancellation endpoint
  try {
    await fetch(`/api/bookings/${encodeURIComponent(cleanId)}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.warn('Server cancel API error:', err);
  }

  // 1b. Also send PATCH for redundancy
  try {
    await fetch(`/api/bookings/${encodeURIComponent(cleanId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });
  } catch {}

  // 2. Call Firestore update
  try {
    const sanitizedId = cleanId.replace(/[^a-zA-Z0-9_-]/g, '');
    const bookingRef = doc(db, 'bookings', sanitizedId);
    await updateDoc(bookingRef, {
      status: 'cancelled'
    });
  } catch (error) {
    console.warn('Firestore cancellation update notice:', error);
  }

  return true;
}


/**
 * Migrates bookings from an old anonymous userId to a newly linked or logged-in userId
 */
export async function migrateAnonymousBookings(oldUserId: string, newUserId: string): Promise<number> {
  if (!oldUserId || !newUserId || oldUserId === newUserId) return 0;
  
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', oldUserId));
    const snapshot = await getDocs(q);
    let count = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const newDocRef = doc(db, 'bookings', `${docSnap.id}_migrated_${Date.now().toString(36)}`);
      await setDoc(newDocRef, {
        ...data,
        userId: newUserId
      });
      count++;
    }
    return count;
  } catch (err) {
    console.warn('Booking migration error (continuing with existing):', err);
    return 0;
  }
}
