'use client';

import React, { useState, useEffect } from 'react';
import { 
  OverheadType, 
  OVERHEAD_TYPES, 
  getOverheadType, 
  validateOverheadType 
} from '@/constants/overhead-transitions';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Shoe,
  Wrench,
  Stethoscope,
  FileText
} from 'lucide-react';

interface OverheadTypeManagerProps {
  onSelectType?: (type: OverheadType) => void;
  onValidate?: (isValid: boolean, errors: string[]) => void;
  initialData?: Record<string, any>;
}

export default function OverheadTypeManager({
  onSelectType,
  onValidate,
  initialData = {}
}: OverheadTypeManagerProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[]; warnings: string[] } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getTypeIcon = (typeCode: string) => {
    const icons: Record<string, any> = {
      'PROSTHESIS': Package,
      'SHOES': Shoe,
      'OTTO': Stethoscope,
      'REPAIR': Wrench
    };
    return icons[typeCode] || FileText;
  };

  const getTypeColor = (typeCode: string) => {
    const colors: Record<string, string> = {
      'PROSTHESIS': 'bg-blue-100 text-blue-800',
      'SHOES': 'bg-green-100 text-green-800',
      'OTTO': 'bg-purple-100 text-purple-800',
      'REPAIR': 'bg-orange-100 text-orange-800'
    };
    return colors[typeCode] || 'bg-gray-100 text-gray-800';
  };

  const handleTypeSelect = (typeCode: string) => {
    setSelectedType(typeCode);
    setFormData({});
    setValidationResult(null);
  };

  const handleFieldChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Валидация в реальном времени
    if (selectedType) {
      const result = validateOverheadType(selectedType, newFormData);
      setValidationResult(result);
      if (onValidate) {
        onValidate(result.isValid, result.errors);
      }
    }
  };

  const handleValidateType = () => {
    if (selectedType) {
      const result = validateOverheadType(selectedType, formData);
      setValidationResult(result);
      if (onValidate) {
        onValidate(result.isValid, result.errors);
      }
    }
  };

  const handleSelectType = () => {
    if (selectedType) {
      const type = getOverheadType(selectedType);
      if (type && onSelectType) {
        onSelectType(type);
      }
    }
  };

  const getCurrentType = (): OverheadType | undefined => {
    if (selectedType) {
      return getOverheadType(selectedType);
    }
    return undefined;
  };

  const currentType = getCurrentType();

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center space-x-3">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Типы накладных</h2>
      </div>

      {/* Выбор типа накладной */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Выберите тип накладной</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {OVERHEAD_TYPES.map((type) => {
            const Icon = getTypeIcon(type.code);
            return (
              <button
                key={type.code}
                onClick={() => handleTypeSelect(type.code)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedType === type.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.code}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Детали типа накладной */}
      {currentType && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Детали типа накладной</h3>
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
              <div className={`p-3 rounded-lg ${getTypeColor(currentType.code)}`}>
                {React.createElement(getTypeIcon(currentType.code), { className: "h-6 w-6" })}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">{currentType.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{currentType.description}</p>
                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-700">Код: </span>
                  <span className="text-sm text-gray-600">{currentType.code}</span>
                </div>
              </div>
            </div>

            {showDetails && (
              <div className="mt-6 space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Обязательные поля:</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentType.requiredFields.map((field) => (
                      <span key={field} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Дополнительные поля:</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentType.optionalFields.map((field) => (
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
      {currentType && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Заполните данные накладной</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Общие поля */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер накладной <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.number || ''}
                onChange={(e) => handleFieldChange('number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите номер накладной"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата накладной <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название мастерской <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.shop_name || ''}
                onChange={(e) => handleFieldChange('shop_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите название мастерской"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип накладной <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type || selectedType}
                onChange={(e) => handleFieldChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите тип</option>
                {OVERHEAD_TYPES.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Специфичные поля для типа */}
            {currentType.requiredFields.map((field) => (
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

            {currentType.optionalFields.map((field) => (
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
              {validationResult.isValid ? 'Тип накладной валиден' : 'Ошибки валидации'}
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
      {currentType && (
        <div className="flex space-x-3">
          <button
            onClick={handleValidateType}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Проверить</span>
          </button>
          <button
            onClick={handleSelectType}
            disabled={!validationResult?.isValid}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>Выбрать тип</span>
          </button>
        </div>
      )}
    </div>
  );
}
