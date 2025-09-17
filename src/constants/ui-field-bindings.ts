// Привязка UI полей к значениям в хранилище

export interface UIFieldBinding {
  id: string;
  uiField: string;
  storagePath: string;
  dictionary?: string;
  dataType: 'string' | 'number' | 'boolean' | 'array' | 'object';
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean;
  };
  transform?: {
    input?: (value: any) => any;
    output?: (value: any) => any;
  };
  dependencies?: string[];
  conditions?: {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'nin' | 'exists' | 'not_exists';
    value: any;
  }[];
}

export interface DictionaryValue {
  id: number | string;
  code: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UIFieldBindingConfig {
  bindings: UIFieldBinding[];
  dictionaries: Record<string, DictionaryValue[]>;
  validationRules: Record<string, any>;
}

// Конфигурация привязок UI полей
export const UI_FIELD_BINDINGS: UIFieldBinding[] = [
  // Тип заказа
  {
    id: 'service_type',
    uiField: 'service_type',
    storagePath: 'service.service_type_id',
    dictionary: 'service_type',
    dataType: 'string',
    validation: {
      required: true,
      pattern: '^(PROSTHESIS|SHOES|OTTO|REPAIR)$'
    },
    transform: {
      input: (value: string) => value?.toUpperCase(),
      output: (value: string) => value?.toLowerCase()
    }
  },

  // Количество
  {
    id: 'quantity',
    uiField: 'quantity',
    storagePath: 'service.quantity',
    dataType: 'number',
    validation: {
      required: true,
      min: 1,
      max: 10
    },
    transform: {
      input: (value: string) => parseInt(value) || 1,
      output: (value: number) => value.toString()
    }
  },

  // Тип изделия (правая сторона)
  {
    id: 'device_type_right',
    uiField: 'device_type_right',
    storagePath: 'order.device_type_r_id',
    dictionary: 'device_type',
    dataType: 'number',
    validation: {
      required: false
    },
    dependencies: ['service_type'],
    conditions: [
      {
        field: 'service_type',
        operator: 'in',
        value: ['PROSTHESIS', 'SHOES', 'OTTO']
      }
    ]
  },

  // Тип изделия (левая сторона)
  {
    id: 'device_type_left',
    uiField: 'device_type_left',
    storagePath: 'order.device_type_l_id',
    dictionary: 'device_type',
    dataType: 'number',
    validation: {
      required: false
    },
    dependencies: ['service_type'],
    conditions: [
      {
        field: 'service_type',
        operator: 'in',
        value: ['PROSTHESIS', 'SHOES', 'OTTO']
      }
    ]
  },

  // Тип диагноза
  {
    id: 'diagnosis_type',
    uiField: 'diagnosis_type',
    storagePath: 'diagnosis.diagnosis_type_id',
    dictionary: 'diagnosis_type',
    dataType: 'number',
    validation: {
      required: true
    }
  },

  // Сторона диагноза
  {
    id: 'diagnosis_side',
    uiField: 'diagnosis_side',
    storagePath: 'diagnosis.side_id',
    dictionary: 'side',
    dataType: 'string',
    validation: {
      required: true,
      pattern: '^(LEFT|RIGHT|BOTH)$'
    },
    transform: {
      input: (value: string) => value?.toUpperCase(),
      output: (value: string) => value?.toLowerCase()
    }
  },

  // Госпитализация
  {
    id: 'hospitalized',
    uiField: 'hospitalized',
    storagePath: 'order.hospitalized',
    dataType: 'boolean',
    validation: {
      required: false
    },
    transform: {
      input: (value: any) => Boolean(value),
      output: (value: boolean) => value ? '1' : '0'
    }
  },

  // Срочный заказ
  {
    id: 'urgency',
    uiField: 'urgency',
    storagePath: 'service.urgency_id',
    dictionary: 'urgency',
    dataType: 'string',
    validation: {
      required: false
    }
  },

  // Причина срочности
  {
    id: 'urgent_reason',
    uiField: 'urgent_reason',
    storagePath: 'order.urgent_reason',
    dataType: 'string',
    validation: {
      required: false
    },
    dependencies: ['urgency'],
    conditions: [
      {
        field: 'urgency',
        operator: 'eq',
        value: 'URGENT'
      }
    ]
  },

  // Измерения
  {
    id: 'measurements',
    uiField: 'measurements',
    storagePath: 'order_measurements',
    dataType: 'array',
    validation: {
      required: false
    }
  }
];

// Справочники для привязок
export const UI_FIELD_DICTIONARIES: Record<string, DictionaryValue[]> = {
  service_type: [
    { id: 'PROSTHESIS', code: 'PROSTHESIS', name: 'Протез', description: 'Протезирование' },
    { id: 'SHOES', code: 'SHOES', name: 'Обувь', description: 'Ортопедическая обувь' },
    { id: 'OTTO', code: 'OTTO', name: 'Ортез', description: 'Ортезирование' },
    { id: 'REPAIR', code: 'REPAIR', name: 'Ремонт', description: 'Ремонт изделий' }
  ],

  device_type: [
    { id: 1, code: 'PROSTHESIS_LEG', name: 'Протез ноги', description: 'Протез нижней конечности' },
    { id: 2, code: 'PROSTHESIS_ARM', name: 'Протез руки', description: 'Протез верхней конечности' },
    { id: 3, code: 'SHOES_ORTHOPEDIC', name: 'Ортопедическая обувь', description: 'Специальная обувь' },
    { id: 4, code: 'OTTO_KNEE', name: 'Коленный ортез', description: 'Ортез коленного сустава' },
    { id: 5, code: 'OTTO_ANKLE', name: 'Голеностопный ортез', description: 'Ортез голеностопного сустава' }
  ],

  diagnosis_type: [
    { id: 1, code: 'M00-M99', name: 'Болезни костно-мышечной системы', description: 'МКБ-10: M00-M99' },
    { id: 2, code: 'S70-S79', name: 'Травмы области тазобедренного сустава и бедра', description: 'МКБ-10: S70-S79' },
    { id: 3, code: 'S80-S89', name: 'Травмы области колена и голени', description: 'МКБ-10: S80-S89' },
    { id: 4, code: 'S90-S99', name: 'Травмы области голеностопного сустава и стопы', description: 'МКБ-10: S90-S99' }
  ],

  side: [
    { id: 'LEFT', code: 'LEFT', name: 'Левая', description: 'Левая сторона' },
    { id: 'RIGHT', code: 'RIGHT', name: 'Правая', description: 'Правая сторона' },
    { id: 'BOTH', code: 'BOTH', name: 'Обе', description: 'Обе стороны' }
  ],

  urgency: [
    { id: 'NORMAL', code: 'NORMAL', name: 'Обычный', description: 'Стандартный срок выполнения' },
    { id: 'URGENT', code: 'URGENT', name: 'Срочный', description: 'Срочное выполнение' },
    { id: 'EMERGENCY', code: 'EMERGENCY', name: 'Экстренный', description: 'Экстренное выполнение' }
  ],

  measurement_type: [
    { id: 1, code: 'LENGTH', name: 'Длина', description: 'Измерение длины' },
    { id: 2, code: 'WIDTH', name: 'Ширина', description: 'Измерение ширины' },
    { id: 3, code: 'HEIGHT', name: 'Высота', description: 'Измерение высоты' },
    { id: 4, code: 'CIRCUMFERENCE', name: 'Обхват', description: 'Измерение обхвата' }
  ],

  unit: [
    { id: 'CM', code: 'CM', name: 'Сантиметры', description: 'Единица измерения - см' },
    { id: 'MM', code: 'MM', name: 'Миллиметры', description: 'Единица измерения - мм' },
    { id: 'INCH', code: 'INCH', name: 'Дюймы', description: 'Единица измерения - дюймы' }
  ]
};

// Правила валидации
export const UI_FIELD_VALIDATION_RULES: Record<string, any> = {
  service_type: {
    required: true,
    pattern: /^(PROSTHESIS|SHOES|OTTO|REPAIR)$/,
    message: 'Выберите тип заказа'
  },
  quantity: {
    required: true,
    min: 1,
    max: 10,
    message: 'Количество должно быть от 1 до 10'
  },
  device_type_right: {
    required: false,
    message: 'Выберите тип изделия для правой стороны'
  },
  device_type_left: {
    required: false,
    message: 'Выберите тип изделия для левой стороны'
  },
  diagnosis_type: {
    required: true,
    message: 'Выберите тип диагноза'
  },
  diagnosis_side: {
    required: true,
    pattern: /^(LEFT|RIGHT|BOTH)$/,
    message: 'Выберите сторону диагноза'
  },
  hospitalized: {
    required: false,
    message: 'Укажите статус госпитализации'
  },
  urgency: {
    required: false,
    message: 'Выберите срочность заказа'
  },
  urgent_reason: {
    required: false,
    message: 'Укажите причину срочности'
  }
};

// Функции для работы с привязками
export const getUIFieldBinding = (fieldId: string): UIFieldBinding | undefined => {
  return UI_FIELD_BINDINGS.find(binding => binding.id === fieldId);
};

export const getDictionaryValues = (dictionaryName: string): DictionaryValue[] => {
  return UI_FIELD_DICTIONARIES[dictionaryName] || [];
};

export const getDictionaryValue = (dictionaryName: string, valueId: string | number): DictionaryValue | undefined => {
  const dictionary = getDictionaryValues(dictionaryName);
  return dictionary.find(item => item.id === valueId || item.code === valueId);
};

export const validateUIField = (fieldId: string, value: any): { isValid: boolean; message?: string } => {
  const binding = getUIFieldBinding(fieldId);
  if (!binding || !binding.validation) {
    return { isValid: true };
  }

  const rules = binding.validation;
  const validationRule = UI_FIELD_VALIDATION_RULES[fieldId];

  // Проверка обязательности
  if (rules.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, message: validationRule?.message || 'Поле обязательно для заполнения' };
  }

  // Проверка минимального значения
  if (rules.min !== undefined && value < rules.min) {
    return { isValid: false, message: validationRule?.message || `Значение должно быть не менее ${rules.min}` };
  }

  // Проверка максимального значения
  if (rules.max !== undefined && value > rules.max) {
    return { isValid: false, message: validationRule?.message || `Значение должно быть не более ${rules.max}` };
  }

  // Проверка по шаблону
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, message: validationRule?.message || 'Неверный формат значения' };
  }

  // Пользовательская валидация
  if (rules.custom && !rules.custom(value)) {
    return { isValid: false, message: validationRule?.message || 'Неверное значение' };
  }

  return { isValid: true };
};

export const transformUIFieldValue = (fieldId: string, value: any, direction: 'input' | 'output'): any => {
  const binding = getUIFieldBinding(fieldId);
  if (!binding || !binding.transform) {
    return value;
  }

  const transform = binding.transform[direction];
  return transform ? transform(value) : value;
};

export const checkFieldConditions = (fieldId: string, formData: any): boolean => {
  const binding = getUIFieldBinding(fieldId);
  if (!binding || !binding.conditions) {
    return true;
  }

  return binding.conditions.every(condition => {
    const fieldValue = formData[condition.field];
    
    switch (condition.operator) {
      case 'eq':
        return fieldValue === condition.value;
      case 'ne':
        return fieldValue !== condition.value;
      case 'gt':
        return fieldValue > condition.value;
      case 'lt':
        return fieldValue < condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'nin':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      case 'exists':
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      case 'not_exists':
        return fieldValue === null || fieldValue === undefined || fieldValue === '';
      default:
        return true;
    }
  });
};

export const getFieldDependencies = (fieldId: string): string[] => {
  const binding = getUIFieldBinding(fieldId);
  return binding?.dependencies || [];
};

export const getRequiredFields = (formData: any): string[] => {
  return UI_FIELD_BINDINGS
    .filter(binding => {
      if (!binding.validation?.required) return false;
      return checkFieldConditions(binding.id, formData);
    })
    .map(binding => binding.id);
};

export const getVisibleFields = (formData: any): string[] => {
  return UI_FIELD_BINDINGS
    .filter(binding => checkFieldConditions(binding.id, formData))
    .map(binding => binding.id);
};

// Функция для преобразования данных формы в структуру хранилища
export const transformFormToStorage = (formData: any): any => {
  const storageData: any = {};

  UI_FIELD_BINDINGS.forEach(binding => {
    const formValue = formData[binding.id];
    if (formValue !== undefined && formValue !== null && formValue !== '') {
      const transformedValue = transformUIFieldValue(binding.id, formValue, 'input');
      
      // Разбиваем путь хранения на части
      const pathParts = binding.storagePath.split('.');
      let current = storageData;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = transformedValue;
    }
  });

  return storageData;
};

// Функция для преобразования данных хранилища в структуру формы
export const transformStorageToForm = (storageData: any): any => {
  const formData: any = {};

  UI_FIELD_BINDINGS.forEach(binding => {
    const pathParts = binding.storagePath.split('.');
    let value = storageData;
    
    for (const part of pathParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }
    
    if (value !== undefined) {
      formData[binding.id] = transformUIFieldValue(binding.id, value, 'output');
    }
  });

  return formData;
};
