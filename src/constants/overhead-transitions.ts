// Переходы жизненного цикла накладных

export interface OverheadTransition {
  id: string;
  from: string;
  to: string;
  requiredFields: string[];
  conditions: OverheadCondition[];
  source: string;
  button: string;
  description: string;
}

export interface OverheadCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'exists' | 'not_exists' | 'unique' | 'count';
  value: any;
  message: string;
}

export interface OverheadType {
  id: string;
  code: string;
  name: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
}

// Переходы жизненного цикла накладных
export const OVERHEAD_TRANSITIONS: OverheadTransition[] = [
  {
    id: 'H1',
    from: 'DRAFT',
    to: 'NEW',
    requiredFields: ['number', 'date', 'shop_name', 'type'],
    conditions: [
      {
        field: 'number',
        operator: 'unique',
        value: true,
        message: 'Номер накладной должен быть уникальным'
      },
      {
        field: 'date',
        operator: 'lte',
        value: 'today',
        message: 'Дата накладной не может быть в будущем'
      },
      {
        field: 'shop_name',
        operator: 'exists',
        value: true,
        message: 'Название мастерской обязательно'
      },
      {
        field: 'type',
        operator: 'in',
        value: ['PROSTHESIS', 'SHOES', 'OTTO', 'REPAIR'],
        message: 'Тип накладной должен быть из допустимых значений'
      }
    ],
    source: '/overheads/:type',
    button: 'Создать',
    description: 'Создание новой накладной'
  },
  {
    id: 'H2',
    from: 'NEW',
    to: 'SENT',
    requiredFields: ['overhead_to_order'],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'NEW',
        message: 'Накладная должна быть в статусе NEW'
      },
      {
        field: 'overhead_to_order',
        operator: 'count',
        value: [1, null],
        message: 'Необходима связь минимум с одним заказом'
      },
      {
        field: 'orders_status',
        operator: 'gte',
        value: 'WAREHOUSE',
        message: 'Все заказы должны быть в статусе WAREHOUSE(5) или выше'
      },
      {
        field: 'device_count',
        operator: 'gt',
        value: 0,
        message: 'Количество изделий должно быть больше 0'
      }
    ],
    source: '/overheads/:type',
    button: 'Передать',
    description: 'Передача накладной с заказами'
  },
  {
    id: 'H3',
    from: 'SENT',
    to: 'PROCESSED',
    requiredFields: ['processed_date', 'processed_by'],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'SENT',
        message: 'Накладная должна быть передана'
      },
      {
        field: 'processed_date',
        operator: 'exists',
        value: true,
        message: 'Дата обработки обязательна'
      },
      {
        field: 'processed_by',
        operator: 'exists',
        value: true,
        message: 'Обработавший сотрудник обязателен'
      },
      {
        field: 'document_processed',
        operator: 'eq',
        value: true,
        message: 'Документ должен быть проведен'
      },
      {
        field: 'inventory_updated',
        operator: 'eq',
        value: true,
        message: 'Остатки должны быть обновлены'
      }
    ],
    source: '/overheads/:type',
    button: 'Обработать',
    description: 'Обработка накладной и обновление остатков'
  }
];

// Типы накладных
export const OVERHEAD_TYPES: OverheadType[] = [
  {
    id: 'PROSTHESIS',
    code: 'PROSTHESIS',
    name: 'Протезы',
    description: 'Накладная на протезно-ортопедические изделия',
    requiredFields: ['device_type_id', 'prosthesis_material_id'],
    optionalFields: ['prosthesis_color_id', 'prosthesis_size', 'prosthesis_notes']
  },
  {
    id: 'SHOES',
    code: 'SHOES',
    name: 'Обувь',
    description: 'Накладная на ортопедическую обувь',
    requiredFields: ['shoe_model_id', 'shoe_size', 'heel_material_id'],
    optionalFields: ['shoe_color_id', 'shoe_width', 'shoe_height', 'shoe_notes']
  },
  {
    id: 'OTTO',
    code: 'OTTO',
    name: 'Отто-изделия',
    description: 'Накладная на отто-изделия',
    requiredFields: ['device_type_id', 'otto_model_id'],
    optionalFields: ['otto_color_id', 'otto_size', 'otto_notes']
  },
  {
    id: 'REPAIR',
    code: 'REPAIR',
    name: 'Ремонт',
    description: 'Накладная на ремонт изделий',
    requiredFields: ['original_order_id', 'repair_type_id', 'repair_description'],
    optionalFields: ['repair_cost', 'repair_notes', 'repair_priority']
  }
];

// Функции для работы с переходами
export const getOverheadTransition = (id: string): OverheadTransition | undefined => {
  return OVERHEAD_TRANSITIONS.find(transition => transition.id === id);
};

export const getOverheadTransitionsByFromStatus = (fromStatus: string): OverheadTransition[] => {
  return OVERHEAD_TRANSITIONS.filter(transition => transition.from === fromStatus);
};

export const getOverheadTransitionsByToStatus = (toStatus: string): OverheadTransition[] => {
  return OVERHEAD_TRANSITIONS.filter(transition => transition.to === toStatus);
};

export const getOverheadType = (code: string): OverheadType | undefined => {
  return OVERHEAD_TYPES.find(type => type.code === code);
};

export const getAllOverheadTypes = (): OverheadType[] => {
  return OVERHEAD_TYPES;
};

// Валидация перехода накладной
export const validateOverheadTransition = (
  transitionId: string,
  data: Record<string, any>
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const transition = getOverheadTransition(transitionId);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!transition) {
    errors.push(`Переход ${transitionId} не найден`);
    return { isValid: false, errors, warnings };
  }

  // Проверка обязательных полей
  for (const field of transition.requiredFields) {
    if (!data[field]) {
      errors.push(`Поле ${field} обязательно для перехода ${transition.id}`);
    }
  }

  // Проверка условий
  for (const condition of transition.conditions) {
    const value = data[condition.field];
    let isValid = false;

    switch (condition.operator) {
      case 'eq':
        isValid = value === condition.value;
        break;
      case 'ne':
        isValid = value !== condition.value;
        break;
      case 'gt':
        isValid = value > condition.value;
        break;
      case 'lt':
        isValid = value < condition.value;
        break;
      case 'gte':
        isValid = value >= condition.value;
        break;
      case 'lte':
        isValid = value <= condition.value;
        break;
      case 'in':
        isValid = Array.isArray(condition.value) && condition.value.includes(value);
        break;
      case 'nin':
        isValid = Array.isArray(condition.value) && !condition.value.includes(value);
        break;
      case 'exists':
        isValid = value !== null && value !== undefined && value !== '';
        break;
      case 'not_exists':
        isValid = value === null || value === undefined || value === '';
        break;
      case 'unique':
        // В реальной системе здесь будет проверка уникальности в БД
        isValid = true; // Заглушка
        break;
      case 'count':
        if (Array.isArray(condition.value)) {
          const [min, max] = condition.value;
          const count = Array.isArray(value) ? value.length : 0;
          isValid = count >= min && (max === null || count <= max);
        }
        break;
    }

    if (!isValid) {
      errors.push(condition.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Валидация типа накладной
export const validateOverheadType = (
  typeCode: string,
  data: Record<string, any>
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const overheadType = getOverheadType(typeCode);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!overheadType) {
    errors.push(`Тип накладной ${typeCode} не найден`);
    return { isValid: false, errors, warnings };
  }

  // Проверка обязательных полей
  for (const field of overheadType.requiredFields) {
    if (!data[field]) {
      errors.push(`Поле ${field} обязательно для типа накладной ${overheadType.name}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Получение доступных переходов
export const getAvailableOverheadTransitions = (
  currentStatus: string,
  data: Record<string, any>
): OverheadTransition[] => {
  return OVERHEAD_TRANSITIONS
    .filter(transition => transition.from === currentStatus)
    .filter(transition => {
      const result = validateOverheadTransition(transition.id, data);
      return result.isValid;
    });
};

// Получение недоступных переходов с причинами
export const getUnavailableOverheadTransitions = (
  currentStatus: string,
  data: Record<string, any>
): Array<{ transition: OverheadTransition; reason: string }> => {
  return OVERHEAD_TRANSITIONS
    .filter(transition => transition.from === currentStatus)
    .map(transition => {
      const result = validateOverheadTransition(transition.id, data);
      return {
        transition,
        reason: result.errors.join('; ')
      };
    })
    .filter(item => item.reason);
};
