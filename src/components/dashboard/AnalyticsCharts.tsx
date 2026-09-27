import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useHealth } from '../../context/HealthContext';

export const AnalyticsCharts: React.FC = () => {
  const { dispatches, appointments, isDarkMode } = useHealth();

  const criticalCount = dispatches.filter((d) => d.urgency === 'Critical').length;
  const highCount = dispatches.filter((d) => d.urgency === 'High').length;
  const moderateCount = dispatches.filter((d) => d.urgency === 'Moderate').length;

  const emergencyData = [
    { name: 'Critical', value: criticalCount, color: '#e11d48' },
    { name: 'High', value: highCount, color: '#d97706' },
    { name: 'Moderate', value: moderateCount, color: '#0284c7' }
  ];
  const weeklyAppointmentTrends = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const date = [day.getFullYear(), String(day.getMonth() + 1).padStart(2, '0'), String(day.getDate()).padStart(2, '0')].join('-');
    const dayAppointments = appointments.filter((appointment) => appointment.date === date);
    return {
      day: day.toLocaleDateString(undefined, { weekday: 'short' }),
      appointments: dayAppointments.length,
      completed: dayAppointments.filter((appointment) => appointment.status === 'Completed').length,
      emergencyDispatches: dispatches.filter((dispatch) => dispatch.timestamp.slice(0, 10) === date).length,
    };
  });

  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipText = isDarkMode ? '#f8fafc' : '#0f172a';
  const tooltipBorder = isDarkMode ? '#334155' : '#cbd5e1';
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weekly Appointment Trends Chart */}
      <div className="lg:col-span-2 app-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Weekly Activity Trends
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Appointments vs Emergency Dispatches over the past 7 days</p>
          </div>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full font-medium">
            Past 7 Days
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyAppointmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke={axisColor} fontSize={12} tickLine={false} />
              <YAxis stroke={axisColor} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  color: tooltipText,
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="appointments" name="Appointments" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed Visits" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emergencyDispatches" name="Ambulance Requests" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emergency Activity Breakdown */}
      <div className="app-card p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            Emergency Urgency Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Current dispatches by priority</p>
        </div>

        <div className="h-52 w-full my-2 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={emergencyData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {emergencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  color: tooltipText,
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{dispatches.length}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Calls</span>
          </div>
        </div>

        <div className="flex justify-around items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          {emergencyData.map((item, i) => (
            <div key={i} className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}:</span>
              <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
