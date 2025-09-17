'use client';

import React, { useState, useEffect } from 'react';
import { PrintTemplate, SemiFinishedProductTemplate, ShoeTemplate } from '@/types';
import { apiClient } from '@/lib/api';
import { FileText, Package, Footprints, Plus, Edit, Trash2, Download, Eye } from 'lucide-react';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';

export default function PrintTemplatesManager() {
  const [activeTab, setActiveTab] = useState<'print' | 'semi' | 'shoes'>('print');
  const [printTemplates, setPrintTemplates] = useState<PrintTemplate[]>([]);
  const [semiTemplates, setSemiTemplates] = useState<SemiFinishedProductTemplate[]>([]);
  const [shoeTemplates, setShoeTemplates] = useState<ShoeTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadTemplates();
  }, [activeTab]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'print':
          const printData = await apiClient.getPrintTemplates();
          setPrintTemplates(printData);
          break;
        case 'semi':
          const semiData = await apiClient.getSemiFinishedProductTemplates();
          setSemiTemplates(semiData);
          break;
        case 'shoes':
          const shoeData = await apiClient.getShoeTemplates();
          setShoeTemplates(shoeData);
          break;
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (template: any) => {
    // В реальной системе здесь будет логика печати
    console.log('Printing template:', template);
    alert(`Печать бланка: ${template.name}`);
  };

  const handleDownload = (template: any) => {
    // В реальной системе здесь будет логика скачивания
    console.log('Downloading template:', template);
    alert(`Скачивание бланка: ${template.name}`);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'prosthesis': 'bg-blue-100 text-blue-800',
      'shoes': 'bg-green-100 text-green-800',
      'orthopedic': 'bg-purple-100 text-purple-800',
      'repair': 'bg-yellow-100 text-yellow-800',
      'ready_poi': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryText = (category: string) => {
    const texts = {
      'prosthesis': 'Протезы',
      'shoes': 'Обувь',
      'orthopedic': 'Оттобок',
      'repair': 'Ремонт',
      'ready_poi': 'Готовые ПОИ'
    };
    return texts[category as keyof typeof texts] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Справочники для распечатки бланков</h2>
      </div>

      {/* Вкладки */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('print')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'print'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Бланки заказов
          </button>
          <button
            onClick={() => setActiveTab('semi')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'semi'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Полуфабрикаты
          </button>
          <button
            onClick={() => setActiveTab('shoes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shoes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Footprints className="h-4 w-4 inline mr-2" />
            Обувь
          </button>
        </nav>
      </div>

      {/* Контент вкладок */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'print' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {printTemplates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                      {getCategoryText(template.category)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePrint(template)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Печать
                    </button>
                    <button
                      onClick={() => handleDownload(template)}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Скачать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'semi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {semiTemplates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePrint(template)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Печать
                    </button>
                    <button
                      onClick={() => handleDownload(template)}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Скачать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shoes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shoeTemplates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Обувь
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    {template.color && <div>Цвет: {template.color}</div>}
                    {template.material && <div>Материал: {template.material}</div>}
                    {template.sole_type && <div>Подошва: {template.sole_type}</div>}
                    {template.fastening_type && <div>Застежка: {template.fastening_type}</div>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePrint(template)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Печать
                    </button>
                    <button
                      onClick={() => handleDownload(template)}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Скачать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
