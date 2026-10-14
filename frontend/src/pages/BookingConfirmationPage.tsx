import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import type { Booking } from '../types/booking';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { Button } from '../components/ui/Button';
import BrandLogo from '../components/ui/BrandLogo';
import { CheckCircle2, Calendar, Clock, Users, ArrowRight, Download, CalendarPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as Booking;

  if (!booking) {
    return <Navigate to="/booking" replace />;
  }

  const isPaid = 
    location.state?.isPaid === true || 
    booking?.paymentStatus === 'paid' || 
    (booking as any)?.payment_status === 'paid';

  const isTestBooking = 
    !isPaid && (
      location.state?.isTestBooking === true || 
      location.state?.testingMode === true || 
      booking?.testingMode === true ||
      (booking as any)?.testing_mode === true ||
      (booking as any)?.payment_mode === 'disabled' ||
      (booking as any)?.payment_status === 'testing_unpaid' ||
      Boolean(booking?.specialRequirements?.includes('Testing Mode'))
    );

  const displayCode = booking.bookingCode || (booking as any).booking_code || booking.id;
  const displayStartTime = booking.startTime || (booking as any).start_time?.substring(0, 5) || '';
  const displayEndTime = booking.endTime || (booking as any).end_time?.substring(0, 5) || '';
  const displayDuration = booking.duration || ((booking as any).duration_minutes ? `${(booking as any).duration_minutes / 60} Hour${(booking as any).duration_minutes > 60 ? 's' : ''}` : '');
  const displayGuests = booking.guests || (booking as any).guest_count || 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
          >
            <div className="bg-emerald-900 text-white p-8 md:p-12 text-center border-b border-emerald-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
              <div className="flex justify-center mb-6">
                <BrandLogo size="md" withLink={false} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-emerald-800/80 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-700 shadow-inner"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking Confirmed</h1>
              <p className="text-emerald-100 text-lg">Your WorkNiva workspace suite has been successfully reserved.</p>
            </div>
            
            <div className="p-8 md:p-12">
              {isPaid && (
                <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-center gap-2 text-sm font-semibold shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Payment Verified — Confirmed via Razorpay</span>
                </div>
              )}

              {isTestBooking && (
                <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center gap-2 text-sm font-semibold shadow-2xs">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Testing Mode — No Payment Collected</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Booking Reference</p>
                  <p className="font-bold text-lg text-emerald-900">{displayCode}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Purpose</p>
                  <p className="font-semibold text-slate-800">{booking.purpose}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Date</p>
                    <p className="font-semibold">{format(parseISO(booking.date), 'dd MMMM yyyy')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Time &amp; Duration</p>
                    <p className="font-semibold">{displayStartTime} – {displayEndTime} ({displayDuration})</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Guests</p>
                    <p className="font-semibold">{displayGuests} People</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t border-b border-slate-100 mb-8">
                <div>
                  <span className="font-medium text-slate-600 block">
                    {isTestBooking ? 'Total Booking Value' : 'Total Amount Paid'}
                  </span>
                  {isTestBooking ? (
                    <span className="text-xs text-amber-700 font-medium">
                      Testing Mode — No Payment Collected
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium">
                      Paid via Razorpay • Taxes included
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">₹{booking.amount}</span>
                  {isTestBooking ? (
                    <span className="block text-xs font-semibold uppercase tracking-wider text-amber-700 mt-0.5">
                      Unpaid (Testing)
                    </span>
                  ) : (
                    <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mt-0.5">
                      Paid
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" size="lg" onClick={() => navigate('/my-bookings')}>
                  View My Bookings <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="flex-1" size="lg" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
              
              <div className="flex justify-center gap-6 mt-8">
                <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <CalendarPlus className="w-4 h-4" /> Add to Calendar
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <Download className="w-4 h-4" /> Download Confirmation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;
