import { supabase } from '../config/database';

export const createBookingService = async (userId: string, bookingData: any) => {
  const nowIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const bookingDate = new Date(`${bookingData.date}T00:00:00`);
  const slotHour = parseInt(bookingData.startTime.split(':')[0]);
  
  if (bookingDate.toDateString() === nowIST.toDateString() && slotHour <= nowIST.getHours()) {
    throw new Error('This time slot has already passed.');
  }
  if (bookingDate < new Date(nowIST.toDateString())) {
    throw new Error('Cannot book for a past date.');
  }

  const dateStr = bookingData.date.replace(/-/g, '');
  const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const booking_code = `RO-${dateStr}-${randomStr}`;
  
  let duration_minutes = 60;
  if (bookingData.duration.includes('Hour')) duration_minutes = parseInt(bookingData.duration) * 60;
  if (bookingData.duration === 'Half Day') duration_minutes = 240;
  if (bookingData.duration === 'Full Day' || bookingData.duration === 'Night') duration_minutes = 480;

  const hours = duration_minutes / 60;
  const guests = bookingData.guests || 1;
  let amount = 0;

  if (bookingData.workspace === 'private-cabin') {
    if (guests > 5) throw new Error('Maximum capacity is 5 people per cabin.');
    const extraGuests = Math.max(0, guests - 4);
    amount = (400 * hours) + (extraGuests * 50 * hours);
  } else if (bookingData.workspace === 'conference-room') {
    if (guests > 6) throw new Error('Maximum capacity is 6 people.');
    const extraGuests = Math.max(0, guests - 5);
    amount = (500 * hours) + (extraGuests * 50 * hours);
  } else if (bookingData.workspace === 'bench-seating') {
    if (guests > 8) throw new Error('Maximum 8 guests.');
    amount = 100 * guests * hours;
  } else if (bookingData.workspace === 'whole-night') {
    if (guests > 29) throw new Error('Maximum 29 guests for the entire office.');
    amount = 599 * guests;
  } else {
    throw new Error('Invalid workspace selected');
  }

  const startHour = parseInt(bookingData.startTime.split(':')[0]);
  const endHour = startHour + (duration_minutes / 60);
  const end_time = `${endHour.toString().padStart(2, '0')}:00:00`;
  const start_time = `${bookingData.startTime.split(':')[0].padStart(2, '0')}:00:00`;

  // 1. Perform Javascript-level availability check first
  const availability = await checkAvailabilityService({
    date: bookingData.date,
    startTime: bookingData.startTime,
    duration: bookingData.duration,
    guests: bookingData.guests,
    workspace: bookingData.workspace
  });

  if (!availability.available) {
    throw new Error(availability.message || 'Time slot is no longer available.');
  }

  const resource_id = availability.resource_id || bookingData.workspace;

  // 2. Try to use the safe RPC if the migration was applied
  const { data: rpcData, error: rpcError } = await supabase.rpc('check_and_insert_booking', {
    p_booking_code: booking_code,
    p_user_id: userId,
    p_date: bookingData.date,
    p_start_time: start_time,
    p_end_time: end_time,
    p_duration_minutes: duration_minutes,
    p_guest_count: bookingData.guests,
    p_purpose: bookingData.purpose,
    p_special_requirements: `Workspace: ${bookingData.workspace} | ${bookingData.specialRequirements || ''}`,
    p_amount: amount,
    p_resource_type: bookingData.workspace,
    p_resource_id: resource_id
  });

  if (rpcError) {
    // If function doesn't exist, fallback to direct insert (legacy mode without proper concurrency on same table)
    if (rpcError.code === 'PGRST202' || rpcError.code === '42883') {
      const { data, error } = await supabase.from('bookings').insert({
        booking_code,
        user_id: userId,
        date: bookingData.date,
        start_time,
        end_time,
        duration_minutes,
        guest_count: bookingData.guests,
        purpose: bookingData.purpose,
        special_requirements: `Workspace: ${bookingData.workspace} | ${bookingData.specialRequirements || ''}`,
        amount, 
        status: 'pending_payment'
      }).select('*, profiles(*)').single();

      if (error) {
        if (error.message.includes('overlapping') || error.code === '23P01') {
          throw new Error("This time slot is no longer available.");
        }
        throw new Error(error.message);
      }
      return data;
    } else {
      throw new Error(rpcError.message || "Failed to reserve the resource.");
    }
  }

  // RPC succeeds, return the row
  // We may need to fetch the full row with profiles since RPC might just return the raw row
  const { data: fullBooking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, profiles(*)')
    .eq('id', rpcData.id)
    .single();

  if (fetchError) throw fetchError;
  return fullBooking;
};

export const getMyBookingsService = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getBookingByIdService = async (userId: string, bookingId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(*)')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error('Booking not found');
  return data;
};

export const cancelBookingService = async (userId: string, bookingId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_id', userId)
    .select('*, profiles(*)')
    .single();

  if (error) throw error;
  return data;
};

export const checkAvailabilityService = async (params: any) => {
  const { date, startTime, duration, workspace } = params;
  const guests = parseInt(params.guests) || 1;
  
  const nowIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const bookingDate = new Date(`${date}T00:00:00`);
  const slotHour = parseInt(startTime.split(':')[0]);

  if (bookingDate.toDateString() === nowIST.toDateString() && slotHour <= nowIST.getHours()) {
    return { available: false, message: 'This time slot has already passed.' };
  }
  if (bookingDate < new Date(nowIST.toDateString())) {
    return { available: false, message: 'Cannot book for a past date.' };
  }

  // Calculate end_time
  let duration_minutes = 60;
  if (duration.includes('Hour')) duration_minutes = parseInt(duration) * 60;
  if (duration === 'Half Day') duration_minutes = 240;
  if (duration === 'Full Day' || duration === 'Night') duration_minutes = 480;

  const startHour = parseInt(startTime);
  const endHour = startHour + (duration_minutes / 60);
  const end_time = `${endHour.toString().padStart(2, '0')}:00:00`;
  const start_time = `${startTime}:00:00`;

  // Fetch all active bookings for this date that overlap
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('date', date)
    .neq('status', 'cancelled');
    
  if (error) throw error;

  // Function to check overlap
  const isOverlapping = (b: any) => {
    // If endHour > 24, we need to handle overnight logic, but for simplicity here we assume standard hours
    // Or we do proper time comparison.
    // For overnight, the SQL function handles it perfectly.
    const b_startHour = parseInt(b.start_time.split(':')[0]);
    const b_endHour = parseInt(b.end_time.split(':')[0]) || 24; // Handle 00:00 as next day
    
    // Check overlap: start1 < end2 AND end1 > start2
    const currentEndHour = endHour;
    
    return b_startHour < currentEndHour && b_endHour > startHour;
  };

  const overlappingBookings = bookings.filter(isOverlapping);
  
  // 1. If there's a whole-night booking, nothing is available
  if (overlappingBookings.some(b => b.resource_type === 'whole-night')) {
    return { available: false, message: 'The entire office is booked for this time.' };
  }

  // 2. If requesting whole-night, it requires NO other bookings
  if (workspace === 'whole-night') {
    if (overlappingBookings.length > 0) {
      return { available: false, message: 'Cannot book the whole office; some spaces are already reserved.' };
    }
    return { available: true };
  }

  // 3. For conference room
  if (workspace === 'conference-room') {
    if (guests > 6) return { available: false, message: 'Maximum capacity is 6 people.' };
    const confBooked = overlappingBookings.some(b => b.resource_type === 'conference-room');
    if (confBooked) return { available: false, message: 'Conference room is already booked.' };
    return { available: true, resource_id: 'conf-1' };
  }
  
  // 4. For bench seating
  if (workspace === 'bench-seating') {
    const benchBookings = overlappingBookings.filter(b => b.resource_type === 'bench-seating');
    let maxOverlapGuests = 0;
    // We should ideally check max guests at any single hour.
    // Since we just need to ensure total capacity isn't exceeded:
    for (let h = startHour; h < endHour; h++) {
      const guestsAtH = benchBookings.reduce((sum, b) => {
        const b_start = parseInt(b.start_time.split(':')[0]);
        const b_end = parseInt(b.end_time.split(':')[0]) || 24;
        if (b_start <= h && b_end > h) return sum + b.guest_count;
        return sum;
      }, 0);
      if (guestsAtH > maxOverlapGuests) maxOverlapGuests = guestsAtH;
    }
    
    if (maxOverlapGuests + guests > 8) {
      return { available: false, message: `Only ${8 - maxOverlapGuests} bench seats available.` };
    }
    return { available: true, resource_id: 'bench' };
  }

  // 5. For private cabins (3 available)
  if (workspace === 'private-cabin') {
    if (guests > 5) return { available: false, message: 'Maximum capacity is 5 people per cabin.' };
    
    const cabinBookings = overlappingBookings.filter(b => b.resource_type === 'private-cabin');
    const bookedCabinIds = new Set(cabinBookings.map(b => b.resource_id));
    
    const allCabins = ['cabin-1', 'cabin-2', 'cabin-3'];
    const availableCabins = allCabins.filter(c => !bookedCabinIds.has(c));
    
    if (availableCabins.length === 0) {
      return { available: false, message: 'All private cabins are booked for this time.' };
    }
    
    // Assign the first available cabin
    return { available: true, resource_id: availableCabins[0] };
  }

  return { available: false, message: 'Unknown workspace type.' };
};
