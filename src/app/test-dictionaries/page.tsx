'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import Layout from '@/components/Layout';
import DictionaryTest from '@/components/DictionaryTest';
import DictionaryDetailTest from '@/components/DictionaryDetailTest';
import DataValidationTest from '@/components/DataValidationTest';
import IntegrationTest from '@/components/IntegrationTest';
import { Database, TestTube, Shield, RefreshCw } from 'lucide-react';

const DICTIONARIES = [
  { key: 'oblasts', name: 'Области' },
  { key: 'raions', name: 'Районы' },
  { key: 'localities', name: 'Населенные пункты' },
  { key: 'msecs', name: 'МСЭК организации' },
  { key: 'device_types', name: 'Типы устройств' },
  { key: 'amputation_types', name: 'Типы ампутации' },
  { key: 'diagnosis_types', name: 'Типы диагнозов' },
  { key: 'materials', name: 'Материалы' },
  { key: 'works', name: 'Виды работ' },
  { key: 'employees', name: 'Сотрудники' },
  { key: 'stump_forms', name: 'Формы культи' },
  { key: 'scar_types', name: 'Типы рубцов' },
  { key: 'skin_condition_types', name: 'Состояния кожи' },
  { key: 'bone_dust_types', name: 'Типы костного опила' },
  { key: 'shoe_models', name: 'Модели обуви' },
  { key: 'shoe_colors', name: 'Цвета обуви' },
  { key: 'heel_materials', name: 'Материалы каблуков' },
  { key: 'device_materials', name: 'Материалы устройств' },
  { key: 'order_statuses', name: 'Статусы заказов' },
  { key: 'priority_levels', name: 'Уровни приоритета' },
  { key: 'document_types', name: 'Типы документов' },
  { key: 'passport_series', name: 'Серии паспортов' },
  { key: 'age_groups', name: 'Возрастные группы' },
  { key: 'disability_categories', name: 'Категории инвалидности' },
  { key: 'disability_causes', name: 'Причины инвалидности' },
  { key: 'service_types', name: 'Типы услуг' }
];

export default function TestDictionariesPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Необходима авторизация</div>;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TestTube className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Тестирование справочников RUPOI</h1>
              <p className="text-gray-600">Проверка работы всех API методов и данных справочников</p>
            </div>
          </div>
        </div>

        {/* Валидация данных */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2" />
            Валидация данных
          </h2>
          <DataValidationTest />
        </div>

        {/* Интеграционные тесты */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <RefreshCw className="h-5 w-5 mr-2" />
            Интеграционные тесты
          </h2>
          <IntegrationTest />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Быстрое тестирование */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Быстрое тестирование
            </h2>
            <DictionaryTest />
          </div>

          {/* Детальное тестирование */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TestTube className="h-5 w-5 mr-2" />
              Детальное тестирование
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {DICTIONARIES.map((dict) => (
                <DictionaryDetailTest
                  key={dict.key}
                  dictionaryName={dict.key}
                  displayName={dict.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
