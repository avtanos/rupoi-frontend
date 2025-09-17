import { LifecycleTransition, TransitionCondition, ValidationRule } from '@/constants/lifecycle-transitions';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

export class LifecycleValidator {
  private data: Record<string, any>;

  constructor(data: Record<string, any>) {
    this.data = data;
  }

  /**
   * Валидация перехода жизненного цикла
   */
  validateTransition(transition: LifecycleTransition): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Проверка обязательных полей
    for (const field of transition.requiredFields) {
      if (!this.hasValue(field)) {
        errors.push({
          field,
          message: `Поле "${field}" обязательно для заполнения`,
          code: 'REQUIRED_FIELD'
        });
      }
    }

    // Проверка условий перехода
    for (const condition of transition.conditions) {
      const conditionResult = this.validateCondition(condition);
      if (!conditionResult.isValid) {
        errors.push({
          field: condition.field,
          message: condition.message,
          code: conditionResult.code
        });
      }
    }

    // Проверка допустимых комбинаций
    for (const combination of transition.allowedCombinations) {
      const combinationResult = this.validateCombination(combination);
      if (!combinationResult.isValid) {
        errors.push({
          field: combination.field,
          message: combinationResult.message,
          code: 'INVALID_COMBINATION'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Проверка условия перехода
   */
  private validateCondition(condition: TransitionCondition): { isValid: boolean; code: string } {
    const value = this.getFieldValue(condition.field);

    switch (condition.operator) {
      case 'eq':
        return {
          isValid: value === condition.value,
          code: 'CONDITION_NOT_MET'
        };
      case 'ne':
        return {
          isValid: value !== condition.value,
          code: 'CONDITION_NOT_MET'
        };
      case 'gt':
        return {
          isValid: value > condition.value,
          code: 'CONDITION_NOT_MET'
        };
      case 'lt':
        return {
          isValid: value < condition.value,
          code: 'CONDITION_NOT_MET'
        };
      case 'gte':
        return {
          isValid: value >= condition.value,
          code: 'CONDITION_NOT_MET'
        };
      case 'lte':
        return {
          isValid: value <= condition.value,
          code: 'CONDITION_NOT_MET'
        };
      case 'in':
        return {
          isValid: Array.isArray(condition.value) && condition.value.includes(value),
          code: 'CONDITION_NOT_MET'
        };
      case 'nin':
        return {
          isValid: Array.isArray(condition.value) && !condition.value.includes(value),
          code: 'CONDITION_NOT_MET'
        };
      case 'exists':
        return {
          isValid: this.hasValue(condition.field),
          code: 'CONDITION_NOT_MET'
        };
      case 'not_exists':
        return {
          isValid: !this.hasValue(condition.field),
          code: 'CONDITION_NOT_MET'
        };
      default:
        return {
          isValid: false,
          code: 'UNKNOWN_OPERATOR'
        };
    }
  }

  /**
   * Проверка допустимых комбинаций
   */
  private validateCombination(combination: any): { isValid: boolean; message: string } {
    const value = this.getFieldValue(combination.field);
    
    if (!value) {
      return {
        isValid: true,
        message: ''
      };
    }

    const isValid = combination.values.includes(value);
    
    return {
      isValid,
      message: isValid ? '' : `Значение "${value}" недопустимо для поля "${combination.field}"`
    };
  }

  /**
   * Проверка наличия значения
   */
  private hasValue(field: string): boolean {
    const value = this.getFieldValue(field);
    return value !== null && value !== undefined && value !== '';
  }

  /**
   * Получение значения поля
   */
  private getFieldValue(field: string): any {
    const keys = field.split('.');
    let value = this.data;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Специальная валидация для дат
   */
  private validateDate(field: string, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!value) {
      return { isValid: true, errors, warnings };
    }

    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(date.getTime())) {
      errors.push({
        field,
        message: 'Неверный формат даты',
        code: 'INVALID_DATE_FORMAT'
      });
    } else if (date > today) {
      errors.push({
        field,
        message: 'Дата не может быть в будущем',
        code: 'FUTURE_DATE'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Валидация ФИО
   */
  private validateName(field: string, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!value) {
      return { isValid: true, errors, warnings };
    }

    const namePattern = /^[А-Яа-яA-Za-z\-\'\s]{2,100}$/;
    
    if (!namePattern.test(value)) {
      errors.push({
        field,
        message: 'ФИО должно содержать только буквы, дефисы и апострофы (2-100 символов)',
        code: 'INVALID_NAME_FORMAT'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Валидация документа
   */
  private validateDocument(field: string, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!value) {
      return { isValid: true, errors, warnings };
    }

    const documentPattern = /^[A-Z0-9]{1,10}$/;
    
    if (!documentPattern.test(value)) {
      errors.push({
        field,
        message: 'Серия документа должна содержать только буквы и цифры (1-10 символов)',
        code: 'INVALID_DOCUMENT_FORMAT'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Валидация адреса
   */
  private validateAddress(field: string, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!value) {
      return { isValid: true, errors, warnings };
    }

    if (value.length < 5 || value.length > 250) {
      errors.push({
        field,
        message: 'Адрес должен содержать 5-250 символов',
        code: 'INVALID_ADDRESS_LENGTH'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Фабрика валидаторов для разных типов переходов
 */
export class LifecycleValidatorFactory {
  static createCartValidator(data: Record<string, any>): LifecycleValidator {
    return new LifecycleValidator(data);
  }

  static createOrderValidator(data: Record<string, any>): LifecycleValidator {
    return new LifecycleValidator(data);
  }

  static createOverheadValidator(data: Record<string, any>): LifecycleValidator {
    return new LifecycleValidator(data);
  }
}

/**
 * Утилиты для работы с валидацией
 */
export const ValidationUtils = {
  /**
   * Проверка возможности перехода
   */
  canTransition(
    currentStatus: string,
    targetStatus: string,
    data: Record<string, any>,
    transitions: LifecycleTransition[]
  ): ValidationResult {
    const transition = transitions.find(t => 
      t.from === currentStatus && t.to === targetStatus
    );

    if (!transition) {
      return {
        isValid: false,
        errors: [{
          field: 'status',
          message: `Переход из "${currentStatus}" в "${targetStatus}" недопустим`,
          code: 'INVALID_TRANSITION'
        }],
        warnings: []
      };
    }

    const validator = new LifecycleValidator(data);
    return validator.validateTransition(transition);
  },

  /**
   * Получение доступных переходов
   */
  getAvailableTransitions(
    currentStatus: string,
    data: Record<string, any>,
    transitions: LifecycleTransition[]
  ): LifecycleTransition[] {
    return transitions
      .filter(transition => transition.from === currentStatus)
      .filter(transition => {
        const validator = new LifecycleValidator(data);
        const result = validator.validateTransition(transition);
        return result.isValid;
      });
  },

  /**
   * Получение недоступных переходов с причинами
   */
  getUnavailableTransitions(
    currentStatus: string,
    data: Record<string, any>,
    transitions: LifecycleTransition[]
  ): Array<{ transition: LifecycleTransition; reason: string }> {
    return transitions
      .filter(transition => transition.from === currentStatus)
      .map(transition => {
        const validator = new LifecycleValidator(data);
        const result = validator.validateTransition(transition);
        return {
          transition,
          reason: result.errors.map(e => e.message).join('; ')
        };
      })
      .filter(item => item.reason);
  }
};
