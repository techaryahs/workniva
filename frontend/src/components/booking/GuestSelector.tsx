import { Users, Plus, Minus } from 'lucide-react';

interface GuestSelectorProps {
  guests: number;
  onChange: (guests: number) => void;
  workspace?: string | null;
}

export const GuestSelector: React.FC<GuestSelectorProps> = ({ guests, onChange, workspace }) => {
  let maxCapacity = 10;
  let helperText = "Maximum capacity is 10 people.";

  if (workspace === 'private-cabin') {
    maxCapacity = 5;
    helperText = "Includes 4 guests. Maximum 5 guests.";
  } else if (workspace === 'conference-room') {
    maxCapacity = 6;
    helperText = "Includes 5 guests. Maximum 6 guests.";
  } else if (workspace === 'bench-seating') {
    maxCapacity = 8;
    helperText = "Maximum 8 guests, subject to availability.";
  } else if (workspace === 'whole-night') {
    maxCapacity = 29;
    helperText = "Maximum 29 guests for the entire office.";
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-slate-500" />
        Number of Guests
      </h3>
      <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-200 max-w-xs">
        <button
          disabled={guests <= 1}
          onClick={() => onChange(guests - 1)}
          className="p-3 bg-white rounded-md shadow-sm border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-medium text-lg w-12 text-center">{guests}</span>
        <button
          disabled={guests >= maxCapacity}
          onClick={() => onChange(guests + 1)}
          className="p-3 bg-white rounded-md shadow-sm border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-slate-500 mt-3">{helperText}</p>
    </div>
  );
};
