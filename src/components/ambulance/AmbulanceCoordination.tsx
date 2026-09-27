import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { DispatchFormModal } from './DispatchForm';
import { StatusBoard } from './StatusBoard';
import { SimulatedMap } from './SimulatedMap';
import { Siren, Plus, ShieldAlert } from 'lucide-react';
import { AmbulanceDispatch } from '../../types';

export const AmbulanceCoordination: React.FC = () => {
  const { setIsDispatchModalOpen, dispatches } = useHealth();
  const [selectedDispatch, setSelectedDispatch] = useState<AmbulanceDispatch | undefined>(undefined);

  const pendingCount = dispatches.filter((d) => d.status === 'Pending').length;
  const enRouteCount = dispatches.filter((d) => d.status === 'En Route').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="app-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-rose-600">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Siren className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Emergency Ambulance Dispatch
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time ambulance tracking, emergency unit dispatch, patient triage, and live ETA monitor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Active: <strong className="text-rose-600 dark:text-rose-400">{pendingCount} Pending / {enRouteCount} En Route</strong></span>
          </div>

          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Dispatch Ambulance</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Map View */}
      <SimulatedMap
        onSelectDispatch={(d) => setSelectedDispatch(d)}
        selectedDispatchId={selectedDispatch?.id}
      />

      {/* Status Board */}
      <StatusBoard
        onSelectDispatch={(d) => setSelectedDispatch(d)}
        selectedDispatchId={selectedDispatch?.id}
      />

      {/* Modal */}
      <DispatchFormModal />
    </div>
  );
};
