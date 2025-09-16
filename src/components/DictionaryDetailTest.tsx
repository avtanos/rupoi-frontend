'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { ChevronDown, ChevronRight, Database, Eye, AlertCircle } from 'lucide-react';

interface DictionaryDetailTestProps {
  dictionaryName: string;
  displayName: string;
}

export default function DictionaryDetailTest({ dictionaryName, displayName }: DictionaryDetailTestProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showData, setShowData] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const methodName = `get${dictionaryName.charAt(0).toUpperCase() + dictionaryName.slice(1)}`;
      const result = await (apiClient as any)[methodName]();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      loadData();
    }
  }, [expanded, dictionaryName]);

  const getStatusColor = () => {
    if (loading) return 'text-blue-600';
    if (error) return 'text-red-600';
    if (data.length > 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusIcon = () => {
    if (loading) return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
    if (error) return <AlertCircle className="h-4 w-4 text-red-600" />;
    if (data.length > 0) return <Database className="h-4 w-4 text-green-600" />;
    return <Database className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
          )}
          {getStatusIcon()}
          <span className="ml-2 font-medium text-gray-900">{displayName}</span>
          <span className={`ml-2 text-sm ${getStatusColor()}`}>
            {loading ? 'Загрузка...' : error ? 'Ошибка' : `(${data.length} записей)`}
          </span>
        </div>
        {data.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowData(!showData);
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            {showData ? 'Скрыть' : 'Показать'} данные
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-gray-200 p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Ошибка загрузки</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Данные не найдены</p>
            </div>
          )}

          {!loading && !error && data.length > 0 && showData && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 mb-3">
                Показано {Math.min(5, data.length)} из {data.length} записей
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.slice(0, 5).map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-mono text-gray-800">
                      {JSON.stringify(item, null, 2)}
                    </div>
                  </div>
                ))}
              </div>
              {data.length > 5 && (
                <div className="text-sm text-gray-500 text-center">
                  ... и еще {data.length - 5} записей
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
