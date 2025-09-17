'use client';

import React, { useState, useEffect } from 'react';
import { ServiceDirection } from '@/types';
import { apiClient } from '@/lib/api';
import { Plus, Edit, Trash2, Calendar, User, Building, Stethoscope } from 'lucide-react';

interface ServiceDirectionsBlockProps {
  cartId: number;
  directions: ServiceDirection[];
  onUpdate: () => void;
}

export default function ServiceDirectionsBlock({ cartId, directions, onUpdate }: ServiceDirectionsBlockProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingDirection, setEditingDirection] = useState<ServiceDirection | null>(null);
  const [formData, setFormData] = useState({
    direction_date: '',
    diagnosis: '',
    institution: '',
    doctor_name: '',
    service_type: ''
  });

  const handleAddDirection = () => {
    setEditingDirection(null);
    setFormData({
      direction_date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      institution: '',
      doctor_name: '',
      service_type: ''
    });
    setShowForm(true);
  };

  const handleEditDirection = (direction: ServiceDirection) => {
    setEditingDirection(direction);
    setFormData({
      direction_date: direction.direction_date,
      diagnosis: direction.diagnosis,
      institution: direction.institution,
      doctor_name: direction.doctor_name,
      service_type: direction.service_type
    });
    setShowForm(true);
  };

  const handleSaveDirection = async () => {
    try {
      if (editingDirection) {
        // Обновление существующего направления
        // В реальной системе здесь будет API для обновления
        console.log('Updating direction:', editingDirection.id, formData);
      } else {
        // Создание нового направления
        await apiClient.addServiceDirection(cartId, formData);
      }
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to save direction:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDirection(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Направления на услуги</h3>
        <button
          onClick={handleAddDirection}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить направление
        </button>
      </div>

      {directions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Направления не добавлены</p>
      ) : (
        <div className="space-y-4">
          {directions.map((direction) => (
            <div key={direction.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Дата:</span>
                      <span className="ml-2">{new Date(direction.direction_date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="font-medium">Учреждение:</span>
                      <span className="ml-2">{direction.institution}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">Врач:</span>
                      <span className="ml-2">{direction.doctor_name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Stethoscope className="h-4 w-4 mr-2" />
                      <span className="font-medium">Вид услуги:</span>
                      <span className="ml-2">{direction.service_type}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Диагноз:</span> {direction.diagnosis}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEditDirection(direction)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить направление?')) {
                        // В реальной системе здесь будет API для удаления
                        console.log('Deleting direction:', direction.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingDirection ? 'Редактировать направление' : 'Добавить направление'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата направления *
              </label>
              <input
                type="date"
                value={formData.direction_date}
                onChange={(e) => setFormData(prev => ({ ...prev, direction_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Учреждение *
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Название учреждения"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ФИО врача *
              </label>
              <input
                type="text"
                value={formData.doctor_name}
                onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Фамилия И.О."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вид услуги *
              </label>
              <select
                value={formData.service_type}
                onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Выберите вид услуги</option>
                <option value="Протезирование нижней конечности">Протезирование нижней конечности</option>
                <option value="Протезирование верхней конечности">Протезирование верхней конечности</option>
                <option value="Ортопедическая обувь">Ортопедическая обувь</option>
                <option value="Оттобок">Оттобок</option>
                <option value="Ремонт протеза">Ремонт протеза</option>
                <option value="Ремонт обуви">Ремонт обуви</option>
                <option value="Готовые ПОИ">Готовые ПОИ</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Диагноз при направлении *
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Опишите диагноз"
                required
              />
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
              onClick={handleSaveDirection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingDirection ? 'Обновить' : 'Добавить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
