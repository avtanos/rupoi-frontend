'use client';

import React, { useState, useEffect } from 'react';
import { Workshop } from '@/types';
import { Plus, Edit, Trash2, Building, Users, Package, Footprints, Wrench, Car, X } from 'lucide-react';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';

interface WorkshopManagerProps {
  onClose: () => void;
}

export default function WorkshopManager({ onClose }: WorkshopManagerProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { isMobile } = useResponsive();
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    type: 'prosthesis' | 'shoes' | 'orthopedic' | 'repair' | 'ready_poi';
    description: string;
    manager_id: number | undefined;
    is_active: boolean;
  }>({
    name: '',
    code: '',
    type: 'prosthesis',
    description: '',
    manager_id: undefined,
    is_active: true
  });

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    // В реальной системе здесь будет API
    const mockWorkshops: Workshop[] = [
      {
        id: 1,
        name: 'Цех протезирования',
        code: 'PROSTHESIS_01',
        type: 'prosthesis',
        description: 'Изготовление протезов нижних и верхних конечностей',
        manager_id: 1,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Цех ортопедической обуви',
        code: 'SHOES_01',
        type: 'shoes',
        description: 'Изготовление ортопедической обуви',
        manager_id: 2,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 3,
        name: 'Цех ортопедических изделий',
        code: 'ORTHOPEDIC_01',
        type: 'orthopedic',
        description: 'Изготовление ортопедических изделий (Оттобок)',
        manager_id: 3,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 4,
        name: 'Цех ремонта',
        code: 'REPAIR_01',
        type: 'repair',
        description: 'Ремонт протезно-ортопедических изделий',
        manager_id: 4,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 5,
        name: 'Склад готовой продукции',
        code: 'READY_POI_01',
        type: 'ready_poi',
        description: 'Выдача готовых протезно-ортопедических изделий',
        manager_id: 5,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ];
    setWorkshops(mockWorkshops);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prosthesis': return <Package className="h-4 w-4" />;
      case 'shoes': return <Footprints className="h-4 w-4" />;
      case 'orthopedic': return <Building className="h-4 w-4" />;
      case 'repair': return <Wrench className="h-4 w-4" />;
      case 'ready_poi': return <Car className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'prosthesis': return 'Протезы';
      case 'shoes': return 'Обувь';
      case 'orthopedic': return 'Оттобок';
      case 'repair': return 'Ремонт';
      case 'ready_poi': return 'Готовые ПОИ';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prosthesis': return 'bg-blue-100 text-blue-800';
      case 'shoes': return 'bg-green-100 text-green-800';
      case 'orthopedic': return 'bg-purple-100 text-purple-800';
      case 'repair': return 'bg-yellow-100 text-yellow-800';
      case 'ready_poi': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateWorkshop = () => {
    setEditingWorkshop(null);
    setFormData({
      name: '',
      code: '',
      type: 'prosthesis',
      description: '',
      manager_id: undefined,
      is_active: true
    });
    setShowForm(true);
  };

  const handleEditWorkshop = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      name: workshop.name,
      code: workshop.code,
      type: workshop.type,
      description: workshop.description || '',
      manager_id: workshop.manager_id,
      is_active: workshop.is_active
    });
    setShowForm(true);
  };

  const handleSaveWorkshop = () => {
    if (editingWorkshop) {
      // Обновление существующего цеха
      setWorkshops(prev => prev.map(w => 
        w.id === editingWorkshop.id 
          ? { ...w, ...formData, updated_at: new Date().toISOString() }
          : w
      ));
    } else {
      // Создание нового цеха
      const newWorkshop: Workshop = {
        id: Math.max(...workshops.map(w => w.id)) + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setWorkshops(prev => [...prev, newWorkshop]);
    }
    setShowForm(false);
    setEditingWorkshop(null);
  };

  const handleDeleteWorkshop = (id: number) => {
    if (confirm('Удалить цех?')) {
      setWorkshops(prev => prev.filter(w => w.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWorkshop(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Управление цехами
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-md font-medium text-gray-900">Список цехов</h4>
            <button
              onClick={handleCreateWorkshop}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить цех
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshops.map((workshop) => (
              <div key={workshop.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getTypeIcon(workshop.type)}
                    <h5 className="text-lg font-medium text-gray-900 ml-2">{workshop.name}</h5>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditWorkshop(workshop)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWorkshop(workshop.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Код:</span>
                    <span className="text-sm font-medium">{workshop.code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Тип:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(workshop.type)}`}>
                      {getTypeText(workshop.type)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Статус:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      workshop.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {workshop.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                  {workshop.description && (
                    <div>
                      <span className="text-sm text-gray-600">Описание:</span>
                      <p className="text-sm text-gray-900 mt-1">{workshop.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              {editingWorkshop ? 'Редактировать цех' : 'Добавить цех'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название цеха *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Код цеха *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип цеха *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="prosthesis">Протезы</option>
                  <option value="shoes">Обувь</option>
                  <option value="orthopedic">Оттобок</option>
                  <option value="repair">Ремонт</option>
                  <option value="ready_poi">Готовые ПОИ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID руководителя
                </label>
                <input
                  type="number"
                  value={formData.manager_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, manager_id: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Активен</span>
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
                onClick={handleSaveWorkshop}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingWorkshop ? 'Обновить' : 'Добавить'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
