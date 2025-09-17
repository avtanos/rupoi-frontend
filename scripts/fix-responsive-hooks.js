const fs = require('fs');
const path = require('path');

// Список файлов для исправления
const filesToFix = [
  'src/components/ValidationRulesManager.tsx',
  'src/components/MedicalApprovalManager.tsx',
  'src/components/WorkshopManager.tsx',
  'src/components/PrintTemplatesManager.tsx',
  'src/components/UIFieldBindingManager.tsx'
];

// Функция для исправления файла
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Исправляем неправильную вставку useResponsive в useState
    content = content.replace(
      /const \[([^]]+)\] = useState\(\s*\n\s*const \{ isMobile \} = useResponsive\(\);(.+?)\);/g,
      'const [$1] = useState($2);\n  const { isMobile } = useResponsive();'
    );
    
    // Добавляем импорт useResponsive если его нет
    if (!content.includes('useResponsive')) {
      const importMatch = content.match(/import.*from ['"]@\/components\/ResponsiveTable['"];?/);
      if (importMatch) {
        // Импорт уже есть
      } else {
        // Добавляем импорт
        const reactImportMatch = content.match(/import React[^;]+;/);
        if (reactImportMatch) {
          content = content.replace(
            reactImportMatch[0],
            `${reactImportMatch[0]}\nimport ResponsiveTable, { ResponsiveTableHeader, ResponsiveTableBody, ResponsiveTableRow, ResponsiveTableCell, MobileCardView, useResponsive } from '@/components/ResponsiveTable';`
          );
        }
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Исправляем все файлы
console.log('🚀 Fixing responsive hooks...');
filesToFix.forEach(fixFile);
console.log('✨ All hooks fixed!');
