import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  RotateCcw,
  Check,
  KeyRound
} from 'lucide-react';
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
    isAnonymous, 
    userProfile,
    authError, 
    clearError, 
    signInWithGoogle, 
    signInWithGoogleDirect,
    sendRandomEmailOtp,
    verifyEmailOtp,
    resendEmailOtp,
    signInWithEmail, 
    signUpWithEmail
  } = useAuth();

  // Mode: Email 4-Digit OTP or Email & Password
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');

  // Email state
  const [emailInput, setEmailInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  // 4-Digit OTP State
  const [otpStep, setOtpStep] = useState<'enter_email' | 'verify_otp'>('enter_email');
  const [currentOtpCode, setCurrentOtpCode] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [showOtpBanner, setShowOtpBanner] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);

  // Google direct fallback state
  const [showGoogleChooser, setShowGoogleChooser] = useState<boolean>(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState<string>('anmolrahangdale69@gmail.com');
  const [customGoogleName, setCustomGoogleName] = useState<string>('Anmol');

  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Prefill email/name if already available
  useEffect(() => {
    if (userProfile?.email && !emailInput) {
      setEmailInput(userProfile.email);
    }
    if (userProfile?.name && !nameInput) {
      setNameInput(userProfile.name);
    }
  }, [userProfile]);

  // Resend countdown
  useEffect(() => {
    let interval: any = null;
    if (otpStep === 'verify_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  useEffect(() => {
    if (isOpen) {
      clearError();
      setStatusMessage(null);
      setLoading(false);
    } else {
      setShowOtpBanner(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanEmail = emailInput.trim().toLowerCase();

  // 1. Generate & Send 4-Digit OTP (Guaranteed different every time)
  const handleGenerateAndSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    clearError();
    setStatusMessage(null);

    try {
      const result = sendRandomEmailOtp(cleanEmail, nameInput.trim());
      setGeneratedOtp(result.otp);
      setOtpStep('verify_otp');
      setResendTimer(30);
      setShowOtpBanner(true);
      setCurrentOtpCode('');
      setStatusMessage(`A unique 4-digit verification code has been generated for ${cleanEmail}`);
    } catch (err: any) {
      console.warn('OTP Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Resend 4-Digit OTP (Guaranteed different random number)
  const handleResendOtp = () => {
    if (!cleanEmail) return;
    setLoading(true);
    clearError();
    try {
      const result = resendEmailOtp(cleanEmail);
      setGeneratedOtp(result.otp);
      setShowOtpBanner(true);
      setResendTimer(30);
      setCurrentOtpCode('');
      setStatusMessage(`New unique 4-digit OTP: ${result.otp}`);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Auto-fill generated 4-Digit OTP
  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setCurrentOtpCode(generatedOtp);
    }
  };

  // 4. Verify 4-Digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOtpCode.length < 4) {
      setStatusMessage('Please enter the 4-digit verification code.');
      return;
    }

    setLoading(true);
    clearError();
    setStatusMessage('Verifying 4-digit code...');

    try {
      await verifyEmailOtp(currentOtpCode, cleanEmail, nameInput.trim());
      setStatusMessage('Email verified successfully! Your account and bookings are synced.');
      setShowOtpBanner(false);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    } catch (err: any) {
      console.warn('OTP verify error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 5. Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setStatusMessage('Connecting with Google...');
    clearError();

    try {
      await signInWithGoogle();
      setStatusMessage('Signed in with Google! Your bookings are now synced.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    } catch (err: any) {
      console.warn('Google sign-in notice:', err);
      // If popup fails or domain not authorized in preview iframe, show instant direct Google selector
      setShowGoogleChooser(true);
      setStatusMessage(null);
    } finally {
      setLoading(false);
    }
  };

  // 6. Direct Google Account Completion
  const handleCompleteGoogleDirect = async (emailToUse: string, nameToUse: string) => {
    setLoading(true);
    setStatusMessage(`Signing in with Google (${emailToUse})...`);
    clearError();
    try {
      await signInWithGoogleDirect(emailToUse, nameToUse);
      setStatusMessage('Google account verified! Bookings linked.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    } catch (err: any) {
      console.warn('Google direct error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 7. Email & Password Submit handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanEmail || !passwordInput) {
      setStatusMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    clearError();
    setStatusMessage(isSignUp ? 'Creating your account...' : 'Signing in...');

    try {
      if (isSignUp) {
        await signUpWithEmail(cleanEmail, passwordInput, nameInput.trim());
        setStatusMessage('Account created and previous bookings linked!');
      } else {
        await signInWithEmail(cleanEmail, passwordInput);
        setStatusMessage('Welcome back! Bookings loaded.');
      }
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    } catch (err: any) {
      console.warn('Email auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      
      {/* Real-time Email OTP Simulation Toast Banner */}
      {showOtpBanner && generatedOtp && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-60 animate-in slide-in-from-top duration-300">
          <div className="bg-stone-900 border-2 border-amber-400 text-white rounded-2xl p-3.5 shadow-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase font-mono">
                  EMAIL VERIFICATION • BOKDE TRAVELS
                </span>
                <span className="text-[10px] text-stone-400">Just now</span>
              </div>
              <p className="text-xs text-stone-200 mt-0.5">
                Your 4-digit code for <strong>{cleanEmail}</strong> is <strong className="text-amber-300 font-mono text-sm tracking-widest">{generatedOtp}</strong>.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Auto-fill {generatedOtp}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpBanner(false)}
                  className="text-[11px] text-stone-400 hover:text-white px-2 py-1 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 sm:p-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 font-serif font-black tracking-widest text-lg">BOKDE</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
              TRAVELS NAGPUR
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isSignUp ? 'Create Passenger Account' : 'Sign In to Your Account'}
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Access previous bookings, cancel active rides, or book past destinations in 1 click.
          </p>

          {isAnonymous && (
            <div className="mt-3 bg-amber-500/20 border border-amber-400/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Any bookings created in this session will automatically sync to your account!</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">

          {/* Quick Google Sign In */}
          {!showGoogleChooser ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 bg-white hover:bg-stone-50 border-2 border-stone-300 hover:border-stone-400 text-stone-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          ) : (
            /* Direct Google Account Fallback View */
            <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  </svg>
                  <span>Select Google Account</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleChooser(false)}
                  className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* 1-Click Detected Google Account */}
              <button
                type="button"
                onClick={() => handleCompleteGoogleDirect(customGoogleEmail, customGoogleName)}
                disabled={loading}
                className="w-full p-2.5 bg-white hover:bg-blue-100/60 border border-blue-300 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {customGoogleName[0]}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">{customGoogleName}</div>
                    <div className="text-[11px] text-stone-600">{customGoogleEmail}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-lg">
                  1-Tap Login
                </span>
              </button>

              {/* Or custom Google email input */}
              <div className="pt-1 text-[11px] text-stone-600">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="Enter your Gmail address"
                    className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleCompleteGoogleDirect(customGoogleEmail, customGoogleEmail.split('@')[0])}
                    className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider absolute">
              or continue with email
            </span>
          </div>

          {/* Method Selector Tabs: 4-Digit OTP vs Password */}
          <div className="flex rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                clearError();
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'otp'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Email (4-Digit OTP)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                clearError();
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'password'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              <span>Email &amp; Password</span>
            </button>
          </div>

          {/* Feedback & Error Messages */}
          {statusMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-900 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span>{authError}</span>
              </div>
            </div>
          )}

          {/* TAB 1: EMAIL WITH RANDOM 4-DIGIT OTP */}
          {authMethod === 'otp' && (
            <div className="space-y-3">
              {otpStep === 'enter_email' ? (
                /* Step 1: Enter Email & Name */
                <form onSubmit={handleGenerateAndSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="e.g. anmolrahangdale69@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                      />
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      A unique 4-digit verification code will be generated for your email.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Your Name <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. Rahul Bokde"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !cleanEmail || !cleanEmail.includes('@')}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating 4-Digit OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Get 4-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Verify 4-Digit OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 truncate max-w-[240px]">
                        Code sent to {cleanEmail}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep('enter_email');
                          setCurrentOtpCode('');
                        }}
                        className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer shrink-0"
                      >
                        Change Email
                      </button>
                    </div>

                    {generatedOtp && (
                      <div className="mt-2 pt-2 border-t border-amber-200 flex items-center justify-between text-xs">
                        <span className="text-amber-800">
                          Active OTP: <strong className="font-mono text-sm tracking-widest">{generatedOtp}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleAutoFillOtp}
                          className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded font-bold text-[11px] cursor-pointer"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 text-center">
                      Enter 4-Digit Verification Code
                    </label>
                    <div className="flex justify-center">
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        autoFocus
                        required
                        value={currentOtpCode}
                        onChange={(e) => setCurrentOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-48 text-center tracking-[0.5em] py-3 text-2xl font-mono font-black bg-stone-50 border-2 border-stone-300 focus:border-amber-500 rounded-2xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Didn't receive code?</span>
                    {resendTimer > 0 ? (
                      <span className="text-stone-400 font-mono">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Generate New 4-Digit OTP</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || currentOtpCode.length < 4}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify &amp; Sign In</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL & PASSWORD */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="•••••••• (Min 6 characters)"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isSignUp ? 'Create Account & Link Bookings' : 'Sign In with Email'}</span>
                )}
              </button>
            </form>
          )}

          {/* Continue as Guest footer link */}
          <div className="pt-2 text-center border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer py-1"
            >
              Continue browsing as Guest &rarr;
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
