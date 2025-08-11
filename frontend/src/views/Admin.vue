<template>
  <div class="admin-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      Главная / <strong>Администрирование</strong>
    </div>

    <!-- Заголовок страницы -->
    <h1 class="page-title">Администрирование</h1>

    <!-- Карточки с системными показателями -->
    <div class="data-cards">
      <div class="data-card">
        <h4>Всего пользователей</h4>
        <div class="value">{{ systemStats.total_users || 0 }}</div>
        <div class="trend">+2 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Активных сессий</h4>
        <div class="value">{{ systemStats.active_sessions || 0 }}</div>
        <div class="trend">+1 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Время работы</h4>
        <div class="value">{{ systemStats.system_uptime || '99.8%' }}</div>
        <div class="trend">Стабильно</div>
      </div>
      <div class="data-card">
        <h4>Последний бэкап</h4>
        <div class="value">{{ formatDate(systemStats.last_backup) }}</div>
        <div class="trend">Успешно</div>
      </div>
    </div>

    <!-- Административные функции -->
    <div class="admin-grid">
      <!-- Управление пользователями -->
      <v-card class="admin-card">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>
            <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
            Управление пользователями
          </span>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="addUser"
            size="small"
          >
            Добавить пользователя
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <v-data-table
            :headers="userHeaders"
            :items="users"
            :loading="loading"
            :items-per-page="10"
            class="users-table"
            hover
          >
            <template v-slot:item.username="{ item }">
              <div class="user-info">
                <div class="username">{{ item.raw.username }}</div>
                <div class="full-name">{{ item.raw.first_name }} {{ item.raw.last_name }}</div>
              </div>
            </template>
            
            <template v-slot:item.role="{ item }">
              <v-chip
                :color="getRoleColor(item.raw.role)"
                size="small"
                variant="outlined"
              >
                {{ getRoleLabel(item.raw.role) }}
              </v-chip>
            </template>
            
            <template v-slot:item.is_active="{ item }">
              <v-chip
                :color="item.raw.is_active ? 'success' : 'error'"
                size="small"
                variant="outlined"
              >
                {{ item.raw.is_active ? 'Активен' : 'Неактивен' }}
              </v-chip>
            </template>
            
            <template v-slot:item.last_login="{ item }">
              {{ formatDateTime(item.raw.last_login) }}
            </template>
            
            <template v-slot:item.actions="{ item }">
              <div class="actions-col">
                <v-btn
                  size="small"
                  variant="outlined"
                  @click="editUser(item.raw)"
                  class="action-btn"
                >
                  Редактировать
                </v-btn>
                <v-btn
                  size="small"
                  variant="outlined"
                  color="warning"
                  @click="resetPassword(item.raw)"
                  class="action-btn"
                >
                  Сброс пароля
                </v-btn>
                <v-btn
                  size="small"
                  variant="outlined"
                  color="error"
                  @click="deleteUser(item.raw)"
                  class="action-btn danger"
                >
                  Удалить
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Системные настройки -->
      <v-card class="admin-card">
        <v-card-title>
          <v-icon color="primary" class="mr-2">mdi-cog</v-icon>
          Системные настройки
        </v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="saveSettings">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="settings.system_name"
                  label="Название системы"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="settings.admin_email"
                  label="Email администратора"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="settings.backup_frequency"
                  label="Частота резервного копирования"
                  :items="backupOptions"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="settings.session_timeout"
                  label="Таймаут сессии (минуты)"
                  :items="timeoutOptions"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.maintenance_mode"
                  label="Режим обслуживания"
                  color="warning"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.debug_mode"
                  label="Режим отладки"
                  color="info"
                />
              </v-col>
            </v-row>
            
            <v-card-actions class="pa-0 mt-4">
              <v-spacer />
              <v-btn
                color="primary"
                @click="saveSettings"
                :loading="saving"
              >
                Сохранить настройки
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- Системные операции -->
      <v-card class="admin-card">
      <v-card-title>
          <v-icon color="primary" class="mr-2">mdi-tools</v-icon>
          Системные операции
        </v-card-title>
        
        <v-card-text>
          <div class="operations-grid">
            <v-btn
              color="success"
              variant="outlined"
              prepend-icon="mdi-database-export"
              @click="createBackup"
              block
              class="operation-btn"
            >
              Создать резервную копию
            </v-btn>
            
            <v-btn
              color="info"
              variant="outlined"
              prepend-icon="mdi-database-import"
              @click="restoreBackup"
              block
              class="operation-btn"
            >
              Восстановить из резервной копии
            </v-btn>
            
            <v-btn
              color="warning"
              variant="outlined"
              prepend-icon="mdi-cache-clear"
              @click="clearCache"
              block
              class="operation-btn"
            >
              Очистить кэш
            </v-btn>
            
            <v-btn
              color="error"
              variant="outlined"
              prepend-icon="mdi-delete-sweep"
              @click="clearLogs"
              block
              class="operation-btn"
            >
              Очистить логи
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Логи системы -->
      <v-card class="admin-card full-width">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>
            <v-icon color="primary" class="mr-2">mdi-file-document</v-icon>
            Логи системы
          </span>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="exportLogs"
          >
            Экспорт логов
          </v-btn>
      </v-card-title>
      
      <v-card-text>
          <v-data-table
            :headers="logHeaders"
            :items="systemLogs"
            :loading="loading"
            :items-per-page="20"
            class="logs-table"
            hover
          >
            <template v-slot:item.level="{ item }">
              <v-chip
                :color="getLogLevelColor(item.raw.level)"
                size="small"
                variant="outlined"
              >
                {{ item.raw.level.toUpperCase() }}
              </v-chip>
            </template>
            
            <template v-slot:item.timestamp="{ item }">
              {{ formatDateTime(item.raw.timestamp) }}
            </template>
            
            <template v-slot:item.message="{ item }">
              <div class="log-message">
                <span class="log-source">{{ item.raw.source }}:</span>
                {{ item.raw.message }}
              </div>
            </template>
          </v-data-table>
      </v-card-text>
    </v-card>
    </div>

    <!-- Диалоги -->
    <v-dialog v-model="deleteUserDialog" max-width="400">
      <v-card>
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы действительно хотите удалить пользователя "{{ selectedUser?.username }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteUserDialog = false">Отмена</v-btn>
          <v-btn color="error" @click="confirmDeleteUser">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="resetPasswordDialog" max-width="400">
      <v-card>
        <v-card-title>Сброс пароля</v-card-title>
        <v-card-text>
          Сбросить пароль для пользователя "{{ selectedUser?.username }}"?
          Новый пароль будет отправлен на email пользователя.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="resetPasswordDialog = false">Отмена</v-btn>
          <v-btn color="warning" @click="confirmResetPassword">Сбросить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const router = useRouter()

// Состояние
const loading = ref(false)
const saving = ref(false)
const users = ref([])
const systemStats = ref({})
const systemLogs = ref([])
const deleteUserDialog = ref(false)
const resetPasswordDialog = ref(false)
const selectedUser = ref(null)

// Настройки системы
const settings = reactive({
  system_name: 'АИС ЕССО',
  admin_email: 'admin@esso.kz',
  backup_frequency: 'daily',
  session_timeout: 30,
  maintenance_mode: false,
  debug_mode: false
})

// Заголовки таблиц
const userHeaders = [
  { title: 'Пользователь', key: 'username', sortable: true },
  { title: 'Роль', key: 'role', sortable: true },
  { title: 'Статус', key: 'is_active', sortable: true },
  { title: 'Последний вход', key: 'last_login', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const logHeaders = [
  { title: 'Уровень', key: 'level', sortable: true },
  { title: 'Время', key: 'timestamp', sortable: true },
  { title: 'Источник', key: 'source', sortable: true },
  { title: 'Сообщение', key: 'message', sortable: true }
]

// Опции
const backupOptions = [
  { title: 'Ежедневно', value: 'daily' },
  { title: 'Еженедельно', value: 'weekly' },
  { title: 'Ежемесячно', value: 'monthly' }
]

const timeoutOptions = [
  { title: '15 минут', value: 15 },
  { title: '30 минут', value: 30 },
  { title: '60 минут', value: 60 }
]

// Методы
const loadAdminData = async () => {
  loading.value = true
  try {
    const response = await api.get('/admin/')
    const data = response.data
    
    users.value = data.users || []
    systemStats.value = data.system_stats || {}
    systemLogs.value = data.logs || []
  } catch (error) {
    console.error('Ошибка загрузки данных администрирования:', error)
  } finally {
    loading.value = false
  }
}

const addUser = () => {
  router.push('/admin/users/add')
}

const editUser = (user) => {
  router.push(`/admin/users/${user.id}/edit`)
}

const deleteUser = (user) => {
  selectedUser.value = user
  deleteUserDialog.value = true
}

const resetPassword = (user) => {
  selectedUser.value = user
  resetPasswordDialog.value = true
}

const confirmDeleteUser = async () => {
  try {
    await api.delete(`/admin/users/${selectedUser.value.id}/`)
    await loadAdminData()
    deleteUserDialog.value = false
    selectedUser.value = null
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error)
  }
}

const confirmResetPassword = async () => {
  try {
    await api.post(`/admin/users/${selectedUser.value.id}/reset-password/`)
    resetPasswordDialog.value = false
    selectedUser.value = null
  } catch (error) {
    console.error('Ошибка сброса пароля:', error)
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    await api.put('/admin/settings/', settings)
    saving.value = false
  } catch (error) {
    console.error('Ошибка сохранения настроек:', error)
    saving.value = false
  }
}

const createBackup = async () => {
  try {
    await api.post('/admin/backup/')
    console.log('Резервная копия создана')
  } catch (error) {
    console.error('Ошибка создания резервной копии:', error)
  }
}

const restoreBackup = async () => {
  try {
    await api.post('/admin/restore/')
    console.log('Восстановление завершено')
  } catch (error) {
    console.error('Ошибка восстановления:', error)
  }
}

const clearCache = async () => {
  try {
    await api.post('/admin/cache/clear/')
    console.log('Кэш очищен')
  } catch (error) {
    console.error('Ошибка очистки кэша:', error)
  }
}

const clearLogs = async () => {
  try {
    await api.post('/admin/logs/clear/')
    await loadAdminData()
    console.log('Логи очищены')
  } catch (error) {
    console.error('Ошибка очистки логов:', error)
  }
}

const exportLogs = () => {
  console.log('Экспорт логов')
  // Здесь будет логика экспорта
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}

const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRoleColor = (role) => {
  const colors = {
    'admin': 'error',
    'registry': 'primary',
    'medical': 'success',
    'workshop': 'warning',
    'warehouse': 'info'
  }
  return colors[role] || 'default'
}

const getRoleLabel = (role) => {
  const labels = {
    'admin': 'Администратор',
    'registry': 'Регистратор',
    'medical': 'Врач',
    'workshop': 'Мастер',
    'warehouse': 'Кладовщик'
  }
  return labels[role] || role
}

const getLogLevelColor = (level) => {
  const colors = {
    'error': 'error',
    'warning': 'warning',
    'info': 'info',
    'debug': 'default'
  }
  return colors[level] || 'default'
}

onMounted(() => {
  loadAdminData()
})
</script>

<style scoped>
.admin-page {
  max-width: 100%;
}

.breadcrumbs {
  color: #6b778c;
  font-size: 14px;
  margin-bottom: 16px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 4px 0 16px;
  color: #1e2a3a;
}

.data-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.data-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.data-card h4 {
  margin: 0;
  font-size: 14px;
  color: #6b778c;
  font-weight: 500;
}

.data-card .value {
  font-size: 20px;
  font-weight: 700;
  color: #1e2a3a;
}

.data-card .trend {
  font-size: 12px;
  color: #2f9e44;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.admin-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.admin-card.full-width {
  grid-column: 1 / -1;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-weight: 600;
  color: #1e2a3a;
}

.full-name {
  font-size: 12px;
  color: #6b778c;
}

.operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.operation-btn {
  height: 48px;
}

.actions-col {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  font-size: 12px;
  height: 28px;
  min-width: auto;
  padding: 0 8px;
}

.action-btn.danger {
  border-color: #e03131;
  color: #e03131;
}

.log-message {
  font-size: 13px;
}

.log-source {
  font-weight: 600;
  color: #6b778c;
}

/* Стили для таблиц */
:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table th) {
  background-color: #f8fafc !important;
  color: #6b778c !important;
  font-weight: 600 !important;
  font-size: 14px !important;
}

:deep(.v-data-table td) {
  font-size: 14px !important;
  color: #1e2a3a !important;
}

:deep(.v-data-table tr:hover td) {
  background-color: #fafbfd !important;
}

:deep(.v-chip) {
  font-size: 12px !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
  
  .operations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
