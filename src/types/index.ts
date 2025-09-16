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
  auto_number: number;
  card_number: string;
  create_date: string;
  inn: string;
  document_type: string;
  first_name: string;
  name: string;
  parent_name: string;
  sex: 'male' | 'female';
  birth_date: string;
  document_series: string;
  document_number: string;
  document_issue_date: string;
  document_issued_by: string;
  lovz_type: string;
  lovz_group: number;
  note?: string;
  
  // Адресные данные
  registration_oblast_id: number;
  registration_raion_id: number;
  registration_locality_id: number;
  living_oblast_id: number;
  living_raion_id: number;
  living_locality_id: number;
  registration_address: string;
  living_address: string;
  
  // МСЭК данные
  reference_msec: string;
  pension_certificate_number: string;
  pension_certificate_issue_date: string;
  msec_id: number;
  pension_certificate_indefinitely: boolean;
  pension_certificate_term_end_date?: string;
  
  // Контактные данные
  work_place?: string;
  phone_number: string;
  additional_phone_number?: string;
  
  // Служебные поля
  status: 'active' | 'inactive' | 'archived';
  medical_department_direct_date?: string;
  deregistration_date?: string;
  deregistration_reason?: string;
  
  // Связанные данные
  oblast: Oblast;
  raion: Raion;
  locality: Locality;
  msec: MSEC;
  disability: Disability;
  disabilities: DisabilityRecord[];
  prosthetics_data?: ProstheticsData;
  tunduk_data: TundukData[];
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
  cart_id: number;
  number: string;
  create_date: string;
  amputation_type: AmputationType;
  diagnosis_type_id: number;
  device_type_r_id?: number;
  device_type_l_id?: number;
  quantity: number;
  diagnosis_side: 'left' | 'right' | 'both';
  hospitalized: boolean;
  order_type: 'prosthesis' | 'shoes' | 'orthopedic' | 'repair';
  order_status: number;
  order_payment_type: string;
  cost: number;
  is_urgent: boolean;
  urgent_reason?: string;
  
  // Даты процесса
  call_date1?: string;
  call_date2?: string;
  call_date3?: string;
  come_date1?: string;
  come_date2?: string;
  come_date3?: string;
  accept_date?: string;
  ready_date?: string;
  issue_date?: string;
  direct_to_approve_date?: string;
  
  // Медицинские данные
  priority_level?: 'normal' | 'high' | 'urgent';
  medical_examination?: any;
  note?: string;
  
  // Данные для обуви
  shoe_model_id?: number;
  shoe_color_id?: number;
  heel_material_id?: number;
  size_of_shortening?: number;
  shoe_order_type?: string;
  
  // Связанные данные
  cart: Cart;
  device_type: DeviceType;
  diagnosis_type: DiagnosisType;
  status: number;
  created_at: string;
  updated_at: string;
  materials: OrderMaterial[];
  works: OrderWork[];
  employees: EmployeeOrder[];
  measurements: OrderMeasurement[];
}

export interface DeviceType {
  id: number;
  name: string;
  code: string;
  order_type?: number; // 0-обувь, 1-протезы, 2-отто-бок, 3-ремонт
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

// Новые интерфейсы согласно ER диаграмме

export interface DisabilityRecord {
  id: number;
  cart_id: number;
  group: number;
  category: string;
  reason: string;
  operated: boolean;
  note?: string;
}

export interface ProstheticsData {
  id: number;
  cart_id: number;
  length: number;
  stump_form_id: number;
  stump_mobility: string;
  stump_mobility_description?: string;
  scar_type_id: number;
  skin_condition_type_id: number;
  bone_dust_type_id: number;
  stump_support: string;
  objectiv_data?: string;
  stump_form: StumpForm;
  scar_type: ScarType;
  skin_condition_type: SkinConditionType;
  bone_dust_type: BoneDustType;
}

export interface OrderMeasurement {
  id: number;
  order_id: number;
  type: string;
  measurement: number;
  unit: string;
  side: 'left' | 'right' | 'both';
}

export interface TundukData {
  id: number;
  cart_id: number;
  date: string;
  first_name: string;
  name: string;
  parent_name: string;
  birth_date: string;
  passport_issue_date: string;
  passport_issued_by: string;
  address_residence: string;
  msec_organization_name: string;
  msec_examination_date: string;
  msec_examination_type: string;
  msec_from: string;
  msec_to: string;
  msec_time_of_disability: string;
  msec_re_examination: boolean;
  msec_status_code: string;
  msec_in_absentia: boolean;
  msec_is_death_period: boolean;
  msec_wheelchair_goal: boolean;
  msec_has_ipr: boolean;
  msec_disability_group: number;
}

export interface Overhead {
  id: number;
  number: string;
  date: string;
  create_date: string;
  shop_name: string;
  device_count: number;
  status: 'draft' | 'confirmed' | 'cancelled';
  type: string;
  total_amount: number;
  note?: string;
  orders: OverheadToOrder[];
  created_at: string;
  updated_at: string;
}

export interface OverheadToOrder {
  id: number;
  overhead_id: number;
  order_id: number;
  order: Order;
}

// Медицинские справочники
export interface StumpForm {
  id: number;
  name: string;
  code: string;
}

export interface ScarType {
  id: number;
  name: string;
  code: string;
}

export interface SkinConditionType {
  id: number;
  name: string;
  code: string;
}

export interface BoneDustType {
  id: number;
  name: string;
  code: string;
}

// Специализированные справочники для обуви
export interface ShoeModel {
  id: number;
  name: string;
  code: string;
}

export interface ShoeColor {
  id: number;
  name: string;
  code: string;
}

export interface HeelMaterial {
  id: number;
  name: string;
  code: string;
}

// Новые справочники
export interface DeviceMaterial {
  id: number;
  device_type_id: number;
  material_id: number;
  is_required: boolean;
}

export interface OrderStatus {
  id: number;
  name: string;
  code: string;
}

export interface PriorityLevel {
  id: number;
  name: string;
  code: string;
}

export interface DocumentType {
  id: number;
  name: string;
  code: string;
}

export interface PassportSeries {
  id: number;
  name: string;
  code: string;
}

export interface AgeGroup {
  id: number;
  name: string;
  code: string;
  min_age: number;
  max_age: number;
}

export interface DisabilityCategory {
  id: number;
  name: string;
  code: string;
}

export interface DisabilityCause {
  id: number;
  name: string;
  code: string;
}

export interface ServiceType {
  id: number;
  name: string;
  code: string;
}
