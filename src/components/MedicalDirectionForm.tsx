'use client';

import React, { useState, useEffect } from 'react';
import { Cart, ServiceDirection } from '@/types';
import { apiClient } from '@/lib/api';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface MedicalDirectionFormProps {
  direction?: ServiceDirection | null;
  onSave: (direction: ServiceDirection) => void;
  onCancel: () => void;
}

export default function MedicalDirectionForm({ direction, onSave, onCancel }: MedicalDirectionFormProps) {
  const [formData, setFormData] = useState({
    cart_id: '',
    direction_number: '',
    service_type: '',
    diagnosis: '',
    recommendations: '',
    priority: 'normal',
    status: 'pending'
  });
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCarts();
    if (direction) {
      setFormData({
        cart_id: direction.cart_id?.toString() || '',
        direction_number: direction.direction_number || '',
        service_type: direction.service_type || '',
        diagnosis: direction.diagnosis || '',
        recommendations: direction.recommendations || '',
        priority: direction.priority || 'normal',
        status: direction.status || 'pending'
      });
    } else {
      // Генерация номера направления для нового
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({
        ...prev,
        direction_number: `${year}/${month}/${randomNum}`
      }));
    }
  }, [direction]);

  const loadCarts = async () => {
    try {
      const response = await apiClient.getCarts();
      setCarts(response.results);
    } catch (error) {
      console.error('Failed to load carts:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cart_id) {
      newErrors.cart_id = 'Выберите пациента';
    }
    if (!formData.direction_number) {
      newErrors.direction_number = 'Номер направления обязателен';
    }
    if (!formData.service_type) {
      newErrors.service_type = 'Тип услуги обязателен';
    }
    if (!formData.diagnosis) {
      newErrors.diagnosis = 'Диагноз обязателен';
    }
    if (!formData.recommendations) {
      newErrors.recommendations = 'Рекомендации обязательны';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const directionData: ServiceDirection = {
        id: direction?.id || Date.now(),
        cart_id: parseInt(formData.cart_id),
        direction_number: formData.direction_number,
        service_type: formData.service_type,
        diagnosis: formData.diagnosis,
        recommendations: formData.recommendations,
        priority: formData.priority as 'low' | 'normal' | 'high',
        status: formData.status as 'pending' | 'approved' | 'rejected',
        created_at: direction?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      onSave(directionData);
    } catch (error) {
      console.error('Failed to save direction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'normal':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {direction ? 'Редактирование направления' : 'Создание направления'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Пациент */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пациент <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cart_id}
                onChange={(e) => handleFieldChange('cart_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cart_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Выберите пациента</option>
                {carts.map((cart) => (
                  <option key={cart.id} value={cart.id}>
                    {cart.first_name} {cart.name} {cart.parent_name} ({cart.card_number})
                  </option>
                ))}
              </select>
              {errors.cart_id && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cart_id}
                </p>
              )}
            </div>

            {/* Номер направления */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер направления <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.direction_number}
                onChange={(e) => handleFieldChange('direction_number', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.direction_number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="2025/001"
              />
              {errors.direction_number && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.direction_number}
                </p>
              )}
            </div>

            {/* Тип услуги */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип услуги <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.service_type}
                onChange={(e) => handleFieldChange('service_type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.service_type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Выберите тип услуги</option>
                <option value="Протезирование">Протезирование</option>
                <option value="Ортопедическая обувь">Ортопедическая обувь</option>
                <option value="Ортезирование">Ортезирование</option>
                <option value="Ремонт">Ремонт</option>
                <option value="Консультация">Консультация</option>
              </select>
              {errors.service_type && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.service_type}
                </p>
              )}
            </div>

            {/* Диагноз */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Диагноз <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => handleFieldChange('diagnosis', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.diagnosis ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Введите диагноз"
              />
              {errors.diagnosis && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.diagnosis}
                </p>
              )}
            </div>

            {/* Рекомендации */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Рекомендации <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.recommendations}
                onChange={(e) => handleFieldChange('recommendations', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.recommendations ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Введите рекомендации по лечению"
              />
              {errors.recommendations && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.recommendations}
                </p>
              )}
            </div>

            {/* Приоритет */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Приоритет
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Низкий</option>
                <option value="normal">Обычный</option>
                <option value="high">Высокий</option>
              </select>
            </div>

            {/* Статус */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">На рассмотрении</option>
                <option value="approved">Одобрено</option>
                <option value="rejected">Отклонено</option>
              </select>
            </div>
          </div>

          {/* Предварительный просмотр */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Предварительный просмотр:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Номер:</span>
                <span className="font-medium">{formData.direction_number || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Пациент:</span>
                <span className="font-medium">
                  {formData.cart_id ? 
                    carts.find(c => c.id === parseInt(formData.cart_id))?.first_name + ' ' + 
                    carts.find(c => c.id === parseInt(formData.cart_id))?.name + ' ' + 
                    carts.find(c => c.id === parseInt(formData.cart_id))?.parent_name : '—'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Тип услуги:</span>
                <span className="font-medium">{formData.service_type || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Приоритет:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                  {formData.priority === 'high' ? 'Высокий' : 
                   formData.priority === 'normal' ? 'Обычный' : 'Низкий'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Статус:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(formData.status)}`}>
                  {formData.status === 'pending' ? 'На рассмотрении' : 
                   formData.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                </span>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {direction ? 'Сохранить изменения' : 'Создать направление'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
