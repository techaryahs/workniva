import type { BookingState } from '../../types/booking';
import { getPrice } from '../../lib/booking';
import { format } from 'date-fns';
import { Calendar, Clock, Users, ArrowRight, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import logoImg from '../../assets/logo.png';

interface BookingSummaryProps {
  state: BookingState;
  onCheckAvailability: () => void;
  isChecking: boolean;
  availabilityStatus: 'idle' | 'available' | 'unavailable';
  availabilityMessage?: string;
  onContinue: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  state,
  onCheckAvailability,
  isChecking,
  availabilityStatus,
  availabilityMessage,
  onContinue
}) => {
  const price = getPrice(state.duration);
  const isComplete = state.date && state.timeSlot && state.duration;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col h-full sticky top-24">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Booking Summary</h2>
          <p className="text-xs text-slate-500 font-medium">WorkNiva Prime Reservation</p>
        </div>
        <img src={logoImg} alt="WorkNiva" className="w-9 h-9 rounded-lg shadow-xs object-contain" />
      </div>
      
      <div className="space-y-4 flex-grow mb-8">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-slate-500 font-medium">Date</p>
            <p className="font-medium">{state.date ? format(state.date, 'EEEE, MMMM d, yyyy') : 'Select a date'}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-slate-500 font-medium">Time & Duration</p>
            <p className="font-medium">
              {state.timeSlot ? state.timeSlot : 'Select time'} 
              {state.duration ? ` • ${state.duration}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-slate-500 font-medium">Guests</p>
            <p className="font-medium">{state.guests} {state.guests === 1 ? 'Person' : 'People'}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600">Total Price</span>
          <span className="text-2xl font-bold">₹{price}</span>
        </div>
        <p className="text-xs text-slate-400 text-right">Taxes included</p>
      </div>

      {availabilityStatus !== 'idle' && (
        <div className={`p-4 rounded-lg mb-6 flex gap-3 ${availabilityStatus === 'available' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {availabilityStatus === 'available' ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
          <div>
            <p className="font-medium text-sm">
              {availabilityStatus === 'available' ? 'Space is available!' : 'Space is unavailable.'}
            </p>
            {availabilityMessage && <p className="text-xs mt-1 opacity-90">{availabilityMessage}</p>}
          </div>
        </div>
      )}

      {availabilityStatus === 'available' ? (
        <Button className="w-full flex items-center justify-center gap-2" size="lg" onClick={onContinue}>
          Continue Booking <ArrowRight className="w-5 h-5" />
        </Button>
      ) : (
        <Button 
          className="w-full" 
          size="lg"
          disabled={!isComplete || isChecking} 
          onClick={onCheckAvailability}
        >
          {isChecking ? (
            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Checking...</>
          ) : (
            'Check Availability'
          )}
        </Button>
      )}
    </div>
  );
};
