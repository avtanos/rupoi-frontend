// Система контроля допустимых комбинаций (правила валидации)

export interface ValidationRule {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'service' | 'order' | 'status' | 'diagnosis' | 'urgency' | 'warehouse';
  severity: 'error' | 'warning' | 'info';
  conditions: RuleCondition[];
  effects: RuleEffect[];
  uiIndicators?: UIIndicator[];
  isActive: boolean;
}

export interface RuleCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'exists' | 'not_exists' | 'contains' | 'regex';
  value: any;
  description: string;
  isRequired: boolean;
}

export interface RuleEffect {
  type: 'validation' | 'ui' | 'status' | 'sla' | 'block';
  field?: string;
  value?: any;
  message: string;
  action?: 'prevent' | 'warn' | 'highlight' | 'require';
}

export interface UIIndicator {
  element: string;
  type: 'color' | 'icon' | 'badge' | 'border' | 'background';
  value: string;
  condition: string;
}

export interface ValidationResult {
  ruleId: string;
  isValid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  affectedFields: string[];
  suggestions?: string[];
}

// Правила валидации комбинаций
export const VALIDATION_RULES: ValidationRule[] = [
  // R1: Правило для протезов
  {
    id: 'R1',
    code: 'PROSTHESIS_DIAGNOSIS_REQUIRED',
    name: 'Диагноз ампутации для протеза',
    description: 'Если service_type=PROSTHESIS, то должен существовать ≥1 диагноз ампутации (МКБ S78.* или Z89.*) и заданы device_type_* по соответствующим сторонам',
    category: 'service',
    severity: 'error',
    conditions: [
      {
        field: 'service_type',
        operator: 'eq',
        value: 'PROSTHESIS',
        description: 'Тип услуги - протез',
        isRequired: true
      },
      {
        field: 'diagnosis_type',
        operator: 'regex',
        value: '^(S78|Z89)',
        description: 'Диагноз ампутации (МКБ S78.* или Z89.*)',
        isRequired: true
      },
      {
        field: 'device_type_r_id',
        operator: 'exists',
        value: true,
        description: 'Тип изделия для правой стороны',
        isRequired: false
      },
      {
        field: 'device_type_l_id',
        operator: 'exists',
        value: true,
        description: 'Тип изделия для левой стороны',
        isRequired: false
      }
    ],
    effects: [
      {
        type: 'validation',
        message: 'Для протеза необходим диагноз ампутации и указание типов изделий',
        action: 'prevent'
      }
    ],
    uiIndicators: [
      {
        element: 'service_type',
        type: 'border',
        value: 'red',
        condition: 'invalid'
      },
      {
        element: 'diagnosis_type',
        type: 'background',
        value: 'red-50',
        condition: 'missing'
      }
    ],
    isActive: true
  },

  // R2: Правило для обуви
  {
    id: 'R2',
    code: 'SHOES_QUANTITY_BOTH_SIDES',
    name: 'Количество обуви для обеих сторон',
    description: 'Если service_type=SHOES и side=BOTH, то quantity >= 2 (по умолчанию 2 изделия)',
    category: 'service',
    severity: 'warning',
    conditions: [
      {
        field: 'service_type',
        operator: 'eq',
        value: 'SHOES',
        description: 'Тип услуги - обувь',
        isRequired: true
      },
      {
        field: 'side',
        operator: 'eq',
        value: 'BOTH',
        description: 'Сторона - обе',
        isRequired: true
      },
      {
        field: 'quantity',
        operator: 'lt',
        value: 2,
        description: 'Количество меньше 2',
        isRequired: true
      }
    ],
    effects: [
      {
        type: 'validation',
        message: 'Для обуви на обе стороны рекомендуется количество не менее 2',
        action: 'warn'
      },
      {
        type: 'ui',
        field: 'quantity',
        value: 2,
        message: 'Рекомендуемое количество: 2',
        action: 'suggest'
      }
    ],
    uiIndicators: [
      {
        element: 'quantity',
        type: 'badge',
        value: 'yellow',
        condition: 'warning'
      }
    ],
    isActive: true
  },

  // R3: Правило для срочности
  {
    id: 'R3',
    code: 'URGENT_REASON_REQUIRED',
    name: 'Причина срочности обязательна',
    description: 'При urgency=URGENT — обязательна urgent_reason, SLA покраски карточки в UI',
    category: 'urgency',
    severity: 'error',
    conditions: [
      {
        field: 'urgency',
        operator: 'eq',
        value: 'URGENT',
        description: 'Срочность - срочный',
        isRequired: true
      },
      {
        field: 'urgent_reason',
        operator: 'not_exists',
        value: true,
        description: 'Причина срочности не указана',
        isRequired: true
      }
    ],
    effects: [
      {
        type: 'validation',
        message: 'Для срочного заказа необходимо указать причину срочности',
        action: 'prevent'
      },
      {
        type: 'ui',
        field: 'urgent_reason',
        message: 'Поле обязательно для срочного заказа',
        action: 'require'
      }
    ],
    uiIndicators: [
      {
        element: 'urgency',
        type: 'color',
        value: 'red',
        condition: 'urgent'
      },
      {
        element: 'urgent_reason',
        type: 'border',
        value: 'red',
        condition: 'required'
      }
    ],
    isActive: true
  },

  // R4: Правило для перевода в склад
  {
    id: 'R4',
    code: 'WAREHOUSE_FITTING_REQUIRED',
    name: 'Примерка перед складом',
    description: 'Нельзя переводить заказ в WAREHOUSE(5), если нет завершенной примерки (FITTING(4))',
    category: 'status',
    severity: 'error',
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'WAREHOUSE',
        description: 'Статус - склад',
        isRequired: true
      },
      {
        field: 'status_history',
        operator: 'not_exists',
        value: 'FITTING',
        description: 'Нет завершенной примерки',
        isRequired: true
      }
    ],
    effects: [
      {
        type: 'validation',
        message: 'Нельзя переводить заказ в склад без завершенной примерки',
        action: 'prevent'
      },
      {
        type: 'status',
        field: 'status',
        value: 'FITTING',
        message: 'Сначала необходимо завершить примерку',
        action: 'require'
      }
    ],
    uiIndicators: [
      {
        element: 'status',
        type: 'badge',
        value: 'red',
        condition: 'blocked'
      }
    ],
    isActive: true
  },

  // R5: Правило для накладных
  {
    id: 'R5',
    code: 'OVERHEAD_WAREHOUSE_STATUS',
    name: 'Статус заказа для накладной',
    description: 'Нельзя включать в накладную заказы со статусом < WAREHOUSE(5)',
    category: 'warehouse',
    severity: 'error',
    conditions: [
      {
        field: 'status',
        operator: 'lt',
        value: 'WAREHOUSE',
        description: 'Статус меньше WAREHOUSE',
        isRequired: true
      },
      {
        field: 'overhead_id',
        operator: 'exists',
        value: true,
        description: 'Заказ включен в накладную',
        isRequired: true
      }
    ],
    effects: [
      {
        type: 'validation',
        message: 'В накладную можно включать только заказы со статусом WAREHOUSE или выше',
        action: 'prevent'
      },
      {
        type: 'block',
        field: 'overhead_id',
        message: 'Заказ не готов для включения в накладную',
        action: 'prevent'
      }
    ],
    uiIndicators: [
      {
        element: 'overhead_id',
        type: 'icon',
        value: 'block',
        condition: 'blocked'
      }
    ],
    isActive: true
  },

  // R6: Правило для диагноза пациента
  {
    id: 'R6',
    code: 'DIAGNOSIS_PATIENT_MATCH',
    name: 'Соответствие диагноза пациенту',
    description: 'primary_diagnosis_id должен принадлежать пациенту (diagnosis.cart_id = service.cart_id)',
    category: 'diagnosis',
    severity: 'error',
    conditions: [
      {
        field: 'primary_diagnosis_id',
        operator: 'exists',
        value: true,
        description: 'Основной диагноз указан',
        isRequired: true
      },
      {
        field: 'diagnosis_cart_id',
        operator: 'ne',
        value: 'service_cart_id',
        description: 'Диагноз не принадлежит пациенту',
        isRequired: true
      }
    ],
    effects: [
      {
        type: 'validation',
        message: 'Диагноз должен принадлежать указанному пациенту',
        action: 'prevent'
      }
    ],
    uiIndicators: [
      {
        element: 'primary_diagnosis_id',
        type: 'border',
        value: 'red',
        condition: 'mismatch'
      }
    ],
    isActive: true
  }
];

// Функции для работы с правилами
export const getValidationRule = (ruleId: string): ValidationRule | undefined => {
  return VALIDATION_RULES.find(rule => rule.id === ruleId);
};

export const getActiveValidationRules = (): ValidationRule[] => {
  return VALIDATION_RULES.filter(rule => rule.isActive);
};

export const getValidationRulesByCategory = (category: string): ValidationRule[] => {
  return VALIDATION_RULES.filter(rule => rule.category === category && rule.isActive);
};

// Валидация по правилам
export const validateByRules = (data: any): ValidationResult[] => {
  const results: ValidationResult[] = [];
  const activeRules = getActiveValidationRules();

  for (const rule of activeRules) {
    const result = validateRule(rule, data);
    if (result) {
      results.push(result);
    }
  }

  return results;
};

// Валидация конкретного правила
export const validateRule = (rule: ValidationRule, data: any): ValidationResult | null => {
  const conditionsMet = rule.conditions.every(condition => {
    return checkCondition(condition, data);
  });

  if (!conditionsMet) {
    return null; // Правило не применимо
  }

  // Проверяем, нарушено ли правило
  const isViolated = rule.conditions.some(condition => {
    if (condition.isRequired) {
      return !checkCondition(condition, data);
    }
    return false;
  });

  if (isViolated) {
    return {
      ruleId: rule.id,
      isValid: false,
      message: rule.effects[0]?.message || rule.description,
      severity: rule.severity,
      affectedFields: rule.conditions.map(c => c.field),
      suggestions: rule.effects
        .filter(e => e.action === 'suggest')
        .map(e => e.message)
    };
  }

  return {
    ruleId: rule.id,
    isValid: true,
    message: 'Правило соблюдено',
    severity: 'info',
    affectedFields: rule.conditions.map(c => c.field)
  };
};

// Проверка условия
export const checkCondition = (condition: RuleCondition, data: any): boolean => {
  const value = getFieldValue(data, condition.field);
  
  switch (condition.operator) {
    case 'eq':
      return value === condition.value;
    case 'ne':
      return value !== condition.value;
    case 'gt':
      return value > condition.value;
    case 'lt':
      return value < condition.value;
    case 'gte':
      return value >= condition.value;
    case 'lte':
      return value <= condition.value;
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(value);
    case 'nin':
      return Array.isArray(condition.value) && !condition.value.includes(value);
    case 'exists':
      return value !== null && value !== undefined && value !== '';
    case 'not_exists':
      return value === null || value === undefined || value === '';
    case 'contains':
      return typeof value === 'string' && value.includes(condition.value);
    case 'regex':
      return typeof value === 'string' && new RegExp(condition.value).test(value);
    default:
      return false;
  }
};

// Получение значения поля по пути
export const getFieldValue = (data: any, fieldPath: string): any => {
  const parts = fieldPath.split('.');
  let value = data;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// Применение UI индикаторов
export const applyUIIndicators = (rule: ValidationRule, data: any): UIIndicator[] => {
  if (!rule.uiIndicators) return [];
  
  return rule.uiIndicators.filter(indicator => {
    const condition = indicator.condition;
    const fieldValue = getFieldValue(data, indicator.element);
    
    switch (condition) {
      case 'invalid':
        return !validateRule(rule, data)?.isValid;
      case 'missing':
        return fieldValue === null || fieldValue === undefined || fieldValue === '';
      case 'warning':
        return rule.severity === 'warning';
      case 'urgent':
        return fieldValue === 'URGENT';
      case 'required':
        return rule.conditions.some(c => c.field === indicator.element && c.isRequired);
      case 'blocked':
        return !validateRule(rule, data)?.isValid;
      case 'mismatch':
        return !validateRule(rule, data)?.isValid;
      default:
        return false;
    }
  });
};

// Получение всех нарушенных правил
export const getViolatedRules = (data: any): ValidationResult[] => {
  return validateByRules(data).filter(result => !result.isValid);
};

// Получение предупреждений
export const getWarnings = (data: any): ValidationResult[] => {
  return validateByRules(data).filter(result => result.severity === 'warning');
};

// Получение ошибок
export const getErrors = (data: any): ValidationResult[] => {
  return validateByRules(data).filter(result => result.severity === 'error');
};

// Проверка возможности выполнения действия
export const canPerformAction = (action: string, data: any): { allowed: boolean; reason?: string } => {
  const violatedRules = getViolatedRules(data);
  
  for (const rule of violatedRules) {
    const effect = rule.ruleId;
    if (effect === action) {
      return { allowed: false, reason: rule.message };
    }
  }
  
  return { allowed: true };
};

// Получение рекомендаций
export const getRecommendations = (data: any): string[] => {
  const results = validateByRules(data);
  const recommendations: string[] = [];
  
  for (const result of results) {
    if (result.suggestions) {
      recommendations.push(...result.suggestions);
    }
  }
  
  return recommendations;
};

// Статистика правил
export const getRulesStatistics = (data: any) => {
  const results = validateByRules(data);
  const total = results.length;
  const valid = results.filter(r => r.isValid).length;
  const errors = results.filter(r => r.severity === 'error').length;
  const warnings = results.filter(r => r.severity === 'warning').length;
  const info = results.filter(r => r.severity === 'info').length;
  
  return {
    total,
    valid,
    errors,
    warnings,
    info,
    isValid: errors === 0
  };
};
