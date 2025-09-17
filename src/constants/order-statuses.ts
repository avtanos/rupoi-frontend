import { OrderStatus } from '@/types';

export const ORDER_STATUSES: OrderStatus[] = [
  {
    id: 1,
    code: 'NEW',
    name: 'Новый',
    description: 'Заказ создан и ожидает обработки',
    color: '#3B82F6',
    is_final: false,
    can_transition_to: [2, 7] // В работу, На утверждение
  },
  {
    id: 2,
    code: 'APPROVED',
    name: 'Утвержден',
    description: 'Заказ утвержден медицинским отделом',
    color: '#10B981',
    is_final: false,
    can_transition_to: [3] // В работу
  },
  {
    id: 3,
    code: 'IN_PROGRESS',
    name: 'В работе',
    description: 'Заказ находится в производстве',
    color: '#F59E0B',
    is_final: false,
    can_transition_to: [4, 8] // На примерку, На склад
  },
  {
    id: 4,
    code: 'FITTING',
    name: 'На примерке',
    description: 'Изделие готово для примерки пациенту',
    color: '#8B5CF6',
    is_final: false,
    can_transition_to: [5, 3] // На склад, Вернуть в работу
  },
  {
    id: 5,
    code: 'WAREHOUSE',
    name: 'На складе',
    description: 'Изделие готово к выдаче',
    color: '#06B6D4',
    is_final: false,
    can_transition_to: [6] // Выдан
  },
  {
    id: 6,
    code: 'ISSUED',
    name: 'Выдан',
    description: 'Изделие выдано пациенту',
    color: '#059669',
    is_final: true,
    can_transition_to: []
  },
  {
    id: 7,
    code: 'ON_APPROVAL',
    name: 'На утверждении',
    description: 'Заказ ожидает медицинского одобрения',
    color: '#DC2626',
    is_final: false,
    can_transition_to: [2, 8] // Утвержден, Отклонен
  },
  {
    id: 8,
    code: 'REJECTED',
    name: 'Отклонен',
    description: 'Заказ отклонен медицинским отделом',
    color: '#EF4444',
    is_final: true,
    can_transition_to: []
  }
];

export const getOrderStatusById = (id: number): OrderStatus | undefined => {
  return ORDER_STATUSES.find(status => status.id === id);
};

export const getOrderStatusByCode = (code: string): OrderStatus | undefined => {
  return ORDER_STATUSES.find(status => status.code === code);
};

export const canTransitionTo = (fromStatusId: number, toStatusId: number): boolean => {
  const fromStatus = getOrderStatusById(fromStatusId);
  return fromStatus ? fromStatus.can_transition_to.includes(toStatusId) : false;
};

export const getAvailableTransitions = (currentStatusId: number): OrderStatus[] => {
  const currentStatus = getOrderStatusById(currentStatusId);
  if (!currentStatus) return [];
  
  return currentStatus.can_transition_to
    .map(id => getOrderStatusById(id))
    .filter((status): status is OrderStatus => status !== undefined);
};
