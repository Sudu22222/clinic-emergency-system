import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { AmbulanceDispatch } from '../../types';
import { Navigation, MapPin, Phone, Building2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface SimulatedMapProps {
  onSelectDispatch?: (dispatch: AmbulanceDispatch) => void;
  selectedDispatchId?: string;
}

export const SimulatedMap: React.FC<SimulatedMapProps> = ({ onSelectDispatch, selectedDispatchId }) => {
  const { dispatches } = useHealth();
  const [hoveredDispatch, setHoveredDispatch] = useState<AmbulanceDispatch | null>(null);

  const activeDispatches = dispatches.filter((d) => d.status !== 'Completed');

  return (
    <div className="app-card p-4 relative overflow-hidden flex flex-col justify-between h-[400px]">
      {/* Map Header Overlay */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs backdrop-blur-md">
          <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-white">Live Ambulance Location Map</span>
          <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {activeDispatches.length} Active
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-[11px] text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Moderate</span>
        </div>
      </div>

      {/* Map Canvas Background Grid */}
      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 pointer-events-none opacity-80" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      {/* Central Hospital Base Marker */}
      <div className="absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-auto">
        <div className="relative group cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800 mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow mt-1 whitespace-nowrap">
            St. Jude Central Hospital
          </div>
        </div>
      </div>

      {/* Ambulance Dispatch Markers on Map */}
      <div className="relative w-full h-full z-20">
        {activeDispatches.map((disp) => {
          const isSelected = selectedDispatchId === disp.id;
          let markerBg = 'bg-rose-600 text-white border-white';
          if (disp.urgency === 'High') markerBg = 'bg-amber-500 text-white border-white';
          if (disp.urgency === 'Moderate') markerBg = 'bg-sky-500 text-white border-white';

          return (
            <div
              key={disp.id}
              style={{ left: `${disp.coordinates.x}%`, top: `${disp.coordinates.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 cursor-pointer group"
              onClick={() => onSelectDispatch && onSelectDispatch(disp)}
              onMouseEnter={() => setHoveredDispatch(disp)}
              onMouseLeave={() => setHoveredDispatch(null)}
            >
              <div className="relative flex flex-col items-center">
                {/* Vehicle Pin */}
                <div className={`w-8 h-8 rounded-full border-2 ${markerBg} flex items-center justify-center font-bold shadow-md transition-transform group-hover:scale-110 ${isSelected ? 'scale-125 ring-4 ring-teal-400' : ''}`}>
                  <Navigation className="w-4 h-4 transform rotate-45" />
                </div>

                {/* Marker Info Tag */}
                <div className="mt-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-[10px] font-mono whitespace-nowrap shadow-sm">
                  <span className="font-bold text-teal-600 dark:text-teal-400">{disp.dispatchCode}</span> • {disp.eta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover / Selection Floating Card */}
      {hoveredDispatch && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-lg flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{hoveredDispatch.dispatchCode}</span>
              <StatusBadge status={hoveredDispatch.urgency} type="urgency" />
              <StatusBadge status={hoveredDispatch.status} type="dispatch" />
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 mt-1">Patient: {hoveredDispatch.patientName}</div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{hoveredDispatch.pickupAddress}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="font-bold text-rose-600 dark:text-rose-400 font-mono text-sm">ETA: {hoveredDispatch.eta}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">{hoveredDispatch.assignedUnit}</div>
            {hoveredDispatch.driverPhone && (
              <div className="text-[11px] text-teal-600 dark:text-teal-400 flex items-center gap-1 justify-end mt-1">
                <Phone className="w-3 h-3" />
                <span>{hoveredDispatch.driverPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Instructions */}
      <div className="z-10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
        <span>Click any ambulance pin to view status & ETA</span>
        <span className="font-mono">St. Jude Medical Hub</span>
      </div>
    </div>
  );
};
