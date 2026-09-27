import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800/60 px-4 py-1.5 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center justify-center gap-2 text-center">
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>
        <strong className="font-semibold">Note:</strong> Clinic & Emergency Coordination Platform. Call 911 / 108 for immediate life-threatening emergencies.
      </span>
    </div>
  );
};
