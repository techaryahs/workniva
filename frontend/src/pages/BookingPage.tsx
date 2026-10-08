import { useState } from 'react';
import type { BookingState, CustomerDetails, BookingPurpose } from '../types/booking';
import { BookingCalendar } from '../components/booking/BookingCalendar';
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker';
import { DurationSelector } from '../components/booking/DurationSelector';
import { GuestSelector } from '../components/booking/GuestSelector';
import { BookingSummary } from '../components/booking/BookingSummary';
import { CustomerDetailsForm } from '../components/booking/CustomerDetailsForm';
import { ReviewBooking } from '../components/booking/ReviewBooking';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { getPrice } from '../lib/booking';
import { checkAvailability } from '../services/availabilityService';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { format } from 'date-fns';

type WizardStep = 'slot' | 'details' | 'review';

const BookingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('slot');
  const [state, setState] = useState<BookingState>({
    date: null,
    timeSlot: null,
    duration: null,
    guests: 1,
  });
  
  const [isChecking, setIsChecking] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'available' | 'unavailable'>('idle');
  const [availabilityMessage, setAvailabilityMessage] = useState<string>();

  const updateState = (updates: Partial<BookingState>) => {
    setState(s => ({ ...s, ...updates }));
    setAvailabilityStatus('idle');
    setAvailabilityMessage(undefined);
  };

  const handleCheck = async () => {
    if (!state.date || !state.timeSlot || !state.duration) return;
    
    setIsChecking(true);
    setAvailabilityStatus('idle');
    setAvailabilityMessage(undefined);
    
    try {
      const result = await checkAvailability(format(state.date, 'yyyy-MM-dd'), state.timeSlot);
      if (result.available) {
        setAvailabilityStatus('available');
      } else {
        setAvailabilityStatus('unavailable');
        setAvailabilityMessage(result.message);
      }
    } catch {
      setAvailabilityStatus('unavailable');
      setAvailabilityMessage('An error occurred while checking availability.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleContinueToDetails = () => {
    setCurrentStep('details');
  };

  const handleDetailsSubmit = (customer: CustomerDetails) => {
    updateState({ customer });
    setCurrentStep('review');
  };

  const handleConfirm = async () => {
    if (!state.date || !state.timeSlot || !state.duration || !state.customer) return;
    
    if (!isAuthenticated) {
      alert("Please log in to confirm your booking.");
      navigate("/login", { state: { from: { pathname: "/booking" } } });
      return;
    }
    
    setIsConfirming(true);
    try {
      // 1. Create booking (backend sets status = pending_payment)
      const newBooking = await createBooking({
        date: format(state.date, 'yyyy-MM-dd'),
        startTime: state.timeSlot,
        endTime: "00:00:00", // backend calculates this
        duration: state.duration,
        guests: state.guests,
        customer: state.customer,
        purpose: state.customer.purpose as BookingPurpose,
        specialRequirements: state.customer.specialRequirements,
        amount: 0, // backend calculates
        status: 'Pending_payment' as any /* eslint-disable-line */
      });

      // 2. Create Razorpay order
      const { createPaymentOrder, verifyPayment } = await import('../services/paymentApi');
      const order = await createPaymentOrder(newBooking.id);

      // 3. Open Razorpay Checkout
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "You Work",
        description: "Booking Payment",
        order_id: order.order_id,
        handler: async function (response: any /* eslint-disable-line */ /* eslint-disable-line */ ) {
          try {
            const confirmedBooking = await verifyPayment({
              ...response,
              booking_id: newBooking.id
            });
            navigate('/booking/confirmation', { state: { booking: confirmedBooking } });
          } catch (verifyErr: any /* eslint-disable-line */) {
            alert("Payment verification failed. Please try again or contact support.");
            navigate('/my-bookings');
          }
        },
        prefill: {
          name: state.customer.fullName,
          email: state.customer.email,
          contact: state.customer.mobile
        },
        theme: {
          color: "#2563EB"
        },
        modal: {
          ondismiss: function() {
            alert("Payment cancelled.");
            navigate('/my-bookings');
          }
        }
      };

      const rzp = new (window as any /* eslint-disable-line */).Razorpay(options);
      rzp.on('payment.failed', function (response: any /* eslint-disable-line */ /* eslint-disable-line */ ) {
        alert("Payment failed: " + response.error.description);
        navigate('/my-bookings');
      });
      rzp.open();

    } catch (err: any /* eslint-disable-line */ /* eslint-disable-line */ ) {
      alert(err.message);
      setIsConfirming(false);
    }
  };

  const steps = [
    { title: 'Date & Time', id: 'slot', num: 1 },
    { title: 'Duration', id: 'slot', num: 2 },
    { title: 'Details', id: 'details', num: 3 },
    { title: 'Review', id: 'review', num: 4 }
  ];
  
  let currentNum = 1;
  if (currentStep === 'slot' && state.timeSlot) currentNum = 2;
  if (currentStep === 'details') currentNum = 3;
  if (currentStep === 'review') currentNum = 4;

  const slotSteps = [
    { title: 'Select Date', component: <BookingCalendar selectedDate={state.date} onChange={(date) => updateState({ date })} /> },
    { title: 'Select Time', component: <TimeSlotPicker selectedSlot={state.timeSlot} onChange={(timeSlot) => updateState({ timeSlot })} />, show: !!state.date },
    { title: 'Duration', component: <DurationSelector selectedDuration={state.duration} onChange={(duration) => updateState({ duration })} />, show: !!state.timeSlot },
    { title: 'Guests', component: <GuestSelector guests={state.guests} onChange={(guests) => updateState({ guests })} />, show: !!state.duration },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-24 md:pb-0">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-12">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          
          <div className="mb-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2"></div>
              {steps.map((step) => {
                const isActive = currentNum === step.num;
                const isCompleted = currentNum > step.num;
                return (
                  <div key={step.num} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-50' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : `0${step.num}`}
                    </div>
                    <span className={`text-xs font-semibold hidden md:block ${isActive ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative">
            <div className={`w-full ${currentStep === 'slot' ? 'lg:w-2/3' : 'lg:w-full'}`}>
              
              {currentStep === 'slot' && (
                <div className="space-y-8">
                  {slotSteps.map((step, index) => {
                    if (step.show === false) return null;
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <h2 className="text-xl font-semibold text-slate-800">{step.title}</h2>
                        </div>
                        <div>
                          {step.component}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {currentStep === 'details' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <CustomerDetailsForm 
                    initialData={state.customer || {
                      fullName: profile?.full_name || '',
                      email: profile?.email || '',
                      mobile: profile?.phone || '',
                      company: profile?.company || ''
                    } as any /* eslint-disable-line @typescript-eslint/no-explicit-any */}
                    onSubmit={handleDetailsSubmit} 
                    onBack={() => setCurrentStep('slot')} 
                  />
                </motion.div>
              )}

              {currentStep === 'review' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <ReviewBooking 
                    state={state} 
                    onConfirm={handleConfirm} 
                    onBack={() => setCurrentStep('details')}
                    isConfirming={isConfirming}
                  />
                </motion.div>
              )}

            </div>

            {currentStep === 'slot' && (
              <div className="w-full lg:w-1/3">
                <div className="hidden md:block h-full">
                  <BookingSummary 
                    state={state} 
                    onCheckAvailability={handleCheck}
                    isChecking={isChecking}
                    availabilityStatus={availabilityStatus}
                    availabilityMessage={availabilityMessage}
                    onContinue={handleContinueToDetails}
                  />
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>

      {currentStep === 'slot' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total</p>
              <p className="text-lg font-bold">₹{state.duration ? getPrice(state.duration) : 0}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Status</p>
              <p className={`text-sm font-semibold ${availabilityStatus === 'available' ? 'text-green-600' : availabilityStatus === 'unavailable' ? 'text-red-600' : 'text-slate-700'}`}>
                {availabilityStatus === 'idle' ? 'Pending' : availabilityStatus === 'available' ? 'Available' : 'Unavailable'}
              </p>
            </div>
          </div>
          <button 
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 transition-colors hover:bg-blue-700 flex justify-center items-center gap-2"
            disabled={!state.date || !state.timeSlot || !state.duration || isChecking}
            onClick={availabilityStatus === 'available' ? handleContinueToDetails : handleCheck}
          >
            {isChecking ? 'Checking...' : availabilityStatus === 'available' ? 'Continue Booking' : 'Check Availability'}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookingPage;
