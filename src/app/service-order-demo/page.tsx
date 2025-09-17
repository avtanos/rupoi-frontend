'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ServiceCombinationManager from '@/components/ServiceCombinationManager';
import OrderTransitionManager from '@/components/OrderTransitionManager';
import { 
  Package, 
  ArrowRight, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  UserCheck,
  Truck
} from 'lucide-react';

export default function ServiceOrderDemoPage() {
  const [activeTab, setActiveTab] = useState('combinations');
  const [selectedCombination, setSelectedCombination] = useState<any>(null);
  const [orderData, setOrderData] = useState({
    id: 1,
    number: '2025-0001',
    service_type: 'PROSTHESIS',
    diagnosis_type: 'ампутационные (МКБ S78., Z89.)',
    side: 'LEFT',
    status: 'DRAFT',
    urgency: 'NORMAL',
    quantity: 1,
    device_type_l_id: null,
    device_type_r_id: null,
    primary_diagnosis_id: null,
    medical_indicators: null,
    order_measurements: null,
    measurements_completed: false,
    fitting_act: null,
    fitting_completed: false,
    product_ready: false,
    overhead_id: null,
    overhead_processed: false,
    issue_date: null
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSelectCombination = (combination: any) => {
    setSelectedCombination(combination);
    console.log('Selected combination:', combination);
  };

  const handleValidateCombination = (isValid: boolean, errors: string[]) => {
    setValidationErrors(errors);
    console.log('Validation result:', { isValid, errors });
  };

  const handleOrderTransition = (transitionId: string, targetStatus: string) => {
    console.log(`Order transition ${transitionId}: ${orderData.status} -> ${targetStatus}`);
    
    // Обновляем статус заказа
    setOrderData(prev => ({
      ...prev,
      status: targetStatus
    }));
  };

  const handleValidateOrder = (isValid: boolean, errors: string[]) => {
    console.log('Order validation result:', { isValid, errors });
  };

  const resetOrderData = () => {
    setOrderData({
      id: 1,
      number: '2025-0001',
      service_type: 'PROSTHESIS',
      diagnosis_type: 'ампутационные (МКБ S78., Z89.)',
      side: 'LEFT',
      status: 'DRAFT',
      urgency: 'NORMAL',
      quantity: 1,
      device_type_l_id: null,
      device_type_r_id: null,
      primary_diagnosis_id: null,
      medical_indicators: null,
      order_measurements: null,
      measurements_completed: false,
      fitting_act: null,
      fitting_completed: false,
      product_ready: false,
      overhead_id: null,
      overhead_processed: false,
      issue_date: null
    });
    setSelectedCombination(null);
    setValidationErrors([]);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'NEW': 'bg-blue-100 text-blue-800',
      'ON_APPROVAL': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'IN_PRODUCTION': 'bg-orange-100 text-orange-800',
      'FITTING': 'bg-pink-100 text-pink-800',
      'WAREHOUSE': 'bg-cyan-100 text-cyan-800',
      'ISSUED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'combinations', name: 'Комбинации услуг', icon: Package },
    { id: 'transitions', name: 'Переходы заказов', icon: ArrowRight },
    { id: 'settings', name: 'Настройки', icon: Settings }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Демонстрация системы услуг/заказов</h1>
            <p className="text-gray-600">Жизненный цикл и типовые связки</p>
          </div>
        </div>

        {/* Текущий заказ */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Текущий заказ</h3>
            <button
              onClick={resetOrderData}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Сбросить
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Номер заказа:</label>
              <div className="text-sm text-gray-900">{orderData.number}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Тип услуги:</label>
              <div className="text-sm text-gray-900">{orderData.service_type}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Статус:</label>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData.status)}`}>
                  {orderData.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Данные заказа:</label>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(orderData, null, 2)}
              </pre>
            </div>
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
            {activeTab === 'combinations' && (
              <ServiceCombinationManager
                onSelectCombination={handleSelectCombination}
                onValidate={handleValidateCombination}
                initialData={orderData}
              />
            )}

            {activeTab === 'transitions' && (
              <OrderTransitionManager
                currentStatus={orderData.status}
                orderData={orderData}
                onTransition={handleOrderTransition}
                onValidate={handleValidateOrder}
              />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Настройки системы услуг/заказов</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Статистика комбинаций</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Всего комбинаций:</span>
                        <span className="text-sm font-medium">4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Типов услуг:</span>
                        <span className="text-sm font-medium">4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Переходов заказов:</span>
                        <span className="text-sm font-medium">7</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Последние действия</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Выбрана комбинация S1 (PROSTHESIS)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="h-3 w-3 text-blue-500" />
                        <span>Переход O1: DRAFT → NEW</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-3 w-3 text-yellow-500" />
                        <span>Переход O2: NEW → ON_APPROVAL</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Управление</h4>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                      Экспорт конфигурации
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Импорт данных
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Выбранная комбинация */}
        {selectedCombination && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Выбранная комбинация</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Package className="h-6 w-6 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">{selectedCombination.description}</h4>
                  <p className="text-sm text-blue-700 mt-1">{selectedCombination.note}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    ID: {selectedCombination.id} | Тип: {selectedCombination.serviceType}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ошибки валидации */}
        {validationErrors.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ошибки валидации</h3>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <XCircle className="h-6 w-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Обнаружены ошибки валидации</h4>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
