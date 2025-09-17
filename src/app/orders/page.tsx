'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import OrderForm from '@/components/OrderForm';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';
import { Order } from '@/types';
import { apiClient } from '@/lib/api';
import { Search, Plus, Eye, Edit, Package, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import ReadyPOIForm from '@/components/ReadyPOIForm';
import OrderStatusManager from '@/components/OrderStatusManager';
import { useAuth } from '@/lib/auth-context';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showReadyPOIForm, setShowReadyPOIForm] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadOrders();
  }, [searchTerm, typeFilter, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (typeFilter) params.order_type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      
      const response = await apiClient.getOrders(params);
      setOrders(response.results);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleSaveOrder = async (orderData: Order) => {
    try {
      if (editingOrder) {
        // Обновление существующего заказа
        const updatedOrder = await apiClient.updateOrder(editingOrder.id, orderData);
        setOrders(prev => prev.map(order => order.id === editingOrder.id ? updatedOrder : order));
      } else {
        // Создание нового заказа
        const newOrder = await apiClient.createOrder(orderData);
        setOrders(prev => [newOrder, ...prev]);
      }
      setShowForm(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        await apiClient.deleteOrder(orderId);
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: any, comment?: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const updatedOrder = await apiClient.updateOrderStatus(orderId, newStatus.id, {
        comment,
        changed_by: user?.id
      });
      setOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order));
    } catch (error) {
      console.error('Failed to update order status:', error);
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

  const handleBulkStatusChange = async (newStatus: number) => {
    if (selectedOrders.length === 0) return;
    
    try {
      const promises = selectedOrders.map(orderId => {
        const order = orders.find(o => o.id === orderId);
        return order ? apiClient.updateOrder(orderId, { ...order, status: newStatus }) : Promise.resolve();
      });
      
      await Promise.all(promises);
      setOrders(prev => prev.map(order => 
        selectedOrders.includes(order.id) 
          ? { ...order, status: newStatus }
          : order
      ));
      setSelectedOrders([]);
    } catch (error) {
      console.error('Failed to update statuses:', error);
    }
  };

  const getStatusBadge = (status: number) => {
    const badges = {
      1: 'badge badge-info',
      2: 'badge badge-warning',
      3: 'badge badge-success',
      4: 'badge badge-success',
      5: 'badge badge-success',
      6: 'badge badge-info'
    };
    return badges[status as keyof typeof badges] || 'badge badge-info';
  };

  const getStatusText = (status: number) => {
    const texts = {
      1: 'Новый',
      2: 'В работе',
      3: 'Готов',
      4: 'На складе',
      5: 'Выдан',
      6: 'Выдан'
    };
    return texts[status as keyof typeof texts] || 'Неизвестно';
  };

  const getTypeText = (type: string) => {
    const texts = {
      prosthesis: 'Протез',
      shoes: 'Обувь',
      orthopedic: 'Ортопедическое',
      repair: 'Ремонт'
    };
    return texts[type as keyof typeof texts] || type;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление заказами</h1>
            <p className="mt-1 text-sm text-gray-500">
              Создание и управление заказами на протезно-ортопедические изделия
            </p>
          </div>
          <button 
            onClick={handleCreateOrder}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Новый заказ
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Всего заказов</p>
                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <div className="h-6 w-6 text-yellow-600">⚙️</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">В работе</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 2).length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <div className="h-6 w-6 text-green-600">✅</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Готово</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status >= 3).length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                <div className="h-6 w-6 text-red-600">⚠️</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Просрочено</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <select
                className="input"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Все типы</option>
                <option value="prosthesis">Протезы</option>
                <option value="shoes">Обувь</option>
                <option value="orthopedic">Ортопедические</option>
                <option value="repair">Ремонт</option>
                <option value="ready_poi">Готовые ПОИ</option>
              </select>
            </div>
            <div>
              <select
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Все статусы</option>
                <option value="1">Новый</option>
                <option value="2">В работе</option>
                <option value="3">Готов</option>
                <option value="4">На складе</option>
                <option value="5">Выдан</option>
              </select>
            </div>
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по номеру, ФИО..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Массовые действия */}
        {selectedOrders.length > 0 && (
          <div className="card p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-900">
                  Выбрано заказов: {selectedOrders.length}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkStatusChange(2)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 flex items-center"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  В работу
                </button>
                <button
                  onClick={() => handleBulkStatusChange(3)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Готово
                </button>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Таблица заказов */}
        <div className="card p-6">
          {isMobile ? (
            // Мобильное отображение в виде карточек
            <MobileCardView
              data={orders}
              columns={[
                {
                  key: 'number',
                  label: '№ заказа',
                  render: (value: string) => (
                    <span className="font-medium text-gray-900">{value}</span>
                  )
                },
                {
                  key: 'patient',
                  label: 'Пациент',
                  render: (value: any, item: Order) => (
                    <div>
                      <div className="font-medium">{item.cart?.first_name || ''} {item.cart?.name || ''}</div>
                      <div className="text-gray-500 text-xs">№{item.cart?.card_number || 'Не указан'}</div>
                    </div>
                  )
                },
                {
                  key: 'order_type',
                  label: 'Тип',
                  render: (value: string) => getTypeText(value)
                },
                {
                  key: 'device_type',
                  label: 'Изделие',
                  render: (value: any, item: Order) => item.device_type?.name || 'Не указан'
                },
                {
                  key: 'status',
                  label: 'Статус',
                  render: (value: number, item: Order) => (
                    <div className="flex items-center space-x-2">
                      <span className={getStatusBadge(item.status)}>
                        {getStatusText(item.status)}
                      </span>
                      {item.is_urgent && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )
                },
                {
                  key: 'created_at',
                  label: 'Дата создания',
                  render: (value: string) => value ? new Date(value).toLocaleDateString('ru-RU') : 'Не указано'
                },
                {
                  key: 'actions',
                  label: 'Действия',
                  render: (value: any, item: Order) => (
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEditOrder(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                        title="Редактировать"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {item.order_type === 'ready_poi' && (
                        <button 
                          onClick={() => setShowReadyPOIForm(item.id)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-100"
                          title="Готовые ПОИ"
                        >
                          <Package className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleStatusChange(item.id, item.status === 1 ? 2 : item.status + 1)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                        title="Изменить статус"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(item.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
            />
          ) : (
            // Десктопное отображение в виде таблицы
            <ResponsiveTable>
              <ResponsiveTableHeader>
                <ResponsiveTableRow>
                  <ResponsiveTableCell isHeader>
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader>№ заказа</ResponsiveTableCell>
                  <ResponsiveTableCell isHeader>Пациент</ResponsiveTableCell>
                  <ResponsiveTableCell isHeader>Тип</ResponsiveTableCell>
                  <ResponsiveTableCell isHeader>Изделие</ResponsiveTableCell>
                  <ResponsiveTableCell isHeader>Статус</ResponsiveTableCell>
                  <ResponsiveTableCell isHeader>Дата создания</ResponsiveTableCell>
                  <ResponsiveTableCell isHeader>Действия</ResponsiveTableCell>
                </ResponsiveTableRow>
              </ResponsiveTableHeader>
              <ResponsiveTableBody>
                {loading ? (
                  <ResponsiveTableRow>
                    <ResponsiveTableCell colSpan={8} className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                ) : orders.length === 0 ? (
                  <ResponsiveTableRow>
                    <ResponsiveTableCell colSpan={8} className="text-center text-gray-500">
                      Заказы не найдены
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                ) : (
                  orders.map((order) => (
                    <ResponsiveTableRow 
                      key={order.id} 
                      className={`hover:bg-gray-50 ${selectedOrders.includes(order.id) ? 'bg-blue-50' : ''}`}
                    >
                      <ResponsiveTableCell>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="font-medium text-gray-900">
                        {order.number}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <div>
                          <div className="font-medium">{order.cart?.first_name || ''} {order.cart?.name || ''}</div>
                          <div className="text-gray-500 text-xs">№{order.cart?.card_number || 'Не указан'}</div>
                        </div>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {getTypeText(order.order_type)}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {order.device_type?.name || 'Не указан'}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <div className="flex items-center space-x-2">
                          <span className={getStatusBadge(order.status)}>
                            {getStatusText(order.status)}
                          </span>
                          {order.is_urgent && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleEditOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                            title="Редактировать"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {order.order_type === 'ready_poi' && (
                            <button 
                              onClick={() => setShowReadyPOIForm(order.id)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-100"
                              title="Готовые ПОИ"
                            >
                              <Package className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleStatusChange(order.id, order.status === 1 ? 2 : order.status + 1)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                            title="Изменить статус"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                            title="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ))
                )}
              </ResponsiveTableBody>
            </ResponsiveTable>
          )}
        </div>
      </div>

      {/* Форма заказа */}
      {showForm && (
        <OrderForm
          order={editingOrder || undefined}
          onSave={handleSaveOrder}
          onCancel={handleCancelForm}
        />
      )}

      {/* Модальное окно готовых ПОИ */}
      {showReadyPOIForm && (
        <ReadyPOIForm
          orderId={showReadyPOIForm}
          onSave={() => setShowReadyPOIForm(null)}
          onCancel={() => setShowReadyPOIForm(null)}
        />
      )}
    </Layout>
  );
}
