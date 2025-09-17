'use client';

import React, { useState, useEffect } from 'react';
import { 
  MedicalApprovalDecision, 
  MEDICAL_APPROVAL_DECISIONS, 
  getMedicalApprovalDecision, 
  validateMedicalApprovalDecision,
  applyMedicalApprovalDecision,
  getAvailableMedicalApprovalDecisions,
  getUnavailableMedicalApprovalDecisions
} from '@/constants/medical-approval';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Play, 
  Pause, 
  RotateCcw,
  Clock,
  UserCheck,
  FileText,
  MessageSquare,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';

interface MedicalApprovalManagerProps {
  orderData: any;
  currentUserId: number;
  onDecision: (decisionCode: string, updatedData: any) => void;
  onValidate?: (isValid: boolean, errors: string[]) => void;
}

export default function MedicalApprovalManager({
  orderData,
  currentUserId,
  onDecision,
  onValidate
}: MedicalApprovalManagerProps) {
  const [availableDecisions, setAvailableDecisions] = useState<MedicalApprovalDecision[]>([]);
  const [unavailableDecisions, setUnavailableDecisions] = useState<Array<{ decision: MedicalApprovalDecision; reason: string }>>([]);
  const [selectedDecision, setSelectedDecision] = useState<MedicalApprovalDecision | null>(null);
  const [decisionData, setDecisionData] = useState<any>({});
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[]; warnings: string[] } | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { isMobile } = useResponsive();
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    const available = getAvailableMedicalApprovalDecisions(orderData);
    const unavailable = getUnavailableMedicalApprovalDecisions(orderData);
    
    setAvailableDecisions(available);
    setUnavailableDecisions(unavailable);
  }, [orderData]);

  const handleDecisionClick = (decision: MedicalApprovalDecision) => {
    setSelectedDecision(decision);
    setDecisionData({});
    setShowDetails(true);
    setValidationResult(null);
  };

  const handleFieldChange = (field: string, value: any) => {
    const newData = { ...decisionData, [field]: value };
    setDecisionData(newData);
    
    // Валидация в реальном времени
    if (selectedDecision) {
      const result = validateMedicalApprovalDecision(selectedDecision.code, { ...orderData, ...newData });
      setValidationResult(result);
      if (onValidate) {
        onValidate(result.isValid, result.errors);
      }
    }
  };

  const handleValidateDecision = () => {
    if (selectedDecision) {
      const result = validateMedicalApprovalDecision(selectedDecision.code, { ...orderData, ...decisionData });
      setValidationResult(result);
      if (onValidate) {
        onValidate(result.isValid, result.errors);
      }
    }
  };

  const handleApplyDecision = () => {
    if (selectedDecision) {
      const result = applyMedicalApprovalDecision(selectedDecision.code, { ...orderData, ...decisionData }, currentUserId);
      
      if (result.success) {
        onDecision(selectedDecision.code, result.updatedData);
        setShowDetails(false);
        setSelectedDecision(null);
        setDecisionData({});
        setShowEffects(false);
      } else {
        console.error('Ошибка применения решения:', result.effects);
      }
    }
  };

  const getDecisionIcon = (decision: MedicalApprovalDecision) => {
    switch (decision.code) {
      case 'APPROVE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECT':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'REQUEST_INFO':
        return <MessageSquare className="h-4 w-4 text-yellow-600" />;
      default:
        return <UserCheck className="h-4 w-4 text-blue-600" />;
    }
  };

  const getDecisionColor = (decision: MedicalApprovalDecision) => {
    switch (decision.code) {
      case 'APPROVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REQUEST_INFO':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'ON_APPROVAL': 'bg-yellow-100 text-yellow-800',
      'IN_PRODUCTION': 'bg-green-100 text-green-800',
      'NEW': 'bg-blue-100 text-blue-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Информация о заказе */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о заказе</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Номер заказа:</label>
            <div className="text-sm text-gray-900">{orderData.number || 'N/A'}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Статус:</label>
            <div className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData.status)}`}>
                {orderData.status}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Тип услуги:</label>
            <div className="text-sm text-gray-900">{orderData.service_type || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Доступные решения */}
      {availableDecisions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Доступные решения</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableDecisions.map((decision) => (
              <div
                key={decision.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:shadow-md ${getDecisionColor(decision)}`}
                onClick={() => handleDecisionClick(decision)}
              >
                <div className="flex items-start space-x-3">
                  {getDecisionIcon(decision)}
                  <div className="flex-1">
                    <h4 className="font-medium">{decision.name}</h4>
                    <p className="text-sm opacity-75 mt-1">{decision.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs opacity-60">
                        {decision.requiredFields.length} обязательных полей
                      </span>
                      <span className="text-xs opacity-60">•</span>
                      <span className="text-xs opacity-60">
                        {decision.effects.length} эффектов
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Недоступные решения */}
      {unavailableDecisions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Недоступные решения</h3>
          <div className="space-y-2">
            {unavailableDecisions.map(({ decision, reason }) => (
              <div
                key={decision.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50 opacity-60"
              >
                <XCircle className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500">
                    {decision.name}
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

      {/* Нет доступных решений */}
      {availableDecisions.length === 0 && unavailableDecisions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Pause className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Нет доступных решений для данного заказа</p>
        </div>
      )}

      {/* Модальное окно выбора решения */}
      {showDetails && selectedDecision && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedDecision.name}
            </h3>
            
            <div className="space-y-6">
              {/* Описание решения */}
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getDecisionColor(selectedDecision)}`}>
                  {getDecisionIcon(selectedDecision)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{selectedDecision.description}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    ID: {selectedDecision.id} | Код: {selectedDecision.code}
                  </p>
                </div>
              </div>

              {/* Условия */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Условия выполнения:</h5>
                <div className="space-y-2">
                  {selectedDecision.conditions.map((condition, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="mt-1">
                        {condition.isRequired ? (
                          <CheckCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
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

              {/* Эффекты */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700">Эффекты решения:</h5>
                  <button
                    onClick={() => setShowEffects(!showEffects)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    {showEffects ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="text-sm">{showEffects ? 'Скрыть' : 'Показать'}</span>
                  </button>
                </div>
                {showEffects && (
                  <div className="space-y-2">
                    {selectedDecision.effects.map((effect, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{effect.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Форма ввода данных */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Дополнительные данные:</h5>
                <div className="space-y-3">
                  {selectedDecision.requiredFields.map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field} <span className="text-red-500">*</span>
                      </label>
                      {field.includes('reason') || field.includes('notes') ? (
                        <textarea
                          value={decisionData[field] || ''}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder={`Введите ${field}`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={decisionData[field] || ''}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Введите ${field}`}
                        />
                      )}
                    </div>
                  ))}
                  {selectedDecision.optionalFields.map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={decisionData[field] || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Введите ${field}`}
                      />
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
                      {validationResult.isValid ? 'Решение валидно' : 'Ошибки валидации'}
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
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleValidateDecision}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
              >
                Проверить
              </button>
              <button
                onClick={handleApplyDecision}
                disabled={validationResult && !validationResult.isValid}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Применить решение
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
