import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { AppointmentTable } from './AppointmentTable';
import { PatientModal } from './PatientModal';
import { BookingModal } from './BookingModal';
import { UserPlus, CalendarPlus, Users, Search, Phone, MapPin, HeartPulse, Shield, ChevronRight } from 'lucide-react';
import { Patient } from '../../types';

export const AppointmentManagement: React.FC = () => {
  const { patients, setIsPatientModalOpen, setIsBookingModalOpen } = useHealth();
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientForView, setSelectedPatientForView] = useState<Patient | null>(null);

  const filteredPatients = patients.filter((p) => {
    const q = patientSearch.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      p.bloodGroup.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner & Trigger Buttons */}
      <div className="app-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>Patients & Appointments</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register patients, schedule appointments with specialists, and track visit status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPatientModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>New Patient</span>
          </button>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Patient Search & Directory Preview Cards */}
      <div className="app-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Registered Patients ({patients.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Search by name, phone number, or blood group</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Search phone or name..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPatients.slice(0, 6).map((pat) => (
            <div
              key={pat.id}
              onClick={() => setSelectedPatientForView(pat)}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-teal-400 dark:hover:border-teal-500 rounded-xl cursor-pointer transition-all flex items-start justify-between group"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 text-sm">{pat.name}</span>
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-800">
                    {pat.bloodGroup}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{pat.phone}</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[180px]">{pat.location}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">{pat.id}</span>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold inline-flex items-center mt-2">
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabbed Appointment Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Appointment Schedules & Visit History
        </h3>
        <AppointmentTable />
      </div>

      {/* Modals */}
      <PatientModal />
      <BookingModal />

      {/* Patient Detail Modal */}
      {selectedPatientForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Patient Record</h3>
              </div>
              <button
                onClick={() => setSelectedPatientForView(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">{selectedPatientForView.name}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">
                    {selectedPatientForView.age} yrs • {selectedPatientForView.gender}
                  </div>
                </div>
                <span className="text-sm font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800">
                  {selectedPatientForView.bloodGroup}
                </span>
              </div>

              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <div><strong>Phone:</strong> <span className="font-mono text-teal-700 dark:text-teal-300">{selectedPatientForView.phone}</span></div>
                <div><strong>Address:</strong> {selectedPatientForView.location}</div>
                <div><strong>Emergency Contact:</strong> {selectedPatientForView.emergencyContact || 'None listed'}</div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mb-1">
                    <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Medical Notes & History</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{selectedPatientForView.medicalNotes || 'No chronic condition noted.'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <button
                  onClick={() => setSelectedPatientForView(null)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
