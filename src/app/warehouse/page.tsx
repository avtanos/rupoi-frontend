'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';
import { apiClient } from '@/lib/api';
import InventoryDetailModal from '@/components/InventoryDetailModal';
import InventoryEditModal from '@/components/InventoryEditModal';
import WarehouseIssueModal from '@/components/WarehouseIssueModal';
import { Package, AlertTriangle, CheckCircle, XCircle, Plus, Eye, Edit, Trash2, ArrowUpRight, Search, Filter } from 'lucide-react';

interface InventoryItem {
  id: number;
  article: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
  min_quantity: number;
  price: number;
  code?: string;
  inventory_number?: string;
}

export default function WarehousePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getInventory();
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setShowEditModal(true);
  };

  const handleIssueItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowIssueModal(true);
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (window.confirm(`Вы уверены, что хотите удалить позицию "${item.name}"?`)) {
      try {
        await apiClient.deleteInventoryItem(item.id);
        await loadInventory();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const handleSaveItem = async (item: InventoryItem) => {
    await loadInventory();
  };

  const handleIssueComplete = async () => {
    await loadInventory();
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Вы уверены, что хотите удалить ${selectedItems.length} позиций?`)) {
      try {
        for (const itemId of selectedItems) {
          await apiClient.deleteInventoryItem(itemId);
        }
        setSelectedItems([]);
        await loadInventory();
      } catch (error) {
        console.error('Failed to delete items:', error);
      }
    }
  };

  // Фильтрация инвентаря
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = (item.article?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (item.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (item.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (item.inventory_number?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategories = () => {
    const categories = [...new Set(inventory.map(item => item.category))];
    return categories;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      in_stock: 'badge badge-success',
      low_stock: 'badge badge-warning',
      out_of_stock: 'badge badge-danger'
    };
    return badges[status as keyof typeof badges] || 'badge badge-info';
  };

  const getStatusText = (status: string) => {
    const texts = {
      in_stock: 'В наличии',
      low_stock: 'Критический запас',
      out_of_stock: 'Нет в наличии'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'out_of_stock':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Склад</h1>
            <p className="mt-1 text-sm text-gray-500">
              Управление складскими запасами и готовыми изделиями
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </button>
            <button
              onClick={handleAddItem}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить позицию
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Всего позиций</p>
                <p className="text-2xl font-semibold text-gray-900">{inventory.length}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">В наличии</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inventory.filter(item => item.status === 'in_stock').length}
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
                <p className="text-sm font-medium text-gray-500">Критический запас</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inventory.filter(item => item.status === 'low_stock').length}
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
                <p className="text-sm font-medium text-gray-500">Нет в наличии</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inventory.filter(item => item.status === 'out_of_stock').length}
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
                    placeholder="Поиск по инв. номеру, коду, названию..."
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
                  <option value="in_stock">В наличии</option>
                  <option value="low_stock">Критический запас</option>
                  <option value="out_of_stock">Нет в наличии</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все категории</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Массовые действия */}
        {selectedItems.length > 0 && (
          <div className="card p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Выбрано позиций: {selectedItems.length}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-1 inline" />
                  Удалить выбранные
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Отменить выбор
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Таблица инвентаря */}
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
                      checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Инв. номер
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Код
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Наименование
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Категория
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Количество
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Мин. запас
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Статус
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Цена
                  </ResponsiveTableCell>
                  <ResponsiveTableCell isHeader >
                    Действия
                  </ResponsiveTableCell>
                </ResponsiveTableRow>
              </ResponsiveTableHeader>
              <ResponsiveTableBody>
                {loading ? (
                  <ResponsiveTableRow>
                    <ResponsiveTableCell colSpan={10} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                ) : filteredInventory.length === 0 ? (
                  <ResponsiveTableRow>
                    <ResponsiveTableCell colSpan={10} className="px-6 py-4 text-center text-gray-500">
                      {inventory.length === 0 ? 'Инвентарь не найден' : 'Нет позиций, соответствующих фильтрам'}
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <ResponsiveTableRow key={item.id} className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}>
                      <ResponsiveTableCell >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="font-medium text-gray-900">
                        {item.inventory_number || item.article}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {item.code || '-'}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell >
                        {item.name}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {item.category}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        <div className="flex items-center">
                          <span className="font-medium">{item.quantity}</span>
                          <span className="ml-1 text-gray-400">{item.unit}</span>
                        </div>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {item.min_quantity} {item.unit}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell >
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <span className={`ml-2 ${getStatusBadge(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell className="text-gray-500">
                        {item.price.toLocaleString('ru-RU')} сом
                      </ResponsiveTableCell>
                      <ResponsiveTableCell >
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                            title="Просмотр"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-100"
                            title="Редактировать"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {item.quantity > 0 && (
                            <button
                              onClick={() => handleIssueItem(item)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                              title="Выдать со склада"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteItem(item)}
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

        {/* Модальные окна */}
        {showDetailModal && (
          <InventoryDetailModal
            item={selectedItem}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedItem(null);
            }}
          />
        )}

        {showEditModal && (
          <InventoryEditModal
            item={selectedItem}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
            onSave={handleSaveItem}
          />
        )}

        {showIssueModal && (
          <WarehouseIssueModal
            item={selectedItem}
            onClose={() => {
              setShowIssueModal(false);
              setSelectedItem(null);
            }}
            onIssue={handleIssueComplete}
          />
        )}
      </div>
    </Layout>
  );
}
