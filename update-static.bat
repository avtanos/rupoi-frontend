@echo off
REM Скрипт для обновления статических файлов на GitHub Pages

echo Сборка Next.js проекта...
npm run build

echo Копирование статических файлов в корень...
xcopy /E /Y out\* .

echo Добавление изменений в Git...
git add .

echo Коммит изменений...
git commit -m "update: refresh static files for GitHub Pages"

echo Отправка изменений в GitHub...
git push

echo Статические файлы обновлены!
pause
