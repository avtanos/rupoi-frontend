'use client';

import React, { useState } from 'react';
import { Order, OrderStatus, User } from '@/types';
import { ORDER_STATUSES, getOrderStatusById, canTransitionTo, getAvailableTransitions } from '@/constants/order-statuses';
import { CheckCircle, Clock, AlertTriangle, XCircle, Package, Truck, UserCheck, Ban } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface OrderStatusManagerProps {
  order: Order;
  currentUser: User;
  onStatusChange: (orderId: number, newStatus: OrderStatus, comment?: string) => void;
}

const statusIcons = {
  NEW: Clock,
  APPROVED: CheckCircle,
  IN_PROGRESS: Package,
  FITTING: UserCheck,
  WAREHOUSE: Truck,
  ISSUED: CheckCircle,
  ON_APPROVAL: AlertTriangle,
  REJECTED: XCircle
};

export default function OrderStatusManager({ order, currentUser, onStatusChange }: OrderStatusManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const currentStatus = getOrderStatusById(order.status);
  const availableTransitions = getAvailableTransitions(order.status);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setSelectedStatus(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedStatus) return;

    setLoading(true);
    try {
      await apiClient.updateOrderStatus(order.id, selectedStatus.id, {
        comment: comment.trim() || undefined,
        changed_by: currentUser.id
      });
      
      onStatusChange(order.id, selectedStatus, comment.trim() || undefined);
      setShowModal(false);
      setComment('');
      setSelectedStatus(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (statusCode: string) => {
    const IconComponent = statusIcons[statusCode as keyof typeof statusIcons] || Clock;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusColor = (status: OrderStatus) => {
    return status.color;
  };

  if (!currentStatus) {
    return <div className="text-red-500">Неизвестный статус заказа</div>;
  }

  return (
    <div className="space-y-4">
      {/* Текущий статус */}
      <div className="flex items-center space-x-3">
        <div 
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: getStatusColor(currentStatus) }}
        >
          {getStatusIcon(currentStatus.code)}
          <span>{currentStatus.name}</span>
        </div>
        <span className="text-sm text-gray-500">
          {currentStatus.description}
        </span>
      </div>

      {/* История статусов */}
      {order.status_history && order.status_history.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">История изменений</h4>
          <div className="space-y-1">
            {order.status_history.slice(-3).reverse().map((history) => (
              <div key={history.id} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded">
                <div className="flex items-center space-x-2">
                  <span>{history.from_status.name}</span>
                  <span>→</span>
                  <span className="font-medium">{history.to_status.name}</span>
                </div>
                <div className="text-gray-400">
                  {new Date(history.changed_at).toLocaleDateString('ru-RU')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Доступные переходы */}
      {availableTransitions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Доступные действия</h4>
          <div className="flex flex-wrap gap-2">
            {availableTransitions.map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusChange(status)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                {getStatusIcon(status.code)}
                <span>{status.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения */}
      {showModal && selectedStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Изменение статуса заказа
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Из:</span>
                <div 
                  className="flex items-center space-x-2 px-3 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: getStatusColor(currentStatus) }}
                >
                  {getStatusIcon(currentStatus.code)}
                  <span>{currentStatus.name}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">В:</span>
                <div 
                  className="flex items-center space-x-2 px-3 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: getStatusColor(selectedStatus) }}
                >
                  {getStatusIcon(selectedStatus.code)}
                  <span>{selectedStatus.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Комментарий (необязательно)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Укажите причину изменения статуса..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={confirmStatusChange}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
