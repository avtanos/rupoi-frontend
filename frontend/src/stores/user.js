import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      id: 1,
      username: 'demo_user',
      first_name: 'Демо',
      last_name: 'Пользователь',
      role: 'admin',
      role_display: 'Администратор',
      department: 'Демонстрация',
      is_active: true
    },
    token: 'demo_token',
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => true,  // Всегда аутентифицирован для демо
    userRole: (state) => state.user?.role || 'admin',
    isRegistry: (state) => state.user?.role === 'registry',
    isMedical: (state) => state.user?.role === 'medical',
    isWorkshop: (state) => state.user?.role === 'workshop',
    isWarehouse: (state) => state.user?.role === 'warehouse',
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        console.log('Демо вход в систему:', credentials)
        
        // Устанавливаем демо пользователя
        this.user = {
          id: 1,
          username: credentials.username || 'demo_user',
          first_name: 'Демо',
          last_name: 'Пользователь',
          role: 'admin',
          role_display: 'Администратор',
          department: 'Демонстрация',
          is_active: true
        }
        this.token = 'demo_token'
        localStorage.setItem('token', this.token)
        
        return { success: true }
      } catch (error) {
        this.error = 'Ошибка входа в систему'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        console.log('Выход из демо системы')
      } catch (error) {
        console.error('Ошибка при выходе:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
      }
    },

    async fetchCurrentUser() {
      console.log('Получение данных демо пользователя')
    },

    async changePassword(passwords) {
      this.loading = true
      this.error = null
      
      try {
        console.log('Демо смена пароля:', passwords)
        return { success: true }
      } catch (error) {
        this.error = 'Ошибка смены пароля'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    // Метод для смены роли пользователя в демо режиме
    changeRole(role) {
      const roleConfigs = {
        'registry': {
          first_name: 'Регистратор',
          last_name: 'Демо',
          role_display: 'Регистратор',
          department: 'Регистратура'
        },
        'medical': {
          first_name: 'Врач',
          last_name: 'Демо',
          role_display: 'Врач',
          department: 'Медицинский отдел'
        },
        'workshop': {
          first_name: 'Мастер',
          last_name: 'Демо',
          role_display: 'Мастер',
          department: 'Производство'
        },
        'warehouse': {
          first_name: 'Кладовщик',
          last_name: 'Демо',
          role_display: 'Кладовщик',
          department: 'Склад'
        },
        'admin': {
          first_name: 'Администратор',
          last_name: 'Демо',
          role_display: 'Администратор',
          department: 'Администрация'
        }
      }

      const config = roleConfigs[role] || roleConfigs['admin']
      this.user = {
        ...this.user,
        role,
        ...config
      }
    }
  }
})
