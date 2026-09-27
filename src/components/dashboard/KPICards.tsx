import React from 'react';
import { CalendarCheck, Siren, Droplet, BedDouble } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const KPICards: React.FC = () => {
  const { appointments, dispatches, bloodRequirements, directory, setActiveTab } = useHealth();

  const today = new Date().toISOString().slice(0, 10);
  const totalAppointmentsToday = appointments.filter((a) => a.date === today).length;
  const pendingAmbulanceRequests = dispatches.filter((d) => d.status === 'Pending' || d.status === 'En Route').length;
  const urgentBloodRequirements = bloodRequirements.filter((b) => b.status === 'Open').length;
  const availableBeds = directory.reduce((acc, curr) => acc + curr.availableBeds, 0);

  const kpis = [
    {
      title: "Today's Appointments",
      value: totalAppointmentsToday,
      subtext: `${appointments.filter(a => a.date === today && a.status === 'Completed').length} completed today`,
      icon: <CalendarCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      iconBg: "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800",
      accent: "text-slate-900 dark:text-white",
      tab: 'appointments' as const
    },
    {
      title: "Active Ambulances",
      value: pendingAmbulanceRequests,
      subtext: `${dispatches.filter(d => d.urgency === 'Critical').length} critical emergency`,
      icon: <Siren className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      iconBg: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800",
      accent: "text-slate-900 dark:text-white",
      tab: 'ambulance' as const
    },
    {
      title: "Blood Requests Needed",
      value: urgentBloodRequirements,
      subtext: `${bloodRequirements.filter(b => b.urgency === 'Immediate' && b.status === 'Open').length} immediate priority`,
      icon: <Droplet className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
      accent: "text-slate-900 dark:text-white",
      tab: 'blood' as const
    },
    {
      title: "Available Clinic Beds",
      value: availableBeds,
      subtext: `Across ${directory.length} medical centers`,
      icon: <BedDouble className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      iconBg: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800",
      accent: "text-slate-900 dark:text-white",
      tab: 'directory' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          onClick={() => setActiveTab(kpi.tab)}
          className="app-card app-card-hover p-5 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {kpi.title}
            </span>
            <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
              {kpi.icon}
            </div>
          </div>

          <div className="mt-4">
            <div className={`text-3xl font-extrabold tracking-tight ${kpi.accent}`}>
              {kpi.value}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{kpi.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
