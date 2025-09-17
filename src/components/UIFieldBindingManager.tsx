'use client';

import React, { useState, useEffect } from 'react';
import { 
  UIFieldBinding, 
  DictionaryValue,
  UI_FIELD_BINDINGS,
  UI_FIELD_DICTIONARIES,
  getUIFieldBinding,
  getDictionaryValues,
  validateUIField,
  transformUIFieldValue,
  checkFieldConditions,
  getFieldDependencies,
  getRequiredFields,
  getVisibleFields,
  transformFormToStorage,
  transformStorageToForm
} from '@/constants/ui-field-bindings';
import { 
  Settings, 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Save,
  FileText,
  Code,
  Zap,
  Shield,
  Info
} from 'lucide-react';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';

interface UIFieldBindingManagerProps {
  initialData?: any;
  onDataChange?: (formData: any, storageData: any) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export default function UIFieldBindingManager({
  initialData = {},
  onDataChange,
  onValidationChange
}: UIFieldBindingManagerProps) {
  const [formData, setFormData] = useState<any>(initialData);
  const [storageData, setStorageData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showStorageData, setShowStorageData] = useState(false);
  const { isMobile } = useResponsive();
  const [showValidation, setShowValidation] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'bindings' | 'validation' | 'transform'>('form');

  useEffect(() => {
    // Преобразуем данные хранилища в форму при инициализации
    if (Object.keys(initialData).length > 0) {
      const transformedData = transformStorageToForm(initialData);
      setFormData(transformedData);
      setStorageData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    // Преобразуем данные формы в структуру хранилища
    const transformedStorage = transformFormToStorage(formData);
    setStorageData(transformedStorage);
    
    if (onDataChange) {
      onDataChange(formData, transformedStorage);
    }
  }, [formData]); // Убираем onDataChange из зависимостей

  useEffect(() => {
    // Валидация полей
    const errors: Record<string, string> = {};
    const visibleFields = getVisibleFields(formData);
    
    visibleFields.forEach(fieldId => {
      const value = formData[fieldId];
      const validation = validateUIField(fieldId, value);
      
      if (!validation.isValid) {
        errors[fieldId] = validation.message || 'Ошибка валидации';
      }
    });
    
    setValidationErrors(errors);
    
    if (onValidationChange) {
      const isValid = Object.keys(errors).length === 0;
      onValidationChange(isValid, Object.values(errors));
    }
  }, [formData]); // Убираем onValidationChange из зависимостей

  const handleFieldChange = (fieldId: string, value: any) => {
    const binding = getUIFieldBinding(fieldId);
    if (!binding) return;

    // Проверяем условия видимости поля
    if (!checkFieldConditions(fieldId, { ...formData, [fieldId]: value })) {
      return;
    }

    // Преобразуем значение
    const transformedValue = transformUIFieldValue(fieldId, value, 'input');
    
    setFormData(prev => ({
      ...prev,
      [fieldId]: transformedValue
    }));
  };

  const handleDictionaryChange = (fieldId: string, value: string | number) => {
    handleFieldChange(fieldId, value);
  };

  const getFieldValidationStatus = (fieldId: string) => {
    const error = validationErrors[fieldId];
    if (error) {
      return { status: 'error', message: error };
    }
    
    const binding = getUIFieldBinding(fieldId);
    if (binding?.validation?.required && !formData[fieldId]) {
      return { status: 'warning', message: 'Поле обязательно для заполнения' };
    }
    
    return { status: 'success', message: 'Поле корректно' };
  };

  const getFieldIcon = (fieldId: string) => {
    const validation = getFieldValidationStatus(fieldId);
    
    switch (validation.status) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderField = (binding: UIFieldBinding) => {
    const value = formData[binding.id] || '';
    const validation = getFieldValidationStatus(binding.id);
    const dictionary = binding.dictionary ? getDictionaryValues(binding.dictionary) : [];
    const isVisible = checkFieldConditions(binding.id, formData);

    if (!isVisible) {
      return null;
    }

    return (
      <div key={binding.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {binding.uiField}
          {binding.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="flex items-center space-x-2">
          {getFieldIcon(binding.id)}
          
          {binding.dataType === 'boolean' ? (
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(binding.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          ) : binding.dataType === 'number' ? (
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(binding.id, e.target.value)}
              min={binding.validation?.min}
              max={binding.validation?.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : dictionary.length > 0 ? (
            <select
              value={value}
              onChange={(e) => handleDictionaryChange(binding.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите значение</option>
              {dictionary.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(binding.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
        
        {validation.message && (
          <p className={`text-xs ${
            validation.status === 'error' ? 'text-red-600' : 
            validation.status === 'warning' ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {validation.message}
          </p>
        )}
        
        <div className="text-xs text-gray-500">
          Путь: {binding.storagePath} | Тип: {binding.dataType}
          {binding.dictionary && ` | Справочник: ${binding.dictionary}`}
        </div>
      </div>
    );
  };

  const renderBindingsTable = () => {
    return (
      {isMobile ? (
            // Мобильное отображение в виде карточек
            <MobileCardView
              data={data}
              columns={columns}
            />
          ) : (
            // Десктопное отображение в виде таблицы
            <ResponsiveTable>
          <ResponsiveTableHeader>
            <ResponsiveTableRow>
              <ResponsiveTableCell isHeader >
                UI Поле
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader >
                Хранилище
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader >
                Справочник
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader >
                Тип данных
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader >
                Валидация
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader >
                Статус
              </ResponsiveTableCell>
            </ResponsiveTableRow>
          </ResponsiveTableHeader>
          <ResponsiveTableBody>
            {UI_FIELD_BINDINGS.map((binding) => {
              const validation = getFieldValidationStatus(binding.id);
              const isVisible = checkFieldConditions(binding.id, formData);
              
              return (
                <ResponsiveTableRow key={binding.id} className={isVisible ? '' : 'opacity-50'}>
                  <ResponsiveTableCell className="font-medium text-gray-900">
                    {binding.uiField}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {binding.storagePath}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {binding.dictionary || '-'}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {binding.dataType}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {binding.validation?.required ? 'Обязательное' : 'Опциональное'}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      {getFieldIcon(binding.id)}
                      <span className={`text-xs ${
                        validation.status === 'error' ? 'text-red-600' : 
                        validation.status === 'warning' ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {validation.status}
                      </span>
                    </div>
                  </ResponsiveTableCell>
                </ResponsiveTableRow>
              );
            })}
          </ResponsiveTableBody>
        </ResponsiveTable>
          )}
    );
  };

  const renderValidationSummary = () => {
    const totalFields = UI_FIELD_BINDINGS.length;
    const visibleFields = getVisibleFields(formData).length;
    const requiredFields = getRequiredFields(formData).length;
    const errorFields = Object.keys(validationErrors).length;
    const validFields = visibleFields - errorFields;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalFields}</div>
            <div className="text-sm text-gray-600">Всего полей</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{visibleFields}</div>
            <div className="text-sm text-gray-600">Видимых</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{requiredFields}</div>
            <div className="text-sm text-gray-600">Обязательных</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{errorFields}</div>
            <div className="text-sm text-gray-600">Ошибок</div>
          </div>
        </div>

        {errorFields > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Ошибки валидации:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(validationErrors).map(([fieldId, error]) => (
                <li key={fieldId} className="flex items-center space-x-2">
                  <XCircle className="h-3 w-3 text-red-500" />
                  <span>{fieldId}: {error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderTransformData = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Данные формы</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Данные хранилища</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(storageData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Управление привязками UI</h2>
            <p className="text-sm text-gray-600">Привязка полей формы к структуре хранилища</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStorageData(!showStorageData)}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            {showStorageData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showStorageData ? 'Скрыть' : 'Показать'} хранилище</span>
          </button>
        </div>
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'form', name: 'Форма', icon: FileText },
            { id: 'bindings', name: 'Привязки', icon: Database },
            { id: 'validation', name: 'Валидация', icon: Shield },
            { id: 'transform', name: 'Преобразование', icon: Zap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Содержимое табов */}
      <div className="space-y-6">
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UI_FIELD_BINDINGS.map(renderField)}
          </div>
        )}

        {activeTab === 'bindings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Таблица привязок</h3>
            {renderBindingsTable()}
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Валидация полей</h3>
            {renderValidationSummary()}
          </div>
        )}

        {activeTab === 'transform' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Преобразование данных</h3>
            {renderTransformData()}
          </div>
        )}
      </div>

      {/* Отображение данных хранилища */}
      {showStorageData && (
        <div className="card p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Данные хранилища</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <pre className="text-xs text-gray-700 overflow-x-auto">
              {JSON.stringify(storageData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
