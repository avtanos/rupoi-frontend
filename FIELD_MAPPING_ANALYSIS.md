# Анализ меппинга полей с справочниками БД и настройками проекта

## Обзор справочников в системе

### 1. Географические справочники

#### 1.1 Области (oblasts)
- **Файл**: `src/data/dictionaries.json` → `oblasts`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Cart.registration_oblast_id` → связь с областями регистрации
  - `Cart.living_oblast_id` → связь с областями проживания
  - **Компоненты**: `CartForm.tsx` (селекты областей)
  - **API методы**: `getOblasts()`

#### 1.2 Районы (raions)
- **Файл**: `src/data/dictionaries.json` → `raions`
- **Поля**: `id`, `name`, `code`, `oblast` (FK)
- **Использование в проекте**:
  - `Cart.registration_raion_id` → связь с районами регистрации
  - `Cart.living_raion_id` → связь с районами проживания
  - **Компоненты**: `CartForm.tsx` (каскадные селекты)
  - **API методы**: `getRaions(oblastId)`

#### 1.3 Населенные пункты (localities)
- **Файл**: `src/data/dictionaries.json` → `localities`
- **Поля**: `id`, `name`, `code`, `raion` (FK)
- **Использование в проекте**:
  - `Cart.registration_locality_id` → связь с населенными пунктами регистрации
  - `Cart.living_locality_id` → связь с населенными пунктами проживания
  - **Компоненты**: `CartForm.tsx` (каскадные селекты)
  - **API методы**: `getLocalities(raionId)`

### 2. Медицинские справочники

#### 2.1 МСЭК (msecs)
- **Файл**: `src/data/dictionaries.json` → `msecs`
- **Поля**: `id`, `name`, `locality` (FK)
- **Использование в проекте**:
  - `Cart.msec_id` → связь с МСЭК
  - `Cart.reference_msec` → текстовая ссылка на МСЭК
  - **Компоненты**: `CartForm.tsx`
  - **API методы**: `getMSECs(localityId)`

#### 2.2 Группы инвалидности (disabilities)
- **Файл**: `src/data/dictionaries.json` → `disabilities`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Cart.lovz_group` → группа ЛОВЗ (1, 2, 3)
  - **Компоненты**: `CartForm.tsx` (селект групп)
  - **API методы**: `getDisabilities()`

#### 2.3 Типы ампутации (amputation_types)
- **Файл**: `src/data/dictionaries.json` → `amputation_types`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Order.amputation_type` → тип ампутации в заказе
  - **Компоненты**: `OrderForm.tsx`
  - **API методы**: `getAmputationTypes()`

#### 2.4 Типы диагнозов (diagnosis_types)
- **Файл**: `src/data/dictionaries.json` → `diagnosis_types`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Order.diagnosis_type_id` → связь с типом диагноза
  - **Компоненты**: `OrderForm.tsx`
  - **API методы**: `getDiagnosisTypes()`

### 3. Технические справочники

#### 3.1 Типы устройств (device_types)
- **Файл**: `src/data/dictionaries.json` → `device_types`
- **Поля**: `id`, `name`, `code`, `order_type`
- **Использование в проекте**:
  - `Order.device_type_r_id` → тип устройства правой стороны
  - `Order.device_type_l_id` → тип устройства левой стороны
  - **Компоненты**: `OrderForm.tsx`
  - **API методы**: `getDeviceTypes()`

#### 3.2 Материалы (materials)
- **Файл**: `src/data/dictionaries.json` → `materials`
- **Поля**: `id`, `name`, `code`, `unit`, `price`, `category`, `inventory_number`
- **Использование в проекте**:
  - `OrderMaterial.material` → связь с материалами
  - `InventoryItem` → складские позиции
  - **Компоненты**: `OrderForm.tsx`, `WarehousePage.tsx`
  - **API методы**: `getMaterials()`

#### 3.3 Работы (works)
- **Файл**: `src/data/dictionaries.json` → `works`
- **Поля**: `id`, `name`, `code`, `price`
- **Использование в проекте**:
  - `OrderWork.work` → связь с работами
  - **Компоненты**: `OrderForm.tsx`
  - **API методы**: `getWorks()`

### 4. Справочники для обуви

#### 4.1 Модели обуви (shoe_models)
- **Файл**: `src/data/dictionaries.json` → `shoe_models`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Order.shoe_model_id` → модель обуви
  - **Компоненты**: `OrderForm.tsx`
  - **API методы**: `getShoeModels()`

#### 4.2 Цвета обуви (shoe_colors)
- **Файл**: `src/data/dictionaries.json` → `shoe_colors`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Order.shoe_color_id` → цвет обуви
  - **Компоненты**: `OrderForm.tsx`
  - **API методы**: `getShoeColors()`

#### 4.3 Материалы каблука (heel_materials)
- **Файл**: `src/data/dictionaries.json` → `heel_materials`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Order.heel_material_id` → материал каблука
  - **Компоненты**: `OrderForm.tsx`
  - **API методы**: `getHeelMaterials()`

### 5. Справочники для протезирования

#### 5.1 Формы культи (stump_forms)
- **Файл**: `src/data/dictionaries.json` → `stump_forms`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - Медицинские измерения
  - **API методы**: `getStumpForms()`

#### 5.2 Типы рубцов (scar_types)
- **Файл**: `src/data/dictionaries.json` → `scar_types`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - Медицинские измерения
  - **API методы**: `getScarTypes()`

#### 5.3 Состояние кожи (skin_condition_types)
- **Файл**: `src/data/dictionaries.json` → `skin_condition_types`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - Медицинские измерения
  - **API методы**: `getSkinConditionTypes()`

#### 5.4 Типы костной пыли (bone_dust_types)
- **Файл**: `src/data/dictionaries.json` → `bone_dust_types`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - Медицинские измерения
  - **API методы**: `getBoneDustTypes()`

### 6. Системные справочники

#### 6.1 Статусы заказов (order_statuses)
- **Файл**: `src/constants/order-statuses.ts` + `src/data/dictionaries.json` → `order_statuses`
- **Поля**: `id`, `code`, `name`, `description`, `color`, `is_final`, `can_transition_to`
- **Использование в проекте**:
  - `Order.status` → текущий статус заказа
  - `OrderStatusHistory` → история изменений статусов
  - **Компоненты**: `OrderStatusManager.tsx`, `OrdersPage.tsx`
  - **API методы**: `updateOrderStatus()`

#### 6.2 Уровни приоритета (priority_levels)
- **Файл**: `src/data/dictionaries.json` → `priority_levels`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Order.priority_level` → приоритет заказа
  - **API методы**: `getPriorityLevels()`

#### 6.3 Типы документов (document_types)
- **Файл**: `src/data/dictionaries.json` → `document_types`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Cart.document_type` → тип документа пациента
  - **Компоненты**: `CartForm.tsx`
  - **API методы**: `getDocumentTypes()`

#### 6.4 Серии паспортов (passport_series)
- **Файл**: `src/data/dictionaries.json` → `passport_series`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Cart.document_series` → серия документа
  - **API методы**: `getPassportSeries()`

### 7. Справочники для отчетности

#### 7.1 Возрастные группы (age_groups)
- **Файл**: `src/data/dictionaries.json` → `age_groups`
- **Поля**: `id`, `name`, `min_age`, `max_age`
- **Использование в проекте**:
  - Отчеты по возрастным группам
  - **API методы**: `getAgeGroups()`

#### 7.2 Категории инвалидности (disability_categories)
- **Файл**: `src/data/dictionaries.json` → `disability_categories`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - Классификация пациентов
  - **API методы**: `getDisabilityCategories()`

#### 7.3 Причины инвалидности (disability_causes)
- **Файл**: `src/data/dictionaries.json` → `disability_causes`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `Cart.disability_cause` → причина инвалидности
  - **Компоненты**: `CartForm.tsx`
  - **API методы**: `getDisabilityCauses()`

#### 7.4 Типы услуг (service_types)
- **Файл**: `src/data/dictionaries.json` → `service_types`
- **Поля**: `id`, `name`, `code`
- **Использование в проекте**:
  - `ServiceDirection.service_type` → тип медицинской услуги
  - **Компоненты**: `ServiceDirectionsBlock.tsx`
  - **API методы**: `getServiceTypes()`

### 8. Справочники для печати

#### 8.1 Шаблоны печати (print_templates)
- **Файл**: `src/data/dictionaries.json` → `print_templates`
- **Поля**: `id`, `name`, `category`, `template_content`
- **Использование в проекте**:
  - Печать документов
  - **Компоненты**: `PrintTemplatesManager.tsx`
  - **API методы**: `getPrintTemplates()`

#### 8.2 Шаблоны полуфабрикатов (semi_finished_product_templates)
- **Файл**: `src/data/dictionaries.json` → `semi_finished_product_templates`
- **Поля**: `id`, `name`, `template_content`
- **Использование в проекте**:
  - Производственные процессы
  - **API методы**: `getSemiFinishedProductTemplates()`

#### 8.3 Шаблоны обуви (shoe_templates)
- **Файл**: `src/data/dictionaries.json` → `shoe_templates`
- **Поля**: `id`, `name`, `template_content`
- **Использование в проекте**:
  - Производство обуви
  - **API методы**: `getShoeTemplates()`

## Меппинг полей форм с справочниками

### Карточка пациента (Cart)

| Поле формы | Тип поля | Справочник | API метод | Компонент |
|------------|----------|------------|-----------|-----------|
| `registration_oblast_id` | Select | `oblasts` | `getOblasts()` | `CartForm.tsx` |
| `registration_raion_id` | Select | `raions` | `getRaions(oblastId)` | `CartForm.tsx` |
| `registration_locality_id` | Select | `localities` | `getLocalities(raionId)` | `CartForm.tsx` |
| `living_oblast_id` | Select | `oblasts` | `getOblasts()` | `CartForm.tsx` |
| `living_raion_id` | Select | `raions` | `getRaions(oblastId)` | `CartForm.tsx` |
| `living_locality_id` | Select | `localities` | `getLocalities(raionId)` | `CartForm.tsx` |
| `msec_id` | Select | `msecs` | `getMSECs(localityId)` | `CartForm.tsx` |
| `lovz_group` | Select | `disabilities` | `getDisabilities()` | `CartForm.tsx` |
| `document_type` | Select | `document_types` | `getDocumentTypes()` | `CartForm.tsx` |
| `disability_cause` | Select | `disability_causes` | `getDisabilityCauses()` | `CartForm.tsx` |

### Заказ (Order)

| Поле формы | Тип поля | Справочник | API метод | Компонент |
|------------|----------|------------|-----------|-----------|
| `order_type` | Select | Статичные значения | - | `OrderForm.tsx` |
| `diagnosis_type_id` | Select | `diagnosis_types` | `getDiagnosisTypes()` | `OrderForm.tsx` |
| `device_type_r_id` | Select | `device_types` | `getDeviceTypes()` | `OrderForm.tsx` |
| `device_type_l_id` | Select | `device_types` | `getDeviceTypes()` | `OrderForm.tsx` |
| `amputation_type` | Select | `amputation_types` | `getAmputationTypes()` | `OrderForm.tsx` |
| `shoe_model_id` | Select | `shoe_models` | `getShoeModels()` | `OrderForm.tsx` |
| `shoe_color_id` | Select | `shoe_colors` | `getShoeColors()` | `OrderForm.tsx` |
| `heel_material_id` | Select | `heel_materials` | `getHeelMaterials()` | `OrderForm.tsx` |
| `status` | Select | `order_statuses` | `updateOrderStatus()` | `OrderStatusManager.tsx` |

### Материалы заказа (OrderMaterial)

| Поле формы | Тип поля | Справочник | API метод | Компонент |
|------------|----------|------------|-----------|-----------|
| `material` | Select | `materials` | `getMaterials()` | `OrderForm.tsx` |

### Склад (Inventory)

| Поле формы | Тип поля | Справочник | API метод | Компонент |
|------------|----------|------------|-----------|-----------|
| `category` | Select | `materials.category` | `getMaterials()` | `WarehousePage.tsx` |
| `unit` | Select | `materials.unit` | `getMaterials()` | `WarehousePage.tsx` |

## Рекомендации по улучшению

### 1. Централизация справочников
- Создать единый сервис `DictionaryService` для управления всеми справочниками
- Добавить кэширование справочников на клиенте
- Реализовать ленивую загрузку для больших справочников

### 2. Валидация связей
- Добавить проверку целостности данных при изменении справочников
- Реализовать каскадное обновление связанных записей
- Добавить предупреждения при удалении используемых записей

### 3. Управление справочниками
- Создать админ-панель для редактирования справочников
- Добавить импорт/экспорт справочников
- Реализовать версионирование изменений

### 4. Производительность
- Оптимизировать загрузку справочников
- Добавить пагинацию для больших справочников
- Реализовать поиск по справочникам

### 5. Типизация
- Создать строгие TypeScript типы для всех справочников
- Добавить валидацию типов на уровне API
- Реализовать автодополнение для полей справочников

## Заключение

Система справочников в проекте хорошо структурирована и покрывает все основные области функциональности. Основные справочники связаны с соответствующими полями форм через API методы и используются в соответствующих компонентах. Рекомендуется реализовать предложенные улучшения для повышения производительности и удобства использования системы.
