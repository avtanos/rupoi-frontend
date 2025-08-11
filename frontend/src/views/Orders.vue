<template>
  <div class="orders-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      Главная / <strong>Заказы</strong>
    </div>

    <!-- Заголовок страницы -->
    <h1 class="page-title">Заказы</h1>

    <!-- Карточки с данными и аналитикой -->
    <div class="data-cards">
      <div class="data-card">
        <h4>Всего заказов</h4>
        <div class="value">{{ stats.total || 0 }}</div>
        <div class="trend">+8 за неделю</div>
      </div>
      <div class="data-card">
        <h4>В производстве</h4>
        <div class="value">{{ stats.in_production || 0 }}</div>
        <div class="trend">+3 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Завершённые</h4>
        <div class="value">{{ stats.completed || 0 }}</div>
        <div class="trend">+4 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Ожидающие</h4>
        <div class="value">{{ stats.pending || 0 }}</div>
        <div class="trend">+1 за неделю</div>
      </div>
    </div>

    <!-- Фильтры -->
    <v-card class="filters-card">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.search"
              label="Поиск (номер заказа / пациент)"
              prepend-icon="mdi-magnify"
              clearable
              @update:model-value="loadOrders"
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
              @update:model-value="loadOrders"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.priority"
              label="Приоритет"
              :items="priorityOptions"
              clearable
              @update:model-value="loadOrders"
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

    <!-- Таблица заказов -->
    <v-card class="orders-card">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Реестр заказов</span>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="createOrder"
          class="create-btn"
        >
          Новый заказ
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="orders"
          :loading="loading"
          :items-per-page="20"
          class="orders-table"
          hover
        >
          <template v-slot:item.order_number="{ item }">
            <v-btn
              variant="text"
              color="primary"
              @click="viewOrder(item.raw)"
              class="order-number-btn"
            >
              {{ item.raw.order_number }}
            </v-btn>
          </template>
          
          <template v-slot:item.patient_name="{ item }">
            {{ item.raw.patient_name }}
          </template>
          
          <template v-slot:item.product_name="{ item }">
            {{ item.raw.product_name }}
          </template>
          
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.raw.status)"
              size="small"
              variant="outlined"
            >
              {{ getStatusLabel(item.raw.status) }}
            </v-chip>
          </template>
          
          <template v-slot:item.priority="{ item }">
            <v-chip
              :color="getPriorityColor(item.raw.priority)"
              size="small"
              variant="outlined"
            >
              {{ getPriorityLabel(item.raw.priority) }}
            </v-chip>
          </template>
          
          <template v-slot:item.estimated_completion="{ item }">
            {{ formatDate(item.raw.estimated_completion) }}
          </template>
          
          <template v-slot:item.created_at="{ item }">
            {{ formatDateTime(item.raw.created_at) }}
          </template>
          
          <template v-slot:item.actions="{ item }">
            <div class="actions-col">
              <v-btn
                size="small"
                variant="outlined"
                @click="viewOrder(item.raw)"
                class="action-btn"
              >
                Просмотр
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                @click="editOrder(item.raw)"
                class="action-btn"
              >
                Редактировать
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="error"
                @click="deleteOrder(item.raw)"
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
          Вы действительно хотите удалить заказ "{{ selectedOrder?.order_number }}"?
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
const orders = ref([])
const stats = ref({})
const deleteDialog = ref(false)
const selectedOrder = ref(null)

// Фильтры
const filters = reactive({
  search: '',
  status: '',
  priority: ''
})

// Заголовки таблицы
const headers = [
  { title: '№ заказа', key: 'order_number', sortable: true },
  { title: 'Пациент', key: 'patient_name', sortable: true },
  { title: 'Изделие', key: 'product_name', sortable: true },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Приоритет', key: 'priority', sortable: true },
  { title: 'Дата завершения', key: 'estimated_completion', sortable: true },
  { title: 'Создан', key: 'created_at', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

// Опции фильтров
const statusOptions = [
  { title: 'Заказано', value: 'ordered' },
  { title: 'В производстве', value: 'in_production' },
  { title: 'Завершён', value: 'completed' },
  { title: 'Отменён', value: 'cancelled' }
]

const priorityOptions = [
  { title: 'Низкий', value: 'low' },
  { title: 'Обычный', value: 'normal' },
  { title: 'Высокий', value: 'high' },
  { title: 'Срочный', value: 'urgent' }
]

// Методы
const loadOrders = async () => {
  loading.value = true
  try {
    const response = await api.get('/orders/', { params: filters })
    orders.value = response.data || []
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await api.get('/reports/')
    stats.value = response.data.orders || {}
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.priority = ''
  loadOrders()
}

const viewOrder = (order) => {
  router.push(`/orders/${order.id}`)
}

const editOrder = (order) => {
  router.push(`/orders/${order.id}/edit`)
}

const createOrder = () => {
  router.push('/orders/create')
}

const deleteOrder = (order) => {
  selectedOrder.value = order
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/orders/${selectedOrder.value.id}/`)
    await loadOrders()
    deleteDialog.value = false
    selectedOrder.value = null
  } catch (error) {
    console.error('Ошибка удаления:', error)
  }
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

const getStatusColor = (status) => {
  const colors = {
    'ordered': 'info',
    'in_production': 'warning',
    'completed': 'success',
    'cancelled': 'error'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status) => {
  const labels = {
    'ordered': 'Заказано',
    'in_production': 'В производстве',
    'completed': 'Завершён',
    'cancelled': 'Отменён'
  }
  return labels[status] || status
}

const getPriorityColor = (priority) => {
  const colors = {
    'low': 'success',
    'normal': 'info',
    'high': 'warning',
    'urgent': 'error'
  }
  return colors[priority] || 'default'
}

const getPriorityLabel = (priority) => {
  const labels = {
    'low': 'Низкий',
    'normal': 'Обычный',
    'high': 'Высокий',
    'urgent': 'Срочный'
  }
  return labels[priority] || priority
}

onMounted(() => {
  loadOrders()
  loadStats()
})
</script>

<style scoped>
.orders-page {
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

.orders-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.create-btn {
  height: 40px;
}

.orders-table {
  border-radius: 8px;
}

.order-number-btn {
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
