import { useState, useEffect } from 'react';
import type { Booking } from '../../types/booking';
import { getAdminBookings } from '../../services/adminService';
import { format, isToday, parseISO } from 'date-fns';
import { Calendar, IndianRupee, Users, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const b = await getAdminBookings();
        setBookings(b);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const todayBookings = bookings.filter(b => isToday(parseISO(b.date)));
  const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date() && b.status === 'Confirmed');
  
  const todayRevenue = todayBookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((sum, b) => sum + b.amount, 0);
  const totalAvailableSlots = 14 - todayBookings.filter(b => b.status !== 'Cancelled').length; // Mock 14 slots a day

  if (isLoading) {
    return <div className="text-slate-500 py-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Good morning, Admin</h1>
        <p className="text-slate-500">Here's what's happening across your WorkNiva workspaces today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Today's Bookings</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{todayBookings.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Upcoming Bookings</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{upcomingBookings.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Today's Revenue</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><IndianRupee className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">₹{todayRevenue}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium">Available Slots</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{Math.max(0, totalAvailableSlots)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Today's Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No bookings for today.</td>
                  </tr>
                ) : (
                  todayBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{b.id}</td>
                      <td className="px-6 py-4">{b.customer.fullName}</td>
                      <td className="px-6 py-4">{b.startTime} - {b.endTime}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Upcoming Bookings</h3>
            <a href="/admin/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</a>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No upcoming bookings.</div>
            ) : (
              upcomingBookings.slice(0, 5).map(b => (
                <div key={b.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800">{b.customer.fullName}</p>
                    <p className="text-sm text-slate-500">{format(parseISO(b.date), 'MMM dd, yyyy')} • {b.startTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">{b.purpose}</p>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{b.duration}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
