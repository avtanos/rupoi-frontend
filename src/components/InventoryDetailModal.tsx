'use client';

import React from 'react';
import { X, Package, AlertTriangle, CheckCircle, XCircle, Calendar, DollarSign, Hash } from 'lucide-react';

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

interface InventoryDetailModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function InventoryDetailModal({ item, onClose }: InventoryDetailModalProps) {
  if (!item) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'low_stock':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'out_of_stock':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    const texts = {
      in_stock: 'В наличии',
      low_stock: 'Критический запас',
      out_of_stock: 'Нет в наличии'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isLowStock = item.quantity <= item.min_quantity && item.quantity > 0;
  const isOutOfStock = item.quantity === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Позиция инвентаря
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

        <div className="p-6 space-y-6">
          {/* Основная информация */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Hash className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Артикул:</span>
                <span className="ml-2 text-blue-700 font-mono">{item.article}</span>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Наименование:</span>
                <span className="ml-2 text-blue-700">{item.name}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-blue-800">Категория:</span>
                <span className="ml-2 text-blue-700">{item.category}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Цена:</span>
                <span className="ml-2 text-blue-700 font-mono">{item.price.toLocaleString('ru-RU')} сом</span>
              </div>
            </div>
          </div>

          {/* Количественные показатели */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-900 mb-3">Количественные показатели</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{item.quantity}</div>
                <div className="text-green-600">Текущее количество ({item.unit})</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">{item.min_quantity}</div>
                <div className="text-orange-600">Минимальный запас ({item.unit})</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isLowStock ? 'text-yellow-700' : 'text-green-700'}`}>
                  {item.quantity - item.min_quantity}
                </div>
                <div className={isLowStock ? 'text-yellow-600' : 'text-green-600'}>
                  Резерв ({item.unit})
                </div>
              </div>
            </div>
          </div>

          {/* Статус и предупреждения */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Статус и предупреждения</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Статус:</span>
                <div className="flex items-center">
                  {getStatusIcon(item.status)}
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>

              {isOutOfStock && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">Товар отсутствует на складе</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    Необходимо пополнить склад для продолжения работы
                  </p>
                </div>
              )}

              {isLowStock && !isOutOfStock && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">Критический запас</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Количество товара приближается к минимальному уровню. Рекомендуется пополнить склад.
                  </p>
                </div>
              )}

              {!isLowStock && !isOutOfStock && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Запас в норме</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Количество товара достаточное для нормальной работы
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Рекомендации */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-900 mb-3">Рекомендации</h3>
            <div className="space-y-2 text-sm text-purple-800">
              {isOutOfStock ? (
                <p>• Срочно заказать товар у поставщика</p>
              ) : isLowStock ? (
                <p>• Запланировать заказ товара в ближайшее время</p>
              ) : (
                <p>• Текущий запас достаточен, мониторить уровень остатков</p>
              )}
              <p>• Регулярно проверять актуальность цен</p>
              <p>• Следить за сроками годности (если применимо)</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
