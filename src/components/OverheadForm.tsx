'use client';

import React, { useState, useEffect } from 'react';
import { Overhead, Order, OverheadToOrder } from '@/types';
import { apiClient } from '@/lib/api';
import { X, Plus, Trash2, Package, Search, CheckCircle, AlertTriangle } from 'lucide-react';

interface OverheadFormProps {
  overhead?: Overhead;
  onSave: (overheadData: Overhead) => void;
  onCancel: () => void;
}

export default function OverheadForm({ overhead, onSave, onCancel }: OverheadFormProps) {
  const [formData, setFormData] = useState<Partial<Overhead>>(overhead || {
    number: '',
    date: new Date().toISOString().split('T')[0],
    shop_name: '',
    device_count: 0,
    status: 'draft',
    type: 'Выдача',
    orders: []
  });
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAvailableOrders();
  }, []);

  const loadAvailableOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOrders({ status: '3' }); // Только утвержденные заказы
      setAvailableOrders(response.results);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddOrder = (order: Order) => {
    const overheadOrder: OverheadToOrder = {
      id: Date.now(),
      overhead_id: formData.id || 0,
      order_id: order.id,
      order: order
    };

    setFormData(prev => ({
      ...prev,
      orders: [...(prev.orders || []), overheadOrder],
      device_count: (prev.device_count || 0) + 1
    }));
  };

  const handleRemoveOrder = (orderId: number) => {
    setFormData(prev => ({
      ...prev,
      orders: prev.orders?.filter(item => item.order_id !== orderId) || [],
      device_count: Math.max(0, (prev.device_count || 0) - 1)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.number?.trim()) {
      newErrors.number = 'Номер накладной обязателен';
    }
    if (!formData.date) {
      newErrors.date = 'Дата обязательна';
    }
    if (!formData.shop_name?.trim()) {
      newErrors.shop_name = 'Название цеха обязательно';
    }
    if (!formData.orders || formData.orders.length === 0) {
      newErrors.orders = 'Необходимо добавить хотя бы один заказ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const overheadData = {
        ...formData,
        device_count: formData.orders?.length || 0
      } as Overhead;

      await onSave(overheadData);
    } catch (error) {
      console.error('Failed to save overhead:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = availableOrders.filter(order => {
    const isAlreadyAdded = formData.orders?.some(item => item.order_id === order.id);
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.cart?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.cart?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return !isAlreadyAdded && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {overhead ? 'Редактировать накладную' : 'Создать накладную'}
              </h2>
              <p className="text-sm text-gray-500">
                {overhead ? `Накладная ${overhead.number}` : 'Новая накладная на передачу изделий'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Основная информация */}
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Основная информация</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                        Номер накладной <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="number"
                        id="number"
                        value={formData.number || ''}
                        onChange={handleChange}
                        className={`mt-1 block w-full input ${errors.number ? 'border-red-500' : ''}`}
                        placeholder="OV-2025-001"
                        required
                      />
                      {errors.number && (
                        <p className="mt-1 text-sm text-red-600">{errors.number}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Дата <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date || ''}
                        onChange={handleChange}
                        className={`mt-1 block w-full input ${errors.date ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700">
                        Название цеха <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shop_name"
                        id="shop_name"
                        value={formData.shop_name || ''}
                        onChange={handleChange}
                        className={`mt-1 block w-full input ${errors.shop_name ? 'border-red-500' : ''}`}
                        placeholder="Цех протезирования"
                        required
                      />
                      {errors.shop_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.shop_name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Тип накладной
                      </label>
                      <select
                        name="type"
                        id="type"
                        value={formData.type || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full input"
                      >
                        <option value="Выдача">Выдача</option>
                        <option value="Возврат">Возврат</option>
                        <option value="Передача">Передача</option>
                        <option value="Списание">Списание</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Статус
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={formData.status || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full input"
                      >
                        <option value="draft">Черновик</option>
                        <option value="confirmed">Подтверждена</option>
                        <option value="cancelled">Отменена</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Выбранные заказы */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Выбранные заказы ({formData.orders?.length || 0})
                  </h3>
                  
                  {errors.orders && (
                    <p className="text-sm text-red-600 mb-4">{errors.orders}</p>
                  )}

                  {formData.orders && formData.orders.length > 0 ? (
                    <div className="space-y-2">
                      {formData.orders.map((item) => (
                        <div key={item.id} className="bg-white border border-green-200 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {item.order.number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.order.cart?.first_name || ''} {item.order.cart?.last_name || ''} - {item.order.device_type?.name || 'Не указан'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOrder(item.order_id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Заказы не выбраны</p>
                  )}
                </div>
              </div>

              {/* Доступные заказы */}
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Доступные заказы
                  </h3>
                  
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Поиск по номеру заказа или ФИО..."
                        className="input pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Загрузка заказов...</p>
                    </div>
                  ) : filteredOrders.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white border border-yellow-200 rounded-lg p-3 hover:bg-yellow-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {order.number}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.cart?.first_name || ''} {order.cart?.last_name || ''} {order.cart?.middle_name || ''}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.device_type?.name || 'Не указан'} | {order.diagnosis_type?.name || 'Не указан'}
                              </div>
                              <div className="text-xs text-gray-400">
                                Создан: {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddOrder(order)}
                              className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 flex items-center"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Добавить
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        {searchTerm ? 'Заказы не найдены' : 'Нет доступных заказов'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Сохранение...' : (overhead ? 'Сохранить изменения' : 'Создать накладную')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
