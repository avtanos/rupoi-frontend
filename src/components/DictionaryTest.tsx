'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Database, CheckCircle, XCircle, Loader } from 'lucide-react';

interface TestResult {
  dictionary: string;
  status: 'loading' | 'success' | 'error';
  count: number;
  error?: string;
}

export default function DictionaryTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const dictionaries = [
    'oblasts', 'raions', 'localities', 'msecs', 'disabilities',
    'device_types', 'amputation_types', 'diagnosis_types', 'materials',
    'works', 'employees', 'stump_forms', 'scar_types', 'skin_condition_types',
    'bone_dust_types', 'shoe_models', 'shoe_colors', 'heel_materials',
    'device_materials', 'order_statuses', 'priority_levels', 'document_types',
    'passport_series', 'age_groups', 'disability_categories', 'disability_causes',
    'service_types'
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const dict of dictionaries) {
      try {
        setTestResults(prev => [...prev, {
          dictionary: dict,
          status: 'loading',
          count: 0
        }]);

        const methodName = `get${dict.charAt(0).toUpperCase() + dict.slice(1)}`;
        const data = await (apiClient as any)[methodName]();
        
        setTestResults(prev => prev.map(result => 
          result.dictionary === dict 
            ? { ...result, status: 'success', count: Array.isArray(data) ? data.length : 0 }
            : result
        ));
      } catch (error) {
        setTestResults(prev => prev.map(result => 
          result.dictionary === dict 
            ? { 
                ...result, 
                status: 'error', 
                count: 0, 
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            : result
        ));
      }
    }

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

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const loadingCount = testResults.filter(r => r.status === 'loading').length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Database className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Тестирование справочников</h1>
            <p className="text-gray-600">Проверка работы API методов для всех справочников</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{loadingCount}</div>
            <div className="text-sm text-blue-800">Загружается</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-green-800">Успешно</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-red-800">Ошибки</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">{dictionaries.length}</div>
            <div className="text-sm text-gray-800">Всего</div>
          </div>
        </div>

        <button
          onClick={runTests}
          disabled={isRunning}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isRunning ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Тестирование...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Запустить тесты
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div
            key={result.dictionary}
            className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(result.status)}
                <span className="ml-3 font-medium text-gray-900">
                  {result.dictionary}
                </span>
                {result.status === 'success' && (
                  <span className="ml-2 text-sm text-gray-600">
                    ({result.count} записей)
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {result.status === 'loading' && 'Загрузка...'}
                {result.status === 'success' && '✓ Готово'}
                {result.status === 'error' && '✗ Ошибка'}
              </div>
            </div>
            {result.error && (
              <div className="mt-2 text-sm text-red-600">
                {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Нажмите "Запустить тесты" для проверки справочников</p>
        </div>
      )}
    </div>
  );
}
