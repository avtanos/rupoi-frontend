'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useRoleCheck } from '@/components/RoleGuard';
import { 
  Home, 
  Users, 
  FileText, 
  Stethoscope, 
  Package, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  ClipboardList,
  RefreshCw,
  Archive,
  UserCheck,
  Stethoscope as MedicalIcon,
  Database,
  Shield,
  ChevronDown
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { 
    name: 'Главная', 
    href: '/', 
    icon: Home, 
    roles: ['ADMIN', 'REGISTRAR', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE', 'REPORTS'] 
  },
  { 
    name: 'Картотека', 
    href: '/carts', 
    icon: Users, 
    roles: ['ADMIN', 'REGISTRAR', 'MEDICAL'] 
  },
  { 
    name: 'Заказы', 
    href: '/orders', 
    icon: FileText, 
    roles: ['ADMIN', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE'] 
  },
  { 
    name: 'Медицинский отдел', 
    href: '/medical', 
    icon: Stethoscope, 
    roles: ['ADMIN', 'MEDICAL'] 
  },
  { 
    name: 'Медицинские направления', 
    href: '/medicalDepartment/list', 
    icon: MedicalIcon, 
    roles: ['ADMIN', 'MEDICAL'] 
  },
  { 
    name: 'Архив пациентов', 
    href: '/archive/list', 
    icon: Archive, 
    roles: ['ADMIN', 'REGISTRAR'] 
  },
  { 
    name: 'Накладные', 
    href: '/overheads', 
    icon: ClipboardList, 
    roles: ['ADMIN', 'WORKSHOP', 'WAREHOUSE'] 
  },
  { 
    name: 'Склад', 
    href: '/warehouse', 
    icon: Package, 
    roles: ['ADMIN', 'WAREHOUSE'] 
  },
  { 
    name: 'Отчеты', 
    href: '/reports', 
    icon: BarChart3, 
    roles: ['ADMIN', 'REPORTS', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE'] 
  },
  { 
    name: 'Настройки', 
    icon: Settings, 
    roles: ['ADMIN'],
    submenu: [
      { 
        name: 'Общие настройки', 
        href: '/settings', 
        icon: Settings, 
        roles: ['ADMIN'] 
      },
      { 
        name: 'Сотрудники', 
        href: '/employees', 
        icon: UserCheck, 
        roles: ['ADMIN'] 
      },
      { 
        name: 'Интеграция', 
        href: '/integration', 
        icon: RefreshCw, 
        roles: ['ADMIN'] 
      }
    ]
  },
  { 
    name: 'Демонстрации', 
    icon: Database, 
    roles: ['ADMIN', 'REGISTRAR', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE', 'REPORTS'],
    submenu: [
      { 
        name: 'Жизненный цикл', 
        href: '/lifecycle-demo', 
        icon: Database, 
        roles: ['ADMIN', 'REGISTRAR', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE', 'REPORTS'] 
      },
      { 
        name: 'Услуги/заказы', 
        href: '/service-order-demo', 
        icon: Package, 
        roles: ['ADMIN', 'REGISTRAR', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE', 'REPORTS'] 
      },
      { 
        name: 'Накладные', 
        href: '/overhead-demo', 
        icon: FileText, 
        roles: ['ADMIN', 'REGISTRAR', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE', 'REPORTS'] 
      },
      { 
        name: 'Мед. утверждение', 
        href: '/medical-approval-demo', 
        icon: UserCheck, 
        roles: ['ADMIN', 'MEDICAL'] 
      },
      { 
        name: 'Привязки UI', 
        href: '/ui-binding-demo', 
        icon: Settings, 
        roles: ['ADMIN', 'REGISTRAR', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE', 'REPORTS'] 
      },
      { 
        name: 'Правила валидации', 
        href: '/validation-rules-demo', 
        icon: Shield, 
        roles: ['ADMIN', 'REGISTRAR', 'MEDICAL', 'WORKSHOP', 'WAREHOUSE', 'REPORTS'] 
      }
    ]
  },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { hasRole } = useRoleCheck();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuName)) {
        newSet.delete(menuName);
      } else {
        newSet.add(menuName);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some(item => isActive(item.href));
  };

  const renderNavigationItem = (item: any) => {
    const Icon = item.icon;
    const isExpanded = expandedMenus.has(item.name);
    const isItemActive = isActive(item.href);
    const isSubmenuItemActive = item.submenu ? isSubmenuActive(item.submenu) : false;
    
    if (item.submenu) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`group flex items-center justify-between w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              isSubmenuItemActive
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center">
              <Icon className={`mr-3 h-5 w-5 ${isSubmenuItemActive ? 'text-blue-700' : ''}`} />
              {item.name}
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
                isSubmenuItemActive ? 'text-blue-700' : ''
              }`}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.submenu
                .filter((subItem: any) => hasRole(subItem.roles))
                .map((subItem: any) => {
                  const SubIcon = subItem.icon;
                  const isSubItemActive = isActive(subItem.href);
                  return (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isSubItemActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <SubIcon className={`mr-3 h-4 w-4 ${isSubItemActive ? 'text-blue-700' : ''}`} />
                      {subItem.name}
                    </Link>
                  );
                })}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <Link
        key={item.name}
        href={item.href}
        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
          isItemActive
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className={`mr-3 h-5 w-5 ${isItemActive ? 'text-blue-700' : ''}`} />
        {item.name}
      </Link>
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">РУПИО</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation
              .filter(item => hasRole(item.roles))
              .map(renderNavigationItem)}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">РУПИО</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation
              .filter(item => hasRole(item.roles))
              .map(renderNavigationItem)}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-2">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-gray-500">{user?.role?.name}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
