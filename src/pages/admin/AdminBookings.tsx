import { useState, useEffect } from 'react';
import type { Booking } from '../../types/booking';
import { getAdminBookings, updateBookingStatus } from '../../services/adminService';
import { getPaymentDetails } from '../../services/paymentApi';
import { format, parseISO } from 'date-fns';
import { Search, Filter, MoreVertical, CheckCircle, XCircle } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    const data = await getAdminBookings();
    setBookings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);


  const handleViewPayment = async (bookingId: string) => {
    try {
      const data = await getPaymentDetails(bookingId);
      if (!data) {
        alert("No payment records found for this booking.");
        return;
      }
      alert(`Payment Status: ${data.status.toUpperCase()}\nPayment ID: ${data.provider_payment_id || 'N/A'}\nOrder ID: ${data.provider_order_id}\nAmount: ₹${data.amount}\nProvider: ${data.provider}`);
    } catch (err: any /* eslint-disable-line */) {
      alert(err.message || "Could not load payment info.");
    }
  };

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    await updateBookingStatus(id, status);
    await // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  };

  const filtered = bookings.filter(b => {
    if (filter !== 'All' && b.status !== filter) return false;
    if (search && !b.customer.fullName.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Bookings</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID or customer..." 
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            className="w-full sm:w-auto py-2 px-3 rounded-lg border border-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending_payment">Pending Payment</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No bookings found.</td></tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{b.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{b.customer.fullName}</p>
                      <p className="text-xs text-slate-500">{b.customer.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{format(parseISO(b.date), 'MMM dd, yyyy')}</p>
                      <p className="text-xs text-slate-500">{b.startTime} - {b.endTime}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{b.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : b.status === 'Pending_payment' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'Confirmed' && (
                          <>
                            <button onClick={() => handleStatusChange(b.id, 'Completed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Mark Completed">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleStatusChange(b.id, 'Cancelled')} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Cancel Booking">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button onClick={() => handleViewPayment(b.id)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 mr-2">Payment Info</button>
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
