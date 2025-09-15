'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, BarChart3 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function ReportsPage() {
  const [lovzData, setLovzData] = useState<any[]>([]);
  const [manufacturedData, setManufacturedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [lovz, manufactured] = await Promise.all([
        apiClient.getLOVZReport(),
        apiClient.getManufacturedReport()
      ]);
      setLovzData(lovz);
      setManufacturedData(manufactured);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportLOVZ = () => {
    // В реальном приложении здесь был бы экспорт в CSV/Excel
    console.log('Exporting LOVZ report...');
  };

  const handleExportManufactured = () => {
    // В реальном приложении здесь был бы экспорт в CSV/Excel
    console.log('Exporting manufactured report...');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Отчетность</h1>
            <p className="mt-1 text-sm text-gray-500">
              Формирование и просмотр отчетов по деятельности организации
            </p>
          </div>
        </div>

        {/* Отчет по ЛОВЗ */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Отчет по ЛОВЗ</h3>
            </div>
            <button 
              onClick={handleExportLOVZ}
              className="btn btn-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* График по регионам */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Пациенты по регионам</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lovzData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_patients" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* График по группам инвалидности */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Распределение по группам инвалидности</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'I группа', value: lovzData.reduce((sum, item) => sum + item.disability_groups.group_1, 0) },
                      { name: 'II группа', value: lovzData.reduce((sum, item) => sum + item.disability_groups.group_2, 0) },
                      { name: 'III группа', value: lovzData.reduce((sum, item) => sum + item.disability_groups.group_3, 0) },
                      { name: 'Ребенок-инвалид', value: lovzData.reduce((sum, item) => sum + item.disability_groups.child_disabled, 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2, 3].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Таблица данных */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">Детальные данные по регионам</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Регион
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Всего пациентов
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Новые
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Активные
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      В архиве
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lovzData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.total_patients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.new_patients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.active_patients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.archived_patients}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Отчет по изготовленным изделиям */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Отчет по изготовленным изделиям</h3>
            </div>
            <button 
              onClick={handleExportManufactured}
              className="btn btn-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* График по месяцам */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Заказы по месяцам</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={manufacturedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_orders" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* График по типам изделий */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Распределение по типам</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Протезы', value: manufacturedData.reduce((sum, item) => sum + item.orders_by_type.prosthesis, 0) },
                      { name: 'Обувь', value: manufacturedData.reduce((sum, item) => sum + item.orders_by_type.shoes, 0) },
                      { name: 'Ортопедические', value: manufacturedData.reduce((sum, item) => sum + item.orders_by_type.orthopedic, 0) },
                      { name: 'Ремонт', value: manufacturedData.reduce((sum, item) => sum + item.orders_by_type.repair, 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2, 3].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Таблица данных */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">Детальные данные по месяцам</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Месяц
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Всего заказов
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Выполнено
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      В работе
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Выручка
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {manufacturedData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.total_orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.completed_orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.in_progress_orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.total_revenue.toLocaleString('ru-RU')} сом
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
