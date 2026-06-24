/* ============================================================
   Aiva — TypeScript Type Definitions
   ============================================================ */

// ── Business ──
export interface Business {
  id: number;
  business_name: string;
  phone_number: string;
  address: string | null;
  timezone: string;
  opening_hours: Record<string, DayHours> | null;
  ai_greeting: string | null;
  faq_knowledge_base: FAQItem[] | null;
  policies: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ── User / Auth ──
export interface User {
  id: number;
  business_id: number;
  email: string;
  full_name: string;
  role: 'owner' | 'staff' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  business_name: string;
  phone_number: string;
  address?: string;
  timezone?: string;
}

// ── Customer ──
export interface Customer {
  id: number;
  business_id: number;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  reliability_score: number;
  total_visits: number;
  no_show_count: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerListResponse {
  items: Customer[];
  total: number;
  page: number;
  page_size: number;
}

// ── Service ──
export interface Service {
  id: number;
  business_id: number;
  name: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

// ── Staff ──
export interface Staff {
  id: number;
  business_id: number;
  name: string;
  role: string;
  phone: string | null;
  email: string | null;
  availability: Record<string, StaffDayAvailability> | null;
  is_active: boolean;
  created_at: string;
}

export interface StaffDayAvailability {
  start: string;
  end: string;
  available: boolean;
}

// ── Appointment ──
export interface Appointment {
  id: number;
  business_id: number;
  customer_id: number;
  service_id: number | null;
  staff_id: number | null;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  source: 'ai' | 'manual' | 'online';
  notes: string | null;
  customer?: { id: number; name: string; phone: string | null };
  service?: { id: number; name: string; duration_minutes: number; price?: number };
  staff_member?: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export interface AppointmentListResponse {
  items: Appointment[];
  total: number;
}

// ── Call ──
export interface Call {
  id: number;
  business_id: number;
  customer_id: number | null;
  call_start: string;
  call_end: string | null;
  duration_seconds: number | null;
  outcome: 'booked' | 'rescheduled' | 'cancelled' | 'faq' | 'transferred' | 'missed' | 'unknown';
  transcript: string | null;
  recording_url: string | null;
  transfer_reason: string | null;
  voice_provider: 'vapi' | 'retell';
  provider_call_id: string | null;
  customer_name: string | null;
  created_at: string;
}

export interface CallListResponse {
  items: Call[];
  total: number;
  page: number;
  page_size: number;
}

// ── Analytics ──
export interface OverviewStats {
  todays_appointments: number;
  upcoming_appointments: number;
  calls_today: number;
  ai_bookings: number;
  ai_booking_percentage: number;
  missed_calls: number;
  repeat_customers: number;
  repeat_customer_percentage: number;
  revenue_estimate: number;
  estimated_revenue: number;
  ai_performance: number;
}

// ── Availability ──
export interface AvailableSlot {
  time: string;
  staff_id: number | null;
  staff_name: string | null;
}

export interface AvailabilityResponse {
  date: string;
  service_name: string;
  duration_minutes: number;
  slots: AvailableSlot[];
}
