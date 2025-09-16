'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, AlertTriangle, User, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface InventoryItem {
  id: number;
  article: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
  min_quantity: number;
  price: number;
}

interface WarehouseIssueModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onIssue: () => void;
}

export default function WarehouseIssueModal({ item, onClose, onIssue }: WarehouseIssueModalProps) {
  const [formData, setFormData] = useState({
    quantity: 1,
    issued_by: '',
    notes: '',
    order_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData(prev => ({
        ...prev,
        quantity: Math.min(1, item.quantity)
      }));
    }
  }, [item]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Количество должно быть больше 0';
    }

    if (formData.quantity > (item?.quantity || 0)) {
      newErrors.quantity = 'Недостаточно товара на складе';
    }

    if (!formData.issued_by.trim()) {
      newErrors.issued_by = 'ФИО ответственного обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item || !validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const issueData = {
        inventory_item_id: item.id,
        quantity: formData.quantity,
        issued_by: formData.issued_by,
        notes: formData.notes,
        order_id: formData.order_id || null
      };

      await apiClient.issueFromWarehouse(issueData);
      onIssue();
      onClose();
    } catch (error) {
      console.error('Ошибка выдачи со склада:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!item) return null;

  const isLowStock = item.quantity <= item.min_quantity && item.quantity > 0;
  const isOutOfStock = item.quantity === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Выдача со склада
              </h2>
              <p className="text-sm text-gray-500">
                {item.article} - {item.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Информация о товаре */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Информация о товаре</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-blue-800">Артикул:</span>
                <span className="text-blue-700 font-mono">{item.article}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-blue-800">Наименование:</span>
                <span className="text-blue-700">{item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-blue-800">Доступно:</span>
                <span className="text-blue-700 font-bold">{item.quantity} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-blue-800">Минимальный запас:</span>
                <span className="text-blue-700">{item.min_quantity} {item.unit}</span>
              </div>
            </div>

            {/* Предупреждения */}
            {isOutOfStock && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Товар отсутствует на складе</span>
                </div>
                <p className="text-red-700 text-sm mt-1">
                  Выдача невозможна. Необходимо пополнить склад.
                </p>
              </div>
            )}

            {isLowStock && !isOutOfStock && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">Критический запас</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  После выдачи количество товара будет критически низким.
                </p>
              </div>
            )}
          </div>

          {/* Форма выдачи */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Данные выдачи</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество для выдачи *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isOutOfStock}
                />
                <span className="text-sm text-gray-500">{item.unit}</span>
              </div>
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ответственный за выдачу *
              </label>
              <input
                type="text"
                value={formData.issued_by}
                onChange={(e) => handleChange('issued_by', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issued_by ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ФИО ответственного лица"
              />
              {errors.issued_by && (
                <p className="mt-1 text-sm text-red-600">{errors.issued_by}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер заказа (опционально)
              </label>
              <input
                type="text"
                value={formData.order_id}
                onChange={(e) => handleChange('order_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ORD-2025-XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Примечания
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Дополнительная информация о выдаче"
              />
            </div>
          </div>

          {/* Предварительный расчет */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Предварительный расчет</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Текущий остаток:</span>
                <span className="text-gray-700">{item.quantity} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">К выдаче:</span>
                <span className="text-gray-700">{formData.quantity} {item.unit}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2">
                <span className="font-medium text-gray-800">Остаток после выдачи:</span>
                <span className={`font-bold ${
                  (item.quantity - formData.quantity) <= item.min_quantity ? 'text-yellow-700' : 'text-gray-700'
                }`}>
                  {item.quantity - formData.quantity} {item.unit}
                </span>
              </div>
              {(item.quantity - formData.quantity) <= item.min_quantity && (
                <p className="text-yellow-700 text-xs mt-2">
                  ⚠️ После выдачи остаток будет критически низким
                </p>
              )}
            </div>
          </div>
        </form>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || isOutOfStock}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Выдача...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Выдать со склада
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
