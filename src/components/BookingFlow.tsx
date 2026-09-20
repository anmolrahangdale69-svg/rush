import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  Car, 
  CreditCard, 
  Banknote, 
  Plane, 
  RefreshCw, 
  ShieldCheck,
  Check,
  ChevronRight,
  QrCode,
  Copy
} from 'lucide-react';
import QRCode from 'qrcode';
import { TripType, AirportTransferType, PaymentMethod, VehicleConfig, BookingSubmission } from '../types';
import { BUSINESS_CONFIG, VEHICLES, CLIENT_CONFIRMATION_POINTS } from '../data/cabConfig';
import { calculateRouteDistance, calculateVehicleFare } from '../utils/routingService';
import { VehicleVisual } from './VehicleVisual';

interface BookingFlowProps {
  initialPickup?: string;
  initialDrop?: string;
  initialVehicleId?: string;
  onBookingComplete?: (booking: BookingSubmission) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  initialPickup = 'Nagpur',
  initialDrop = 'Wardha',
  initialVehicleId = 'suzuki-dzire',
  onBookingComplete
}) => {
  // Step State: 1 = Trip Details, 2 = Choose Vehicle, 3 = Passenger Info, 4 = Payment, 5 = Review, 6 = Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Trip Details
  const [tripType, setTripType] = useState<TripType>('oneway');
  const [airportType, setAirportType] = useState<AirportTransferType>('pickup');
  const [pickup, setPickup] = useState<string>(initialPickup);
  const [drop, setDrop] = useState<string>(initialDrop);
  const [travelDate, setTravelDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [travelTime, setTravelTime] = useState<string>('09:00 AM');
  const [passengers, setPassengers] = useState<number>(3);
  const [localHours, setLocalHours] = useState<number>(8);

  // Distance & Routing State
  const [isCalculatingDistance, setIsCalculatingDistance] = useState<boolean>(false);
  const [distanceKm, setDistanceKm] = useState<number>(78);
  const [durationText, setDurationText] = useState<string>('1 hr 30 min');
  const [distanceError, setDistanceError] = useState<string | null>(null);

  // Step 2: Selected Vehicle
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicleId);

  // Step 3: Passenger Details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [passengerFormErrors, setPassengerFormErrors] = useState<{ name?: string; phone?: string }>({});

  // Step 4: Payment Method & UPI State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [hasCompletedUpiPayment, setHasCompletedUpiPayment] = useState<boolean>(false);
  const [upiTransactionRef, setUpiTransactionRef] = useState<string>('');
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('/images/upi-qr-code.png');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [upiError, setUpiError] = useState<string | null>(null);

  // Step 5 & 6: Submission & Confirmation
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSubmission | null>(null);

  // Pre-fill updates if props change
  useEffect(() => {
    if (initialPickup) setPickup(initialPickup);
    if (initialDrop) setDrop(initialDrop);
    if (initialVehicleId) setSelectedVehicleId(initialVehicleId);
  }, [initialPickup, initialDrop, initialVehicleId]);

  // Adjust pickup/drop when Airport Transfer is selected
  useEffect(() => {
    if (tripType === 'airport') {
      if (airportType === 'pickup') {
        setPickup(BUSINESS_CONFIG.airportName);
        if (drop === BUSINESS_CONFIG.airportName) setDrop('Nagpur City');
      } else {
        setDrop(BUSINESS_CONFIG.airportName);
        if (pickup === BUSINESS_CONFIG.airportName) setPickup('Nagpur City');
      }
    }
  }, [tripType, airportType]);

  // Trigger distance calculation
  const handleCalculateDistance = async (pLoc = pickup, dLoc = drop) => {
    if (!pLoc.trim() || !dLoc.trim()) {
      setDistanceError('Please specify both Pickup and Drop locations.');
      return false;
    }

    setIsCalculatingDistance(true);
    setDistanceError(null);

    const result = await calculateRouteDistance(pLoc, dLoc);
    setIsCalculatingDistance(false);

    if (result.success && result.distanceKm > 0) {
      setDistanceKm(result.distanceKm);
      setDurationText(result.durationText || `${Math.round(result.distanceKm / 50)} hrs`);
      setDistanceError(null);
      return true;
    } else {
      setDistanceError(result.error || `Could not calculate route between "${pLoc}" and "${dLoc}".`);
      return false;
    }
  };

  // Step 1 -> Step 2 validation
  const handleProceedToVehicles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim()) {
      setDistanceError('Please enter a valid pickup location.');
      return;
    }
    if (!drop.trim()) {
      setDistanceError('Please enter a valid drop location.');
      return;
    }

    if (tripType === 'local') {
      setIsCalculatingDistance(true);
      try {
        const result = await calculateRouteDistance(pickup, drop);
        if (result.success && result.distanceKm > 0) {
          setDistanceKm(result.distanceKm);
          setDurationText(result.durationText || `${localHours} hrs`);
        } else {
          setDistanceKm(localHours * 10);
          setDurationText(`${localHours} hrs local`);
        }
      } catch {
        setDistanceKm(localHours * 10);
        setDurationText(`${localHours} hrs local`);
      }
      setIsCalculatingDistance(false);
      setDistanceError(null);
      setCurrentStep(2);
      return;
    }

    const ok = await handleCalculateDistance(pickup, drop);
    if (ok) {
      setCurrentStep(2);
    }
  };

  // Helper to scroll the booking card directly into the user's view (below sticky navbar)
  const scrollToBookingTop = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const isFirstRender = useRef(true);

  // Automatically bring the new step directly into the user's view whenever step changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      scrollToBookingTop();
    }, 40);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Step 2 -> Step 3: Select vehicle and immediately present passenger contact details
  const handleProceedToStep3 = (vehicleId?: string) => {
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
    }
    setCurrentStep(3);
    setTimeout(scrollToBookingTop, 20);
  };

  // Step 3 validation
  const validatePassengerDetails = (): boolean => {
    const errors: { name?: string; phone?: string } = {};
    if (!customerName.trim() || customerName.trim().length < 3) {
      errors.name = 'Please enter your full name.';
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    setPassengerFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassengerDetails()) {
      setCurrentStep(4);
    }
  };

  // Get currently selected vehicle object
  const selectedVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[0];
  const fareDetails = calculateVehicleFare(selectedVehicle, distanceKm, tripType, localHours);

  // Dynamic QR Code generation for UPI with exact booking amount
  useEffect(() => {
    if (selectedVehicle && fareDetails.fare > 0) {
      const upiUri = `upi://pay?pa=${BUSINESS_CONFIG.upiId}&pn=${encodeURIComponent('Bokde Travels')}&am=${fareDetails.fare}&cu=INR&tn=${encodeURIComponent(`Booking ${selectedVehicle.name}`)}`;
      QRCode.toDataURL(upiUri, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1c1917',
          light: '#ffffff',
        },
      })
        .then((url) => setUpiQrDataUrl(url))
        .catch(() => setUpiQrDataUrl('/images/upi-qr-code.png'));
    }
  }, [fareDetails.fare, selectedVehicle]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(BUSINESS_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  const handleProceedToReview = () => {
    if (paymentMethod === 'upi' && !hasCompletedUpiPayment) {
      setUpiError('Please complete the UPI payment and check the confirmation box below to proceed.');
      return;
    }
    setUpiError(null);
    setCurrentStep(5);
  };

  // Step 5: Final Submission
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const bookingRef = `BT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentNote = paymentMethod === 'upi' 
      ? `UPI Payment Confirmed (Paid to ${BUSINESS_CONFIG.upiId}${upiTransactionRef ? `, UTR: ${upiTransactionRef}` : ''})`
      : 'Pay Driver / Cash on Delivery';

    const submission: BookingSubmission = {
      bookingReference: bookingRef,
      tripType,
      airportTransferType: tripType === 'airport' ? airportType : undefined,
      pickupLocation: pickup,
      dropLocation: drop,
      travelDate,
      travelTime,
      passengers,
      distanceKm: tripType === 'local' ? localHours * 10 : distanceKm,
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      perKmRate: tripType === 'local' ? selectedVehicle.localHourlyRate : fareDetails.ratePerKm,
      estimatedFare: fareDetails.fare,
      tollNote: 'Payable by customer',
      customerName,
      customerPhone,
      customerEmail,
      specialRequests: specialRequests 
        ? `${specialRequests} | [Payment: ${paymentNote}]`
        : `[Payment: ${paymentNote}]`,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Post to backend booking endpoint
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submission,
          cleanSpecialRequests: specialRequests || '',
          hasCompletedUpiPayment,
          upiTransactionRef
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.booking?.bookingReference) {
          submission.bookingReference = data.booking.bookingReference;
        }
      }
    } catch (err) {
      console.warn('Backend booking sync error (local confirmation preserved):', err);
    }

    try {
      // 2. Dispatch booking confirmation email to bokdetravels@gmail.com via server Resend endpoint
      await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingReference: submission.bookingReference,
          customerName,
          customerPhone,
          customerEmail,
          specialRequests: specialRequests || '',
          tripType,
          airportTransferType: tripType === 'airport' ? airportType : undefined,
          pickupLocation: pickup,
          dropLocation: drop,
          travelDate,
          travelTime,
          passengers,
          vehicleName: selectedVehicle.name,
          estimatedFare: fareDetails.fare,
          paymentMethod,
          hasCompletedUpiPayment,
          upiTransactionRef
        })
      });
    } catch (emailErr) {
      // Do not break the booking if email sending temporarily fails
      console.warn('Resend booking email dispatch error (booking confirmed):', emailErr);
    }

    // Save in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('bokde_bookings') || '[]');
      existing.unshift(submission);
      localStorage.setItem('bokde_bookings', JSON.stringify(existing));
    } catch (e) {
      // safe fallback
    }

    setIsSubmitting(false);
    setConfirmedBooking(submission);
    setCurrentStep(6); // Step 6 = Confirmation view

    if (onBookingComplete) {
      onBookingComplete(submission);
    }
  };

  // WhatsApp prefilled message
  const getWhatsAppBookingText = (b: BookingSubmission) => {
    const paymentLine = b.paymentMethod === 'upi'
      ? `UPI PAID (ID: ${BUSINESS_CONFIG.upiId}${upiTransactionRef ? `, UTR: ${upiTransactionRef}` : ''})`
      : 'PAY DRIVER / COD';

    const rateText = b.tripType === 'local'
      ? `₹${selectedVehicle.localHourlyRate}/hr (${localHours} Hours)`
      : `₹${b.perKmRate}/km`;

    const text = `*New Cab Booking Request - Bokde Travels*\n` +
      `*Booking Ref:* ${b.bookingReference}\n` +
      `*Name:* ${b.customerName}\n` +
      `*Phone:* ${b.customerPhone}\n` +
      `*Route:* ${b.pickupLocation} -> ${b.dropLocation}\n` +
      `*Trip Type:* ${b.tripType.toUpperCase()}${b.tripType === 'local' ? ` (${localHours} Hours Package)` : ''}\n` +
      `*Date & Time:* ${b.travelDate} at ${b.travelTime}\n` +
      `*Passengers:* ${b.passengers}\n` +
      `*Vehicle:* ${b.vehicleName} (@ ${rateText})\n` +
      (b.tripType === 'local' ? `*Rental Duration:* ${localHours} Hours\n` : `*Distance:* ${b.distanceKm} km\n`) +
      `*Estimated Fare:* ₹${b.estimatedFare.toLocaleString()}\n` +
      `*Tolls & Parking:* Payable by customer\n` +
      `*Payment:* ${paymentLine}\n` +
      (b.specialRequests ? `*Notes:* ${b.specialRequests}\n` : '') +
      `Please confirm my booking.`;
    return encodeURIComponent(text);
  };

  return (
    <div id="booking-section" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 scroll-mt-24">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden transition-all">
        
        {/* Header with Step Indicator */}
        <div className="bg-stone-900 text-white px-6 py-5 border-b border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider block">
                Bokde Travels Booking Desk
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                {currentStep === 1 && 'Step 1: Enter Trip Details'}
                {currentStep === 2 && 'Step 2: Select Your Vehicle & Fare'}
                {currentStep === 3 && 'Step 3: Passenger Contact Details'}
                {currentStep === 4 && 'Step 4: Select Payment Method'}
                {currentStep === 5 && 'Step 5: Review & Confirm Booking'}
                {currentStep === 6 && 'Booking Confirmed!'}
              </h2>
            </div>

            {/* Stepper Progress Bar (Steps 1 to 5) */}
            {currentStep <= 5 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex items-center gap-1">
                    <span 
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                        currentStep === s 
                          ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400' 
                          : currentStep > s 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {currentStep > s ? <Check className="w-3.5 h-3.5" /> : s}
                    </span>
                    {s < 5 && <span className="w-2.5 h-0.5 bg-stone-700 hidden sm:inline-block" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STEP 1: TRIP DETAILS */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedToVehicles} className="p-6 sm:p-8 space-y-6">
            
            {/* Trip Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Select Trip Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'oneway', label: 'One Way', desc: 'Direct point-to-point drop' },
                  { id: 'roundtrip', label: 'Round Trip', desc: 'Return trip (total distance × rate)' },
                  { id: 'local', label: 'Local City', desc: 'City sightseeing & hourly' },
                  { id: 'airport', label: 'Airport Transfer', desc: 'Nagpur Airport (NAG)' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTripType(t.id as TripType)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tripType === t.id
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/40 text-stone-900 shadow-2xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-stone-900">{t.label}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Airport Transfer Toggle Sub-options */}
            {tripType === 'airport' && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-amber-700" />
                  <span className="text-xs font-bold text-stone-900">Dr. Babasaheb Ambedkar International Airport (NAG)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAirportType('pickup')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      airportType === 'pickup' ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    Airport Pickup (Airport &rarr; City)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAirportType('drop')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      airportType === 'drop' ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    Airport Drop (City &rarr; Airport)
                  </button>
                </div>
              </div>
            )}

            {/* Local City Hourly Rental Selector */}
            {tripType === 'local' && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                      Select Rental Duration (Hours)
                    </span>
                    <span className="text-xs text-stone-600">
                      Nagpur local city hourly packages with transparent per-hour billing
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {[4, 8, 12].map((hrs) => (
                      <button
                        key={hrs}
                        type="button"
                        onClick={() => setLocalHours(hrs)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          localHours === hrs
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {hrs}h {hrs === 8 ? '(Full Day)' : hrs === 4 ? '(Half Day)' : ''}
                      </button>
                    ))}
                    <div className="flex items-center bg-white border border-stone-200 rounded-lg px-2 py-1">
                      <button
                        type="button"
                        disabled={localHours <= 1}
                        onClick={() => setLocalHours(Math.max(1, localHours - 1))}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-950 font-bold text-xs cursor-pointer disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="mx-2 text-xs font-mono font-bold text-stone-900">{localHours}h</span>
                      <button
                        type="button"
                        disabled={localHours >= 24}
                        onClick={() => setLocalHours(Math.min(24, localHours + 1))}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-950 font-bold text-xs cursor-pointer disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Locations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>Pickup Location</span>
                  <span className="text-[10px] text-stone-400 font-normal">Any City or Address</span>
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-amber-600 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup city, station or address"
                    className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 text-sm font-semibold rounded-xl pl-10 pr-3.5 py-3 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-stone-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Drop Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>Drop Location</span>
                  <span className="text-[10px] text-stone-400 font-normal">Any Destination</span>
                </label>
                <div className="relative flex items-center">
                  <Navigation className="w-4 h-4 text-amber-600 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="Enter drop city or destination address"
                    className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 text-sm font-semibold rounded-xl pl-10 pr-3.5 py-3 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-stone-400 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>

            {/* Travel Date, Time & Passengers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Travel Date
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-amber-600 absolute left-3.5 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 text-sm font-semibold rounded-xl pl-10 pr-3 py-3 border border-stone-200 focus:border-amber-500 outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Pickup Time
                </label>
                <div className="relative flex items-center">
                  <Clock className="w-4 h-4 text-amber-600 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={travelTime}
                    onChange={(e) => setTravelTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 text-sm font-semibold rounded-xl pl-10 pr-3 py-3 border border-stone-200 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Passengers Stepper */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Passengers
                </label>
                <div className="flex items-center justify-between bg-stone-50 rounded-xl px-3.5 py-2.5 border border-stone-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-stone-900">
                      {passengers} {passengers === 1 ? 'Person' : 'Persons'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={passengers <= 1}
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 disabled:opacity-30 font-bold text-sm flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      disabled={passengers >= 7}
                      onClick={() => setPassengers(Math.min(7, passengers + 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 disabled:opacity-30 font-bold text-sm flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Distance Error Notice */}
            {distanceError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Distance Calculation Notice</div>
                  <div>{distanceError}</div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Automatic road-distance calculation via highway routing</span>
              </div>

              <button
                type="submit"
                disabled={isCalculatingDistance}
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-200 text-stone-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isCalculatingDistance ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating Route Distance...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Select Vehicle &amp; Fare</span>
                    <ArrowRight className="w-4 h-4 text-stone-950" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: CHOOSE VEHICLE & VIEW FARES */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Calculated Distance / Local Duration Banner */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  {tripType === 'local' ? 'Local City Rental Package' : 'Calculated Route Distance'}
                </span>
                <div className="text-base sm:text-lg font-bold text-stone-900">
                  {pickup} &rarr; {drop}
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  {tripType === 'local' ? (
                    <>
                      Rental Duration: <strong className="font-mono text-stone-900">{localHours} Hours</strong> &bull; Billing: <strong className="text-amber-800">Hourly Rate × {localHours} hrs</strong>
                    </>
                  ) : (
                    <>
                      Route Distance: <strong className="font-mono text-stone-900">{distanceKm} km</strong> ({durationText}) &bull; Trip Type: <strong className="capitalize text-amber-800">{tripType}</strong>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-amber-700 hover:text-amber-900 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Change Locations / Date</span>
              </button>
            </div>

            {/* Choose Your Cab Header */}
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Choose Your Cab
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Select your preferred vehicle. Transparent rates, air-conditioned comfort, and verified commercial drivers.
              </p>
            </div>

            {/* Notice on Round-Trip rule and Tolls */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span>
                {tripType === 'local'
                  ? `🏷️ Local City Rental: ${localHours} Hours × Selected Vehicle Hourly Rate.`
                  : tripType === 'roundtrip' 
                    ? '🏷️ Round-trip calculation: Total Fare = Total Round-Trip Distance × Vehicle Rate.' 
                    : '🏷️ One-way trip: Exact distance multiplied by vehicle rate.'}
              </span>
              <span className="font-semibold text-amber-800">
                Toll and parking charges: Payable by customer
              </span>
            </div>

            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VEHICLES.map((vehicle) => {
                const vehicleFare = calculateVehicleFare(vehicle, distanceKm, tripType, localHours);
                const isSelected = selectedVehicleId === vehicle.id;

                return (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                    className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-400/50 shadow-md'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Vehicle Visual */}
                      <div className="rounded-xl overflow-hidden border border-stone-200/80 mb-3 bg-stone-50">
                        <VehicleVisual visualId={vehicle.visualId} className="w-full h-36" />
                      </div>

                      {/* Title and Category */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-base text-stone-900">{vehicle.name}</h3>
                          <span className="text-xs text-stone-500">{vehicle.category} &bull; {vehicle.model}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-bold font-mono">
                          {tripType === 'local'
                            ? `₹${vehicle.localHourlyRate}/hr`
                            : tripType === 'roundtrip'
                              ? `₹${vehicle.roundTripRate}/km`
                              : `₹${vehicle.oneWayRate}/km`}
                        </span>
                      </div>

                      {/* 3-Tier Transparent Pricing Matrix */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-3 gap-1.5 text-center text-[10px]">
                        <div className={`p-1.5 rounded-lg border transition-all ${tripType === 'oneway' || tripType === 'airport' ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold' : 'bg-stone-50 border-stone-200/70 text-stone-600'}`}>
                          <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Single</span>
                          <span className="font-mono font-bold">₹{vehicle.oneWayRate}/km</span>
                        </div>
                        <div className={`p-1.5 rounded-lg border transition-all ${tripType === 'roundtrip' ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold' : 'bg-stone-50 border-stone-200/70 text-stone-600'}`}>
                          <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Round</span>
                          <span className="font-mono font-bold">₹{vehicle.roundTripRate}/km</span>
                        </div>
                        <div className={`p-1.5 rounded-lg border transition-all ${tripType === 'local' ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold' : 'bg-stone-50 border-stone-200/70 text-stone-600'}`}>
                          <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Local</span>
                          <span className="font-mono font-bold">₹{vehicle.localHourlyRate}/hr</span>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="mt-3 flex items-center gap-3 text-xs text-stone-600 font-medium">
                        <span>👥 {vehicle.passengers} Seats</span>
                        <span>🧳 {vehicle.luggage} Bags</span>
                        <span>❄️ AC</span>
                      </div>

                      <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                        {vehicle.description}
                      </p>
                    </div>

                    {/* Fare Summary & Select Button */}
                    <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-400">Total Calculated Fare</div>
                        <div className="text-xl font-extrabold text-stone-900">
                          ₹{vehicleFare.fare.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          {vehicleFare.formulaDescription}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProceedToStep3(vehicle.id);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold shadow-sm'
                            : 'bg-stone-900 hover:bg-stone-800 text-white font-bold shadow-2xs'
                        }`}
                      >
                        <span>{isSelected ? 'Proceed with Cab' : 'Select & Proceed'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setTimeout(scrollToBookingTop, 20);
                }}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Trip Details</span>
              </button>

              <button
                type="button"
                onClick={() => handleProceedToStep3()}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Continue to Passenger Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: PASSENGER DETAILS */}
        {currentStep === 3 && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-6">
            <div className="max-w-xl mx-auto space-y-4">
              
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg text-stone-900">Passenger &amp; Contact Information</h3>
                <p className="text-xs text-stone-500 mt-1">
                  We need your details to assign a driver and send pickup updates via SMS/WhatsApp.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter passenger name"
                  className="w-full bg-stone-50 focus:bg-white text-stone-900 text-sm font-semibold rounded-xl px-4 py-3 border border-stone-200 focus:border-amber-500 outline-none transition-all"
                />
                {passengerFormErrors.name && (
                  <span className="text-xs text-red-600 mt-1 block">{passengerFormErrors.name}</span>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 font-bold text-stone-500 text-sm">+91</span>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-stone-50 focus:bg-white text-stone-900 text-sm font-semibold rounded-xl pl-12 pr-4 py-3 border border-stone-200 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                {passengerFormErrors.phone && (
                  <span className="text-xs text-red-600 mt-1 block">{passengerFormErrors.phone}</span>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full bg-stone-50 focus:bg-white text-stone-900 text-sm font-medium rounded-xl px-4 py-3 border border-stone-200 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Special Requests / Pickup Instructions
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Landmark near house, extra luggage, child traveling, etc."
                  className="w-full bg-stone-50 focus:bg-white text-stone-900 text-xs font-medium rounded-xl px-4 py-2.5 border border-stone-200 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Next: Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </form>
        )}

        {/* STEP 4: PAYMENT METHOD */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="max-w-xl mx-auto space-y-4">
              
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg text-stone-900">Choose Payment Method</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Pay securely after trip completion or directly via UPI QR code.
                </p>
              </div>

              {/* Payment Option 1: Cash on Delivery / Pay Driver */}
              <div
                onClick={() => {
                  setPaymentMethod('cod');
                  setUpiError(null);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/40'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-stone-100 text-stone-900 shrink-0">
                  <Banknote className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">Pay Driver / Cash on Delivery</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">No Advance Required</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Pay directly in Cash or via driver's UPI QR code upon arrival at your drop destination.
                  </p>
                </div>
              </div>

              {/* Payment Option 2: UPI QR Code Payment */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3.5 ${
                  paymentMethod === 'upi'
                    ? 'border-amber-500 bg-amber-50/20 ring-2 ring-amber-400/40 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-stone-100 text-stone-900 shrink-0">
                    <QrCode className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900">Scan &amp; Pay via UPI QR Code</span>
                      <span className="text-[10px] font-bold font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">Instant Transfer</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Pay using Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app.
                    </p>
                  </div>
                </div>

                {/* Expanded UPI QR Payment Box */}
                {paymentMethod === 'upi' && (
                  <div className="mt-2 pt-4 border-t border-amber-200/70 space-y-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Final Calculated Booking Amount */}
                    <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-3.5 text-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                        Final Calculated Booking Amount
                      </span>
                      <div className="text-3xl font-black text-stone-950 font-mono mt-0.5">
                        ₹{fareDetails.fare.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-stone-600 font-medium block mt-0.5">
                        {selectedVehicle.name} &bull; {fareDetails.formulaDescription}
                      </span>
                    </div>

                    {/* QR Code Container with Clear Instructions */}
                    <div className="bg-white rounded-2xl border border-stone-200 p-5 text-center shadow-xs space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                        <QrCode className="w-3.5 h-3.5 text-amber-700" />
                        <span>Scan the QR code to pay</span>
                      </div>

                      <div className="flex justify-center p-2">
                        <img
                          src={upiQrDataUrl}
                          alt="Bokde Travels UPI QR Code"
                          className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl border-2 border-stone-200 bg-white p-2 shadow-xs"
                        />
                      </div>

                      <p className="text-xs text-stone-600">
                        Open <strong className="text-stone-900">Google Pay, PhonePe, Paytm</strong>, or any UPI app and scan this QR code to complete the payment.
                      </p>

                      {/* UPI ID & Copy Bar */}
                      <div className="flex items-center justify-between gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl max-w-sm mx-auto text-xs">
                        <div className="text-left">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block leading-none">UPI ID</span>
                          <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">{BUSINESS_CONFIG.upiId}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Optional UPI Reference Number / UTR */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        UPI Transaction / UTR Ref Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={upiTransactionRef}
                        onChange={(e) => setUpiTransactionRef(e.target.value)}
                        placeholder="e.g. 12-digit UTR from payment receipt"
                        className="w-full bg-white text-stone-900 text-xs font-medium rounded-xl px-4 py-2.5 border border-stone-200 focus:border-amber-500 outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-300/80 hover:bg-amber-100/60 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          id="upi-confirmation-check"
                          checked={hasCompletedUpiPayment}
                          onChange={(e) => {
                            setHasCompletedUpiPayment(e.target.checked);
                            if (e.target.checked) setUpiError(null);
                          }}
                          className="w-4 h-4 mt-0.5 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-stone-900 leading-snug">
                          I have completed the UPI payment of ₹{fareDetails.fare.toLocaleString()} to {BUSINESS_CONFIG.upiId}
                        </span>
                      </label>
                    </div>

                    {/* Error Banner */}
                    {upiError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{upiError}</span>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToReview}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Review Booking Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 5: REVIEW BOOKING & CONFIRM */}
        {currentStep === 5 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="text-center">
                <h3 className="font-bold text-xl text-stone-900">Review Your Booking Summary</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Please verify your journey details before confirming your cab.
                </p>
              </div>

              {/* Summary Table */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Route:</span>
                  <span className="font-bold text-stone-900 text-right">{pickup} &rarr; {drop}</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Trip Type:</span>
                  <span className="font-bold text-stone-900 capitalize">{tripType}</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Date &amp; Time:</span>
                  <span className="font-bold text-stone-900">{travelDate} at {travelTime}</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Selected Vehicle:</span>
                  <span className="font-bold text-stone-900">{selectedVehicle.name} ({selectedVehicle.category})</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Passengers:</span>
                  <span className="font-bold text-stone-900">{passengers} Passenger(s)</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">
                    {tripType === 'local' ? 'Rental Duration:' : 'Route Distance:'}
                  </span>
                  <span className="font-bold font-mono text-stone-900">
                    {tripType === 'local' ? `${localHours} Hours (Local Rental)` : `${distanceKm} km`}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Vehicle Rate:</span>
                  <span className="font-bold font-mono text-stone-900">
                    {tripType === 'local'
                      ? `₹${selectedVehicle.localHourlyRate}/hr`
                      : tripType === 'roundtrip'
                        ? `₹${selectedVehicle.roundTripRate}/km`
                        : `₹${selectedVehicle.oneWayRate}/km`}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Customer:</span>
                  <span className="font-bold text-stone-900">{customerName} ({customerPhone})</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Payment Mode:</span>
                  <span className="font-bold text-stone-900">
                    {paymentMethod === 'cod' ? (
                      <span className="text-stone-800">Pay Driver / Cash on Delivery</span>
                    ) : (
                      <span className="text-emerald-700">
                        UPI Confirmed ({BUSINESS_CONFIG.upiId}){upiTransactionRef ? ` - UTR: ${upiTransactionRef}` : ''}
                      </span>
                    )}
                  </span>
                </div>

                {/* Toll & Parking Note as requested */}
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200 text-amber-800">
                  <span className="font-medium">Toll &amp; Parking Charges:</span>
                  <span className="font-bold">Payable by customer</span>
                </div>

                {/* Grand Total */}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-base font-extrabold text-stone-900">Estimated Total Fare:</span>
                  <span className="text-2xl font-black text-amber-700">₹{fareDetails.fare.toLocaleString()}</span>
                </div>
              </div>

              {/* THREE Client Confirmation Points (Configurable placeholders) */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Important Travel Notes &amp; Confirmations:
                </div>
                {CLIENT_CONFIRMATION_POINTS.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Confirmation Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-10 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 text-white font-extrabold text-base rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Confirming Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 6: BOOKING CONFIRMATION SCREEN */}
        {currentStep === 6 && confirmedBooking && (
          <div className="p-6 sm:p-10 space-y-6 text-center">
            
            {/* Green Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Booking Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                Thank You, {confirmedBooking.customerName}!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Your cab reservation with Bokde Travels has been registered.
              </p>
            </div>

            {/* Confirmation Card */}
            <div className="max-w-md mx-auto bg-stone-50 border border-stone-200 rounded-2xl p-6 text-left space-y-3 text-xs sm:text-sm shadow-2xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Booking ID:</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  {confirmedBooking.bookingReference}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Route:</span>
                <span className="font-bold text-stone-900">{confirmedBooking.pickupLocation} &rarr; {confirmedBooking.dropLocation}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Vehicle:</span>
                <span className="font-bold text-stone-900">{confirmedBooking.vehicleName}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Date &amp; Time:</span>
                <span className="font-bold text-stone-900">{confirmedBooking.travelDate} at {confirmedBooking.travelTime}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Estimated Fare:</span>
                <span className="font-extrabold text-stone-900">₹{confirmedBooking.estimatedFare.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">Payment Mode:</span>
                <span className="font-bold text-stone-900">
                  {confirmedBooking.paymentMethod === 'upi' ? (
                    <span className="text-emerald-700 font-bold">UPI Confirmed ({BUSINESS_CONFIG.upiId})</span>
                  ) : (
                    <span className="text-stone-900">Pay Driver / Cash on Delivery</span>
                  )}
                </span>
              </div>
            </div>

            {/* WhatsApp & Call CTAs as requested */}
            <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${getWhatsAppBookingText(confirmedBooking)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send on WhatsApp</span>
              </a>

              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call {BUSINESS_CONFIG.phone}</span>
              </a>
            </div>

            {/* Book Another Cab Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setConfirmedBooking(null);
                }}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Book Another Cab
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
