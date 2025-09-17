# Схема связей справочников в системе РУПОИ

## Иерархия географических справочников

```
Области (oblasts)
├── id, name, code
└── Районы (raions)
    ├── id, name, code, oblast_id
    └── Населенные пункты (localities)
        ├── id, name, code, raion_id
        └── МСЭК (msecs)
            └── id, name, locality_id
```

## Связи с основными сущностями

### Карточка пациента (Cart)
```
Cart
├── registration_oblast_id → oblasts.id
├── registration_raion_id → raions.id
├── registration_locality_id → localities.id
├── living_oblast_id → oblasts.id
├── living_raion_id → raions.id
├── living_locality_id → localities.id
├── msec_id → msecs.id
├── lovz_group → disabilities.id
├── document_type → document_types.id
└── disability_cause → disability_causes.id
```

### Заказ (Order)
```
Order
├── diagnosis_type_id → diagnosis_types.id
├── device_type_r_id → device_types.id
├── device_type_l_id → device_types.id
├── amputation_type → amputation_types.id
├── shoe_model_id → shoe_models.id
├── shoe_color_id → shoe_colors.id
├── heel_material_id → heel_materials.id
├── status → order_statuses.id
└── priority_level → priority_levels.id
```

### Материалы заказа (OrderMaterial)
```
OrderMaterial
└── material → materials.id
```

### Склад (Inventory)
```
InventoryItem
├── category → materials.category
└── unit → materials.unit
```

## Группировка справочников по функциональности

### 1. Географические
- `oblasts` - Области
- `raions` - Районы  
- `localities` - Населенные пункты
- `msecs` - МСЭК

### 2. Медицинские
- `disabilities` - Группы инвалидности
- `diagnosis_types` - Типы диагнозов
- `amputation_types` - Типы ампутации
- `disability_categories` - Категории инвалидности
- `disability_causes` - Причины инвалидности

### 3. Технические
- `device_types` - Типы устройств
- `materials` - Материалы
- `works` - Работы
- `device_materials` - Материалы устройств

### 4. Обувные
- `shoe_models` - Модели обуви
- `shoe_colors` - Цвета обуви
- `heel_materials` - Материалы каблука

### 5. Протезные
- `stump_forms` - Формы культи
- `scar_types` - Типы рубцов
- `skin_condition_types` - Состояние кожи
- `bone_dust_types` - Типы костной пыли

### 6. Системные
- `order_statuses` - Статусы заказов
- `priority_levels` - Уровни приоритета
- `document_types` - Типы документов
- `passport_series` - Серии паспортов

### 7. Отчетные
- `age_groups` - Возрастные группы
- `service_types` - Типы услуг

### 8. Печатные
- `print_templates` - Шаблоны печати
- `semi_finished_product_templates` - Шаблоны полуфабрикатов
- `shoe_templates` - Шаблоны обуви

## API методы для работы со справочниками

### Географические
- `getOblasts()` → `oblasts`
- `getRaions(oblastId)` → `raions`
- `getLocalities(raionId)` → `localities`
- `getMSECs(localityId)` → `msecs`

### Медицинские
- `getDisabilities()` → `disabilities`
- `getDiagnosisTypes()` → `diagnosis_types`
- `getAmputationTypes()` → `amputation_types`
- `getDisabilityCategories()` → `disability_categories`
- `getDisabilityCauses()` → `disability_causes`

### Технические
- `getDeviceTypes()` → `device_types`
- `getMaterials()` → `materials`
- `getWorks()` → `works`
- `getDeviceMaterials()` → `device_materials`

### Обувные
- `getShoeModels()` → `shoe_models`
- `getShoeColors()` → `shoe_colors`
- `getHeelMaterials()` → `heel_materials`

### Протезные
- `getStumpForms()` → `stump_forms`
- `getScarTypes()` → `scar_types`
- `getSkinConditionTypes()` → `skin_condition_types`
- `getBoneDustTypes()` → `bone_dust_types`

### Системные
- `getOrderStatuses()` → `order_statuses`
- `getPriorityLevels()` → `priority_levels`
- `getDocumentTypes()` → `document_types`
- `getPassportSeries()` → `passport_series`

### Отчетные
- `getAgeGroups()` → `age_groups`
- `getServiceTypes()` → `service_types`

### Печатные
- `getPrintTemplates()` → `print_templates`
- `getSemiFinishedProductTemplates()` → `semi_finished_product_templates`
- `getShoeTemplates()` → `shoe_templates`

## Компоненты, использующие справочники

### Формы
- `CartForm.tsx` - карточка пациента
- `OrderForm.tsx` - заказ
- `ServiceDirectionsBlock.tsx` - направления услуг
- `RehabilitationDirectionModal.tsx` - реабилитационные направления

### Страницы
- `WarehousePage.tsx` - склад
- `OrdersPage.tsx` - заказы
- `CartsPage.tsx` - картотека
- `SettingsPage.tsx` - настройки

### Менеджеры
- `OrderStatusManager.tsx` - управление статусами
- `PrintTemplatesManager.tsx` - шаблоны печати
- `WorkshopManager.tsx` - мастерские

## Рекомендации по оптимизации

### 1. Кэширование
- Локальное кэширование справочников в браузере
- Инвалидация кэша при изменениях
- Предзагрузка часто используемых справочников

### 2. Ленивая загрузка
- Загрузка справочников только при необходимости
- Виртуализация для больших списков
- Поиск по справочникам без полной загрузки

### 3. Валидация
- Проверка целостности данных
- Каскадные обновления
- Предупреждения при удалении

### 4. Производительность
- Индексация по часто используемым полям
- Пагинация для больших справочников
- Оптимизация запросов

### 5. Удобство использования
- Автодополнение в полях
- Группировка по категориям
- Поиск с подсказками
