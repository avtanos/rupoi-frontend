'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { CheckCircle, XCircle, AlertTriangle, Database } from 'lucide-react';

interface ValidationResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export default function DataValidationTest() {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runValidationTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests: ValidationResult[] = [];

    try {
      // Тест 1: Проверка областей
      const oblasts = await apiClient.getOblasts();
      tests.push({
        test: 'Области загружаются',
        status: Array.isArray(oblasts) && oblasts.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${Array.isArray(oblasts) ? oblasts.length : 0} областей`
      });

      // Тест 2: Проверка структуры области
      if (Array.isArray(oblasts) && oblasts.length > 0) {
        const oblast = oblasts[0];
        const hasRequiredFields = oblast.id && oblast.name && oblast.code;
        tests.push({
          test: 'Структура области корректна',
          status: hasRequiredFields ? 'pass' : 'fail',
          message: hasRequiredFields ? 'Все обязательные поля присутствуют' : 'Отсутствуют обязательные поля'
        });
      }

      // Тест 3: Проверка районов
      const raions = await apiClient.getRaions(1);
      tests.push({
        test: 'Районы загружаются',
        status: Array.isArray(raions) && raions.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${Array.isArray(raions) ? raions.length : 0} районов`
      });

      // Тест 4: Проверка связей районов с областями
      if (Array.isArray(raions) && raions.length > 0) {
        const raion = raions[0];
        const hasOblastLink = raion.oblast !== undefined;
        tests.push({
          test: 'Районы связаны с областями',
          status: hasOblastLink ? 'pass' : 'fail',
          message: hasOblastLink ? 'Связь с областью присутствует' : 'Отсутствует связь с областью'
        });
      }

      // Тест 5: Проверка типов устройств
      const deviceTypes = await apiClient.getDeviceTypes();
      tests.push({
        test: 'Типы устройств загружаются',
        status: Array.isArray(deviceTypes) && deviceTypes.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${Array.isArray(deviceTypes) ? deviceTypes.length : 0} типов устройств`
      });

      // Тест 6: Проверка order_type в типах устройств
      if (Array.isArray(deviceTypes) && deviceTypes.length > 0) {
        const hasOrderType = deviceTypes.some(dt => dt.order_type !== undefined);
        tests.push({
          test: 'Типы устройств имеют order_type',
          status: hasOrderType ? 'pass' : 'warning',
          message: hasOrderType ? 'order_type присутствует' : 'order_type отсутствует (может быть нормально)'
        });
      }

      // Тест 7: Проверка материалов
      const materials = await apiClient.getMaterials();
      tests.push({
        test: 'Материалы загружаются',
        status: Array.isArray(materials) && materials.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${Array.isArray(materials) ? materials.length : 0} материалов`
      });

      // Тест 8: Проверка структуры материала
      if (Array.isArray(materials) && materials.length > 0) {
        const material = materials[0];
        const hasRequiredFields = material.id && material.name && material.code && material.unit && material.price;
        tests.push({
          test: 'Структура материала корректна',
          status: hasRequiredFields ? 'pass' : 'fail',
          message: hasRequiredFields ? 'Все обязательные поля присутствуют' : 'Отсутствуют обязательные поля'
        });
      }

      // Тест 9: Проверка новых справочников
      const priorityLevels = await apiClient.getPriorityLevels();
      tests.push({
        test: 'Уровни приоритета загружаются',
        status: Array.isArray(priorityLevels) && priorityLevels.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${Array.isArray(priorityLevels) ? priorityLevels.length : 0} уровней приоритета`
      });

      const documentTypes = await apiClient.getDocumentTypes();
      tests.push({
        test: 'Типы документов загружаются',
        status: Array.isArray(documentTypes) && documentTypes.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${Array.isArray(documentTypes) ? documentTypes.length : 0} типов документов`
      });

      // Тест 10: Проверка медицинских справочников
      const stumpForms = await apiClient.getStumpForms();
      tests.push({
        test: 'Формы культи загружаются',
        status: Array.isArray(stumpForms) && stumpForms.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${Array.isArray(stumpForms) ? stumpForms.length : 0} форм культи`
      });

      const scarTypes = await apiClient.getScarTypes();
      tests.push({
        test: 'Типы рубцов загружаются',
        status: Array.isArray(scarTypes) && scarTypes.length > 0 ? 'pass' : 'fail',
        message: `Найдено ${Array.isArray(scarTypes) ? scarTypes.length : 0} типов рубцов`
      });

    } catch (error) {
      tests.push({
        test: 'Общая проверка',
        status: 'fail',
        message: `Ошибка выполнения тестов: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    setResults(tests);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Валидация данных
        </h3>
        <button
          onClick={runValidationTests}
          disabled={isRunning}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Проверка...' : 'Запустить проверку'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{passCount}</div>
            <div className="text-sm text-green-800">Успешно</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600">{failCount}</div>
            <div className="text-sm text-red-800">Ошибки</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-yellow-800">Предупреждения</div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center">
              {getStatusIcon(result.status)}
              <span className="ml-2 font-medium text-gray-900">{result.test}</span>
            </div>
            <p className="ml-6 text-sm text-gray-600 mt-1">{result.message}</p>
          </div>
        ))}
      </div>

      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>Нажмите "Запустить проверку" для валидации данных</p>
        </div>
      )}
    </div>
  );
}
