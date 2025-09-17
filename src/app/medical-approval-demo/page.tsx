'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MedicalApprovalManager from '@/components/MedicalApprovalManager';
import { 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  AlertTriangle,
  Clock,
  FileText,
  Package,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

export default function MedicalApprovalDemoPage() {
  const [currentUserId] = useState(1);
  const [orderData, setOrderData] = useState({
    id: 1,
    number: '2025-0001',
    service_id: 1,
    service_status: 'ON_APPROVAL',
    service_type: 'PROSTHESIS',
    status: 'ON_APPROVAL',
    primary_diagnosis_id: 1,
    disability_id: null,
    reject_reason: null,
    needs_info: false,
    approval_date: null,
    approved_by: null,
    rejection_date: null,
    rejected_by: null,
    info_request_date: null,
    requested_by: null,
    info_request_reason: null
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [decisionHistory, setDecisionHistory] = useState<any[]>([]);

  const handleDecision = (decisionCode: string, updatedData: any) => {
    console.log(`Medical approval decision ${decisionCode}:`, updatedData);
    
    // Обновляем данные заказа
    setOrderData(prev => ({
      ...prev,
      ...updatedData
    }));

    // Добавляем в историю решений
    setDecisionHistory(prev => [
      ...prev,
      {
        id: Date.now(),
        decision: decisionCode,
        timestamp: new Date().toISOString(),
        data: updatedData
      }
    ]);
  };

  const handleValidate = (isValid: boolean, errors: string[]) => {
    setValidationErrors(errors);
    console.log('Validation result:', { isValid, errors });
  };

  const resetOrderData = () => {
    setOrderData({
      id: 1,
      number: '2025-0001',
      service_id: 1,
      service_status: 'ON_APPROVAL',
      service_type: 'PROSTHESIS',
      status: 'ON_APPROVAL',
      primary_diagnosis_id: 1,
      disability_id: null,
      reject_reason: null,
      needs_info: false,
      approval_date: null,
      approved_by: null,
      rejection_date: null,
      rejected_by: null,
      info_request_date: null,
      requested_by: null,
      info_request_reason: null
    });
    setDecisionHistory([]);
    setValidationErrors([]);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'ON_APPROVAL': 'bg-yellow-100 text-yellow-800',
      'IN_PRODUCTION': 'bg-green-100 text-green-800',
      'NEW': 'bg-blue-100 text-blue-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'APPROVE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECT':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'REQUEST_INFO':
        return <MessageSquare className="h-4 w-4 text-yellow-600" />;
      default:
        return <UserCheck className="h-4 w-4 text-blue-600" />;
    }
  };

  const getDecisionName = (decision: string) => {
    const names: Record<string, string> = {
      'APPROVE': 'Утвердить',
      'REJECT': 'Отклонить',
      'REQUEST_INFO': 'Запросить данные'
    };
    return names[decision] || decision;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center space-x-3">
          <UserCheck className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Демонстрация медицинского утверждения</h1>
            <p className="text-gray-600">Комбинации решений и валидация</p>
          </div>
        </div>

        {/* Текущий заказ */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Текущий заказ</h3>
            <button
              onClick={resetOrderData}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Сбросить
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Номер заказа:</label>
              <div className="text-sm text-gray-900">{orderData.number}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Статус:</label>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData.status)}`}>
                  {orderData.status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Тип услуги:</label>
              <div className="text-sm text-gray-900">{orderData.service_type}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Диагноз:</label>
              <div className="text-sm text-gray-900">
                {orderData.primary_diagnosis_id ? `ID: ${orderData.primary_diagnosis_id}` : 'Не указан'}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Данные заказа:</label>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(orderData, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Медицинское утверждение */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Медицинское утверждение</h3>
          <MedicalApprovalManager
            orderData={orderData}
            currentUserId={currentUserId}
            onDecision={handleDecision}
            onValidate={handleValidate}
          />
        </div>

        {/* История решений */}
        {decisionHistory.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">История решений</h3>
            <div className="space-y-3">
              {decisionHistory.map((decision) => (
                <div key={decision.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getDecisionIcon(decision.decision)}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {getDecisionName(decision.decision)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(decision.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {decision.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ошибки валидации */}
        {validationErrors.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ошибки валидации</h3>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <XCircle className="h-6 w-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Обнаружены ошибки валидации</h4>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Информация о системе */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о системе</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Доступные решения</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Утвердить - статус → IN_PRODUCTION</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600">Отклонить - статус → NEW</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">Запросить данные - статус остается ON_APPROVAL</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Условия выполнения</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Заказ должен быть в статусе ON_APPROVAL</div>
                <div>• Для утверждения нужен primary_diagnosis_id</div>
                <div>• Для отклонения нужна reject_reason</div>
                <div>• При льготе нужен disability_id</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Статистика</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">Типов решений</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{decisionHistory.length}</div>
                <div className="text-sm text-gray-600">Принятых решений</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-gray-600">Текущий заказ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
