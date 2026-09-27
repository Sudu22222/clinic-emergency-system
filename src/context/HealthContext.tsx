import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Patient,
  Appointment,
  AmbulanceDispatch,
  BloodBank,
  BloodRequirement,
  DirectoryItem,
  ActiveTab,
  ToastMessage,
  AppointmentStatus,
  DispatchStatus,
  UserAccount,
  BloodGroup,
  UserRole,
} from '../types';
import { authApi, dataApi, DirectoryPayload } from '../api';

interface HealthContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserAccount | null;
  authLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string; phone: string; bloodGroup?: BloodGroup; role: UserRole; specialty?: string; registrationCode?: string }) => Promise<void>;
  logout: () => void;
  patients: Patient[];
  appointments: Appointment[];
  dispatches: AmbulanceDispatch[];
  bloodBanks: BloodBank[];
  bloodRequirements: BloodRequirement[];
  directory: DirectoryItem[];
  doctors: { id: string; name: string; specialty: string; department: string; availableDays: string[] }[];
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  dispatchAmbulance: (dispatch: Omit<AmbulanceDispatch, 'id' | 'dispatchCode' | 'status' | 'coordinates' | 'eta' | 'assignedUnit' | 'timestamp'>) => void;
  updateDispatchStatus: (id: string, status: DispatchStatus) => void;
  postBloodRequirement: (req: Omit<BloodRequirement, 'id' | 'postedAt' | 'status'>) => void;
  fulfillBloodRequirement: (id: string) => void;
  saveDirectoryItem: (id: string | null, item: DirectoryPayload) => Promise<void>;
  isPatientModalOpen: boolean;
  setIsPatientModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isDispatchModalOpen: boolean;
  setIsDispatchModalOpen: (open: boolean) => void;
  isBloodReqModalOpen: boolean;
  setIsBloodReqModalOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);
const THEME_KEY = 'healthpulse_darkmode';

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dispatches, setDispatches] = useState<AmbulanceDispatch[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [bloodRequirements, setBloodRequirements] = useState<BloodRequirement[]>([]);
  const [directory, setDirectory] = useState<DirectoryItem[]>([]);
  const [doctors, setDoctors] = useState<HealthContextType['doctors']>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem(THEME_KEY) === 'true');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isBloodReqModalOpen, setIsBloodReqModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: string) => setToasts((previous) => previous.filter((toast) => toast.id !== id));
  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((previous) => [...previous, { id, title, message, type }]);
    window.setTimeout(() => removeToast(id), 4000);
  };

  const loadData = async () => {
    const result = await dataApi.list();
    const data = result.data;
    if (!data) return;
    setPatients(data.patients);
    setAppointments(data.appointments);
    setDispatches(data.dispatches.map(({ coord_x, coord_y, ...dispatch }) => ({
      ...dispatch,
      coordinates: dispatch.coordinates ?? { x: coord_x ?? 50, y: coord_y ?? 50 },
    })));
    setBloodBanks(data.banks);
    setBloodRequirements(data.requirements);
    setDirectory(data.directory);
    setDoctors(data.doctors);
  };

  useEffect(() => {
    let active = true;
    authApi.me()
      .then(async (result) => {
        if (!active || !result.user) return;
        setCurrentUser(result.user);
        await loadData();
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setAuthLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem(THEME_KEY, String(isDarkMode));
  }, [isDarkMode]);

  const login = async (email: string, password: string, role: UserRole) => {
    const result = await authApi.login(email, password, role);
    if (!result.user) throw new Error('The server did not return an account.');
    await loadData();
    setCurrentUser(result.user);
    setActiveTab('dashboard');
    addToast('Signed in', `Welcome, ${result.user.name}.`, 'success');
  };

  const signup = async (payload: { name: string; email: string; password: string; phone: string; bloodGroup?: BloodGroup; role: UserRole; specialty?: string; registrationCode?: string }) => {
    const result = await authApi.register(payload);
    if (!result.user) throw new Error('The server did not return the new account.');
    await loadData();
    setCurrentUser(result.user);
    setActiveTab('dashboard');
    addToast('Account created', 'Your account is ready.', 'success');
  };

  const logout = () => {
    void authApi.logout().catch(() => undefined);
    setCurrentUser(null);
    setPatients([]);
    setAppointments([]);
    setDispatches([]);
    setBloodBanks([]);
    setBloodRequirements([]);
    setDirectory([]);
    setDoctors([]);
    setActiveTab('dashboard');
  };

  const persist = async (operation: () => Promise<unknown>, success: string) => {
    try {
      await operation();
      await loadData();
      addToast('Saved', success, 'success');
    } catch (error) {
      addToast('Could not save', error instanceof Error ? error.message : 'Please try again.', 'error');
    }
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'registeredDate'>) => {
    void persist(() => dataApi.create('patient', patient), `${patient.name} was added to the database.`);
  };
  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    void persist(() => dataApi.create('appointment', appointment), 'Appointment was added to the database.');
  };
  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    void persist(() => dataApi.update('appointment', id, status), `Appointment marked ${status.toLowerCase()}.`);
  };
  const dispatchAmbulance = (dispatch: Omit<AmbulanceDispatch, 'id' | 'dispatchCode' | 'status' | 'coordinates' | 'eta' | 'assignedUnit' | 'timestamp'>) => {
    void persist(() => dataApi.create('dispatch', dispatch), 'Dispatch request was saved.');
  };
  const updateDispatchStatus = (id: string, status: DispatchStatus) => {
    void persist(() => dataApi.update('dispatch', id, status), `Dispatch marked ${status.toLowerCase()}.`);
  };
  const postBloodRequirement = (requirement: Omit<BloodRequirement, 'id' | 'postedAt' | 'status'>) => {
    void persist(() => dataApi.create('requirement', requirement), 'Blood request was saved.');
  };
  const fulfillBloodRequirement = (id: string) => {
    void persist(() => dataApi.update('requirement', id, 'Fulfilled'), 'Blood request marked fulfilled.');
  };
  const saveDirectoryItem = async (id: string | null, item: DirectoryPayload) => {
    if (currentUser?.role !== 'doctor') {
      throw new Error('Only doctor accounts can manage clinic listings.');
    }
    try {
      await (id ? dataApi.updateDirectoryItem(id, item) : dataApi.createDirectoryItem(item));
      await loadData();
      addToast('Saved', id ? 'Clinic listing updated.' : 'Clinic added to the directory.', 'success');
    } catch (error) {
      addToast('Could not save clinic', error instanceof Error ? error.message : 'Please try again.', 'error');
      throw error;
    }
  };

  return (
    <HealthContext.Provider value={{
      activeTab, setActiveTab, currentUser, authLoading, login, signup, logout,
      patients, appointments, dispatches, bloodBanks, bloodRequirements, directory, doctors,
      toasts, addToast, removeToast, addPatient, addAppointment, updateAppointmentStatus,
      dispatchAmbulance, updateDispatchStatus, postBloodRequirement, fulfillBloodRequirement, saveDirectoryItem,
      isPatientModalOpen, setIsPatientModalOpen, isBookingModalOpen, setIsBookingModalOpen,
      isDispatchModalOpen, setIsDispatchModalOpen, isBloodReqModalOpen, setIsBloodReqModalOpen,
      isDarkMode, toggleTheme: () => setIsDarkMode((previous) => !previous), searchQuery, setSearchQuery,
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealth must be used within a HealthProvider');
  return context;
};