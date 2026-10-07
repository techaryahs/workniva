import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TimeSlotPickerProps {
  selectedSlot: string | null;
  onChange: (slot: string) => void;
  unavailableSlots?: string[];
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ selectedSlot, onChange, unavailableSlots = [] }) => {
  // Generate slots 08:00 to 23:00
  const slots = Array.from({ length: 16 }).map((_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-lg mb-4">Select Time</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {slots.map(slot => {
          const isUnavailable = unavailableSlots.includes(slot);
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              disabled={isUnavailable}
              onClick={() => onChange(slot)}
              className={twMerge(
                clsx(
                  "py-2 rounded-lg text-sm font-medium transition-colors border",
                  isUnavailable ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600",
                  isSelected && "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600"
                )
              )}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};
