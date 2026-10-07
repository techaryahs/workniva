import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { RotateCw, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<any /* eslint-disable-line */ []>([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi('/admin/notifications');
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, []);

  const handleRetry = async (id: string) => {
    try {
      await fetchApi(`/admin/notifications/${id}/retry`, { method: 'POST' });
      alert('Notification queued for retry.');
      fetchNotifications();
    } catch (e: any /* eslint-disable-line */) {
      alert(e.message || 'Retry failed');
    }
  };

  const filtered = notifications.filter(n => {
    if (filter !== 'All' && n.status !== filter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        <div className="flex gap-2">
          <select 
            className="py-2 px-3 rounded-lg border border-slate-200 outline-none"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">ID / Type</th>
              <th className="px-6 py-4">Booking</th>
              <th className="px-6 py-4">Channel / Recipient</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No notifications found.</td></tr>
            ) : (
              filtered.map(n => (
                <tr key={n.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{n.type}</p>
                    <p className="text-xs text-slate-500">{n.id.substring(0, 8)}...</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {n.bookings?.booking_code || n.booking_id.substring(0,8)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800 uppercase text-xs mr-2">{n.channel}</span>
                    <span className="text-slate-600">{n.recipient}</span>
                  </td>
                  <td className="px-6 py-4">
                    {n.status === 'sent' && <span className="flex items-center text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded w-max"><CheckCircle className="w-3 h-3 mr-1"/> Sent</span>}
                    {n.status === 'failed' && <span className="flex items-center text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded w-max" title={n.error_message}><XCircle className="w-3 h-3 mr-1"/> Failed</span>}
                    {n.status === 'pending' && <span className="flex items-center text-orange-600 text-xs font-semibold bg-orange-50 px-2 py-1 rounded w-max"><Clock className="w-3 h-3 mr-1"/> Pending</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {format(parseISO(n.created_at), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {n.status === 'failed' && (
                      <button onClick={() => handleRetry(n.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Retry">
                        <RotateCw className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminNotifications;
