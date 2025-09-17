'use client';

import React, { useState } from 'react';
import { ROLES, getRoleByCode, hasPermission } from '@/constants/roles';
import { Plus, Edit, Trash2, Shield, Users, Eye, EyeOff } from 'lucide-react';

interface RolesManagerProps {
  onClose: () => void;
}

export default function RolesManager({ onClose }: RolesManagerProps) {
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState<string | null>(null);

  const handleEditRole = (roleCode: string) => {
    setEditingRole(roleCode);
  };

  const handleDeleteRole = (roleCode: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить роль "${getRoleByCode(roleCode)?.name}"?`)) {
      // В реальной системе здесь будет API вызов
      console.log('Delete role:', roleCode);
    }
  };

  const handleTogglePermissions = (roleCode: string) => {
    setShowPermissions(showPermissions === roleCode ? null : roleCode);
  };

  const getPermissionIcon = (permission: string) => {
    if (permission === 'all') return <Shield className="h-4 w-4 text-red-500" />;
    if (permission.includes('read')) return <Eye className="h-4 w-4 text-blue-500" />;
    if (permission.includes('create')) return <Plus className="h-4 w-4 text-green-500" />;
    if (permission.includes('update')) return <Edit className="h-4 w-4 text-yellow-500" />;
    if (permission.includes('delete')) return <Trash2 className="h-4 w-4 text-red-500" />;
    return <Shield className="h-4 w-4 text-gray-500" />;
  };

  const getPermissionDescription = (permission: string) => {
    const descriptions: Record<string, string> = {
      'all': 'Полный доступ ко всем функциям',
      'carts.read': 'Просмотр карточек пациентов',
      'carts.create': 'Создание карточек пациентов',
      'carts.update': 'Редактирование карточек пациентов',
      'carts.delete': 'Удаление карточек пациентов',
      'orders.read': 'Просмотр заказов',
      'orders.create': 'Создание заказов',
      'orders.update': 'Обновление заказов',
      'orders.approve': 'Утверждение заказов',
      'orders.delete': 'Удаление заказов',
      'medical.directions.create': 'Создание медицинских направлений',
      'medical.directions.approve': 'Утверждение направлений',
      'archive.read': 'Просмотр архива',
      'archive.restore': 'Восстановление из архива',
      'warehouse.read': 'Просмотр склада',
      'warehouse.manage': 'Управление складом',
      'warehouse.issue': 'Выдача со склада',
      'overheads.create': 'Создание накладных',
      'overheads.read': 'Просмотр накладных',
      'overheads.update': 'Обновление накладных',
      'overheads.issue': 'Выдача по накладным',
      'reports.read': 'Просмотр отчетов',
      'reports.export': 'Экспорт отчетов',
      'reports.medical': 'Медицинские отчеты',
      'reports.production': 'Производственные отчеты',
      'reports.warehouse': 'Складские отчеты',
      'employees.manage': 'Управление сотрудниками',
      'settings.manage': 'Управление настройками',
      'integration.manage': 'Управление интеграциями'
    };
    return descriptions[permission] || permission;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Управление ролями</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => console.log('Create new role')}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Новая роль
            </button>
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Закрыть
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ROLES.map((role) => (
              <div key={role.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Код: {role.code}</p>
                    <p className="text-sm text-gray-600 mt-2">{role.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTogglePermissions(role.code)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Показать/скрыть разрешения"
                    >
                      {showPermissions === role.code ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEditRole(role.code)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Редактировать роль"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {role.code !== 'ADMIN' && (
                      <button
                        onClick={() => handleDeleteRole(role.code)}
                        className="text-red-600 hover:text-red-800"
                        title="Удалить роль"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Permissions */}
                {showPermissions === role.code && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Разрешения:</h4>
                    <div className="space-y-2">
                      {role.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          {getPermissionIcon(permission)}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{permission}</div>
                            <div className="text-xs text-gray-500">
                              {getPermissionDescription(permission)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${role.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">
                      {role.isActive ? 'Активна' : 'Неактивна'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {role.permissions.length} разрешений
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Всего ролей</p>
                  <p className="text-2xl font-semibold text-gray-900">{ROLES.length}</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Активных ролей</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {ROLES.filter(role => role.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Всего разрешений</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {ROLES.reduce((total, role) => total + role.permissions.length, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
