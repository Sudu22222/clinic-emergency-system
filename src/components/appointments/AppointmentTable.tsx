import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { StatusBadge } from '../common/StatusBadge';
import { Search, CheckCircle, XCircle, Clock, Calendar, Stethoscope } from 'lucide-react';

export const AppointmentTable: React.FC = () => {
  const { appointments, currentUser, updateAppointmentStatus } = useHealth();
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesTab = activeSubTab === 'All' ? true : apt.status === activeSubTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      apt.patientName.toLowerCase().includes(q) ||
      apt.patientPhone.toLowerCase().includes(q) ||
      apt.doctorName.toLowerCase().includes(q) ||
      apt.id.toLowerCase().includes(q);

    return matchesTab && matchesQuery;
  });

  const subTabs: ('All' | 'Upcoming' | 'Completed' | 'Cancelled')[] = [
    'All',
    'Upcoming',
    'Completed',
    'Cancelled'
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter & Search controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Sub tabs */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {subTabs.map((tab) => {
            const count =
              tab === 'All'
                ? appointments.length
                : appointments.filter((a) => a.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeSubTab === tab
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeSubTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name, phone, or ID..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="app-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Phone / Blood</th>
                <th className="py-3.5 px-4">Physician & Specialty</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status & Urgency</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                    No appointments matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {apt.patientName}
                      </div>
                      <div className="text-[11px] font-mono text-teal-600 dark:text-teal-400">{apt.id}</div>
                    </td>

                    {/* Phone & Blood Group */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-600 dark:text-slate-300 font-mono text-xs">{apt.patientPhone}</div>
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                        {apt.patientBloodGroup}
                      </span>
                    </td>

                    {/* Doctor */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>{apt.doctorName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{apt.doctorSpecialty}</div>
                    </td>

                    {/* Date & Slot */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-300 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{apt.timeSlot}</span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-slate-600 dark:text-slate-300 truncate block">{apt.visitReason}</span>
                    </td>

                    {/* Status & Priority */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div><StatusBadge status={apt.status} type="appointment" /></div>
                      <div><StatusBadge status={apt.priority} type="urgency" /></div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {currentUser?.role === 'doctor' && apt.status === 'Upcoming' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white rounded-lg text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer"
                            title="Mark visit as completed"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Complete</span>
                          </button>

                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 text-slate-700 dark:text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                            title="Cancel appointment"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}

                      {apt.status !== 'Upcoming' && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
