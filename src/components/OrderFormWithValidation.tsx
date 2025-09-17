'use client';

import React, { useState, useEffect } from 'react';
import { Order, Cart, Material, OrderMaterial } from '@/types';
import { apiClient } from '@/lib/api';
import { 
  ValidationRulesManager,
  validateByRules,
  getViolatedRules,
  getWarnings,
  getErrors,
  getRecommendations,
  getRulesStatistics
} from '@/constants/validation-rules';
import { X, Calendar, User, Package, AlertCircle, Save, RefreshCw, Shield } from 'lucide-react';

interface OrderFormWithValidationProps {
  order?: Order;
  onSave: (orderData: Order) => void;
  onCancel: () => void;
}

export default function OrderFormWithValidation({ order, onSave, onCancel }: OrderFormWithValidationProps) {
  const [formData, setFormData] = useState<any>({});
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'validation' | 'rules' | 'recommendations'>('form');

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
      const transformedData = {
        service: {
          service_type: order.service_type,
          quantity: order.quantity,
          urgency_id: order.urgency_id
        },
        order: {
          device_type_r_id: order.device_type_r_id,
          device_type_l_id: order.device_type_l_id,
          hospitalized: order.hospitalized,
          urgent_reason: order.urgent_reason
        },
        diagnosis: {
          diagnosis_type: order.diagnosis_type_id,
          side_id: order.side_id
        },
        status: order.status,
        status_history: order.status_history || [],
        primary_diagnosis_id: order.primary_diagnosis_id,
        diagnosis_cart_id: order.cart_id,
        service_cart_id: order.cart_id
      };
      setFormData(transformedData);
    }
  }, [order]);

  useEffect(() => {
    // Валидация при изменении данных
    if (formData && Object.keys(formData).length > 0) {
      const results = validateByRules(formData);
      setValidationResults(results);
      setIsValid(results.every(r => r.isValid));
    }
  }, [formData]);

  const handleDataChange = (newFormData: any) => {
    setFormData(newFormData);
  };

  const handleValidationChange = (results: any[], valid: boolean) => {
    setValidationResults(results);
    setIsValid(valid);
  };

  const handleRuleViolation = (rule: any, result: any) => {
    console.log('Rule violation:', rule.id, result);
  };

  const handleSave = () => {
    if (!isValid) {
      alert('Пожалуйста, исправьте ошибки валидации перед сохранением');
      return;
    }

    // Создаем объект заказа из данных формы
    const orderData: Order = {
      id: order?.id || Date.now(),
      number: order?.number || `ORD-${Date.now()}`,
      cart_id: formData.service_cart_id || 1,
      service_type: formData.service?.service_type || 'PROSTHESIS',
      quantity: formData.service?.quantity || 1,
      device_type_r_id: formData.order?.device_type_r_id,
      device_type_l_id: formData.order?.device_type_l_id,
      diagnosis_type_id: formData.diagnosis?.diagnosis_type,
      side_id: formData.diagnosis?.side_id,
      hospitalized: formData.order?.hospitalized || false,
      urgency_id: formData.service?.urgency_id,
      urgent_reason: formData.order?.urgent_reason,
      measurements: formData.measurements || [],
      status: formData.status || 'NEW',
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
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const statistics = getRulesStatistics(formData);
  const recommendations = getRecommendations(formData);

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
                С системой валидации правил
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
              { id: 'validation', name: 'Валидация', icon: Shield },
              { id: 'rules', name: 'Правила', icon: AlertCircle },
              { id: 'recommendations', name: 'Рекомендации', icon: RefreshCw }
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
              <h3 className="text-lg font-medium text-gray-900">Данные заказа</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип услуги
                  </label>
                  <select
                    value={formData.service?.service_type || ''}
                    onChange={(e) => handleDataChange({
                      ...formData,
                      service: { ...formData.service, service_type: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите тип услуги</option>
                    <option value="PROSTHESIS">Протез</option>
                    <option value="SHOES">Обувь</option>
                    <option value="OTTO">Ортез</option>
                    <option value="REPAIR">Ремонт</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Количество
                  </label>
                  <input
                    type="number"
                    value={formData.service?.quantity || 1}
                    onChange={(e) => handleDataChange({
                      ...formData,
                      service: { ...formData.service, quantity: parseInt(e.target.value) || 1 }
                    })}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Срочность
                  </label>
                  <select
                    value={formData.service?.urgency_id || ''}
                    onChange={(e) => handleDataChange({
                      ...formData,
                      service: { ...formData.service, urgency_id: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите срочность</option>
                    <option value="NORMAL">Обычный</option>
                    <option value="URGENT">Срочный</option>
                    <option value="EMERGENCY">Экстренный</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Причина срочности
                  </label>
                  <input
                    type="text"
                    value={formData.order?.urgent_reason || ''}
                    onChange={(e) => handleDataChange({
                      ...formData,
                      order: { ...formData.order, urgent_reason: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Укажите причину срочности"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип диагноза
                  </label>
                  <input
                    type="text"
                    value={formData.diagnosis?.diagnosis_type || ''}
                    onChange={(e) => handleDataChange({
                      ...formData,
                      diagnosis: { ...formData.diagnosis, diagnosis_type: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Например: S78.1, Z89.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Сторона
                  </label>
                  <select
                    value={formData.diagnosis?.side_id || ''}
                    onChange={(e) => handleDataChange({
                      ...formData,
                      diagnosis: { ...formData.diagnosis, side_id: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите сторону</option>
                    <option value="LEFT">Левая</option>
                    <option value="RIGHT">Правая</option>
                    <option value="BOTH">Обе</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Госпитализация
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.order?.hospitalized || false}
                    onChange={(e) => handleDataChange({
                      ...formData,
                      order: { ...formData.order, hospitalized: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Результаты валидации</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{statistics.valid}</div>
                  <div className="text-sm text-gray-600">Соблюдено</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{statistics.errors}</div>
                  <div className="text-sm text-gray-600">Ошибок</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{statistics.warnings}</div>
                  <div className="text-sm text-gray-600">Предупреждений</div>
                </div>
              </div>

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
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <ValidationRulesManager
                data={formData}
                onValidationChange={handleValidationChange}
                onRuleViolation={handleRuleViolation}
              />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Рекомендации</h3>
              
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <p>Нет рекомендаций</p>
                  <p className="text-sm">Все правила соблюдены</p>
                </div>
              )}
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
