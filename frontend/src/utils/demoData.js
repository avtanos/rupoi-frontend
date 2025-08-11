// Демонстрационные данные для АИС ЕССО

// Демо данные для личных дел
export const demoPersonalFiles = [
  {
    id: 1,
    file_number: '2025-0001',
    pin: '1234567890123',
    last_name: 'Иванов',
    first_name: 'Иван',
    middle_name: 'Иванович',
    birth_date: '1980-03-12',
    disability_group: '2',
    ipra_number: 'ИПРА №45 от 01.02.2025',
    phone: '+7 (701) 123-45-67',
    address: 'г. Алматы, ул. Абая, д. 123, кв. 45',
    is_active: true,
    last_order: 'Протез бедра — в работе',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-08-08T10:12:00Z'
  },
  {
    id: 2,
    file_number: '2025-0002',
    pin: '2345678901234',
    last_name: 'Петрова',
    first_name: 'Айжан',
    middle_name: 'Калиевна',
    birth_date: '1992-11-05',
    disability_group: 'child',
    ipra_number: 'ИПРА №12 от 15.01.2025',
    phone: '+7 (702) 234-56-78',
    address: 'г. Алматы, ул. Толе би, д. 67, кв. 12',
    is_active: true,
    last_order: 'Ортопедическая обувь — выдано',
    created_at: '2025-01-20T14:15:00Z',
    updated_at: '2025-08-07T16:40:00Z'
  },
  {
    id: 3,
    file_number: '2025-0003',
    pin: '3456789012345',
    last_name: 'Сидоров',
    first_name: 'Петр',
    middle_name: 'Сергеевич',
    birth_date: '1975-07-22',
    disability_group: '1',
    ipra_number: 'ИПРА №78 от 10.03.2025',
    phone: '+7 (703) 345-67-89',
    address: 'г. Алматы, ул. Фурманова, д. 89, кв. 34',
    is_active: true,
    last_order: 'Инвалидная коляска — заказано',
    created_at: '2025-02-05T09:45:00Z',
    updated_at: '2025-08-06T11:20:00Z'
  },
  {
    id: 4,
    file_number: '2025-0004',
    pin: '4567890123456',
    last_name: 'Козлова',
    first_name: 'Мария',
    middle_name: 'Александровна',
    birth_date: '1988-12-03',
    disability_group: '3',
    ipra_number: 'ИПРА №23 от 20.01.2025',
    phone: '+7 (704) 456-78-90',
    address: 'г. Алматы, ул. Саина, д. 45, кв. 78',
    is_active: false,
    last_order: 'Трость — выдано',
    created_at: '2025-01-25T16:30:00Z',
    updated_at: '2025-07-15T13:45:00Z'
  },
  {
    id: 5,
    file_number: '2025-0005',
    pin: '5678901234567',
    last_name: 'Нурланов',
    first_name: 'Алихан',
    middle_name: 'Болатович',
    birth_date: '1990-05-18',
    disability_group: '2',
    ipra_number: 'ИПРА №56 от 05.02.2025',
    phone: '+7 (705) 567-89-01',
    address: 'г. Алматы, ул. Розыбакиева, д. 12, кв. 56',
    is_active: true,
    last_order: 'Протез руки — в производстве',
    created_at: '2025-02-10T12:00:00Z',
    updated_at: '2025-08-05T15:30:00Z'
  }
]

// Демо данные для заказов
export const demoOrders = [
  {
    id: 1,
    order_number: 'ORD-2025-001',
    personal_file: 1,
    patient_name: 'Иванов Иван Иванович',
    order_type: 'prosthesis',
    product_name: 'Протез бедра',
    status: 'in_production',
    priority: 'normal',
    created_at: '2025-08-01T09:00:00Z',
    updated_at: '2025-08-08T10:12:00Z',
    estimated_completion: '2025-08-15',
    notes: 'Срочный заказ для реабилитации'
  },
  {
    id: 2,
    order_number: 'ORD-2025-002',
    personal_file: 2,
    patient_name: 'Петрова Айжан Калиевна',
    order_type: 'orthopedic_shoes',
    product_name: 'Ортопедическая обувь',
    status: 'completed',
    priority: 'high',
    created_at: '2025-07-25T14:30:00Z',
    updated_at: '2025-08-07T16:40:00Z',
    estimated_completion: '2025-08-05',
    notes: 'Детская ортопедическая обувь'
  },
  {
    id: 3,
    order_number: 'ORD-2025-003',
    personal_file: 3,
    patient_name: 'Сидоров Петр Сергеевич',
    order_type: 'wheelchair',
    product_name: 'Инвалидная коляска',
    status: 'ordered',
    priority: 'normal',
    created_at: '2025-08-06T11:20:00Z',
    updated_at: '2025-08-06T11:20:00Z',
    estimated_completion: '2025-08-20',
    notes: 'Электрическая коляска'
  },
  {
    id: 4,
    order_number: 'ORD-2025-004',
    personal_file: 5,
    patient_name: 'Нурланов Алихан Болатович',
    order_type: 'prosthesis',
    product_name: 'Протез руки',
    status: 'in_production',
    priority: 'high',
    created_at: '2025-08-05T15:30:00Z',
    updated_at: '2025-08-05T15:30:00Z',
    estimated_completion: '2025-08-12',
    notes: 'Бионический протез'
  }
]

// Демо данные для накладных
export const demoInvoices = [
  {
    id: 1,
    invoice_number: 'INV-2025-001',
    order_number: 'ORD-2025-002',
    patient_name: 'Петрова Айжан Калиевна',
    product_name: 'Ортопедическая обувь',
    quantity: 1,
    status: 'issued',
    issued_at: '2025-08-07T16:40:00Z',
    issued_by: 'Кладовщик Демо',
    notes: 'Выдано пациенту'
  },
  {
    id: 2,
    invoice_number: 'INV-2025-002',
    order_number: 'ORD-2025-004',
    patient_name: 'Нурланов Алихан Болатович',
    product_name: 'Протез руки',
    quantity: 1,
    status: 'pending',
    issued_at: null,
    issued_by: null,
    notes: 'Ожидает готовности'
  }
]

// Демо данные для склада
export const demoWarehouse = [
  {
    id: 1,
    product_name: 'Ортопедическая обувь',
    category: 'shoes',
    quantity: 25,
    min_quantity: 5,
    location: 'Стеллаж A-1',
    last_updated: '2025-08-07T16:40:00Z'
  },
  {
    id: 2,
    product_name: 'Трости',
    category: 'mobility_aids',
    quantity: 15,
    min_quantity: 3,
    location: 'Стеллаж B-2',
    last_updated: '2025-08-06T14:20:00Z'
  },
  {
    id: 3,
    product_name: 'Инвалидные коляски',
    category: 'wheelchairs',
    quantity: 8,
    min_quantity: 2,
    location: 'Стеллаж C-3',
    last_updated: '2025-08-05T11:15:00Z'
  },
  {
    id: 4,
    product_name: 'Протезы бедра',
    category: 'prostheses',
    quantity: 3,
    min_quantity: 1,
    location: 'Стеллаж D-4',
    last_updated: '2025-08-04T09:30:00Z'
  }
]

// Демо данные для отчетов
export const demoReports = {
  personal_files: {
    total: 126,
    active: 102,
    closed: 24,
    urgent: 8,
    weekly_change: {
      total: 5,
      active: 3,
      closed: 2,
      urgent: 0
    }
  },
  orders: {
    total: 45,
    in_production: 12,
    completed: 28,
    pending: 5,
    weekly_change: {
      total: 8,
      in_production: 3,
      completed: 4,
      pending: 1
    }
  },
  warehouse: {
    total_items: 51,
    low_stock: 3,
    out_of_stock: 0,
    weekly_issues: 12
  }
}

// Демо данные для администрирования
export const demoAdminData = {
  users: [
    {
      id: 1,
      username: 'admin_demo',
      first_name: 'Администратор',
      last_name: 'Демо',
      role: 'admin',
      is_active: true,
      last_login: '2025-08-08T10:00:00Z'
    },
    {
      id: 2,
      username: 'registry_demo',
      first_name: 'Регистратор',
      last_name: 'Демо',
      role: 'registry',
      is_active: true,
      last_login: '2025-08-07T16:30:00Z'
    },
    {
      id: 3,
      username: 'medical_demo',
      first_name: 'Врач',
      last_name: 'Демо',
      role: 'medical',
      is_active: true,
      last_login: '2025-08-07T14:20:00Z'
    },
    {
      id: 4,
      username: 'workshop_demo',
      first_name: 'Мастер',
      last_name: 'Демо',
      role: 'workshop',
      is_active: true,
      last_login: '2025-08-06T12:15:00Z'
    },
    {
      id: 5,
      username: 'warehouse_demo',
      first_name: 'Кладовщик',
      last_name: 'Демо',
      role: 'warehouse',
      is_active: true,
      last_login: '2025-08-06T09:45:00Z'
    }
  ],
  system_stats: {
    total_users: 15,
    active_sessions: 8,
    system_uptime: '99.8%',
    last_backup: '2025-08-07T23:00:00Z'
  },
  logs: [
    {
      id: 1,
      level: 'info',
      timestamp: '2025-08-08T10:00:00Z',
      source: 'auth',
      message: 'Пользователь admin_demo вошел в систему'
    },
    {
      id: 2,
      level: 'info',
      timestamp: '2025-08-08T09:45:00Z',
      source: 'personal_files',
      message: 'Создано новое личное дело №2025-0006'
    },
    {
      id: 3,
      level: 'warning',
      timestamp: '2025-08-08T09:30:00Z',
      source: 'warehouse',
      message: 'Низкий запас: Протезы бедра (3 шт.)'
    },
    {
      id: 4,
      level: 'info',
      timestamp: '2025-08-08T09:15:00Z',
      source: 'orders',
      message: 'Заказ ORD-2025-002 переведен в статус "Завершён"'
    },
    {
      id: 5,
      level: 'error',
      timestamp: '2025-08-08T09:00:00Z',
      source: 'system',
      message: 'Ошибка подключения к базе данных'
    },
    {
      id: 6,
      level: 'info',
      timestamp: '2025-08-08T08:45:00Z',
      source: 'backup',
      message: 'Резервная копия создана успешно'
    },
    {
      id: 7,
      level: 'info',
      timestamp: '2025-08-08T08:30:00Z',
      source: 'auth',
      message: 'Пользователь registry_demo вышел из системы'
    },
    {
      id: 8,
      level: 'warning',
      timestamp: '2025-08-08T08:15:00Z',
      source: 'system',
      message: 'Высокая нагрузка на сервер (85% CPU)'
    },
    {
      id: 9,
      level: 'info',
      timestamp: '2025-08-08T08:00:00Z',
      source: 'invoices',
      message: 'Накладная INV-2025-001 выдана пациенту'
    },
    {
      id: 10,
      level: 'debug',
      timestamp: '2025-08-08T07:45:00Z',
      source: 'api',
      message: 'API запрос: GET /personal-files/ (200 OK)'
    }
  ]
}

// Функции для работы с демо данными
export const demoApi = {
  // Личные дела
  getPersonalFiles: (params = {}) => {
    let files = [...demoPersonalFiles]
    
    if (params.search) {
      const search = params.search.toLowerCase()
      files = files.filter(file => 
        file.file_number.toLowerCase().includes(search) ||
        file.pin.includes(search) ||
        `${file.last_name} ${file.first_name} ${file.middle_name || ''}`.toLowerCase().includes(search)
      )
    }
    
    if (params.disability_group) {
      files = files.filter(file => file.disability_group === params.disability_group)
    }
    
    if (params.is_active !== undefined) {
      files = files.filter(file => file.is_active === params.is_active)
    }
    
    return Promise.resolve({
      data: files,
      count: files.length
    })
  },

  getPersonalFile: (id) => {
    const file = demoPersonalFiles.find(f => f.id === parseInt(id))
    return Promise.resolve({ data: file })
  },

  createPersonalFile: (data) => {
    const newFile = {
      id: demoPersonalFiles.length + 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    demoPersonalFiles.push(newFile)
    return Promise.resolve({ data: newFile })
  },

  updatePersonalFile: (id, data) => {
    const index = demoPersonalFiles.findIndex(f => f.id === parseInt(id))
    if (index !== -1) {
      demoPersonalFiles[index] = {
        ...demoPersonalFiles[index],
        ...data,
        updated_at: new Date().toISOString()
      }
      return Promise.resolve({ data: demoPersonalFiles[index] })
    }
    return Promise.reject(new Error('Файл не найден'))
  },

  deletePersonalFile: (id) => {
    const index = demoPersonalFiles.findIndex(f => f.id === parseInt(id))
    if (index !== -1) {
      demoPersonalFiles.splice(index, 1)
      return Promise.resolve({ success: true })
    }
    return Promise.reject(new Error('Файл не найден'))
  },

  getPersonalFilesStats: () => {
    const stats = demoReports.personal_files
    return Promise.resolve({ data: stats })
  },

  // Заказы
  getOrders: () => {
    return Promise.resolve({ data: demoOrders })
  },

  // Накладные
  getInvoices: () => {
    return Promise.resolve({ data: demoInvoices })
  },

  // Склад
  getWarehouse: () => {
    return Promise.resolve({ data: demoWarehouse })
  },

  // Отчеты
  getReports: () => {
    return Promise.resolve({ data: demoReports })
  },

  // Администрирование
  getAdminData: () => {
    return Promise.resolve({ data: demoAdminData })
  }
}
