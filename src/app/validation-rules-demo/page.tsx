'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ValidationRulesManager from '@/components/ValidationRulesManager';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Save,
  FileText,
  Code,
  Zap,
  Settings,
  Database,
  AlertCircle,
  TrendingUp,
  BarChart3,
  RefreshCw
} from 'lucide-react';

export default function ValidationRulesDemoPage() {
  const [demoData, setDemoData] = useState<any>({});
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [demoMode, setDemoMode] = useState<'empty' | 'valid' | 'invalid' | 'mixed'>('empty');
  const [showData, setShowData] = useState(false);

  const validData = {
    service: {
      service_type: 'PROSTHESIS',
      quantity: 1,
      urgency_id: 'NORMAL'
    },
    order: {
      device_type_r_id: 1,
      device_type_l_id: 1,
      hospitalized: false,
      urgent_reason: null
    },
    diagnosis: {
      diagnosis_type: 'S78.1',
      side_id: 'BOTH'
    },
    status: 'NEW',
    status_history: [],
    primary_diagnosis_id: 1,
    diagnosis_cart_id: 1,
    service_cart_id: 1
  };

  const invalidData = {
    service: {
      service_type: 'PROSTHESIS',
      quantity: 1,
      urgency_id: 'URGENT'
    },
    order: {
      device_type_r_id: null,
      device_type_l_id: null,
      hospitalized: false,
      urgent_reason: null
    },
    diagnosis: {
      diagnosis_type: 'M25.5',
      side_id: 'BOTH'
    },
    status: 'WAREHOUSE',
    status_history: [],
    primary_diagnosis_id: 1,
    diagnosis_cart_id: 2,
    service_cart_id: 1
  };

  const mixedData = {
    service: {
      service_type: 'SHOES',
      quantity: 1,
      urgency_id: 'URGENT'
    },
    order: {
      device_type_r_id: 3,
      device_type_l_id: 3,
      hospitalized: false,
      urgent_reason: 'Срочная необходимость'
    },
    diagnosis: {
      diagnosis_type: 'M25.5',
      side_id: 'BOTH'
    },
    status: 'NEW',
    status_history: [],
    primary_diagnosis_id: 1,
    diagnosis_cart_id: 1,
    service_cart_id: 1
  };

  const handleValidationChange = (results: any[], valid: boolean) => {
    setValidationResults(results);
    setIsValid(valid);
  };

  const handleRuleViolation = (rule: any, result: any) => {
    console.log('Rule violation:', rule.id, result);
  };

  const loadDemoData = (mode: 'empty' | 'valid' | 'invalid' | 'mixed') => {
    setDemoMode(mode);
    
    switch (mode) {
      case 'empty':
        setDemoData({});
        break;
      case 'valid':
        setDemoData(validData);
        break;
      case 'invalid':
        setDemoData(invalidData);
        break;
      case 'mixed':
        setDemoData(mixedData);
        break;
    }
  };

  const resetData = () => {
    setDemoData({});
    setValidationResults([]);
    setIsValid(true);
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Демонстрация правил валидации</h1>
            <p className="text-gray-600">Контроль допустимых комбинаций</p>
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
                onClick={() => loadDemoData('valid')}
                className={`px-3 py-1 text-sm rounded-md ${
                  demoMode === 'valid' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Валидные данные
              </button>
              <button
                onClick={() => loadDemoData('invalid')}
                className={`px-3 py-1 text-sm rounded-md ${
                  demoMode === 'invalid' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Невалидные данные
              </button>
              <button
                onClick={() => loadDemoData('mixed')}
                className={`px-3 py-1 text-sm rounded-md ${
                  demoMode === 'mixed' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Смешанные данные
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(demoData).length}
              </div>
              <div className="text-sm text-gray-600">Структур данных</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {validationResults.filter(r => r.isValid).length}
              </div>
              <div className="text-sm text-gray-600">Соблюдено правил</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {validationResults.filter(r => !r.isValid).length}
              </div>
              <div className="text-sm text-gray-600">Нарушено правил</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor(isValid)}`}>
                {isValid ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Общий статус</div>
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

          {validationResults.length > 0 && (
            <div className="space-y-3">
              {validationResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${
                    result.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(result.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{result.ruleId}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.severity}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{result.message}</p>
                      {result.affectedFields && result.affectedFields.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-600">Затронутые поля: </span>
                          <span className="text-xs text-gray-800">
                            {result.affectedFields.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Менеджер правил */}
        <div className="card p-6">
          <ValidationRulesManager
            data={demoData}
            onValidationChange={handleValidationChange}
            onRuleViolation={handleRuleViolation}
          />
        </div>

        {/* Отображение данных */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Демо-данные</h3>
            <button
              onClick={() => setShowData(!showData)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              {showData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showData ? 'Скрыть' : 'Показать'} данные</span>
            </button>
          </div>

          {showData && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(demoData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Информация о правилах */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о правилах</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Реализованные правила</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>R1: Диагноз ампутации для протеза</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>R2: Количество обуви для обеих сторон</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>R3: Причина срочности обязательна</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>R4: Примерка перед складом</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>R5: Статус заказа для накладной</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>R6: Соответствие диагноза пациенту</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Особенности</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Валидация в реальном времени</div>
                <div>• Многоуровневая проверка условий</div>
                <div>• UI индикаторы для нарушений</div>
                <div>• Рекомендации по исправлению</div>
                <div>• Статистика соблюдения правил</div>
                <div>• Поддержка различных типов данных</div>
                <div>• Гибкая система условий</div>
                <div>• Автоматическое применение эффектов</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Статистика</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-sm text-gray-600">Правил валидации</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Уровня серьезности</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">4</div>
                <div className="text-sm text-gray-600">Режима демо</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">6</div>
                <div className="text-sm text-gray-600">Категорий правил</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
