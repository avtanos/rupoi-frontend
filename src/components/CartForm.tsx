'use client';

import React, { useState, useEffect } from 'react';
import { Cart, Oblast, Raion, Locality, MSEC, Disability } from '@/types';
import { apiClient } from '@/lib/api';

interface CartFormProps {
  cart?: Cart;
  onSave: (cart: Cart) => void;
  onCancel: () => void;
}

export default function CartForm({ cart, onSave, onCancel }: CartFormProps) {
  const [formData, setFormData] = useState<Partial<Cart>>({
    first_name: '',
    name: '',
    parent_name: '',
    sex: 'male',
    birth_date: '',
    inn: '',
    document_type: 'Паспорт',
    document_series: '',
    document_number: '',
    document_issue_date: '',
    document_issued_by: '',
    lovz_type: '',
    lovz_group: 1,
    note: '',
    registration_oblast_id: 1,
    registration_raion_id: 1,
    registration_locality_id: 1,
    living_oblast_id: 1,
    living_raion_id: 1,
    living_locality_id: 1,
    registration_address: '',
    living_address: '',
    reference_msec: '',
    pension_certificate_number: '',
    pension_certificate_issue_date: '',
    msec_id: 1,
    pension_certificate_indefinitely: false,
    pension_certificate_term_end_date: '',
    work_place: '',
    phone_number: '',
    additional_phone_number: '',
    medical_department_direct_date: '',
    deregistration_date: '',
    deregistration_reason: '',
    ...cart
  });

  const [oblasts, setOblasts] = useState<Oblast[]>([]);
  const [raions, setRaions] = useState<Raion[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [msecs, setMsecs] = useState<MSEC[]>([]);
  const [disabilities, setDisabilities] = useState<Disability[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDictionaries();
  }, []);

  const loadDictionaries = async () => {
    try {
      const [oblastsData, disabilitiesData] = await Promise.all([
        apiClient.getOblasts(),
        apiClient.getDisabilities()
      ]);
      setOblasts(oblastsData);
      setDisabilities(disabilitiesData);
    } catch (error) {
      console.error('Ошибка загрузки справочников:', error);
    }
  };

  const handleOblastChange = async (field: 'registration_oblast_id' | 'living_oblast_id', value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    try {
      const raionsData = await apiClient.getRaions(value);
      setRaions(raionsData);
    } catch (error) {
      console.error('Ошибка загрузки районов:', error);
    }
  };

  const handleRaionChange = async (field: 'registration_raion_id' | 'living_raion_id', value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    try {
      const localitiesData = await apiClient.getLocalities(value);
      setLocalities(localitiesData);
    } catch (error) {
      console.error('Ошибка загрузки населенных пунктов:', error);
    }
  };

  const handleLocalityChange = async (field: 'registration_locality_id' | 'living_locality_id', value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    try {
      const msecsData = await apiClient.getMSECs(value);
      setMsecs(msecsData);
    } catch (error) {
      console.error('Ошибка загрузки МСЭК:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData as Cart);
    } catch (error) {
      console.error('Ошибка сохранения карточки:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основная информация */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Фамилия *
            </label>
            <input
              type="text"
              required
              value={formData.first_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя *
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Отчество
            </label>
            <input
              type="text"
              value={formData.parent_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, parent_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пол *
            </label>
            <select
              required
              value={formData.sex || 'male'}
              onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as 'male' | 'female' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата рождения *
            </label>
            <input
              type="date"
              required
              value={formData.birth_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ИНН *
            </label>
            <input
              type="text"
              required
              value={formData.inn || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, inn: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Группа ЛОВЗ *
            </label>
            <select
              required
              value={formData.lovz_group || 1}
              onChange={(e) => setFormData(prev => ({ ...prev, lovz_group: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 группа</option>
              <option value={2}>2 группа</option>
              <option value={3}>3 группа</option>
            </select>
          </div>
        </div>
      </div>

      {/* Документы */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Документы</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип документа *
            </label>
            <select
              required
              value={formData.document_type || 'Паспорт'}
              onChange={(e) => setFormData(prev => ({ ...prev, document_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Паспорт">Паспорт</option>
              <option value="Свидетельство о рождении">Свидетельство о рождении</option>
              <option value="Удостоверение личности">Удостоверение личности</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Серия
            </label>
            <input
              type="text"
              value={formData.document_series || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, document_series: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер *
            </label>
            <input
              type="text"
              required
              value={formData.document_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, document_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата выдачи
            </label>
            <input
              type="date"
              value={formData.document_issue_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, document_issue_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Кем выдан
            </label>
            <input
              type="text"
              value={formData.document_issued_by || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, document_issued_by: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Адресные данные */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Адресные данные</h3>
        
        {/* Адрес регистрации */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">Адрес регистрации</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Область *
              </label>
              <select
                required
                value={formData.registration_oblast_id || 1}
                onChange={(e) => handleOblastChange('registration_oblast_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {oblasts.map(oblast => (
                  <option key={oblast.id} value={oblast.id}>{oblast.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Район *
              </label>
              <select
                required
                value={formData.registration_raion_id || 1}
                onChange={(e) => handleRaionChange('registration_raion_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {raions.map(raion => (
                  <option key={raion.id} value={raion.id}>{raion.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Населенный пункт *
              </label>
              <select
                required
                value={formData.registration_locality_id || 1}
                onChange={(e) => handleLocalityChange('registration_locality_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {localities.map(locality => (
                  <option key={locality.id} value={locality.id}>{locality.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Полный адрес регистрации
            </label>
            <input
              type="text"
              value={formData.registration_address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Адрес проживания */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Адрес проживания</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Область *
              </label>
              <select
                required
                value={formData.living_oblast_id || 1}
                onChange={(e) => handleOblastChange('living_oblast_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {oblasts.map(oblast => (
                  <option key={oblast.id} value={oblast.id}>{oblast.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Район *
              </label>
              <select
                required
                value={formData.living_raion_id || 1}
                onChange={(e) => handleRaionChange('living_raion_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {raions.map(raion => (
                  <option key={raion.id} value={raion.id}>{raion.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Населенный пункт *
              </label>
              <select
                required
                value={formData.living_locality_id || 1}
                onChange={(e) => handleLocalityChange('living_locality_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {localities.map(locality => (
                  <option key={locality.id} value={locality.id}>{locality.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Полный адрес проживания
            </label>
            <input
              type="text"
              value={formData.living_address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, living_address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Контактная информация */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Контактная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон *
            </label>
            <input
              type="tel"
              required
              value={formData.phone_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дополнительный телефон
            </label>
            <input
              type="tel"
              value={formData.additional_phone_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, additional_phone_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Место работы
          </label>
          <input
            type="text"
            value={formData.work_place || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, work_place: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}
