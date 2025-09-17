'use client';

import React, { useState, useEffect } from 'react';
import { 
  ServiceCombination, 
  SERVICE_COMBINATIONS, 
  getServiceCombination, 
  validateServiceCombination 
} from '@/constants/service-order-combinations';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  Package,
  Shoe,
  Wrench,
  Stethoscope
} from 'lucide-react';

interface ServiceCombinationManagerProps {
  onSelectCombination?: (combination: ServiceCombination) => void;
  onValidate?: (isValid: boolean, errors: string[]) => void;
  initialData?: Record<string, any>;
}

export default function ServiceCombinationManager({
  onSelectCombination,
  onValidate,
  initialData = {}
}: ServiceCombinationManagerProps) {
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [selectedDiagnosisType, setSelectedDiagnosisType] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[]; warnings: string[] } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const serviceTypes = [
    { value: 'PROSTHESIS', label: 'Протез', icon: Package, color: 'bg-blue-100 text-blue-800' },
    { value: 'SHOES', label: 'Обувь', icon: Shoe, color: 'bg-green-100 text-green-800' },
    { value: 'OTTO', label: 'Отто', icon: Stethoscope, color: 'bg-purple-100 text-purple-800' },
    { value: 'REPAIR', label: 'Ремонт', icon: Wrench, color: 'bg-orange-100 text-orange-800' }
  ];

  const diagnosisTypes = [
    { value: 'ампутационные (МКБ S78., Z89.)', label: 'Ампутационные (S78., Z89.)' },
    { value: 'ортопедич. патологии стопы (Q66., M21.)', label: 'Ортопедические патологии стопы (Q66., M21.)' },
    { value: 'согласно каталогу', label: 'Согласно каталогу' },
    { value: 'любой предыдущий заказ/изделие', label: 'Любой предыдущий заказ/изделие' }
  ];

  const sides = [
    { value: 'LEFT', label: 'Левая' },
    { value: 'RIGHT', label: 'Правая' },
    { value: 'BOTH', label: 'Обе' }
  ];

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service?.icon || Package;
  };

  const getServiceColor = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.color : 'bg-gray-100 text-gray-800';
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    setSelectedDiagnosisType('');
    setSelectedSide('');
    setFormData({});
    setValidationResult(null);
  };

  const handleDiagnosisTypeChange = (diagnosisType: string) => {
    setSelectedDiagnosisType(diagnosisType);
    setSelectedSide('');
    setFormData({});
    setValidationResult(null);
  };

  const handleSideChange = (side: string) => {
    setSelectedSide(side);
    setFormData({});
    setValidationResult(null);
  };

  const handleFieldChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Валидация в реальном времени
    if (selectedServiceType && selectedDiagnosisType) {
      const result = validateServiceCombination(selectedServiceType, selectedDiagnosisType, newFormData);
      setValidationResult(result);
      if (onValidate) {
        onValidate(result.isValid, result.errors);
      }
    }
  };

  const handleValidateCombination = () => {
    if (selectedServiceType && selectedDiagnosisType) {
      const result = validateServiceCombination(selectedServiceType, selectedDiagnosisType, formData);
      setValidationResult(result);
      if (onValidate) {
        onValidate(result.isValid, result.errors);
      }
    }
  };

  const handleSelectCombination = () => {
    if (selectedServiceType && selectedDiagnosisType) {
      const combination = getServiceCombination(selectedServiceType, selectedDiagnosisType);
      if (combination && onSelectCombination) {
        onSelectCombination(combination);
      }
    }
  };

  const getCurrentCombination = (): ServiceCombination | undefined => {
    if (selectedServiceType && selectedDiagnosisType) {
      return getServiceCombination(selectedServiceType, selectedDiagnosisType);
    }
    return undefined;
  };

  const currentCombination = getCurrentCombination();

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center space-x-3">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Комбинации услуг/заказов</h2>
      </div>

      {/* Выбор типа услуги */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">1. Выберите тип услуги</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceTypes.map((service) => {
            const Icon = service.icon || Package; // Fallback to Package icon
            return (
              <button
                key={service.value}
                onClick={() => handleServiceTypeChange(service.value)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedServiceType === service.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{service.label}</div>
                    <div className="text-sm text-gray-500">{service.value}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Выбор типа диагноза */}
      {selectedServiceType && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">2. Выберите тип диагноза</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosisTypes.map((diagnosis) => (
              <button
                key={diagnosis.value}
                onClick={() => handleDiagnosisTypeChange(diagnosis.value)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedDiagnosisType === diagnosis.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900">{diagnosis.label}</div>
                <div className="text-sm text-gray-500">{diagnosis.value}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Выбор стороны */}
      {currentCombination && currentCombination.side !== '—' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">3. Выберите сторону</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sides.map((side) => (
              <button
                key={side.value}
                onClick={() => handleSideChange(side.value)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedSide === side.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900">{side.label}</div>
                <div className="text-sm text-gray-500">{side.value}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Детали комбинации */}
      {currentCombination && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">4. Детали комбинации</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Eye className="h-4 w-4" />
              <span>{showDetails ? 'Скрыть' : 'Показать'} детали</span>
            </button>
          </div>

          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${getServiceColor(currentCombination?.serviceType || '')}`}>
                {React.createElement(getServiceIcon(currentCombination?.serviceType || '') || Package, { className: "h-6 w-6" })}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">{currentCombination?.description}</h4>
                <p className="text-sm text-gray-600 mt-1">{currentCombination?.note}</p>
                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-700">ID: </span>
                  <span className="text-sm text-gray-600">{currentCombination?.id}</span>
                </div>
              </div>
            </div>

            {showDetails && (
              <div className="mt-6 space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Обязательные поля:</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentCombination?.requiredFields?.map((field) => (
                      <span key={field} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Дополнительные поля:</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentCombination?.optionalFields?.map((field) => (
                      <span key={field} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Форма ввода данных */}
      {currentCombination && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">5. Заполните данные</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCombination?.requiredFields?.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData[field] || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Введите ${field}`}
                />
              </div>
            ))}
            {currentCombination?.optionalFields?.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field}
                </label>
                <input
                  type="text"
                  value={formData[field] || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Введите ${field}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

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
              {validationResult.isValid ? 'Комбинация валидна' : 'Ошибки валидации'}
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

      {/* Кнопки действий */}
      {currentCombination && (
        <div className="flex space-x-3">
          <button
            onClick={handleValidateCombination}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Проверить</span>
          </button>
          <button
            onClick={handleSelectCombination}
            disabled={!validationResult?.isValid}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>Выбрать комбинацию</span>
          </button>
        </div>
      )}
    </div>
  );
}
