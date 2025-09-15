import { 
  LoginRequest, 
  LoginResponse, 
  User, 
  Cart, 
  Order, 
  DashboardStats,
  ApiResponse,
  PaginatedResponse 
} from '@/types';
import { dataService } from './data-service';

class ApiClient {
  constructor() {
    // Используем мок-данные вместо реального API
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return dataService.login(credentials);
  }

  async logout(): Promise<void> {
    return dataService.logout();
  }

  async getProfile(): Promise<User> {
    return dataService.getProfile();
  }

  async checkSession(): Promise<{ valid: boolean; timeout: number }> {
    return dataService.checkSession();
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return dataService.getDashboardStats();
  }

  // Carts (Patients)
  async getCarts(params?: Record<string, string>): Promise<PaginatedResponse<Cart>> {
    return dataService.getCarts(params);
  }

  async getCart(id: number): Promise<Cart> {
    return dataService.getCart(id);
  }

  async createCart(cart: Partial<Cart>): Promise<Cart> {
    return dataService.createCart(cart);
  }

  async updateCart(id: number, cart: Partial<Cart>): Promise<Cart> {
    return dataService.updateCart(id, cart);
  }

  // Orders
  async getOrders(params?: Record<string, string>): Promise<PaginatedResponse<Order>> {
    return dataService.getOrders(params);
  }

  async getOrder(id: number): Promise<Order> {
    return dataService.getOrder(id);
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    return dataService.createOrder(order);
  }

  async updateOrder(id: number, order: Partial<Order>): Promise<Order> {
    return dataService.updateOrder(id, order);
  }

  // Medical Orders
  async getMedicalOrders(): Promise<PaginatedResponse<Order>> {
    return dataService.getMedicalOrders();
  }

  async approveOrder(id: number): Promise<Order> {
    return dataService.approveOrder(id);
  }

  // Production Orders
  async getProductionOrders(): Promise<PaginatedResponse<Order>> {
    return dataService.getProductionOrders();
  }

  async updateOrderStatus(id: number, status: number): Promise<Order> {
    return dataService.updateOrderStatus(id, status);
  }

  // Warehouse
  async getWarehouseEntries(): Promise<PaginatedResponse<any>> {
    return dataService.getWarehouseEntries();
  }

  async getInventory(): Promise<any[]> {
    return dataService.getInventory();
  }

  async createIssue(issue: any): Promise<any> {
    return dataService.createIssue(issue);
  }

  // Reports
  async getLOVZReport(params?: Record<string, string>): Promise<any[]> {
    return dataService.getLOVZReport(params);
  }

  async getManufacturedReport(params?: Record<string, string>): Promise<any[]> {
    return dataService.getManufacturedReport(params);
  }

  // Dictionaries
  async getOblasts(): Promise<any[]> {
    return dataService.getOblasts();
  }

  async getRaions(oblastId: number): Promise<any[]> {
    return dataService.getRaions(oblastId);
  }

  async getLocalities(raionId: number): Promise<any[]> {
    return dataService.getLocalities(raionId);
  }

  async getMSECs(localityId: number): Promise<any[]> {
    return dataService.getMSECs(localityId);
  }

  async getDeviceTypes(): Promise<any[]> {
    return dataService.getDeviceTypes();
  }

  async getAmputationTypes(): Promise<any[]> {
    return dataService.getAmputationTypes();
  }

  async getDiagnosisTypes(): Promise<any[]> {
    return dataService.getDiagnosisTypes();
  }

  async getMaterials(): Promise<any[]> {
    return dataService.getMaterials();
  }

  async getWorks(): Promise<any[]> {
    return dataService.getWorks();
  }

  async getEmployees(): Promise<any[]> {
    return dataService.getEmployees();
  }
}

export const apiClient = new ApiClient();
export default apiClient;
