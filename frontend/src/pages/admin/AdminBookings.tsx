import React, { useState, useEffect } from 'react';
import type { Booking } from '../../types/booking';
import { getAdminBookings, updateBookingStatus } from '../../services/adminService';
import { format, parseISO } from 'date-fns';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  CreditCard, 
  AlertTriangle, 
  Eye, 
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const formatWorkspaceLabel = (type?: string, id?: string): { name: string; resource: string } => {
  switch (type) {
    case 'private-cabin':
      return { 
        name: 'Private Cabin', 
        resource: id ? id.replace('cabin-', 'Cabin ') : 'Cabin' 
      };
    case 'conference-room':
      return { 
        name: 'Conference Room', 
        resource: id ? id.replace('conf-', 'Room ') : 'Room 1' 
      };
    case 'bench-seating':
      return { 
        name: 'Dedicated Bench', 
        resource: 'Bench Area' 
      };
    case 'whole-night':
      return { 
        name: 'Entire Office', 
        resource: 'Whole Space (Night)' 
      };
    default:
      return { 
        name: type ? type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Workspace', 
        resource: id || 'Standard' 
      };
  }
};

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [workspaceFilter, setWorkspaceFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Selected Booking for Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => (b.id === id ? updated : b)));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setWorkspaceFilter('All');
    setPaymentFilter('All');
    setDateFilter('');
  };

  const hasActiveFilters = search !== '' || statusFilter !== 'All' || workspaceFilter !== 'All' || paymentFilter !== 'All' || dateFilter !== '';

  const filtered = bookings.filter(b => {
    // Status Filter
    if (statusFilter !== 'All' && b.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

    // Workspace Filter
    if (workspaceFilter !== 'All') {
      const ws = (b.resourceType || b.workspace || '').toLowerCase();
      if (!ws.includes(workspaceFilter.toLowerCase())) return false;
    }

    // Payment Filter
    if (paymentFilter !== 'All') {
      const pStatus = (b.paymentStatus || (b.testingMode ? 'testing_unpaid' : 'unpaid')).toLowerCase();
      if (paymentFilter === 'testing_unpaid' && !pStatus.includes('testing')) return false;
      if (paymentFilter === 'paid' && pStatus !== 'paid') return false;
      if (paymentFilter === 'pending' && pStatus !== 'pending') return false;
      if (paymentFilter === 'unpaid' && pStatus !== 'unpaid') return false;
      if (paymentFilter === 'failed' && pStatus !== 'failed') return false;
    }

    // Date Filter
    if (dateFilter && b.date !== dateFilter) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const codeMatch = (b.bookingCode || '').toLowerCase().includes(q);
      const idMatch = b.id.toLowerCase().includes(q);
      const nameMatch = (b.customer?.fullName || '').toLowerCase().includes(q);
      const emailMatch = (b.customer?.email || '').toLowerCase().includes(q);
      const phoneMatch = (b.customer?.mobile || '').toLowerCase().includes(q);
      if (!codeMatch && !idMatch && !nameMatch && !emailMatch && !phoneMatch) return false;
    }

    return true;
  });

  // Calculate summary metrics
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const testingCount = bookings.filter(b => b.testingMode || b.paymentStatus === 'testing_unpaid' || b.specialRequirements?.includes('Testing Mode')).length;
  const totalRevenue = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Booking Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor reservations across all workspaces</p>
        </div>
        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Bookings</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Confirmed</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{confirmedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Testing Mode</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{testingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Value</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reference, customer name, email, phone..." 
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="py-2 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              className="py-2 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending_payment">Pending Payment</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Workspace Filter */}
          <select 
            className="py-2 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
            value={workspaceFilter}
            onChange={e => setWorkspaceFilter(e.target.value)}
          >
            <option value="All">All Workspaces</option>
            <option value="private-cabin">Private Cabin</option>
            <option value="conference-room">Conference Room</option>
            <option value="bench-seating">Bench Seating</option>
            <option value="whole-night">Whole Night Office</option>
          </select>

          {/* Payment Filter */}
          <select 
            className="py-2 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
          >
            <option value="All">All Payment States</option>
            <option value="paid">Paid</option>
            <option value="testing_unpaid">Testing Mode (Unpaid)</option>
            <option value="pending">Payment Pending</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Reference / Time</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Workspace & Resource</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Booking Status</th>
                <th className="px-6 py-4">Payment Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading reservations...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <p className="font-medium">No bookings match the selected criteria.</p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="mt-2 text-xs text-emerald-600 hover:underline"
                      >
                        Reset all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(b => {
                  const ws = formatWorkspaceLabel(b.resourceType || b.workspace, b.resourceId);
                  const isTesting = Boolean(b.testingMode || b.paymentStatus === 'testing_unpaid' || b.specialRequirements?.includes('Testing Mode'));
                  
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Reference */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 font-mono text-xs block">
                          {b.bookingCode || b.id.substring(0, 8)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {b.createdAt ? format(parseISO(b.createdAt), 'MMM dd, HH:mm') : 'N/A'}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{b.customer?.fullName || 'Guest'}</p>
                        <p className="text-xs text-slate-500">{b.customer?.email}</p>
                        {b.customer?.mobile && (
                          <p className="text-[11px] text-slate-400">{b.customer.mobile}</p>
                        )}
                      </td>

                      {/* Workspace & Resource */}
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800 block text-xs">{ws.name}</span>
                        <span className="inline-block mt-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {ws.resource}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800 text-xs">
                          {b.date ? format(parseISO(b.date), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {b.startTime} - {b.endTime} ({b.duration})
                        </p>
                        <p className="text-[11px] text-slate-400">{b.guests} guest{b.guests > 1 ? 's' : ''}</p>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 text-sm">₹{b.amount}</span>
                      </td>

                      {/* Booking Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === 'Confirmed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : b.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : b.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            b.status === 'Confirmed' ? 'bg-emerald-500' :
                            b.status === 'Completed' ? 'bg-blue-500' :
                            b.status === 'Cancelled' ? 'bg-rose-500' : 'bg-amber-500'
                          }`} />
                          {b.status === 'Pending_payment' ? 'Pending' : b.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-4">
                        {isTesting ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/70 border border-amber-200 px-2.5 py-1 rounded-full">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Testing (Unpaid)
                          </span>
                        ) : b.paymentStatus === 'paid' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Paid
                          </span>
                        ) : b.paymentStatus === 'pending' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-800 bg-orange-100/70 border border-orange-200 px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-orange-600" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                            Unpaid
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                            title="View Full Booking Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </button>

                          {b.status === 'Confirmed' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(b.id, 'Completed')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Mark as Completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(b.id, 'Cancelled')}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                title="Cancel Booking"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {b.status === 'Cancelled' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Confirmed')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded text-xs font-medium"
                              title="Reactivate Booking"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Booking Details</h3>
                  <span className="font-mono text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                    {selectedBooking.bookingCode || selectedBooking.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Created {selectedBooking.createdAt ? format(parseISO(selectedBooking.createdAt), 'PPP p') : 'N/A'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              
              {/* Testing Mode Banner */}
              {(selectedBooking.testingMode || selectedBooking.paymentStatus === 'testing_unpaid' || selectedBooking.specialRequirements?.includes('Testing Mode')) && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-amber-800">Testing Mode Reservation</h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Testing mode: no payment has been collected. This reservation is recorded as an unpaid test booking.
                    </p>
                  </div>
                </div>
              )}

              {/* Status Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Booking Status</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedBooking.status}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Payment Status</p>
                  <p className="font-bold text-emerald-700 mt-0.5 capitalize">
                    {selectedBooking.testingMode ? 'Testing (Unpaid)' : (selectedBooking.paymentStatus || 'Unpaid')}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Price</p>
                  <p className="font-bold text-slate-900 mt-0.5 text-base">₹{selectedBooking.amount}</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm">
                  <User className="w-4 h-4 text-emerald-700" />
                  <h4>Customer Information</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Full Name:</span>
                    <span className="font-medium text-slate-800">{selectedBooking.customer?.fullName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email Address:</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${selectedBooking.customer?.email}`} className="font-medium text-emerald-700 hover:underline">
                        {selectedBooking.customer?.email || 'N/A'}
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mobile Phone:</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${selectedBooking.customer?.mobile}`} className="font-medium text-emerald-700 hover:underline">
                        {selectedBooking.customer?.mobile || 'N/A'}
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Company / Organization:</span>
                    <span className="font-medium text-slate-800">{selectedBooking.customer?.company || 'None provided'}</span>
                  </div>
                </div>
              </div>

              {/* Workspace and Schedule Details */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <h4>Workspace & Reservation Schedule</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Workspace:</span>
                    <span className="font-medium text-slate-800">
                      {formatWorkspaceLabel(selectedBooking.resourceType || selectedBooking.workspace, selectedBooking.resourceId).name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Resource:</span>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {selectedBooking.resourceId || 'Standard Allocation'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date:</span>
                    <span className="font-medium text-slate-800">
                      {selectedBooking.date ? format(parseISO(selectedBooking.date), 'PPPP') : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Time Slot:</span>
                    <span className="font-medium text-slate-800">
                      {selectedBooking.startTime} - {selectedBooking.endTime} ({selectedBooking.duration})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Number of Guests:</span>
                    <span className="font-medium text-slate-800">{selectedBooking.guests} person(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Purpose of Booking:</span>
                    <span className="font-medium text-slate-800">{selectedBooking.purpose || 'Client Meeting'}</span>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {selectedBooking.specialRequirements && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <h4 className="text-slate-800 font-semibold text-xs uppercase tracking-wider mb-1">
                    Special Requirements & Notes
                  </h4>
                  <p className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200">
                    {selectedBooking.specialRequirements}
                  </p>
                </div>
              )}

              {/* Payment Records Details */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <h4>Payment Information</h4>
                </div>
                {selectedBooking.latestPayment ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Payment Provider:</span>
                      <span className="font-medium text-slate-800 uppercase">{selectedBooking.latestPayment.provider || 'Razorpay'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Order ID:</span>
                      <span className="font-mono text-slate-700">{selectedBooking.latestPayment.provider_order_id || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Payment ID:</span>
                      <span className="font-mono text-slate-700">{selectedBooking.latestPayment.provider_payment_id || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Payment Amount:</span>
                      <span className="font-bold text-slate-900">₹{selectedBooking.latestPayment.amount}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    {selectedBooking.testingMode || selectedBooking.specialRequirements?.includes('Testing Mode')
                      ? 'No online payment transaction was recorded (reservation was confirmed via Testing Mode).'
                      : 'No Razorpay payment record is currently attached to this reservation.'}
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer with Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Update Status:</span>
                {selectedBooking.status !== 'Confirmed' && (
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition"
                  >
                    Set Confirmed
                  </button>
                )}
                {selectedBooking.status !== 'Completed' && (
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(selectedBooking.id, 'Completed')}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition"
                  >
                    Set Completed
                  </button>
                )}
                {selectedBooking.status !== 'Cancelled' && (
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition shadow-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBookings;
