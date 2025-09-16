'use client';

import React from 'react';
import { Overhead } from '@/types';
import { X, Package, Calendar, Building, CheckCircle, AlertTriangle, User, FileText } from 'lucide-react';

interface OverheadDetailModalProps {
  overhead: Overhead;
  onClose: () => void;
}

export default function OverheadDetailModal({ overhead, onClose }: OverheadDetailModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждена';
      case 'draft': return 'Черновик';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Выдача': return 'bg-blue-100 text-blue-800';
      case 'Возврат': return 'bg-orange-100 text-orange-800';
      case 'Передача': return 'bg-purple-100 text-purple-800';
      case 'Списание': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Накладная №{overhead.number}
              </h2>
              <p className="text-sm text-gray-500">
                {overhead.shop_name} • {overhead.date ? new Date(overhead.date).toLocaleDateString('ru-RU') : 'Не указано'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Основная информация */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Информация о накладной
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Номер:</span>
                    <span className="text-blue-700 font-mono">{overhead.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Дата:</span>
                    <span className="text-blue-700">
                      {overhead.date ? new Date(overhead.date).toLocaleDateString('ru-RU') : 'Не указано'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Цех:</span>
                    <span className="text-blue-700">{overhead.shop_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Количество изделий:</span>
                    <span className="text-blue-700 font-semibold">{overhead.device_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Статус:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(overhead.status)}`}>
                      {getStatusText(overhead.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Тип:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(overhead.type)}`}>
                      {overhead.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Статистика
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{overhead.device_count}</div>
                    <div className="text-green-600">Всего изделий</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{overhead.orders?.length || 0}</div>
                    <div className="text-green-600">Заказов</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Список заказов */}
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-yellow-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Заказы в накладной ({overhead.orders?.length || 0})
                </h3>
                
                {overhead.orders && overhead.orders.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {overhead.orders.map((item, index) => (
                      <div key={item.id} className="bg-white border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                                #{index + 1}
                              </span>
                              <span className="font-medium text-gray-900">
                                {item.order.number}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>
                                  {item.order.cart?.first_name || ''} {item.order.cart?.last_name || ''} {item.order.cart?.middle_name || ''}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Package className="h-3 w-3 mr-1" />
                                <span>{item.order.device_type?.name || 'Не указан'}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Создан: {item.order.created_at ? new Date(item.order.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Заказы не добавлены</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
