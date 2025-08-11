import apiClient from './index'

export interface PersonalCase {
  id: string
  number: string
  pin: string
  last_name: string
  first_name: string
  middle_name?: string
  sex: 'M' | 'F'
  birth_date: string
  address_registration: string
  address_actual?: string
  phone?: string
  email?: string
  disability_group: 'I' | 'II' | 'III' | 'CHILD' | 'NONE'
  msek_number?: string
  msek_date?: string
  ipra_number?: string
  ipra_date?: string
  ipra_valid_to?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface PersonalCaseFilters {
  search?: string
  disability_group?: string
  date_from?: string
  date_to?: string
}

export interface PersonalCaseCreate {
  pin: string
  last_name: string
  first_name: string
  middle_name?: string
  sex: 'M' | 'F'
  birth_date: string
  address_registration: string
  address_actual?: string
  phone?: string
  email?: string
  disability_group: 'I' | 'II' | 'III' | 'CHILD' | 'NONE'
  msek_number?: string
  msek_date?: string
  ipra_number?: string
  ipra_date?: string
  ipra_valid_to?: string
  notes?: string
}

export interface PersonalCaseUpdate extends Partial<PersonalCaseCreate> {}

export const personalCasesApi = {
  // Получить список личных дел
  getList: (params?: PersonalCaseFilters) => {
    return apiClient.get<{ results: PersonalCase[]; count: number }>('/api/personal-cases/', { params })
  },

  // Получить личное дело по ID
  getById: (id: string) => {
    return apiClient.get<PersonalCase>(`/api/personal-cases/${id}/`)
  },

  // Создать новое личное дело
  create: (data: PersonalCaseCreate) => {
    return apiClient.post<PersonalCase>('/api/personal-cases/', data)
  },

  // Обновить личное дело
  update: (id: string, data: PersonalCaseUpdate) => {
    return apiClient.put<PersonalCase>(`/api/personal-cases/${id}/`, data)
  },

  // Удалить личное дело
  delete: (id: string) => {
    return apiClient.delete(`/api/personal-cases/${id}/`)
  }
}
