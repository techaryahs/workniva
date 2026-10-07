import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import type { Booking } from '../types/booking';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Calendar, Clock, Users, ArrowRight, Download, CalendarPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as Booking;

  if (!booking) {
    return <Navigate to="/booking" replace />;
  }

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
            <div className="bg-green-50 p-8 md:p-12 text-center border-b border-green-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Booking Confirmed</h1>
              <p className="text-slate-600 text-lg">Your You Work space has been successfully reserved.</p>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Booking ID</p>
                  <p className="font-bold text-lg">{booking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Purpose</p>
                  <p className="font-semibold text-slate-800">{booking.purpose}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Date</p>
                    <p className="font-semibold">{format(parseISO(booking.date), 'dd MMMM yyyy')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Time & Duration</p>
                    <p className="font-semibold">{booking.startTime} – {booking.endTime} ({booking.duration})</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Guests</p>
                    <p className="font-semibold">{booking.guests} People</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t border-b border-slate-100 mb-8">
                <span className="font-medium text-slate-600">Total Amount Paid</span>
                <span className="text-2xl font-bold">₹{booking.amount}</span>
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
