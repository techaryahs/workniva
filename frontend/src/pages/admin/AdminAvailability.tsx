import { useState, useEffect } from 'react';
import { getAdminBookings, getBlockedTimes, blockTime, unblockTime } from '../../services/adminService';
import type { Booking } from '../../types/booking';
import type { BlockedTime } from '../../services/adminService';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

const AdminAvailability = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<BlockedTime[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setBookings(await getAdminBookings());
    setBlocked(await getBlockedTimes());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);


  const slots = Array.from({ length: 14 }).map((_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleToggleBlock = async (slot: string, isBooked: boolean, blockedItem?: BlockedTime) => {
    setErrorMsg(null);
    if (isBooked) {
      setErrorMsg(`Cannot modify slot at ${slot}. It is already booked by a customer.`);
      return;
    }

    if (blockedItem) {
      await unblockTime(blockedItem.id);
    } else {
      const endHour = parseInt(slot) + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;
      await blockTime({ date, startTime: slot, endTime, reason: 'Admin Blocked' });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Office Availability</h1>
        <p className="text-slate-500">Manage hourly availability and manually block slots.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <input 
          type="date" 
          className="p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
          value={date}
          onChange={e => { setDate(e.target.value); setErrorMsg(null); }}
        />
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {slots.map(slot => {
            const hour = parseInt(slot);
            const slotBookings = bookings.filter(b => b.date === date && parseInt(b.startTime) <= hour && parseInt(b.endTime) > hour && b.status !== 'Cancelled');
            const slotBlocked = blocked.filter(b => b.date === date && parseInt(b.startTime) <= hour && parseInt(b.endTime) > hour);
            
            const isBooked = slotBookings.length > 0;
            const isBlocked = slotBlocked.length > 0;
            
            let statusBadge = <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Available</span>;
            if (isBooked) statusBadge = <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Booked</span>;
            if (isBlocked) statusBadge = <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">Blocked</span>;

            return (
              <div key={slot} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-6">
                  <span className="font-bold text-slate-800 w-20">{slot}</span>
                  {statusBadge}
                  {isBooked && <span className="text-sm text-slate-500">by {slotBookings[0].customer.fullName}</span>}
                  {isBlocked && <span className="text-sm text-slate-500">{slotBlocked[0].reason}</span>}
                </div>
                
                <button
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isBooked ? 'text-slate-400 bg-slate-100 cursor-not-allowed' : isBlocked ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
                  onClick={() => handleToggleBlock(slot, isBooked, slotBlocked[0])}
                >
                  {isBooked ? 'Unavailable' : isBlocked ? 'Unblock Slot' : 'Block Slot'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAvailability;
