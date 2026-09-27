import type {
  Appointment,
  AmbulanceDispatch,
  BloodBank,
  BloodRequirement,
  DirectoryItem,
  Patient,
  UserAccount,
  UserRole,
} from './types';

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'api';

interface ApiResult<T> {
  status: 'success' | 'error';
  message?: string;
  user?: UserAccount;
  id?: string;
  data?: T;
}

async function request<T>(path: string, body?: object): Promise<ApiResult<T>> {
  const response = await fetch(`${apiBase}/${path}`, {
    method: body ? 'POST' : 'GET',
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let result: ApiResult<T>;
  try {
    result = await response.json() as ApiResult<T>;
  } catch {
    throw new Error(`The API returned a non-JSON response (HTTP ${response.status}). Confirm the API URL points to a server that executes PHP.`);
  }
  if (!response.ok || result.status !== 'success') {
    throw new Error(result.message || 'The server request failed.');
  }
  return result;
}

export const authApi = {
  me: () => request<never>('auth.php?action=me'),
  login: (email: string, password: string, expectedRole: UserRole) => request<never>('auth.php', { action: 'login', email, password, expectedRole }),
  register: (payload: { name: string; email: string; password: string; phone: string; bloodGroup?: string; role: UserRole; specialty?: string; registrationCode?: string }) =>
    request<never>('auth.php', { action: 'register', ...payload }),
  logout: () => request<never>('auth.php', { action: 'logout' }),
};

export interface HealthData {
  patients: Patient[];
  appointments: Appointment[];
  dispatches: (AmbulanceDispatch & { coord_x?: number; coord_y?: number })[];
  banks: BloodBank[];
  requirements: BloodRequirement[];
  directory: (Omit<DirectoryItem, 'services'> & { services: string[] })[];
  doctors: { id: string; name: string; specialty: string; department: string; availableDays: string[] }[];
}

export type DirectoryPayload = Omit<DirectoryItem, 'id' | 'ownerUserId' | 'doctorName' | 'distance' | 'rating'>;

export const dataApi = {
  list: () => request<HealthData>('data.php'),
  create: (type: string, payload: object) => request<never>('data.php', { action: 'create', type, ...payload }),
  update: (type: string, id: string, status: string) => request<never>('data.php', { action: 'update', type, id, status }),
  createDirectoryItem: (payload: DirectoryPayload) => request<never>('data.php', { action: 'create', ...payload, recordType: 'directory' }),
  updateDirectoryItem: (id: string, payload: DirectoryPayload) => request<never>('data.php', { action: 'update', id, ...payload, recordType: 'directory' }),
};