'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { X, Plus, Edit, Trash2, Search, Filter, Database, Settings } from 'lucide-react';

interface DictionaryManagerProps {
  onClose: () => void;
}

interface DictionaryItem {
  id: number;
  name: string;
  code: string;
  [key: string]: any;
}

const DICTIONARY_CONFIGS = {
  oblasts: { name: 'Области', fields: ['name', 'code'] },
  raions: { name: 'Районы', fields: ['name', 'code', 'oblast'] },
  localities: { name: 'Населенные пункты', fields: ['name', 'code', 'raion'] },
  msecs: { name: 'МСЭК организации', fields: ['name', 'code', 'locality'] },
  device_types: { name: 'Типы устройств', fields: ['name', 'code', 'order_type'] },
  amputation_types: { name: 'Типы ампутации', fields: ['name', 'code'] },
  diagnosis_types: { name: 'Типы диагнозов', fields: ['name', 'code'] },
  materials: { name: 'Материалы', fields: ['name', 'code', 'unit', 'price'] },
  works: { name: 'Виды работ', fields: ['name', 'code', 'unit', 'price'] },
  employees: { name: 'Сотрудники', fields: ['first_name', 'last_name', 'position', 'department'] },
  stump_forms: { name: 'Формы культи', fields: ['name', 'code'] },
  scar_types: { name: 'Типы рубцов', fields: ['name', 'code'] },
  skin_condition_types: { name: 'Состояния кожи', fields: ['name', 'code'] },
  bone_dust_types: { name: 'Типы костного опила', fields: ['name', 'code'] },
  shoe_models: { name: 'Модели обуви', fields: ['name', 'code'] },
  shoe_colors: { name: 'Цвета обуви', fields: ['name', 'code'] },
  heel_materials: { name: 'Материалы каблуков', fields: ['name', 'code'] },
  order_statuses: { name: 'Статусы заказов', fields: ['name', 'code'] },
  priority_levels: { name: 'Уровни приоритета', fields: ['name', 'code'] },
  document_types: { name: 'Типы документов', fields: ['name', 'code'] },
  passport_series: { name: 'Серии паспортов', fields: ['name', 'code'] },
  age_groups: { name: 'Возрастные группы', fields: ['name', 'code', 'min_age', 'max_age'] },
  disability_categories: { name: 'Категории инвалидности', fields: ['name', 'code'] },
  disability_causes: { name: 'Причины инвалидности', fields: ['name', 'code'] },
  service_types: { name: 'Типы услуг', fields: ['name', 'code'] }
};

export default function DictionaryManager({ onClose }: DictionaryManagerProps) {
  const [selectedDictionary, setSelectedDictionary] = useState<string>('oblasts');
  const [items, setItems] = useState<DictionaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DictionaryItem | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadDictionaryItems();
  }, [selectedDictionary]);

  const loadDictionaryItems = async () => {
    try {
      setLoading(true);
      const methodName = `get${selectedDictionary.charAt(0).toUpperCase() + selectedDictionary.slice(1)}`;
      const response = await (apiClient as any)[methodName]();
      setItems(response);
    } catch (error) {
      console.error('Failed to load dictionary items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const handleEdit = (item: DictionaryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSave = () => {
    // Здесь должна быть логика сохранения
    console.log('Saving item:', formData);
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
    loadDictionaryItems();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      // Здесь должна быть логика удаления
      console.log('Deleting item:', id);
      loadDictionaryItems();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const filteredItems = items.filter(item => {
    const searchFields = DICTIONARY_CONFIGS[selectedDictionary as keyof typeof DICTIONARY_CONFIGS].fields;
    return searchFields.some(field => 
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const currentConfig = DICTIONARY_CONFIGS[selectedDictionary as keyof typeof DICTIONARY_CONFIGS];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Управление справочниками</h2>
              <p className="text-sm text-gray-500">Редактирование данных системы</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Боковая панель со списком справочников */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Справочники</h3>
            <div className="space-y-1">
              {Object.entries(DICTIONARY_CONFIGS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDictionary(key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedDictionary === key
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>

          {/* Основная область */}
          <div className="flex-1 flex flex-col">
            {/* Заголовок и кнопки */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentConfig.name} ({filteredItems.length})
                </h3>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </button>
              </div>

              {/* Поиск */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Таблица */}
            <div className="flex-1 overflow-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {currentConfig.fields.map((field) => (
                          <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {field}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          {currentConfig.fields.map((field) => (
                            <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item[field] || '-'}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && filteredItems.length === 0 && (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Элементы не найдены</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Форма редактирования */}
        {showForm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Редактировать' : 'Создать'} элемент
              </h3>
              
              <div className="space-y-4">
                {currentConfig.fields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field}
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={formData[field] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
