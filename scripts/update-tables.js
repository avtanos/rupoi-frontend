const fs = require('fs');
const path = require('path');

// Список файлов с таблицами для обновления
const filesToUpdate = [
  'src/app/carts/page.tsx',
  'src/app/warehouse/page.tsx',
  'src/app/overheads/page.tsx',
  'src/app/employees/page.tsx',
  'src/app/archive/list/page.tsx',
  'src/app/settings/page.tsx',
  'src/components/Dashboard.tsx',
  'src/components/SemiFinishedProductsBlock.tsx',
  'src/components/UIFieldBindingManager.tsx',
  'src/components/PrintTemplatesManager.tsx',
  'src/components/WorkshopManager.tsx',
  'src/components/RolesManager.tsx',
  'src/components/MedicalApprovalManager.tsx',
  'src/components/ValidationRulesManager.tsx'
];

// Функция для обновления файла
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Добавляем импорт ResponsiveTable если его нет
    if (!content.includes('ResponsiveTable')) {
      const importMatch = content.match(/import.*from ['"]@\/components\/Layout['"];?/);
      if (importMatch) {
        content = content.replace(
          importMatch[0],
          `${importMatch[0]}\nimport ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';`
        );
      }
    }
    
    // Добавляем хук useResponsive если его нет
    if (!content.includes('useResponsive')) {
      const useStateMatch = content.match(/const \[.*\] = useState\(/);
      if (useStateMatch) {
        content = content.replace(
          useStateMatch[0],
          `${useStateMatch[0]}\n  const { isMobile } = useResponsive();`
        );
      }
    }
    
    // Заменяем обычные таблицы на ResponsiveTable
    content = content.replace(
      /<div className="overflow-x-auto">\s*<table className="min-w-full divide-y divide-gray-200">/g,
      '{isMobile ? (\n            // Мобильное отображение в виде карточек\n            <MobileCardView\n              data={data}\n              columns={columns}\n            />\n          ) : (\n            // Десктопное отображение в виде таблицы\n            <ResponsiveTable>'
    );
    
    content = content.replace(
      /<\/table>\s*<\/div>/g,
      '</ResponsiveTable>\n          )}'
    );
    
    // Заменяем thead на ResponsiveTableHeader
    content = content.replace(
      /<thead className="bg-gray-50">/g,
      '<ResponsiveTableHeader>'
    );
    content = content.replace(
      /<\/thead>/g,
      '</ResponsiveTableHeader>'
    );
    
    // Заменяем tbody на ResponsiveTableBody
    content = content.replace(
      /<tbody className="bg-white divide-y divide-gray-200">/g,
      '<ResponsiveTableBody>'
    );
    content = content.replace(
      /<\/tbody>/g,
      '</ResponsiveTableBody>'
    );
    
    // Заменяем tr на ResponsiveTableRow
    content = content.replace(
      /<tr([^>]*)>/g,
      '<ResponsiveTableRow$1>'
    );
    content = content.replace(
      /<\/tr>/g,
      '</ResponsiveTableRow>'
    );
    
    // Заменяем th на ResponsiveTableCell с isHeader
    content = content.replace(
      /<th([^>]*)>/g,
      '<ResponsiveTableCell isHeader$1>'
    );
    content = content.replace(
      /<\/th>/g,
      '</ResponsiveTableCell>'
    );
    
    // Заменяем td на ResponsiveTableCell
    content = content.replace(
      /<td([^>]*)>/g,
      '<ResponsiveTableCell$1>'
    );
    content = content.replace(
      /<\/td>/g,
      '</ResponsiveTableCell>'
    );
    
    // Убираем лишние классы
    content = content.replace(
      /className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"/g,
      ''
    );
    content = content.replace(
      /className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"/g,
      'className="font-medium text-gray-900"'
    );
    content = content.replace(
      /className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"/g,
      ''
    );
    content = content.replace(
      /className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"/g,
      'className="text-gray-500"'
    );
    content = content.replace(
      /className="px-6 py-4 whitespace-nowrap"/g,
      ''
    );
    content = content.replace(
      /className="px-6 py-4 whitespace-nowrap text-sm font-medium"/g,
      ''
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Обновляем все файлы
console.log('🚀 Starting table updates...');
filesToUpdate.forEach(updateFile);
console.log('✨ All tables updated!');
