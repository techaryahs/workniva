import { supabase } from '../config/database';

export const checkAvailabilityService = async (date: string, startTime: string, durationMinutes: number) => {
  // Using the RPC from Phase 5A
  const { data, error } = await supabase.rpc('check_availability', {
    p_date: date,
    p_start_time: `${startTime}:00`
  });
  
  if (error) {
    throw new Error('Could not check availability. Please try again.');
  }
  
  return { available: data as boolean, message: data ? '' : 'This slot is already taken.' };
};
