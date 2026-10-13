import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  ConfirmationResult,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  AuthCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { syncUserProfile, getUserProfile, UserProfile } from '../services/userService';
import { migrateAnonymousBookings } from '../services/bookingService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAnonymous: boolean;
  loading: boolean;
  authError: string | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string, phone?: string) => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, verifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  verifyPhoneOtp: (confirmationResult: ConfirmationResult, otp: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateSavedProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = () => setAuthError(null);

  // Helper to map Firebase errors to clear human-readable messages
  const parseAuthError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/invalid-verification-code':
        return 'Incorrect OTP code entered. Please check and re-enter.';
      case 'auth/code-expired':
        return 'The OTP code has expired. Please request a new code.';
      case 'auth/quota-exceeded':
      case 'auth/too-many-requests':
        return 'Too many requests. Please wait a few moments and try again.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      default:
        return err?.message || 'Authentication failed. Please try again.';
    }
  };

  // Sync profile document when user changes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      clearError();

      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (isMounted) {
            setUserProfile(profile);
          }
        } catch {
          // If profile fetch fails initially (e.g. anonymous user before doc is written), fallback gracefully
        }
      } else {
        // 1. GUEST-FIRST: Silently sign in with Firebase Anonymous Auth
        try {
          const anonCredential = await signInAnonymously(auth);
          setUser(anonCredential.user);
        } catch (anonErr) {
          console.warn('Anonymous sign-in initialization warning:', anonErr);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Google Sign In (with anonymous linking or migration)
  const handleSignInWithGoogle = async () => {
    setAuthError(null);
    const currentUser = auth.currentUser;
    const oldUid = currentUser?.isAnonymous ? currentUser.uid : null;

    try {
      if (currentUser && currentUser.isAnonymous) {
        try {
          // Attempt to link current anonymous session
          const result = await linkWithPopup(currentUser, googleProvider);
          const linkedUser = result.user;
          const name = linkedUser.displayName || '';
          const email = linkedUser.email || '';
          await syncUserProfile(linkedUser.uid, { name, email });
          const updatedProfile = await getUserProfile(linkedUser.uid);
          setUserProfile(updatedProfile);
          return;
        } catch (linkErr: any) {
          // If the Google account is already linked to another existing user
          if (linkErr.code === 'auth/credential-already-in-use') {
            const credential = GoogleAuthProvider.credentialFromError(linkErr);
            const userCredential = await signInWithPopup(auth, googleProvider);
            const newUid = userCredential.user.uid;
            
            // Migrate guest bookings
            if (oldUid && oldUid !== newUid) {
              await migrateAnonymousBookings(oldUid, newUid);
            }
            
            const profile = await getUserProfile(newUid);
            setUserProfile(profile);
            return;
          }
          throw linkErr;
        }
      } else {
        // Direct Google Sign In
        const result = await signInWithPopup(auth, googleProvider);
        const name = result.user.displayName || '';
        const email = result.user.email || '';
        await syncUserProfile(result.user.uid, { name, email });
        const profile = await getUserProfile(result.user.uid);
        setUserProfile(profile);
      }
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Email Sign In (links anonymous or signs in & migrates)
  const handleSignInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    const currentUser = auth.currentUser;
    const oldUid = currentUser?.isAnonymous ? currentUser.uid : null;

    try {
      if (currentUser && currentUser.isAnonymous) {
        try {
          const credential = EmailAuthProvider.credential(email, pass);
          const linkedResult = await linkWithCredential(currentUser, credential);
          const profile = await getUserProfile(linkedResult.user.uid);
          setUserProfile(profile);
          return;
        } catch (linkErr: any) {
          if (linkErr.code === 'auth/credential-already-in-use' || linkErr.code === 'auth/email-already-in-use') {
            const directResult = await signInWithEmailAndPassword(auth, email, pass);
            const newUid = directResult.user.uid;
            if (oldUid && oldUid !== newUid) {
              await migrateAnonymousBookings(oldUid, newUid);
            }
            const profile = await getUserProfile(newUid);
            setUserProfile(profile);
            return;
          }
          throw linkErr;
        }
      } else {
        const directResult = await signInWithEmailAndPassword(auth, email, pass);
        const profile = await getUserProfile(directResult.user.uid);
        setUserProfile(profile);
      }
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Email Sign Up (create account or link anonymous)
  const handleSignUpWithEmail = async (email: string, pass: string, name?: string, phone?: string) => {
    setAuthError(null);
    const currentUser = auth.currentUser;

    try {
      if (currentUser && currentUser.isAnonymous) {
        try {
          const credential = EmailAuthProvider.credential(email, pass);
          const linkResult = await linkWithCredential(currentUser, credential);
          if (name && linkResult.user) {
            await updateProfile(linkResult.user, { displayName: name });
          }
          await syncUserProfile(linkResult.user.uid, { name, email, phone });
          const profile = await getUserProfile(linkResult.user.uid);
          setUserProfile(profile);
          return;
        } catch (linkErr: any) {
          if (linkErr.code !== 'auth/credential-already-in-use' && linkErr.code !== 'auth/email-already-in-use') {
            throw linkErr;
          }
        }
      }

      // If not anonymous or credential already used, create user directly
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && result.user) {
        await updateProfile(result.user, { displayName: name });
      }
      await syncUserProfile(result.user.uid, { name, email, phone });
      const profile = await getUserProfile(result.user.uid);
      setUserProfile(profile);
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Phone OTP dispatch
  const handleSendPhoneOtp = async (phoneNumber: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    setAuthError(null);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      return confirmationResult;
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Phone OTP verification
  const handleVerifyPhoneOtp = async (confirmationResult: ConfirmationResult, otp: string, name?: string) => {
    setAuthError(null);
    const currentUser = auth.currentUser;
    const oldUid = currentUser?.isAnonymous ? currentUser.uid : null;

    try {
      const userCredential = await confirmationResult.confirm(otp);
      const newUid = userCredential.user.uid;
      
      if (oldUid && oldUid !== newUid) {
        await migrateAnonymousBookings(oldUid, newUid);
      }

      const phone = userCredential.user.phoneNumber || undefined;
      await syncUserProfile(newUid, { name, phone });
      const profile = await getUserProfile(newUid);
      setUserProfile(profile);
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // Logout (smoothly transitions back to guest session)
  const handleLogout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUserProfile(null);
      // Immediately start clean anonymous guest session
      const anonCredential = await signInAnonymously(auth);
      setUser(anonCredential.user);
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
    }
  };

  // Update profile in state and Firestore
  const handleUpdateSavedProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await syncUserProfile(user.uid, data);
      const updated = await getUserProfile(user.uid);
      setUserProfile(updated);
    } catch (err: any) {
      console.warn('Profile update warning:', err);
    }
  };

  const isAnonymous = Boolean(user && user.isAnonymous);

  const value = useMemo(() => ({
    user,
    userProfile,
    isAnonymous,
    loading,
    authError,
    clearError,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    sendPhoneOtp: handleSendPhoneOtp,
    verifyPhoneOtp: handleVerifyPhoneOtp,
    logout: handleLogout,
    updateSavedProfile: handleUpdateSavedProfile
  }), [user, userProfile, isAnonymous, loading, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
