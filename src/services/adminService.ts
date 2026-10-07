import { fetchApi } from './api';
import type { Booking } from '../types/booking';
import { mapSupabaseBooking } from './bookingService';

export const getAdminBookings = async (): Promise<Booking[]> => {
  const data = await fetchApi('/admin/bookings');
  return data.map(mapSupabaseBooking);
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<Booking> => {
  const data = await fetchApi(`/admin/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
  return mapSupabaseBooking(data);
};

export interface PricingItem {
  id: string;
  title: string;
  price: number;
  isActive: boolean;
}

export const getPricing = async (): Promise<PricingItem[]> => {
  const data = await fetchApi('/admin/pricing');
  return data.map((p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({
    id: p.id,
    title: p.name,
    price: p.price,
    isActive: p.active
  }));
};

export const updatePricing = async (id: string, updates: Partial<PricingItem>): Promise<void> => {
  await fetchApi(`/admin/pricing/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
};

export interface BlockedTime {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export const getBlockedTimes = async (): Promise<BlockedTime[]> => {
  const data = await fetchApi('/admin/availability/blocked');
  return data.map((b: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({
    id: b.id,
    date: b.date,
    startTime: b.start_time.substring(0, 5),
    endTime: b.end_time.substring(0, 5),
    reason: b.reason
  }));
};

export const blockTime = async (blocked: Omit<BlockedTime, 'id'>): Promise<BlockedTime> => {
  const data = await fetchApi('/admin/availability/block', {
    method: 'POST',
    body: JSON.stringify(blocked)
  });
  
  return {
    id: data.id,
    date: data.date,
    startTime: data.start_time.substring(0, 5),
    endTime: data.end_time.substring(0, 5),
    reason: data.reason
  };
};

export const unblockTime = async (id: string): Promise<void> => {
  await fetchApi(`/admin/availability/block/${id}`, {
    method: 'DELETE'
  });
};

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  status: 'Active' | 'Inactive';
}

export const getAdminCustomers = async (): Promise<AdminCustomer[]> => {
  return fetchApi('/admin/customers');
};
