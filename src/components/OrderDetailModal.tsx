'use client';

import React from 'react';
import { Order } from '@/types';
import { X, Stethoscope, FileText, Calendar, User, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const getStatusBadge = (status: number) => {
    const badges = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: number) => {
    const texts = {
      1: 'На утверждении',
      2: 'В работе',
      3: 'Утвержден',
      4: 'Отклонен'
    };
    return texts[status as keyof typeof texts] || 'Неизвестно';
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      normal: 'bg-gray-100 text-gray-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return badges[priority as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority: string) => {
    const texts = {
      normal: 'Обычный',
      high: 'Высокий',
      urgent: 'Срочный'
    };
    return texts[priority as keyof typeof texts] || 'Обычный';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Детали заказа №{order.number}
              </h2>
              <p className="text-sm text-gray-500">
                {order.cart?.first_name || ''} {order.cart?.name || ''} {order.cart?.parent_name || ''}
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
            {/* Информация о заказе */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Информация о заказе
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Номер заказа:</span>
                    <span className="text-blue-700">{order.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Тип заказа:</span>
                    <span className="text-blue-700">{order.order_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Тип изделия:</span>
                    <span className="text-blue-700">{order.device_type?.name || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Диагноз:</span>
                    <span className="text-blue-700">{order.diagnosis_type?.name || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Сторона:</span>
                    <span className="text-blue-700">
                      {order.diagnosis_side === 'right' ? 'Правая' : 
                       order.diagnosis_side === 'left' ? 'Левая' : 'Обе'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Количество:</span>
                    <span className="text-blue-700">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Статус:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Приоритет:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(order.priority_level || 'normal')}`}>
                      {getPriorityText(order.priority_level || 'normal')}
                    </span>
                  </div>
                  {order.is_urgent && (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="font-medium">Срочный заказ</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Информация о пациенте */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Информация о пациенте
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">ФИО:</span>
                    <span className="text-green-700">
                      {order.cart?.name || ''} {order.cart?.first_name || ''} {order.cart?.parent_name || ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Номер карты:</span>
                    <span className="text-green-700">{order.cart?.card_number || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">ИНН:</span>
                    <span className="text-green-700">{order.cart?.inn || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Дата рождения:</span>
                    <span className="text-green-700">
                      {order.cart?.birth_date ? new Date(order.cart.birth_date).toLocaleDateString('ru-RU') : 'Не указано'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Телефон:</span>
                    <span className="text-green-700">{order.cart?.phone_number || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Адрес:</span>
                    <span className="text-green-700">{order.cart?.registration_address || 'Не указан'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Медицинская информация */}
            <div className="space-y-6">
              {order.medical_examination ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-900 mb-4 flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Медицинский осмотр
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-yellow-800">Дата осмотра:</span>
                      <span className="text-yellow-700">
                        {order.medical_examination?.examination_date ? new Date(order.medical_examination.examination_date).toLocaleDateString('ru-RU') : 'Не указано'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-yellow-800">Врач:</span>
                      <span className="text-yellow-700">{order.medical_examination?.doctor_name || 'Не указан'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-yellow-800">Специальность:</span>
                      <span className="text-yellow-700">{order.medical_examination?.doctor_specialty || 'Не указана'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-yellow-800">Решение:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.medical_examination?.is_approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.medical_examination?.is_approved ? 'Утвержден' : 'Отклонен'}
                      </span>
                    </div>
                  </div>
                  
                  {order.medical_examination?.medical_diagnosis && (
                    <div className="mt-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Медицинский диагноз:</h4>
                      <p className="text-yellow-700 text-sm bg-white p-3 rounded border">
                        {order.medical_examination?.medical_diagnosis}
                      </p>
                    </div>
                  )}

                  {order.medical_examination?.medical_conclusion && (
                    <div className="mt-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Заключение:</h4>
                      <p className="text-yellow-700 text-sm bg-white p-3 rounded border">
                        {order.medical_examination?.medical_conclusion}
                      </p>
                    </div>
                  )}

                  {order.medical_examination?.medical_recommendations && (
                    <div className="mt-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Рекомендации:</h4>
                      <p className="text-yellow-700 text-sm bg-white p-3 rounded border">
                        {order.medical_examination?.medical_recommendations}
                      </p>
                    </div>
                  )}

                  {order.medical_examination?.rejection_reason && (
                    <div className="mt-4">
                      <h4 className="font-medium text-red-800 mb-2">Причина отклонения:</h4>
                      <p className="text-red-700 text-sm bg-white p-3 rounded border">
                        {order.medical_examination?.rejection_reason}
                      </p>
                    </div>
                  )}

                  {order.medical_examination?.medical_notes && (
                    <div className="mt-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Заметки врача:</h4>
                      <p className="text-yellow-700 text-sm bg-white p-3 rounded border">
                        {order.medical_examination?.medical_notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Медицинский осмотр
                  </h3>
                  <p className="text-gray-500 text-sm">Медицинский осмотр не проводился</p>
                </div>
              )}

              {/* Процессные даты */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Процессные даты
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-purple-800">Дата создания:</span>
                    <span className="text-purple-700">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                    </span>
                  </div>
                  {order.accept_date && (
                    <div className="flex justify-between">
                      <span className="font-medium text-purple-800">Дата принятия:</span>
                      <span className="text-purple-700">
                        {order.accept_date ? new Date(order.accept_date).toLocaleDateString('ru-RU') : 'Не указано'}
                      </span>
                    </div>
                  )}
                  {order.ready_date && (
                    <div className="flex justify-between">
                      <span className="font-medium text-purple-800">Дата готовности:</span>
                      <span className="text-purple-700">
                        {order.ready_date ? new Date(order.ready_date).toLocaleDateString('ru-RU') : 'Не указано'}
                      </span>
                    </div>
                  )}
                  {order.issue_date && (
                    <div className="flex justify-between">
                      <span className="font-medium text-purple-800">Дата выдачи:</span>
                      <span className="text-purple-700">
                        {order.issue_date ? new Date(order.issue_date).toLocaleDateString('ru-RU') : 'Не указано'}
                      </span>
                    </div>
                  )}
                </div>
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
