import { supabase } from '../config/database';
import { config } from '../config/env';

const enrichBooking = (b: any) => {
  if (!b) return null;
  const isTestingMode =
    Boolean(b.special_requirements && b.special_requirements.includes('Testing Mode')) ||
    config.paymentMode === 'disabled';

  let paymentStatus = 'unpaid';
  let paymentRecord = null;

  if (Array.isArray(b.payments) && b.payments.length > 0) {
    const sortedPayments = [...b.payments].sort(
      (p1, p2) => new Date(p2.created_at).getTime() - new Date(p1.created_at).getTime()
    );
    paymentRecord = sortedPayments[0];

    if (sortedPayments.some(p => p.status === 'captured')) {
      paymentStatus = 'paid';
    } else if (sortedPayments.some(p => p.status === 'failed')) {
      paymentStatus = 'failed';
    } else if (sortedPayments.some(p => p.status === 'created' || p.status === 'authorized')) {
      paymentStatus = 'pending';
    }
  } else if (isTestingMode) {
    paymentStatus = 'testing_unpaid';
  } else if (b.status === 'confirmed') {
    paymentStatus = 'paid';
  }

  return {
    ...b,
    is_testing_mode: isTestingMode,
    payment_status: paymentStatus,
    latest_payment: paymentRecord
  };
};

export const getAdminBookingsService = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(*), payments(*)')
    .order('date', { ascending: false });

  if (error) {
    console.warn('Admin bookings select with payments failed, attempting fallback query:', error.message);
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('bookings')
      .select('*, profiles(*)')
      .order('date', { ascending: false });

    if (fallbackError) throw fallbackError;
    return (fallbackData || []).map(enrichBooking);
  }

  return (data || []).map(enrichBooking);
};

export const getAdminBookingByIdService = async (id: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(*), payments(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.warn('Admin booking by id with payments failed, attempting fallback query:', error.message);
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('bookings')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (fallbackError) throw fallbackError;
    return enrichBooking(fallbackData);
  }

  if (!data) throw new Error('Booking not found');
  return enrichBooking(data);
};

export const updateBookingStatusService = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: status.toLowerCase() })
    .eq('id', id)
    .select('*, profiles(*), payments(*)')
    .single();

  if (error) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('bookings')
      .update({ status: status.toLowerCase() })
      .eq('id', id)
      .select('*, profiles(*)')
      .single();
    if (fallbackError) throw fallbackError;
    return enrichBooking(fallbackData);
  }

  return enrichBooking(data);
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

  bookings.forEach((b: any) => {
    if (!b.profiles?.email) return;
    const key = b.profiles.email;
    if (customersMap.has(key)) {
      const existing = customersMap.get(key)!;
      existing.totalBookings += 1;
      existing.totalSpent += Number(b.amount || 0);
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
        totalSpent: Number(b.amount || 0),
        lastBooking: b.date,
        status: 'Active'
      });
    }
  });

  return Array.from(customersMap.values());
};
