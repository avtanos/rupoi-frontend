'use client';

import React, { useState, useEffect } from 'react';
import { Order, Cart, Material, OrderMaterial } from '@/types';
import { apiClient } from '@/lib/api';
import { 
  UIFieldBindingManager,
  UI_FIELD_BINDINGS,
  getUIFieldBinding,
  getDictionaryValues,
  validateUIField,
  transformFormToStorage,
  transformStorageToForm
} from '@/constants/ui-field-bindings';
import { X, Calendar, User, Package, AlertCircle, Save, RefreshCw } from 'lucide-react';

interface OrderFormWithBindingsProps {
  order?: Order;
  onSave: (orderData: Order) => void;
  onCancel: () => void;
}

export default function OrderFormWithBindings({ order, onSave, onCancel }: OrderFormWithBindingsProps) {
  const [formData, setFormData] = useState<any>({});
  const [storageData, setStorageData] = useState<any>({});
  const [carts, setCarts] = useState<Cart[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'bindings' | 'validation' | 'transform'>('form');

  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        setLoading(true);
        const [cartsData, materialsData] = await Promise.all([
          apiClient.getCarts(),
          apiClient.getMaterials()
        ]);
        
        setCarts(cartsData.results);
        setMaterials(materialsData);
      } catch (error) {
        console.error('Failed to load dictionaries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionaries();
  }, []);

  useEffect(() => {
    // Инициализация данных формы из существующего заказа
    if (order) {
      const transformedData = transformStorageToForm(order);
      setFormData(transformedData);
      setStorageData(order);
    }
  }, [order]);

  const handleDataChange = (newFormData: any, newStorageData: any) => {
    setFormData(newFormData);
    setStorageData(newStorageData);
  };

  const handleValidationChange = (valid: boolean, validationErrors: string[]) => {
    setIsValid(valid);
    setErrors(validationErrors.reduce((acc, error, index) => {
      acc[`error_${index}`] = error;
      return acc;
    }, {} as Record<string, string>));
  };

  const handleSave = () => {
    if (!isValid) {
      alert('Пожалуйста, исправьте ошибки валидации перед сохранением');
      return;
    }

    // Создаем объект заказа из данных хранилища
    const orderData: Order = {
      id: order?.id || Date.now(),
      number: order?.number || `ORD-${Date.now()}`,
      cart_id: storageData.cart_id || 1,
      service_type: storageData.service?.service_type_id || 'PROSTHESIS',
      quantity: storageData.service?.quantity || 1,
      device_type_r_id: storageData.order?.device_type_r_id,
      device_type_l_id: storageData.order?.device_type_l_id,
      diagnosis_type_id: storageData.diagnosis?.diagnosis_type_id,
      side_id: storageData.diagnosis?.side_id,
      hospitalized: storageData.order?.hospitalized || false,
      urgency_id: storageData.service?.urgency_id,
      urgent_reason: storageData.order?.urgent_reason,
      measurements: storageData.order_measurements || [],
      status: order?.status || 'NEW',
      created_at: order?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: order?.created_by || 1,
      updated_by: order?.updated_by || 1,
      notes: order?.notes || '',
      order_materials: order?.order_materials || [],
      semi_finished_products: order?.semi_finished_products || [],
      ready_poi: order?.ready_poi,
      status_history: order?.status_history || [],
      medical_approval: order?.medical_approval,
      production_data: order?.production_data
    };

    onSave(orderData);
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? '✓' : '✗';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {order ? 'Редактирование заказа' : 'Создание заказа'}
              </h2>
              <p className="text-sm text-gray-600">
                Использование системы привязок UI полей
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <span>{getStatusIcon(isValid)}</span>
              <span>{isValid ? 'Валидация пройдена' : 'Ошибки валидации'}</span>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Табы */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'form', name: 'Форма', icon: Package },
              { id: 'bindings', name: 'Привязки', icon: RefreshCw },
              { id: 'validation', name: 'Валидация', icon: AlertCircle },
              { id: 'transform', name: 'Преобразование', icon: Save }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
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

        {/* Содержимое */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'form' && (
            <div className="space-y-6">
              <UIFieldBindingManager
                initialData={storageData}
                onDataChange={handleDataChange}
                onValidationChange={handleValidationChange}
              />
            </div>
          )}

          {activeTab === 'bindings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Информация о привязках</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Поддерживаемые поля</h4>
                  <div className="space-y-2">
                    {UI_FIELD_BINDINGS.map((binding) => (
                      <div key={binding.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{binding.uiField}</div>
                          <div className="text-sm text-gray-500">{binding.storagePath}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {binding.dataType}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Статистика</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Всего полей:</span>
                      <span className="font-medium">{UI_FIELD_BINDINGS.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Справочников:</span>
                      <span className="font-medium">
                        {new Set(UI_FIELD_BINDINGS.map(b => b.dictionary).filter(Boolean)).size}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Типов данных:</span>
                      <span className="font-medium">
                        {new Set(UI_FIELD_BINDINGS.map(b => b.dataType)).size}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Обязательных полей:</span>
                      <span className="font-medium">
                        {UI_FIELD_BINDINGS.filter(b => b.validation?.required).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Валидация полей</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Статус валидации</h4>
                  <div className={`p-4 rounded-lg ${
                    isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className={`text-2xl ${getStatusColor(isValid)}`}>
                        {getStatusIcon(isValid)}
                      </span>
                      <div>
                        <div className={`font-medium ${getStatusColor(isValid)}`}>
                          {isValid ? 'Валидация пройдена' : 'Ошибки валидации'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isValid ? 'Все поля корректны' : 'Требуется исправление ошибок'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Ошибки</h4>
                  {Object.keys(errors).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(errors).map(([key, error]) => (
                        <div key={key} className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-700">{error}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Ошибок не найдено</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transform' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Преобразование данных</h3>
              
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
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
