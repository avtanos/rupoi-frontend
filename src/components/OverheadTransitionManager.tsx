'use client';

import React, { useState, useEffect } from 'react';
import { 
  OverheadTransition, 
  OVERHEAD_TRANSITIONS, 
  getOverheadTransition, 
  getOverheadTransitionsByFromStatus,
  validateOverheadTransition,
  getAvailableOverheadTransitions,
  getUnavailableOverheadTransitions
} from '@/constants/overhead-transitions';
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  Clock,
  Package,
  Truck,
  CheckSquare,
  FileText,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface OverheadTransitionManagerProps {
  currentStatus: string;
  overheadData: Record<string, any>;
  onTransition: (transitionId: string, targetStatus: string) => void;
  onValidate?: (isValid: boolean, errors: string[]) => void;
}

export default function OverheadTransitionManager({
  currentStatus,
  overheadData,
  onTransition,
  onValidate
}: OverheadTransitionManagerProps) {
  const [availableTransitions, setAvailableTransitions] = useState<OverheadTransition[]>([]);
  const [unavailableTransitions, setUnavailableTransitions] = useState<Array<{ transition: OverheadTransition; reason: string }>>([]);
  const [selectedTransition, setSelectedTransition] = useState<OverheadTransition | null>(null);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[]; warnings: string[] } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const available = getAvailableOverheadTransitions(currentStatus, overheadData);
    const unavailable = getUnavailableOverheadTransitions(currentStatus, overheadData);
    
    setAvailableTransitions(available);
    setUnavailableTransitions(unavailable);
  }, [currentStatus, overheadData]);

  const handleTransitionClick = (transition: OverheadTransition) => {
    setSelectedTransition(transition);
    setShowDetails(true);
  };

  const handleValidateTransition = (transition: OverheadTransition) => {
    const result = validateOverheadTransition(transition.id, overheadData);
    setValidationResult(result);
    if (onValidate) {
      onValidate(result.isValid, result.errors);
    }
  };

  const handleConfirmTransition = () => {
    if (selectedTransition) {
      onTransition(selectedTransition.id, selectedTransition.to);
      setShowDetails(false);
      setSelectedTransition(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'NEW': 'bg-blue-100 text-blue-800',
      'SENT': 'bg-yellow-100 text-yellow-800',
      'PROCESSED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTransitionIcon = (transition: OverheadTransition) => {
    switch (transition.id) {
      case 'H1':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'H2':
        return <Truck className="h-4 w-4 text-yellow-600" />;
      case 'H3':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      default:
        return <ArrowRight className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTransitionDescription = (transition: OverheadTransition) => {
    const descriptions: Record<string, string> = {
      'H1': 'Создание новой накладной с указанием номера, даты и мастерской',
      'H2': 'Передача накладной с привязанными заказами',
      'H3': 'Обработка накладной и обновление складских остатков'
    };
    return descriptions[transition.id] || transition.description;
  };

  const getStatusName = (status: string) => {
    const names: Record<string, string> = {
      'DRAFT': 'Черновик',
      'NEW': 'Новая',
      'SENT': 'Передана',
      'PROCESSED': 'Обработана'
    };
    return names[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Текущий статус */}
      <div className="flex items-center space-x-3">
        <Clock className="h-5 w-5 text-gray-600" />
        <div className="text-sm font-medium text-gray-700">Текущий статус:</div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
          {getStatusName(currentStatus)}
        </span>
      </div>

      {/* Доступные переходы */}
      {availableTransitions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Доступные переходы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTransitions.map((transition) => (
              <div
                key={transition.id}
                className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleTransitionClick(transition)}
              >
                <div className="flex items-start space-x-3">
                  {getTransitionIcon(transition)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{transition.description}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {getStatusName(transition.from)} → {getStatusName(transition.to)}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {transition.requiredFields.length} обязательных полей
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {transition.conditions.length} условий
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Недоступные переходы */}
      {unavailableTransitions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Недоступные переходы</h3>
          <div className="space-y-2">
            {unavailableTransitions.map(({ transition, reason }) => (
              <div
                key={transition.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50 opacity-60"
              >
                <XCircle className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500">
                    {transition.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    {reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Нет доступных переходов */}
      {availableTransitions.length === 0 && unavailableTransitions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Pause className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Нет доступных переходов для текущего статуса</p>
        </div>
      )}

      {/* Модальное окно подтверждения перехода */}
      {showDetails && selectedTransition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Подтверждение перехода
            </h3>
            
            <div className="space-y-6">
              {/* Информация о переходе */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {getTransitionIcon(selectedTransition)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{selectedTransition.description}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {getTransitionDescription(selectedTransition)}
                  </p>
                </div>
              </div>

              {/* Статусы */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Из статуса:</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTransition.from)}`}>
                      {getStatusName(selectedTransition.from)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">В статус:</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTransition.to)}`}>
                      {getStatusName(selectedTransition.to)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Обязательные поля */}
              {selectedTransition.requiredFields.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Обязательные поля:</h5>
                  <div className="space-y-2">
                    {selectedTransition.requiredFields.map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{field}</span>
                        <span className="text-xs text-gray-400">
                          ({overheadData[field] ? '✓' : '✗'})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Условия */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Условия перехода:</h5>
                <div className="space-y-2">
                  {selectedTransition.conditions.map((condition, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="mt-1">
                        {overheadData[condition.field] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-600">{condition.message}</span>
                        <div className="text-xs text-gray-400 mt-1">
                          Поле: {condition.field} | Оператор: {condition.operator}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Валидация */}
              {validationResult && (
                <div className={`p-4 rounded-lg ${
                  validationResult.isValid 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {validationResult.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      validationResult.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResult.isValid ? 'Переход возможен' : 'Переход невозможен'}
                    </span>
                  </div>
                  
                  {validationResult.errors.length > 0 && (
                    <ul className="mt-2 text-sm text-red-700 space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <XCircle className="h-3 w-3 text-red-500" />
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Источник и кнопка */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Источник:</strong> {selectedTransition.source}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Кнопка:</strong> {selectedTransition.button}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={() => handleValidateTransition(selectedTransition)}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
              >
                Проверить
              </button>
              <button
                onClick={handleConfirmTransition}
                disabled={validationResult && !validationResult.isValid}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Подтвердить переход
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
