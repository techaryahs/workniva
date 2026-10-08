import type { BlockedSlot } from '../types/booking';

export const mockBlockedSlots: BlockedSlot[] = [
  {
    date: '2026-10-10',
    times: ['09:00', '10:00', '14:00', '15:00'],
  },
  {
    date: '2026-10-15',
    times: ['11:00', '12:00', '13:00'],
  },
  {
    date: '2026-10-20',
    times: ['08:00', '09:00', '10:00', '16:00', '17:00'],
  },
];
