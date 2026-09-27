import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { BloodGroup } from '../../types';
import { PostRequirementModal } from './PostRequirementModal';
import { RequirementBoard } from './RequirementBoard';
import { Droplet, Search, MapPin, Phone, ShieldCheck, Navigation } from 'lucide-react';

export const BloodBankTracker: React.FC = () => {
  const { bloodBanks, addToast } = useHealth();

  const [selectedBloodGroupFilter, setSelectedBloodGroupFilter] = useState<string>('All');
  const [locationSearch, setLocationSearch] = useState<string>('');

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredBanks = bloodBanks.filter((bank) => {
    const q = locationSearch.toLowerCase().trim();
    const matchesLocation =
      !q ||
      bank.name.toLowerCase().includes(q) ||
      bank.location.toLowerCase().includes(q) ||
      bank.city.toLowerCase().includes(q) ||
      bank.address.toLowerCase().includes(q);

    const matchesGroup =
      selectedBloodGroupFilter === 'All'
        ? true
        : bank.availableUnits[selectedBloodGroupFilter as BloodGroup] > 0;

    return matchesLocation && matchesGroup;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="app-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-amber-500">
        <div>
          <div className="flex items-center space-x-2">
            <Droplet className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Blood Bank Inventory Tracker
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Check blood reserve availability across regional blood centers and post urgent requirements.
          </p>
        </div>
      </div>

      {/* Urgent Requirement Board */}
      <RequirementBoard />

      {/* Search & Filter Controls */}
      <div className="app-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Registered Blood Banks ({filteredBanks.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Filter inventory stock by group and location</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Filter by city or bank name..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Blood Group Filter Chips */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedBloodGroupFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedBloodGroupFilter === 'All'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Groups
          </button>
          {bloodGroups.map((group) => {
            const isSelected = selectedBloodGroupFilter === group;
            return (
              <button
                key={group}
                onClick={() => setSelectedBloodGroupFilter(group)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-rose-700 dark:text-rose-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>

        {/* Blood Banks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBanks.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-slate-500 dark:text-slate-400 text-xs">
              No blood banks match the selected filter criteria.
            </div>
          ) : (
            filteredBanks.map((bank) => (
              <div
                key={bank.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 dark:hover:border-amber-500 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{bank.name}</h4>
                        {bank.isVerified && (
                          <span title="Verified Provider">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{bank.address}</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 shrink-0">
                      {bank.distance}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300 mt-2">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span className="font-mono">{bank.phone}</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">{bank.operatingHours}</span>
                  </div>

                  {/* Stock Grid per Blood Group */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block mb-2">
                      Available Stock Units
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {bloodGroups.map((bg) => {
                        const count = bank.availableUnits[bg] || 0;
                        const isFilteredGroup = selectedBloodGroupFilter === bg;

                        return (
                          <div
                            key={bg}
                            className={`p-1.5 rounded-lg text-center border transition-all ${
                              isFilteredGroup
                                ? 'bg-rose-600 text-white border-rose-400 font-bold'
                                : count > 0
                                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                                : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                            }`}
                          >
                            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{bg}</div>
                            <div className="text-xs font-mono font-extrabold">{count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                  <button
                    onClick={() => addToast('Stock Reserved', `Connected with ${bank.name} for blood unit inquiry.`, 'info')}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Contact Blood Bank</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <PostRequirementModal />
    </div>
  );
};
