'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';

interface IntegrationTestResult {
  test: string;
  status: 'loading' | 'success' | 'error';
  details: string;
  data?: any;
}

export default function IntegrationTest() {
  const [results, setResults] = useState<IntegrationTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runIntegrationTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests: IntegrationTestResult[] = [];

    // Тест 1: Проверка загрузки областей и их использования
    try {
      tests.push({
        test: 'Загрузка областей',
        status: 'loading',
        details: 'Загружаем области...'
      });

      const oblasts = await apiClient.getOblasts();
      const oblastsArray = Array.isArray(oblasts) ? oblasts : [];
      
      tests[0] = {
        test: 'Загрузка областей',
        status: oblastsArray.length > 0 ? 'success' : 'error',
        details: `Загружено ${oblastsArray.length} областей`,
        data: oblastsArray.slice(0, 3) // Показываем первые 3
      };
    } catch (error) {
      tests[0] = {
        test: 'Загрузка областей',
        status: 'error',
        details: `Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    // Тест 2: Проверка загрузки районов и их связи с областями
    try {
      tests.push({
        test: 'Загрузка районов',
        status: 'loading',
        details: 'Загружаем районы...'
      });

      const raions = await apiClient.getRaions();
      const raionsArray = Array.isArray(raions) ? raions : [];
      
      const raionsWithOblast = raionsArray.filter(r => r.oblast !== undefined);
      
      tests[1] = {
        test: 'Загрузка районов',
        status: raionsArray.length > 0 ? 'success' : 'error',
        details: `Загружено ${raionsArray.length} районов, ${raionsWithOblast.length} с привязкой к области`,
        data: raionsArray.slice(0, 3)
      };
    } catch (error) {
      tests[1] = {
        test: 'Загрузка районов',
        status: 'error',
        details: `Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    // Тест 3: Проверка типов устройств с order_type
    try {
      tests.push({
        test: 'Типы устройств с order_type',
        status: 'loading',
        details: 'Загружаем типы устройств...'
      });

      const deviceTypes = await apiClient.getDeviceTypes();
      const deviceTypesArray = Array.isArray(deviceTypes) ? deviceTypes : [];
      
      const withOrderType = deviceTypesArray.filter(dt => dt.order_type !== undefined);
      const groupedByOrderType = deviceTypesArray.reduce((acc, dt) => {
        const orderType = dt.order_type || 'unknown';
        acc[orderType] = (acc[orderType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      tests[2] = {
        test: 'Типы устройств с order_type',
        status: deviceTypesArray.length > 0 ? 'success' : 'error',
        details: `Загружено ${deviceTypesArray.length} типов устройств, ${withOrderType.length} с order_type. Группировка: ${JSON.stringify(groupedByOrderType)}`,
        data: deviceTypesArray.slice(0, 3)
      };
    } catch (error) {
      tests[2] = {
        test: 'Типы устройств с order_type',
        status: 'error',
        details: `Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    // Тест 4: Проверка материалов с ценами
    try {
      tests.push({
        test: 'Материалы с ценами',
        status: 'loading',
        details: 'Загружаем материалы...'
      });

      const materials = await apiClient.getMaterials();
      const materialsArray = Array.isArray(materials) ? materials : [];
      
      const withPrices = materialsArray.filter(m => m.price !== undefined && m.price > 0);
      const totalValue = materialsArray.reduce((sum, m) => sum + (m.price || 0), 0);
      
      tests[3] = {
        test: 'Материалы с ценами',
        status: materialsArray.length > 0 ? 'success' : 'error',
        details: `Загружено ${materialsArray.length} материалов, ${withPrices.length} с ценами. Общая стоимость: ${totalValue.toLocaleString()} сом`,
        data: materialsArray.slice(0, 3)
      };
    } catch (error) {
      tests[3] = {
        test: 'Материалы с ценами',
        status: 'error',
        details: `Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    // Тест 5: Проверка новых медицинских справочников
    try {
      tests.push({
        test: 'Медицинские справочники',
        status: 'loading',
        details: 'Загружаем медицинские справочники...'
      });

      const [stumpForms, scarTypes, skinConditions, boneDust] = await Promise.all([
        apiClient.getStumpForms(),
        apiClient.getScarTypes(),
        apiClient.getSkinConditionTypes(),
        apiClient.getBoneDustTypes()
      ]);

      const totalMedical = [
        Array.isArray(stumpForms) ? stumpForms.length : 0,
        Array.isArray(scarTypes) ? scarTypes.length : 0,
        Array.isArray(skinConditions) ? skinConditions.length : 0,
        Array.isArray(boneDust) ? boneDust.length : 0
      ].reduce((sum, count) => sum + count, 0);
      
      tests[4] = {
        test: 'Медицинские справочники',
        status: totalMedical > 0 ? 'success' : 'error',
        details: `Формы культи: ${Array.isArray(stumpForms) ? stumpForms.length : 0}, Типы рубцов: ${Array.isArray(scarTypes) ? scarTypes.length : 0}, Состояния кожи: ${Array.isArray(skinConditions) ? skinConditions.length : 0}, Типы костного опила: ${Array.isArray(boneDust) ? boneDust.length : 0}`,
        data: {
          stumpForms: Array.isArray(stumpForms) ? stumpForms.slice(0, 2) : [],
          scarTypes: Array.isArray(scarTypes) ? scarTypes.slice(0, 2) : []
        }
      };
    } catch (error) {
      tests[4] = {
        test: 'Медицинские справочники',
        status: 'error',
        details: `Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    // Тест 6: Проверка новых справочников системы
    try {
      tests.push({
        test: 'Новые системные справочники',
        status: 'loading',
        details: 'Загружаем новые справочники...'
      });

      const [orderStatuses, priorities, docTypes, ageGroups] = await Promise.all([
        apiClient.getOrderStatuses(),
        apiClient.getPriorityLevels(),
        apiClient.getDocumentTypes(),
        apiClient.getAgeGroups()
      ]);

      const totalNew = [
        Array.isArray(orderStatuses) ? orderStatuses.length : 0,
        Array.isArray(priorities) ? priorities.length : 0,
        Array.isArray(docTypes) ? docTypes.length : 0,
        Array.isArray(ageGroups) ? ageGroups.length : 0
      ].reduce((sum, count) => sum + count, 0);
      
      tests[5] = {
        test: 'Новые системные справочники',
        status: totalNew > 0 ? 'success' : 'error',
        details: `Статусы заказов: ${Array.isArray(orderStatuses) ? orderStatuses.length : 0}, Приоритеты: ${Array.isArray(priorities) ? priorities.length : 0}, Типы документов: ${Array.isArray(docTypes) ? docTypes.length : 0}, Возрастные группы: ${Array.isArray(ageGroups) ? ageGroups.length : 0}`,
        data: {
          orderStatuses: Array.isArray(orderStatuses) ? orderStatuses.slice(0, 2) : [],
          priorities: Array.isArray(priorities) ? priorities.slice(0, 2) : []
        }
      };
    } catch (error) {
      tests[5] = {
        test: 'Новые системные справочники',
        status: 'error',
        details: `Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    setResults(tests);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const loadingCount = results.filter(r => r.status === 'loading').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <RefreshCw className="h-5 w-5 mr-2" />
          Интеграционные тесты
        </h3>
        <button
          onClick={runIntegrationTests}
          disabled={isRunning}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isRunning ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Тестирование...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Запустить тесты
            </>
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-green-800">Успешно</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-red-800">Ошибки</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{loadingCount}</div>
            <div className="text-sm text-blue-800">Загружается</div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
          >
            <div className="flex items-start">
              {getStatusIcon(result.status)}
              <div className="ml-3 flex-1">
                <h4 className="font-medium text-gray-900">{result.test}</h4>
                <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                      Показать данные
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          <RefreshCw className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>Нажмите "Запустить тесты" для интеграционного тестирования</p>
        </div>
      )}
    </div>
  );
}
