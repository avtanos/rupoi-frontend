// SQL-шаблоны для выборок данных по жизненному циклу РУПОИ

export interface SQLTemplate {
  id: string;
  name: string;
  description: string;
  sql: string;
  parameters: SQLParameter[];
  entityType: 'cart' | 'order' | 'overhead';
}

export interface SQLParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  description: string;
  defaultValue?: any;
}

// Шаблоны для карточек пациентов
export const CART_SQL_TEMPLATES: SQLTemplate[] = [
  {
    id: 'CART_ACTIVE',
    name: 'Активные карточки пациентов',
    description: 'Выборка всех активных карточек пациентов',
    sql: `
      SELECT 
        c.id,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.birth_date,
        c.phone_number,
        c.status,
        c.created_at,
        c.updated_at,
        o.name as oblast_name,
        r.name as raion_name,
        l.name as locality_name
      FROM carts c
      LEFT JOIN oblasts o ON c.registration_oblast_id = o.id
      LEFT JOIN raions r ON c.registration_raion_id = r.id
      LEFT JOIN localities l ON c.registration_locality_id = l.id
      WHERE c.status = 'ACTIVE'
      ORDER BY c.created_at DESC
    `,
    parameters: [],
    entityType: 'cart'
  },
  {
    id: 'CART_ARCHIVED',
    name: 'Архивные карточки пациентов',
    description: 'Выборка всех архивных карточек пациентов',
    sql: `
      SELECT 
        c.id,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.birth_date,
        c.phone_number,
        c.status,
        c.deregistration_date,
        c.deregistration_reason,
        c.created_at,
        c.updated_at,
        o.name as oblast_name,
        r.name as raion_name,
        l.name as locality_name
      FROM carts c
      LEFT JOIN oblasts o ON c.registration_oblast_id = o.id
      LEFT JOIN raions r ON c.registration_raion_id = r.id
      LEFT JOIN localities l ON c.registration_locality_id = l.id
      WHERE c.status = 'ARCHIVED'
      ORDER BY c.deregistration_date DESC
    `,
    parameters: [],
    entityType: 'cart'
  },
  {
    id: 'CART_REFERRED_MED',
    name: 'Карточки направленные в медотдел',
    description: 'Выборка карточек направленных в медицинский отдел',
    sql: `
      SELECT 
        c.id,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.birth_date,
        c.phone_number,
        c.status,
        c.medical_department_direct_date,
        sd.service_type,
        sd.direction_number,
        o.name as oblast_name,
        r.name as raion_name,
        l.name as locality_name
      FROM carts c
      LEFT JOIN service_directions sd ON c.id = sd.cart_id
      LEFT JOIN oblasts o ON c.registration_oblast_id = o.id
      LEFT JOIN raions r ON c.registration_raion_id = r.id
      LEFT JOIN localities l ON c.registration_locality_id = l.id
      WHERE c.status = 'REFERRED_MED'
      ORDER BY c.medical_department_direct_date DESC
    `,
    parameters: [],
    entityType: 'cart'
  },
  {
    id: 'CART_BY_DISABILITY_GROUP',
    name: 'Карточки по группе инвалидности',
    description: 'Выборка карточек по группе инвалидности',
    sql: `
      SELECT 
        c.id,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.birth_date,
        c.phone_number,
        c.lovz_group,
        c.disability_from_date,
        c.status,
        o.name as oblast_name,
        r.name as raion_name,
        l.name as locality_name
      FROM carts c
      LEFT JOIN oblasts o ON c.registration_oblast_id = o.id
      LEFT JOIN raions r ON c.registration_raion_id = r.id
      LEFT JOIN localities l ON c.registration_locality_id = l.id
      WHERE c.status = 'ACTIVE' 
        AND c.lovz_group = :disability_group
      ORDER BY c.created_at DESC
    `,
    parameters: [
      {
        name: 'disability_group',
        type: 'string',
        required: true,
        description: 'Группа инвалидности (GROUP_I, GROUP_II, GROUP_III)'
      }
    ],
    entityType: 'cart'
  },
  {
    id: 'CART_BY_AGE_RANGE',
    name: 'Карточки по возрастному диапазону',
    description: 'Выборка карточек по возрастному диапазону',
    sql: `
      SELECT 
        c.id,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.birth_date,
        c.phone_number,
        c.status,
        EXTRACT(YEAR FROM AGE(c.birth_date)) as age,
        o.name as oblast_name,
        r.name as raion_name,
        l.name as locality_name
      FROM carts c
      LEFT JOIN oblasts o ON c.registration_oblast_id = o.id
      LEFT JOIN raions r ON c.registration_raion_id = r.id
      LEFT JOIN localities l ON c.registration_locality_id = l.id
      WHERE c.status = 'ACTIVE' 
        AND EXTRACT(YEAR FROM AGE(c.birth_date)) BETWEEN :min_age AND :max_age
      ORDER BY c.birth_date DESC
    `,
    parameters: [
      {
        name: 'min_age',
        type: 'number',
        required: true,
        description: 'Минимальный возраст'
      },
      {
        name: 'max_age',
        type: 'number',
        required: true,
        description: 'Максимальный возраст'
      }
    ],
    entityType: 'cart'
  }
];

// Шаблоны для заказов
export const ORDER_SQL_TEMPLATES: SQLTemplate[] = [
  {
    id: 'ORDER_BY_STATUS',
    name: 'Заказы по статусу',
    description: 'Выборка заказов по статусу',
    sql: `
      SELECT 
        o.id,
        o.number,
        o.create_date,
        o.order_type,
        o.status,
        o.is_urgent,
        o.urgent_reason,
        o.cost,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.phone_number,
        dt.name as device_type_name,
        diag.name as diagnosis_name
      FROM orders o
      LEFT JOIN carts c ON o.cart_id = c.id
      LEFT JOIN device_types dt ON o.device_type_r_id = dt.id
      LEFT JOIN diagnosis_types diag ON o.diagnosis_type_id = diag.id
      WHERE o.status = :status
      ORDER BY o.create_date DESC
    `,
    parameters: [
      {
        name: 'status',
        type: 'string',
        required: true,
        description: 'Статус заказа (NEW, V_PROIZV, NA_PRIMERKE, etc.)'
      }
    ],
    entityType: 'order'
  },
  {
    id: 'ORDER_URGENT',
    name: 'Срочные заказы',
    description: 'Выборка всех срочных заказов',
    sql: `
      SELECT 
        o.id,
        o.number,
        o.create_date,
        o.order_type,
        o.status,
        o.is_urgent,
        o.urgent_reason,
        o.cost,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.phone_number,
        dt.name as device_type_name,
        diag.name as diagnosis_name
      FROM orders o
      LEFT JOIN carts c ON o.cart_id = c.id
      LEFT JOIN device_types dt ON o.device_type_r_id = dt.id
      LEFT JOIN diagnosis_types diag ON o.diagnosis_type_id = diag.id
      WHERE o.is_urgent = true
      ORDER BY o.create_date ASC
    `,
    parameters: [],
    entityType: 'order'
  },
  {
    id: 'ORDER_BY_TYPE',
    name: 'Заказы по типу',
    description: 'Выборка заказов по типу услуги',
    sql: `
      SELECT 
        o.id,
        o.number,
        o.create_date,
        o.order_type,
        o.status,
        o.is_urgent,
        o.cost,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.phone_number,
        dt.name as device_type_name,
        diag.name as diagnosis_name
      FROM orders o
      LEFT JOIN carts c ON o.cart_id = c.id
      LEFT JOIN device_types dt ON o.device_type_r_id = dt.id
      LEFT JOIN diagnosis_types diag ON o.diagnosis_type_id = diag.id
      WHERE o.order_type = :order_type
      ORDER BY o.create_date DESC
    `,
    parameters: [
      {
        name: 'order_type',
        type: 'string',
        required: true,
        description: 'Тип заказа (PROSTHESIS, SHOES, OTTO, REPAIR)'
      }
    ],
    entityType: 'order'
  },
  {
    id: 'ORDER_IN_PROGRESS',
    name: 'Заказы в производстве',
    description: 'Выборка заказов в производстве с назначенными сотрудниками',
    sql: `
      SELECT 
        o.id,
        o.number,
        o.create_date,
        o.order_type,
        o.status,
        o.cost,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.phone_number,
        w.name as workshop_name,
        e.first_name as employee_first_name,
        e.last_name as employee_last_name,
        pd.planned_start_date,
        pd.planned_end_date,
        pd.actual_start_date
      FROM orders o
      LEFT JOIN carts c ON o.cart_id = c.id
      LEFT JOIN production_data pd ON o.id = pd.order_id
      LEFT JOIN workshops w ON pd.assigned_workshop_id = w.id
      LEFT JOIN employee_orders eo ON o.id = eo.order_id
      LEFT JOIN employees e ON eo.employee_id = e.id
      WHERE o.status = 'V_PROIZV'
      ORDER BY pd.planned_start_date ASC
    `,
    parameters: [],
    entityType: 'order'
  },
  {
    id: 'ORDER_READY_FOR_ISSUE',
    name: 'Заказы готовые к выдаче',
    description: 'Выборка заказов готовых к выдаче',
    sql: `
      SELECT 
        o.id,
        o.number,
        o.create_date,
        o.order_type,
        o.status,
        o.cost,
        o.ready_date,
        c.card_number,
        c.first_name,
        c.name,
        c.parent_name,
        c.phone_number,
        dt.name as device_type_name,
        diag.name as diagnosis_name
      FROM orders o
      LEFT JOIN carts c ON o.cart_id = c.id
      LEFT JOIN device_types dt ON o.device_type_r_id = dt.id
      LEFT JOIN diagnosis_types diag ON o.diagnosis_type_id = diag.id
      WHERE o.status = 'NA_SKLADE'
      ORDER BY o.ready_date ASC
    `,
    parameters: [],
    entityType: 'order'
  }
];

// Шаблоны для накладных
export const OVERHEAD_SQL_TEMPLATES: SQLTemplate[] = [
  {
    id: 'OVERHEAD_BY_STATUS',
    name: 'Накладные по статусу',
    description: 'Выборка накладных по статусу',
    sql: `
      SELECT 
        oh.id,
        oh.number,
        oh.date,
        oh.status,
        oh.shop_name,
        oh.device_count,
        oh.created_at,
        oh.updated_at,
        w.name as workshop_name,
        e.first_name as created_by_first_name,
        e.last_name as created_by_last_name
      FROM overheads oh
      LEFT JOIN workshops w ON oh.workshop_id = w.id
      LEFT JOIN employees e ON oh.created_by = e.id
      WHERE oh.status = :status
      ORDER BY oh.date DESC
    `,
    parameters: [
      {
        name: 'status',
        type: 'string',
        required: true,
        description: 'Статус накладной (NEW, SENT, PROCESSED)'
      }
    ],
    entityType: 'overhead'
  },
  {
    id: 'OVERHEAD_PENDING',
    name: 'Накладные ожидающие обработки',
    description: 'Выборка накладных ожидающих обработки',
    sql: `
      SELECT 
        oh.id,
        oh.number,
        oh.date,
        oh.status,
        oh.shop_name,
        oh.device_count,
        oh.created_at,
        w.name as workshop_name,
        e.first_name as created_by_first_name,
        e.last_name as created_by_last_name
      FROM overheads oh
      LEFT JOIN workshops w ON oh.workshop_id = w.id
      LEFT JOIN employees e ON oh.created_by = e.id
      WHERE oh.status = 'SENT'
      ORDER BY oh.date ASC
    `,
    parameters: [],
    entityType: 'overhead'
  }
];

// Объединенные шаблоны
export const ALL_SQL_TEMPLATES: SQLTemplate[] = [
  ...CART_SQL_TEMPLATES,
  ...ORDER_SQL_TEMPLATES,
  ...OVERHEAD_SQL_TEMPLATES
];

// Функции для работы с шаблонами
export const getTemplateById = (id: string): SQLTemplate | undefined => {
  return ALL_SQL_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByEntityType = (entityType: 'cart' | 'order' | 'overhead'): SQLTemplate[] => {
  return ALL_SQL_TEMPLATES.filter(template => template.entityType === entityType);
};

export const buildSQL = (template: SQLTemplate, parameters: Record<string, any>): string => {
  let sql = template.sql;
  
  // Замена параметров в SQL
  for (const [key, value] of Object.entries(parameters)) {
    const placeholder = `:${key}`;
    const replacement = typeof value === 'string' ? `'${value}'` : value;
    sql = sql.replace(new RegExp(placeholder, 'g'), replacement);
  }
  
  return sql;
};

export const validateParameters = (template: SQLTemplate, parameters: Record<string, any>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  for (const param of template.parameters) {
    if (param.required && !(param.name in parameters)) {
      errors.push(`Параметр '${param.name}' обязателен`);
    }
    
    if (param.name in parameters) {
      const value = parameters[param.name];
      const valueType = typeof value;
      
      if (param.type === 'number' && valueType !== 'number') {
        errors.push(`Параметр '${param.name}' должен быть числом`);
      } else if (param.type === 'string' && valueType !== 'string') {
        errors.push(`Параметр '${param.name}' должен быть строкой`);
      } else if (param.type === 'boolean' && valueType !== 'boolean') {
        errors.push(`Параметр '${param.name}' должен быть булевым значением`);
      } else if (param.type === 'date' && !(value instanceof Date) && typeof value !== 'string') {
        errors.push(`Параметр '${param.name}' должен быть датой`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
