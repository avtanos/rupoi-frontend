'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { apiClient } from '@/lib/api';
import { DashboardStats } from '@/types';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await apiClient.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Всего пациентов',
      value: stats?.total_patients || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Всего заказов',
      value: stats?.total_orders || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'В работе',
      value: stats?.active_orders || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Готово к выдаче',
      value: stats?.ready_orders || 0,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  // Mock data for charts
  const ordersByMonth = [
    { month: 'Янв', orders: 45 },
    { month: 'Фев', orders: 52 },
    { month: 'Мар', orders: 38 },
    { month: 'Апр', orders: 61 },
    { month: 'Май', orders: 47 },
    { month: 'Июн', orders: 55 },
  ];

  const ordersByType = [
    { name: 'Протезы', value: 45, count: 180 },
    { name: 'Обувь', value: 30, count: 120 },
    { name: 'Ортопедические', value: 20, count: 80 },
    { name: 'Ремонт', value: 5, count: 20 },
  ];

  const statusDistribution = [
    { status: 'Новые', count: 25 },
    { status: 'В производстве', count: 40 },
    { status: 'На примерке', count: 15 },
    { status: 'Готово', count: 20 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Главная панель</h1>
        <p className="mt-1 text-sm text-gray-500">
          Обзор системы управления протезированием
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="card p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orders by Month */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Заказы по месяцам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Type */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Заказы по типам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => `${name}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ordersByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Распределение по статусам</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={statusDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Последние заказы</h3>
        <ResponsiveTable>
          <ResponsiveTableHeader>
            <ResponsiveTableRow>
              <ResponsiveTableCell isHeader>
                № заказа
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader>
                Пациент
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader>
                Тип
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader>
                Статус
              </ResponsiveTableCell>
              <ResponsiveTableCell isHeader>
                Дата
              </ResponsiveTableCell>
            </ResponsiveTableRow>
          </ResponsiveTableHeader>
          <ResponsiveTableBody>
            {stats?.recent_orders?.map((order) => (
              <ResponsiveTableRow key={order.id}>
                <ResponsiveTableCell className="font-medium text-gray-900">
                  {order.number}
                </ResponsiveTableCell>
                <ResponsiveTableCell className="text-gray-500">
                  {order.cart?.first_name || ''} {order.cart?.name || ''}
                </ResponsiveTableCell>
                <ResponsiveTableCell className="text-gray-500">
                  {order.order_type}
                </ResponsiveTableCell>
                <ResponsiveTableCell>
                  <span className="badge badge-info">
                    {order.status === 1 ? 'Новый' : 
                     order.status === 2 ? 'В работе' :
                     order.status === 3 ? 'Готов' : 'Выдан'}
                  </span>
                </ResponsiveTableCell>
                <ResponsiveTableCell className="text-gray-500">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                </ResponsiveTableCell>
              </ResponsiveTableRow>
            )) || (
              <ResponsiveTableRow>
                <ResponsiveTableCell colSpan={5} className="text-center text-gray-500">
                  Нет данных
                </ResponsiveTableCell>
              </ResponsiveTableRow>
            )}
          </ResponsiveTableBody>
        </ResponsiveTable>
      </div>
    </div>
  );
}
