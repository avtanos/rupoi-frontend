'use client';

import React, { useState, useEffect } from 'react';
import { 
  LifecycleTransition, 
  CART_LIFECYCLE_TRANSITIONS, 
  ORDER_LIFECYCLE_TRANSITIONS, 
  OVERHEAD_LIFECYCLE_TRANSITIONS 
} from '@/constants/lifecycle-transitions';
import { ValidationUtils, ValidationResult } from '@/lib/lifecycle-validator';
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Play, 
  Pause, 
  RotateCcw 
} from 'lucide-react';

interface LifecycleTransitionManagerProps {
  entityType: 'cart' | 'order' | 'overhead';
  currentStatus: string;
  data: Record<string, any>;
  onTransition: (transitionId: string, targetStatus: string) => void;
  onValidate?: (result: ValidationResult) => void;
}

export default function LifecycleTransitionManager({
  entityType,
  currentStatus,
  data,
  onTransition,
  onValidate
}: LifecycleTransitionManagerProps) {
  const [availableTransitions, setAvailableTransitions] = useState<LifecycleTransition[]>([]);
  const [unavailableTransitions, setUnavailableTransitions] = useState<Array<{ transition: LifecycleTransition; reason: string }>>([]);
  const [selectedTransition, setSelectedTransition] = useState<LifecycleTransition | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getTransitions = () => {
    switch (entityType) {
      case 'cart':
        return CART_LIFECYCLE_TRANSITIONS;
      case 'order':
        return ORDER_LIFECYCLE_TRANSITIONS;
      case 'overhead':
        return OVERHEAD_LIFECYCLE_TRANSITIONS;
      default:
        return [];
    }
  };

  useEffect(() => {
    const transitions = getTransitions();
    const available = ValidationUtils.getAvailableTransitions(currentStatus, data, transitions);
    const unavailable = ValidationUtils.getUnavailableTransitions(currentStatus, data, transitions);
    
    setAvailableTransitions(available);
    setUnavailableTransitions(unavailable);
  }, [currentStatus, data, entityType]);

  const handleTransitionClick = (transition: LifecycleTransition) => {
    setSelectedTransition(transition);
    setShowDetails(true);
  };

  const handleConfirmTransition = () => {
    if (selectedTransition) {
      onTransition(selectedTransition.id, selectedTransition.to);
      setShowDetails(false);
      setSelectedTransition(null);
    }
  };

  const handleValidateTransition = (transition: LifecycleTransition) => {
    const result = ValidationUtils.canTransition(currentStatus, transition.to, data, getTransitions());
    setValidationResult(result);
    if (onValidate) {
      onValidate(result);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'ACTIVE': 'bg-green-100 text-green-800',
      'REFERRED_MED': 'bg-blue-100 text-blue-800',
      'ARCHIVED': 'bg-yellow-100 text-yellow-800',
      'NEW': 'bg-blue-100 text-blue-800',
      'NAPRAVLEN_V_PROIZV': 'bg-purple-100 text-purple-800',
      'V_PROIZV': 'bg-orange-100 text-orange-800',
      'NA_PRIMERKE': 'bg-pink-100 text-pink-800',
      'NA_SKLADE': 'bg-cyan-100 text-cyan-800',
      'VIDAN': 'bg-green-100 text-green-800',
      'NA_UTVERZHDENII': 'bg-red-100 text-red-800',
      'SENT': 'bg-blue-100 text-blue-800',
      'PROCESSED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTransitionIcon = (transition: LifecycleTransition) => {
    switch (transition.id) {
      case 'C1':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'C2':
        return <ArrowRight className="h-4 w-4 text-blue-600" />;
      case 'C3':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'C4':
        return <RotateCcw className="h-4 w-4 text-green-600" />;
      default:
        return <Play className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Текущий статус */}
      <div className="flex items-center space-x-3">
        <div className="text-sm font-medium text-gray-700">Текущий статус:</div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
          {currentStatus}
        </span>
      </div>

      {/* Доступные переходы */}
      {availableTransitions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Доступные переходы</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableTransitions.map((transition) => (
              <button
                key={transition.id}
                onClick={() => handleTransitionClick(transition)}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                {getTransitionIcon(transition)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {transition.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transition.from} → {transition.to}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Недоступные переходы */}
      {unavailableTransitions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Недоступные переходы</h4>
          <div className="space-y-1">
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

      {/* Модальное окно подтверждения перехода */}
      {showDetails && selectedTransition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Подтверждение перехода
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Из:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTransition.from)}`}>
                  {selectedTransition.from}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">В:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTransition.to)}`}>
                  {selectedTransition.to}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Описание:</h4>
                <p className="text-sm text-gray-600">{selectedTransition.description}</p>
              </div>

              {selectedTransition.requiredFields.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Обязательные поля:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedTransition.requiredFields.map((field) => (
                      <li key={field} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult && !validationResult.isValid && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Ошибки валидации:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validationResult.errors.map((error, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span>{error.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
