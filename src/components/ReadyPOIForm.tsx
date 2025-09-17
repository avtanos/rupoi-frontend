'use client';

import React, { useState, useEffect } from 'react';
import { ReadyPOI } from '@/types';
import { apiClient } from '@/lib/api';
import { X, Car, Headphones, Heart, Package } from 'lucide-react';

interface ReadyPOIFormProps {
  orderId: number;
  onSave: (poi: ReadyPOI) => void;
  onCancel: () => void;
}

export default function ReadyPOIForm({ orderId, onSave, onCancel }: ReadyPOIFormProps) {
  const [formData, setFormData] = useState({
    wheelchair: false,
    wheelchair_type: '',
    hearing_aid: false,
    hearing_aid_type: '',
    pgj: false,
    pgj_type: '',
    other: false,
    other_description: ''
  });

  useEffect(() => {
    loadExistingPOI();
  }, [orderId]);

  const loadExistingPOI = async () => {
    try {
      const poi = await apiClient.getReadyPOI(orderId);
      if (poi) {
        setFormData({
          wheelchair: poi.wheelchair || false,
          wheelchair_type: poi.wheelchair_type || '',
          hearing_aid: poi.hearing_aid || false,
          hearing_aid_type: poi.hearing_aid_type || '',
          pgj: poi.pgj || false,
          pgj_type: poi.pgj_type || '',
          other: poi.other || false,
          other_description: poi.other_description || ''
        });
      }
    } catch (error) {
      console.error('Failed to load ready POI:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const poi = await apiClient.updateReadyPOI(orderId, formData);
      onSave(poi);
    } catch (error) {
      console.error('Failed to save ready POI:', error);
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked,
      [`${field}_type`]: checked ? prev[`${field}_type` as keyof typeof prev] : ''
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Готовые протезно-ортопедические изделия
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Кресло-коляска */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Car className="h-5 w-5 text-blue-600 mr-2" />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.wheelchair}
                    onChange={(e) => handleCheckboxChange('wheelchair', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Кресло-коляска</span>
                </label>
              </div>
              {formData.wheelchair && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип кресла-коляски
                  </label>
                  <select
                    value={formData.wheelchair_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, wheelchair_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите тип</option>
                    <option value="Инвалидная коляска">Инвалидная коляска</option>
                    <option value="Кресло-коляска активного типа">Кресло-коляска активного типа</option>
                    <option value="Кресло-коляска с электроприводом">Кресло-коляска с электроприводом</option>
                    <option value="Кресло-коляска для детей">Кресло-коляска для детей</option>
                  </select>
                </div>
              )}
            </div>

            {/* Слуховой аппарат */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Headphones className="h-5 w-5 text-green-600 mr-2" />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hearing_aid}
                    onChange={(e) => handleCheckboxChange('hearing_aid', e.target.checked)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Слуховой аппарат</span>
                </label>
              </div>
              {formData.hearing_aid && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип слухового аппарата
                  </label>
                  <select
                    value={formData.hearing_aid_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, hearing_aid_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Выберите тип</option>
                    <option value="Заушный">Заушный</option>
                    <option value="Внутриушной">Внутриушной</option>
                    <option value="Карманный">Карманный</option>
                    <option value="Костный">Костный</option>
                    <option value="Цифровой">Цифровой</option>
                  </select>
                </div>
              )}
            </div>

            {/* ПГЖ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 text-red-600 mr-2" />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.pgj}
                    onChange={(e) => handleCheckboxChange('pgj', e.target.checked)}
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">ПГЖ (Протез грудной железы)</span>
                </label>
              </div>
              {formData.pgj && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип ПГЖ
                  </label>
                  <select
                    value={formData.pgj_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, pgj_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Выберите тип</option>
                    <option value="Силиконовый">Силиконовый</option>
                    <option value="Полиуретановый">Полиуретановый</option>
                    <option value="Текстильный">Текстильный</option>
                    <option value="С самофиксацией">С самофиксацией</option>
                  </select>
                </div>
              )}
            </div>

            {/* Другие изделия */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Package className="h-5 w-5 text-purple-600 mr-2" />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.other}
                    onChange={(e) => handleCheckboxChange('other', e.target.checked)}
                    className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Другие изделия</span>
                </label>
              </div>
              {formData.other && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание других изделий
                  </label>
                  <textarea
                    value={formData.other_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, other_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Опишите другие протезно-ортопедические изделия"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
