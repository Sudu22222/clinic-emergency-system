import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { StatusBadge } from '../common/StatusBadge';
import { Droplet, Phone, MapPin, CheckCircle, Clock, Plus } from 'lucide-react';

export const RequirementBoard: React.FC = () => {
  const { bloodRequirements, currentUser, fulfillBloodRequirement, setIsBloodReqModalOpen } = useHealth();

  const openRequests = bloodRequirements.filter((r) => r.status === 'Open');

  return (
    <div className="app-card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Droplet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Urgent Blood Requirements ({openRequests.length} Active)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Emergency patient blood requests</p>
        </div>

        <button
          onClick={() => setIsBloodReqModalOpen(true)}
          className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post Requirement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bloodRequirements.map((req) => (
          <div
            key={req.id}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              req.status === 'Open'
                ? 'bg-amber-50/50 dark:bg-slate-900/90 border-amber-200 dark:border-amber-900/60'
                : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                  {req.bloodGroup}
                </span>
                <StatusBadge status={req.urgency} type="urgency" />
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 dark:text-white text-sm">{req.patientName}</div>
                <div className="text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                  <span>Units Needed:</span>
                  <span className="bg-amber-100 dark:bg-amber-950/60 px-2 py-0.2 rounded font-mono text-slate-900 dark:text-white">
                    {req.unitsNeeded} Unit(s)
                  </span>
                </div>

                <div className="flex items-start space-x-1 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="truncate">{req.hospitalLocation}</span>
                </div>

                <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{req.contactPerson} ({req.contactPhone})</span>
                </div>

                {req.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    "{req.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {req.postedAt}
              </span>

              {req.status === 'Open' && currentUser?.role === 'doctor' ? (
                <button
                  onClick={() => fulfillBloodRequirement(req.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Fulfill Request</span>
                </button>
              ) : req.status === 'Fulfilled' ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Fulfilled</span>
                </span>
              ) : (
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Open</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
