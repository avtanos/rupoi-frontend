'use client';

import React, { useState, useEffect } from 'react';
import { 
  ValidationRule, 
  ValidationResult,
  VALIDATION_RULES,
  getValidationRule,
  getActiveValidationRules,
  getValidationRulesByCategory,
  validateByRules,
  validateRule,
  getViolatedRules,
  getWarnings,
  getErrors,
  getRecommendations,
  getRulesStatistics,
  applyUIIndicators
} from '@/constants/validation-rules';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Save,
  FileText,
  Code,
  Zap,
  Settings,
  Database,
  AlertCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';

interface ValidationRulesManagerProps {
  data?: any;
  onValidationChange?: (results: ValidationResult[], isValid: boolean) => void;
  onRuleViolation?: (rule: ValidationRule, result: ValidationResult) => void;
}

export default function ValidationRulesManager({
  data = {},
  onValidationChange,
  onRuleViolation
}: ValidationRulesManagerProps) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [selectedRule, setSelectedRule] = useState<ValidationRule | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'validation' | 'statistics' | 'recommendations'>('rules');
  const [showDetails, setShowDetails] = useState(false);
  const { isMobile } = useResponsive();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const results = validateByRules(data);
      setValidationResults(results);
      setIsValid(results.every(r => r.isValid));
      
      if (onValidationChange) {
        onValidationChange(results, results.every(r => r.isValid));
      }
    }
  }, [data, onValidationChange]);

  const handleRuleClick = (rule: ValidationRule) => {
    setSelectedRule(rule);
    setShowDetails(true);
  };

  const handleRuleViolation = (rule: ValidationRule, result: ValidationResult) => {
    if (onRuleViolation) {
      onRuleViolation(rule, result);
    }
  };

  const getRuleIcon = (rule: ValidationRule) => {
    switch (rule.severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRuleColor = (rule: ValidationRule) => {
    switch (rule.severity) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultIcon = (result: ValidationResult) => {
    switch (result.severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getResultColor = (result: ValidationResult) => {
    switch (result.severity) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const filteredRules = getActiveValidationRules().filter(rule => {
    if (filterCategory !== 'all' && rule.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && rule.severity !== filterSeverity) return false;
    return true;
  });

  const statistics = getRulesStatistics(data);
  const recommendations = getRecommendations(data);

  const renderRulesList = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Правила валидации</h3>
          <div className="flex items-center space-x-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все категории</option>
              <option value="service">Услуги</option>
              <option value="order">Заказы</option>
              <option value="status">Статусы</option>
              <option value="diagnosis">Диагнозы</option>
              <option value="urgency">Срочность</option>
              <option value="warehouse">Склад</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все уровни</option>
              <option value="error">Ошибки</option>
              <option value="warning">Предупреждения</option>
              <option value="info">Информация</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRules.map((rule) => {
            const result = validationResults.find(r => r.ruleId === rule.id);
            const isViolated = result && !result.isValid;
            
            return (
              <div
                key={rule.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:shadow-md ${
                  isViolated ? 'border-red-200 bg-red-50' : getRuleColor(rule)
                }`}
                onClick={() => handleRuleClick(rule)}
              >
                <div className="flex items-start space-x-3">
                  {getRuleIcon(rule)}
                  <div className="flex-1">
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm opacity-75 mt-1">{rule.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs opacity-60">
                        {rule.conditions.length} условий
                      </span>
                      <span className="text-xs opacity-60">•</span>
                      <span className="text-xs opacity-60">
                        {rule.effects.length} эффектов
                      </span>
                    </div>
                    {result && (
                      <div className="mt-2">
                        <div className={`text-xs px-2 py-1 rounded ${
                          result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.isValid ? 'Соблюдено' : 'Нарушено'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderValidationResults = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Результаты валидации</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.valid}</div>
            <div className="text-sm text-gray-600">Соблюдено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statistics.errors}</div>
            <div className="text-sm text-gray-600">Ошибок</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statistics.warnings}</div>
            <div className="text-sm text-gray-600">Предупреждений</div>
          </div>
        </div>

        <div className="space-y-3">
          {validationResults.map((result) => (
            <div
              key={result.ruleId}
              className={`p-4 border rounded-lg ${getResultColor(result)}`}
            >
              <div className="flex items-start space-x-3">
                {getResultIcon(result)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{result.ruleId}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.severity}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{result.message}</p>
                  {result.affectedFields.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-600">Затронутые поля: </span>
                      <span className="text-xs text-gray-800">
                        {result.affectedFields.join(', ')}
                      </span>
                    </div>
                  )}
                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-600">Рекомендации: </span>
                      <ul className="text-xs text-gray-800 mt-1">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStatistics = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Статистика правил</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
            <div className="text-sm text-gray-600">Всего правил</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{statistics.valid}</div>
            <div className="text-sm text-gray-600">Соблюдено</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{statistics.errors}</div>
            <div className="text-sm text-gray-600">Ошибок</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{statistics.warnings}</div>
            <div className="text-sm text-gray-600">Предупреждений</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">По категориям</h4>
            <div className="space-y-2">
              {['service', 'order', 'status', 'diagnosis', 'urgency', 'warehouse'].map(category => {
                const categoryRules = getValidationRulesByCategory(category);
                const categoryResults = validationResults.filter(r => 
                  categoryRules.some(rule => rule.id === r.ruleId)
                );
                const categoryValid = categoryResults.filter(r => r.isValid).length;
                
                return (
                  <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 capitalize">{category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{categoryValid}/{categoryRules.length}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(categoryValid / categoryRules.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">По уровням</h4>
            <div className="space-y-2">
              {[
                { level: 'error', color: 'red', count: statistics.errors },
                { level: 'warning', color: 'yellow', count: statistics.warnings },
                { level: 'info', color: 'blue', count: statistics.info }
              ].map(({ level, color, count }) => (
                <div key={level} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700 capitalize">{level}</span>
                  <span className={`text-sm font-medium text-${color}-600`}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Рекомендации</h3>
        
        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-800">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <p>Нет рекомендаций</p>
            <p className="text-sm">Все правила соблюдены</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Управление правилами валидации</h2>
            <p className="text-sm text-gray-600">Контроль допустимых комбинаций</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <span>{isValid ? '✓' : '✗'}</span>
            <span>{isValid ? 'Валидация пройдена' : 'Ошибки валидации'}</span>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'rules', name: 'Правила', icon: Shield },
            { id: 'validation', name: 'Валидация', icon: CheckCircle },
            { id: 'statistics', name: 'Статистика', icon: BarChart3 },
            { id: 'recommendations', name: 'Рекомендации', icon: Info }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Содержимое табов */}
      <div className="space-y-6">
        {activeTab === 'rules' && renderRulesList()}
        {activeTab === 'validation' && renderValidationResults()}
        {activeTab === 'statistics' && renderStatistics()}
        {activeTab === 'recommendations' && renderRecommendations()}
      </div>

      {/* Модальное окно деталей правила */}
      {showDetails && selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedRule.name}
            </h3>
            
            <div className="space-y-6">
              {/* Описание правила */}
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getRuleColor(selectedRule)}`}>
                  {getRuleIcon(selectedRule)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{selectedRule.description}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    ID: {selectedRule.id} | Код: {selectedRule.code}
                  </p>
                </div>
              </div>

              {/* Условия */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Условия выполнения:</h5>
                <div className="space-y-2">
                  {selectedRule.conditions.map((condition, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="mt-1">
                        {condition.isRequired ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-600">{condition.description}</span>
                        <div className="text-xs text-gray-400 mt-1">
                          Поле: {condition.field} | Оператор: {condition.operator}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Эффекты */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Эффекты правила:</h5>
                <div className="space-y-2">
                  {selectedRule.effects.map((effect, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{effect.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* UI индикаторы */}
              {selectedRule.uiIndicators && selectedRule.uiIndicators.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">UI индикаторы:</h5>
                  <div className="space-y-2">
                    {selectedRule.uiIndicators.map((indicator, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {indicator.element} → {indicator.type}: {indicator.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
