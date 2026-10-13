import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin'
}) => {
  const { 
    user, 
    isAnonymous, 
    authError, 
    clearError, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    sendPhoneOtp, 
    verifyPhoneOtp 
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');

  // Email form fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Phone OTP fields
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [phoneUserName, setPhoneUserName] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (isOpen) {
      clearError();
      setStatusMessage(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Google Sign In handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setStatusMessage('Connecting with Google...');
    try {
      await signInWithGoogle();
      setStatusMessage('Signed in successfully!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    } catch (err: any) {
      console.warn('Google sign-in exception:', err);
    } finally {
      setLoading(false);
    }
  };

  // Email Submit handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setStatusMessage(isSignUp ? 'Creating your account...' : 'Signing in...');

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name.trim(), phone.trim());
        setStatusMessage('Account created and previous bookings linked!');
      } else {
        await signInWithEmail(email, password);
        setStatusMessage('Welcome back! Bookings loaded.');
      }
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 600);
    } catch (err: any) {
      console.warn('Email auth notice:', err);
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP Send handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      // Default to India (+91)
      formattedPhone = `+91${formattedPhone.replace(/\D/g, '')}`;
    }

    setLoading(true);
    setStatusMessage('Preparing phone verification...');

    try {
      // Initialize or reset reCAPTCHA
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }

      const confirmation = await sendPhoneOtp(formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setStatusMessage('OTP sent to ' + formattedPhone);
    } catch (err: any) {
      console.warn('Phone OTP dispatch exception:', err);
      // Reset recaptcha if failed
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP Verify handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !otpCode.trim()) return;

    setLoading(true);
    setStatusMessage('Verifying code...');

    try {
      await verifyPhoneOtp(confirmationResult, otpCode.trim(), phoneUserName.trim());
      setStatusMessage('Verified successfully! Account linked.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 600);
    } catch (err: any) {
      console.warn('OTP verification notice:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container for invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 font-serif font-black tracking-widest text-lg">BOKDE</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
              TRAVELS
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white">
            {isSignUp ? 'Create your Account' : 'Welcome to Bokde Travels'}
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Access previous bookings, receipts, and fast checkout on any device.
          </p>

          {isAnonymous && (
            <div className="mt-3 bg-amber-500/20 border border-amber-400/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Earlier bookings made in this session will automatically be linked!</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">

          {/* Quick One-Click Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 font-bold text-sm text-stone-800 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.25 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.39-1.49-.39-2.24s.14-1.52.39-2.24V6.61H1.25C.45 8.22 0 10.06 0 12s.45 3.78 1.25 5.39l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-stone-600">
              or continue with
            </span>
          </div>

          {/* Toggle Email vs Phone */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                clearError();
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Email &amp; Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                clearError();
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Phone (OTP)
            </button>
          </div>

          {/* Feedback messages */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {statusMessage && !authError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* METHOD 1: EMAIL & PASSWORD */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account & Link Bookings' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    clearError();
                  }}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer underline-offset-2 hover:underline"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : "Don't have an account yet? Create one"}
                </button>
              </div>
            </form>
          )}

          {/* METHOD 2: PHONE OTP */}
          {authMethod === 'phone' && (
            <div className="space-y-3">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Mobile Number (+91 India)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 8830853261 or 9876543210"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      We will send an SMS with a one-time verification code.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !phoneNumber.trim()}
                    className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Send Verification OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={phoneUserName}
                      onChange={(e) => setPhoneUserName(e.target.value)}
                      placeholder="e.g. Anil Bokde"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify OTP &amp; Log In</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                    >
                      Change phone number
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer Note */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span>Protected by Bokde Travels Secure Auth</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-stone-700 hover:text-stone-950 cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>

      </div>
    </div>
  );
};
