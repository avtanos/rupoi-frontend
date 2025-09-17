'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';
import RoleGuard from '@/components/RoleGuard';
import { Cart } from '@/types';
import { apiClient } from '@/lib/api';
import { Archive, Search, Filter, RotateCcw, Eye, Trash2, Download } from 'lucide-react';

export default function ArchiveListPage() {
  const [archivedCarts, setArchivedCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCarts, setSelectedCarts] = useState<number[]>([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadArchivedCarts();
  }, [searchTerm, statusFilter]);

  const loadArchivedCarts = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        status: 'archived'
      };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status_filter = statusFilter;
      
      const response = await apiClient.getCarts(params);
      setArchivedCarts(response.results);
    } catch (error) {
      console.error('Failed to load archived carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreCart = async (cartId: number) => {
    if (window.confirm('Вы уверены, что хотите восстановить эту карточку из архива?')) {
      try {
        await apiClient.updateCart(cartId, { status: 'active' });
        setArchivedCarts(prev => prev.filter(cart => cart.id !== cartId));
      } catch (error) {
        console.error('Failed to restore cart:', error);
      }
    }
  };

  const handlePermanentDelete = async (cartId: number) => {
    if (window.confirm('Вы уверены, что хотите навсегда удалить эту карточку? Это действие нельзя отменить.')) {
      try {
        await apiClient.deleteCart(cartId);
        setArchivedCarts(prev => prev.filter(cart => cart.id !== cartId));
      } catch (error) {
        console.error('Failed to delete cart:', error);
      }
    }
  };

  const handleSelectCart = (cartId: number) => {
    setSelectedCarts(prev => 
      prev.includes(cartId) 
        ? prev.filter(id => id !== cartId)
        : [...prev, cartId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCarts.length === filteredCarts.length) {
      setSelectedCarts([]);
    } else {
      setSelectedCarts(filteredCarts.map(cart => cart.id));
    }
  };

  const handleBulkRestore = async () => {
    if (selectedCarts.length === 0) return;
    
    if (window.confirm(`Вы уверены, что хотите восстановить ${selectedCarts.length} карточек из архива?`)) {
      try {
        await Promise.all(
          selectedCarts.map(cartId => 
            apiClient.updateCart(cartId, { status: 'active' })
          )
        );
        setArchivedCarts(prev => prev.filter(cart => !selectedCarts.includes(cart.id)));
        setSelectedCarts([]);
      } catch (error) {
        console.error('Failed to restore carts:', error);
      }
    }
  };

  const filteredCarts = archivedCarts.filter(cart => {
    const matchesSearch = !searchTerm || 
      cart.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.card_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cart.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'archived':
        return 'badge badge-warning';
      case 'inactive':
        return 'badge badge-error';
      default:
        return 'badge badge-info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'archived':
        return 'В архиве';
      case 'inactive':
        return 'Неактивен';
      default:
        return 'Активен';
    }
  };

  return (
    <RoleGuard allowedRoles={['ADMIN', 'REGISTRAR']}>
      <Layout>
        <div className="space-y-6">
          {/* Заголовок */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Архив пациентов</h1>
              <p className="text-gray-600">Управление архивными карточками пациентов</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Фильтры
              </button>
              <button className="btn btn-outline flex items-center gap-2">
                <Download className="h-4 w-4" />
                Экспорт
              </button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                  <Archive className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Всего в архиве</p>
                  <p className="text-2xl font-semibold text-gray-900">{archivedCarts.length}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Неактивные</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {archivedCarts.filter(cart => cart.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Восстановлено за месяц</p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Фильтры */}
          {showFilters && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Фильтры</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Поиск
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Поиск по ФИО, номеру карты..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Статус
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все статусы</option>
                    <option value="archived">В архиве</option>
                    <option value="inactive">Неактивные</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Массовые действия */}
          {selectedCarts.length > 0 && (
            <div className="card p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  Выбрано карточек: {selectedCarts.length}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkRestore}
                    className="btn btn-sm btn-primary flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Восстановить выбранные
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Таблица архивных карточек */}
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
                      <input
                        type="checkbox"
                        checked={selectedCarts.length === filteredCarts.length && filteredCarts.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Номер карты
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      ФИО
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Дата рождения
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Статус
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Дата архивации
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Действия
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                </ResponsiveTableHeader>
                <ResponsiveTableBody>
                  {loading ? (
                    <ResponsiveTableRow>
                      <ResponsiveTableCell colSpan={7} className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ) : filteredCarts.length === 0 ? (
                    <ResponsiveTableRow>
                      <ResponsiveTableCell colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        {archivedCarts.length === 0 ? 'Архив пуст' : 'Нет карточек, соответствующих фильтрам'}
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ) : (
                    filteredCarts.map((cart) => (
                      <ResponsiveTableRow key={cart.id} className={`hover:bg-gray-50 ${selectedCarts.includes(cart.id) ? 'bg-blue-50' : ''}`}>
                        <ResponsiveTableCell >
                          <input
                            type="checkbox"
                            checked={selectedCarts.includes(cart.id)}
                            onChange={() => handleSelectCart(cart.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="font-medium text-gray-900">
                          {cart.card_number}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell >
                          {cart.first_name} {cart.name} {cart.parent_name}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="text-gray-500">
                          {cart.birth_date ? new Date(cart.birth_date).toLocaleDateString('ru-RU') : 'Не указано'}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell >
                          <span className={getStatusBadge(cart.status)}>
                            {getStatusText(cart.status)}
                          </span>
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="text-gray-500">
                          {cart.deregistration_date ? new Date(cart.deregistration_date).toLocaleDateString('ru-RU') : 'Не указано'}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell >
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRestoreCart(cart.id)}
                              className="text-green-600 hover:text-green-800"
                              title="Восстановить"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => window.open(`/carts/${cart.id}`, '_blank')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Просмотр"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(cart.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Удалить навсегда"
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
      </Layout>
    </RoleGuard>
  );
}
