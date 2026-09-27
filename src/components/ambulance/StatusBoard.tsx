import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { AmbulanceDispatch } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Siren, Phone, MapPin, CheckCircle, Navigation, Clock, User } from 'lucide-react';

interface StatusBoardProps {
  onSelectDispatch?: (dispatch: AmbulanceDispatch) => void;
  selectedDispatchId?: string;
}

export const StatusBoard: React.FC<StatusBoardProps> = ({ onSelectDispatch, selectedDispatchId }) => {
  const { dispatches, currentUser, updateDispatchStatus } = useHealth();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Siren className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
          <span>Active Ambulance Dispatches ({dispatches.length})</span>
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Click card to highlight on live map</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dispatches.map((disp) => {
          const isSelected = selectedDispatchId === disp.id;

          return (
            <div
              key={disp.id}
              onClick={() => onSelectDispatch && onSelectDispatch(disp)}
              className={`app-card p-5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/20 shadow-md'
                  : ''
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-300 text-sm">{disp.dispatchCode}</span>
                    <StatusBadge status={disp.urgency} type="urgency" />
                  </div>
                  <StatusBadge status={disp.status} type="dispatch" />
                </div>

                {/* Patient & Location */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white text-base">{disp.patientName}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="font-mono">{disp.phone}</span>
                  </div>

                  <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{disp.pickupAddress}</span>
                  </div>

                  {disp.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      "{disp.notes}"
                    </p>
                  )}
                </div>

                {/* Dispatch Details */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Assigned Unit</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{disp.assignedUnit}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Live ETA</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-sm">{disp.eta}</span>
                  </div>
                </div>
              </div>

              {/* Status Control Actions */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {disp.timestamp}
                </span>

                <div className="flex space-x-1.5" onClick={(e) => e.stopPropagation()}>
                  {currentUser?.role === 'doctor' && disp.status === 'Pending' && (
                    <button
                      onClick={() => updateDispatchStatus(disp.id, 'En Route')}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Dispatch Unit</span>
                    </button>
                  )}

                  {currentUser?.role === 'doctor' && disp.status === 'En Route' && (
                    <button
                      onClick={() => updateDispatchStatus(disp.id, 'Arrived')}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Mark On Scene</span>
                    </button>
                  )}

                  {currentUser?.role === 'doctor' && disp.status === 'Arrived' && (
                    <button
                      onClick={() => updateDispatchStatus(disp.id, 'Completed')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Complete Trip</span>
                    </button>
                  )}

                  {disp.status === 'Completed' && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Fulfilled</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
