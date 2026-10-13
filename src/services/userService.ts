import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';

export interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function syncUserProfile(
  userId: string,
  profile: Partial<UserProfile>
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    
    const existingData = snap.exists() ? (snap.data() as UserProfile) : null;
    const createdAt = existingData?.createdAt || new Date().toISOString();

    const payload: UserProfile = {
      createdAt,
      ...(profile.name ? { name: profile.name.substring(0, 100) } : existingData?.name ? { name: existingData.name } : {}),
      ...(profile.email ? { email: profile.email.substring(0, 200) } : existingData?.email ? { email: existingData.email } : {}),
      ...(profile.phone ? { phone: profile.phone.substring(0, 50) } : existingData?.phone ? { phone: existingData.phone } : {})
    };

    await setDoc(userDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
