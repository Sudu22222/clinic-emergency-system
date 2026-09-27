import React, { useState } from 'react';
import {
  Activity,
  Siren,
  Search,
  Sun,
  Moon,
  X,
  Calendar,
  User,
  Stethoscope,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const Header: React.FC = () => {
  const {
    setIsDispatchModalOpen,
    isDarkMode,
    toggleTheme,
    patients,
    appointments,
    dispatches,
    bloodRequirements,
    doctors,
    setActiveTab,
    setIsBookingModalOpen,
    currentUser,
    logout
  } = useHealth();

  const [headerSearch, setHeaderSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const query = headerSearch.trim().toLowerCase();

  // Search results
  const matchingDoctors = query
    ? doctors.filter(d => d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query) || d.department.toLowerCase().includes(query))
    : [];

  const matchingPatients = query
    ? patients.filter(p => p.name.toLowerCase().includes(query) || p.phone.includes(query) || p.id.toLowerCase().includes(query))
    : [];

  const matchingAppointments = query
    ? appointments.filter(a => a.patientName.toLowerCase().includes(query) || a.doctorName.toLowerCase().includes(query) || a.id.toLowerCase().includes(query))
    : [];

  const matchingDispatches = query
    ? dispatches.filter(d => d.dispatchCode.toLowerCase().includes(query) || d.patientName.toLowerCase().includes(query) || d.pickupAddress.toLowerCase().includes(query))
    : [];

  const matchingBlood = query
    ? bloodRequirements.filter(b => b.bloodGroup.toLowerCase().includes(query) || b.hospitalLocation.toLowerCase().includes(query))
    : [];

  const hasResults = query && (
    matchingDoctors.length > 0 ||
    matchingPatients.length > 0 ||
    matchingAppointments.length > 0 ||
    matchingDispatches.length > 0 ||
    matchingBlood.length > 0
  );

  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Health<span className="text-teal-600 dark:text-teal-400">Pulse</span>
                </h1>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  currentUser?.role === 'doctor'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                }`}>
                  {currentUser?.role === 'doctor' ? 'ADMIN / DOCTOR PANEL' : 'PATIENT PORTAL'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Simple Healthcare & Emergency System</p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Siren className="w-4 h-4" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Middle Global Quick Search */}
        <div className="relative flex-1 max-w-md mx-0 md:mx-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors, appointments, patients, blood, ambulance..."
              value={headerSearch}
              onChange={(e) => {
                setHeaderSearch(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-400"
            />
            {headerSearch && (
              <button
                onClick={() => {
                  setHeaderSearch('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Autocomplete Results Modal Popover */}
          {isSearchOpen && headerSearch.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50 p-3 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-slate-700/60 pb-1.5">
                <span>Search Results for "{headerSearch}"</span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px]"
                >
                  Close
                </button>
              </div>

              {!hasResults && (
                <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                  No matching records found.
                </div>
              )}

              {/* Matching Doctors */}
              {matchingDoctors.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" /> Doctors ({matchingDoctors.length})
                  </div>
                  <div className="space-y-1">
                    {matchingDoctors.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setActiveTab('directory');
                          setIsSearchOpen(false);
                          setHeaderSearch('');
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{doc.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{doc.specialty} • {doc.department}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsBookingModalOpen(true);
                            setIsSearchOpen(false);
                          }}
                          className="px-2 py-1 bg-teal-600 text-white rounded text-[11px] font-medium hover:bg-teal-700 cursor-pointer"
                        >
                          Book
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Patients */}
              {matchingPatients.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> Patients ({matchingPatients.length})
                  </div>
                  <div className="space-y-1">
                    {matchingPatients.map(pat => (
                      <div
                        key={pat.id}
                        onClick={() => {
                          setActiveTab('appointments');
                          setIsSearchOpen(false);
                          setHeaderSearch('');
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{pat.name} ({pat.id})</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{pat.age} yrs • Blood: {pat.bloodGroup} • {pat.phone}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Appointments */}
              {matchingAppointments.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Appointments ({matchingAppointments.length})
                  </div>
                  <div className="space-y-1">
                    {matchingAppointments.map(apt => (
                      <div
                        key={apt.id}
                        onClick={() => {
                          setActiveTab('appointments');
                          setIsSearchOpen(false);
                          setHeaderSearch('');
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{apt.patientName} with {apt.doctorName}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{apt.date} at {apt.timeSlot} • Status: {apt.status}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Auth Profile & Action Bar */}
        <div className="hidden md:flex items-center space-x-2.5 text-xs sm:text-sm">
          {/* User Profile Chip & Panel Role Switcher */}
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left pr-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {currentUser.role === 'doctor' ? 'Doctor / Admin' : 'Patient User'}
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Emergency Ambulance SOS Button */}
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl font-semibold shadow-xs transition-all text-xs cursor-pointer"
          >
            <Siren className="w-4 h-4" />
            <span>Emergency SOS</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
          </button>
        </div>
      </div>
    </div>
  );
};
