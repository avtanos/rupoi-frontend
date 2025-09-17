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
import overheadsData from '@/data/overheads.json';

class DataService {
  private users: User[] = usersData.users;
  private carts: Cart[] = cartsData.carts as unknown as Cart[];
  private orders: Order[] = ordersData.orders as unknown as Order[];
  private warehouse = warehouseData;
  private reports = reportsData;
  private dictionaries = dictionariesData;
  private overheads = overheadsData.overheads;

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
    return this.reports.dashboard_stats as unknown as DashboardStats;
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
        cart.name.toLowerCase().includes(search) ||
        cart.card_number.includes(search) ||
        cart.inn.includes(search)
      );
    }

    // Фильтрация по группе инвалидности
    if (params?.disability_group) {
      filteredCarts = filteredCarts.filter(cart => 
        cart.lovz_group.toString() === params.disability_group
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
      auto_number: Math.max(...this.carts.map(c => c.auto_number)) + 1,
      card_number: `2025-${String(Math.max(...this.carts.map(c => parseInt(c.card_number.split('-')[1]))) + 1).padStart(4, '0')}`,
      create_date: new Date().toISOString().split('T')[0],
      inn: cartData.inn || '',
      document_type: 'Паспорт',
      first_name: cartData.first_name || '',
      name: cartData.name || '',
      parent_name: cartData.parent_name || '',
      sex: 'male',
      birth_date: cartData.birth_date || '',
      document_series: 'ID',
      document_number: '1234567890',
      document_issue_date: '2010-01-01',
      document_issued_by: 'ОВД',
      lovz_type: 'Общее заболевание',
      lovz_group: cartData.lovz_group || 1,
      note: '',
      registration_oblast_id: 1,
      registration_raion_id: 1,
      registration_locality_id: 1,
      living_oblast_id: 1,
      living_raion_id: 1,
      living_locality_id: 1,
      registration_address: cartData.registration_address || '',
      living_address: cartData.registration_address || '',
      reference_msec: 'REF-001',
      pension_certificate_number: 'PEN-001',
      pension_certificate_issue_date: '2020-01-01',
      msec_id: 1,
      pension_certificate_indefinitely: false,
      pension_certificate_term_end_date: '2025-12-31',
      work_place: '',
      phone_number: cartData.phone_number || '',
      additional_phone_number: '',
      medical_department_direct_date: undefined,
      deregistration_date: undefined,
      deregistration_reason: undefined,
      status: 'active',
      oblast: cartData.oblast || this.dictionaries.oblasts[0],
      raion: cartData.raion || this.dictionaries.raions[0],
      locality: cartData.locality || this.dictionaries.localities[0],
      msec: cartData.msec || this.dictionaries.msecs[0],
      disability: cartData.disability || this.dictionaries.disabilities[0],
      disabilities: [],
      prosthetics_data: undefined,
      tunduk_data: [],
      service_directions: []
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

  async deleteCart(id: number): Promise<void> {
    await this.delay(400);
    
    const cartIndex = this.carts.findIndex(c => c.id === id);
    if (cartIndex === -1) {
      throw new Error('Карточка не найдена');
    }

    this.carts.splice(cartIndex, 1);
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
        (order.cart?.first_name || '').toLowerCase().includes(search) ||
        (order.cart?.name || '').toLowerCase().includes(search)
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
      cart_id: orderData.cart_id || this.carts[0].id,
      number: `ORD-2025-${String(Math.max(...this.orders.map(o => parseInt(o.number.split('-')[2]))) + 1).padStart(4, '0')}`,
      create_date: new Date().toISOString().split('T')[0],
      amputation_type: orderData.amputation_type || this.dictionaries.amputation_types[0],
      diagnosis_type_id: orderData.diagnosis_type_id || 1,
      device_type_r_id: orderData.device_type_r_id || 1,
      device_type_l_id: orderData.device_type_l_id || undefined,
      quantity: orderData.quantity || 1,
      diagnosis_side: orderData.diagnosis_side || 'right',
      hospitalized: orderData.hospitalized || false,
      order_type: orderData.order_type || 'prosthesis',
      order_status: 1,
      order_payment_type: orderData.order_payment_type || 'Бесплатно',
      cost: orderData.cost || 0,
      is_urgent: orderData.is_urgent || false,
      urgent_reason: orderData.urgent_reason || undefined,
      priority_level: orderData.priority_level || 'normal',
      medical_examination: orderData.medical_examination || undefined,
      note: orderData.note || '',
      measurements: orderData.measurements || [],
      cart: orderData.cart || this.carts[0],
      device_type: orderData.device_type || this.dictionaries.device_types[0],
      diagnosis_type: orderData.diagnosis_type || this.dictionaries.diagnosis_types[0],
      status: 1, // Новый заказ
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      materials: orderData.materials || [],
      works: orderData.works || [],
      employees: orderData.employees || [],
      semi_finished_products: orderData.semi_finished_products || [],
      order_materials: orderData.order_materials || []
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

  async deleteOrder(id: number): Promise<void> {
    await this.delay(100);
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Заказ не найден');
    }
    this.orders.splice(index, 1);
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

  async approveOrder(id: number, examinationData?: any): Promise<Order> {
    await this.delay(400);
    return this.updateOrder(id, { 
      status: 3, // Утвержден
      ...(examinationData && { medical_examination: examinationData })
    });
  }

  async rejectOrder(id: number, examinationData?: any): Promise<Order> {
    await this.delay(400);
    return this.updateOrder(id, { 
      status: 4, // Отклонен
      ...(examinationData && { medical_examination: examinationData })
    });
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

  async updateOrderStatus(id: number, status: number, data?: any): Promise<Order> {
    await this.delay(400);
    const order = this.orders.find(o => o.id === id);
    if (!order) throw new Error('Заказ не найден');
    
    const oldStatus = order.status;
    const updatedOrder = await this.updateOrder(id, { status });
    
    // Добавляем запись в историю статусов
    if (!updatedOrder.status_history) {
      updatedOrder.status_history = [];
    }
    
    updatedOrder.status_history.push({
      id: Date.now(),
      order_id: id,
      from_status: { id: oldStatus, code: 'OLD', name: 'Предыдущий', color: '#gray', is_final: false, can_transition_to: [] },
      to_status: { id: status, code: 'NEW', name: 'Новый', color: '#blue', is_final: false, can_transition_to: [] },
      changed_by: { id: data?.changed_by || 1, username: 'system', first_name: 'System', last_name: 'User', email: 'system@rupoi.kg', role: { id: 1, name: 'System', code: 'SYSTEM', permissions: [], is_active: true }, is_active: true, is_blocked: false, last_activity: new Date().toISOString(), session_timeout: 5 },
      changed_at: new Date().toISOString(),
      comment: data?.comment
    });
    
    return updatedOrder;
  }

  // Склад

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

  // Накладные
  async getOverheads(): Promise<PaginatedResponse<any>> {
    await this.delay(300);
    return {
      count: this.overheads.length,
      next: undefined,
      previous: undefined,
      results: this.overheads
    };
  }

  async getOverhead(id: number): Promise<any> {
    await this.delay(200);
    const overhead = this.overheads.find(o => o.id === id);
    if (!overhead) {
      throw new Error('Накладная не найдена');
    }
    return overhead;
  }

  async createOverhead(overheadData: any): Promise<any> {
    await this.delay(400);
    const newOverhead = {
      id: Math.max(...this.overheads.map(o => o.id)) + 1,
      number: `OV-2025-${String(Math.max(...this.overheads.map(o => parseInt(o.number.split('-')[2]))) + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      ...overheadData,
      orders: []
    };
    this.overheads.push(newOverhead);
    return newOverhead;
  }

  async updateOverhead(id: number, overheadData: any): Promise<any> {
    await this.delay(400);
    const overheadIndex = this.overheads.findIndex(o => o.id === id);
    if (overheadIndex === -1) {
      throw new Error('Накладная не найдена');
    }
    this.overheads[overheadIndex] = { ...this.overheads[overheadIndex], ...overheadData };
    return this.overheads[overheadIndex];
  }

  async deleteOverhead(id: number): Promise<void> {
    await this.delay(100);
    const index = this.overheads.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Накладная не найдена');
    }
    this.overheads.splice(index, 1);
  }

  // Новые справочники
  async getStumpForms(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.stump_forms;
  }

  async getScarTypes(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.scar_types;
  }

  async getSkinConditionTypes(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.skin_condition_types;
  }

  async getBoneDustTypes(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.bone_dust_types;
  }

  async getShoeModels(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.shoe_models;
  }

  async getShoeColors(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.shoe_colors;
  }

  async getHeelMaterials(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.heel_materials;
  }

  // Новые справочники
  async getDeviceMaterials(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.device_materials;
  }

  async getOrderStatuses(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.order_statuses;
  }

  async getPriorityLevels(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.priority_levels;
  }

  async getDocumentTypes(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.document_types;
  }

  async getPassportSeries(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.passport_series;
  }

  async getAgeGroups(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.age_groups;
  }

  async getDisabilityCategories(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.disability_categories;
  }

  async getDisabilityCauses(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.disability_causes;
  }

  async getServiceTypes(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.service_types;
  }

  // Склад - операции с инвентарем
  async createInventoryItem(itemData: any): Promise<any> {
    await this.delay(300);
    const newItem = {
      id: Math.max(...this.warehouse.inventory.map(i => i.id)) + 1,
      ...itemData,
      status: itemData.quantity > itemData.min_quantity ? 'in_stock' : 
              itemData.quantity > 0 ? 'low_stock' : 'out_of_stock'
    };
    this.warehouse.inventory.push(newItem);
    return newItem;
  }

  async updateInventoryItem(id: number, itemData: any): Promise<any> {
    await this.delay(300);
    const index = this.warehouse.inventory.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Позиция инвентаря не найдена');
    }
    
    const updatedItem = {
      ...this.warehouse.inventory[index],
      ...itemData,
      status: itemData.quantity > itemData.min_quantity ? 'in_stock' : 
              itemData.quantity > 0 ? 'low_stock' : 'out_of_stock'
    };
    this.warehouse.inventory[index] = updatedItem;
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<void> {
    await this.delay(300);
    const index = this.warehouse.inventory.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Позиция инвентаря не найдена');
    }
    this.warehouse.inventory.splice(index, 1);
  }

  async issueFromWarehouse(issueData: any): Promise<any> {
    await this.delay(300);
    const newIssue = {
      id: Math.max(...this.warehouse.issues.map(i => i.id)) + 1,
      ...issueData,
      issued_at: new Date().toISOString()
    };
    this.warehouse.issues.push(newIssue);
    
    // Обновляем количество в инвентаре
    const item = this.warehouse.inventory.find(i => i.id === issueData.inventory_item_id);
    if (item) {
      item.quantity = Math.max(0, item.quantity - issueData.quantity);
      item.status = item.quantity > item.min_quantity ? 'in_stock' : 
                   item.quantity > 0 ? 'low_stock' : 'out_of_stock';
    }
    
    return newIssue;
  }

  async getWarehouseEntries(): Promise<any[]> {
    await this.delay(100);
    return this.warehouse.warehouse_entries;
  }

  async getWarehouseIssues(): Promise<any[]> {
    await this.delay(100);
    return this.warehouse.issues;
  }

  // Справочник инвалидности
  async getDisabilities(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.disabilities;
  }

  // Направления на услуги
  async getServiceDirections(cartId: number): Promise<any[]> {
    await this.delay(100);
    const cart = this.carts.find(c => c.id === cartId);
    return cart?.service_directions || [];
  }

  async addServiceDirection(cartId: number, directionData: any): Promise<any> {
    await this.delay(300);
    const cart = this.carts.find(c => c.id === cartId);
    if (!cart) throw new Error('Карточка не найдена');
    
    const newDirection = {
      id: Math.max(...(cart.service_directions?.map(d => d.id) || [0])) + 1,
      cart_id: cartId,
      ...directionData,
      created_at: new Date().toISOString()
    };
    
    if (!cart.service_directions) cart.service_directions = [];
    cart.service_directions.push(newDirection);
    return newDirection;
  }

  // Направления на реабилитацию
  async getRehabilitationDirections(cartId: number): Promise<any[]> {
    await this.delay(100);
    // В реальной системе это будет отдельная таблица
    return [];
  }

  async addRehabilitationDirection(cartId: number, directionData: any): Promise<any> {
    await this.delay(300);
    const directionNumber = `${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const newDirection = {
      id: Math.floor(Math.random() * 10000),
      cart_id: cartId,
      direction_number: directionNumber,
      ...directionData,
      created_at: new Date().toISOString()
    };
    
    return newDirection;
  }

  // Полуфабрикаты
  async getSemiFinishedProducts(orderId: number): Promise<any[]> {
    await this.delay(100);
    const order = this.orders.find(o => o.id === orderId);
    return order?.semi_finished_products || [];
  }

  async addSemiFinishedProduct(orderId: number, productData: any): Promise<any> {
    await this.delay(300);
    const order = this.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Заказ не найден');
    
    const newProduct = {
      id: Math.max(...(order.semi_finished_products?.map(p => p.id) || [0])) + 1,
      order_id: orderId,
      ...productData
    };
    
    if (!order.semi_finished_products) order.semi_finished_products = [];
    order.semi_finished_products.push(newProduct);
    return newProduct;
  }

  // Готовые ПОИ
  async getReadyPOI(orderId: number): Promise<any> {
    await this.delay(100);
    const order = this.orders.find(o => o.id === orderId);
    return order?.ready_poi || null;
  }

  async updateReadyPOI(orderId: number, poiData: any): Promise<any> {
    await this.delay(300);
    const order = this.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Заказ не найден');
    
    order.ready_poi = {
      id: order.ready_poi?.id || Math.floor(Math.random() * 10000),
      order_id: orderId,
      ...poiData
    };
    
    return order.ready_poi;
  }

  // Справочники для распечатки
  async getPrintTemplates(category?: string): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.print_templates?.filter(t => !category || t.category === category) || [];
  }

  async getSemiFinishedProductTemplates(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.semi_finished_product_templates || [];
  }

  async getShoeTemplates(): Promise<any[]> {
    await this.delay(100);
    return this.dictionaries.shoe_templates || [];
  }
}

export const dataService = new DataService();
export default dataService;
