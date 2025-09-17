'use client';

import React, { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import UIFieldBindingManager from '@/components/UIFieldBindingManager';
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
  Info,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export default function UIBindingDemoPage() {
  const [formData, setFormData] = useState<any>({});
  const [storageData, setStorageData] = useState<any>({});
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [demoMode, setDemoMode] = useState<'empty' | 'sample' | 'complex'>('empty');

  const sampleData = {
    service: {
      service_type_id: 'PROSTHESIS',
      quantity: 2,
      urgency_id: 'NORMAL'
    },
    order: {
      device_type_r_id: 1,
      device_type_l_id: 1,
      hospitalized: true,
      urgent_reason: null
    },
    diagnosis: {
      diagnosis_type_id: 1,
      side_id: 'BOTH'
    },
    order_measurements: [
      {
        type: 'LENGTH',
        value: 25.5,
        unit: 'CM',
        side: 'LEFT'
      },
      {
        type: 'CIRCUMFERENCE',
        value: 15.2,
        unit: 'CM',
        side: 'RIGHT'
      }
    ]
  };

  const complexData = {
    service: {
      service_type_id: 'SHOES',
      quantity: 1,
      urgency_id: 'URGENT'
    },
    order: {
      device_type_r_id: 3,
      device_type_l_id: 3,
      hospitalized: false,
      urgent_reason: 'Срочная необходимость в ортопедической обуви'
    },
    diagnosis: {
      diagnosis_type_id: 2,
      side_id: 'LEFT'
    },
    order_measurements: [
      {
        type: 'LENGTH',
        value: 28.0,
        unit: 'CM',
        side: 'LEFT'
      },
      {
        type: 'WIDTH',
        value: 10.5,
        unit: 'CM',
        side: 'LEFT'
      },
      {
        type: 'HEIGHT',
        value: 12.0,
        unit: 'CM',
        side: 'LEFT'
      }
    ]
  };

  const handleDataChange = useCallback((newFormData: any, newStorageData: any) => {
    setFormData(newFormData);
    setStorageData(newStorageData);
  }, []);

  const handleValidationChange = useCallback((valid: boolean, errors: string[]) => {
    setIsValid(valid);
    setValidationErrors(errors);
  }, []);

  const loadDemoData = (mode: 'empty' | 'sample' | 'complex') => {
    setDemoMode(mode);
    
    switch (mode) {
      case 'empty':
        setFormData({});
        setStorageData({});
        break;
      case 'sample':
        setFormData(sampleData);
        setStorageData(sampleData);
        break;
      case 'complex':
        setFormData(complexData);
        setStorageData(complexData);
        break;
    }
  };

  const resetData = () => {
    setFormData({});
    setStorageData({});
    setValidationErrors([]);
    setIsValid(true);
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Демонстрация привязок UI</h1>
            <p className="text-gray-600">Привязка полей формы к структуре хранилища</p>
          </div>
        </div>

        {/* Управление демо-данными */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Управление демо-данными</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => loadDemoData('empty')}
                className={`px-3 py-1 text-sm rounded-md ${
                  demoMode === 'empty' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Пустые данные
              </button>
              <button
                onClick={() => loadDemoData('sample')}
                className={`px-3 py-1 text-sm rounded-md ${
                  demoMode === 'sample' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Пример данных
              </button>
              <button
                onClick={() => loadDemoData('complex')}
                className={`px-3 py-1 text-sm rounded-md ${
                  demoMode === 'complex' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Сложные данные
              </button>
              <button
                onClick={resetData}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                <RefreshCw className="h-4 w-4 inline-block mr-1" />
                Сбросить
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(formData).length}
              </div>
              <div className="text-sm text-gray-600">Поля формы</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(storageData).length}
              </div>
              <div className="text-sm text-gray-600">Структуры хранилища</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor(isValid)}`}>
                {validationErrors.length}
              </div>
              <div className="text-sm text-gray-600">Ошибок валидации</div>
            </div>
          </div>
        </div>

        {/* Статус валидации */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Статус валидации</h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(isValid)}
              <span className={`font-medium ${getStatusColor(isValid)}`}>
                {isValid ? 'Валидация пройдена' : 'Ошибки валидации'}
              </span>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Ошибки валидации:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <XCircle className="h-3 w-3 text-red-500" />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Менеджер привязок */}
        <div className="card p-6">
          <UIFieldBindingManager
            initialData={storageData}
            onDataChange={handleDataChange}
            onValidationChange={handleValidationChange}
          />
        </div>

        {/* Сравнение данных */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Сравнение данных</h3>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              {showComparison ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showComparison ? 'Скрыть' : 'Показать'} сравнение</span>
            </button>
          </div>

          {showComparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          )}
        </div>

        {/* Информация о привязках */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о привязках</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Поддерживаемые поля</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Тип заказа (service_type)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Количество (quantity)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Тип изделия (device_type)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Тип диагноза (diagnosis_type)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Сторона диагноза (side)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Госпитализация (hospitalized)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Срочность (urgency)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Измерения (measurements)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Особенности</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Автоматическое преобразование типов данных</div>
                <div>• Валидация в реальном времени</div>
                <div>• Условная видимость полей</div>
                <div>• Поддержка справочников</div>
                <div>• Двустороннее преобразование данных</div>
                <div>• Проверка зависимостей между полями</div>
                <div>• Логирование ошибок валидации</div>
                <div>• Поддержка сложных структур данных</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Статистика</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">Типов полей</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">6</div>
                <div className="text-sm text-gray-600">Справочников</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-gray-600">Режима демо</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div className="text-sm text-gray-600">Направления преобразования</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
