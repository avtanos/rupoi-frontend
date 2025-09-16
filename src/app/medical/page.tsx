'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import MedicalExaminationForm from '@/components/MedicalExaminationForm';
import OrderDetailModal from '@/components/OrderDetailModal';
import { Order } from '@/types';
import { apiClient } from '@/lib/api';
import { Stethoscope, CheckCircle, XCircle, Clock, Eye, Search, Filter, AlertTriangle, FileText, Calendar } from 'lucide-react';

export default function MedicalPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadMedicalOrders();
  }, [searchTerm, statusFilter, priorityFilter, dateFilter]);

  const loadMedicalOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (dateFilter) params.date = dateFilter;
      
      const response = await apiClient.getMedicalOrders();
      setOrders(response.results);
    } catch (error) {
      console.error('Failed to load medical orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamine = (order: Order) => {
    setSelectedOrder(order);
    setShowForm(true);
  };

  const handleSaveExamination = async (examinationData: any) => {
    try {
      if (examinationData.is_approved) {
        await apiClient.approveOrder(selectedOrder!.id, examinationData);
      } else {
        await apiClient.rejectOrder(selectedOrder!.id, examinationData);
      }
      setShowForm(false);
      setSelectedOrder(null);
      loadMedicalOrders();
    } catch (error) {
      console.error('Failed to save examination:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedOrder(null);
  };

  const handleViewDetails = (order: Order) => {
    setDetailOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailOrder(null);
  };

  const handleApprove = async (orderId: number) => {
    try {
      await apiClient.approveOrder(orderId);
      loadMedicalOrders();
    } catch (error) {
      console.error('Failed to approve order:', error);
    }
  };

  const handleReject = async (orderId: number) => {
    const reason = prompt('Укажите причину отклонения:');
    if (reason) {
      try {
        await apiClient.rejectOrder(orderId, { rejection_reason: reason });
        loadMedicalOrders();
      } catch (error) {
        console.error('Failed to reject order:', error);
      }
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedOrders.length === 0) return;
    
    try {
      const promises = selectedOrders.map(orderId => apiClient.approveOrder(orderId));
      await Promise.all(promises);
      setSelectedOrders([]);
      loadMedicalOrders();
    } catch (error) {
      console.error('Failed to bulk approve orders:', error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      normal: 'bg-gray-100 text-gray-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return badges[priority as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority: string) => {
    const texts = {
      normal: 'Обычный',
      high: 'Высокий',
      urgent: 'Срочный'
    };
    return texts[priority as keyof typeof texts] || 'Обычный';
  };

  const getStatusBadge = (status: number) => {
    const badges = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: number) => {
    const texts = {
      1: 'На утверждении',
      2: 'В работе',
      3: 'Утвержден',
      4: 'Отклонен'
    };
    return texts[status as keyof typeof texts] || 'Неизвестно';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Медицинский отдел</h1>
            <p className="mt-1 text-sm text-gray-500">
              Направление пациентов на протезирование и утверждение заказов
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </button>
            {selectedOrders.length > 0 && (
              <button
                onClick={handleBulkApprove}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Утвердить выбранные ({selectedOrders.length})
              </button>
            )}
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">На утверждении</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 1).length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Утверждено</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 3).length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Отклонено</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 4).length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Срочные</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.is_urgent).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        {showFilters && (
          <div className="card p-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по ФИО, номеру..."
                    className="input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Все статусы</option>
                  <option value="1">На утверждении</option>
                  <option value="2">В работе</option>
                  <option value="3">Утвержден</option>
                  <option value="4">Отклонен</option>
                </select>
              </div>
              <div>
                <select
                  className="input"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">Все приоритеты</option>
                  <option value="normal">Обычный</option>
                  <option value="high">Высокий</option>
                  <option value="urgent">Срочный</option>
                </select>
              </div>
              <div>
                <input
                  type="date"
                  className="input"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Список заказов на утверждении */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Заказы на утверждении</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    № заказа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пациент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип изделия
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Диагноз
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Приоритет
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      Нет заказов на утверждении
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className={`hover:bg-gray-50 ${selectedOrders.includes(order.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {order.number}
                          {order.is_urgent && (
                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{order.cart?.first_name || ''} {order.cart?.name || ''}</div>
                          <div className="text-gray-500 text-xs">№{order.cart?.card_number || 'Не указан'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.device_type?.name || 'Не указан'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.diagnosis_type?.name || 'Не указан'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(order.priority_level || 'normal')}`}>
                          {getPriorityText(order.priority_level || 'normal')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleViewDetails(order)}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                            title="Просмотр деталей"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleExamine(order)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                            title="Медицинский осмотр"
                          >
                            <Stethoscope className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleApprove(order.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                            title="Утвердить"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(order.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                            title="Отклонить"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Форма медицинского осмотра */}
      {showForm && selectedOrder && (
        <MedicalExaminationForm
          order={selectedOrder}
          onSave={handleSaveExamination}
          onCancel={handleCancelForm}
        />
      )}

      {/* Модальное окно деталей заказа */}
      {showDetailModal && detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={handleCloseDetailModal}
        />
      )}
    </Layout>
  );
}
