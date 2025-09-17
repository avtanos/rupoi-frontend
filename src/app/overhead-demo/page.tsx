'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import OverheadTypeManager from '@/components/OverheadTypeManager';
import OverheadTransitionManager from '@/components/OverheadTransitionManager';
import { 
  FileText, 
  ArrowRight, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  Shoe,
  Wrench,
  Stethoscope,
  Plus,
  Truck,
  CheckSquare
} from 'lucide-react';

export default function OverheadDemoPage() {
  const [activeTab, setActiveTab] = useState('types');
  const [selectedType, setSelectedType] = useState<any>(null);
  const [overheadData, setOverheadData] = useState({
    id: 1,
    number: 'H-2025-001',
    date: '2025-01-15',
    shop_name: 'Мастерская №1',
    type: 'PROSTHESIS',
    status: 'DRAFT',
    device_count: 0,
    overhead_to_order: [],
    processed_date: null,
    processed_by: null,
    document_processed: false,
    inventory_updated: false
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSelectType = (type: any) => {
    setSelectedType(type);
    console.log('Selected type:', type);
  };

  const handleValidateType = (isValid: boolean, errors: string[]) => {
    setValidationErrors(errors);
    console.log('Type validation result:', { isValid, errors });
  };

  const handleOverheadTransition = (transitionId: string, targetStatus: string) => {
    console.log(`Overhead transition ${transitionId}: ${overheadData.status} -> ${targetStatus}`);
    
    // Обновляем статус накладной
    setOverheadData(prev => ({
      ...prev,
      status: targetStatus
    }));
  };

  const handleValidateOverhead = (isValid: boolean, errors: string[]) => {
    console.log('Overhead validation result:', { isValid, errors });
  };

  const resetOverheadData = () => {
    setOverheadData({
      id: 1,
      number: 'H-2025-001',
      date: '2025-01-15',
      shop_name: 'Мастерская №1',
      type: 'PROSTHESIS',
      status: 'DRAFT',
      device_count: 0,
      overhead_to_order: [],
      processed_date: null,
      processed_by: null,
      document_processed: false,
      inventory_updated: false
    });
    setSelectedType(null);
    setValidationErrors([]);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'NEW': 'bg-blue-100 text-blue-800',
      'SENT': 'bg-yellow-100 text-yellow-800',
      'PROCESSED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusName = (status: string) => {
    const names: Record<string, string> = {
      'DRAFT': 'Черновик',
      'NEW': 'Новая',
      'SENT': 'Передана',
      'PROCESSED': 'Обработана'
    };
    return names[status] || status;
  };

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

  const tabs = [
    { id: 'types', name: 'Типы накладных', icon: FileText },
    { id: 'transitions', name: 'Переходы накладных', icon: ArrowRight },
    { id: 'settings', name: 'Настройки', icon: Settings }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Демонстрация системы накладных</h1>
            <p className="text-gray-600">Формирование переходов и управление типами</p>
          </div>
        </div>

        {/* Текущая накладная */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Текущая накладная</h3>
            <button
              onClick={resetOverheadData}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Сбросить
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Номер накладной:</label>
              <div className="text-sm text-gray-900">{overheadData.number}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Тип накладной:</label>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(overheadData.type)}`}>
                  {overheadData.type}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Статус:</label>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(overheadData.status)}`}>
                  {getStatusName(overheadData.status)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Количество изделий:</label>
              <div className="text-sm text-gray-900">{overheadData.device_count}</div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Данные накладной:</label>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(overheadData, null, 2)}
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
            {activeTab === 'types' && (
              <OverheadTypeManager
                onSelectType={handleSelectType}
                onValidate={handleValidateType}
                initialData={overheadData}
              />
            )}

            {activeTab === 'transitions' && (
              <OverheadTransitionManager
                currentStatus={overheadData.status}
                overheadData={overheadData}
                onTransition={handleOverheadTransition}
                onValidate={handleValidateOverhead}
              />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Настройки системы накладных</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Статистика переходов</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Всего переходов:</span>
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Типов накладных:</span>
                        <span className="text-sm font-medium">4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Статусов:</span>
                        <span className="text-sm font-medium">4</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Последние действия</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Plus className="h-3 w-3 text-blue-500" />
                        <span>Создана накладная H-2025-001</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-3 w-3 text-yellow-500" />
                        <span>Переход H1: DRAFT → NEW</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="h-3 w-3 text-green-500" />
                        <span>Переход H2: NEW → SENT</span>
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

        {/* Выбранный тип накладной */}
        {selectedType && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Выбранный тип накладной</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                {React.createElement(getTypeIcon(selectedType.code), { className: "h-6 w-6 text-blue-600 mt-1" })}
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">{selectedType.name}</h4>
                  <p className="text-sm text-blue-700 mt-1">{selectedType.description}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    Код: {selectedType.code} | Обязательных полей: {selectedType.requiredFields.length}
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
