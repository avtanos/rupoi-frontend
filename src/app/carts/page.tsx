'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import CartForm from '@/components/CartForm';
import { Cart } from '@/types';
import { apiClient } from '@/lib/api';
import { Search, Plus, Eye, Edit, Archive, X } from 'lucide-react';

export default function CartsPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCart, setEditingCart] = useState<Cart | null>(null);

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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    № карточки
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ФИО
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата рождения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ПИН
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Группа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Телефон
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : carts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Пациенты не найдены
                    </td>
                  </tr>
                ) : (
                  carts.map((cart) => (
                    <tr key={cart.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cart.card_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cart.name} {cart.first_name} {cart.parent_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cart.birth_date ? new Date(cart.birth_date).toLocaleDateString('ru-RU') : 'Не указано'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cart.inn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cart.lovz_group} группа
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cart.phone_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(cart.status)}>
                          {getStatusText(cart.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                            className="text-gray-600 hover:text-gray-900"
                            title="Архивировать"
                          >
                            <Archive className="h-4 w-4" />
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
      </div>
    </Layout>
  );
}
