import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Calendar, Siren, Droplet, Clock, Plus, HeartPulse, Stethoscope } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const PatientDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    dispatches,
    setIsBookingModalOpen,
    setIsDispatchModalOpen,
    setIsBloodReqModalOpen,
    setActiveTab,
    updateAppointmentStatus
  } = useHealth();

  const patientName = currentUser?.name || 'Patient';
  const myAppointments = appointments.filter(
    (a) => a.patientName.toLowerCase().includes(patientName.toLowerCase()) || a.patientId === currentUser?.patientId
  );

  const myDispatches = dispatches.filter(
    (d) => d.patientName.toLowerCase().includes(patientName.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Patient Welcome Hero Card */}
      <div className="app-card p-6 bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-none shadow-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              My Patient Portal
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Welcome back, {patientName}!
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
            Manage your doctor consultations, track active ambulance dispatches, and request emergency medical assistance.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-xs text-white space-y-1 shrink-0 min-w-[200px]">
          <div className="flex items-center justify-between">
            <span className="text-sky-200">Patient ID:</span>
            <span className="font-mono font-bold">{currentUser?.patientId || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sky-200">Blood Group:</span>
            <span className="font-bold text-rose-200">{currentUser?.bloodGroup || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sky-200">Emergency Contact:</span>
            <span className="font-mono">{currentUser?.phone || '—'}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Book Appointment */}
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="app-card app-card-hover p-4 flex items-center space-x-3 text-left cursor-pointer group"
        >
          <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 group-hover:scale-105 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600">Book Doctor Visit</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Schedule consultation</div>
          </div>
        </button>

        {/* Request Ambulance SOS */}
        <button
          onClick={() => setIsDispatchModalOpen(true)}
          className="app-card app-card-hover p-4 flex items-center space-x-3 text-left cursor-pointer border-l-4 border-l-rose-600 group"
        >
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 group-hover:scale-105 transition-transform">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-rose-700 dark:text-rose-300">Emergency SOS</div>
            <div className="text-xs text-rose-600/80 dark:text-rose-400/80">Dispatch ambulance squad</div>
          </div>
        </button>

        {/* Request Blood */}
        <button
          onClick={() => setIsBloodReqModalOpen(true)}
          className="app-card app-card-hover p-4 flex items-center space-x-3 text-left cursor-pointer group"
        >
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600">Post Blood Need</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Request urgent units</div>
          </div>
        </button>

        {/* Find Clinic */}
        <button
          onClick={() => setActiveTab('directory')}
          className="app-card app-card-hover p-4 flex items-center space-x-3 text-left cursor-pointer group"
        >
          <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600">Find Doctors</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Search clinics & beds</div>
          </div>
        </button>
      </div>

      {/* Main Grid: My Appointments & My Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Appointments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="app-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  My Appointments ({myAppointments.length})
                </h3>
              </div>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book New</span>
              </button>
            </div>

            {myAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
                You have no scheduled appointments yet. Click "Book New" to schedule a visit!
              </div>
            ) : (
              <div className="space-y-3">
                {myAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{apt.id}</span>
                        <StatusBadge status={apt.status} type="appointment" />
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-base mt-1">
                        {apt.doctorName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{apt.doctorSpecialty}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                        Reason: <strong>{apt.visitReason}</strong>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-2">
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="font-bold text-slate-900 dark:text-white">{apt.date}</div>
                        <div className="text-teal-600 dark:text-teal-400 font-mono text-xs flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          <span>{apt.timeSlot}</span>
                        </div>
                      </div>

                      {apt.status === 'Upcoming' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                          className="px-2.5 py-1 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg border border-rose-200 dark:border-rose-800 cursor-pointer"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Emergency Trackers & Records */}
        <div className="space-y-4">
          {/* Active Ambulance Tracking */}
          <div className="app-card p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <Siren className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                My Emergency SOS Calls
              </h3>
            </div>

            {myDispatches.length === 0 ? (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
                No active emergency dispatches for your profile.
              </div>
            ) : (
              <div className="space-y-2">
                {myDispatches.map((disp) => (
                  <div key={disp.id} className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-rose-700 dark:text-rose-300">{disp.dispatchCode}</span>
                      <StatusBadge status={disp.status} type="dispatch" />
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">{disp.assignedUnit}</div>
                    <div className="text-slate-600 dark:text-slate-300">ETA: <strong className="text-rose-600 dark:text-rose-400 font-mono">{disp.eta}</strong></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Record Summary */}
          <div className="app-card p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <HeartPulse className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Medical Profile & Notes
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div><strong>Registered Name:</strong> {patientName}</div>
              <div><strong>Blood Group:</strong> <span className="font-bold text-rose-600 dark:text-rose-400">{currentUser?.bloodGroup || 'O+'}</span></div>
              <div><strong>Primary Address:</strong> {currentUser?.location || '742 Evergreen Terrace'}</div>
              <div><strong>Notes:</strong> <span className="text-slate-500 dark:text-slate-400">Regular wellness checkup, allergic to penicillin.</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
