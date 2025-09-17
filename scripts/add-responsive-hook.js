const fs = require('fs');
const path = require('path');

// Список файлов для добавления хука useResponsive
const filesToUpdate = [
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

// Функция для добавления хука useResponsive
function addResponsiveHook(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Проверяем, есть ли уже хук useResponsive
    if (content.includes('useResponsive()')) {
      console.log(`⏭️  Skipping ${filePath} - already has useResponsive hook`);
      return;
    }
    
    // Ищем место для добавления хука (после последнего useState)
    const useStateRegex = /const \[[^]]+\] = useState\([^)]+\);/g;
    const matches = [...content.matchAll(useStateRegex)];
    
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const insertIndex = lastMatch.index + lastMatch[0].length;
      
      // Добавляем хук useResponsive
      const hookToAdd = '\n  const { isMobile } = useResponsive();';
      content = content.slice(0, insertIndex) + hookToAdd + content.slice(insertIndex);
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Added useResponsive hook to ${filePath}`);
    } else {
      console.log(`⚠️  No useState found in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Обновляем все файлы
console.log('🚀 Adding useResponsive hooks...');
filesToUpdate.forEach(addResponsiveHook);
console.log('✨ All hooks added!');
