'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Layout from '@/components/Layout';
import OverheadForm from '@/components/OverheadForm';
import OverheadDetailModal from '@/components/OverheadDetailModal';
import { Overhead } from '@/types';
import { apiClient } from '@/lib/api';
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Search, Filter, Package } from 'lucide-react';

export default function OverheadsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [overheads, setOverheads] = useState<Overhead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingOverhead, setEditingOverhead] = useState<Overhead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailOverhead, setDetailOverhead] = useState<Overhead | null>(null);
  const [selectedOverheads, setSelectedOverheads] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadOverheads();
    }
  }, [isAuthenticated]);

  const loadOverheads = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOverheads();
      console.log('Загружены накладные:', response.results.length, 'записей');
      console.log('ID накладных:', response.results.map(o => o.id));
      setOverheads(response.results);
    } catch (error) {
      console.error('Ошибка загрузки накладных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOverhead = () => {
    setEditingOverhead(null);
    setShowForm(true);
  };

  const handleEditOverhead = (overhead: Overhead) => {
    setEditingOverhead(overhead);
    setShowForm(true);
  };

  const handleSaveOverhead = async (overheadData: Overhead) => {
    try {
      if (editingOverhead) {
        // Обновление существующей накладной
        const updatedOverhead = await apiClient.updateOverhead(editingOverhead.id, overheadData);
        setOverheads(prev => prev.map(overhead => overhead.id === editingOverhead.id ? updatedOverhead : overhead));
      } else {
        // Создание новой накладной
        const newOverhead = await apiClient.createOverhead(overheadData);
        setOverheads(prev => [newOverhead, ...prev]);
      }
      setShowForm(false);
      setEditingOverhead(null);
    } catch (error) {
      console.error('Failed to save overhead:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingOverhead(null);
  };

  const handleViewDetails = (overhead: Overhead) => {
    setDetailOverhead(overhead);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailOverhead(null);
  };

  const handleDeleteOverhead = async (overheadId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту накладную?')) {
      try {
        await apiClient.deleteOverhead(overheadId);
        setOverheads(prev => prev.filter(overhead => overhead.id !== overheadId));
      } catch (error) {
        console.error('Failed to delete overhead:', error);
      }
    }
  };

  const handleConfirmOverhead = async (overheadId: number) => {
    try {
      const updatedOverhead = await apiClient.updateOverhead(overheadId, { status: 'confirmed' });
      setOverheads(prev => prev.map(overhead => overhead.id === overheadId ? updatedOverhead : overhead));
    } catch (error) {
      console.error('Failed to confirm overhead:', error);
    }
  };

  const handleCancelOverhead = async (overheadId: number) => {
    try {
      const updatedOverhead = await apiClient.updateOverhead(overheadId, { status: 'cancelled' });
      setOverheads(prev => prev.map(overhead => overhead.id === overheadId ? updatedOverhead : overhead));
    } catch (error) {
      console.error('Failed to cancel overhead:', error);
    }
  };

  const handleSelectOverhead = (overheadId: number) => {
    setSelectedOverheads(prev => 
      prev.includes(overheadId) 
        ? prev.filter(id => id !== overheadId)
        : [...prev, overheadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOverheads.length === filteredOverheads.length) {
      setSelectedOverheads([]);
    } else {
      setSelectedOverheads(filteredOverheads.map(overhead => overhead.id));
    }
  };

  const handleBulkConfirm = async () => {
    if (selectedOverheads.length === 0) return;
    
    try {
      const promises = selectedOverheads.map(overheadId => 
        apiClient.updateOverhead(overheadId, { status: 'confirmed' })
      );
      await Promise.all(promises);
      setOverheads(prev => prev.map(overhead => 
        selectedOverheads.includes(overhead.id) 
          ? { ...overhead, status: 'confirmed' }
          : overhead
      ));
      setSelectedOverheads([]);
    } catch (error) {
      console.error('Failed to bulk confirm overheads:', error);
    }
  };

  // Дедупликация по id перед фильтрацией
  const uniqueOverheads = Array.from(
    new Map(overheads.map(overhead => [overhead.id, overhead])).values()
  );
  
  // Логирование для отладки
  if (overheads.length !== uniqueOverheads.length) {
    console.warn('Обнаружены дубликаты накладных:', {
      original: overheads.length,
      unique: uniqueOverheads.length,
      duplicates: overheads.length - uniqueOverheads.length
    });
  }

  const filteredOverheads = uniqueOverheads.filter(overhead => {
    const matchesSearch = overhead.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         overhead.shop_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overhead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждена';
      case 'draft': return 'Черновик';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Необходима авторизация</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Накладные</h1>
            <p className="mt-1 text-sm text-gray-500">
              Управление накладными на передачу изделий
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
            {selectedOverheads.length > 0 && (
              <button
                onClick={handleBulkConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Подтвердить выбранные ({selectedOverheads.length})
              </button>
            )}
            <button 
              onClick={handleCreateOverhead}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать накладную
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Всего накладных</p>
                <p className="text-2xl font-semibold text-gray-900">{overheads.length}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Черновики</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {overheads.filter(o => o.status === 'draft').length}
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
                <p className="text-sm font-medium text-gray-500">Подтверждены</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {overheads.filter(o => o.status === 'confirmed').length}
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
                <p className="text-sm font-medium text-gray-500">Отменены</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {overheads.filter(o => o.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        {showFilters && (
          <div className="card p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по номеру или цеху..."
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
                  <option value="all">Все статусы</option>
                  <option value="draft">Черновик</option>
                  <option value="confirmed">Подтверждена</option>
                  <option value="cancelled">Отменена</option>
                </select>
              </div>
              <div>
                <button
                  onClick={loadOverheads}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Обновить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Массовые действия */}
        {selectedOverheads.length > 0 && (
          <div className="card p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-900">
                  Выбрано накладных: {selectedOverheads.length}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkConfirm}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Подтвердить
                </button>
                <button
                  onClick={() => setSelectedOverheads([])}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Таблица накладных */}
        <div className="card p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedOverheads.length === filteredOverheads.length && filteredOverheads.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Номер
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цех
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
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
                ) : filteredOverheads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Накладные не найдены
                    </td>
                  </tr>
                ) : (
                  filteredOverheads.map((overhead, index) => (
                    <tr key={`${overhead.id}-${index}`} className={`hover:bg-gray-50 ${selectedOverheads.includes(overhead.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOverheads.includes(overhead.id)}
                          onChange={() => handleSelectOverhead(overhead.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {overhead.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {overhead.date ? new Date(overhead.date).toLocaleDateString('ru-RU') : 'Не указано'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {overhead.shop_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="font-semibold">{overhead.device_count}</span>
                          <span className="text-gray-400 ml-1">изд.</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(overhead.status)}`}>
                          {getStatusText(overhead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          overhead.type === 'Выдача' ? 'bg-blue-100 text-blue-800' :
                          overhead.type === 'Возврат' ? 'bg-orange-100 text-orange-800' :
                          overhead.type === 'Передача' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {overhead.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleViewDetails(overhead)}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                            title="Просмотр"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditOverhead(overhead)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                            title="Редактировать"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {overhead.status === 'draft' && (
                            <button 
                              onClick={() => handleConfirmOverhead(overhead.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                              title="Подтвердить"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {overhead.status !== 'cancelled' && (
                            <button 
                              onClick={() => handleCancelOverhead(overhead.id)}
                              className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-100"
                              title="Отменить"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteOverhead(overhead.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                            title="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Форма накладной */}
      {showForm && (
        <OverheadForm
          overhead={editingOverhead}
          onSave={handleSaveOverhead}
          onCancel={handleCancelForm}
        />
      )}

      {/* Модальное окно деталей накладной */}
      {showDetailModal && detailOverhead && (
        <OverheadDetailModal
          overhead={detailOverhead}
          onClose={handleCloseDetailModal}
        />
      )}
    </Layout>
  );
}
