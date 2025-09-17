'use client';

import React from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export default function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResponsiveTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTableHeader({ children, className = '' }: ResponsiveTableHeaderProps) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
}

interface ResponsiveTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTableBody({ children, className = '' }: ResponsiveTableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
}

interface ResponsiveTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ResponsiveTableRow({ children, className = '', onClick }: ResponsiveTableRowProps) {
  return (
    <tr 
      className={`${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  isHeader?: boolean;
}

export function ResponsiveTableCell({ 
  children, 
  className = '', 
  colSpan, 
  isHeader = false 
}: ResponsiveTableCellProps) {
  const baseClasses = "px-3 py-4 text-sm whitespace-nowrap";
  const headerClasses = "font-medium text-gray-500 uppercase tracking-wider";
  const cellClasses = "text-gray-900";
  
  const Tag = isHeader ? 'th' : 'td';
  
  return (
    <Tag 
      className={`${baseClasses} ${isHeader ? headerClasses : cellClasses} ${className}`}
      colSpan={colSpan}
    >
      {children}
    </Tag>
  );
}

// Компонент для мобильного отображения таблицы в виде карточек
interface MobileCardViewProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
    className?: string;
  }>;
  className?: string;
}

export function MobileCardView({ data, columns, className = '' }: MobileCardViewProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {data.map((item, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-500 min-w-0 flex-shrink-0 mr-2">
                  {column.label}:
                </span>
                <div className={`text-sm text-gray-900 text-right min-w-0 flex-1 ${column.className || ''}`}>
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Хук для определения размера экрана
export function useResponsive() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
}
