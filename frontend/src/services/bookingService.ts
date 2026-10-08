import { fetchApi } from './api';
import type { Booking } from '../types/booking';

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  const data = await fetchApi('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
  return mapSupabaseBooking(data);
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const data = await fetchApi('/bookings');
  return data.map(mapSupabaseBooking);
};

export const cancelMyBooking = async (bookingId: string): Promise<Booking> => {
  const data = await fetchApi(`/bookings/${bookingId}/cancel`, {
    method: 'PATCH'
  });
  return mapSupabaseBooking(data);
};

export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    const data = await fetchApi(`/bookings/${bookingId}`);
    return mapSupabaseBooking(data);
  } catch {
    return null;
  }
};


export const mapSupabaseBooking = (row: any /* eslint-disable-line */ ): Booking => {
  let durationStr = '1 Hour';
  if (row.duration_minutes === 120) durationStr = '2 Hours';
  if (row.duration_minutes === 180) durationStr = '3 Hours';
  if (row.duration_minutes === 240) durationStr = '4 Hours';
  if (row.duration_minutes === 480) durationStr = 'Full Day';
  
  return {
    id: row.id,
    date: row.date,
    startTime: row.start_time.substring(0, 5),
    endTime: row.end_time.substring(0, 5),
    duration: durationStr as Booking['duration'],
    guests: row.guest_count,
    purpose: row.purpose,
    specialRequirements: row.special_requirements,
    amount: parseFloat(row.amount),
    status: (row.status === 'pending_payment' ? 'Pending_payment' : row.status.charAt(0).toUpperCase() + row.status.slice(1)) as Booking['status'],
    createdAt: row.created_at,
    customer: {
      fullName: row.profiles?.full_name || '',
      email: row.profiles?.email || '',
      mobile: row.profiles?.phone || '',
      company: row.profiles?.company || '',
      purpose: row.purpose,
      specialRequirements: row.special_requirements
    }
  };
};
