import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const workspaces = [
  { id: 'private-cabin', title: 'Private Cabin', capacity: '1-4 persons', price: 400, type: 'hourly' },
  { id: 'conference-room', title: 'Conference Room', capacity: '1-5 persons', price: 500, type: 'hourly' },
  { id: 'bench-seating', title: 'Bench Seating', capacity: '1 person', price: 100, type: 'hourly' },
  { id: 'whole-night', title: 'Whole Night Office Rental', capacity: 'Any', price: 599, type: 'per_person' }
];

export const WorkspaceSelector = ({ selected, onChange }: { selected: string | null, onChange: (val: string) => void }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-lg mb-4">Workspace</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {workspaces.map(ws => {
          const isSelected = selected === ws.id;
          return (
            <button
              key={ws.id}
              onClick={() => onChange(ws.id)}
              className={twMerge(
                clsx(
                  "p-4 rounded-lg text-left transition-colors border",
                  "bg-white text-slate-700 border-slate-200 hover:border-blue-300",
                  isSelected && "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600"
                )
              )}
            >
              <div className="font-semibold">{ws.title}</div>
              <div className="text-sm opacity-80 mt-1">
                {ws.type === 'hourly' ? `₹${ws.price} / hour` : `₹${ws.price} / person`}
              </div>
              <div className="text-xs opacity-60 mt-2">Capacity: {ws.capacity}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
        <span className="font-semibold">Complimentary:</span> Tea & Coffee is included during your booking duration.
      </div>
    </div>
  );
};
