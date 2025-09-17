export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Предопределенные паттерны валидации
export const VALIDATION_PATTERNS = {
  // ФИО (кириллица, латиница, дефисы, апострофы)
  name: /^[А-Яа-яA-Za-z\-\'\s]{2,100}$/,
  
  // ИНН (14-16 цифр)
  inn: /^[0-9]{14,16}$/,
  
  // Телефон (международный формат)
  phone: /^\+?[0-9\s\-\(\)]{7,20}$/,
  
  // Серия документа (1-5 символов, буквы и цифры)
  documentSeries: /^[A-Z0-9]{1,5}$/,
  
  // Номер документа (6-10 цифр)
  documentNumber: /^[0-9]{6,10}$/,
  
  // Email
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Адрес (5-250 символов)
  address: /^.{5,250}$/,
  
  // Код (буквы, цифры, дефисы, подчеркивания)
  code: /^[A-Za-z0-9\-\_]+$/,
  
  // Цена (положительное число)
  price: /^\d+(\.\d{1,2})?$/,
  
  // Количество (положительное целое число)
  quantity: /^[1-9]\d*$/
};

// Предопределенные сообщения об ошибках
export const VALIDATION_MESSAGES = {
  required: 'Это поле обязательно для заполнения',
  minLength: (min: number) => `Минимальная длина: ${min} символов`,
  maxLength: (max: number) => `Максимальная длина: ${max} символов`,
  pattern: 'Неверный формат данных',
  custom: 'Неверное значение',
  
  // Специфичные сообщения
  name: 'ФИО должно содержать только буквы, дефисы и апострофы (2-100 символов)',
  inn: 'ИНН должен содержать 14-16 цифр',
  phone: 'Неверный формат телефона',
  documentSeries: 'Серия документа должна содержать 1-5 символов (буквы и цифры)',
  documentNumber: 'Номер документа должен содержать 6-10 цифр',
  email: 'Неверный формат email',
  address: 'Адрес должен содержать 5-250 символов',
  code: 'Код должен содержать только буквы, цифры, дефисы и подчеркивания',
  price: 'Цена должна быть положительным числом',
  quantity: 'Количество должно быть положительным целым числом',
  
  // Даты
  birthDate: 'Дата рождения не может быть в будущем',
  documentIssueDate: 'Дата выдачи документа не может быть в будущем',
  
  // Возраст
  age: 'Возраст должен быть от 0 до 120 лет'
};

// Функция валидации одного поля
export function validateField(value: any, rules: ValidationRule): string | null {
  // Проверка обязательности
  if (rules.required && (!value || value.toString().trim() === '')) {
    return rules.message || VALIDATION_MESSAGES.required;
  }

  // Если поле не обязательное и пустое, пропускаем остальные проверки
  if (!value || value.toString().trim() === '') {
    return null;
  }

  const stringValue = value.toString().trim();

  // Проверка минимальной длины
  if (rules.minLength && stringValue.length < rules.minLength) {
    return rules.message || VALIDATION_MESSAGES.minLength(rules.minLength);
  }

  // Проверка максимальной длины
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return rules.message || VALIDATION_MESSAGES.maxLength(rules.maxLength);
  }

  // Проверка паттерна
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return rules.message || VALIDATION_MESSAGES.pattern;
  }

  // Кастомная валидация
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return rules.message || customError;
    }
  }

  return null;
}

// Функция валидации формы
export function validateForm(data: any, rules: ValidationRules): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// Предопределенные правила валидации для форм
export const FORM_VALIDATION_RULES = {
  // Карточка пациента
  cart: {
    first_name: {
      required: true,
      pattern: VALIDATION_PATTERNS.name,
      message: VALIDATION_MESSAGES.name
    },
    name: {
      required: true,
      pattern: VALIDATION_PATTERNS.name,
      message: VALIDATION_MESSAGES.name
    },
    parent_name: {
      pattern: VALIDATION_PATTERNS.name,
      message: VALIDATION_MESSAGES.name
    },
    birth_date: {
      required: true,
      custom: (value: string) => {
        const birthDate = new Date(value);
        const today = new Date();
        if (birthDate > today) {
          return VALIDATION_MESSAGES.birthDate;
        }
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 0 || age > 120) {
          return VALIDATION_MESSAGES.age;
        }
        return null;
      }
    },
    inn: {
      required: true,
      pattern: VALIDATION_PATTERNS.inn,
      message: VALIDATION_MESSAGES.inn
    },
    document_series: {
      pattern: VALIDATION_PATTERNS.documentSeries,
      message: VALIDATION_MESSAGES.documentSeries
    },
    document_number: {
      required: true,
      pattern: VALIDATION_PATTERNS.documentNumber,
      message: VALIDATION_MESSAGES.documentNumber
    },
    document_issue_date: {
      custom: (value: string) => {
        if (!value) return null;
        const issueDate = new Date(value);
        const today = new Date();
        if (issueDate > today) {
          return VALIDATION_MESSAGES.documentIssueDate;
        }
        return null;
      }
    },
    phone_number: {
      required: true,
      pattern: VALIDATION_PATTERNS.phone,
      message: VALIDATION_MESSAGES.phone
    },
    additional_phone_number: {
      pattern: VALIDATION_PATTERNS.phone,
      message: VALIDATION_MESSAGES.phone
    },
    registration_address: {
      required: true,
      pattern: VALIDATION_PATTERNS.address,
      message: VALIDATION_MESSAGES.address
    },
    living_address: {
      required: true,
      pattern: VALIDATION_PATTERNS.address,
      message: VALIDATION_MESSAGES.address
    }
  },

  // Заказ
  order: {
    order_type: {
      required: true
    },
    diagnosis_type_id: {
      required: true
    },
    quantity: {
      required: true,
      pattern: VALIDATION_PATTERNS.quantity,
      message: VALIDATION_MESSAGES.quantity
    },
    diagnosis_side: {
      required: true
    },
    cost: {
      pattern: VALIDATION_PATTERNS.price,
      message: VALIDATION_MESSAGES.price
    }
  },

  // Материал
  material: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 255
    },
    code: {
      pattern: VALIDATION_PATTERNS.code,
      message: VALIDATION_MESSAGES.code
    },
    inventory_number: {
      required: true,
      minLength: 1,
      maxLength: 50
    },
    unit: {
      required: true,
      minLength: 1,
      maxLength: 20
    },
    price: {
      pattern: VALIDATION_PATTERNS.price,
      message: VALIDATION_MESSAGES.price
    }
  }
};

// Хук для валидации форм
export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  rules: ValidationRules
) {
  const [data, setData] = React.useState<T>(initialData);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validate = (fieldData: T = data): ValidationErrors => {
    return validateForm(fieldData, rules);
  };

  const validateField = (field: string, value: any): string | null => {
    const fieldRules = rules[field];
    if (!fieldRules) return null;
    return validateField(value, fieldRules);
  };

  const setFieldValue = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Валидация поля при изменении
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  };

  const setFieldTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateAll = (): boolean => {
    const newErrors = validate();
    setErrors(newErrors);
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  const hasError = (field: string): boolean => {
    return !!(errors[field] && touched[field]);
  };

  const getError = (field: string): string => {
    return hasError(field) ? errors[field] : '';
  };

  return {
    data,
    errors,
    touched,
    setData,
    setFieldValue,
    setFieldTouched,
    validate,
    validateField,
    validateAll,
    reset,
    hasError,
    getError,
    isValid: Object.keys(errors).length === 0
  };
}
