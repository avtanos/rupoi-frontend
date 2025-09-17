'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import RoleGuard from '@/components/RoleGuard';
import MedicalDirectionForm from '@/components/MedicalDirectionForm';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';
import { Cart, ServiceDirection } from '@/types';
import { apiClient } from '@/lib/api';
import { Stethoscope, Search, Filter, Plus, Eye, Edit, CheckCircle, XCircle, Clock, Trash2, MoreVertical } from 'lucide-react';

interface MedicalDirection extends ServiceDirection {
  cart: Cart;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

export default function MedicalDirectionsPage() {
  const [directions, setDirections] = useState<MedicalDirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDirection, setEditingDirection] = useState<MedicalDirection | null>(null);
  const [selectedDirections, setSelectedDirections] = useState<number[]>([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadDirections();
  }, [searchTerm, statusFilter]);

  const loadDirections = async () => {
    try {
      setLoading(true);
      // В реальной системе здесь будет API для получения направлений
      const mockDirections: MedicalDirection[] = [
        {
          id: 1,
          cart_id: 1,
          direction_number: '2025/001',
          service_type: 'Протезирование',
          diagnosis: 'Ампутация бедра',
          recommendations: 'Изготовление протеза бедра с коленным модулем',
          priority: 'normal',
          status: 'pending',
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
          cart: {
            id: 1,
            first_name: 'Иван',
            name: 'Иванов',
            parent_name: 'Иванович',
            card_number: '2025-0001',
            birth_date: '1980-05-15',
            phone_number: '+996 555 123 456',
            status: 'active',
            service_directions: []
          } as Cart
        },
        {
          id: 2,
          cart_id: 2,
          direction_number: '2025/002',
          service_type: 'Ортопедическая обувь',
          diagnosis: 'Плоскостопие 3 степени',
          recommendations: 'Изготовление индивидуальной ортопедической обуви',
          priority: 'high',
          status: 'approved',
          created_at: '2025-01-14T14:30:00Z',
          updated_at: '2025-01-15T09:15:00Z',
          approved_by: 'Доктор Ахмедов',
          approved_at: '2025-01-15T09:15:00Z',
          cart: {
            id: 2,
            first_name: 'Мария',
            name: 'Петрова',
            parent_name: 'Сергеевна',
            card_number: '2025-0002',
            birth_date: '1975-03-22',
            phone_number: '+996 555 234 567',
            status: 'active',
            service_directions: []
          } as Cart
        }
      ];
      setDirections(mockDirections);
    } catch (error) {
      console.error('Failed to load directions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDirection = () => {
    setEditingDirection(null);
    setShowForm(true);
  };

  const handleEditDirection = (direction: MedicalDirection) => {
    setEditingDirection(direction);
    setShowForm(true);
  };

  const handleApproveDirection = async (directionId: number) => {
    try {
      const direction = directions.find(d => d.id === directionId);
      if (!direction) return;

      const updatedDirection = {
        ...direction,
        status: 'approved' as const,
        approved_by: 'Текущий пользователь',
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setDirections(prev => prev.map(d => d.id === directionId ? updatedDirection : d));
    } catch (error) {
      console.error('Failed to approve direction:', error);
    }
  };

  const handleRejectDirection = async (directionId: number, reason: string) => {
    try {
      const direction = directions.find(d => d.id === directionId);
      if (!direction) return;

      const updatedDirection = {
        ...direction,
        status: 'rejected' as const,
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      };

      setDirections(prev => prev.map(d => d.id === directionId ? updatedDirection : d));
    } catch (error) {
      console.error('Failed to reject direction:', error);
    }
  };

  const handleSaveDirection = (directionData: ServiceDirection) => {
    if (editingDirection) {
      // Редактирование существующего направления
      const updatedDirection = {
        ...directionData,
        cart: directions.find(d => d.id === directionData.id)?.cart || {} as Cart,
        created_at: editingDirection.created_at,
        updated_at: new Date().toISOString()
      };
      setDirections(prev => prev.map(d => d.id === directionData.id ? updatedDirection : d));
    } else {
      // Создание нового направления
      const newDirection: MedicalDirection = {
        ...directionData,
        cart: directions.find(d => d.id === directionData.cart_id) || {} as Cart,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setDirections(prev => [newDirection, ...prev]);
    }
    setShowForm(false);
    setEditingDirection(null);
  };

  const handleDeleteDirection = async (directionId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это направление?')) {
      setDirections(prev => prev.filter(d => d.id !== directionId));
    }
  };

  const handleBulkApprove = () => {
    if (selectedDirections.length === 0) return;
    
    const updatedDirections = directions.map(d => 
      selectedDirections.includes(d.id) 
        ? { ...d, status: 'approved' as const, approved_by: 'Текущий пользователь', approved_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        : d
    );
    setDirections(updatedDirections);
    setSelectedDirections([]);
  };

  const handleBulkReject = () => {
    if (selectedDirections.length === 0) return;
    
    const reason = prompt('Причина отклонения выбранных направлений:');
    if (reason) {
      const updatedDirections = directions.map(d => 
        selectedDirections.includes(d.id) 
          ? { ...d, status: 'rejected' as const, rejection_reason: reason, updated_at: new Date().toISOString() }
          : d
      );
      setDirections(updatedDirections);
      setSelectedDirections([]);
    }
  };

  const handleSelectDirection = (directionId: number) => {
    setSelectedDirections(prev => 
      prev.includes(directionId) 
        ? prev.filter(id => id !== directionId)
        : [...prev, directionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDirections.length === filteredDirections.length) {
      setSelectedDirections([]);
    } else {
      setSelectedDirections(filteredDirections.map(dir => dir.id));
    }
  };

  const filteredDirections = directions.filter(direction => {
    const matchesSearch = !searchTerm || 
      direction.direction_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      direction.cart.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      direction.cart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      direction.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      direction.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || direction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge badge-warning';
      case 'approved':
        return 'badge badge-success';
      case 'rejected':
        return 'badge badge-error';
      default:
        return 'badge badge-info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'На рассмотрении';
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отклонено';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'badge badge-error';
      case 'normal':
        return 'badge badge-info';
      case 'low':
        return 'badge badge-success';
      default:
        return 'badge badge-info';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'normal':
        return 'Обычный';
      case 'low':
        return 'Низкий';
      default:
        return 'Обычный';
    }
  };

  // Конфигурация колонок для мобильного отображения
  const mobileColumns = [
    {
      key: 'direction_number',
      label: 'Номер',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'patient',
      label: 'Пациент',
      render: (value: any, item: MedicalDirection) => (
        <span>{item.cart.first_name} {item.cart.name} {item.cart.parent_name}</span>
      )
    },
    {
      key: 'service_type',
      label: 'Тип услуги'
    },
    {
      key: 'diagnosis',
      label: 'Диагноз'
    },
    {
      key: 'priority',
      label: 'Приоритет',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(value)}`}>
          {getPriorityText(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => (
        <div className="flex items-center">
          {getStatusIcon(value)}
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(value)}`}>
            {getStatusText(value)}
          </span>
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Дата создания',
      render: (value: string) => new Date(value).toLocaleDateString('ru-RU')
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, item: MedicalDirection) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditDirection(item)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
            title="Редактировать"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.open(`/carts/${item.cart_id}`, '_blank')}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Просмотр карточки"
          >
            <Eye className="h-4 w-4" />
          </button>
          {item.status === 'pending' && (
            <>
              <button
                onClick={() => handleApproveDirection(item.id)}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                title="Одобрить"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Причина отклонения:');
                  if (reason) handleRejectDirection(item.id, reason);
                }}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                title="Отклонить"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN', 'MEDICAL']}>
      <Layout>
        <div className="space-y-6">
          {/* Заголовок */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Медицинские направления</h1>
              <p className="text-gray-600">Управление направлениями на медицинские услуги</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Фильтры
              </button>
              <button
                onClick={handleCreateDirection}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Создать направление
              </button>
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
                  <p className="text-sm font-medium text-gray-500">Всего направлений</p>
                  <p className="text-2xl font-semibold text-gray-900">{directions.length}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">На рассмотрении</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {directions.filter(dir => dir.status === 'pending').length}
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
                  <p className="text-sm font-medium text-gray-500">Одобрено</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {directions.filter(dir => dir.status === 'approved').length}
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
                    {directions.filter(dir => dir.status === 'rejected').length}
                  </p>
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
                      placeholder="Поиск по номеру, ФИО, диагнозу..."
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
                    <option value="pending">На рассмотрении</option>
                    <option value="approved">Одобрено</option>
                    <option value="rejected">Отклонено</option>
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

          {/* Панель массовых действий */}
          {selectedDirections.length > 0 && (
            <div className="card p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    Выбрано направлений: {selectedDirections.length}
                  </span>
                  <button
                    onClick={() => setSelectedDirections([])}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Снять выделение
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkApprove}
                    className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Одобрить все
                  </button>
                  <button
                    onClick={handleBulkReject}
                    className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Отклонить все
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Таблица направлений */}
          <div className="card p-6">
            {isMobile ? (
              // Мобильное отображение в виде карточек
              <MobileCardView
                data={filteredDirections}
                columns={mobileColumns}
              />
            ) : (
              // Десктопное отображение в виде таблицы
              <ResponsiveTable>
                <ResponsiveTableHeader>
                  <ResponsiveTableRow>
                    <ResponsiveTableCell isHeader>
                      <input
                        type="checkbox"
                        checked={selectedDirections.length === filteredDirections.length && filteredDirections.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader>Номер</ResponsiveTableCell>
                    <ResponsiveTableCell isHeader>Пациент</ResponsiveTableCell>
                    <ResponsiveTableCell isHeader>Тип услуги</ResponsiveTableCell>
                    <ResponsiveTableCell isHeader>Диагноз</ResponsiveTableCell>
                    <ResponsiveTableCell isHeader>Приоритет</ResponsiveTableCell>
                    <ResponsiveTableCell isHeader>Статус</ResponsiveTableCell>
                    <ResponsiveTableCell isHeader>Дата создания</ResponsiveTableCell>
                    <ResponsiveTableCell isHeader>Действия</ResponsiveTableCell>
                  </ResponsiveTableRow>
                </ResponsiveTableHeader>
                <ResponsiveTableBody>
                  {loading ? (
                    <ResponsiveTableRow>
                      <ResponsiveTableCell colSpan={9} className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ) : filteredDirections.length === 0 ? (
                    <ResponsiveTableRow>
                      <ResponsiveTableCell colSpan={9} className="text-center text-gray-500">
                        {directions.length === 0 ? 'Направления не найдены' : 'Нет направлений, соответствующих фильтрам'}
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ) : (
                    filteredDirections.map((direction) => (
                      <ResponsiveTableRow 
                        key={direction.id} 
                        className={`hover:bg-gray-50 ${selectedDirections.includes(direction.id) ? 'bg-blue-50' : ''}`}
                      >
                        <ResponsiveTableCell>
                          <input
                            type="checkbox"
                            checked={selectedDirections.includes(direction.id)}
                            onChange={() => handleSelectDirection(direction.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="font-medium text-gray-900">
                          {direction.direction_number}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell>
                          {direction.cart.first_name} {direction.cart.name} {direction.cart.parent_name}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="text-gray-500">
                          {direction.service_type}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="text-gray-500">
                          {direction.diagnosis}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell>
                          <span className={getPriorityBadge(direction.priority)}>
                            {getPriorityText(direction.priority)}
                          </span>
                        </ResponsiveTableCell>
                        <ResponsiveTableCell>
                          <div className="flex items-center">
                            {getStatusIcon(direction.status)}
                            <span className={`ml-2 ${getStatusBadge(direction.status)}`}>
                              {getStatusText(direction.status)}
                            </span>
                          </div>
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="text-gray-500">
                          {new Date(direction.created_at).toLocaleDateString('ru-RU')}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell>
                          <div className="flex items-center space-x-2">
                            {/* Основные действия */}
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditDirection(direction)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                                title="Редактировать"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => window.open(`/carts/${direction.cart_id}`, '_blank')}
                                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                title="Просмотр карточки"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Действия по статусу */}
                            {direction.status === 'pending' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleApproveDirection(direction.id)}
                                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                                  title="Одобрить"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Причина отклонения:');
                                    if (reason) handleRejectDirection(direction.id, reason);
                                  }}
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                                  title="Отклонить"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            )}

                            {/* Дополнительные действия */}
                            <div className="relative group">
                              <button
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                title="Дополнительные действия"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      if (navigator.clipboard) {
                                        navigator.clipboard.writeText(direction.direction_number);
                                      }
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Копировать номер
                                  </button>
                                  <button
                                    onClick={() => window.print()}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Печать направления
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDirection(direction.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Удалить
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ResponsiveTableCell>
                      </ResponsiveTableRow>
                    ))
                  )}
                </ResponsiveTableBody>
              </ResponsiveTable>
            )}
          </div>

          {/* Форма создания/редактирования направления */}
          {showForm && (
            <MedicalDirectionForm
              direction={editingDirection}
              onSave={handleSaveDirection}
              onCancel={() => {
                setShowForm(false);
                setEditingDirection(null);
              }}
            />
          )}
        </div>
      </Layout>
    </RoleGuard>
  );
}
