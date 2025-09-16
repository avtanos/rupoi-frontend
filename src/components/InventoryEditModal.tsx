'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Save, AlertCircle } from 'lucide-react';
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

interface InventoryEditModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const CATEGORIES = [
  'Протезы',
  'Обувь',
  'Ортопедические изделия',
  'Материалы',
  'Комплектующие',
  'Инструменты',
  'Прочее'
];

const UNITS = [
  'шт',
  'пара',
  'кг',
  'м',
  'л',
  'упак',
  'компл'
];

export default function InventoryEditModal({ item, onClose, onSave }: InventoryEditModalProps) {
  const [formData, setFormData] = useState({
    article: '',
    name: '',
    category: '',
    quantity: 0,
    unit: 'шт',
    min_quantity: 0,
    price: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        article: item.article,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        min_quantity: item.min_quantity,
        price: item.price
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.article.trim()) {
      newErrors.article = 'Артикул обязателен';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Наименование обязательно';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Категория обязательна';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Количество не может быть отрицательным';
    }

    if (formData.min_quantity < 0) {
      newErrors.min_quantity = 'Минимальный запас не может быть отрицательным';
    }

    if (formData.price < 0) {
      newErrors.price = 'Цена не может быть отрицательной';
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
      
      if (item) {
        // Редактирование существующей позиции
        const updatedItem = await apiClient.updateInventoryItem(item.id, formData);
        onSave(updatedItem);
      } else {
        // Создание новой позиции
        const newItem = await apiClient.createInventoryItem(formData);
        onSave(newItem);
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения позиции:', error);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {item ? 'Редактировать позицию' : 'Добавить позицию'}
              </h2>
              <p className="text-sm text-gray-500">
                {item ? `Артикул: ${item.article}` : 'Новая позиция инвентаря'}
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
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Основная информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Артикул *
                </label>
                <input
                  type="text"
                  value={formData.article}
                  onChange={(e) => handleChange('article', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.article ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите артикул"
                />
                {errors.article && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.article}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Наименование *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите наименование"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Выберите категорию</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Единица измерения
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Количественные показатели */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Количественные показатели</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.quantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Минимальный запас
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.min_quantity}
                  onChange={(e) => handleChange('min_quantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.min_quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.min_quantity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.min_quantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена (сом)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Предварительный просмотр статуса */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Предварительный статус</h3>
            <div className="text-sm">
              {formData.quantity > formData.min_quantity ? (
                <div className="flex items-center text-green-700">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  В наличии - запас достаточный
                </div>
              ) : formData.quantity > 0 ? (
                <div className="flex items-center text-yellow-700">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Критический запас - необходимо пополнить
                </div>
              ) : (
                <div className="flex items-center text-red-700">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Нет в наличии - срочно заказать
                </div>
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
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Сохранение...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {item ? 'Сохранить изменения' : 'Создать позицию'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
