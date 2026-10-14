export type DurationOption = '1 Hour' | '2 Hours' | '3 Hours' | '4 Hours' | 'Half Day' | 'Full Day' | 'Night';

export type BookingStatus = 'Confirmed' | 'Cancelled' | 'Completed' | 'Pending_payment';
export type BookingPurpose = 'Client Meeting' | 'Business Meeting' | 'Team Meeting' | 'Interview' | 'Presentation' | 'Online Meeting' | 'Remote Work' | 'Training' | 'Other';

export interface CustomerDetails {
  fullName: string;
  email: string;
  mobile: string;
  company?: string;
  purpose: BookingPurpose | '';
  specialRequirements?: string;
}

export interface BookingState {
  workspace: string | null;
  date: Date | null;
  timeSlot: string | null;
  duration: DurationOption | null;
  guests: number;
  customer?: CustomerDetails;
}

export interface Booking {
  id: string;
  bookingCode?: string;
  workspace?: string;
  resourceType?: string;
  resourceId?: string;
  date: string; // ISO or YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: DurationOption;
  guests: number;
  customer: CustomerDetails;
  purpose: BookingPurpose;
  specialRequirements?: string;
  amount: number;
  status: BookingStatus;
  createdAt: string; // ISO string
  paymentMode?: string;
  paymentRequired?: boolean;
  testingMode?: boolean;
  paymentStatus?: 'unpaid' | 'paid' | 'pending' | 'testing_unpaid' | 'failed';
  payments?: any[];
  latestPayment?: any;
}

export interface BlockedSlot {
  date: string; // YYYY-MM-DD
  times: string[]; // ["09:00", "10:00"]
}
