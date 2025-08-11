<template>
  <div class="warehouse-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      Главная / <strong>Склад / Выдача</strong>
    </div>

    <!-- Заголовок страницы -->
    <h1 class="page-title">Склад / Выдача</h1>

    <!-- Карточки с данными и аналитикой -->
    <div class="data-cards">
      <div class="data-card">
        <h4>Всего позиций</h4>
        <div class="value">{{ stats.total_items || 0 }}</div>
        <div class="trend">+5 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Низкий запас</h4>
        <div class="value">{{ stats.low_stock || 0 }}</div>
        <div class="trend">+2 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Нет в наличии</h4>
        <div class="value">{{ stats.out_of_stock || 0 }}</div>
        <div class="trend">+0 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Выдано за неделю</h4>
        <div class="value">{{ stats.weekly_issues || 0 }}</div>
        <div class="trend">+3 за неделю</div>
      </div>
    </div>

    <!-- Фильтры -->
    <v-card class="filters-card">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.search"
              label="Поиск (название изделия)"
              prepend-icon="mdi-magnify"
              clearable
              @update:model-value="loadWarehouse"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.category"
              label="Категория"
              :items="categoryOptions"
              clearable
              @update:model-value="loadWarehouse"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.stock_status"
              label="Статус запаса"
              :items="stockStatusOptions"
              clearable
              @update:model-value="loadWarehouse"
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

    <!-- Таблица склада -->
    <v-card class="warehouse-card">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Реестр склада</span>
        <div class="header-actions">
          <v-btn
            color="success"
            prepend-icon="mdi-plus"
            @click="addItem"
            class="add-btn"
          >
            Добавить позицию
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-download"
            @click="exportInventory"
            class="export-btn"
          >
            Экспорт
          </v-btn>
        </div>
      </v-card-title>
      
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="warehouse"
          :loading="loading"
          :items-per-page="20"
          class="warehouse-table"
          hover
        >
          <template v-slot:item.product_name="{ item }">
            <div class="product-info">
              <div class="product-name">{{ item.raw.product_name }}</div>
              <div class="product-category">{{ getCategoryLabel(item.raw.category) }}</div>
            </div>
          </template>
          
          <template v-slot:item.quantity="{ item }">
            <div class="quantity-info">
              <span class="quantity-value">{{ item.raw.quantity }}</span>
              <span class="quantity-unit">шт.</span>
            </div>
          </template>
          
          <template v-slot:item.stock_status="{ item }">
            <v-chip
              :color="getStockStatusColor(item.raw)"
              size="small"
              variant="outlined"
            >
              {{ getStockStatusLabel(item.raw) }}
            </v-chip>
          </template>
          
          <template v-slot:item.location="{ item }">
            {{ item.raw.location }}
          </template>
          
          <template v-slot:item.last_updated="{ item }">
            {{ formatDateTime(item.raw.last_updated) }}
          </template>
          
          <template v-slot:item.actions="{ item }">
            <div class="actions-col">
              <v-btn
                size="small"
                variant="outlined"
                @click="viewItem(item.raw)"
                class="action-btn"
              >
                Просмотр
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                @click="editItem(item.raw)"
                class="action-btn"
              >
                Редактировать
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="success"
                @click="issueItem(item.raw)"
                class="action-btn"
              >
                Выдать
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="error"
                @click="deleteItem(item.raw)"
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
          Вы действительно хотите удалить позицию "{{ selectedItem?.product_name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" @click="confirmDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог выдачи -->
    <v-dialog v-model="issueDialog" max-width="500">
      <v-card>
        <v-card-title>Выдача со склада</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="confirmIssue">
            <v-text-field
              v-model="issueForm.quantity"
              label="Количество"
              type="number"
              min="1"
              :max="selectedItem?.quantity"
              required
              variant="outlined"
              density="compact"
            />
            <v-text-field
              v-model="issueForm.patient_name"
              label="Пациент"
              required
              variant="outlined"
              density="compact"
            />
            <v-textarea
              v-model="issueForm.notes"
              label="Примечания"
              variant="outlined"
              density="compact"
              rows="3"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="issueDialog = false">Отмена</v-btn>
          <v-btn color="success" @click="confirmIssue">Выдать</v-btn>
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
const warehouse = ref([])
const stats = ref({})
const deleteDialog = ref(false)
const selectedItem = ref(null)
const issueDialog = ref(false)
const issueForm = reactive({
  quantity: 1,
  patient_name: '',
  notes: ''
})

// Фильтры
const filters = reactive({
  search: '',
  category: '',
  stock_status: ''
})

// Заголовки таблицы
const headers = [
  { title: 'Изделие', key: 'product_name', sortable: true },
  { title: 'Количество', key: 'quantity', sortable: true },
  { title: 'Статус запаса', key: 'stock_status', sortable: true },
  { title: 'Расположение', key: 'location', sortable: true },
  { title: 'Обновлено', key: 'last_updated', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

// Опции фильтров
const categoryOptions = [
  { title: 'Протезы', value: 'prostheses' },
  { title: 'Ортопедическая обувь', value: 'shoes' },
  { title: 'Инвалидные коляски', value: 'wheelchairs' },
  { title: 'Средства передвижения', value: 'mobility_aids' }
]

const stockStatusOptions = [
  { title: 'В наличии', value: 'in_stock' },
  { title: 'Низкий запас', value: 'low_stock' },
  { title: 'Нет в наличии', value: 'out_of_stock' }
]

// Методы
const loadWarehouse = async () => {
  loading.value = true
  try {
    const response = await api.get('/warehouse/', { params: filters })
    warehouse.value = response.data || []
  } catch (error) {
    console.error('Ошибка загрузки склада:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await api.get('/reports/')
    stats.value = response.data.warehouse || {}
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.stock_status = ''
  loadWarehouse()
}

const viewItem = (item) => {
  router.push(`/warehouse/${item.id}`)
}

const editItem = (item) => {
  router.push(`/warehouse/${item.id}/edit`)
}

const addItem = () => {
  router.push('/warehouse/add')
}

const issueItem = (item) => {
  selectedItem.value = item
  issueForm.quantity = 1
  issueForm.patient_name = ''
  issueForm.notes = ''
  issueDialog.value = true
}

const deleteItem = (item) => {
  selectedItem.value = item
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/warehouse/${selectedItem.value.id}/`)
    await loadWarehouse()
    deleteDialog.value = false
    selectedItem.value = null
  } catch (error) {
    console.error('Ошибка удаления:', error)
  }
}

const confirmIssue = async () => {
  try {
    await api.post(`/warehouse/${selectedItem.value.id}/issue/`, issueForm)
    await loadWarehouse()
    issueDialog.value = false
    selectedItem.value = null
  } catch (error) {
    console.error('Ошибка выдачи:', error)
  }
}

const exportInventory = () => {
  console.log('Экспорт инвентаря')
  // Здесь будет логика экспорта
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

const getCategoryLabel = (category) => {
  const labels = {
    'prostheses': 'Протезы',
    'shoes': 'Ортопедическая обувь',
    'wheelchairs': 'Инвалидные коляски',
    'mobility_aids': 'Средства передвижения'
  }
  return labels[category] || category
}

const getStockStatusColor = (item) => {
  if (item.quantity === 0) return 'error'
  if (item.quantity <= item.min_quantity) return 'warning'
  return 'success'
}

const getStockStatusLabel = (item) => {
  if (item.quantity === 0) return 'Нет в наличии'
  if (item.quantity <= item.min_quantity) return 'Низкий запас'
  return 'В наличии'
}

onMounted(() => {
  loadWarehouse()
  loadStats()
})
</script>

<style scoped>
.warehouse-page {
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

.warehouse-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.add-btn,
.export-btn {
  height: 40px;
}

.warehouse-table {
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-name {
  font-weight: 600;
  color: #1e2a3a;
}

.product-category {
  font-size: 12px;
  color: #6b778c;
}

.quantity-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.quantity-value {
  font-weight: 600;
  color: #1e2a3a;
}

.quantity-unit {
  font-size: 12px;
  color: #6b778c;
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
