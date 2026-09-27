import React from 'react';
import { CalendarPlus, Siren, Droplet, UserPlus, Search } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const QuickActions: React.FC = () => {
  const {
    setIsBookingModalOpen,
    setIsDispatchModalOpen,
    setIsBloodReqModalOpen,
    setIsPatientModalOpen,
    setActiveTab
  } = useHealth();

  return (
    <div className="app-card p-5">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        Quick Action Options
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Book Appointment */}
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="flex items-center space-x-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-teal-300 dark:hover:border-teal-700 rounded-xl transition-all text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 group-hover:scale-105 transition-transform">
            <CalendarPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">Book Appointment</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Schedule patient visit</div>
          </div>
        </button>

        {/* Emergency Ambulance Request */}
        <button
          onClick={() => setIsDispatchModalOpen(true)}
          className="flex items-center space-x-3 p-3.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-800/60 hover:border-rose-400 rounded-xl transition-all text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 group-hover:scale-105 transition-transform">
            <Siren className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-rose-800 dark:text-rose-200">Emergency SOS</div>
            <div className="text-xs text-rose-600 dark:text-rose-300/80">Dispatch ambulance</div>
          </div>
        </button>

        {/* Post Blood Requirement */}
        <button
          onClick={() => setIsBloodReqModalOpen(true)}
          className="flex items-center space-x-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-700 rounded-xl transition-all text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300">Request Blood</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Post urgent requirement</div>
          </div>
        </button>

        {/* Register Patient */}
        <button
          onClick={() => setIsPatientModalOpen(true)}
          className="flex items-center space-x-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-sky-700 rounded-xl transition-all text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 group-hover:scale-105 transition-transform">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-300">New Patient</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Add patient record</div>
          </div>
        </button>

        {/* Find Doctor */}
        <button
          onClick={() => setActiveTab('directory')}
          className="flex items-center space-x-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl transition-all text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">Find Doctor</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Browse specialties</div>
          </div>
        </button>
      </div>
    </div>
  );
};
