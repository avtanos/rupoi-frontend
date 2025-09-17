// Опорные справочники для системы РУПОИ

export interface ReferenceDictionary {
  code: string;
  name: string;
  description?: string;
}

// Справочник сторон
export const SIDE_DICTIONARY: ReferenceDictionary[] = [
  { code: 'LEFT', name: 'Левая' },
  { code: 'RIGHT', name: 'Правая' },
  { code: 'BOTH', name: 'Обе' }
];

// Справочник срочности
export const URGENCY_DICTIONARY: ReferenceDictionary[] = [
  { code: 'NORMAL', name: 'Обычный' },
  { code: 'URGENT', name: 'Срочный' }
];

// Справочник типов услуг
export const SERVICE_TYPE_DICTIONARY: ReferenceDictionary[] = [
  { code: 'PROSTHESIS', name: 'Протез' },
  { code: 'SHOES', name: 'Обувь' },
  { code: 'OTTO', name: 'Отто' },
  { code: 'REPAIR', name: 'Ремонт' }
];

// Справочник групп инвалидности
export const DISABILITY_GROUP_DICTIONARY: ReferenceDictionary[] = [
  { code: 'GROUP_I', name: 'I группа' },
  { code: 'GROUP_II', name: 'II группа' },
  { code: 'GROUP_III', name: 'III группа' }
];

// Справочник категорий инвалидности
export const DISABILITY_CATEGORY_DICTIONARY: ReferenceDictionary[] = [
  { code: 'CHILD', name: 'Ребенок-инвалид' },
  { code: 'SINCE_CHILDHOOD', name: 'Инвалид с детства' },
  { code: 'VOV', name: 'Инвалид ВОВ' },
  { code: 'LABOUR', name: 'Инвалид труда' },
  { code: 'OTHER', name: 'Другое' }
];

// Справочник причин инвалидности
export const DISABILITY_REASON_DICTIONARY: ReferenceDictionary[] = [
  { code: 'TRAUMA', name: 'Травма' },
  { code: 'CONGENITAL', name: 'Врожденное' },
  { code: 'DISEASE', name: 'Заболевание' },
  { code: 'OTHER', name: 'Другое' }
];

// Справочник типов диагнозов (МКБ-10)
export const DIAGNOSIS_TYPE_DICTIONARY: ReferenceDictionary[] = [
  { code: 'S78.1', name: 'Ампутация бедра' },
  { code: 'S78.9', name: 'Ампутация бедра неуточненная' },
  { code: 'S88.1', name: 'Ампутация голени' },
  { code: 'S88.9', name: 'Ампутация голени неуточненная' },
  { code: 'S98.1', name: 'Ампутация стопы' },
  { code: 'S98.9', name: 'Ампутация стопы неуточненная' },
  { code: 'Q72.0', name: 'Врожденное отсутствие бедра' },
  { code: 'Q72.1', name: 'Врожденное отсутствие голени' },
  { code: 'Q72.2', name: 'Врожденное отсутствие стопы' },
  { code: 'M21.0', name: 'Вальгусная деформация' },
  { code: 'M21.1', name: 'Варусная деформация' },
  { code: 'M21.2', name: 'Сгибательная деформация' },
  { code: 'M21.3', name: 'Разгибательная деформация' },
  { code: 'M21.4', name: 'Плосковальгусная деформация' },
  { code: 'M21.5', name: 'Полые стопы' },
  { code: 'M21.6', name: 'Другие приобретенные деформации пальцев' },
  { code: 'M21.9', name: 'Приобретенная деформация неуточненная' }
];

// Справочник статусов заказов
export const ORDER_STATUS_DICTIONARY: ReferenceDictionary[] = [
  { code: '0', name: 'НЕАКТИВНЫЙ' },
  { code: '1', name: 'НОВЫЙ' },
  { code: '2', name: 'НАПРАВЛЕН_В_ПРОИЗВ' },
  { code: '3', name: 'В_ПРОИЗВ' },
  { code: '4', name: 'НА_ПРИМЕРКЕ' },
  { code: '5', name: 'НА_СКЛАДЕ' },
  { code: '6', name: 'ВЫДАН' },
  { code: '7', name: 'НА_УТВЕРЖДЕНИИ' }
];

// Справочник статусов накладных
export const OVERHEAD_STATUS_DICTIONARY: ReferenceDictionary[] = [
  { code: 'NEW', name: 'Новая' },
  { code: 'SENT', name: 'Передана' },
  { code: 'PROCESSED', name: 'Обработана' }
];

// Функции для работы со справочниками
export const getDictionaryByCode = (dictionary: ReferenceDictionary[], code: string): ReferenceDictionary | undefined => {
  return dictionary.find(item => item.code === code);
};

export const getDictionaryByName = (dictionary: ReferenceDictionary[], name: string): ReferenceDictionary | undefined => {
  return dictionary.find(item => item.name === name);
};

export const getAllDictionaries = () => ({
  SIDE_DICTIONARY,
  URGENCY_DICTIONARY,
  SERVICE_TYPE_DICTIONARY,
  DISABILITY_GROUP_DICTIONARY,
  DISABILITY_CATEGORY_DICTIONARY,
  DISABILITY_REASON_DICTIONARY,
  DIAGNOSIS_TYPE_DICTIONARY,
  ORDER_STATUS_DICTIONARY,
  OVERHEAD_STATUS_DICTIONARY
});
