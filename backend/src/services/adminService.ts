import { supabase } from '../config/database';

export const getAdminBookingsService = async () => {
  const { data, error } = await supabase.from('bookings').select('*, profiles(*)').order('date', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateBookingStatusService = async (id: string, status: string) => {
  const { data, error } = await supabase.from('bookings').update({ status: status.toLowerCase() }).eq('id', id).select('*, profiles(*)').single();
  if (error) throw error;
  return data;
};

export const getPricingService = async () => {
  const { data, error } = await supabase.from('pricing').select('*').order('duration_minutes', { ascending: true });
  if (error) throw error;
  return data;
};

export const updatePricingService = async (id: string, updates: any) => {
  const mappedUpdates: any = {};
  if (updates.price !== undefined) mappedUpdates.price = updates.price;
  if (updates.isActive !== undefined) mappedUpdates.active = updates.isActive;
  
  const { error } = await supabase.from('pricing').update(mappedUpdates).eq('id', id);
  if (error) throw error;
};

export const getBlockedTimesService = async () => {
  const { data, error } = await supabase.from('blocked_slots').select('*');
  if (error) throw error;
  return data;
};

export const blockTimeService = async (userId: string, blocked: any) => {
  const { data, error } = await supabase.from('blocked_slots').insert({
    date: blocked.date,
    start_time: `${blocked.startTime}:00`,
    end_time: `${blocked.endTime}:00`,
    reason: blocked.reason,
    created_by: userId
  }).select('*').single();
  
  if (error) {
    if (error.message.includes('overlapping') || error.code === '23P01') {
      throw new Error("This slot conflicts with an existing booking or block.");
    }
    throw error;
  }
  return data;
};

export const unblockTimeService = async (id: string) => {
  const { error } = await supabase.from('blocked_slots').delete().eq('id', id);
  if (error) throw error;
};

export const getAdminCustomersService = async () => {
  const bookings = await getAdminBookingsService();
  const customersMap = new Map<string, any>();
  
  bookings.forEach(b => {
    const key = b.profiles.email;
    if (customersMap.has(key)) {
      const existing = customersMap.get(key)!;
      existing.totalBookings += 1;
      existing.totalSpent += Number(b.amount);
      if (new Date(b.date) > new Date(existing.lastBooking)) {
        existing.lastBooking = b.date;
      }
    } else {
      customersMap.set(key, {
        id: `cust-${key}`,
        name: b.profiles.full_name,
        email: b.profiles.email,
        phone: b.profiles.phone,
        company: b.profiles.company,
        totalBookings: 1,
        totalSpent: Number(b.amount),
        lastBooking: b.date,
        status: 'Active'
      });
    }
  });
  
  return Array.from(customersMap.values());
};
