export interface RoleDefinition {
  id: number;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export const ROLES: RoleDefinition[] = [
  {
    id: 1,
    code: 'ADMIN',
    name: 'Администратор системы',
    description: 'Полный доступ ко всем функциям системы',
    permissions: ['all'],
    isActive: true
  },
  {
    id: 2,
    code: 'REGISTRAR',
    name: 'Регистратор',
    description: 'Создание и ведение персональных дел пациентов, управление архивом',
    permissions: [
      'carts.read',
      'carts.create', 
      'carts.update',
      'archive.read',
      'archive.restore'
    ],
    isActive: true
  },
  {
    id: 3,
    code: 'MEDICAL',
    name: 'Медицинский работник',
    description: 'Медицинские осмотры, направления, утверждение заказов',
    permissions: [
      'orders.medical.read',
      'orders.medical.approve',
      'medical.directions.create',
      'medical.directions.approve',
      'reports.medical'
    ],
    isActive: true
  },
  {
    id: 4,
    code: 'WORKSHOP',
    name: 'Производственный работник',
    description: 'Изготовление изделий, управление заказами, создание накладных',
    permissions: [
      'orders.workshop.read',
      'orders.workshop.update',
      'orders.workshop.create',
      'overheads.create',
      'overheads.update',
      'reports.production'
    ],
    isActive: true
  },
  {
    id: 5,
    code: 'WAREHOUSE',
    name: 'Складской работник',
    description: 'Управление складом, выдача изделий, учет материалов',
    permissions: [
      'warehouse.read',
      'warehouse.issue',
      'warehouse.manage',
      'overheads.warehouse.read',
      'overheads.warehouse.issue',
      'reports.warehouse'
    ],
    isActive: true
  },
  {
    id: 6,
    code: 'REPORTS',
    name: 'Отчетный работник',
    description: 'Формирование отчетов и аналитики',
    permissions: [
      'reports.read',
      'reports.export',
      'reports.medical',
      'reports.production',
      'reports.warehouse'
    ],
    isActive: true
  }
];

export const getRoleByCode = (code: string): RoleDefinition | undefined => {
  return ROLES.find(role => role.code === code);
};

export const getRoleById = (id: number): RoleDefinition | undefined => {
  return ROLES.find(role => role.id === id);
};

export const getActiveRoles = (): RoleDefinition[] => {
  return ROLES.filter(role => role.isActive);
};

export const hasPermission = (roleCode: string, permission: string): boolean => {
  const role = getRoleByCode(roleCode);
  if (!role) return false;
  
  return role.permissions.includes('all') || role.permissions.includes(permission);
};

export const getRolePermissions = (roleCode: string): string[] => {
  const role = getRoleByCode(roleCode);
  return role ? role.permissions : [];
};

// Матрица доступа к страницам
export const PAGE_ACCESS = {
  '/': ['ADMIN', 'REGISTRAR', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE', 'REPORTS'],
  '/carts': ['ADMIN', 'REGISTRAR', 'MEDICAL'],
  '/orders': ['ADMIN', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE'],
  '/medical': ['ADMIN', 'MEDICAL'],
  '/medicalDepartment/list': ['ADMIN', 'MEDICAL'],
  '/archive/list': ['ADMIN', 'REGISTRAR'],
  '/employees': ['ADMIN'],
  '/overheads': ['ADMIN', 'WORKSHOP', 'WAREHOUSE'],
  '/warehouse': ['ADMIN', 'WAREHOUSE'],
  '/reports': ['ADMIN', 'REPORTS', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE'],
  '/integration': ['ADMIN'],
  '/settings': ['ADMIN']
};

export const canAccessPage = (roleCode: string, pagePath: string): boolean => {
  const allowedRoles = PAGE_ACCESS[pagePath as keyof typeof PAGE_ACCESS];
  return allowedRoles ? allowedRoles.includes(roleCode) : false;
};

// Матрица доступа к функциям
export const FUNCTION_ACCESS = {
  'carts.create': ['ADMIN', 'REGISTRAR'],
  'carts.read': ['ADMIN', 'REGISTRAR', 'MEDICAL'],
  'carts.update': ['ADMIN', 'REGISTRAR'],
  'carts.delete': ['ADMIN'],
  
  'orders.create': ['ADMIN', 'WORKSHOP'],
  'orders.read': ['ADMIN', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE'],
  'orders.update': ['ADMIN', 'WORKSHOP'],
  'orders.approve': ['ADMIN', 'MEDICAL'],
  'orders.delete': ['ADMIN'],
  
  'medical.directions.create': ['ADMIN', 'MEDICAL'],
  'medical.directions.read': ['ADMIN', 'MEDICAL'],
  'medical.directions.approve': ['ADMIN', 'MEDICAL'],
  
  'archive.read': ['ADMIN', 'REGISTRAR'],
  'archive.restore': ['ADMIN', 'REGISTRAR'],
  
  'warehouse.read': ['ADMIN', 'WAREHOUSE'],
  'warehouse.manage': ['ADMIN', 'WAREHOUSE'],
  'warehouse.issue': ['ADMIN', 'WAREHOUSE'],
  
  'overheads.create': ['ADMIN', 'WORKSHOP'],
  'overheads.read': ['ADMIN', 'WORKSHOP', 'WAREHOUSE'],
  'overheads.update': ['ADMIN', 'WORKSHOP'],
  'overheads.issue': ['ADMIN', 'WAREHOUSE'],
  
  'reports.read': ['ADMIN', 'REPORTS', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE'],
  'reports.export': ['ADMIN', 'REPORTS'],
  'reports.medical': ['ADMIN', 'MEDICAL', 'REPORTS'],
  'reports.production': ['ADMIN', 'WORKSHOP', 'REPORTS'],
  'reports.warehouse': ['ADMIN', 'WAREHOUSE', 'REPORTS'],
  
  'employees.manage': ['ADMIN'],
  'settings.manage': ['ADMIN'],
  'integration.manage': ['ADMIN']
};

export const canAccessFunction = (roleCode: string, functionName: string): boolean => {
  const allowedRoles = FUNCTION_ACCESS[functionName as keyof typeof FUNCTION_ACCESS];
  return allowedRoles ? allowedRoles.includes(roleCode) : false;
};
