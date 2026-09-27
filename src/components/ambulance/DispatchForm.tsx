import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { UrgencyLevel } from '../../types';
import { X, Siren, Phone, MapPin, User, AlertOctagon } from 'lucide-react';

export const DispatchFormModal: React.FC = () => {
  const { isDispatchModalOpen, setIsDispatchModalOpen, dispatchAmbulance } = useHealth();

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Critical');
  const [notes, setNotes] = useState('');

  if (!isDispatchModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone || !pickupAddress) return;

    dispatchAmbulance({
      patientName,
      phone,
      pickupAddress,
      urgency,
      notes
    });

    setPatientName('');
    setPhone('');
    setPickupAddress('');
    setNotes('');
    setIsDispatchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 max-w-lg w-full p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Emergency Ambulance Dispatch</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Request immediate medical transport response</p>
            </div>
          </div>
          <button
            onClick={() => setIsDispatchModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          {/* Patient/Requester Name */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Patient / Requester Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Robert Chen"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Phone Number & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Contact Phone *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 911-0000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Urgency Level *</label>
              <div className="relative">
                <AlertOctagon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-rose-700 dark:text-rose-300 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Critical">Critical (Immediate Response)</option>
                  <option value="High">High (Urgent Distress)</option>
                  <option value="Moderate">Moderate (Standard Transport)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Pickup Address & Floor / Landmark *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. 452 Grand Avenue, Apt 304"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Triage / Emergency Notes */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Emergency Notes & Symptoms</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Chest tightness, breathing difficulty..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsDispatchModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Siren className="w-4 h-4" />
              <span>Dispatch Ambulance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
