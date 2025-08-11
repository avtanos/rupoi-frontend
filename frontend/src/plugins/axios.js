import axios from 'axios'
import { demoApi } from '@/utils/demoData'

// Создаем экземпляр axios для демо режима
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Перехватчик запросов для демо режима
api.interceptors.request.use(
  (config) => {
    // Добавляем токен для демо
    config.headers.Authorization = 'Bearer demo_token'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Перехватчик ответов для демо режима
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Демо API методы
const demoAxios = {
  // GET запросы
  get: async (url, config = {}) => {
    console.log('Демо GET запрос:', url, config)
    
    // Личные дела
    if (url.startsWith('/personal-files/')) {
      if (url.endsWith('/stats/')) {
        return await demoApi.getPersonalFilesStats()
      }
      
      const id = url.split('/').pop()
      if (id && id !== '') {
        return await demoApi.getPersonalFile(id)
      }
      
      return await demoApi.getPersonalFiles(config.params)
    }
    
    // Заказы
    if (url.startsWith('/orders/')) {
      return await demoApi.getOrders()
    }
    
    // Накладные
    if (url.startsWith('/invoices/')) {
      return await demoApi.getInvoices()
    }
    
    // Склад
    if (url.startsWith('/warehouse/')) {
      return await demoApi.getWarehouse()
    }
    
    // Отчеты
    if (url.startsWith('/reports/')) {
      return await demoApi.getReports()
    }
    
    // Администрирование
    if (url.startsWith('/admin/')) {
      return await demoApi.getAdminData()
    }
    
    // По умолчанию возвращаем пустой ответ
    return { data: [] }
  },

  // POST запросы
  post: async (url, data = {}) => {
    console.log('Демо POST запрос:', url, data)
    
    // Личные дела
    if (url.startsWith('/personal-files/')) {
      return await demoApi.createPersonalFile(data)
    }
    
    // Заказы
    if (url.startsWith('/orders/')) {
      return { data: { success: true, message: 'Заказ создан' } }
    }
    
    // Накладные
    if (url.startsWith('/invoices/')) {
      return { data: { success: true, message: 'Накладная создана' } }
    }
    
    // Склад
    if (url.startsWith('/warehouse/')) {
      return { data: { success: true, message: 'Позиция добавлена' } }
    }
    
    // Администрирование
    if (url.startsWith('/admin/')) {
      if (url.includes('/backup/')) {
        return { data: { success: true, message: 'Резервная копия создана' } }
      }
      if (url.includes('/restore/')) {
        return { data: { success: true, message: 'Восстановление завершено' } }
      }
      if (url.includes('/cache/clear/')) {
        return { data: { success: true, message: 'Кэш очищен' } }
      }
      if (url.includes('/logs/clear/')) {
        return { data: { success: true, message: 'Логи очищены' } }
      }
      if (url.includes('/reset-password/')) {
        return { data: { success: true, message: 'Пароль сброшен' } }
      }
    }
    
    return { data: { success: true } }
  },

  // PUT запросы
  put: async (url, data = {}) => {
    console.log('Демо PUT запрос:', url, data)
    
    // Личные дела
    if (url.startsWith('/personal-files/')) {
      const id = url.split('/').pop()
      return await demoApi.updatePersonalFile(id, data)
    }
    
    // Накладные
    if (url.startsWith('/invoices/')) {
      if (url.includes('/issue/')) {
        return { data: { success: true, message: 'Накладная выдана' } }
      }
    }
    
    // Администрирование
    if (url.startsWith('/admin/')) {
      if (url.includes('/settings/')) {
        return { data: { success: true, message: 'Настройки сохранены' } }
      }
    }
    
    return { data: { success: true } }
  },

  // DELETE запросы
  delete: async (url) => {
    console.log('Демо DELETE запрос:', url)
    
    // Личные дела
    if (url.startsWith('/personal-files/')) {
      const id = url.split('/').pop()
      return await demoApi.deletePersonalFile(id)
    }
    
    // Заказы
    if (url.startsWith('/orders/')) {
      return { data: { success: true, message: 'Заказ удален' } }
    }
    
    // Накладные
    if (url.startsWith('/invoices/')) {
      return { data: { success: true, message: 'Накладная удалена' } }
    }
    
    // Склад
    if (url.startsWith('/warehouse/')) {
      return { data: { success: true, message: 'Позиция удалена' } }
    }
    
    // Администрирование
    if (url.startsWith('/admin/')) {
      if (url.includes('/users/')) {
        return { data: { success: true, message: 'Пользователь удален' } }
      }
    }
    
    return { data: { success: true } }
  }
}

// Экспортируем демо axios
export default demoAxios
