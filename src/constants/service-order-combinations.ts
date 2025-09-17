// Допустимые комбинации при создании услуг/заказов

export interface ServiceCombination {
  id: string;
  serviceType: string;
  diagnosisType: string;
  side: string;
  requiredFields: string[];
  optionalFields: string[];
  description: string;
  note: string;
}

export interface OrderTransition {
  id: string;
  from: string;
  to: string;
  requiredFields: string[];
  conditions: OrderCondition[];
  source: string;
  button: string;
  description: string;
}

export interface OrderCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'exists' | 'not_exists' | 'range';
  value: any;
  message: string;
}

// Допустимые комбинации при создании услуг
export const SERVICE_COMBINATIONS: ServiceCombination[] = [
  {
    id: 'S1',
    serviceType: 'PROSTHESIS',
    diagnosisType: 'ампутационные (МКБ S78., Z89.)',
    side: 'LEFT/RIGHT/BOTH',
    requiredFields: ['device_type_l_id', 'device_type_r_id'],
    optionalFields: ['prosthesis_material_id', 'prosthesis_color_id', 'prosthesis_size'],
    description: 'Протезы для ампутационных случаев',
    note: 'device_type_l_id/device_type_r_id обязательны по сторонам'
  },
  {
    id: 'S2',
    serviceType: 'SHOES',
    diagnosisType: 'ортопедич. патологии стопы (Q66., M21.)',
    side: 'LEFT/RIGHT/BOTH',
    requiredFields: ['shoe_model_id', 'shoe_color_id', 'heel_material_id', 'size_of_shortening'],
    optionalFields: ['shoe_size', 'shoe_width', 'shoe_height'],
    description: 'Ортопедическая обувь',
    note: 'Обязательны модель, цвет, материал каблука, размер укорочения'
  },
  {
    id: 'S3',
    serviceType: 'OTTO',
    diagnosisType: 'согласно каталогу',
    side: '—',
    requiredFields: ['device_type_id'],
    optionalFields: ['otto_model_id', 'otto_color_id', 'otto_size'],
    description: 'Отто-изделия по каталогу',
    note: 'Привязка к номенклатуре device_type'
  },
  {
    id: 'S4',
    serviceType: 'REPAIR',
    diagnosisType: 'любой предыдущий заказ/изделие',
    side: '—',
    requiredFields: ['original_order_id', 'repair_type_id'],
    optionalFields: ['repair_description', 'repair_cost'],
    description: 'Ремонт существующих изделий',
    note: 'Ссылка на исходный заказ обязательна'
  }
];

// Переходы статусов заказа
export const ORDER_TRANSITIONS: OrderTransition[] = [
  {
    id: 'O1',
    from: 'DRAFT',
    to: 'NEW',
    requiredFields: ['service_type', 'urgency'],
    conditions: [
      {
        field: 'quantity',
        operator: 'range',
        value: [1, 10],
        message: 'Количество должно быть от 1 до 10'
      },
      {
        field: 'urgency',
        operator: 'eq',
        value: 'URGENT',
        message: 'При срочности URGENT необходимо указать urgent_reason'
      },
      {
        field: 'service_type',
        operator: 'eq',
        value: 'PROSTHESIS',
        message: 'Для протезов обязательны device_type_l_id или device_type_r_id'
      }
    ],
    source: '/order/add',
    button: 'Сохранить',
    description: 'Создание нового заказа'
  },
  {
    id: 'O2',
    from: 'NEW',
    to: 'ON_APPROVAL',
    requiredFields: ['primary_diagnosis_id'],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'NEW',
        message: 'Заказ должен быть в статусе NEW'
      },
      {
        field: 'primary_diagnosis_id',
        operator: 'exists',
        value: true,
        message: 'Основной диагноз обязателен'
      },
      {
        field: 'medical_indicators',
        operator: 'exists',
        value: true,
        message: 'Медицинские показания должны быть приложены'
      }
    ],
    source: '/order/info/:id',
    button: 'На утверждение',
    description: 'Направление на медицинское утверждение'
  },
  {
    id: 'O3',
    from: 'ON_APPROVAL',
    to: 'IN_PRODUCTION',
    requiredFields: ['medical_approval_decision'],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'ON_APPROVAL',
        message: 'Заказ должен быть на утверждении'
      },
      {
        field: 'medical_approval_decision',
        operator: 'eq',
        value: 'APPROVED',
        message: 'Решение медработника должно быть "Утвердить"'
      },
      {
        field: 'medical_approval_date',
        operator: 'exists',
        value: true,
        message: 'Дата утверждения обязательна'
      }
    ],
    source: '/order/listApprove/:type',
    button: 'Утвердить',
    description: 'Утверждение заказа медицинским работником'
  },
  {
    id: 'O4',
    from: 'ON_APPROVAL',
    to: 'NEW',
    requiredFields: ['rejection_reason'],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'ON_APPROVAL',
        message: 'Заказ должен быть на утверждении'
      },
      {
        field: 'rejection_reason',
        operator: 'exists',
        value: true,
        message: 'Причина отказа обязательна'
      },
      {
        field: 'rejection_date',
        operator: 'exists',
        value: true,
        message: 'Дата отказа обязательна'
      }
    ],
    source: '/order/listApprove/:type',
    button: 'Отклонить',
    description: 'Отклонение заказа медицинским работником'
  },
  {
    id: 'O5',
    from: 'IN_PRODUCTION',
    to: 'FITTING',
    requiredFields: ['order_measurements'],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'IN_PRODUCTION',
        message: 'Заказ должен быть в производстве'
      },
      {
        field: 'order_measurements',
        operator: 'exists',
        value: true,
        message: 'Необходимо минимум одно измерение'
      },
      {
        field: 'measurements_completed',
        operator: 'eq',
        value: true,
        message: 'Измерения должны быть завершены'
      }
    ],
    source: '/order/info/:id',
    button: 'На примерку',
    description: 'Отправка на примерку после завершения измерений'
  },
  {
    id: 'O6',
    from: 'FITTING',
    to: 'WAREHOUSE',
    requiredFields: ['fitting_act'],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'FITTING',
        message: 'Заказ должен быть на примерке'
      },
      {
        field: 'fitting_act',
        operator: 'exists',
        value: true,
        message: 'Акт примерки обязателен'
      },
      {
        field: 'fitting_completed',
        operator: 'eq',
        value: true,
        message: 'Примерка должна быть завершена'
      },
      {
        field: 'product_ready',
        operator: 'eq',
        value: true,
        message: 'Изделие должно быть готово'
      }
    ],
    source: '/order/info/:id',
    button: 'Передать на склад',
    description: 'Передача готового изделия на склад'
  },
  {
    id: 'O7',
    from: 'WAREHOUSE',
    to: 'ISSUED',
    requiredFields: ['overhead_id'],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'WAREHOUSE',
        message: 'Заказ должен быть на складе'
      },
      {
        field: 'overhead_id',
        operator: 'exists',
        value: true,
        message: 'Накладная должна быть связана'
      },
      {
        field: 'overhead_processed',
        operator: 'eq',
        value: true,
        message: 'Накладная должна быть проведена'
      },
      {
        field: 'issue_date',
        operator: 'exists',
        value: true,
        message: 'Дата выдачи обязательна'
      }
    ],
    source: '/order/listwarehouse/:type',
    button: 'Выдать',
    description: 'Выдача изделия пациенту'
  }
];

// Функции для работы с комбинациями
export const getServiceCombination = (serviceType: string, diagnosisType: string): ServiceCombination | undefined => {
  return SERVICE_COMBINATIONS.find(combo => 
    combo.serviceType === serviceType && 
    combo.diagnosisType.includes(diagnosisType)
  );
};

export const getServiceCombinationsByType = (serviceType: string): ServiceCombination[] => {
  return SERVICE_COMBINATIONS.filter(combo => combo.serviceType === serviceType);
};

export const getOrderTransition = (id: string): OrderTransition | undefined => {
  return ORDER_TRANSITIONS.find(transition => transition.id === id);
};

export const getOrderTransitionsByFromStatus = (fromStatus: string): OrderTransition[] => {
  return ORDER_TRANSITIONS.filter(transition => transition.from === fromStatus);
};

export const getOrderTransitionsByToStatus = (toStatus: string): OrderTransition[] => {
  return ORDER_TRANSITIONS.filter(transition => transition.to === toStatus);
};

// Валидация комбинаций
export const validateServiceCombination = (
  serviceType: string, 
  diagnosisType: string, 
  data: Record<string, any>
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const combination = getServiceCombination(serviceType, diagnosisType);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!combination) {
    errors.push(`Комбинация ${serviceType} + ${diagnosisType} недопустима`);
    return { isValid: false, errors, warnings };
  }

  // Проверка обязательных полей
  for (const field of combination.requiredFields) {
    if (!data[field]) {
      errors.push(`Поле ${field} обязательно для комбинации ${combination.id}`);
    }
  }

  // Проверка специфичных условий
  if (serviceType === 'PROSTHESIS') {
    if (data.side === 'LEFT' && !data.device_type_l_id) {
      errors.push('Для левой стороны обязателен device_type_l_id');
    }
    if (data.side === 'RIGHT' && !data.device_type_r_id) {
      errors.push('Для правой стороны обязателен device_type_r_id');
    }
    if (data.side === 'BOTH' && (!data.device_type_l_id || !data.device_type_r_id)) {
      errors.push('Для обеих сторон обязательны device_type_l_id и device_type_r_id');
    }
  }

  if (serviceType === 'REPAIR') {
    if (!data.original_order_id) {
      errors.push('Для ремонта обязательна ссылка на исходный заказ');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Валидация перехода заказа
export const validateOrderTransition = (
  transitionId: string,
  data: Record<string, any>
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const transition = getOrderTransition(transitionId);
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
      case 'range':
        isValid = Array.isArray(condition.value) && 
                  value >= condition.value[0] && 
                  value <= condition.value[1];
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
