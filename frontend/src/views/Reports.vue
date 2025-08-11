<template>
  <div class="reports-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      Главная / <strong>Отчёты</strong>
    </div>

    <!-- Заголовок страницы -->
    <h1 class="page-title">Отчёты</h1>

    <!-- Карточки с общими показателями -->
    <div class="data-cards">
      <div class="data-card">
        <h4>Всего личных дел</h4>
        <div class="value">{{ stats.personal_files?.total || 0 }}</div>
        <div class="trend">+5 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Активных заказов</h4>
        <div class="value">{{ stats.orders?.in_production || 0 }}</div>
        <div class="trend">+3 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Позиций на складе</h4>
        <div class="value">{{ stats.warehouse?.total_items || 0 }}</div>
        <div class="trend">+5 за неделю</div>
      </div>
      <div class="data-card">
        <h4>Низкий запас</h4>
        <div class="value">{{ stats.warehouse?.low_stock || 0 }}</div>
        <div class="trend">+2 за неделю</div>
      </div>
    </div>

    <!-- Фильтры отчетов -->
    <v-card class="filters-card">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.report_type"
              label="Тип отчёта"
              :items="reportTypeOptions"
              @update:model-value="generateReport"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.period"
              label="Период"
              :items="periodOptions"
              @update:model-value="generateReport"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.start_date"
              label="Дата начала"
              type="date"
              @update:model-value="generateReport"
              variant="outlined"
              density="compact"
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.end_date"
              label="Дата окончания"
              type="date"
              @update:model-value="generateReport"
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Отчеты -->
    <div class="reports-grid">
      <!-- Отчет по личным делам -->
      <v-card class="report-card">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>
            <v-icon color="primary" class="mr-2">mdi-folder-account</v-icon>
            Личные дела
          </span>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="exportReport('personal_files')"
          >
            Экспорт
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <div class="report-stats">
            <div class="stat-item">
              <span class="stat-label">Всего дел:</span>
              <span class="stat-value">{{ stats.personal_files?.total || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Активных:</span>
              <span class="stat-value">{{ stats.personal_files?.active || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Закрытых:</span>
              <span class="stat-value">{{ stats.personal_files?.closed || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Срочных:</span>
              <span class="stat-value">{{ stats.personal_files?.urgent || 0 }}</span>
            </div>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="report-chart">
            <div class="chart-placeholder">
              <v-icon size="48" color="muted">mdi-chart-pie</v-icon>
              <p>График распределения личных дел</p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Отчет по заказам -->
      <v-card class="report-card">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>
            <v-icon color="primary" class="mr-2">mdi-clipboard-list</v-icon>
            Заказы
          </span>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="exportReport('orders')"
          >
            Экспорт
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <div class="report-stats">
            <div class="stat-item">
              <span class="stat-label">Всего заказов:</span>
              <span class="stat-value">{{ stats.orders?.total || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">В производстве:</span>
              <span class="stat-value">{{ stats.orders?.in_production || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Завершённых:</span>
              <span class="stat-value">{{ stats.orders?.completed || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Ожидающих:</span>
              <span class="stat-value">{{ stats.orders?.pending || 0 }}</span>
            </div>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="report-chart">
            <div class="chart-placeholder">
              <v-icon size="48" color="muted">mdi-chart-line</v-icon>
              <p>График выполнения заказов</p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Отчет по складу -->
      <v-card class="report-card">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>
            <v-icon color="primary" class="mr-2">mdi-warehouse</v-icon>
            Склад
          </span>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="exportReport('warehouse')"
          >
            Экспорт
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <div class="report-stats">
            <div class="stat-item">
              <span class="stat-label">Всего позиций:</span>
              <span class="stat-value">{{ stats.warehouse?.total_items || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Низкий запас:</span>
              <span class="stat-value">{{ stats.warehouse?.low_stock || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Нет в наличии:</span>
              <span class="stat-value">{{ stats.warehouse?.out_of_stock || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Выдано за неделю:</span>
              <span class="stat-value">{{ stats.warehouse?.weekly_issues || 0 }}</span>
            </div>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="report-chart">
            <div class="chart-placeholder">
              <v-icon size="48" color="muted">mdi-chart-bar</v-icon>
              <p>График движения товаров</p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Детальный отчет -->
      <v-card class="report-card full-width">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>
            <v-icon color="primary" class="mr-2">mdi-file-chart</v-icon>
            Детальный отчёт
          </span>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="exportDetailedReport"
          >
            Экспорт
          </v-btn>
      </v-card-title>
      
      <v-card-text>
          <v-data-table
            :headers="detailedHeaders"
            :items="detailedData"
            :loading="loading"
            :items-per-page="10"
            class="detailed-table"
            hover
          >
            <template v-slot:item.category="{ item }">
              <v-chip
                :color="getCategoryColor(item.raw.category)"
                size="small"
                variant="outlined"
              >
                {{ getCategoryLabel(item.raw.category) }}
              </v-chip>
            </template>
            
            <template v-slot:item.value="{ item }">
              <span class="font-weight-bold">{{ item.raw.value }}</span>
            </template>
            
            <template v-slot:item.change="{ item }">
              <span :class="getChangeClass(item.raw.change)">
                {{ item.raw.change > 0 ? '+' : '' }}{{ item.raw.change }}%
              </span>
            </template>
          </v-data-table>
      </v-card-text>
    </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/plugins/axios'

// Состояние
const loading = ref(false)
const stats = ref({})
const detailedData = ref([])

// Фильтры
const filters = reactive({
  report_type: 'all',
  period: 'week',
  start_date: '',
  end_date: ''
})

// Заголовки детальной таблицы
const detailedHeaders = [
  { title: 'Показатель', key: 'indicator', sortable: true },
  { title: 'Категория', key: 'category', sortable: true },
  { title: 'Значение', key: 'value', sortable: true },
  { title: 'Изменение', key: 'change', sortable: true },
  { title: 'Тренд', key: 'trend', sortable: true }
]

// Опции фильтров
const reportTypeOptions = [
  { title: 'Все отчёты', value: 'all' },
  { title: 'Личные дела', value: 'personal_files' },
  { title: 'Заказы', value: 'orders' },
  { title: 'Склад', value: 'warehouse' }
]

const periodOptions = [
  { title: 'Неделя', value: 'week' },
  { title: 'Месяц', value: 'month' },
  { title: 'Квартал', value: 'quarter' },
  { title: 'Год', value: 'year' }
]

// Методы
const loadStats = async () => {
  loading.value = true
  try {
    const response = await api.get('/reports/')
    stats.value = response.data || {}
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  } finally {
    loading.value = false
  }
}

const generateReport = async () => {
  loading.value = true
  try {
    // Генерируем детальные данные на основе фильтров
    detailedData.value = [
      {
        indicator: 'Новые личные дела',
        category: 'personal_files',
        value: stats.value.personal_files?.weekly_change?.total || 0,
        change: 12,
        trend: 'up'
      },
      {
        indicator: 'Активные заказы',
        category: 'orders',
        value: stats.value.orders?.in_production || 0,
        change: 8,
        trend: 'up'
      },
      {
        indicator: 'Завершённые заказы',
        category: 'orders',
        value: stats.value.orders?.completed || 0,
        change: 15,
        trend: 'up'
      },
      {
        indicator: 'Выдачи со склада',
        category: 'warehouse',
        value: stats.value.warehouse?.weekly_issues || 0,
        change: -3,
        trend: 'down'
      },
      {
        indicator: 'Низкий запас',
        category: 'warehouse',
        value: stats.value.warehouse?.low_stock || 0,
        change: 5,
        trend: 'up'
      }
    ]
  } catch (error) {
    console.error('Ошибка генерации отчёта:', error)
  } finally {
    loading.value = false
  }
}

const exportReport = (type) => {
  console.log(`Экспорт отчёта: ${type}`)
  // Здесь будет логика экспорта
}

const exportDetailedReport = () => {
  console.log('Экспорт детального отчёта')
  // Здесь будет логика экспорта
}

const getCategoryColor = (category) => {
  const colors = {
    'personal_files': 'primary',
    'orders': 'success',
    'warehouse': 'warning'
  }
  return colors[category] || 'default'
}

const getCategoryLabel = (category) => {
  const labels = {
    'personal_files': 'Личные дела',
    'orders': 'Заказы',
    'warehouse': 'Склад'
  }
  return labels[category] || category
}

const getChangeClass = (change) => {
  if (change > 0) return 'text-success'
  if (change < 0) return 'text-error'
  return 'text-muted'
}

onMounted(() => {
  loadStats()
  generateReport()
})
</script>

<style scoped>
.reports-page {
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

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.report-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.report-card.full-width {
  grid-column: 1 / -1;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b778c;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e2a3a;
}

.report-chart {
  margin-top: 16px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: #f8fafc;
  border-radius: 8px;
  gap: 8px;
}

.chart-placeholder p {
  margin: 0;
  color: #6b778c;
  font-size: 14px;
}

.detailed-table {
  border-radius: 8px;
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

/* Адаптивность */
@media (max-width: 768px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .report-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
