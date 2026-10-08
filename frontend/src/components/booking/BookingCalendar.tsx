import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BookingCalendarProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ selectedDate, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate || new Date()));
  const today = startOfDay(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => {
    if (!isBefore(subMonths(currentMonth, 1), startOfMonth(today))) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50" disabled={isBefore(subMonths(currentMonth, 1), startOfMonth(today))}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-slate-500">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {/* Empty slots for starting day of month */}
        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => {
          const isPast = isBefore(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <button
              key={day.toString()}
              disabled={isPast}
              onClick={() => onChange(day)}
              className={twMerge(
                clsx(
                  "aspect-square rounded-full flex items-center justify-center text-sm transition-all",
                  isPast ? "text-slate-300 cursor-not-allowed" : "hover:bg-slate-100 cursor-pointer",
                  isSelected && "bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm"
                )
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
