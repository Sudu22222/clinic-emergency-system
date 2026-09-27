import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { BloodGroup, RequirementUrgency } from '../../types';
import { X, Droplet, User, Phone, MapPin } from 'lucide-react';

export const PostRequirementModal: React.FC = () => {
  const { isBloodReqModalOpen, setIsBloodReqModalOpen, postBloodRequirement } = useHealth();

  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A+');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [urgency, setUrgency] = useState<RequirementUrgency>('Immediate');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!isBloodReqModalOpen) return null;

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalLocation || !contactPhone) return;

    postBloodRequirement({
      patientName,
      bloodGroup,
      unitsNeeded: Number(unitsNeeded),
      hospitalLocation,
      urgency,
      contactPerson: contactPerson || patientName,
      contactPhone,
      notes
    });

    setPatientName('');
    setHospitalLocation('');
    setContactPerson('');
    setContactPhone('');
    setNotes('');
    setIsBloodReqModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 max-w-lg w-full p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 shadow-xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Post Blood Requirement</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Request blood units from donors and banks</p>
            </div>
          </div>
          <button
            onClick={() => setIsBloodReqModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          {/* Patient Name & Contact Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Patient Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Marcus Sterling"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Dr. / Attendant Name"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Blood Group & Units Needed */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-amber-700 dark:text-amber-300 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Units Needed *</label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Urgency *</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as RequirementUrgency)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-rose-700 dark:text-rose-300 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Immediate">Immediate</option>
                <option value="Within 6 Hours">Within 6 Hours</option>
                <option value="Within 24 Hours">Within 24 Hours</option>
              </select>
            </div>
          </div>

          {/* Hospital Location */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Hospital / Clinic Location *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={hospitalLocation}
                onChange={(e) => setHospitalLocation(e.target.value)}
                placeholder="e.g. City Central ICU, Room 304"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Contact Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Clinical Context / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Emergency surgery scheduled..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsBloodReqModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Droplet className="w-4 h-4" />
              <span>Post Requirement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
