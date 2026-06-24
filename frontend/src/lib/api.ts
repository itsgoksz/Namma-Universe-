/**
 * Aiva — API Client
 * Axios-based HTTP client with JWT interceptor and type-safe API functions.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
  Business,
  Customer,
  CustomerListResponse,
  Service,
  Staff,
  Appointment,
  AppointmentListResponse,
  Call,
  CallListResponse,
  OverviewStats,
  AvailabilityResponse,
} from '../types';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── JWT Interceptor ──
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          }
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth ──
export const authAPI = {
  register: (data: RegisterRequest) =>
    api.post<AuthTokens>('/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    api.post<AuthTokens>('/auth/login', data).then((r) => r.data),

  me: () => api.get<User>('/auth/me').then((r) => r.data),
};

// ── Business ──
export const businessAPI = {
  get: () => api.get<Business>('/business').then((r) => r.data),

  update: (data: Partial<Business>) =>
    api.put<Business>('/business', data).then((r) => r.data),
};

// ── Appointments ──
export const appointmentsAPI = {
  list: (params?: Record<string, string>) =>
    api.get<AppointmentListResponse>('/appointments', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Appointment>(`/appointments/${id}`).then((r) => r.data),

  create: (data: Partial<Appointment>) =>
    api.post<Appointment>('/appointments', data).then((r) => r.data),

  update: (id: number, data: Partial<Appointment>) =>
    api.put<Appointment>(`/appointments/${id}`, data).then((r) => r.data),

  updateStatus: (id: number, status: string) =>
    api.patch<Appointment>(`/appointments/${id}/status`, { status }).then((r) => r.data),

  delete: (id: number) => api.delete(`/appointments/${id}`),

  availability: (params: { date: string; service_id: number; staff_id?: number }) =>
    api.get<AvailabilityResponse>('/appointments/availability', { params }).then((r) => r.data),
};

// ── Customers ──
export const customersAPI = {
  list: (params?: { search?: string; page?: number; page_size?: number }) =>
    api.get<CustomerListResponse>('/customers', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Customer>(`/customers/${id}`).then((r) => r.data),

  create: (data: Partial<Customer>) =>
    api.post<Customer>('/customers', data).then((r) => r.data),

  update: (id: number, data: Partial<Customer>) =>
    api.put<Customer>(`/customers/${id}`, data).then((r) => r.data),

  appointments: (id: number) =>
    api.get<Appointment[]>(`/customers/${id}/appointments`).then((r) => r.data),
};

// ── Services ──
export const servicesAPI = {
  list: () => api.get<Service[]>('/services').then((r) => r.data),

  get: (id: number) =>
    api.get<Service>(`/services/${id}`).then((r) => r.data),

  create: (data: Partial<Service>) =>
    api.post<Service>('/services', data).then((r) => r.data),

  update: (id: number, data: Partial<Service>) =>
    api.put<Service>(`/services/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/services/${id}`),
};

// ── Staff ──
export const staffAPI = {
  list: () => api.get<Staff[]>('/staff').then((r) => r.data),

  get: (id: number) =>
    api.get<Staff>(`/staff/${id}`).then((r) => r.data),

  create: (data: Partial<Staff>) =>
    api.post<Staff>('/staff', data).then((r) => r.data),

  update: (id: number, data: Partial<Staff>) =>
    api.put<Staff>(`/staff/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/staff/${id}`),
};

// ── Calls ──
export const callsAPI = {
  list: (params?: { outcome?: string; page?: number; page_size?: number }) =>
    api.get<CallListResponse>('/calls', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Call>(`/calls/${id}`).then((r) => r.data),
};

// ── Analytics ──
export const analyticsAPI = {
  overview: () =>
    api.get<OverviewStats>('/analytics/overview').then((r) => r.data),

  services: (days?: number) =>
    api.get('/analytics/services', { params: { days } }).then((r) => r.data),

  peakHours: (days?: number) =>
    api.get('/analytics/peak-hours', { params: { days } }).then((r) => r.data),

  calls: (days?: number) =>
    api.get('/analytics/calls', { params: { days } }).then((r) => r.data),

  revenue: (days?: number) =>
    api.get('/analytics/revenue', { params: { days } }).then((r) => r.data),
};

// ── Chat ──
export const chatAPI = {
  send: (data: { messages: { role: string; content: string }[], generate_audio?: boolean }) =>
    api.post<{ response: string; audio_base64?: string }>('/chat', data).then((r) => r.data),
};

export default api;
