<template>
  <div class="personal-file-detail">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="$router.back()"
        class="back-btn"
      >
        Назад
      </v-btn>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-text">Личные дела</span>
      <span class="breadcrumb-separator">/</span>
      <strong>{{ personalFile?.file_number || 'Загрузка...' }}</strong>
    </div>

    <!-- Заголовок страницы -->
    <div class="page-header">
      <h1 class="page-title">Личное дело {{ personalFile?.file_number }}</h1>
      <div class="page-actions">
        <v-btn
          color="primary"
          prepend-icon="mdi-pencil"
          @click="editPersonalFile"
        >
          Редактировать
        </v-btn>
        <v-btn
          color="error"
          variant="outlined"
          prepend-icon="mdi-delete"
          @click="deletePersonalFile"
        >
          Удалить
        </v-btn>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="loading-text">Загрузка данных...</p>
    </div>

    <div v-else-if="personalFile" class="detail-content">
      <!-- Основная информация -->
      <v-card class="info-card">
        <v-card-title class="card-title">
          <v-icon color="primary" class="mr-2">mdi-account</v-icon>
          Основная информация
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Номер дела:</label>
                <span class="info-value">{{ personalFile.file_number }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">ПИН:</label>
                <span class="info-value">{{ maskPin(personalFile.pin) }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Фамилия:</label>
                <span class="info-value">{{ personalFile.last_name }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Имя:</label>
                <span class="info-value">{{ personalFile.first_name }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Отчество:</label>
                <span class="info-value">{{ personalFile.middle_name || 'Не указано' }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Дата рождения:</label>
                <span class="info-value">{{ formatDate(personalFile.birth_date) }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Медицинская информация -->
      <v-card class="info-card">
        <v-card-title class="card-title">
          <v-icon color="primary" class="mr-2">mdi-hospital</v-icon>
          Медицинская информация
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Группа инвалидности:</label>
                <v-chip
                  :color="getDisabilityGroupColor(personalFile.disability_group)"
                  size="small"
                  variant="outlined"
                  class="info-chip"
                >
                  {{ getDisabilityGroupLabel(personalFile.disability_group) }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">ИПРА:</label>
                <span class="info-value">{{ personalFile.ipra_number || 'Не указано' }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Статус:</label>
                <v-chip
                  :color="personalFile.is_active ? 'success' : 'error'"
                  size="small"
                  variant="outlined"
                  class="info-chip"
                >
                  {{ personalFile.is_active ? 'Активно' : 'Закрыто' }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Дата создания:</label>
                <span class="info-value">{{ formatDateTime(personalFile.created_at) }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Контактная информация -->
      <v-card class="info-card">
        <v-card-title class="card-title">
          <v-icon color="primary" class="mr-2">mdi-phone</v-icon>
          Контактная информация
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Телефон:</label>
                <span class="info-value">{{ personalFile.phone || 'Не указано' }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <label class="info-label">Адрес:</label>
                <span class="info-value">{{ personalFile.address || 'Не указано' }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- История заказов -->
      <v-card class="info-card">
        <v-card-title class="card-title">
          <v-icon color="primary" class="mr-2">mdi-clipboard-list</v-icon>
          История заказов
        </v-card-title>
        
        <v-card-text>
          <v-alert
            type="info"
            variant="tonal"
            border="start"
            class="mb-4"
          >
            История заказов будет отображаться здесь после интеграции с модулем заказов.
          </v-alert>
          
          <div class="empty-state">
            <v-icon size="48" color="muted" class="empty-icon">mdi-clipboard-outline</v-icon>
            <p class="empty-text">Заказы не найдены</p>
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-plus"
              @click="createOrder"
            >
              Создать заказ
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div v-else class="error-container">
      <v-alert
        type="error"
        variant="tonal"
        border="start"
      >
        Не удалось загрузить данные личного дела.
      </v-alert>
    </div>

    <!-- Диалог удаления -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы действительно хотите удалить личное дело "{{ personalFile?.file_number }}"?
          Это действие нельзя отменить.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" @click="confirmDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const personalFile = ref(null)
const deleteDialog = ref(false)

const loadPersonalFile = async () => {
  loading.value = true
  try {
    const response = await api.get(`/personal-files/${route.params.id}/`)
    personalFile.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки личного дела:', error)
  } finally {
    loading.value = false
  }
}

const editPersonalFile = () => {
  router.push(`/personal-files/${route.params.id}/edit`)
}

const deletePersonalFile = () => {
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/personal-files/${route.params.id}/`)
    router.push('/')
  } catch (error) {
    console.error('Ошибка удаления:', error)
  } finally {
    deleteDialog.value = false
  }
}

const createOrder = () => {
  router.push(`/orders/create?personal_file=${route.params.id}`)
}

const maskPin = (pin) => {
  if (!pin) return ''
  return pin.replace(/(\d{4})(\d{6})(\d{4})/, '$1****$3')
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

const getDisabilityGroupColor = (group) => {
  const colors = {
    '1': 'error',
    '2': 'warning',
    '3': 'info',
    'child': 'secondary'
  }
  return colors[group] || 'default'
}

const getDisabilityGroupLabel = (group) => {
  const labels = {
    '1': 'I группа',
    '2': 'II группа',
    '3': 'III группа',
    'child': 'Ребёнок-инвалид'
  }
  return labels[group] || group
}

onMounted(() => {
  loadPersonalFile()
})
</script>

<style scoped>
.personal-file-detail {
  max-width: 100%;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 16px;
}

.back-btn {
  color: var(--primary) !important;
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--muted);
}

.breadcrumb-text {
  color: var(--muted);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 12px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  gap: 16px;
}

.loading-text {
  color: var(--muted);
  margin: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  padding: 20px 24px 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.info-label {
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.info-value {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}

.info-chip {
  align-self: flex-start;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 16px;
  text-align: center;
}

.empty-icon {
  opacity: 0.5;
}

.empty-text {
  color: var(--muted);
  margin: 0;
  font-size: 14px;
}

.error-container {
  margin-top: 24px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .page-actions .v-btn {
    flex: 1;
  }
}
</style>
