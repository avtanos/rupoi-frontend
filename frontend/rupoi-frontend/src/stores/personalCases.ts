import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PersonalCase, PersonalCaseFilters, PersonalCaseCreate, PersonalCaseUpdate } from '@/api/personalCases'
import { personalCasesApi } from '@/api/personalCases'

export const usePersonalCasesStore = defineStore('personalCases', () => {
  // Состояние
  const cases = ref<PersonalCase[]>([])
  const currentCase = ref<PersonalCase | null>(null)
  const loading = ref(false)
  const totalCount = ref(0)
  const filters = ref<PersonalCaseFilters>({})
  const currentPage = ref(1)
  const pageSize = ref(20)

  // Геттеры
  const getCases = computed(() => cases.value)
  const getCurrentCase = computed(() => currentCase.value)
  const isLoading = computed(() => loading.value)
  const getTotalCount = computed(() => totalCount.value)
  const getFilters = computed(() => filters.value)

  // Статистика
  const statistics = ref({
    total: 0,
    active: 0,
    closed: 0,
    urgent: 0
  })

  // Действия
  const fetchCases = async (page = 1) => {
    loading.value = true
    try {
      const params = {
        ...filters.value,
        page,
        page_size: pageSize.value
      }
      const response = await personalCasesApi.getList(params)
      cases.value = response.data.results
      totalCount.value = response.data.count
      currentPage.value = page
    } catch (error) {
      console.error('Ошибка при загрузке личных дел:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchCaseById = async (id: string) => {
    loading.value = true
    try {
      const response = await personalCasesApi.getById(id)
      currentCase.value = response.data
      return response.data
    } catch (error) {
      console.error('Ошибка при загрузке личного дела:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createCase = async (data: PersonalCaseCreate) => {
    loading.value = true
    try {
      const response = await personalCasesApi.create(data)
      cases.value.unshift(response.data)
      totalCount.value++
      return response.data
    } catch (error) {
      console.error('Ошибка при создании личного дела:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateCase = async (id: string, data: PersonalCaseUpdate) => {
    loading.value = true
    try {
      const response = await personalCasesApi.update(id, data)
      const index = cases.value.findIndex(case_ => case_.id === id)
      if (index !== -1) {
        cases.value[index] = response.data
      }
      if (currentCase.value?.id === id) {
        currentCase.value = response.data
      }
      return response.data
    } catch (error) {
      console.error('Ошибка при обновлении личного дела:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteCase = async (id: string) => {
    loading.value = true
    try {
      await personalCasesApi.delete(id)
      cases.value = cases.value.filter(case_ => case_.id !== id)
      totalCount.value--
      if (currentCase.value?.id === id) {
        currentCase.value = null
      }
    } catch (error) {
      console.error('Ошибка при удалении личного дела:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters: PersonalCaseFilters) => {
    filters.value = { ...newFilters }
    currentPage.value = 1
  }

  const clearFilters = () => {
    filters.value = {}
    currentPage.value = 1
  }

  const fetchStatistics = async () => {
    try {
      // В реальном приложении здесь будет отдельный API endpoint для статистики
      // Пока используем общий список для подсчета
      const response = await personalCasesApi.getList()
      const allCases = response.data.results
      
      statistics.value = {
        total: allCases.length,
        active: allCases.filter(c => c.disability_group !== 'NONE').length,
        closed: allCases.filter(c => c.disability_group === 'NONE').length,
        urgent: 0 // Будет рассчитываться на основе связанных заказов
      }
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error)
    }
  }

  const reset = () => {
    cases.value = []
    currentCase.value = null
    loading.value = false
    totalCount.value = 0
    filters.value = {}
    currentPage.value = 1
    statistics.value = { total: 0, active: 0, closed: 0, urgent: 0 }
  }

  return {
    // Состояние
    cases,
    currentCase,
    loading,
    totalCount,
    filters,
    currentPage,
    pageSize,
    statistics,

    // Геттеры
    getCases,
    getCurrentCase,
    isLoading,
    getTotalCount,
    getFilters,

    // Действия
    fetchCases,
    fetchCaseById,
    createCase,
    updateCase,
    deleteCase,
    setFilters,
    clearFilters,
    fetchStatistics,
    reset
  }
})
