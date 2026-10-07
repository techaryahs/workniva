import { useState, useEffect } from 'react';
import { getAdminCustomers } from '../../services/adminService';
import type { AdminCustomer } from '../../services/adminService';
import { Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setCustomers(await getAdminCustomers());
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Bookings</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4">Last Booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No customers found.</td></tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{c.name}</p>
                      {c.company && <p className="text-xs text-slate-500">{c.company}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p>{c.email}</p>
                      <p className="text-xs text-slate-500">{c.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">{c.totalBookings}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-800">₹{c.totalSpent}</td>
                    <td className="px-6 py-4">{format(parseISO(c.lastBooking), 'MMM dd, yyyy')}</td>
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

export default AdminCustomers;
