'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';
import CartForm from '@/components/CartForm';
import ServiceDirectionsBlock from '@/components/ServiceDirectionsBlock';
import RehabilitationDirectionModal from '@/components/RehabilitationDirectionModal';
import { Cart, ServiceDirection, RehabilitationDirection } from '@/types';
import { apiClient } from '@/lib/api';
import { Search, Plus, Eye, Edit, Archive, X, FileText, Stethoscope } from 'lucide-react';

export default function CartsPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCart, setEditingCart] = useState<Cart | null>(null);
  const [showServiceDirections, setShowServiceDirections] = useState<number | null>(null);
  const [showRehabilitationDirection, setShowRehabilitationDirection] = useState<number | null>(null);
  const [serviceDirections, setServiceDirections] = useState<ServiceDirection[]>([]);
  const [rehabilitationDirections, setRehabilitationDirections] = useState<RehabilitationDirection[]>([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadCarts();
  }, [searchTerm, statusFilter]);

  const loadCarts = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const response = await apiClient.getCarts(params);
      setCarts(response.results);
    } catch (error) {
      console.error('Failed to load carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'badge badge-success',
      archived: 'badge badge-warning',
      not_registered: 'badge badge-danger'
    };
    return badges[status as keyof typeof badges] || 'badge badge-info';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Активен',
      archived: 'В архиве',
      not_registered: 'Несостоящий на учете'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const handleCreateCart = () => {
    setEditingCart(null);
    setShowForm(true);
  };

  const handleEditCart = (cart: Cart) => {
    setEditingCart(cart);
    setShowForm(true);
  };

  const handleSaveCart = async (cartData: Cart) => {
    try {
      if (editingCart) {
        await apiClient.updateCart(editingCart.id, cartData);
      } else {
        await apiClient.createCart(cartData);
      }
      setShowForm(false);
      setEditingCart(null);
      loadCarts();
    } catch (error) {
      console.error('Ошибка сохранения карточки:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCart(null);
  };

  const loadServiceDirections = async (cartId: number) => {
    try {
      const directions = await apiClient.getServiceDirections(cartId);
      setServiceDirections(directions);
    } catch (error) {
      console.error('Failed to load service directions:', error);
    }
  };

  const loadRehabilitationDirections = async (cartId: number) => {
    try {
      const directions = await apiClient.getRehabilitationDirections(cartId);
      setRehabilitationDirections(directions);
    } catch (error) {
      console.error('Failed to load rehabilitation directions:', error);
    }
  };

  const handleShowServiceDirections = (cartId: number) => {
    setShowServiceDirections(cartId);
    loadServiceDirections(cartId);
  };

  const handleShowRehabilitationDirection = (cartId: number) => {
    setShowRehabilitationDirection(cartId);
    loadRehabilitationDirections(cartId);
  };

  const handleRehabilitationDirectionSave = (direction: RehabilitationDirection) => {
    setRehabilitationDirections(prev => [...prev, direction]);
    setShowRehabilitationDirection(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Картотека пациентов</h1>
            <p className="mt-1 text-sm text-gray-500">
              Управление картотекой пациентов системы протезирования
            </p>
          </div>
          <button 
            onClick={handleCreateCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Новый пациент
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <div className="h-6 w-6 text-blue-600">👥</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Всего пациентов</p>
                <p className="text-2xl font-semibold text-gray-900">{carts.length}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <div className="h-6 w-6 text-green-600">✅</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Активных</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {carts.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <div className="h-6 w-6 text-yellow-600">📁</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">В архиве</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {carts.filter(c => c.status === 'archived').length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                <div className="h-6 w-6 text-red-600">❌</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Неактивных</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {carts.filter(c => c.status === 'inactive').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по ФИО, ПИН, номеру карточки..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Все статусы</option>
                <option value="active">Активные</option>
                <option value="archived">В архиве</option>
                <option value="not_registered">Несостоящие</option>
              </select>
            </div>
          </div>
        </div>

        {/* Таблица пациентов */}
        <div className="card p-6">
          {isMobile ? (
            // Мобильное отображение в виде карточек
            <MobileCardView
              data={data}
              columns={columns}
            />
          ) : (
            // Десктопное отображение в виде таблицы
            <ResponsiveTable>
              <ResponsiveTableHeader>
                <ResponsiveTableRow>
                  <ResponsiveTableCell isHeader >
                    № карточки
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    ФИО
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Дата рождения
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    ПИН
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Группа
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Телефон
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Статус
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Действия
                  </ResponsiveTableCell>
                </ResponsiveTableRow>
              </ResponsiveTableHeader>
              <ResponsiveTableBody>
                {loading ? (
                  <ResponsiveTableRow>
                    <ResponsiveTableCell colSpan={8} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                ) : carts.length === 0 ? (
                  <ResponsiveTableRow>
                    <ResponsiveTableCell colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Пациенты не найдены
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                ) : (
                  carts.map((cart) => (
                    <ResponsiveTableRow key={cart.id} className="hover:bg-gray-50">
                      <ResponsiveTableCell className="font-medium text-gray-900">
                        {cart.card_number}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell >
                        {cart.name} {cart.first_name} {cart.parent_name}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {cart.birth_date ? new Date(cart.birth_date).toLocaleDateString('ru-RU') : 'Не указано'}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {cart.inn}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {cart.lovz_group} группа
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {cart.phone_number}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell >
                        <span className={getStatusBadge(cart.status)}>
                          {getStatusText(cart.status)}
                        </span>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell >
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditCart(cart)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Просмотр"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditCart(cart)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Редактировать"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleShowServiceDirections(cart.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Направления на услуги"
                          >
                            <Stethoscope className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleShowRehabilitationDirection(cart.id)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Направление на реабилитацию"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-900"
                            title="Архивировать"
                          >
                            <Archive className="h-4 w-4" />
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

        {/* Модальное окно формы */}
        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCancelForm}></div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingCart ? 'Редактирование карточки пациента' : 'Создание карточки пациента'}
                    </h3>
                    <button
                      onClick={handleCancelForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <CartForm
                    cart={editingCart || undefined}
                    onSave={handleSaveCart}
                    onCancel={handleCancelForm}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно направлений на услуги */}
        {showServiceDirections && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Направления на услуги</h3>
                <button
                  onClick={() => setShowServiceDirections(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <ServiceDirectionsBlock
                  cartId={showServiceDirections}
                  directions={serviceDirections}
                  onUpdate={() => loadServiceDirections(showServiceDirections)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно направления на реабилитацию */}
        {showRehabilitationDirection && (
          <RehabilitationDirectionModal
            cartId={showRehabilitationDirection}
            onClose={() => setShowRehabilitationDirection(null)}
            onSave={handleRehabilitationDirectionSave}
          />
        )}
      </div>
    </Layout>
  );
}
