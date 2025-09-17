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

  async deleteOrder(id: number): Promise<void> {
    return dataService.deleteOrder(id);
  }

  // Medical Orders
  async getMedicalOrders(): Promise<PaginatedResponse<Order>> {
    return dataService.getMedicalOrders();
  }

  async approveOrder(id: number, examinationData?: any): Promise<Order> {
    return dataService.approveOrder(id, examinationData);
  }

  async rejectOrder(id: number, examinationData?: any): Promise<Order> {
    return dataService.rejectOrder(id, examinationData);
  }

  // Production Orders
  async getProductionOrders(): Promise<PaginatedResponse<Order>> {
    return dataService.getProductionOrders();
  }

  async updateOrderStatus(id: number, status: number, data?: any): Promise<Order> {
    return dataService.updateOrderStatus(id, status, data);
  }

  // Warehouse

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

  // Накладные
  async getOverheads(): Promise<PaginatedResponse<any>> {
    return dataService.getOverheads();
  }

  async getOverhead(id: number): Promise<any> {
    return dataService.getOverhead(id);
  }

  async createOverhead(overhead: any): Promise<any> {
    return dataService.createOverhead(overhead);
  }

  async updateOverhead(id: number, overhead: any): Promise<any> {
    return dataService.updateOverhead(id, overhead);
  }

  async deleteOverhead(id: number): Promise<void> {
    return dataService.deleteOverhead(id);
  }

  // Новые справочники
  async getStumpForms(): Promise<any[]> {
    return dataService.getStumpForms();
  }

  async getScarTypes(): Promise<any[]> {
    return dataService.getScarTypes();
  }

  async getSkinConditionTypes(): Promise<any[]> {
    return dataService.getSkinConditionTypes();
  }

  async getBoneDustTypes(): Promise<any[]> {
    return dataService.getBoneDustTypes();
  }

  async getShoeModels(): Promise<any[]> {
    return dataService.getShoeModels();
  }

  async getShoeColors(): Promise<any[]> {
    return dataService.getShoeColors();
  }

  async getHeelMaterials(): Promise<any[]> {
    return dataService.getHeelMaterials();
  }

  // Новые справочники
  async getDeviceMaterials(): Promise<any[]> {
    return dataService.getDeviceMaterials();
  }

  async getOrderStatuses(): Promise<any[]> {
    return dataService.getOrderStatuses();
  }

  async getPriorityLevels(): Promise<any[]> {
    return dataService.getPriorityLevels();
  }

  async getDocumentTypes(): Promise<any[]> {
    return dataService.getDocumentTypes();
  }

  async getPassportSeries(): Promise<any[]> {
    return dataService.getPassportSeries();
  }

  async getAgeGroups(): Promise<any[]> {
    return dataService.getAgeGroups();
  }

  async getDisabilityCategories(): Promise<any[]> {
    return dataService.getDisabilityCategories();
  }

  async getDisabilityCauses(): Promise<any[]> {
    return dataService.getDisabilityCauses();
  }

  async getServiceTypes(): Promise<any[]> {
    return dataService.getServiceTypes();
  }

  // Склад - операции с инвентарем
  async createInventoryItem(itemData: any): Promise<any> {
    return dataService.createInventoryItem(itemData);
  }

  async updateInventoryItem(id: number, itemData: any): Promise<any> {
    return dataService.updateInventoryItem(id, itemData);
  }

  async deleteInventoryItem(id: number): Promise<void> {
    return dataService.deleteInventoryItem(id);
  }

  async issueFromWarehouse(issueData: any): Promise<any> {
    return dataService.issueFromWarehouse(issueData);
  }

  async getWarehouseEntries(): Promise<any[]> {
    return dataService.getWarehouseEntries();
  }

  async getWarehouseIssues(): Promise<any[]> {
    return dataService.getWarehouseIssues();
  }

  // Справочник инвалидности
  async getDisabilities(): Promise<any[]> {
    return dataService.getDisabilities();
  }

  // Направления на услуги
  async getServiceDirections(cartId: number): Promise<any[]> {
    return dataService.getServiceDirections(cartId);
  }

  async addServiceDirection(cartId: number, directionData: any): Promise<any> {
    return dataService.addServiceDirection(cartId, directionData);
  }

  // Направления на реабилитацию
  async getRehabilitationDirections(cartId: number): Promise<any[]> {
    return dataService.getRehabilitationDirections(cartId);
  }

  async addRehabilitationDirection(cartId: number, directionData: any): Promise<any> {
    return dataService.addRehabilitationDirection(cartId, directionData);
  }

  // Полуфабрикаты
  async getSemiFinishedProducts(orderId: number): Promise<any[]> {
    return dataService.getSemiFinishedProducts(orderId);
  }

  async addSemiFinishedProduct(orderId: number, productData: any): Promise<any> {
    return dataService.addSemiFinishedProduct(orderId, productData);
  }

  // Готовые ПОИ
  async getReadyPOI(orderId: number): Promise<any> {
    return dataService.getReadyPOI(orderId);
  }

  async updateReadyPOI(orderId: number, poiData: any): Promise<any> {
    return dataService.updateReadyPOI(orderId, poiData);
  }

  // Справочники для распечатки
  async getPrintTemplates(category?: string): Promise<any[]> {
    return dataService.getPrintTemplates(category);
  }

  async getSemiFinishedProductTemplates(): Promise<any[]> {
    return dataService.getSemiFinishedProductTemplates();
  }

  async getShoeTemplates(): Promise<any[]> {
    return dataService.getShoeTemplates();
  }
}

export const apiClient = new ApiClient();
export default apiClient;
