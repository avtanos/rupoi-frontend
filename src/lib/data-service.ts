import { 
  User, 
  Cart, 
  Order, 
  DashboardStats, 
  PaginatedResponse,
  LoginRequest,
  LoginResponse 
} from '@/types';

// Импорт JSON данных
import usersData from '@/data/users.json';
import cartsData from '@/data/carts.json';
import ordersData from '@/data/orders.json';
import warehouseData from '@/data/warehouse.json';
import reportsData from '@/data/reports.json';
import dictionariesData from '@/data/dictionaries.json';

class DataService {
  private users: User[] = usersData.users;
  private carts: Cart[] = cartsData.carts as Cart[];
  private orders: Order[] = ordersData.orders as Order[];
  private warehouse = warehouseData;
  private reports = reportsData;
  private dictionaries = dictionariesData;

  // Симуляция задержки API
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Аутентификация
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await this.delay(300);
    
    const user = this.users.find(u => 
      u.username === credentials.username && 
      credentials.password === 'admin123' // Простая проверка пароля
    );

    if (!user) {
      throw new Error('Неверный логин или пароль');
    }

    return {
      user,
      session_timeout: user.session_timeout,
      message: 'Успешный вход в систему'
    };
  }

  async logout(): Promise<void> {
    await this.delay(200);
    // В реальном приложении здесь была бы очистка сессии
  }

  async getProfile(): Promise<User> {
    await this.delay(200);
    // Возвращаем первого пользователя как текущего
    return this.users[0];
  }

  async checkSession(): Promise<{ valid: boolean; timeout: number }> {
    await this.delay(100);
    return { valid: true, timeout: 5 };
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay(400);
    return this.reports.dashboard_stats as DashboardStats;
  }

  // Картотека пациентов
  async getCarts(params?: Record<string, string>): Promise<PaginatedResponse<Cart>> {
    await this.delay(300);
    
    let filteredCarts = [...this.carts];
    
    // Фильтрация по поисковому запросу
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredCarts = filteredCarts.filter(cart => 
        cart.first_name.toLowerCase().includes(search) ||
        cart.last_name.toLowerCase().includes(search) ||
        cart.card_number.includes(search) ||
        cart.inn.includes(search)
      );
    }

    // Фильтрация по группе инвалидности
    if (params?.disability_group) {
      filteredCarts = filteredCarts.filter(cart => 
        cart.disability_group.toString() === params.disability_group
      );
    }

    // Фильтрация по статусу
    if (params?.status) {
      filteredCarts = filteredCarts.filter(cart => cart.status === params.status);
    }

    return {
      count: filteredCarts.length,
      next: undefined,
      previous: undefined,
      results: filteredCarts
    };
  }

  async getCart(id: number): Promise<Cart> {
    await this.delay(200);
    const cart = this.carts.find(c => c.id === id);
    if (!cart) {
      throw new Error('Карточка не найдена');
    }
    return cart;
  }

  async createCart(cartData: Partial<Cart>): Promise<Cart> {
    await this.delay(400);
    
    const newCart: Cart = {
      id: Math.max(...this.carts.map(c => c.id)) + 1,
      card_number: `2025-${String(Math.max(...this.carts.map(c => parseInt(c.card_number.split('-')[1]))) + 1).padStart(4, '0')}`,
      first_name: cartData.first_name || '',
      last_name: cartData.last_name || '',
      middle_name: cartData.middle_name,
      birth_date: cartData.birth_date || '',
      inn: cartData.inn || '',
      phone: cartData.phone || '',
      address: cartData.address || '',
      disability_group: cartData.disability_group || 1,
      registration_date: new Date().toISOString().split('T')[0],
      status: 'active',
      oblast: cartData.oblast || this.dictionaries.oblasts[0],
      raion: cartData.raion || this.dictionaries.raions[0],
      locality: cartData.locality || this.dictionaries.localities[0],
      msec: cartData.msec || this.dictionaries.msecs[0],
      disability: cartData.disability || this.dictionaries.disabilities[0]
    };

    this.carts.push(newCart);
    return newCart;
  }

  async updateCart(id: number, cartData: Partial<Cart>): Promise<Cart> {
    await this.delay(400);
    
    const cartIndex = this.carts.findIndex(c => c.id === id);
    if (cartIndex === -1) {
      throw new Error('Карточка не найдена');
    }

    this.carts[cartIndex] = { ...this.carts[cartIndex], ...cartData };
    return this.carts[cartIndex];
  }

  // Заказы
  async getOrders(params?: Record<string, string>): Promise<PaginatedResponse<Order>> {
    await this.delay(300);
    
    let filteredOrders = [...this.orders];
    
    // Фильтрация по типу заказа
    if (params?.order_type) {
      filteredOrders = filteredOrders.filter(order => order.order_type === params.order_type);
    }

    // Фильтрация по статусу
    if (params?.status) {
      filteredOrders = filteredOrders.filter(order => order.status.toString() === params.status);
    }

    // Фильтрация по поисковому запросу
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.number.toLowerCase().includes(search) ||
        order.cart.first_name.toLowerCase().includes(search) ||
        order.cart.last_name.toLowerCase().includes(search)
      );
    }

    return {
      count: filteredOrders.length,
      next: undefined,
      previous: undefined,
      results: filteredOrders
    };
  }

  async getOrder(id: number): Promise<Order> {
    await this.delay(200);
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new Error('Заказ не найден');
    }
    return order;
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    await this.delay(400);
    
    const newOrder: Order = {
      id: Math.max(...this.orders.map(o => o.id)) + 1,
      number: `ORD-2025-${String(Math.max(...this.orders.map(o => parseInt(o.number.split('-')[2]))) + 1).padStart(4, '0')}`,
      cart: orderData.cart || this.carts[0],
      order_type: orderData.order_type || 'prosthesis',
      device_type: orderData.device_type || this.dictionaries.device_types[0],
      amputation_type: orderData.amputation_type || this.dictionaries.amputation_types[0],
      diagnosis_type: orderData.diagnosis_type || this.dictionaries.diagnosis_types[0],
      status: 1, // Новый заказ
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      materials: orderData.materials || [],
      works: orderData.works || [],
      employees: orderData.employees || []
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order> {
    await this.delay(400);
    
    const orderIndex = this.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Заказ не найден');
    }

    this.orders[orderIndex] = { 
      ...this.orders[orderIndex], 
      ...orderData, 
      updated_at: new Date().toISOString() 
    };
    return this.orders[orderIndex];
  }

  // Медицинские заказы
  async getMedicalOrders(): Promise<PaginatedResponse<Order>> {
    await this.delay(300);
    // Возвращаем заказы со статусом "направлен в медицинский отдел"
    const medicalOrders = this.orders.filter(order => order.status === 1);
    return {
      count: medicalOrders.length,
      next: undefined,
      previous: undefined,
      results: medicalOrders
    };
  }

  async approveOrder(id: number): Promise<Order> {
    await this.delay(400);
    return this.updateOrder(id, { status: 2 }); // Переводим в статус "утвержден"
  }

  // Производственные заказы
  async getProductionOrders(): Promise<PaginatedResponse<Order>> {
    await this.delay(300);
    // Возвращаем заказы в производстве
    const productionOrders = this.orders.filter(order => order.status >= 2 && order.status <= 4);
    return {
      count: productionOrders.length,
      next: undefined,
      previous: undefined,
      results: productionOrders
    };
  }

  async updateOrderStatus(id: number, status: number): Promise<Order> {
    await this.delay(400);
    return this.updateOrder(id, { status });
  }

  // Склад
  async getWarehouseEntries(): Promise<PaginatedResponse<any>> {
    await this.delay(300);
    return {
      count: this.warehouse.warehouse_entries.length,
      next: undefined,
      previous: undefined,
      results: this.warehouse.warehouse_entries
    };
  }

  async getInventory(): Promise<any[]> {
    await this.delay(200);
    return this.warehouse.inventory;
  }

  async createIssue(issueData: any): Promise<any> {
    await this.delay(400);
    
    const newIssue = {
      id: Math.max(...this.warehouse.issues.map(i => i.id)) + 1,
      ...issueData,
      issued_at: new Date().toISOString()
    };

    this.warehouse.issues.push(newIssue);
    return newIssue;
  }

  // Отчеты
  async getLOVZReport(params?: Record<string, string>): Promise<any[]> {
    await this.delay(500);
    return this.reports.lovz_report;
  }

  async getManufacturedReport(params?: Record<string, string>): Promise<any[]> {
    await this.delay(500);
    return this.reports.manufactured_report;
  }

  // Справочники
  async getOblasts(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.oblasts;
  }

  async getRaions(oblastId: number): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.raions.filter(r => r.oblast === oblastId);
  }

  async getLocalities(raionId: number): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.localities.filter(l => l.raion === raionId);
  }

  async getMSECs(localityId: number): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.msecs.filter(m => m.locality === localityId);
  }

  async getDeviceTypes(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.device_types;
  }

  async getAmputationTypes(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.amputation_types;
  }

  async getDiagnosisTypes(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.diagnosis_types;
  }

  async getMaterials(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.materials;
  }

  async getWorks(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.works;
  }

  async getEmployees(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.employees;
  }
}

export const dataService = new DataService();
export default dataService;
