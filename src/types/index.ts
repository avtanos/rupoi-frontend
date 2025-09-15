export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  is_active: boolean;
  is_blocked: boolean;
  last_activity: string;
  session_timeout: number;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  permissions: string[];
  is_active: boolean;
}

export interface Cart {
  id: number;
  card_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date: string;
  inn: string;
  phone: string;
  address: string;
  disability_group: number;
  registration_date: string;
  status: 'active' | 'archived' | 'not_registered';
  oblast: Oblast;
  raion: Raion;
  locality: Locality;
  msec: MSEC;
  disability: Disability;
}

export interface Oblast {
  id: number;
  name: string;
  code: string;
}

export interface Raion {
  id: number;
  name: string;
  code: string;
  oblast: number;
}

export interface Locality {
  id: number;
  name: string;
  code: string;
  raion: number;
}

export interface MSEC {
  id: number;
  name: string;
  code: string;
  locality: number;
}

export interface Disability {
  id: number;
  name: string;
  code: string;
}

export interface Order {
  id: number;
  number: string;
  cart: Cart;
  order_type: 'prosthesis' | 'shoes' | 'orthopedic' | 'repair';
  device_type: DeviceType;
  amputation_type: AmputationType;
  diagnosis_type: DiagnosisType;
  status: number;
  created_at: string;
  updated_at: string;
  materials: OrderMaterial[];
  works: OrderWork[];
  employees: EmployeeOrder[];
}

export interface DeviceType {
  id: number;
  name: string;
  code: string;
}

export interface AmputationType {
  id: number;
  name: string;
  code: string;
}

export interface DiagnosisType {
  id: number;
  name: string;
  code: string;
}

export interface Material {
  id: number;
  name: string;
  code: string;
  unit: string;
  price: number;
}

export interface Work {
  id: number;
  name: string;
  code: string;
  unit: string;
  price: number;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  position: string;
  department: string;
  is_active: boolean;
}

export interface OrderMaterial {
  id: number;
  order: number;
  material: Material;
  quantity: number;
  price: number;
}

export interface OrderWork {
  id: number;
  order: number;
  work: Work;
  quantity: number;
  price: number;
}

export interface EmployeeOrder {
  id: number;
  order: number;
  employee: Employee;
  assigned_at: string;
}

export interface WarehouseEntry {
  id: number;
  order: Order;
  invoice: Overhead;
  quantity: number;
  status: 'received' | 'stored' | 'issued';
  received_at: string;
  stored_at?: string;
  issued_at?: string;
}

export interface Overhead {
  id: number;
  number: string;
  date: string;
  total_amount: number;
  status: 'draft' | 'confirmed' | 'cancelled';
}

export interface Issue {
  id: number;
  order: Order;
  quantity: number;
  issued_at: string;
  issued_by: Employee;
  order_status: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  session_timeout: number;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface DashboardStats {
  total_patients: number;
  total_orders: number;
  active_orders: number;
  ready_orders: number;
  recent_orders: Order[];
}

export interface ReportData {
  lovz_report: any[];
  manufactured_report: any[];
}
