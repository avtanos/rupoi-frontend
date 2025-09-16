'use client';

import React, { useState } from 'react';
import { TundukData } from '@/types';
import { Search, Download, RefreshCw } from 'lucide-react';

interface TundukIntegrationProps {
  onDataReceived: (data: TundukData) => void;
}

export default function TundukIntegration({ onDataReceived }: TundukIntegrationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<TundukData[]>([]);
  const [selectedData, setSelectedData] = useState<TundukData | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // Симуляция запроса к системе Тундук
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Мок-данные для демонстрации
      const mockResults: TundukData[] = [
        {
          id: 1,
          cart_id: 0,
          date: new Date().toISOString().split('T')[0],
          first_name: 'Иван',
          name: 'Иванов',
          parent_name: 'Иванович',
          birth_date: '1980-03-12',
          passport_issue_date: '2010-05-15',
          passport_issued_by: 'ОВД г. Бишкек',
          address_residence: 'г. Бишкек, ул. Чуйская, 123',
          msec_organization_name: 'МСЭ №1 г. Бишкек',
          msec_examination_date: '2020-01-01',
          msec_examination_type: 'Первичное',
          msec_from: '2020-01-01',
          msec_to: '2025-12-31',
          msec_time_of_disability: '5 лет',
          msec_re_examination: true,
          msec_status_code: 'ACTIVE',
          msec_in_absentia: false,
          msec_is_death_period: false,
          msec_wheelchair_goal: false,
          msec_has_ipr: true,
          msec_disability_group: 2
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Ошибка поиска в системе Тундук:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectData = (data: TundukData) => {
    setSelectedData(data);
  };

  const handleImportData = () => {
    if (selectedData) {
      onDataReceived(selectedData);
      setSelectedData(null);
      setSearchResults([]);
      setSearchTerm('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <RefreshCw className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Интеграция с системой Тундук
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Получение данных о пациентах из государственных систем Кыргызстана
            </p>
          </div>
        </div>
      </div>

      {/* Поиск */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Поиск пациента</h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Введите ПИН, ФИО или номер документа..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !searchTerm.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Поиск...' : 'Найти'}
          </button>
        </div>
      </div>

      {/* Результаты поиска */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Результаты поиска</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {searchResults.map((data, index) => (
              <div
                key={index}
                className={`p-6 hover:bg-gray-50 cursor-pointer ${
                  selectedData === data ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleSelectData(data)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {data.name} {data.first_name} {data.parent_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Дата рождения: {data.birth_date ? new Date(data.birth_date).toLocaleDateString('ru-RU') : 'Не указано'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>МСЭК: {data.msec_organization_name}</p>
                        <p>Группа инвалидности: {data.msec_disability_group}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedData === data && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Выбрано
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка импорта */}
      {selectedData && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Импорт данных</h3>
              <p className="text-sm text-gray-500">
                Данные будут импортированы в карточку пациента
              </p>
            </div>
            <button
              onClick={handleImportData}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Импортировать
            </button>
          </div>
        </div>
      )}

      {/* Информация о системе */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">О системе Тундук</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Интеграция с ГРС</h4>
            <p className="text-sm text-gray-600">
              Получение актуальных данных о гражданах из Государственного реестра населения
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Интеграция с МСЭК</h4>
            <p className="text-sm text-gray-600">
              Синхронизация данных об инвалидности и медицинских показаниях
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Интеграция с САНАРИП</h4>
            <p className="text-sm text-gray-600">
              Получение адресных данных из Системы адресного реестра
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Автоматическое обновление</h4>
            <p className="text-sm text-gray-600">
              Периодическая синхронизация данных для поддержания актуальности
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
