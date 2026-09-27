import React from 'react';
import { LayoutDashboard, Calendar, Siren, Droplet, Building2, UserCheck, ShieldAlert } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { ActiveTab } from '../../types';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, dispatches, bloodRequirements, appointments, currentUser } = useHealth();

  const isDoctor = currentUser?.role === 'doctor';

  const activeAmbulanceCount = dispatches.filter((d) => d.status === 'Pending' || d.status === 'En Route').length;
  const openBloodCount = bloodRequirements.filter((b) => b.status === 'Open').length;
  const todayAppointmentsCount = appointments.filter((a) => a.status === 'Upcoming').length;

  const doctorTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Clinic Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'appointments',
      label: 'Patients & Appointments',
      icon: <Calendar className="w-4 h-4" />,
      badge: todayAppointmentsCount,
      badgeColor: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300'
    },
    {
      id: 'ambulance',
      label: 'Ambulance Dispatch Control',
      icon: <Siren className="w-4 h-4" />,
      badge: activeAmbulanceCount,
      badgeColor: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold'
    },
    {
      id: 'blood',
      label: 'Blood Bank Inventory',
      icon: <Droplet className="w-4 h-4" />,
      badge: openBloodCount,
      badgeColor: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
    },
    {
      id: 'directory',
      label: 'Doctors & Clinics Directory',
      icon: <Building2 className="w-4 h-4" />
    }
  ];

  const patientTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'My Portal Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'appointments',
      label: 'My Appointments',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: 'ambulance',
      label: 'Ambulance & SOS',
      icon: <Siren className="w-4 h-4" />,
      badge: activeAmbulanceCount,
      badgeColor: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
    },
    {
      id: 'blood',
      label: 'Blood Stock & Needs',
      icon: <Droplet className="w-4 h-4" />
    },
    {
      id: 'directory',
      label: 'Find Doctor / Clinic',
      icon: <Building2 className="w-4 h-4" />
    }
  ];

  const tabs = isDoctor ? doctorTabs : patientTabs;

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex space-x-2 overflow-x-auto py-2.5 scrollbar-none flex-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? isDoctor
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
