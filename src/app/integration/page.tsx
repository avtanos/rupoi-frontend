'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Layout from '@/components/Layout';
import TundukIntegration from '@/components/TundukIntegration';
import { TundukData } from '@/types';
import { 
  RefreshCw, 
  Database, 
  Shield, 
  Globe, 
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function IntegrationPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [integrationStatus, setIntegrationStatus] = useState({
    tunduk: 'connected',
    grs: 'connected',
    msec: 'disconnected',
    sanarip: 'connecting'
  });

  const handleTundukDataReceived = (data: TundukData) => {
    console.log('Получены данные из Тундук:', data);
    // Здесь можно добавить логику обработки полученных данных
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'connecting':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'disconnected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Подключено';
      case 'connecting':
        return 'Подключение...';
      case 'disconnected':
        return 'Отключено';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Интеграция с внешними системами</h1>
          <p className="text-gray-600">Управление интеграцией с государственными системами Кыргызстана</p>
        </div>

        {/* Статус интеграций */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Database className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Система Тундук</h3>
                <div className="flex items-center mt-1">
                  {getStatusIcon(integrationStatus.tunduk)}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integrationStatus.tunduk)}`}>
                    {getStatusText(integrationStatus.tunduk)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">ГРС</h3>
                <div className="flex items-center mt-1">
                  {getStatusIcon(integrationStatus.grs)}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integrationStatus.grs)}`}>
                    {getStatusText(integrationStatus.grs)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">МСЭК</h3>
                <div className="flex items-center mt-1">
                  {getStatusIcon(integrationStatus.msec)}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integrationStatus.msec)}`}>
                    {getStatusText(integrationStatus.msec)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RefreshCw className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">САНАРИП</h3>
                <div className="flex items-center mt-1">
                  {getStatusIcon(integrationStatus.sanarip)}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integrationStatus.sanarip)}`}>
                    {getStatusText(integrationStatus.sanarip)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Интеграция с Тундук */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Интеграция с системой Тундук</h2>
            <p className="text-sm text-gray-500 mt-1">
              Получение данных о пациентах из государственных систем
            </p>
          </div>
          <div className="p-6">
            <TundukIntegration onDataReceived={handleTundukDataReceived} />
          </div>
        </div>

        {/* Настройки интеграции */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Настройки интеграции</h2>
            <p className="text-sm text-gray-500 mt-1">
              Управление параметрами подключения к внешним системам
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Параметры подключения</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL API Тундук
                    </label>
                    <input
                      type="url"
                      defaultValue="https://api.tunduk.kg/v1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API ключ
                    </label>
                    <input
                      type="password"
                      placeholder="Введите API ключ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Таймаут запроса (сек)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Настройки синхронизации</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Интервал синхронизации
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="hourly">Каждый час</option>
                      <option value="daily">Ежедневно</option>
                      <option value="weekly">Еженедельно</option>
                      <option value="manual">Вручную</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Автоматическое обновление
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Включить автоматическую синхронизацию
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Уведомления об ошибках
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Отправлять уведомления об ошибках интеграции
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Сбросить
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Сохранить настройки
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
