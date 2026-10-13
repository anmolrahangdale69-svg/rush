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
const LOCAL_BOOKINGS_KEY = 'bokde_recent_rides';

export function saveBookingLocally(booking: FirestoreBooking): void {
  try {
    const existingStr = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    const list: FirestoreBooking[] = existingStr ? JSON.parse(existingStr) : [];
    // Prepend new booking, remove duplicate references
    const filtered = list.filter(b => b.bookingReference !== booking.bookingReference && b.id !== booking.id);
    filtered.unshift(booking);
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch (e) {
    console.warn('Local booking storage error:', e);
  }
}

export function getRecentLocalBookings(): FirestoreBooking[] {
  try {
    const existingStr = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch {
    return [];
  }
}

export function updateLocalBookingStatus(bookingIdOrRef: string, status: 'confirmed' | 'pending' | 'cancelled'): void {
  try {
    const list = getRecentLocalBookings();
    const updated = list.map(b => {
      if (b.id === bookingIdOrRef || b.bookingReference === bookingIdOrRef) {
        return { ...b, status };
      }
      return b;
    });
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Local update error:', e);
  }
}

/**
 * Cancels a user's booking by setting status to 'cancelled'
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  const path = `bookings/${bookingId}`;
  updateLocalBookingStatus(bookingId, 'cancelled');
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled'
    });
  } catch (error) {
    console.warn('Firestore cancellation error, updated locally:', error);
  }
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
