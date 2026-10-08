import type { DurationOption } from '../../types/booking';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const options: DurationOption[] = ['1 Hour', '2 Hours', '3 Hours', '4 Hours', 'Half Day', 'Full Day', 'Night'];

interface DurationSelectorProps {
  selectedDuration: DurationOption | null;
  onChange: (duration: DurationOption) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ selectedDuration, onChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-lg mb-4">Duration</h3>
      <div className="grid grid-cols-2 gap-3">
        {options.map(option => {
          const isSelected = selectedDuration === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={twMerge(
                clsx(
                  "py-3 px-4 rounded-lg text-sm font-medium transition-colors border text-left",
                  "bg-white text-slate-700 border-slate-200 hover:border-blue-300",
                  isSelected && "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600"
                )
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
