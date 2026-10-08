
import { mockBlockedSlots } from '../data/availability';
import { format } from 'date-fns';
import type { DurationOption } from '../types/booking';

export const getPrice = (duration: DurationOption | null): number => {
  if (!duration) return 0;
  switch (duration) {
    case '1 Hour': return 25;
    case '2 Hours': return 50;
    case '3 Hours': return 75;
    case '4 Hours': return 100;
    case 'Half Day': return 80;
    case 'Full Day': return 140;
    case 'Night': return 100;
    default: return 0;
  }
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
  duration: DurationOption
): Promise<{ available: boolean; message?: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const dateStr = format(date, 'yyyy-MM-dd');
  const daySlots = mockBlockedSlots.find(s => s.date === dateStr);
  
  if (!daySlots) return { available: true };

  // Generate all times needed based on duration
  const startHour = parseInt(timeSlot.split(':')[0]);
  const hours = getDurationHours(duration);
  
  for (let i = 0; i < hours; i++) {
    const checkHour = startHour + i;
    // format as HH:00
    const timeToCheck = `${checkHour.toString().padStart(2, '0')}:00`;
    if (daySlots.times.includes(timeToCheck)) {
      return { available: false, message: `Overlap with unavailable slot at ${timeToCheck}` };
    }
  }

  return { available: true };
};
