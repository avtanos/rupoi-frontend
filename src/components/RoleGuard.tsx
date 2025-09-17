'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { User } from '@/types';
import { canAccessPage, canAccessFunction } from '@/constants/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = <div className="text-center py-8 text-gray-500">У вас нет прав для доступа к этому разделу</div>,
  requireAll = false 
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-center py-8 text-gray-500">Необходима авторизация</div>;
  }

  const userRole = user.role?.code || '';
  
  const hasPermission = requireAll 
    ? allowedRoles.every(role => userRole === role)
    : allowedRoles.includes(userRole);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Хук для проверки ролей
export function useRoleCheck() {
  const { user } = useAuth();

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    
    const userRole = user.role?.code || '';
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    return roleArray.includes(userRole);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return hasRole(roles);
  };

  const hasAllRoles = (roles: string[]): boolean => {
    if (!user) return false;
    
    const userRole = user.role?.code || '';
    return roles.every(role => userRole === role);
  };

  const canAccess = (permission: string): boolean => {
    if (!user) return false;
    
    const userRole = user.role?.code || '';
    return canAccessFunction(userRole, permission);
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess,
    isAdmin: hasRole('ADMIN'),
    isRegistrar: hasRole('REGISTRAR'),
    isMedical: hasRole('MEDICAL'),
    isWorkshop: hasRole('WORKSHOP'),
    isWarehouse: hasRole('WAREHOUSE'),
    isReports: hasRole('REPORTS')
  };
}
