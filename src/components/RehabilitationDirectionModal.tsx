'use client';

import React, { useState } from 'react';
import { RehabilitationDirection } from '@/types';
import { apiClient } from '@/lib/api';
import { X, FileText, Calendar, User } from 'lucide-react';

interface RehabilitationDirectionModalProps {
  cartId: number;
  onClose: () => void;
  onSave: (direction: RehabilitationDirection) => void;
}

export default function RehabilitationDirectionModal({ cartId, onClose, onSave }: RehabilitationDirectionModalProps) {
  const [formData, setFormData] = useState({
    direction_date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    msec_certificate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const direction = await apiClient.addRehabilitationDirection(cartId, formData);
      onSave(direction);
      onClose();
    } catch (error) {
      console.error('Failed to create rehabilitation direction:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Направление на реабилитацию в ЦР ЛОВЗ
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата направления *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.direction_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, direction_date: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Диагноз *
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Опишите диагноз для направления на реабилитацию"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Справка МСЭК *
              </label>
              <textarea
                value={formData.msec_certificate}
                onChange={(e) => setFormData(prev => ({ ...prev, msec_certificate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Данные справки МСЭК"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Информация</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Номер направления будет сгенерирован автоматически в формате ГОД/НОМЕР
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Создать направление
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
