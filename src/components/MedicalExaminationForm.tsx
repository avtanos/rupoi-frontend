'use client';

import React, { useState, useEffect } from 'react';
import { Order, DiagnosisType, DeviceType } from '@/types';
import { apiClient } from '@/lib/api';
import { X, Stethoscope, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface MedicalExaminationFormProps {
  order: Order;
  onSave: (examinationData: any) => void;
  onCancel: () => void;
}

export default function MedicalExaminationForm({ order, onSave, onCancel }: MedicalExaminationFormProps) {
  const [formData, setFormData] = useState({
    medical_diagnosis: '',
    medical_recommendations: '',
    medical_conclusion: '',
    medical_notes: '',
    examination_date: new Date().toISOString().split('T')[0],
    doctor_name: '',
    doctor_specialty: '',
    is_approved: false,
    rejection_reason: '',
    requires_additional_examination: false,
    additional_examination_notes: '',
    follow_up_date: '',
    priority_level: 'normal' // normal, high, urgent
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('examination'); // 'examination', 'conclusion', 'recommendations'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.medical_diagnosis.trim()) {
      newErrors.medical_diagnosis = 'Медицинский диагноз обязателен';
    }
    if (!formData.doctor_name.trim()) {
      newErrors.doctor_name = 'ФИО врача обязательно';
    }
    if (!formData.doctor_specialty.trim()) {
      newErrors.doctor_specialty = 'Специальность врача обязательна';
    }
    if (!formData.is_approved && !formData.rejection_reason.trim()) {
      newErrors.rejection_reason = 'При отклонении необходимо указать причину';
    }
    if (formData.requires_additional_examination && !formData.additional_examination_notes.trim()) {
      newErrors.additional_examination_notes = 'При назначении дополнительного обследования необходимо указать детали';
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
      const examinationData = {
        ...formData,
        order_id: order.id,
        examination_date: new Date(formData.examination_date).toISOString(),
        follow_up_date: formData.follow_up_date ? new Date(formData.follow_up_date).toISOString() : null
      };

      await onSave(examinationData);
    } catch (error) {
      console.error('Failed to save examination:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Stethoscope className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Медицинский осмотр
              </h2>
              <p className="text-sm text-gray-500">
                Заказ №{order.number} - {order.cart?.first_name || ''} {order.cart?.last_name || ''}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Информация о заказе */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-blue-900 mb-3">Информация о заказе</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Пациент:</span>
                  <p className="text-blue-700">{order.cart?.first_name || ''} {order.cart?.last_name || ''} {order.cart?.middle_name || ''}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">ИНН:</span>
                  <p className="text-blue-700">{order.cart?.inn || 'Не указан'}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Тип изделия:</span>
                  <p className="text-blue-700">{order.device_type?.name || 'Не указан'}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Диагноз:</span>
                  <p className="text-blue-700">{order.diagnosis_type?.name || 'Не указан'}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Сторона:</span>
                  <p className="text-blue-700">{order.diagnosis_side === 'right' ? 'Правая' : order.diagnosis_side === 'left' ? 'Левая' : 'Обе'}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Количество:</span>
                  <p className="text-blue-700">{order.quantity}</p>
                </div>
              </div>
            </div>

            {/* Вкладки */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab('examination')}
                  className={`${
                    activeTab === 'examination'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  <Stethoscope className="h-4 w-4 inline mr-2" />
                  Осмотр
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('conclusion')}
                  className={`${
                    activeTab === 'conclusion'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Заключение
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('recommendations')}
                  className={`${
                    activeTab === 'recommendations'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  Рекомендации
                </button>
              </nav>
            </div>

            {/* Вкладка осмотра */}
            {activeTab === 'examination' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <label htmlFor="examination_date" className="block text-sm font-medium text-gray-700">
                      Дата осмотра <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="examination_date"
                      id="examination_date"
                      value={formData.examination_date}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="doctor_name" className="block text-sm font-medium text-gray-700">
                      ФИО врача <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="doctor_name"
                      id="doctor_name"
                      value={formData.doctor_name}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.doctor_name ? 'border-red-500' : ''}`}
                      placeholder="Введите ФИО врача"
                      required
                    />
                    {errors.doctor_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.doctor_name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="doctor_specialty" className="block text-sm font-medium text-gray-700">
                      Специальность врача <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="doctor_specialty"
                      id="doctor_specialty"
                      value={formData.doctor_specialty}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.doctor_specialty ? 'border-red-500' : ''}`}
                      placeholder="Например: Врач-ортопед"
                      required
                    />
                    {errors.doctor_specialty && (
                      <p className="mt-1 text-sm text-red-600">{errors.doctor_specialty}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="priority_level" className="block text-sm font-medium text-gray-700">
                      Приоритет
                    </label>
                    <select
                      name="priority_level"
                      id="priority_level"
                      value={formData.priority_level}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    >
                      <option value="normal">Обычный</option>
                      <option value="high">Высокий</option>
                      <option value="urgent">Срочный</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="medical_diagnosis" className="block text-sm font-medium text-gray-700">
                    Медицинский диагноз <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="medical_diagnosis"
                    id="medical_diagnosis"
                    rows={4}
                    value={formData.medical_diagnosis}
                    onChange={handleChange}
                    className={`mt-1 block w-full input ${errors.medical_diagnosis ? 'border-red-500' : ''}`}
                    placeholder="Опишите медицинский диагноз пациента..."
                    required
                  />
                  {errors.medical_diagnosis && (
                    <p className="mt-1 text-sm text-red-600">{errors.medical_diagnosis}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="medical_notes" className="block text-sm font-medium text-gray-700">
                    Заметки врача
                  </label>
                  <textarea
                    name="medical_notes"
                    id="medical_notes"
                    rows={3}
                    value={formData.medical_notes}
                    onChange={handleChange}
                    className="mt-1 block w-full input"
                    placeholder="Дополнительные заметки о состоянии пациента..."
                  />
                </div>
              </div>
            )}

            {/* Вкладка заключения */}
            {activeTab === 'conclusion' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="text-sm font-medium text-yellow-800">
                      Решение по заказу
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-yellow-700">
                    Выберите решение по данному заказу на основе медицинского осмотра
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="is_approved"
                      id="approve"
                      value="true"
                      checked={formData.is_approved === true}
                      onChange={() => setFormData(prev => ({ ...prev, is_approved: true }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="approve" className="ml-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Утвердить заказ</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="is_approved"
                      id="reject"
                      value="false"
                      checked={formData.is_approved === false}
                      onChange={() => setFormData(prev => ({ ...prev, is_approved: false }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <label htmlFor="reject" className="ml-3 flex items-center">
                      <X className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Отклонить заказ</span>
                    </label>
                  </div>
                </div>

                {!formData.is_approved && (
                  <div>
                    <label htmlFor="rejection_reason" className="block text-sm font-medium text-gray-700">
                      Причина отклонения <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="rejection_reason"
                      id="rejection_reason"
                      rows={3}
                      value={formData.rejection_reason}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.rejection_reason ? 'border-red-500' : ''}`}
                      placeholder="Укажите причину отклонения заказа..."
                      required={!formData.is_approved}
                    />
                    {errors.rejection_reason && (
                      <p className="mt-1 text-sm text-red-600">{errors.rejection_reason}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="medical_conclusion" className="block text-sm font-medium text-gray-700">
                    Медицинское заключение
                  </label>
                  <textarea
                    name="medical_conclusion"
                    id="medical_conclusion"
                    rows={4}
                    value={formData.medical_conclusion}
                    onChange={handleChange}
                    className="mt-1 block w-full input"
                    placeholder="Подробное медицинское заключение..."
                  />
                </div>
              </div>
            )}

            {/* Вкладка рекомендаций */}
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="requires_additional_examination"
                    id="requires_additional_examination"
                    checked={formData.requires_additional_examination}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requires_additional_examination" className="ml-2 block text-sm text-gray-900">
                    Требуется дополнительное обследование
                  </label>
                </div>

                {formData.requires_additional_examination && (
                  <div>
                    <label htmlFor="additional_examination_notes" className="block text-sm font-medium text-gray-700">
                      Детали дополнительного обследования <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="additional_examination_notes"
                      id="additional_examination_notes"
                      rows={3}
                      value={formData.additional_examination_notes}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.additional_examination_notes ? 'border-red-500' : ''}`}
                      placeholder="Опишите, какое дополнительное обследование требуется..."
                      required={formData.requires_additional_examination}
                    />
                    {errors.additional_examination_notes && (
                      <p className="mt-1 text-sm text-red-600">{errors.additional_examination_notes}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="medical_recommendations" className="block text-sm font-medium text-gray-700">
                    Рекомендации по лечению
                  </label>
                  <textarea
                    name="medical_recommendations"
                    id="medical_recommendations"
                    rows={4}
                    value={formData.medical_recommendations}
                    onChange={handleChange}
                    className="mt-1 block w-full input"
                    placeholder="Рекомендации по лечению и реабилитации..."
                  />
                </div>

                <div>
                  <label htmlFor="follow_up_date" className="block text-sm font-medium text-gray-700">
                    Дата повторного осмотра
                  </label>
                  <input
                    type="date"
                    name="follow_up_date"
                    id="follow_up_date"
                    value={formData.follow_up_date}
                    onChange={handleChange}
                    className="mt-1 block w-full input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Сохранение...' : 'Сохранить осмотр'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
