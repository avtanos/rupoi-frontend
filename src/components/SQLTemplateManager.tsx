'use client';

import React, { useState, useEffect } from 'react';
import { 
  SQLTemplate, 
  ALL_SQL_TEMPLATES, 
  getTemplatesByEntityType, 
  buildSQL, 
  validateParameters 
} from '@/constants/sql-templates';
import { 
  Database, 
  Play, 
  Copy, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';

interface SQLTemplateManagerProps {
  entityType?: 'cart' | 'order' | 'overhead';
  onExecute?: (sql: string, parameters: Record<string, any>) => void;
}

export default function SQLTemplateManager({ 
  entityType, 
  onExecute 
}: SQLTemplateManagerProps) {
  const [templates, setTemplates] = useState<SQLTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SQLTemplate | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [generatedSQL, setGeneratedSQL] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const [showSQL, setShowSQL] = useState(false);

  useEffect(() => {
    if (entityType) {
      setTemplates(getTemplatesByEntityType(entityType));
    } else {
      setTemplates(ALL_SQL_TEMPLATES);
    }
  }, [entityType]);

  useEffect(() => {
    if (selectedTemplate) {
      const newParameters: Record<string, any> = {};
      selectedTemplate.parameters.forEach(param => {
        if (param.defaultValue !== undefined) {
          newParameters[param.name] = param.defaultValue;
        }
      });
      setParameters(newParameters);
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (template: SQLTemplate) => {
    setSelectedTemplate(template);
    setShowSQL(false);
    setGeneratedSQL('');
    setValidationResult(null);
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleGenerateSQL = () => {
    if (!selectedTemplate) return;

    const validation = validateParameters(selectedTemplate, parameters);
    setValidationResult(validation);

    if (validation.isValid) {
      const sql = buildSQL(selectedTemplate, parameters);
      setGeneratedSQL(sql);
      setShowSQL(true);
    }
  };

  const handleExecuteSQL = () => {
    if (generatedSQL && onExecute) {
      onExecute(generatedSQL, parameters);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generatedSQL);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([generatedSQL], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.id || 'query'}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEntityTypeColor = (entityType: string) => {
    const colors: Record<string, string> = {
      'cart': 'bg-blue-100 text-blue-800',
      'order': 'bg-green-100 text-green-800',
      'overhead': 'bg-purple-100 text-purple-800'
    };
    return colors[entityType] || 'bg-gray-100 text-gray-800';
  };

  const getEntityTypeName = (entityType: string) => {
    const names: Record<string, string> = {
      'cart': 'Карточки',
      'order': 'Заказы',
      'overhead': 'Накладные'
    };
    return names[entityType] || entityType;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center space-x-3">
        <Database className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">SQL-шаблоны для выборок данных</h2>
      </div>

      {/* Фильтр по типу сущности */}
      {!entityType && (
        <div className="flex space-x-2">
          <button
            onClick={() => setTemplates(ALL_SQL_TEMPLATES)}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Все
          </button>
          <button
            onClick={() => setTemplates(getTemplatesByEntityType('cart'))}
            className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
          >
            Карточки
          </button>
          <button
            onClick={() => setTemplates(getTemplatesByEntityType('order'))}
            className="px-3 py-1 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-md hover:bg-green-100"
          >
            Заказы
          </button>
          <button
            onClick={() => setTemplates(getTemplatesByEntityType('overhead'))}
            className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-300 rounded-md hover:bg-purple-100"
          >
            Накладные
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Список шаблонов */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Доступные шаблоны</h3>
          <div className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEntityTypeColor(template.entityType)}`}>
                        {getEntityTypeName(template.entityType)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {template.parameters.length} параметров
                      </span>
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Параметры и SQL */}
        <div className="space-y-4">
          {selectedTemplate ? (
            <>
              <h3 className="text-lg font-medium text-gray-900">Параметры запроса</h3>
              
              {/* Параметры */}
              <div className="space-y-3">
                {selectedTemplate.parameters.map((param) => (
                  <div key={param.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {param.name}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">{param.description}</p>
                    
                    {param.type === 'string' && (
                      <input
                        type="text"
                        value={parameters[param.name] || ''}
                        onChange={(e) => handleParameterChange(param.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Введите ${param.name}`}
                      />
                    )}
                    
                    {param.type === 'number' && (
                      <input
                        type="number"
                        value={parameters[param.name] || ''}
                        onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Введите ${param.name}`}
                      />
                    )}
                    
                    {param.type === 'date' && (
                      <input
                        type="date"
                        value={parameters[param.name] || ''}
                        onChange={(e) => handleParameterChange(param.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                    
                    {param.type === 'boolean' && (
                      <select
                        value={parameters[param.name] || ''}
                        onChange={(e) => handleParameterChange(param.name, e.target.value === 'true')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Выберите значение</option>
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* Валидация */}
              {validationResult && (
                <div className={`p-3 rounded-lg ${
                  validationResult.isValid 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {validationResult.isValid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      validationResult.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResult.isValid ? 'Параметры корректны' : 'Ошибки в параметрах'}
                    </span>
                  </div>
                  {validationResult.errors.length > 0 && (
                    <ul className="mt-2 text-sm text-red-700 space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Кнопки действий */}
              <div className="flex space-x-2">
                <button
                  onClick={handleGenerateSQL}
                  disabled={!selectedTemplate}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4" />
                  <span>Сгенерировать SQL</span>
                </button>
              </div>

              {/* Сгенерированный SQL */}
              {showSQL && generatedSQL && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Сгенерированный SQL</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCopySQL}
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Копировать</span>
                      </button>
                      <button
                        onClick={handleDownloadSQL}
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                      >
                        <Download className="h-3 w-3" />
                        <span>Скачать</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{generatedSQL}</pre>
                  </div>
                  
                  {onExecute && (
                    <button
                      onClick={handleExecuteSQL}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                      <span>Выполнить запрос</span>
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Выберите шаблон для работы с параметрами</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
