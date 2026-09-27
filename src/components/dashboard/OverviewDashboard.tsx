import React from 'react';
import { KPICards } from './KPICards';
import { QuickActions } from './QuickActions';
import { AnalyticsCharts } from './AnalyticsCharts';
import { useHealth } from '../../context/HealthContext';
import { Siren, ChevronRight, Stethoscope, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const OverviewDashboard: React.FC = () => {
  const { dispatches, doctors, setActiveTab, setIsBookingModalOpen } = useHealth();

  const activeDispatches = dispatches.filter((d) => d.status !== 'Completed').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="app-card p-6 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-none shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold tracking-tight">
              Welcome to HealthPulse Management
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl">
            Simple, user-friendly platform for booking appointments, managing emergency ambulance dispatches, tracking blood inventory, and finding doctors.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>System Status: <strong className="font-semibold text-white">Active & Ready</strong></span>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Quick Action Triggers */}
      <QuickActions />

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Bottom Grid: Live Emergency Feed & Doctor Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Ambulance Dispatch Ticker */}
        <div className="app-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Siren className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Active Emergency Dispatches
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('ambulance')}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeDispatches.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
                No emergency dispatches currently pending.
              </div>
            ) : (
              <div className="space-y-3">
                {activeDispatches.map((disp) => (
                  <div
                    key={disp.id}
                    onClick={() => setActiveTab('ambulance')}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{disp.dispatchCode}</span>
                        <StatusBadge status={disp.urgency} type="urgency" />
                        <StatusBadge status={disp.status} type="dispatch" />
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100 mt-1">{disp.patientName}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-xs">{disp.pickupAddress}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">{disp.eta}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{disp.assignedUnit}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Doctor Duty Roster */}
        <div className="app-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Available On-Duty Doctors
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('directory')}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Full Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {doctors.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/60 border border-teal-200 dark:border-teal-700 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                      {doc.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">{doc.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{doc.specialty} • {doc.department}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-xs"
                  >
                    Book Visit
                  </button>
                </div>
              ))}
              {doctors.length === 0 && <p className="py-5 text-center text-xs text-slate-500">No doctor accounts have been added yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
