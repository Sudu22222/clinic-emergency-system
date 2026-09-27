import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'appointment' | 'dispatch' | 'urgency' | 'directory';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'appointment' }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (type === 'appointment') {
    switch (status) {
      case 'Upcoming':
        colorClasses = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
        break;
      case 'Completed':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
        break;
      case 'Cancelled':
        colorClasses = 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        break;
    }
  } else if (type === 'dispatch') {
    switch (status) {
      case 'Pending':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 font-semibold';
        break;
      case 'En Route':
        colorClasses = 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 font-bold';
        break;
      case 'Arrived':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
        break;
      case 'Completed':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
        break;
    }
  } else if (type === 'urgency') {
    switch (status) {
      case 'Critical':
      case 'Immediate':
        colorClasses = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/90 dark:text-rose-200 dark:border-rose-800 font-bold';
        break;
      case 'High':
      case 'Within 6 Hours':
      case 'Urgent':
        colorClasses = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800 font-semibold';
        break;
      case 'Moderate':
      case 'Within 24 Hours':
      case 'Normal':
      case 'Routine':
        colorClasses = 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800';
        break;
    }
  } else if (type === 'directory') {
    switch (status) {
      case 'Open 24/7':
        colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 font-semibold';
        break;
      case 'Open':
        colorClasses = 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/80 dark:text-teal-200';
        break;
      case 'Busy / High Volume':
        colorClasses = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200';
        break;
      case 'Closed':
        colorClasses = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border ${colorClasses}`}
    >
      {status}
    </span>
  );
};
