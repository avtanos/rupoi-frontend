# Примеры использования справочников в коде

## 1. Географические справочники

### CartForm.tsx - Каскадные селекты
```typescript
// Загрузка областей при инициализации
const loadDictionaries = async () => {
  const [oblasts, disabilities] = await Promise.all([
    apiClient.getOblasts(),
    apiClient.getDisabilities()
  ]);
  setOblasts(oblasts);
  setDisabilities(disabilities);
};

// Загрузка районов при выборе области
const handleOblastChange = async (oblastId: number, field: 'registration' | 'living') => {
  const raions = await apiClient.getRaions(oblastId);
  if (field === 'registration') {
    setRegistrationRaions(raions);
    setRegistrationLocalities([]);
    setMsecs([]);
  } else {
    setLivingRaions(raions);
    setLivingLocalities([]);
  }
};

// Загрузка населенных пунктов при выборе района
const handleRaionChange = async (raionId: number, field: 'registration' | 'living') => {
  const localities = await apiClient.getLocalities(raionId);
  if (field === 'registration') {
    setRegistrationLocalities(localities);
    setMsecs([]);
  } else {
    setLivingLocalities(localities);
  }
};

// Загрузка МСЭК при выборе населенного пункта
const handleLocalityChange = async (localityId: number) => {
  const msecs = await apiClient.getMSECs(localityId);
  setMsecs(msecs);
};
```

## 2. Медицинские справочники

### OrderForm.tsx - Типы диагнозов и устройств
```typescript
const loadDictionaries = async () => {
  const [diagnosisTypes, deviceTypes, materials] = await Promise.all([
    apiClient.getDiagnosisTypes(),
    apiClient.getDeviceTypes(),
    apiClient.getMaterials()
  ]);
  setDiagnosisTypes(diagnosisTypes);
  setDeviceTypes(deviceTypes);
  setMaterials(materials);
};

// Фильтрация типов устройств по типу заказа
const filteredDeviceTypes = deviceTypes.filter(type => 
  type.order_type === (formData.order_type === 'prosthesis' ? 1 : 0)
);
```

## 3. Статусы заказов

### OrderStatusManager.tsx - Управление статусами
```typescript
import { ORDER_STATUSES, getOrderStatusById, getAvailableTransitions } from '@/constants/order-statuses';

const currentStatus = getOrderStatusById(order.status);
const availableTransitions = getAvailableTransitions(order.status);

const handleStatusChange = async (newStatus: OrderStatus) => {
  const updatedOrder = await apiClient.updateOrderStatus(order.id, newStatus.id, {
    comment: comment.trim() || undefined,
    changed_by: currentUser.id
  });
  onStatusChange(order.id, newStatus, comment.trim() || undefined);
};
```

## 4. Материалы и склад

### WarehousePage.tsx - Отображение материалов
```typescript
const loadInventory = async () => {
  const materials = await apiClient.getMaterials();
  const inventory = await apiClient.getInventory();
  
  // Связывание материалов с инвентарем
  const enrichedInventory = inventory.map(item => {
    const material = materials.find(m => m.id === item.material_id);
    return {
      ...item,
      name: material?.name || item.name,
      code: material?.code || '',
      inventory_number: material?.inventory_number || '',
      category: material?.category || '',
      unit: material?.unit || '',
      price: material?.price || 0
    };
  });
  
  setInventory(enrichedInventory);
};
```

### OrderForm.tsx - Выбор материалов
```typescript
const handleAddMaterial = () => {
  if (newMaterial.material && newMaterial.quantity > 0) {
    const material = materials.find(m => m.id === newMaterial.material.id);
    if (material) {
      const orderMaterial: OrderMaterial = {
        id: Date.now(),
        order_id: editingOrder?.id || 0,
        material: material,
        quantity: newMaterial.quantity,
        unit_price: material.price,
        total_price: material.price * newMaterial.quantity
      };
      
      setOrderMaterials(prev => [...prev, orderMaterial]);
      setNewMaterial({
        material: materials[0] || {} as Material,
        quantity: 1
      });
    }
  }
};
```

## 5. Валидация с использованием справочников

### validation.ts - Валидация полей
```typescript
export const FORM_VALIDATION_RULES = {
  cart: {
    registration_oblast_id: {
      required: true,
      custom: (value: number) => {
        const oblast = obasts.find(o => o.id === value);
        return oblast ? null : 'Выберите область регистрации';
      }
    },
    msec_id: {
      custom: (value: number) => {
        if (!value) return null; // Необязательное поле
        const msec = msecs.find(m => m.id === value);
        return msec ? null : 'Выберите МСЭК из списка';
      }
    }
  },
  
  order: {
    diagnosis_type_id: {
      required: true,
      custom: (value: number) => {
        const diagnosis = diagnosisTypes.find(d => d.id === value);
        return diagnosis ? null : 'Выберите тип диагноза';
      }
    },
    device_type_r_id: {
      required: true,
      custom: (value: number) => {
        const deviceType = deviceTypes.find(d => d.id === value);
        return deviceType ? null : 'Выберите тип устройства';
      }
    }
  }
};
```

## 6. API методы для справочников

### data-service.ts - Реализация методов
```typescript
class DataService {
  // Географические справочники
  async getOblasts(): Promise<Oblast[]> {
    await this.delay(200);
    return this.dictionaries.oblasts;
  }

  async getRaions(oblastId: number): Promise<Raion[]> {
    await this.delay(200);
    return this.dictionaries.raions.filter(raion => raion.oblast === oblastId);
  }

  async getLocalities(raionId: number): Promise<Locality[]> {
    await this.delay(200);
    return this.dictionaries.localities.filter(locality => locality.raion === raionId);
  }

  async getMSECs(localityId: number): Promise<MSEC[]> {
    await this.delay(200);
    return this.dictionaries.msecs.filter(msec => msec.locality === localityId);
  }

  // Медицинские справочники
  async getDisabilities(): Promise<Disability[]> {
    await this.delay(200);
    return this.dictionaries.disabilities;
  }

  async getDiagnosisTypes(): Promise<DiagnosisType[]> {
    await this.delay(200);
    return this.dictionaries.diagnosis_types;
  }

  async getAmputationTypes(): Promise<AmputationType[]> {
    await this.delay(200);
    return this.dictionaries.amputation_types;
  }

  // Технические справочники
  async getDeviceTypes(): Promise<DeviceType[]> {
    await this.delay(200);
    return this.dictionaries.device_types;
  }

  async getMaterials(): Promise<Material[]> {
    await this.delay(200);
    return this.dictionaries.materials;
  }

  async getWorks(): Promise<Work[]> {
    await this.delay(200);
    return this.dictionaries.works;
  }

  // Обувные справочники
  async getShoeModels(): Promise<ShoeModel[]> {
    await this.delay(200);
    return this.dictionaries.shoe_models;
  }

  async getShoeColors(): Promise<ShoeColor[]> {
    await this.delay(200);
    return this.dictionaries.shoe_colors;
  }

  async getHeelMaterials(): Promise<HeelMaterial[]> {
    await this.delay(200);
    return this.dictionaries.heel_materials;
  }

  // Системные справочники
  async getOrderStatuses(): Promise<OrderStatus[]> {
    await this.delay(200);
    return this.dictionaries.order_statuses;
  }

  async getDocumentTypes(): Promise<DocumentType[]> {
    await this.delay(200);
    return this.dictionaries.document_types;
  }

  async getPassportSeries(): Promise<PassportSeries[]> {
    await this.delay(200);
    return this.dictionaries.passport_series;
  }
}
```

## 7. Типизация справочников

### types/index.ts - Интерфейсы справочников
```typescript
// Географические
export interface Oblast {
  id: number;
  name: string;
  code: string;
}

export interface Raion {
  id: number;
  name: string;
  code: string;
  oblast: number;
}

export interface Locality {
  id: number;
  name: string;
  code: string;
  raion: number;
}

export interface MSEC {
  id: number;
  name: string;
  locality: number;
}

// Медицинские
export interface Disability {
  id: number;
  name: string;
  code: string;
}

export interface DiagnosisType {
  id: number;
  name: string;
  code: string;
}

export interface AmputationType {
  id: number;
  name: string;
  code: string;
}

// Технические
export interface DeviceType {
  id: number;
  name: string;
  code: string;
  order_type?: number;
}

export interface Material {
  id: number;
  name: string;
  code: string;
  unit: string;
  price: number;
  category: string;
  inventory_number: string;
}

export interface Work {
  id: number;
  name: string;
  code: string;
  price: number;
}

// Обувные
export interface ShoeModel {
  id: number;
  name: string;
  code: string;
}

export interface ShoeColor {
  id: number;
  name: string;
  code: string;
}

export interface HeelMaterial {
  id: number;
  name: string;
  code: string;
}

// Системные
export interface OrderStatus {
  id: number;
  code: string;
  name: string;
  description?: string;
  color: string;
  is_final: boolean;
  can_transition_to: number[];
}

export interface DocumentType {
  id: number;
  name: string;
  code: string;
}

export interface PassportSeries {
  id: number;
  name: string;
  code: string;
}
```

## 8. Хуки для работы со справочниками

### useDictionaries.ts - Кастомный хук
```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export function useDictionaries() {
  const [dictionaries, setDictionaries] = useState({
    obasts: [],
    raions: [],
    localities: [],
    msecs: [],
    disabilities: [],
    diagnosisTypes: [],
    deviceTypes: [],
    materials: [],
    works: [],
    shoeModels: [],
    shoeColors: [],
    heelMaterials: [],
    orderStatuses: [],
    documentTypes: [],
    passportSeries: []
  });

  const [loading, setLoading] = useState(false);

  const loadDictionaries = async () => {
    setLoading(true);
    try {
      const [
        obasts,
        disabilities,
        diagnosisTypes,
        deviceTypes,
        materials,
        works,
        shoeModels,
        shoeColors,
        heelMaterials,
        orderStatuses,
        documentTypes,
        passportSeries
      ] = await Promise.all([
        apiClient.getOblasts(),
        apiClient.getDisabilities(),
        apiClient.getDiagnosisTypes(),
        apiClient.getDeviceTypes(),
        apiClient.getMaterials(),
        apiClient.getWorks(),
        apiClient.getShoeModels(),
        apiClient.getShoeColors(),
        apiClient.getHeelMaterials(),
        apiClient.getOrderStatuses(),
        apiClient.getDocumentTypes(),
        apiClient.getPassportSeries()
      ]);

      setDictionaries({
        obasts,
        raions: [],
        localities: [],
        msecs: [],
        disabilities,
        diagnosisTypes,
        deviceTypes,
        materials,
        works,
        shoeModels,
        shoeColors,
        heelMaterials,
        orderStatuses,
        documentTypes,
        passportSeries
      });
    } catch (error) {
      console.error('Failed to load dictionaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRaions = async (oblastId: number) => {
    const raions = await apiClient.getRaions(oblastId);
    setDictionaries(prev => ({ ...prev, raions }));
  };

  const loadLocalities = async (raionId: number) => {
    const localities = await apiClient.getLocalities(raionId);
    setDictionaries(prev => ({ ...prev, localities }));
  };

  const loadMSECs = async (localityId: number) => {
    const msecs = await apiClient.getMSECs(localityId);
    setDictionaries(prev => ({ ...prev, msecs }));
  };

  useEffect(() => {
    loadDictionaries();
  }, []);

  return {
    dictionaries,
    loading,
    loadRaions,
    loadLocalities,
    loadMSECs
  };
}
```

## 9. Компоненты для отображения справочников

### DictionarySelect.tsx - Универсальный селект
```typescript
interface DictionarySelectProps {
  value: number | string;
  onChange: (value: number | string) => void;
  dictionary: any[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  valueField?: string;
  labelField?: string;
}

export function DictionarySelect({
  value,
  onChange,
  dictionary,
  placeholder = 'Выберите...',
  disabled = false,
  required = false,
  valueField = 'id',
  labelField = 'name'
}: DictionarySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">{placeholder}</option>
      {dictionary.map((item) => (
        <option key={item[valueField]} value={item[valueField]}>
          {item[labelField]}
        </option>
      ))}
    </select>
  );
}
```

## 10. Кэширование справочников

### DictionaryCache.ts - Кэш справочников
```typescript
class DictionaryCache {
  private cache = new Map<string, any>();
  private timestamps = new Map<string, number>();
  private readonly TTL = 5 * 60 * 1000; // 5 минут

  set(key: string, value: any): void {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  get(key: string): any | null {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() - timestamp > this.TTL) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const dictionaryCache = new DictionaryCache();
```

Эти примеры показывают, как справочники интегрированы в различные части системы и как они используются для обеспечения целостности данных и удобства пользователей.
