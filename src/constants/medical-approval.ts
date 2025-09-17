// Система медицинского утверждения с комбинациями решений

export interface MedicalApprovalDecision {
  id: string;
  code: string;
  name: string;
  description: string;
  conditions: ApprovalCondition[];
  effects: ApprovalEffect[];
  requiredFields: string[];
  optionalFields: string[];
}

export interface ApprovalCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'exists' | 'not_exists' | 'and' | 'or';
  value: any;
  message: string;
  isRequired: boolean;
}

export interface ApprovalEffect {
  field: string;
  action: 'set' | 'update' | 'log' | 'flag';
  value: any;
  description: string;
}

export interface MedicalApprovalData {
  service_id: number;
  service_status: string;
  primary_diagnosis_id?: number;
  disability_id?: number;
  reject_reason?: string;
  needs_info?: boolean;
  approval_date?: string;
  approved_by?: number;
  rejection_date?: string;
  rejected_by?: number;
  info_request_date?: string;
  requested_by?: number;
  info_request_reason?: string;
}

// Решения медицинского утверждения
export const MEDICAL_APPROVAL_DECISIONS: MedicalApprovalDecision[] = [
  {
    id: 'APPROVE',
    code: 'APPROVE',
    name: 'Утвердить',
    description: 'Утверждение заказа медицинским работником',
    conditions: [
      {
        field: 'service_status',
        operator: 'eq',
        value: 'ON_APPROVAL',
        message: 'Заказ должен быть на утверждении',
        isRequired: true
      },
      {
        field: 'primary_diagnosis_id',
        operator: 'exists',
        value: true,
        message: 'Основной диагноз обязателен',
        isRequired: true
      },
      {
        field: 'disability_id',
        operator: 'exists',
        value: true,
        message: 'При льготе необходимо указать инвалидность',
        isRequired: false
      }
    ],
    effects: [
      {
        field: 'status',
        action: 'set',
        value: 'IN_PRODUCTION',
        description: 'Статус изменен на "В производстве"'
      },
      {
        field: 'approval_date',
        action: 'set',
        value: 'now',
        description: 'Установлена дата утверждения'
      },
      {
        field: 'approved_by',
        action: 'set',
        value: 'current_user',
        description: 'Установлен утвердивший сотрудник'
      }
    ],
    requiredFields: ['primary_diagnosis_id'],
    optionalFields: ['disability_id', 'approval_notes']
  },
  {
    id: 'REJECT',
    code: 'REJECT',
    name: 'Отклонить',
    description: 'Отклонение заказа с указанием причины',
    conditions: [
      {
        field: 'service_status',
        operator: 'eq',
        value: 'ON_APPROVAL',
        message: 'Заказ должен быть на утверждении',
        isRequired: true
      },
      {
        field: 'reject_reason',
        operator: 'exists',
        value: true,
        message: 'Причина отклонения обязательна',
        isRequired: true
      }
    ],
    effects: [
      {
        field: 'status',
        action: 'set',
        value: 'NEW',
        description: 'Статус возвращен на "Новый"'
      },
      {
        field: 'rejection_date',
        action: 'set',
        value: 'now',
        description: 'Установлена дата отклонения'
      },
      {
        field: 'rejected_by',
        action: 'set',
        value: 'current_user',
        description: 'Установлен отклонивший сотрудник'
      },
      {
        field: 'reject_reason',
        action: 'log',
        value: 'error',
        description: 'Записана причина отклонения в лог ошибок'
      }
    ],
    requiredFields: ['reject_reason'],
    optionalFields: ['rejection_notes', 'rejection_category']
  },
  {
    id: 'REQUEST_INFO',
    code: 'REQUEST_INFO',
    name: 'Запросить данные',
    description: 'Запрос дополнительной информации по заказу',
    conditions: [
      {
        field: 'service_status',
        operator: 'eq',
        value: 'ON_APPROVAL',
        message: 'Заказ должен быть на утверждении',
        isRequired: true
      }
    ],
    effects: [
      {
        field: 'status',
        action: 'set',
        value: 'ON_APPROVAL',
        description: 'Статус остается "На утверждении"'
      },
      {
        field: 'needs_info',
        action: 'set',
        value: true,
        description: 'Установлен флаг необходимости дополнительной информации'
      },
      {
        field: 'info_request_date',
        action: 'set',
        value: 'now',
        description: 'Установлена дата запроса информации'
      },
      {
        field: 'requested_by',
        action: 'set',
        value: 'current_user',
        description: 'Установлен запросивший сотрудник'
      }
    ],
    requiredFields: ['info_request_reason'],
    optionalFields: ['info_request_details', 'info_request_deadline']
  }
];

// Функции для работы с решениями
export const getMedicalApprovalDecision = (code: string): MedicalApprovalDecision | undefined => {
  return MEDICAL_APPROVAL_DECISIONS.find(decision => decision.code === code);
};

export const getAllMedicalApprovalDecisions = (): MedicalApprovalDecision[] => {
  return MEDICAL_APPROVAL_DECISIONS;
};

// Валидация решения медицинского утверждения
export const validateMedicalApprovalDecision = (
  decisionCode: string,
  data: MedicalApprovalData
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const decision = getMedicalApprovalDecision(decisionCode);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!decision) {
    errors.push(`Решение ${decisionCode} не найдено`);
    return { isValid: false, errors, warnings };
  }

  // Проверка обязательных полей
  for (const field of decision.requiredFields) {
    if (!data[field as keyof MedicalApprovalData]) {
      errors.push(`Поле ${field} обязательно для решения ${decision.name}`);
    }
  }

  // Проверка условий
  for (const condition of decision.conditions) {
    const value = data[condition.field as keyof MedicalApprovalData];
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
      case 'and':
        isValid = Array.isArray(condition.value) && condition.value.every(v => v);
        break;
      case 'or':
        isValid = Array.isArray(condition.value) && condition.value.some(v => v);
        break;
    }

    if (!isValid) {
      if (condition.isRequired) {
        errors.push(condition.message);
      } else {
        warnings.push(condition.message);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Применение решения медицинского утверждения
export const applyMedicalApprovalDecision = (
  decisionCode: string,
  data: MedicalApprovalData,
  currentUserId: number
): { success: boolean; updatedData: MedicalApprovalData; effects: string[] } => {
  const decision = getMedicalApprovalDecision(decisionCode);
  const effects: string[] = [];

  if (!decision) {
    return {
      success: false,
      updatedData: data,
      effects: [`Решение ${decisionCode} не найдено`]
    };
  }

  const updatedData = { ...data };

  // Применение эффектов
  for (const effect of decision.effects) {
    switch (effect.action) {
      case 'set':
        if (effect.value === 'now') {
          updatedData[effect.field as keyof MedicalApprovalData] = new Date().toISOString();
        } else if (effect.value === 'current_user') {
          updatedData[effect.field as keyof MedicalApprovalData] = currentUserId;
        } else {
          updatedData[effect.field as keyof MedicalApprovalData] = effect.value;
        }
        effects.push(effect.description);
        break;
      case 'update':
        // Логика обновления существующих данных
        effects.push(effect.description);
        break;
      case 'log':
        // Логирование в систему
        effects.push(effect.description);
        break;
      case 'flag':
        // Установка флагов
        updatedData[effect.field as keyof MedicalApprovalData] = effect.value;
        effects.push(effect.description);
        break;
    }
  }

  return {
    success: true,
    updatedData,
    effects
  };
};

// Получение доступных решений для заказа
export const getAvailableMedicalApprovalDecisions = (
  data: MedicalApprovalData
): MedicalApprovalDecision[] => {
  return MEDICAL_APPROVAL_DECISIONS.filter(decision => {
    const result = validateMedicalApprovalDecision(decision.code, data);
    return result.isValid;
  });
};

// Получение недоступных решений с причинами
export const getUnavailableMedicalApprovalDecisions = (
  data: MedicalApprovalData
): Array<{ decision: MedicalApprovalDecision; reason: string }> => {
  return MEDICAL_APPROVAL_DECISIONS
    .map(decision => {
      const result = validateMedicalApprovalDecision(decision.code, data);
      return {
        decision,
        reason: result.errors.join('; ')
      };
    })
    .filter(item => item.reason);
};

// Проверка возможности утверждения
export const canApproveOrder = (data: MedicalApprovalData): boolean => {
  const result = validateMedicalApprovalDecision('APPROVE', data);
  return result.isValid;
};

// Проверка возможности отклонения
export const canRejectOrder = (data: MedicalApprovalData): boolean => {
  const result = validateMedicalApprovalDecision('REJECT', data);
  return result.isValid;
};

// Проверка возможности запроса данных
export const canRequestInfo = (data: MedicalApprovalData): boolean => {
  const result = validateMedicalApprovalDecision('REQUEST_INFO', data);
  return result.isValid;
};
