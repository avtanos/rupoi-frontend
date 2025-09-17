'use client';

import React, { useState, useEffect } from 'react';
import { SemiFinishedProduct } from '@/types';
import { apiClient } from '@/lib/api';
import { Plus, Edit, Trash2, Package, CheckSquare, Square } from 'lucide-react';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';

interface SemiFinishedProductsBlockProps {
  orderId: number;
  products: SemiFinishedProduct[];
  onUpdate: () => void;
}

export default function SemiFinishedProductsBlock({ orderId, products, onUpdate }: SemiFinishedProductsBlockProps) {
  const [showForm, setShowForm] = useState(false);
  const { isMobile } = useResponsive();
  const [editingProduct, setEditingProduct] = useState<SemiFinishedProduct | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    size: '',
    quantity_left: 0,
    quantity_right: 0,
    is_mold: false
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      code: '',
      size: '',
      quantity_left: 0,
      quantity_right: 0,
      is_mold: false
    });
    setShowForm(true);
  };

  const handleEditProduct = (product: SemiFinishedProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      size: product.size,
      quantity_left: product.quantity_left,
      quantity_right: product.quantity_right,
      is_mold: product.is_mold
    });
    setShowForm(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        // Обновление существующего полуфабриката
        console.log('Updating product:', editingProduct.id, formData);
      } else {
        // Создание нового полуфабриката
        await apiClient.addSemiFinishedProduct(orderId, formData);
      }
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Полуфабрикаты
        </h3>
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить полуфабрикат
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Полуфабрикаты не добавлены</p>
      ) : (
        isMobile ? (
            // Мобильное отображение в виде карточек
            <MobileCardView
              data={data}
              columns={columns}
            />
          ) : (
            // Десктопное отображение в виде таблицы
            <ResponsiveTable>
            <ResponsiveTableHeader>
              <ResponsiveTableRow>
                <ResponsiveTableCell isHeader >
                  Наименование
                </ResponsiveTableCell>
                <ResponsiveTableCell isHeader >
                  Шифр
                </ResponsiveTableCell>
                <ResponsiveTableCell isHeader >
                  Размер
                </ResponsiveTableCell>
                <ResponsiveTableCell isHeader >
                  Левый
                </ResponsiveTableCell>
                <ResponsiveTableCell isHeader >
                  Правый
                </ResponsiveTableCell>
                <ResponsiveTableCell isHeader >
                  Слепок
                </ResponsiveTableCell>
                <ResponsiveTableCell isHeader >
                  Действия
                </ResponsiveTableCell>
              </ResponsiveTableRow>
            </ResponsiveTableHeader>
            <ResponsiveTableBody>
              {products.map((product) => (
                <ResponsiveTableRow key={product.id}>
                  <ResponsiveTableCell className="font-medium text-gray-900">
                    {product.name}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {product.code}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {product.size}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {product.quantity_left}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {product.quantity_right}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell className="text-gray-500">
                    {product.is_mold ? (
                      <CheckSquare className="h-4 w-4 text-green-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell >
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Удалить полуфабрикат?')) {
                            // В реальной системе здесь будет API для удаления
                            console.log('Deleting product:', product.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </ResponsiveTableCell>
                </ResponsiveTableRow>
              ))}
            </ResponsiveTableBody>
          </ResponsiveTable>
          )
      )}

      {showForm && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingProduct ? 'Редактировать полуфабрикат' : 'Добавить полуфабрикат'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Наименование полуфабриката *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите наименование"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Шифр полуфабриката *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите шифр"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Размер *
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите размер"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество левый *
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity_left}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity_left: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество правый *
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity_right}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity_right: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_mold}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_mold: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Слепок</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={handleSaveProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingProduct ? 'Обновить' : 'Добавить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
