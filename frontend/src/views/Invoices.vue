<template>
  <div class="invoices-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      Главная / <strong>Накладные</strong>
    </div>

    <!-- Заголовок страницы -->
    <h1 class="page-title">Накладные</h1>

    <!-- Карточки с данными и аналитикой -->
    <div class="data-cards">
      <div class="data-card">
        <h4>Всего накладных</h4>
        <div class="value">{{ stats.total || 0 }}</div>
        <div class="trend">+12 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Выдано</h4>
        <div class="value">{{ stats.issued || 0 }}</div>
        <div class="trend">+8 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Ожидают выдачи</h4>
        <div class="value">{{ stats.pending || 0 }}</div>
        <div class="trend">+4 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Возвраты</h4>
        <div class="value">{{ stats.returns || 0 }}</div>
        <div class="trend">+0 за неделю</div>
      </div>
    </div>

    <!-- Фильтры -->
    <v-card class="filters-card">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.search"
              label="Поиск (номер накладной / пациент)"
              prepend-icon="mdi-magnify"
              clearable
              @update:model-value="loadInvoices"
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
              @update:model-value="loadInvoices"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.product_type"
              label="Тип изделия"
              :items="productTypeOptions"
              clearable
              @update:model-value="loadInvoices"
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

    <!-- Таблица накладных -->
    <v-card class="invoices-card">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Реестр накладных</span>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="createInvoice"
          class="create-btn"
        >
          Новая накладная
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="invoices"
          :loading="loading"
          :items-per-page="20"
          class="invoices-table"
          hover
        >
          <template v-slot:item.invoice_number="{ item }">
            <v-btn
              variant="text"
              color="primary"
              @click="viewInvoice(item.raw)"
              class="invoice-number-btn"
            >
              {{ item.raw.invoice_number }}
            </v-btn>
          </template>
          
          <template v-slot:item.order_number="{ item }">
            <v-btn
              variant="text"
              color="secondary"
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
          
          <template v-slot:item.quantity="{ item }">
            {{ item.raw.quantity }} шт.
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
          
          <template v-slot:item.issued_at="{ item }">
            {{ formatDateTime(item.raw.issued_at) }}
          </template>
          
          <template v-slot:item.issued_by="{ item }">
            {{ item.raw.issued_by || 'Не выдано' }}
          </template>
          
          <template v-slot:item.actions="{ item }">
            <div class="actions-col">
              <v-btn
                size="small"
                variant="outlined"
                @click="viewInvoice(item.raw)"
                class="action-btn"
              >
                Просмотр
              </v-btn>
              <v-btn
                v-if="item.raw.status === 'pending'"
                size="small"
                variant="outlined"
                color="success"
                @click="issueInvoice(item.raw)"
                class="action-btn"
              >
                Выдать
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                @click="editInvoice(item.raw)"
                class="action-btn"
              >
                Редактировать
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="error"
                @click="deleteInvoice(item.raw)"
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
          Вы действительно хотите удалить накладную "{{ selectedInvoice?.invoice_number }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" @click="confirmDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог выдачи -->
    <v-dialog v-model="issueDialog" max-width="400">
      <v-card>
        <v-card-title>Выдача накладной</v-card-title>
        <v-card-text>
          Подтвердите выдачу накладной "{{ selectedInvoice?.invoice_number }}" пациенту {{ selectedInvoice?.patient_name }}?
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
const invoices = ref([])
const stats = ref({})
const deleteDialog = ref(false)
const selectedInvoice = ref(null)
const issueDialog = ref(false)

// Фильтры
const filters = reactive({
  search: '',
  status: '',
  product_type: ''
})

// Заголовки таблицы
const headers = [
  { title: '№ накладной', key: 'invoice_number', sortable: true },
  { title: '№ заказа', key: 'order_number', sortable: true },
  { title: 'Пациент', key: 'patient_name', sortable: true },
  { title: 'Изделие', key: 'product_name', sortable: true },
  { title: 'Количество', key: 'quantity', sortable: true },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Дата выдачи', key: 'issued_at', sortable: true },
  { title: 'Выдал', key: 'issued_by', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

// Опции фильтров
const statusOptions = [
  { title: 'Ожидает выдачи', value: 'pending' },
  { title: 'Выдано', value: 'issued' },
  { title: 'Возврат', value: 'returned' }
]

const productTypeOptions = [
  { title: 'Протезы', value: 'prosthesis' },
  { title: 'Ортопедическая обувь', value: 'orthopedic_shoes' },
  { title: 'Инвалидные коляски', value: 'wheelchair' },
  { title: 'Трости', value: 'cane' }
]

// Методы
const loadInvoices = async () => {
  loading.value = true
  try {
    const response = await api.get('/invoices/', { params: filters })
    invoices.value = response.data || []
  } catch (error) {
    console.error('Ошибка загрузки накладных:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await api.get('/reports/')
    stats.value = {
      total: invoices.value.length,
      issued: invoices.value.filter(i => i.status === 'issued').length,
      pending: invoices.value.filter(i => i.status === 'pending').length,
      returns: invoices.value.filter(i => i.status === 'returned').length
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.product_type = ''
  loadInvoices()
}

const viewInvoice = (invoice) => {
  router.push(`/invoices/${invoice.id}`)
}

const viewOrder = (invoice) => {
  router.push(`/orders/${invoice.order_number}`)
}

const editInvoice = (invoice) => {
  router.push(`/invoices/${invoice.id}/edit`)
}

const createInvoice = () => {
  router.push('/invoices/create')
}

const deleteInvoice = (invoice) => {
  selectedInvoice.value = invoice
  deleteDialog.value = true
}

const issueInvoice = (invoice) => {
  selectedInvoice.value = invoice
  issueDialog.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/invoices/${selectedInvoice.value.id}/`)
    await loadInvoices()
    deleteDialog.value = false
    selectedInvoice.value = null
  } catch (error) {
    console.error('Ошибка удаления:', error)
  }
}

const confirmIssue = async () => {
  try {
    await api.put(`/invoices/${selectedInvoice.value.id}/issue/`)
    await loadInvoices()
    issueDialog.value = false
    selectedInvoice.value = null
  } catch (error) {
    console.error('Ошибка выдачи:', error)
  }
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
    'pending': 'warning',
    'issued': 'success',
    'returned': 'error'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Ожидает выдачи',
    'issued': 'Выдано',
    'returned': 'Возврат'
  }
  return labels[status] || status
}

onMounted(() => {
  loadInvoices()
  loadStats()
})
</script>

<style scoped>
.invoices-page {
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

.invoices-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.create-btn {
  height: 40px;
}

.invoices-table {
  border-radius: 8px;
}

.invoice-number-btn,
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
