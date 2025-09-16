'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import DictionaryManager from '@/components/DictionaryManager';
import { apiClient } from '@/lib/api';
import { Users, Settings as SettingsIcon, Database, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [showDictionaryManager, setShowDictionaryManager] = useState(false);

  const tabs = [
    { id: 'users', name: 'Пользователи', icon: Users },
    { id: 'roles', name: 'Роли', icon: Shield },
    { id: 'dictionaries', name: 'Справочники', icon: Database },
    { id: 'system', name: 'Система', icon: SettingsIcon },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление пользователями, ролями и системными настройками
          </p>
        </div>

        {/* Табы */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Содержимое табов */}
        <div className="card p-6">
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'roles' && <RolesTab />}
          {activeTab === 'dictionaries' && <DictionariesTab onOpenManager={() => setShowDictionaryManager(true)} />}
          {activeTab === 'system' && <SystemTab />}
        </div>

        {/* Dictionary Manager Modal */}
        {showDictionaryManager && (
          <DictionaryManager onClose={() => setShowDictionaryManager(false)} />
        )}
      </div>
    </Layout>
  );
}

function UsersTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Пользователи системы</h3>
        <button className="btn btn-primary">+ Новый пользователь</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Логин
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ФИО
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
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
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                admin
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Администратор Системы
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="badge badge-info">Администратор</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="badge badge-success">Активен</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="text-primary-600 hover:text-primary-900">Редактировать</button>
                  <button className="text-red-600 hover:text-red-900">Заблокировать</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RolesTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Роли пользователей</h3>
        <button className="btn btn-primary">+ Новая роль</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Администратор системы', code: 'ADMIN', permissions: ['all'] },
          { name: 'Регистратор', code: 'REGISTRAR', permissions: ['carts.read', 'carts.create', 'carts.update'] },
          { name: 'Медицинский работник', code: 'MEDICAL', permissions: ['orders.medical.read', 'orders.medical.approve'] },
          { name: 'Производственный работник', code: 'PRODUCTION', permissions: ['orders.production.read', 'orders.production.update'] },
          { name: 'Складской работник', code: 'WAREHOUSE', permissions: ['warehouse.read', 'warehouse.issue'] },
          { name: 'Отчетный работник', code: 'REPORTS', permissions: ['reports.read', 'reports.export'] },
        ].map((role, index) => (
          <div key={index} className="card p-4">
            <h4 className="font-medium text-gray-900">{role.name}</h4>
            <p className="text-sm text-gray-500 mt-1">Код: {role.code}</p>
            <div className="mt-3">
              <p className="text-xs text-gray-500">Разрешения:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {role.permissions.map((permission, pIndex) => (
                  <span key={pIndex} className="badge badge-info text-xs">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DictionariesTabProps {
  onOpenManager: () => void;
}

function DictionariesTab({ onOpenManager }: DictionariesTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Справочники системы</h3>
        <button 
          onClick={onOpenManager}
          className="btn btn-primary flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Управление справочниками
        </button>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <Database className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Централизованное управление справочниками</h4>
            <p className="text-sm text-blue-700 mt-1">
              Используйте кнопку "Управление справочниками" для просмотра, редактирования и добавления записей во всех справочниках системы.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-4">
          <h4 className="font-medium text-gray-900 mb-3">Административные</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Области</span>
              <span className="text-xs text-gray-500">9 записей</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Районы</span>
              <span className="text-xs text-gray-500">45 записей</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Населенные пункты</span>
              <span className="text-xs text-gray-500">120 записей</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">МСЭК организации</span>
              <span className="text-xs text-gray-500">8 записей</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <h4 className="font-medium text-gray-900 mb-3">Медицинские</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Типы ампутации</span>
              <span className="text-xs text-gray-500">3 записи</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Типы диагнозов</span>
              <span className="text-xs text-gray-500">10 записей</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Типы устройств</span>
              <span className="text-xs text-gray-500">15 записей</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Формы культи</span>
              <span className="text-xs text-gray-500">6 записей</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <h4 className="font-medium text-gray-900 mb-3">Технические</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Материалы</span>
              <span className="text-xs text-gray-500">25 записей</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Виды работ</span>
              <span className="text-xs text-gray-500">12 записей</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Сотрудники</span>
              <span className="text-xs text-gray-500">8 записей</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Модели обуви</span>
              <span className="text-xs text-gray-500">5 записей</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemTab() {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Системные настройки</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название организации
          </label>
          <input 
            type="text" 
            className="input" 
            defaultValue="РУПИО - Республиканское управление протезно-ортопедических изделий"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Время жизни сессии (минуты)
          </label>
          <input 
            type="number" 
            className="input" 
            defaultValue="5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Максимальное количество попыток входа
          </label>
          <input 
            type="number" 
            className="input" 
            defaultValue="3"
          />
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="auto-logout" 
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            defaultChecked
          />
          <label htmlFor="auto-logout" className="ml-2 block text-sm text-gray-900">
            Автоматический выход при неактивности
          </label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="email-notifications" 
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            defaultChecked
          />
          <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
            Email уведомления
          </label>
        </div>
        
        <div className="pt-4">
          <button className="btn btn-primary">Сохранить настройки</button>
        </div>
      </div>
    </div>
  );
}
