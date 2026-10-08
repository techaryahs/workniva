import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Booking } from '../types/booking';
import { getBookingById, cancelMyBooking } from '../services/bookingService';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, ArrowLeft, MapPin, AlertCircle, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    if (!booking) return;
    setIsCancelling(true);
    try {
      const updated = await cancelMyBooking(booking.id);
      if (updated) {
        setBooking(updated);
        setShowCancelModal(false);
      }
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <div className="text-slate-500">Loading booking details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Booking not found</h2>
            <Button onClick={() => navigate('/my-bookings')}>Back to My Bookings</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <button 
            onClick={() => navigate('/my-bookings')}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Bookings
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-400 mb-1">Booking ID: {booking.id}</p>
                <h1 className="text-2xl md:text-3xl font-bold">{booking.purpose}</h1>
              </div>
              <span className={clsx(
                "inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider self-start md:self-auto",
                booking.status === 'Confirmed' && "bg-green-100 text-green-700",
                booking.status === 'Cancelled' && "bg-red-100 text-red-700",
                booking.status === 'Completed' && "bg-slate-100 text-slate-700"
              )}>
                {booking.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-6 md:p-8 md:col-span-2 border-b md:border-b-0 md:border-r border-slate-100 space-y-8">
                
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">When & Where</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{format(parseISO(booking.date), 'EEEE, dd MMMM yyyy')}</p>
                        <p className="text-sm text-slate-500">Date</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{booking.startTime} – {booking.endTime}</p>
                        <p className="text-sm text-slate-500">{booking.duration}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">You Work Prime Location</p>
                        <p className="text-sm text-slate-500">123 Business Avenue, Tech District</p>
                      </div>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Customer Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="font-semibold">{booking.customer.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-semibold">{booking.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Mobile</p>
                      <p className="font-semibold">{booking.customer.mobile}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Company</p>
                      <p className="font-semibold">{booking.customer.company || '-'}</p>
                    </div>
                  </div>
                </section>
                
                {booking.specialRequirements && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Special Requirements</h3>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">{booking.specialRequirements}</p>
                  </section>
                )}
                
              </div>
              
              <div className="p-6 md:p-8 bg-slate-50 flex flex-col">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Summary</h3>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Guests</span>
                    <span className="font-semibold">{booking.guests}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Amount Paid</span>
                    <span className="font-semibold text-lg">₹{booking.amount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-400 pt-4 border-t border-slate-200">
                    <span>Booked on</span>
                    <span>{format(parseISO(booking.createdAt), 'dd MMM yyyy, HH:mm')}</span>
                  </div>
                </div>
                
                {booking.status === 'Confirmed' && (
                  <div className="mt-auto">
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                )}
                
                {booking.status === 'Cancelled' && (
                  <div className="mt-auto bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Booking Cancelled</p>
                      <p className="text-xs mt-1">This booking was cancelled and the slot is no longer reserved.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isCancelling && setShowCancelModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Cancel Booking</h3>
                  <button 
                    onClick={() => setShowCancelModal(false)}
                    disabled={isCancelling}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-6 flex gap-3 text-amber-800">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setShowCancelModal(false)}
                    disabled={isCancelling}
                  >
                    Keep Booking
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
                    onClick={handleCancel}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingDetailsPage;
