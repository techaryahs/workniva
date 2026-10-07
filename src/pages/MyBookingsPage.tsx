import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Booking } from '../types/booking';
import { getMyBookings } from '../services/bookingService';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';
import logoImg from '../assets/logo.png';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Cancelled') return b.status === 'Cancelled';
    if (activeTab === 'Completed') return b.status === 'Completed';
    return b.status === 'Confirmed';
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
              <p className="text-slate-600">Manage your office reservations.</p>
            </div>
            <Button onClick={() => navigate('/booking')}>Book New Space</Button>
          </div>
          
          <div className="flex border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
            {['Upcoming', 'Completed', 'Cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'Upcoming' | 'Completed' | 'Cancelled')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {isLoading ? (
            <div className="py-20 text-center text-slate-500">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <img src={logoImg} alt="WorkNiva" className="w-16 h-16 rounded-2xl shadow-sm mx-auto mb-4 object-contain" />
              <h3 className="text-xl font-bold mb-2">No {activeTab.toLowerCase()} bookings</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {activeTab === 'Upcoming' 
                  ? 'Your upcoming office bookings will appear here. Ready to find a workspace?' 
                  : `You don't have any ${activeTab.toLowerCase()} bookings yet.`}
              </p>
              {activeTab === 'Upcoming' && (
                <Button onClick={() => navigate('/booking')}>Book Your Space</Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">{booking.id}</span>
                      <h3 className="font-bold text-lg">{booking.purpose}</h3>
                    </div>
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                      booking.status === 'Confirmed' && "bg-green-100 text-green-700",
                      booking.status === 'Cancelled' && "bg-red-100 text-red-700",
                      booking.status === 'Completed' && "bg-slate-100 text-slate-700"
                    )}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{format(parseISO(booking.date), 'dd MMMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{booking.startTime} – {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Users className="w-4 h-4 shrink-0" />
                      <span>{booking.duration} • {booking.guests} Guests</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <span className="font-bold text-lg">₹{booking.amount}</span>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/my-bookings/${booking.id}`)}>
                      View Booking
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyBookingsPage;
