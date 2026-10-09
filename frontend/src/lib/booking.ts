import { fetchApi } from "../services/api";


import { format } from 'date-fns';
import type { DurationOption } from '../types/booking';


export const getPriceBreakdown = (workspace: string | null, duration: DurationOption | null, guests: number) => {
  if (!workspace || !duration) return { total: 0, breakdown: [] };
  
  const hours = getDurationHours(duration);

  if (workspace === 'private-cabin') {
    const basePrice = 400 * hours;
    const extraGuests = Math.max(0, guests - 4);
    const extraPrice = extraGuests * 50 * hours;
    const breakdown = [
      { label: `Cabin rental: ₹400 × ${hours} hours`, value: basePrice }
    ];
    if (extraGuests > 0) {
      breakdown.push({ label: `Extra guest: ₹50 × ${extraGuests} × ${hours} hours`, value: extraPrice });
    }
    return { total: basePrice + extraPrice, breakdown };
  }
  
  if (workspace === 'conference-room') {
    const basePrice = 500 * hours;
    const extraGuests = Math.max(0, guests - 5);
    const extraPrice = extraGuests * 50 * hours;
    const breakdown = [
      { label: `Room rental: ₹500 × ${hours} hours`, value: basePrice }
    ];
    if (extraGuests > 0) {
      breakdown.push({ label: `Extra guest: ₹50 × ${extraGuests} × ${hours} hours`, value: extraPrice });
    }
    return { total: basePrice + extraPrice, breakdown };
  }

  if (workspace === 'bench-seating') {
    const total = 100 * guests * hours;
    return { 
      total, 
      breakdown: [{ label: `Bench seats: ₹100 × ${guests} guests × ${hours} hours`, value: total }] 
    };
  }

  if (workspace === 'whole-night') {
    const total = 599 * guests;
    return { 
      total, 
      breakdown: [{ label: `Overnight pass: ₹599 × ${guests} guests`, value: total }] 
    };
  }

  return { total: 0, breakdown: [] };
};

export const getPrice = (workspace: string | null, duration: DurationOption | null, guests: number): number => {
  return getPriceBreakdown(workspace, duration, guests).total;
};

export const getDurationHours = (duration: DurationOption): number => {
  switch (duration) {
    case '1 Hour': return 1;
    case '2 Hours': return 2;
    case '3 Hours': return 3;
    case '4 Hours': return 4;
    case 'Half Day': return 4;
    case 'Full Day': return 8;
    case 'Night': return 8; // assuming night is 8 hours
    default: return 1;
  }
};


export const checkAvailability = async (
  date: Date,
  timeSlot: string,
  duration: DurationOption,
  guests: number,
  workspace: string
): Promise<{ available: boolean; message?: string }> => {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const response = await fetchApi('/bookings/availability', {
      method: 'POST',
      body: JSON.stringify({
        date: dateStr,
        startTime: timeSlot,
        duration,
        guests,
        workspace
      })
    });
    
    // fetchApi returns the 'data' field if success is true, but since we wrapped it differently in controller,
    // let's assume it returns the actual data structure or we need to access response
    // Wait, fetchApi usually returns response.data directly.
    return response; 
  } catch (err: any) {
    return { available: false, message: err.message || 'Error checking availability' };
  }
};
