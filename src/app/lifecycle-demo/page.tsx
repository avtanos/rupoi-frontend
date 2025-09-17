'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LifecycleTransitionManager from '@/components/LifecycleTransitionManager';
import SQLTemplateManager from '@/components/SQLTemplateManager';
import { Database, ArrowRight, Code, Settings } from 'lucide-react';

export default function LifecycleDemoPage() {
  const [activeTab, setActiveTab] = useState('transitions');
  const [demoData, setDemoData] = useState({
    cart: {
      id: 1,
      first_name: 'Иван',
      name: 'Иванов',
      parent_name: 'Иванович',
      birth_date: '1980-05-15',
      document_type: 'PASSPORT',
      document_series: 'AB1234',
      document_number: '123456',
      registration_address: 'г. Бишкек, ул. Ленина, 1',
      status: 'DRAFT',
      disability_group: 'GROUP_II',
      disability_category: 'LABOUR',
      disability_reason: 'TRAUMA',
      disability_from_date: '2020-01-15'
    },
    order: {
      id: 1,
      number: '2025-0001',
      cart_id: 1,
      service_type: 'PROSTHESIS',
      diagnosis_type_id: 'S78.1',
      status: 'NEW',
      is_urgent: false,
      cost: 150000
    },
    overhead: {
      id: 1,
      number: 'H-2025-001',
      status: 'NEW',
      shop_name: 'Мастерская №1',
      device_count: 5
    }
  });

  const [currentEntity, setCurrentEntity] = useState<'cart' | 'order' | 'overhead'>('cart');

  const handleTransition = (transitionId: string, targetStatus: string) => {
    console.log(`Transition ${transitionId}: ${currentEntity} -> ${targetStatus}`);
    
    // Обновляем статус в демо-данных
    setDemoData(prev => ({
      ...prev,
      [currentEntity]: {
        ...prev[currentEntity as keyof typeof prev],
        status: targetStatus
      }
    }));
  };

  const handleExecuteSQL = (sql: string, parameters: Record<string, any>) => {
    console.log('Executing SQL:', sql);
    console.log('Parameters:', parameters);
    // В реальной системе здесь будет API вызов
  };

  const getCurrentStatus = () => {
    return demoData[currentEntity].status;
  };

  const getCurrentData = () => {
    return demoData[currentEntity];
  };

  const tabs = [
    { id: 'transitions', name: 'Переходы жизненного цикла', icon: ArrowRight },
    { id: 'sql', name: 'SQL-шаблоны', icon: Code },
    { id: 'settings', name: 'Настройки', icon: Settings }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center space-x-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Демонстрация системы жизненного цикла</h1>
            <p className="text-gray-600">Матрица комбинаций выборок для РУПОИ</p>
          </div>
        </div>

        {/* Выбор сущности */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Выберите сущность для демонстрации</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentEntity('cart')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                currentEntity === 'cart'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">Карточка пациента</h4>
              <p className="text-sm text-gray-600 mt-1">Статус: {demoData.cart.status}</p>
            </button>
            <button
              onClick={() => setCurrentEntity('order')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                currentEntity === 'order'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">Заказ</h4>
              <p className="text-sm text-gray-600 mt-1">Статус: {demoData.order.status}</p>
            </button>
            <button
              onClick={() => setCurrentEntity('overhead')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                currentEntity === 'overhead'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">Накладная</h4>
              <p className="text-sm text-gray-600 mt-1">Статус: {demoData.overhead.status}</p>
            </button>
          </div>
        </div>

        {/* Текущие данные */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Текущие данные</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(getCurrentData(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Табы */}
        <div className="card">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'transitions' && (
              <LifecycleTransitionManager
                entityType={currentEntity}
                currentStatus={getCurrentStatus()}
                data={getCurrentData()}
                onTransition={handleTransition}
              />
            )}

            {activeTab === 'sql' && (
              <SQLTemplateManager
                entityType={currentEntity}
                onExecute={handleExecuteSQL}
              />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Настройки системы жизненного цикла</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Статистика переходов</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Всего переходов:</span>
                        <span className="text-sm font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Активных переходов:</span>
                        <span className="text-sm font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SQL-шаблонов:</span>
                        <span className="text-sm font-medium">15</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Последние действия</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>• Переход C1: DRAFT → ACTIVE</div>
                      <div>• Выполнен SQL: CART_ACTIVE</div>
                      <div>• Валидация перехода O1</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Управление</h4>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                      Сбросить демо-данные
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Экспорт конфигурации
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
