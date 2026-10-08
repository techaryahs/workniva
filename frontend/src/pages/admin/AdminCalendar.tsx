import { useState, useEffect } from 'react';
import { getAdminBookings, getBlockedTimes, blockTime, unblockTime } from '../../services/adminService';
import type { Booking } from '../../types/booking';
import type { BlockedTime } from '../../services/adminService';
import { format, addDays, startOfWeek } from 'date-fns';
import { Button } from '../../components/ui/Button';

const AdminCalendar = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<BlockedTime[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showBlockModal, setShowBlockModal] = useState(false);

  const fetchData = async () => {
    setBookings(await getAdminBookings());
    setBlocked(await getBlockedTimes());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);


  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
          <p className="text-slate-500">View and manage office schedule.</p>
        </div>
        <Button onClick={() => setShowBlockModal(true)}>Block Time</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Week of {format(currentWeekStart, 'MMM dd, yyyy')}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevWeek}>Prev</Button>
            <Button variant="outline" size="sm" onClick={nextWeek}>Next</Button>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border-b border-slate-200">
              <div className="py-3 px-2 text-center text-sm font-medium text-slate-500 border-r border-slate-100">Time</div>
              {Array.from({ length: 7 }).map((_, i) => {
                const day = addDays(currentWeekStart, i);
                return (
                  <div key={i} className="py-3 px-2 text-center border-r border-slate-100 last:border-0">
                    <p className="text-xs text-slate-400 uppercase">{format(day, 'EEE')}</p>
                    <p className="font-bold">{format(day, 'dd')}</p>
                  </div>
                );
              })}
            </div>
            
            {Array.from({ length: 14 }).map((_, hourIdx) => {
              const hour = hourIdx + 8;
              const timeString = `${hour.toString().padStart(2, '0')}:00`;
              return (
                <div key={hour} className="grid grid-cols-8 border-b border-slate-100 last:border-0 h-16">
                  <div className="py-2 px-2 text-center text-xs text-slate-400 border-r border-slate-100 flex items-center justify-center">
                    {timeString}
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const day = addDays(currentWeekStart, dayIdx);
                    const dateStr = format(day, 'yyyy-MM-dd');
                    
                    const cellBookings = bookings.filter(b => b.date === dateStr && parseInt(b.startTime) <= hour && parseInt(b.endTime) > hour && b.status !== 'Cancelled');
                    const cellBlocked = blocked.filter(b => b.date === dateStr && parseInt(b.startTime) <= hour && parseInt(b.endTime) > hour);
                    
                    return (
                      <div key={dayIdx} className="border-r border-slate-100 last:border-0 p-1 relative group">
                        {cellBookings.map((b, i) => (
                          <div key={i} className="absolute inset-1 bg-blue-100 border border-blue-200 rounded text-[10px] p-1 overflow-hidden z-10">
                            <div className="font-bold text-blue-700 truncate">{b.customer.fullName}</div>
                            <div className="text-blue-600 truncate">{b.purpose}</div>
                          </div>
                        ))}
                        {cellBlocked.map((b, i) => (
                          <div key={i} className="absolute inset-1 bg-slate-200 border border-slate-300 rounded text-[10px] p-1 overflow-hidden z-10 flex flex-col justify-between">
                            <div className="font-bold text-slate-700 truncate">Blocked</div>
                            <div className="text-slate-600 truncate">{b.reason}</div>
                            <button onClick={() => unblockTime(b.id).then(fetchData)} className="hidden group-hover:block text-red-500 hover:text-red-700 text-xs">Unblock</button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Block Time</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await blockTime({
                date: fd.get('date') as string,
                startTime: fd.get('startTime') as string,
                endTime: fd.get('endTime') as string,
                reason: fd.get('reason') as string,
              });
              setShowBlockModal(false);
              // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" name="date" required className="w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input type="time" name="startTime" required className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input type="time" name="endTime" required className="w-full p-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input type="text" name="reason" required className="w-full p-2 border rounded" placeholder="e.g. Maintenance" />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowBlockModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Block Time</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
