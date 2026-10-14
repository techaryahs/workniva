import React from 'react';
import type { BookingState } from '../../types/booking';
import { getPrice } from '../../lib/booking';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import logoImg from '../../assets/logo.png';
import { ShieldCheck, Lock } from 'lucide-react';

interface ReviewBookingProps {
  state: BookingState;
  onConfirm: () => void;
  onBack: () => void;
  isConfirming: boolean;
}

export const ReviewBooking: React.FC<ReviewBookingProps> = ({ state, onConfirm, onBack, isConfirming }) => {
  if (!state.date || !state.customer) return null;
  
  const price = getPrice(state.workspace, state.duration, state.guests);
  
  // Calculate end time conceptually
  const startHour = parseInt(state.timeSlot || '09:00');
  let endHourStr = '';
  if (state.duration) {
    let hours = 1;
    if (state.duration.includes('Hour')) hours = parseInt(state.duration);
    if (state.duration === 'Half Day') hours = 4;
    if (state.duration === 'Full Day' || state.duration === 'Night') hours = 8;
    const rawEndHour = startHour + hours;
    const endHour = rawEndHour >= 24 ? rawEndHour % 24 : rawEndHour;
    endHourStr = `${endHour.toString().padStart(2, '0')}:00`;
    if (rawEndHour >= 24) {
      endHourStr += ' (Next Day)';
    }
  }

  const workspaceName = state.workspace ? state.workspace.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'WorkNiva Workspace Suite';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto">
      <div className="flex justify-center mb-4">
        <img src={logoImg} alt="WorkNiva" className="w-12 h-12 rounded-xl shadow-xs object-contain" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Review Your Reservation</h2>
      <p className="text-slate-500 text-center mb-8">Please review your WorkNiva booking details before proceeding to payment.</p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Space</p>
            <p className="font-semibold text-slate-800">{workspaceName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Date</p>
            <p className="font-medium text-slate-800">{format(state.date, 'dd MMMM yyyy')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Time</p>
            <p className="font-medium text-slate-800">{state.timeSlot} – {endHourStr}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Duration</p>
            <p className="font-medium text-slate-800">{state.duration}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Guests</p>
            <p className="font-medium text-slate-800">{state.guests} People</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Customer</p>
            <p className="font-medium text-slate-800">{state.customer.fullName}</p>
            <p className="text-sm text-slate-600">{state.customer.email}</p>
            <p className="text-sm text-slate-600">{state.customer.mobile}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Purpose</p>
            <p className="font-medium text-slate-800">{state.customer.purpose}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <p className="text-lg font-bold text-slate-700">Total Payable</p>
            <p className="text-xs text-slate-400 font-medium">Taxes and utilities included</p>
          </div>
          <p className="text-2xl font-bold text-emerald-800">₹{price}</p>
        </div>

        {/* Payment Trust & Security Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Secure Checkout powered by Razorpay</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Instant booking confirmation. Accepts UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit Cards (Visa, Mastercard, RuPay), and NetBanking.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row-reverse gap-4 mt-8">
        <Button 
          className="w-full sm:w-2/3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center justify-center gap-2" 
          size="lg" 
          onClick={onConfirm} 
          disabled={isConfirming}
        >
          {isConfirming ? (
            'Initiating Payment...'
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ₹{price} &amp; Confirm
            </>
          )}
        </Button>
        <Button variant="outline" className="w-full sm:w-1/3" size="lg" onClick={onBack} disabled={isConfirming}>
          Back &amp; Edit
        </Button>
      </div>
    </div>
  );
};

