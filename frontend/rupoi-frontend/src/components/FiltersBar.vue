<template>
  <el-card class="filters-card" shadow="never">
    <el-form :model="filters" inline>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="Поиск">
            <el-input
              v-model="filters.search"
              placeholder="ПИН, ФИО..."
              clearable
              @keyup.enter="applyFilters"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="4">
          <el-form-item label="Группа">
            <el-select
              v-model="filters.disability_group"
              placeholder="Все группы"
              clearable
              style="width: 100%"
            >
              <el-option label="I группа" value="I" />
              <el-option label="II группа" value="II" />
              <el-option label="III группа" value="III" />
              <el-option label="Ребенок-инвалид" value="CHILD" />
              <el-option label="Без группы" value="NONE" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="4">
          <el-form-item label="Дата с">
            <el-date-picker
              v-model="filters.date_from"
              type="date"
              placeholder="Дата с"
              style="width: 100%"
              format="DD.MM.YYYY"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="4">
          <el-form-item label="Дата по">
            <el-date-picker
              v-model="filters.date_to"
              type="date"
              placeholder="Дата по"
              style="width: 100%"
              format="DD.MM.YYYY"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="applyFilters" :loading="loading">
              <el-icon><Search /></el-icon>
              Применить
            </el-button>
            <el-button @click="clearFilters">
              <el-icon><Refresh /></el-icon>
              Сбросить
            </el-button>
            <el-button type="success" @click="createNew">
              <el-icon><Plus /></el-icon>
              Новое дело
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'

interface Filters {
  search?: string
  disability_group?: string
  date_from?: string
  date_to?: string
}

interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  apply: [filters: Filters]
  clear: []
  create: []
}>()

const filters = reactive<Filters>({
  search: '',
  disability_group: '',
  date_from: '',
  date_to: ''
})

const applyFilters = () => {
  emit('apply', { ...filters })
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    disability_group: '',
    date_from: '',
    date_to: ''
  })
  emit('clear')
}

const createNew = () => {
  emit('create')
}
</script>

<style scoped>
.filters-card {
  margin-bottom: 24px;
  border: 1px solid #ebeef5;
}

.filters-card :deep(.el-card__body) {
  padding: 16px;
}

.filters-card :deep(.el-form-item) {
  margin-bottom: 0;
}

.filters-card :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}
</style>
