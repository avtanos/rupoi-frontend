'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';
import RoleGuard from '@/components/RoleGuard';
import { User } from '@/types';
import { apiClient } from '@/lib/api';
import { UserCheck, Search, Filter, Plus, Eye, Edit, Trash2, UserX, UserPlus } from 'lucide-react';

interface Employee extends User {
  department: string;
  position: string;
  hire_date: string;
  salary?: number;
  phone?: string;
  email?: string;
  is_active: boolean;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadEmployees();
  }, [searchTerm, departmentFilter, statusFilter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (departmentFilter !== 'all') params.department = departmentFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await apiClient.getEmployees();
      setEmployees(response);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleSaveEmployee = async (employeeData: Employee) => {
    try {
      if (editingEmployee) {
        // Обновление существующего сотрудника
        const updatedEmployee = await apiClient.updateEmployee(editingEmployee.id, employeeData);
        setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
      } else {
        // Создание нового сотрудника
        const newEmployee = await apiClient.createEmployee(employeeData);
        setEmployees(prev => [newEmployee, ...prev]);
      }
      setShowForm(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleToggleStatus = async (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    try {
      const updatedEmployee = await apiClient.updateEmployee(employeeId, { 
        is_active: !employee.is_active 
      });
      setEmployees(prev => prev.map(emp => emp.id === employeeId ? updatedEmployee : emp));
    } catch (error) {
      console.error('Failed to toggle employee status:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      try {
        await apiClient.deleteEmployee(employeeId);
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  const handleSelectEmployee = (employeeId: number) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && employee.is_active) ||
      (statusFilter === 'inactive' && !employee.is_active);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getDepartments = () => {
    const departments = [...new Set(employees.map(emp => emp.department))];
    return departments;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 'badge badge-success' : 'badge badge-error';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активен' : 'Неактивен';
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <Layout>
        <div className="space-y-6">
          {/* Заголовок */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Сотрудники</h1>
              <p className="text-gray-600">Управление сотрудниками системы</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Фильтры
              </button>
              <button
                onClick={handleCreateEmployee}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Добавить сотрудника
              </button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Всего сотрудников</p>
                  <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Активные</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {employees.filter(emp => emp.is_active).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Неактивные</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {employees.filter(emp => !emp.is_active).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Отделов</p>
                  <p className="text-2xl font-semibold text-gray-900">{getDepartments().length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Фильтры */}
          {showFilters && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Фильтры</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Поиск
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Поиск по ФИО, логину..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Отдел
                  </label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все отделы</option>
                    {getDepartments().map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Статус
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="inactive">Неактивные</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setDepartmentFilter('all');
                      setStatusFilter('all');
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Таблица сотрудников */}
          <div className="card p-6">
            {isMobile ? (
            // Мобильное отображение в виде карточек
            <MobileCardView
              data={data}
              columns={columns}
            />
          ) : (
            // Десктопное отображение в виде таблицы
            <ResponsiveTable>
                <ResponsiveTableHeader>
                  <ResponsiveTableRow>
                    <ResponsiveTableCell isHeader >
                      <input
                        type="checkbox"
                        checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      ФИО
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Логин
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Роль
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Отдел
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Статус
                    </ResponsiveTableCell>
                    <ResponsiveTableCell isHeader >
                      Действия
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                </ResponsiveTableHeader>
                <ResponsiveTableBody>
                  {loading ? (
                    <ResponsiveTableRow>
                      <ResponsiveTableCell colSpan={7} className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ) : filteredEmployees.length === 0 ? (
                    <ResponsiveTableRow>
                      <ResponsiveTableCell colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        {employees.length === 0 ? 'Сотрудники не найдены' : 'Нет сотрудников, соответствующих фильтрам'}
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <ResponsiveTableRow key={employee.id} className={`hover:bg-gray-50 ${selectedEmployees.includes(employee.id) ? 'bg-blue-50' : ''}`}>
                        <ResponsiveTableCell >
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleSelectEmployee(employee.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="text-gray-500">
                          {employee.username}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="text-gray-500">
                          {employee.role?.name || 'Не указана'}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell className="text-gray-500">
                          {employee.department || 'Не указан'}
                        </ResponsiveTableCell>
                        <ResponsiveTableCell >
                          <span className={getStatusBadge(employee.is_active)}>
                            {getStatusText(employee.is_active)}
                          </span>
                        </ResponsiveTableCell>
                        <ResponsiveTableCell >
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditEmployee(employee)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Редактировать"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(employee.id)}
                              className={employee.is_active ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"}
                              title={employee.is_active ? "Деактивировать" : "Активировать"}
                            >
                              {employee.is_active ? <UserX className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Удалить"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </ResponsiveTableCell>
                      </ResponsiveTableRow>
                    ))
                  )}
                </ResponsiveTableBody>
              </ResponsiveTable>
          )}
          </div>
        </div>
      </Layout>
    </RoleGuard>
  );
}
