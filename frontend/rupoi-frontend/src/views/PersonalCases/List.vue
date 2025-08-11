<template>
  <div class="personal-cases-page">
    <div class="page-header">
      <h1>Личные дела</h1>
      <p>Управление личными делами пациентов</p>
    </div>

    <!-- Статистика -->
    <DataCards :statistics="statistics" />

    <!-- Фильтры -->
    <FiltersBar 
      :loading="loading" 
      @apply="handleApplyFilters"
      @clear="handleClearFilters"
      @create="handleCreateNew"
    />

    <!-- Таблица -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <span>Список личных дел ({{ totalCount }})</span>
          <el-button type="primary" @click="handleCreateNew">
            <el-icon><Plus /></el-icon>
            Новое личное дело
          </el-button>
        </div>
      </template>

      <el-table
        :data="cases"
        v-loading="loading"
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <el-table-column prop="number" label="№ дела" width="120" />
        <el-table-column prop="pin" label="ПИН" width="120" />
        <el-table-column label="ФИО" min-width="200">
          <template #default="{ row }">
            {{ `${row.last_name} ${row.first_name} ${row.middle_name || ''}` }}
          </template>
        </el-table-column>
        <el-table-column prop="birth_date" label="Дата рождения" width="120">
          <template #default="{ row }">
            {{ formatDate(row.birth_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="disability_group" label="Группа" width="100">
          <template #default="{ row }">
            <el-tag :type="getDisabilityGroupType(row.disability_group)">
              {{ getDisabilityGroupLabel(row.disability_group) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="Телефон" width="140" />
        <el-table-column prop="created_at" label="Создано" width="120">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Действия" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click.stop="handleView(row)">
                <el-icon><View /></el-icon>
                Просмотр
              </el-button>
              <el-button size="small" type="primary" @click.stop="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                Редактировать
              </el-button>
              <el-button size="small" type="danger" @click.stop="handleDelete(row)">
                <el-icon><Delete /></el-icon>
                Удалить
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- Пагинация -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Диалог подтверждения удаления -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="Подтверждение удаления"
      width="400px"
    >
      <p>Вы действительно хотите удалить личное дело "{{ selectedCase?.number }}"?</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">Отмена</el-button>
        <el-button type="danger" @click="confirmDelete" :loading="loading">
          Удалить
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { usePersonalCasesStore } from '@/stores/personalCases'
import DataCards from '@/components/DataCards.vue'
import FiltersBar from '@/components/FiltersBar.vue'
import type { PersonalCase, PersonalCaseFilters } from '@/api/personalCases'

const router = useRouter()
const store = usePersonalCasesStore()

// Состояние
const deleteDialogVisible = ref(false)
const selectedCase = ref<PersonalCase | null>(null)

// Геттеры из store
const cases = computed(() => store.getCases)
const loading = computed(() => store.isLoading)
const totalCount = computed(() => store.getTotalCount)
const statistics = computed(() => store.statistics)
const currentPage = computed(() => store.currentPage)
const pageSize = computed(() => store.pageSize)

// Методы
const handleApplyFilters = (filters: PersonalCaseFilters) => {
  store.setFilters(filters)
  store.fetchCases()
}

const handleClearFilters = () => {
  store.clearFilters()
  store.fetchCases()
}

const handleCreateNew = () => {
  router.push('/personal-cases/create')
}

const handleRowClick = (row: PersonalCase) => {
  router.push(`/personal-cases/${row.id}`)
}

const handleView = (row: PersonalCase) => {
  router.push(`/personal-cases/${row.id}`)
}

const handleEdit = (row: PersonalCase) => {
  router.push(`/personal-cases/${row.id}/edit`)
}

const handleDelete = (row: PersonalCase) => {
  selectedCase.value = row
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  if (!selectedCase.value) return
  
  try {
    await store.deleteCase(selectedCase.value.id)
    ElMessage.success('Личное дело успешно удалено')
    deleteDialogVisible.value = false
    selectedCase.value = null
  } catch (error) {
    ElMessage.error('Ошибка при удалении личного дела')
  }
}

const handleSizeChange = (size: number) => {
  store.pageSize = size
  store.fetchCases()
}

const handleCurrentChange = (page: number) => {
  store.fetchCases(page)
}

// Вспомогательные методы
const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}

const getDisabilityGroupLabel = (group: string) => {
  const labels = {
    'I': 'I группа',
    'II': 'II группа',
    'III': 'III группа',
    'CHILD': 'Ребенок-инвалид',
    'NONE': 'Без группы'
  }
  return labels[group as keyof typeof labels] || group
}

const getDisabilityGroupType = (group: string) => {
  const types = {
    'I': 'danger',
    'II': 'warning',
    'III': 'info',
    'CHILD': 'success',
    'NONE': ''
  }
  return types[group as keyof typeof types] || ''
}

// Инициализация
onMounted(async () => {
  try {
    await Promise.all([
      store.fetchCases(),
      store.fetchStatistics()
    ])
  } catch (error) {
    ElMessage.error('Ошибка при загрузке данных')
  }
})
</script>

<style scoped>
.personal-cases-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.page-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.table-card {
  border: 1px solid #ebeef5;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header span {
  font-weight: 500;
  color: #303133;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-table) {
  border-radius: 8px;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>
