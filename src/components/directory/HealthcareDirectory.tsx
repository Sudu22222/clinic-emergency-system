import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { StatusBadge } from '../common/StatusBadge';
import { DirectoryItem, DirectoryStatus } from '../../types';
import { DirectoryPayload } from '../../api';
import { Building, Phone, MapPin, Search, BedDouble, DoorOpen, PhoneCall, ChevronRight, Plus, Pencil, Save, X } from 'lucide-react';

const emptyClinic: DirectoryPayload = {
  name: '',
  type: 'General Hospital',
  address: '',
  area: '',
  phone: '',
  emergencyHelpline: '',
  status: 'Open',
  availableRooms: 0,
  totalRooms: 0,
  availableBeds: 0,
  totalBeds: 0,
  services: [],
};

export const HealthcareDirectory: React.FC = () => {
  const { directory, currentUser, setIsBookingModalOpen, addToast, saveDirectoryItem } = useHealth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clinicForm, setClinicForm] = useState<DirectoryPayload>(emptyClinic);
  const [servicesText, setServicesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const isDoctor = currentUser?.role === 'doctor';

  const types = ['All', 'Small Clinic', 'Emergency Ward', 'General Hospital', 'Specialty Center'];

  const openCreateForm = () => {
    setEditingId(null);
    setClinicForm({ ...emptyClinic });
    setServicesText('');
    setFormError('');
    setIsEditorOpen(true);
  };

  const openEditForm = (item: DirectoryItem) => {
    setEditingId(item.id);
    setClinicForm({
      name: item.name,
      type: item.type,
      address: item.address,
      area: item.area,
      phone: item.phone,
      emergencyHelpline: item.emergencyHelpline,
      status: item.status,
      availableRooms: item.availableRooms,
      totalRooms: item.totalRooms,
      availableBeds: item.availableBeds,
      totalBeds: item.totalBeds,
      services: item.services,
    });
    setServicesText(item.services.join(', '));
    setFormError('');
    setIsEditorOpen(true);
  };

  const updateClinicForm = <K extends keyof DirectoryPayload>(key: K, value: DirectoryPayload[K]) => {
    setClinicForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleClinicSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await saveDirectoryItem(editingId, {
        ...clinicForm,
        services: servicesText.split(',').map((service) => service.trim()).filter(Boolean),
      });
      setEditingId(null);
      setIsEditorOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not save the clinic.');
    } finally {
      setSaving(false);
    }
  };

  const filteredDirectory = directory.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.area.toLowerCase().includes(q) ||
      item.services.some((s) => s.toLowerCase().includes(q));

    const matchesType = selectedType === 'All' ? true : item.type === selectedType;
    const matchesStatus = selectedStatus === 'All' ? true : item.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="app-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-sky-500">
        <div>
          <div className="flex items-center space-x-2">
            <Building className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Doctors & Medical Center Directory
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Locate nearby clinics, hospitals, emergency wards, and specialized doctors with bed availability.
          </p>
        </div>
        {isDoctor && !isEditorOpen && (
          <button onClick={openCreateForm} className="flex shrink-0 items-center justify-center gap-2 bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            <Plus className="h-4 w-4" /> Add my clinic
          </button>
        )}
      </div>

      {isDoctor && isEditorOpen && (
        <form onSubmit={handleClinicSave} className="app-card space-y-4 border border-teal-300 p-5 dark:border-teal-800">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold">{editingId ? 'Edit clinic details' : 'Add a clinic or hospital'}</h3>
            <button type="button" onClick={() => { setIsEditorOpen(false); setEditingId(null); setFormError(''); }} title="Close form" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs font-semibold">Clinic / hospital name
              <input required maxLength={150} value={clinicForm.name} onChange={(event) => updateClinicForm('name', event.target.value)} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold">Facility type
              <select value={clinicForm.type} onChange={(event) => updateClinicForm('type', event.target.value as DirectoryPayload['type'])} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">{types.slice(1).map((type) => <option key={type}>{type}</option>)}</select>
            </label>
            <label className="text-xs font-semibold">Operating status
              <select value={clinicForm.status} onChange={(event) => updateClinicForm('status', event.target.value as DirectoryStatus)} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">{['Open 24/7', 'Open', 'Busy / High Volume', 'Closed'].map((status) => <option key={status}>{status}</option>)}</select>
            </label>
            <label className="text-xs font-semibold sm:col-span-2">Street address
              <input required maxLength={1000} value={clinicForm.address} onChange={(event) => updateClinicForm('address', event.target.value)} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold">Area / city
              <input required maxLength={100} value={clinicForm.area} onChange={(event) => updateClinicForm('area', event.target.value)} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold">Reception phone
              <input required type="tel" maxLength={50} value={clinicForm.phone} onChange={(event) => updateClinicForm('phone', event.target.value)} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold">Emergency helpline
              <input type="tel" maxLength={50} value={clinicForm.emergencyHelpline} onChange={(event) => updateClinicForm('emergencyHelpline', event.target.value)} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold">Total rooms
              <input required type="number" min="0" max="100000" value={clinicForm.totalRooms} onChange={(event) => updateClinicForm('totalRooms', Number(event.target.value))} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold">Available rooms
              <input required type="number" min="0" max={clinicForm.totalRooms} value={clinicForm.availableRooms} onChange={(event) => updateClinicForm('availableRooms', Number(event.target.value))} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold">Total beds
              <input required type="number" min="0" max="100000" value={clinicForm.totalBeds} onChange={(event) => updateClinicForm('totalBeds', Number(event.target.value))} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold">Available beds
              <input required type="number" min="0" max={clinicForm.totalBeds} value={clinicForm.availableBeds} onChange={(event) => updateClinicForm('availableBeds', Number(event.target.value))} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="text-xs font-semibold sm:col-span-2 lg:col-span-3">Specialties / services (comma-separated)
              <input value={servicesText} onChange={(event) => setServicesText(event.target.value)} placeholder="Emergency care, Cardiology, Pediatrics" className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </label>
          </div>
          {formError && <p role="alert" className="text-sm text-rose-600">{formError}</p>}
          <div className="flex justify-end">
            <button disabled={saving} type="submit" className="flex items-center gap-2 bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save clinic details'}</button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="app-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Healthcare Directory ({filteredDirectory.length} Centers)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Search by clinic name, specialty service, or area</p>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clinic, ICU, cardiology..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0">Type:</span>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedType === type
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDirectory.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
            No healthcare facilities found matching your search criteria.
          </div>
        ) : (
          filteredDirectory.map((item) => (
            <div
              key={item.id}
              className="app-card app-card-hover p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                      {item.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{item.name}</h3>
                    {item.doctorName && <p className="mt-1 text-xs font-medium text-teal-700 dark:text-teal-300">Listed by Dr. {item.doctorName}</p>}
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.address}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <StatusBadge status={item.status} type="directory" />
                  </div>
                </div>

                {/* Facility capacity */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <DoorOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Rooms available / total</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.availableRooms} / {item.totalRooms}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <BedDouble className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Beds available / total</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.availableBeds} / {item.totalBeds}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{item.phone}</span>
                  {item.emergencyHelpline && <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300"><PhoneCall className="h-3.5 w-3.5" />{item.emergencyHelpline}</span>}
                </div>

                {/* Services Tags */}
                <div className="mt-3">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block mb-1">
                    Specialized Services
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Helpline */}
                <div className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-300 font-mono font-bold bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>{item.emergencyHelpline}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {isDoctor && item.ownerUserId === currentUser?.id && (
                    <button onClick={() => openEditForm(item)} className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                      <Pencil className="h-3.5 w-3.5" /> Edit my listing
                    </button>
                  )}
                  <button
                    onClick={() => {
                      addToast('Helpline Connected', `Dialing reception for ${item.name} (${item.phone})`, 'info');
                    }}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    Call Clinic
                  </button>

                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Book Visit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
