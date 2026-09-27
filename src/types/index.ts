export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type UrgencyLevel = 'Moderate' | 'High' | 'Critical';
export type RequirementUrgency = 'Immediate' | 'Within 6 Hours' | 'Within 24 Hours';

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled';
export type AppointmentPriority = 'Normal' | 'Urgent' | 'Routine';

export type DispatchStatus = 'Pending' | 'En Route' | 'Arrived' | 'Completed';

export type DirectoryStatus = 'Open 24/7' | 'Open' | 'Busy / High Volume' | 'Closed';

export type UserRole = 'doctor' | 'patient';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  specialty?: string;
  patientId?: string;
  bloodGroup?: BloodGroup;
  phone?: string;
  location?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  phone: string;
  bloodGroup: BloodGroup;
  location: string;
  emergencyContact?: string;
  medicalNotes?: string;
  registeredDate: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  availableDays: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientBloodGroup: BloodGroup;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  timeSlot: string;
  visitReason: string;
  priority: AppointmentPriority;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AmbulanceDispatch {
  id: string;
  dispatchCode: string;
  patientName: string;
  phone: string;
  pickupAddress: string;
  urgency: UrgencyLevel;
  status: DispatchStatus;
  assignedUnit: string;
  driverName?: string;
  driverPhone?: string;
  eta: string;
  coordinates: {
    x: number;
    y: number;
  };
  destination?: string;
  notes?: string;
  timestamp: string;
}

export interface BloodBank {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  distance: string;
  phone: string;
  availableUnits: Record<BloodGroup, number>;
  isVerified: boolean;
  operatingHours: string;
}

export interface BloodRequirement {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalLocation: string;
  urgency: RequirementUrgency;
  contactPerson: string;
  contactPhone: string;
  postedAt: string;
  status: 'Open' | 'Fulfilled';
  notes?: string;
}

export interface DirectoryItem {
  id: string;
  ownerUserId: string | null;
  doctorName: string;
  name: string;
  type: 'Small Clinic' | 'Emergency Ward' | 'General Hospital' | 'Specialty Center';
  address: string;
  area: string;
  phone: string;
  emergencyHelpline: string;
  status: DirectoryStatus;
  availableRooms: number;
  totalRooms: number;
  availableBeds: number;
  totalBeds: number;
  distance: string;
  rating: number;
  services: string[];
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export type ActiveTab = 'dashboard' | 'appointments' | 'ambulance' | 'blood' | 'directory';
