<template>
  <div class="personal-files-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      Главная / <strong>Личные дела</strong>
    </div>

    <!-- Заголовок страницы -->
    <h1 class="page-title">Личные дела</h1>

    <!-- Карточки с данными и аналитикой -->
    <div class="data-cards">
      <div class="data-card">
        <h4>Всего дел</h4>
        <div class="value">{{ stats.total || 0 }}</div>
        <div class="trend">+5 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Активных</h4>
        <div class="value">{{ stats.active || 0 }}</div>
        <div class="trend">+3 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Закрытых</h4>
        <div class="value">{{ stats.closed || 0 }}</div>
        <div class="trend">+2 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Срочные</h4>
        <div class="value">{{ stats.urgent || 0 }}</div>
        <div class="trend">Без изменений</div>
      </div>
    </div>

    <!-- Фильтры -->
    <v-card class="filters-card">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.search"
              label="Поиск (ПИН / ФИО)"
              prepend-icon="mdi-magnify"
              clearable
              @update:model-value="loadPersonalFiles"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.disability_group"
              label="Группа инвалидности"
              :items="disabilityGroups"
              clearable
              @update:model-value="loadPersonalFiles"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.status"
              label="Статус"
              :items="statusOptions"
              clearable
              @update:model-value="loadPersonalFiles"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="2">
            <v-btn
              color="secondary"
              variant="outlined"
              @click="clearFilters"
              class="clear-btn"
            >
              Сбросить
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Таблица реестра -->
    <v-card class="registry-card">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Реестр личных дел</span>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="$router.push('/personal-files/create')"
          class="create-btn"
        >
          Новое личное дело
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="personalFiles"
          :loading="loading"
          :items-per-page="20"
          class="registry-table"
          hover
        >
          <template v-slot:item.file_number="{ item }">
            <v-btn
              variant="text"
              color="primary"
              @click="viewPersonalFile(item.raw)"
              class="file-number-btn"
            >
              {{ item.raw.file_number }}
            </v-btn>
          </template>
          
          <template v-slot:item.pin="{ item }">
            {{ maskPin(item.raw.pin) }}
          </template>
          
          <template v-slot:item.full_name="{ item }">
            {{ `${item.raw.last_name} ${item.raw.first_name} ${item.raw.middle_name || ''}` }}
          </template>
          
          <template v-slot:item.birth_date="{ item }">
            {{ formatDate(item.raw.birth_date) }}
          </template>
          
          <template v-slot:item.disability_group="{ item }">
            <v-chip
              :color="getDisabilityGroupColor(item.raw.disability_group)"
              size="small"
              variant="outlined"
            >
              {{ getDisabilityGroupLabel(item.raw.disability_group) }}
            </v-chip>
          </template>
          
          <template v-slot:item.ipra="{ item }">
            {{ item.raw.ipra_number || 'Не указано' }}
          </template>
          
          <template v-slot:item.last_order="{ item }">
            {{ item.raw.last_order || 'Нет заказов' }}
          </template>
          
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.raw.is_active ? 'success' : 'error'"
              size="small"
              variant="outlined"
            >
              {{ item.raw.is_active ? 'Активно' : 'Закрыто' }}
            </v-chip>
          </template>
          
          <template v-slot:item.updated_at="{ item }">
            {{ formatDateTime(item.raw.updated_at) }}
          </template>
          
          <template v-slot:item.actions="{ item }">
            <div class="actions-col">
              <v-btn
                size="small"
                variant="outlined"
                @click="viewPersonalFile(item.raw)"
                class="action-btn"
              >
                Просмотр
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                @click="editPersonalFile(item.raw)"
                class="action-btn"
              >
                Редактировать
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="error"
                @click="deletePersonalFile(item.raw)"
                class="action-btn danger"
              >
                Удалить
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    
    <!-- Диалог удаления -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы действительно хотите удалить личное дело "{{ selectedFile?.file_number }}"?
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const router = useRouter()

// Состояние
const loading = ref(false)
const personalFiles = ref([])
const stats = ref({})
const deleteDialog = ref(false)
const selectedFile = ref(null)

// Фильтры
const filters = reactive({
  search: '',
  disability_group: '',
  status: ''
})

// Заголовки таблицы
const headers = [
  { title: '№ дела', key: 'file_number', sortable: true },
  { title: 'ПИН', key: 'pin', sortable: true },
  { title: 'ФИО', key: 'full_name', sortable: true },
  { title: 'Дата рождения', key: 'birth_date', sortable: true },
  { title: 'Группа', key: 'disability_group', sortable: true },
  { title: 'ИПРА', key: 'ipra', sortable: true },
  { title: 'Последний заказ', key: 'last_order', sortable: true },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Обновлено', key: 'updated_at', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

// Опции фильтров
const disabilityGroups = [
  { title: '1 группа', value: '1' },
  { title: '2 группа', value: '2' },
  { title: '3 группа', value: '3' },
  { title: 'Ребёнок-инвалид', value: 'child' }
]

const statusOptions = [
  { title: 'Активно', value: 'active' },
  { title: 'Закрыто', value: 'inactive' }
]

// Методы
const loadPersonalFiles = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.disability_group) params.disability_group = filters.disability_group
    if (filters.status) params.is_active = filters.status === 'active'
    
    const response = await api.get('/personal-files/', { params })
    personalFiles.value = response.data.results || response.data
  } catch (error) {
    console.error('Ошибка загрузки личных дел:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await api.get('/personal-files/stats/')
    stats.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.disability_group = ''
  filters.status = ''
  loadPersonalFiles()
}

const viewPersonalFile = (file) => {
  router.push(`/personal-files/${file.id}`)
}

const editPersonalFile = (file) => {
  router.push(`/personal-files/${file.id}/edit`)
}

const deletePersonalFile = (file) => {
  selectedFile.value = file
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/personal-files/${selectedFile.value.id}/`)
    await loadPersonalFiles()
    deleteDialog.value = false
    selectedFile.value = null
  } catch (error) {
    console.error('Ошибка удаления:', error)
  }
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
    '1': 'I',
    '2': 'II',
    '3': 'III',
    'child': 'Ребёнок-инвалид'
  }
  return labels[group] || group
}

onMounted(() => {
  loadPersonalFiles()
  loadStats()
})
</script>

<style scoped>
.personal-files-page {
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

.filters-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.clear-btn {
  height: 40px;
}

.registry-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.create-btn {
  height: 40px;
}

.registry-table {
  border-radius: 8px;
}

.file-number-btn {
  font-weight: 600;
  text-decoration: none;
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

/* Стили для таблицы */
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
</style>
