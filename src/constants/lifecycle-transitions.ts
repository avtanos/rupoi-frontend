import { ReferenceDictionary } from './reference-dictionaries';

// Интерфейсы для переходов жизненного цикла
export interface LifecycleTransition {
  id: string;
  from: string;
  to: string;
  requiredFields: string[];
  allowedCombinations: AllowedCombination[];
  conditions: TransitionCondition[];
  source: string;
  button: string;
  description: string;
}

export interface AllowedCombination {
  field: string;
  values: string[];
  description: string;
}

export interface TransitionCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'exists' | 'not_exists';
  value: any;
  message: string;
}

export interface ValidationRule {
  field: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'boolean' | 'enum';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enumValues?: string[];
  customValidator?: (value: any) => string | null;
}

// Переходы жизненного цикла карточки пациента
export const CART_LIFECYCLE_TRANSITIONS: LifecycleTransition[] = [
  {
    id: 'C1',
    from: 'DRAFT',
    to: 'ACTIVE',
    requiredFields: ['first_name', 'name', 'birth_date', 'document_type', 'document_series', 'document_number', 'registration_address'],
    allowedCombinations: [
      {
        field: 'disability_group',
        values: ['GROUP_I', 'GROUP_II', 'GROUP_III'],
        description: 'Группа инвалидности'
      },
      {
        field: 'disability_category',
        values: ['CHILD', 'SINCE_CHILDHOOD', 'VOV', 'LABOUR', 'OTHER'],
        description: 'Категория инвалидности'
      },
      {
        field: 'disability_reason',
        values: ['TRAUMA', 'CONGENITAL', 'DISEASE', 'OTHER'],
        description: 'Причина инвалидности'
      }
    ],
    conditions: [
      {
        field: 'first_name',
        operator: 'exists',
        value: true,
        message: 'Имя обязательно для заполнения'
      },
      {
        field: 'name',
        operator: 'exists',
        value: true,
        message: 'Фамилия обязательна для заполнения'
      },
      {
        field: 'birth_date',
        operator: 'exists',
        value: true,
        message: 'Дата рождения обязательна для заполнения'
      },
      {
        field: 'birth_date',
        operator: 'lte',
        value: 'today',
        message: 'Дата рождения не может быть в будущем'
      },
      {
        field: 'document_type',
        operator: 'exists',
        value: true,
        message: 'Тип документа обязателен для заполнения'
      },
      {
        field: 'document_series',
        operator: 'exists',
        value: true,
        message: 'Серия документа обязательна для заполнения'
      },
      {
        field: 'document_number',
        operator: 'exists',
        value: true,
        message: 'Номер документа обязателен для заполнения'
      },
      {
        field: 'registration_address',
        operator: 'exists',
        value: true,
        message: 'Адрес регистрации обязателен для заполнения'
      },
      {
        field: 'disability_from_date',
        operator: 'lte',
        value: 'today',
        message: 'Дата установления инвалидности не может быть в будущем'
      }
    ],
    source: '/create',
    button: 'Сохранить',
    description: 'Активация карточки пациента'
  },
  {
    id: 'C2',
    from: 'ACTIVE',
    to: 'REFERRED_MED',
    requiredFields: ['service_type'],
    allowedCombinations: [
      {
        field: 'service_type',
        values: ['PROSTHESIS', 'SHOES', 'OTTO', 'REPAIR'],
        description: 'Тип медицинской услуги'
      }
    ],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'ACTIVE',
        message: 'Карточка должна быть активной'
      },
      {
        field: 'diagnosis',
        operator: 'exists',
        value: true,
        message: 'Необходим минимум один диагноз или инвалидность'
      }
    ],
    source: '/cart/info/:id',
    button: 'Направить',
    description: 'Направление в медицинский отдел'
  },
  {
    id: 'C3',
    from: 'ACTIVE',
    to: 'ARCHIVED',
    requiredFields: ['deregistration_reason', 'deregistration_date'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'ACTIVE',
        message: 'Карточка должна быть активной'
      },
      {
        field: 'deregistration_reason',
        operator: 'exists',
        value: true,
        message: 'Причина снятия с учета обязательна'
      },
      {
        field: 'deregistration_date',
        operator: 'exists',
        value: true,
        message: 'Дата снятия с учета обязательна'
      },
      {
        field: 'deregistration_date',
        operator: 'lte',
        value: 'today',
        message: 'Дата снятия с учета не может быть в будущем'
      }
    ],
    source: '/cart/info/:id',
    button: 'Архивировать',
    description: 'Архивация карточки пациента'
  },
  {
    id: 'C4',
    from: 'ARCHIVED',
    to: 'ACTIVE',
    requiredFields: ['restoration_reason', 'restoration_date'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'ARCHIVED',
        message: 'Карточка должна быть в архиве'
      },
      {
        field: 'restoration_reason',
        operator: 'exists',
        value: true,
        message: 'Причина восстановления обязательна'
      },
      {
        field: 'restoration_date',
        operator: 'exists',
        value: true,
        message: 'Дата восстановления обязательна'
      },
      {
        field: 'restoration_date',
        operator: 'lte',
        value: 'today',
        message: 'Дата восстановления не может быть в будущем'
      }
    ],
    source: '/archive/list',
    button: 'Восстановить',
    description: 'Восстановление из архива'
  }
];

// Переходы жизненного цикла заказа
export const ORDER_LIFECYCLE_TRANSITIONS: LifecycleTransition[] = [
  {
    id: 'O1',
    from: 'NEW',
    to: 'NAPRAVLEN_V_PROIZV',
    requiredFields: ['service_type', 'diagnosis_type_id'],
    allowedCombinations: [
      {
        field: 'service_type',
        values: ['PROSTHESIS', 'SHOES', 'OTTO', 'REPAIR'],
        description: 'Тип услуги'
      },
      {
        field: 'diagnosis_type_id',
        values: ['S78.1', 'S78.9', 'S88.1', 'S88.9', 'S98.1', 'S98.9', 'Q72.0', 'Q72.1', 'Q72.2'],
        description: 'Диагноз по МКБ-10'
      }
    ],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'NEW',
        message: 'Заказ должен быть новым'
      },
      {
        field: 'cart_id',
        operator: 'exists',
        value: true,
        message: 'Необходима привязка к карточке пациента'
      },
      {
        field: 'service_type',
        operator: 'exists',
        value: true,
        message: 'Тип услуги обязателен'
      },
      {
        field: 'diagnosis_type_id',
        operator: 'exists',
        value: true,
        message: 'Диагноз обязателен'
      }
    ],
    source: '/order/create',
    button: 'Создать заказ',
    description: 'Создание нового заказа'
  },
  {
    id: 'O2',
    from: 'NAPRAVLEN_V_PROIZV',
    to: 'V_PROIZV',
    requiredFields: ['assigned_workshop_id', 'planned_start_date'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'NAPRAVLEN_V_PROIZV',
        message: 'Заказ должен быть направлен в производство'
      },
      {
        field: 'assigned_workshop_id',
        operator: 'exists',
        value: true,
        message: 'Необходимо назначить мастерскую'
      },
      {
        field: 'planned_start_date',
        operator: 'exists',
        value: true,
        message: 'Планируемая дата начала обязательна'
      }
    ],
    source: '/order/info/:id',
    button: 'Начать производство',
    description: 'Начало производства'
  },
  {
    id: 'O3',
    from: 'V_PROIZV',
    to: 'NA_PRIMERKE',
    requiredFields: ['measurements_completed'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'V_PROIZV',
        message: 'Заказ должен быть в производстве'
      },
      {
        field: 'measurements_completed',
        operator: 'eq',
        value: true,
        message: 'Измерения должны быть завершены'
      },
      {
        field: 'materials_assigned',
        operator: 'eq',
        value: true,
        message: 'Материалы должны быть назначены'
      }
    ],
    source: '/order/info/:id',
    button: 'Отправить на примерку',
    description: 'Отправка на примерку'
  },
  {
    id: 'O4',
    from: 'NA_PRIMERKE',
    to: 'NA_SKLADE',
    requiredFields: ['fitting_completed'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'NA_PRIMERKE',
        message: 'Заказ должен быть на примерке'
      },
      {
        field: 'fitting_completed',
        operator: 'eq',
        value: true,
        message: 'Примерка должна быть завершена'
      },
      {
        field: 'quality_check_passed',
        operator: 'eq',
        value: true,
        message: 'Контроль качества должен быть пройден'
      }
    ],
    source: '/order/info/:id',
    button: 'Передать на склад',
    description: 'Передача на склад'
  },
  {
    id: 'O5',
    from: 'NA_SKLADE',
    to: 'VIDAN',
    requiredFields: ['issue_date', 'issued_to_patient'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'NA_SKLADE',
        message: 'Заказ должен быть на складе'
      },
      {
        field: 'issue_date',
        operator: 'exists',
        value: true,
        message: 'Дата выдачи обязательна'
      },
      {
        field: 'issued_to_patient',
        operator: 'eq',
        value: true,
        message: 'Подтверждение выдачи пациенту'
      }
    ],
    source: '/warehouse/issue',
    button: 'Выдать пациенту',
    description: 'Выдача пациенту'
  },
  {
    id: 'O6',
    from: 'NEW',
    to: 'NA_UTVERZHDENII',
    requiredFields: ['medical_approval_required'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'NEW',
        message: 'Заказ должен быть новым'
      },
      {
        field: 'medical_approval_required',
        operator: 'eq',
        value: true,
        message: 'Требуется медицинское одобрение'
      }
    ],
    source: '/order/info/:id',
    button: 'Направить на утверждение',
    description: 'Направление на медицинское утверждение'
  }
];

// Переходы жизненного цикла накладной
export const OVERHEAD_LIFECYCLE_TRANSITIONS: LifecycleTransition[] = [
  {
    id: 'H1',
    from: 'NEW',
    to: 'SENT',
    requiredFields: ['order_ids', 'recipient_workshop_id'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'NEW',
        message: 'Накладная должна быть новой'
      },
      {
        field: 'order_ids',
        operator: 'exists',
        value: true,
        message: 'Необходимо добавить заказы'
      },
      {
        field: 'recipient_workshop_id',
        operator: 'exists',
        value: true,
        message: 'Получатель обязателен'
      }
    ],
    source: '/overheads/create',
    button: 'Передать',
    description: 'Передача накладной'
  },
  {
    id: 'H2',
    from: 'SENT',
    to: 'PROCESSED',
    requiredFields: ['processing_date', 'processed_by'],
    allowedCombinations: [],
    conditions: [
      {
        field: 'status',
        operator: 'eq',
        value: 'SENT',
        message: 'Накладная должна быть передана'
      },
      {
        field: 'processing_date',
        operator: 'exists',
        value: true,
        message: 'Дата обработки обязательна'
      },
      {
        field: 'processed_by',
        operator: 'exists',
        value: true,
        message: 'Обработавший сотрудник обязателен'
      }
    ],
    source: '/overheads/process',
    button: 'Обработать',
    description: 'Обработка накладной'
  }
];

// Функции для работы с переходами
export const getTransitionById = (transitions: LifecycleTransition[], id: string): LifecycleTransition | undefined => {
  return transitions.find(transition => transition.id === id);
};

export const getTransitionsByFromStatus = (transitions: LifecycleTransition[], fromStatus: string): LifecycleTransition[] => {
  return transitions.filter(transition => transition.from === fromStatus);
};

export const getTransitionsByToStatus = (transitions: LifecycleTransition[], toStatus: string): LifecycleTransition[] => {
  return transitions.filter(transition => transition.to === toStatus);
};

export const canTransition = (currentStatus: string, targetStatus: string, transitions: LifecycleTransition[]): boolean => {
  return transitions.some(transition => 
    transition.from === currentStatus && transition.to === targetStatus
  );
};

export const getAvailableTransitions = (currentStatus: string, transitions: LifecycleTransition[]): LifecycleTransition[] => {
  return getTransitionsByFromStatus(transitions, currentStatus);
};
