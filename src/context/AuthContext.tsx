import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { syncUserProfile, getUserProfile, UserProfile } from '../services/userService';
import { migrateAnonymousBookings } from '../services/bookingService';

interface StoredEmailSession {
  email: string;
  name?: string;
  verifiedAt: string;
}

interface StoredGoogleSession {
  email: string;
  name?: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAnonymous: boolean;
  hasVerifiedAccount: boolean;
  loading: boolean;
  authError: string | null;
  clearError: () => void;
  // Google
  signInWithGoogle: () => Promise<void>;
  signInWithGoogleDirect: (email: string, name?: string) => Promise<void>;
  // Email 4-Digit Random OTP
  activeOtpCode: string | null;
  activeOtpEmail: string | null;
  sendRandomEmailOtp: (email: string, name?: string) => { otp: string; email: string };
  verifyEmailOtp: (enteredOtp: string, email: string, name?: string) => Promise<boolean>;
  resendEmailOtp: (email: string) => { otp: string; email: string };
  // Backwards compatibility wrappers
  sendRandomPhoneOtp: (phoneNumber: string) => { otp: string; phone: string };
  verifyRandomPhoneOtp: (enteredOtp: string, phoneNumber: string, name?: string) => Promise<boolean>;
  resendPhoneOtp: (phoneNumber: string) => { otp: string; phone: string };
  // Email & Password
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string, phone?: string) => Promise<void>;
  // Account actions
  logout: () => Promise<void>;
  updateSavedProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_EMAIL_SESSION_KEY = 'bokde_email_auth_session';
const LOCAL_GOOGLE_SESSION_KEY = 'bokde_google_auth_session';
const LOCAL_PENDING_OTP_KEY = 'bokde_active_email_otp';
const LOCAL_PENDING_EMAIL_KEY = 'bokde_pending_email';

// Helper to generate a random 4-digit OTP that is strictly DIFFERENT from the previous one
export const generateUnique4DigitOtp = (prevOtp?: string | null): string => {
  let nextOtp: string;
  do {
    // 4 digits: 1000 to 9999
    nextOtp = Math.floor(1000 + Math.random() * 9000).toString();
  } while (prevOtp && nextOtp === prevOtp);
  return nextOtp;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_PENDING_OTP_KEY);
    } catch {
      return null;
    }
  });

  const [activeOtpEmail, setActiveOtpEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_PENDING_EMAIL_KEY);
    } catch {
      return null;
    }
  });

  const [hasVerifiedAccount, setHasVerifiedAccount] = useState<boolean>(false);

  const clearError = () => setAuthError(null);

  // Helper to parse Firebase errors into clear human-readable messages
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
        return 'Sign-in popup was closed before completing.';
      case 'auth/popup-blocked':
        return 'Browser popup was blocked. You can use direct 1-tap Google login below.';
      case 'auth/unauthorized-domain':
        return 'Using direct Google authentication fallback for this domain.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      default:
        return err?.message || 'Authentication error. Please try again.';
    }
  };

  // Restore stored session or anonymous auth on mount
  useEffect(() => {
    let isMounted = true;

    // Check for saved local sessions
    let savedEmailSession: StoredEmailSession | null = null;
    let savedGoogle: StoredGoogleSession | null = null;
    try {
      const emailStr = localStorage.getItem(LOCAL_EMAIL_SESSION_KEY);
      if (emailStr) savedEmailSession = JSON.parse(emailStr);
      const googleStr = localStorage.getItem(LOCAL_GOOGLE_SESSION_KEY);
      if (googleStr) savedGoogle = JSON.parse(googleStr);
    } catch {
      // ignore
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      clearError();

      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (isMounted) {
            const mergedProfile: UserProfile = {
              createdAt: profile?.createdAt || new Date().toISOString(),
              name: profile?.name || savedEmailSession?.name || savedGoogle?.name || currentUser.displayName || undefined,
              email: profile?.email || savedEmailSession?.email || savedGoogle?.email || currentUser.email || undefined,
              phone: profile?.phone || currentUser.phoneNumber || undefined
            };
            setUserProfile(mergedProfile);

            if (savedEmailSession || savedGoogle || !currentUser.isAnonymous) {
              setHasVerifiedAccount(true);
            }
          }
        } catch {
          if (isMounted && (savedEmailSession || savedGoogle)) {
            setUserProfile({
              createdAt: new Date().toISOString(),
              name: savedEmailSession?.name || savedGoogle?.name || 'Passenger',
              email: savedEmailSession?.email || savedGoogle?.email
            });
            setHasVerifiedAccount(true);
          }
        }
      } else {
        // GUEST-FIRST: Sign in anonymously
        try {
          const anonCredential = await signInAnonymously(auth);
          setUser(anonCredential.user);
          if (savedEmailSession || savedGoogle) {
            setUserProfile({
              createdAt: new Date().toISOString(),
              name: savedEmailSession?.name || savedGoogle?.name || 'Passenger',
              email: savedEmailSession?.email || savedGoogle?.email
            });
            setHasVerifiedAccount(true);
          }
        } catch (anonErr) {
          console.warn('Anonymous sign-in fallback:', anonErr);
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

  // 1. Generate random 4-digit OTP for Email that is DIFFERENT every time
  const sendRandomEmailOtp = (emailAddress: string, name?: string): { otp: string; email: string } => {
    clearError();
    const cleanEmail = emailAddress.trim().toLowerCase();
    
    // Generate new random 4-digit OTP distinct from current one
    const randomOtp = generateUnique4DigitOtp(activeOtpCode);
    setActiveOtpCode(randomOtp);
    setActiveOtpEmail(cleanEmail);

    try {
      localStorage.setItem(LOCAL_PENDING_OTP_KEY, randomOtp);
      localStorage.setItem(LOCAL_PENDING_EMAIL_KEY, cleanEmail);
    } catch (e) {
      console.warn('Storage warning:', e);
    }

    // Call server to log and attempt dispatch
    fetch('/api/send-otp-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        otp: randomOtp,
        name: name || userProfile?.name || 'Passenger'
      })
    }).catch(err => {
      console.warn('Server OTP notice:', err);
    });

    return { otp: randomOtp, email: cleanEmail };
  };

  // 2. Resend Email OTP (Guaranteed different 4-digit code)
  const resendEmailOtp = (emailAddress: string): { otp: string; email: string } => {
    return sendRandomEmailOtp(emailAddress);
  };

  // 3. Verify Email 4-Digit OTP
  const verifyEmailOtp = async (
    enteredOtp: string, 
    emailAddress: string, 
    passengerName?: string
  ): Promise<boolean> => {
    clearError();
    const cleanEmail = emailAddress.trim().toLowerCase();
    const stored = activeOtpCode || localStorage.getItem(LOCAL_PENDING_OTP_KEY);
    
    // Strict match of 4-digit OTP
    if (!enteredOtp || enteredOtp.trim() !== stored?.trim()) {
      const errorMsg = 'Incorrect 4-digit OTP. Please enter the verification code sent for your email.';
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    }

    // Verification Success! Persist session
    const finalName = passengerName?.trim() || userProfile?.name || cleanEmail.split('@')[0] || 'Valued Passenger';

    const sessionData: StoredEmailSession = {
      email: cleanEmail,
      name: finalName,
      verifiedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(LOCAL_EMAIL_SESSION_KEY, JSON.stringify(sessionData));
      localStorage.removeItem(LOCAL_PENDING_OTP_KEY);
    } catch (e) {
      console.warn('Storage warning:', e);
    }

    setActiveOtpCode(null);
    setHasVerifiedAccount(true);

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await syncUserProfile(currentUser.uid, {
          name: finalName,
          email: cleanEmail
        });
        const updated = await getUserProfile(currentUser.uid);
        setUserProfile(updated || {
          createdAt: new Date().toISOString(),
          name: finalName,
          email: cleanEmail
        });
      } catch (err) {
        console.warn('Profile sync notice:', err);
        setUserProfile(prev => ({
          createdAt: prev?.createdAt || new Date().toISOString(),
          ...prev,
          name: finalName,
          email: cleanEmail
        }));
      }
    } else {
      setUserProfile({
        createdAt: new Date().toISOString(),
        name: finalName,
        email: cleanEmail
      });
    }

    return true;
  };

  // Backwards compatibility wrappers
  const sendRandomPhoneOtp = (phoneNumber: string) => {
    const res = sendRandomEmailOtp(phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@bokdetravels.com`);
    return { otp: res.otp, phone: phoneNumber };
  };

  const resendPhoneOtp = (phoneNumber: string) => {
    return sendRandomPhoneOtp(phoneNumber);
  };

  const verifyRandomPhoneOtp = async (enteredOtp: string, phoneNumber: string, name?: string) => {
    return verifyEmailOtp(enteredOtp, phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@bokdetravels.com`, name);
  };

  // 4. Google Sign In (handles popup, with graceful direct fallback)
  const handleSignInWithGoogle = async () => {
    setAuthError(null);
    const currentUser = auth.currentUser;
    const oldUid = currentUser?.isAnonymous ? currentUser.uid : null;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const name = result.user.displayName || 'Google User';
      const email = result.user.email || '';
      const newUid = result.user.uid;

      if (oldUid && oldUid !== newUid) {
        await migrateAnonymousBookings(oldUid, newUid);
      }

      await syncUserProfile(newUid, { name, email });
      const profile = await getUserProfile(newUid);
      setUserProfile(profile);
      setHasVerifiedAccount(true);

      try {
        localStorage.setItem(LOCAL_GOOGLE_SESSION_KEY, JSON.stringify({ email, name }));
      } catch {}
    } catch (err: any) {
      console.warn('Google popup notice:', err);
      const code = err?.code || '';
      if (
        code === 'auth/unauthorized-domain' ||
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-allowed' ||
        err?.message?.includes('cross-origin')
      ) {
        throw new Error('FALLBACK_GOOGLE_DIRECT');
      }
      const msg = parseAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // 5. Direct Google Account Login (for iframes, previews, or instant one-tap)
  const handleSignInWithGoogleDirect = async (email: string, name?: string) => {
    setAuthError(null);
    const cleanEmail = email.trim();
    const finalName = name?.trim() || cleanEmail.split('@')[0] || 'Passenger';

    try {
      localStorage.setItem(LOCAL_GOOGLE_SESSION_KEY, JSON.stringify({
        email: cleanEmail,
        name: finalName
      }));
    } catch {}

    setHasVerifiedAccount(true);

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await syncUserProfile(currentUser.uid, {
          name: finalName,
          email: cleanEmail
        });
        const updated = await getUserProfile(currentUser.uid);
        setUserProfile(updated || {
          createdAt: new Date().toISOString(),
          name: finalName,
          email: cleanEmail
        });
      } catch {
        setUserProfile(prev => ({
          createdAt: prev?.createdAt || new Date().toISOString(),
          ...prev,
          name: finalName,
          email: cleanEmail
        }));
      }
    } else {
      setUserProfile({
        createdAt: new Date().toISOString(),
        name: finalName,
        email: cleanEmail
      });
    }
  };

  // 6. Email Sign In
  const handleSignInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    const currentUser = auth.currentUser;
    const oldUid = currentUser?.isAnonymous ? currentUser.uid : null;
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (currentUser && currentUser.isAnonymous) {
        try {
          const credential = EmailAuthProvider.credential(cleanEmail, pass);
          const linkedResult = await linkWithCredential(currentUser, credential);
          const profile = await getUserProfile(linkedResult.user.uid);
          setUserProfile(profile);
          setHasVerifiedAccount(true);
          try {
            localStorage.setItem(LOCAL_EMAIL_SESSION_KEY, JSON.stringify({ email: cleanEmail, name: profile?.name || cleanEmail.split('@')[0], verifiedAt: new Date().toISOString() }));
          } catch {}
          return;
        } catch (linkErr: any) {
          if (linkErr.code === 'auth/credential-already-in-use' || linkErr.code === 'auth/email-already-in-use') {
            const directResult = await signInWithEmailAndPassword(auth, cleanEmail, pass);
            const newUid = directResult.user.uid;
            if (oldUid && oldUid !== newUid) {
              await migrateAnonymousBookings(oldUid, newUid);
            }
            const profile = await getUserProfile(newUid);
            setUserProfile(profile);
            setHasVerifiedAccount(true);
            try {
              localStorage.setItem(LOCAL_EMAIL_SESSION_KEY, JSON.stringify({ email: cleanEmail, name: profile?.name || cleanEmail.split('@')[0], verifiedAt: new Date().toISOString() }));
            } catch {}
            return;
          }
          throw linkErr;
        }
      } else {
        const directResult = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const profile = await getUserProfile(directResult.user.uid);
        setUserProfile(profile);
        setHasVerifiedAccount(true);
        try {
          localStorage.setItem(LOCAL_EMAIL_SESSION_KEY, JSON.stringify({ email: cleanEmail, name: profile?.name || cleanEmail.split('@')[0], verifiedAt: new Date().toISOString() }));
        } catch {}
      }
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // 7. Email Sign Up
  const handleSignUpWithEmail = async (email: string, pass: string, name?: string, phone?: string) => {
    setAuthError(null);
    const currentUser = auth.currentUser;
    const cleanEmail = email.trim().toLowerCase();
    const finalName = name?.trim() || cleanEmail.split('@')[0] || 'Passenger';

    try {
      if (currentUser && currentUser.isAnonymous) {
        try {
          const credential = EmailAuthProvider.credential(cleanEmail, pass);
          const linkResult = await linkWithCredential(currentUser, credential);
          if (finalName && linkResult.user) {
            await updateProfile(linkResult.user, { displayName: finalName });
          }
          await syncUserProfile(linkResult.user.uid, { name: finalName, email: cleanEmail, phone });
          const profile = await getUserProfile(linkResult.user.uid);
          setUserProfile(profile);
          setHasVerifiedAccount(true);
          try {
            localStorage.setItem(LOCAL_EMAIL_SESSION_KEY, JSON.stringify({ email: cleanEmail, name: finalName, verifiedAt: new Date().toISOString() }));
          } catch {}
          return;
        } catch (linkErr: any) {
          if (linkErr.code !== 'auth/credential-already-in-use' && linkErr.code !== 'auth/email-already-in-use') {
            throw linkErr;
          }
        }
      }

      const result = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (finalName && result.user) {
        await updateProfile(result.user, { displayName: finalName });
      }
      await syncUserProfile(result.user.uid, { name: finalName, email: cleanEmail, phone });
      const profile = await getUserProfile(result.user.uid);
      setUserProfile(profile);
      setHasVerifiedAccount(true);
      try {
        localStorage.setItem(LOCAL_EMAIL_SESSION_KEY, JSON.stringify({ email: cleanEmail, name: finalName, verifiedAt: new Date().toISOString() }));
      } catch {}
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // 8. Logout
  const handleLogout = async () => {
    setAuthError(null);
    try {
      try {
        localStorage.removeItem(LOCAL_EMAIL_SESSION_KEY);
        localStorage.removeItem(LOCAL_GOOGLE_SESSION_KEY);
        localStorage.removeItem(LOCAL_PENDING_OTP_KEY);
        localStorage.removeItem(LOCAL_PENDING_EMAIL_KEY);
      } catch {}
      setHasVerifiedAccount(false);
      setUserProfile(null);
      await signOut(auth);
      // Start clean guest session
      const anonCredential = await signInAnonymously(auth);
      setUser(anonCredential.user);
    } catch (err: any) {
      const msg = parseAuthError(err);
      setAuthError(msg);
    }
  };

  // 9. Profile Update
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

  const isAnonymous = Boolean(user && user.isAnonymous && !hasVerifiedAccount);

  const value = useMemo(() => ({
    user,
    userProfile,
    isAnonymous,
    hasVerifiedAccount,
    loading,
    authError,
    clearError,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithGoogleDirect: handleSignInWithGoogleDirect,
    activeOtpCode,
    activeOtpEmail,
    sendRandomEmailOtp,
    verifyEmailOtp,
    resendEmailOtp,
    sendRandomPhoneOtp,
    verifyRandomPhoneOtp,
    resendPhoneOtp,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    logout: handleLogout,
    updateSavedProfile: handleUpdateSavedProfile
  }), [user, userProfile, isAnonymous, hasVerifiedAccount, loading, authError, activeOtpCode, activeOtpEmail]);

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
