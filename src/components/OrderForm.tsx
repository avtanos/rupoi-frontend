'use client';

import React, { useState, useEffect } from 'react';
import { Order, Cart, DeviceType, DiagnosisType, ShoeModel, ShoeColor, HeelMaterial, OrderMeasurement, Material, OrderMaterial } from '@/types';
import { apiClient } from '@/lib/api';
import { X, Calendar, User, Package, AlertCircle } from 'lucide-react';

interface OrderFormProps {
  order?: Order;
  onSave: (orderData: Order) => void;
  onCancel: () => void;
}

export default function OrderForm({ order, onSave, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState<Partial<Order>>(order || {});
  const [carts, setCarts] = useState<Cart[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [diagnosisTypes, setDiagnosisTypes] = useState<DiagnosisType[]>([]);
  const [shoeModels, setShoeModels] = useState<ShoeModel[]>([]);
  const [shoeColors, setShoeColors] = useState<ShoeColor[]>([]);
  const [heelMaterials, setHeelMaterials] = useState<HeelMaterial[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'measurements', 'process'

  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        setLoading(true);
        const [cartsData, deviceTypesData, diagnosisTypesData, shoeModelsData, shoeColorsData, heelMaterialsData, materialsData] = await Promise.all([
          apiClient.getCarts(),
          apiClient.getDeviceTypes(),
          apiClient.getDiagnosisTypes(),
          apiClient.getShoeModels(),
          apiClient.getShoeColors(),
          apiClient.getHeelMaterials(),
          apiClient.getMaterials()
        ]);
        
        setCarts(cartsData.results);
        setDeviceTypes(deviceTypesData);
        setDiagnosisTypes(diagnosisTypesData);
        setShoeModels(shoeModelsData);
        setShoeColors(shoeColorsData);
        setHeelMaterials(heelMaterialsData);
        setMaterials(materialsData);
      } catch (error) {
        console.error('Failed to load dictionaries:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDictionaries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMeasurementChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      measurements: prev.measurements?.map((measurement, i) => 
        i === index ? { ...measurement, [field]: value } : measurement
      ) || []
    }));
  };

  const addMeasurement = () => {
    setFormData(prev => ({
      ...prev,
      measurements: [
        ...(prev.measurements || []),
        {
          id: Date.now(),
          order_id: prev.id || 0,
          type: 'length',
          measurement: 0,
          unit: 'см',
          side: 'right'
        }
      ]
    }));
  };

  const removeMeasurement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      measurements: prev.measurements?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cart_id) newErrors.cart_id = 'Выберите пациента';
    if (!formData.device_type_r_id) newErrors.device_type_r_id = 'Выберите тип изделия';
    if (!formData.diagnosis_type_id) newErrors.diagnosis_type_id = 'Выберите тип диагноза';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Количество должно быть больше 0';
    if (!formData.diagnosis_side) newErrors.diagnosis_side = 'Выберите сторону диагноза';

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
      const orderData = {
        ...formData,
        create_date: formData.create_date || new Date().toISOString().split('T')[0],
        order_status: formData.order_status || 1,
        order_payment_type: formData.order_payment_type || 'Бесплатно',
        is_urgent: formData.is_urgent || false,
        cost: formData.cost || 0,
        diagnosis_side: formData.diagnosis_side || 'right',
        hospitalized: formData.hospitalized || false,
        order_type: formData.order_type || 'prosthesis',
        quantity: formData.quantity || 1,
        diagnosis_type_id: formData.diagnosis_type_id || 1,
        device_type_r_id: formData.device_type_r_id || 1,
        device_type_l_id: formData.device_type_l_id || undefined,
        priority_level: formData.priority_level || 'normal',
        urgent_reason: formData.urgent_reason || undefined,
        medical_examination: formData.medical_examination || undefined,
        note: formData.note || '',
        measurements: formData.measurements || [],
        cart: formData.cart || carts[0],
        device_type: formData.device_type || deviceTypes[0],
        diagnosis_type: formData.diagnosis_type || diagnosisTypes[0],
        status: formData.status || 1,
        created_at: formData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        materials: formData.materials || [],
        works: formData.works || [],
        employees: formData.employees || []
      } as Order;

      await onSave(orderData);
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCart = carts.find(cart => cart.id === formData.cart_id);

  if (loading && !order) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Загрузка данных...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {order ? 'Редактировать заказ' : 'Новый заказ'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Вкладки */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className={`${
                    activeTab === 'general'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  Общие данные
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('measurements')}
                  className={`${
                    activeTab === 'measurements'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Измерения
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('process')}
                  className={`${
                    activeTab === 'process'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Процесс
                </button>
              </nav>
            </div>

            {/* Общие данные */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  {/* Пациент */}
                  <div className="sm:col-span-2">
                    <label htmlFor="cart_id" className="block text-sm font-medium text-gray-700">
                      Пациент <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="cart_id"
                      id="cart_id"
                      value={formData.cart_id || ''}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.cart_id ? 'border-red-500' : ''}`}
                      required
                    >
                      <option value="">Выберите пациента</option>
                      {carts.map(cart => (
                        <option key={cart.id} value={cart.id}>
                          {cart.name} {cart.first_name} {cart.parent_name} (№{cart.card_number})
                        </option>
                      ))}
                    </select>
                    {errors.cart_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.cart_id}</p>
                    )}
                  </div>

                  {/* Информация о выбранном пациенте */}
                  {selectedCart && (
                    <div className="sm:col-span-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              {selectedCart.name} {selectedCart.first_name} {selectedCart.parent_name}
                            </p>
                            <p className="text-sm text-blue-700">
                              ИНН: {selectedCart.inn} | Телефон: {selectedCart.phone_number}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Тип заказа */}
                  <div>
                    <label htmlFor="order_type" className="block text-sm font-medium text-gray-700">
                      Тип заказа
                    </label>
                    <select
                      name="order_type"
                      id="order_type"
                      value={formData.order_type || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    >
                      <option value="">Выберите тип</option>
                      <option value="prosthesis">Протез</option>
                      <option value="shoes">Обувь</option>
                      <option value="orthopedic">Ортопедическое</option>
                      <option value="repair">Ремонт</option>
                    </select>
                  </div>

                  {/* Количество */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Количество <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      min="1"
                      value={formData.quantity || ''}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.quantity ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>

                  {/* Тип изделия (правая сторона) */}
                  <div>
                    <label htmlFor="device_type_r_id" className="block text-sm font-medium text-gray-700">
                      Тип изделия (правая) <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="device_type_r_id"
                      id="device_type_r_id"
                      value={formData.device_type_r_id || ''}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.device_type_r_id ? 'border-red-500' : ''}`}
                      required
                    >
                      <option value="">Выберите тип изделия</option>
                      {deviceTypes.map(device => (
                        <option key={device.id} value={device.id}>{device.name}</option>
                      ))}
                    </select>
                    {errors.device_type_r_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.device_type_r_id}</p>
                    )}
                  </div>

                  {/* Тип изделия (левая сторона) */}
                  <div>
                    <label htmlFor="device_type_l_id" className="block text-sm font-medium text-gray-700">
                      Тип изделия (левая)
                    </label>
                    <select
                      name="device_type_l_id"
                      id="device_type_l_id"
                      value={formData.device_type_l_id || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    >
                      <option value="">Выберите тип изделия</option>
                      {deviceTypes.map(device => (
                        <option key={device.id} value={device.id}>{device.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Тип диагноза */}
                  <div>
                    <label htmlFor="diagnosis_type_id" className="block text-sm font-medium text-gray-700">
                      Тип диагноза <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="diagnosis_type_id"
                      id="diagnosis_type_id"
                      value={formData.diagnosis_type_id || ''}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.diagnosis_type_id ? 'border-red-500' : ''}`}
                      required
                    >
                      <option value="">Выберите тип диагноза</option>
                      {diagnosisTypes.map(diagnosis => (
                        <option key={diagnosis.id} value={diagnosis.id}>{diagnosis.name}</option>
                      ))}
                    </select>
                    {errors.diagnosis_type_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.diagnosis_type_id}</p>
                    )}
                  </div>

                  {/* Сторона диагноза */}
                  <div>
                    <label htmlFor="diagnosis_side" className="block text-sm font-medium text-gray-700">
                      Сторона диагноза <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="diagnosis_side"
                      id="diagnosis_side"
                      value={formData.diagnosis_side || ''}
                      onChange={handleChange}
                      className={`mt-1 block w-full input ${errors.diagnosis_side ? 'border-red-500' : ''}`}
                      required
                    >
                      <option value="">Выберите сторону</option>
                      <option value="right">Правая</option>
                      <option value="left">Левая</option>
                      <option value="both">Обе</option>
                    </select>
                    {errors.diagnosis_side && (
                      <p className="mt-1 text-sm text-red-600">{errors.diagnosis_side}</p>
                    )}
                  </div>

                  {/* Госпитализация */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hospitalized"
                      id="hospitalized"
                      checked={formData.hospitalized || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hospitalized" className="ml-2 block text-sm text-gray-900">
                      Госпитализация
                    </label>
                  </div>

                  {/* Срочность */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_urgent"
                      id="is_urgent"
                      checked={formData.is_urgent || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_urgent" className="ml-2 block text-sm text-gray-900">
                      Срочный заказ
                    </label>
                  </div>

                  {/* Причина срочности */}
                  {formData.is_urgent && (
                    <div className="sm:col-span-2">
                      <label htmlFor="urgent_reason" className="block text-sm font-medium text-gray-700">
                        Причина срочности
                      </label>
                      <textarea
                        name="urgent_reason"
                        id="urgent_reason"
                        rows={3}
                        value={formData.urgent_reason || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full input"
                        placeholder="Укажите причину срочности заказа"
                      />
                    </div>
                  )}

                  {/* Стоимость */}
                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                      Стоимость (сом)
                    </label>
                    <input
                      type="number"
                      name="cost"
                      id="cost"
                      min="0"
                      step="0.01"
                      value={formData.cost || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>

                  {/* Тип оплаты */}
                  <div>
                    <label htmlFor="order_payment_type" className="block text-sm font-medium text-gray-700">
                      Тип оплаты
                    </label>
                    <select
                      name="order_payment_type"
                      id="order_payment_type"
                      value={formData.order_payment_type || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    >
                      <option value="budget">Бюджет</option>
                      <option value="paid">Платная</option>
                      <option value="insurance">Страховая</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Измерения */}
            {activeTab === 'measurements' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Измерения</h3>
                  <button
                    type="button"
                    onClick={addMeasurement}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Добавить измерение
                  </button>
                </div>

                {formData.measurements?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Измерения не добавлены</p>
                    <p className="text-sm">Нажмите "Добавить измерение" для начала работы</p>
                  </div>
                )}

                {formData.measurements?.map((measurement, index) => (
                  <div key={measurement.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Измерение #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeMeasurement(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-4 sm:gap-x-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Тип измерения</label>
                        <input
                          type="text"
                          value={measurement.type}
                          onChange={(e) => handleMeasurementChange(index, 'type', e.target.value)}
                          className="mt-1 block w-full input"
                          placeholder="Например: Длина культи"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Значение</label>
                        <input
                          type="number"
                          value={measurement.measurement}
                          onChange={(e) => handleMeasurementChange(index, 'measurement', parseFloat(e.target.value) || 0)}
                          className="mt-1 block w-full input"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Единица</label>
                        <select
                          value={measurement.unit}
                          onChange={(e) => handleMeasurementChange(index, 'unit', e.target.value)}
                          className="mt-1 block w-full input"
                        >
                          <option value="см">см</option>
                          <option value="мм">мм</option>
                          <option value="м">м</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Сторона</label>
                        <select
                          value={measurement.side}
                          onChange={(e) => handleMeasurementChange(index, 'side', e.target.value)}
                          className="mt-1 block w-full input"
                        >
                          <option value="right">Правая</option>
                          <option value="left">Левая</option>
                          <option value="both">Обе</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Процесс */}
            {activeTab === 'process' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  {/* Даты вызовов */}
                  <div>
                    <label htmlFor="call_date1" className="block text-sm font-medium text-gray-700">
                      Дата вызова 1
                    </label>
                    <input
                      type="date"
                      name="call_date1"
                      id="call_date1"
                      value={formData.call_date1 || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>
                  <div>
                    <label htmlFor="call_date2" className="block text-sm font-medium text-gray-700">
                      Дата вызова 2
                    </label>
                    <input
                      type="date"
                      name="call_date2"
                      id="call_date2"
                      value={formData.call_date2 || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>
                  <div>
                    <label htmlFor="call_date3" className="block text-sm font-medium text-gray-700">
                      Дата вызова 3
                    </label>
                    <input
                      type="date"
                      name="call_date3"
                      id="call_date3"
                      value={formData.call_date3 || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>

                  {/* Даты прихода */}
                  <div>
                    <label htmlFor="come_date1" className="block text-sm font-medium text-gray-700">
                      Дата прихода 1
                    </label>
                    <input
                      type="date"
                      name="come_date1"
                      id="come_date1"
                      value={formData.come_date1 || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>
                  <div>
                    <label htmlFor="come_date2" className="block text-sm font-medium text-gray-700">
                      Дата прихода 2
                    </label>
                    <input
                      type="date"
                      name="come_date2"
                      id="come_date2"
                      value={formData.come_date2 || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>
                  <div>
                    <label htmlFor="come_date3" className="block text-sm font-medium text-gray-700">
                      Дата прихода 3
                    </label>
                    <input
                      type="date"
                      name="come_date3"
                      id="come_date3"
                      value={formData.come_date3 || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>

                  {/* Ключевые даты */}
                  <div>
                    <label htmlFor="accept_date" className="block text-sm font-medium text-gray-700">
                      Дата принятия
                    </label>
                    <input
                      type="date"
                      name="accept_date"
                      id="accept_date"
                      value={formData.accept_date || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>
                  <div>
                    <label htmlFor="ready_date" className="block text-sm font-medium text-gray-700">
                      Дата готовности
                    </label>
                    <input
                      type="date"
                      name="ready_date"
                      id="ready_date"
                      value={formData.ready_date || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>
                  <div>
                    <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700">
                      Дата выдачи
                    </label>
                    <input
                      type="date"
                      name="issue_date"
                      id="issue_date"
                      value={formData.issue_date || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>
                  <div>
                    <label htmlFor="direct_to_approve_date" className="block text-sm font-medium text-gray-700">
                      Дата направления на утверждение
                    </label>
                    <input
                      type="date"
                      name="direct_to_approve_date"
                      id="direct_to_approve_date"
                      value={formData.direct_to_approve_date || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full input"
                    />
                  </div>

                  {/* Характеристики обуви */}
                  {formData.order_type === 'shoes' && (
                    <>
                      <div>
                        <label htmlFor="shoe_model_id" className="block text-sm font-medium text-gray-700">
                          Модель обуви
                        </label>
                        <select
                          name="shoe_model_id"
                          id="shoe_model_id"
                          value={formData.shoe_model_id || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full input"
                        >
                          <option value="">Выберите модель</option>
                          {shoeModels.map(model => (
                            <option key={model.id} value={model.id}>{model.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="shoe_color_id" className="block text-sm font-medium text-gray-700">
                          Цвет обуви
                        </label>
                        <select
                          name="shoe_color_id"
                          id="shoe_color_id"
                          value={formData.shoe_color_id || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full input"
                        >
                          <option value="">Выберите цвет</option>
                          {shoeColors.map(color => (
                            <option key={color.id} value={color.id}>{color.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="heel_material_id" className="block text-sm font-medium text-gray-700">
                          Материал каблука
                        </label>
                        <select
                          name="heel_material_id"
                          id="heel_material_id"
                          value={formData.heel_material_id || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full input"
                        >
                          <option value="">Выберите материал</option>
                          {heelMaterials.map(material => (
                            <option key={material.id} value={material.id}>{material.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="size_of_shortening" className="block text-sm font-medium text-gray-700">
                          Размер укорочения (см)
                        </label>
                        <input
                          type="number"
                          name="size_of_shortening"
                          id="size_of_shortening"
                          min="0"
                          step="0.1"
                          value={formData.size_of_shortening || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full input"
                        />
                      </div>
                      <div>
                        <label htmlFor="shoe_order_type" className="block text-sm font-medium text-gray-700">
                          Тип заказа обуви
                        </label>
                        <select
                          name="shoe_order_type"
                          id="shoe_order_type"
                          value={formData.shoe_order_type || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full input"
                        >
                          <option value="">Выберите тип</option>
                          <option value="standard">Стандартная</option>
                          <option value="custom">Индивидуальная</option>
                          <option value="repair">Ремонт</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Материалы заказа */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Материалы заказа</h4>
                  <div className="space-y-4">
                    {(formData.order_materials || []).map((orderMaterial: OrderMaterial, index: number) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <select
                            value={orderMaterial.material?.id || ''}
                            onChange={(e) => {
                              const materialId = parseInt(e.target.value);
                              const material = materials.find(m => m.id === materialId);
                              if (material) {
                                const updatedMaterials = [...(formData.order_materials || [])];
                                updatedMaterials[index] = {
                                  ...updatedMaterials[index],
                                  material: material
                                };
                                setFormData(prev => ({ ...prev, order_materials: updatedMaterials }));
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Выберите материал</option>
                            {materials.map(material => (
                              <option key={material.id} value={material.id}>
                                {material.name} ({material.code || material.inventory_number}) - {material.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Кол-во"
                            value={orderMaterial.quantity || ''}
                            onChange={(e) => {
                              const updatedMaterials = [...(formData.order_materials || [])];
                              updatedMaterials[index] = {
                                ...updatedMaterials[index],
                                quantity: parseFloat(e.target.value) || 0
                              };
                              setFormData(prev => ({ ...prev, order_materials: updatedMaterials }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedMaterials = (formData.order_materials || []).filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, order_materials: updatedMaterials }));
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newMaterial: OrderMaterial = {
                          id: Date.now(),
                          order_id: formData.id || 0,
                          material: materials[0] || {} as Material,
                          quantity: 1,
                          article_number: '',
                          consumption_norm: 0,
                          price: 0,
                          total_cost: 0
                        };
                        setFormData(prev => ({
                          ...prev,
                          order_materials: [...(prev.order_materials || []), newMaterial]
                        }));
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                    >
                      <Package className="h-4 w-4" />
                      <span>Добавить материал</span>
                    </button>
                  </div>
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
              {loading ? 'Сохранение...' : (order ? 'Сохранить изменения' : 'Создать заказ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
