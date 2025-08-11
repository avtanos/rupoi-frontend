<template>
  <div class="personal-case-view-page">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text>
        Назад к списку
      </el-button>
      <h1>Личное дело №{{ personalCase?.number }}</h1>
      <div class="header-actions">
        <el-button @click="handleEdit" :icon="Edit" type="primary">
          Редактировать
        </el-button>
        <el-button @click="handleCreateOrder" :icon="Plus" type="success">
          Создать заказ
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="personalCase" class="case-content">
      <!-- 1. Личные данные -->
      <el-card class="info-section" shadow="never">
        <template #header>
          <h3>Личные данные</h3>
        </template>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="info-item">
              <label>ПИН</label>
              <div class="value">{{ personalCase.pin }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>ФИО</label>
              <div class="value">{{ getFullName(personalCase) }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Дата рождения</label>
              <div class="value">{{ formatDate(personalCase.birth_date) }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Пол</label>
              <div class="value">{{ personalCase.sex === 'M' ? 'Мужской' : 'Женский' }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="info-item">
              <label>Адрес регистрации</label>
              <div class="value">{{ personalCase.address_registration }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>Адрес проживания</label>
              <div class="value">{{ personalCase.address_actual || 'Не указан' }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 2. Документы -->
      <el-card class="info-section" shadow="never">
        <template #header>
          <h3>Документы</h3>
        </template>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="info-item">
              <label>Тип документа</label>
              <div class="value">Паспорт</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Серия</label>
              <div class="value">AA</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Номер</label>
              <div class="value">1234567</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Кем выдан</label>
              <div class="value">УВД г. Бишкек</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="info-item">
              <label>Дата выдачи</label>
              <div class="value">01.01.2020</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Срок действия</label>
              <div class="value">01.01.2030</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 3. Контакты и представители -->
      <el-card class="info-section" shadow="never">
        <template #header>
          <h3>Контакты и представитель</h3>
        </template>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="info-item">
              <label>Телефон</label>
              <div class="value">{{ personalCase.phone || 'Не указан' }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Email</label>
              <div class="value">{{ personalCase.email || 'Не указан' }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>ФИО законного представителя</label>
              <div class="value">Не указан</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="info-item">
              <label>Документ представителя</label>
              <div class="value">Не указан</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Телефон представителя</label>
              <div class="value">Не указан</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 4. Инвалидность и ИПРА -->
      <el-card class="info-section" shadow="never">
        <template #header>
          <h3>Инвалидность и ИПРА</h3>
        </template>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="info-item">
              <label>Группа инвалидности</label>
              <div class="value">
                <el-tag :type="getDisabilityGroupType(personalCase.disability_group)">
                  {{ getDisabilityGroupLabel(personalCase.disability_group) }}
                </el-tag>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>МСЭК №</label>
              <div class="value">{{ personalCase.msek_number || 'Не указан' }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Дата МСЭК</label>
              <div class="value">{{ personalCase.msek_date ? formatDate(personalCase.msek_date) : 'Не указана' }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>ИПРА №</label>
              <div class="value">{{ personalCase.ipra_number || 'Не указан' }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="info-item">
              <label>Дата ИПРА</label>
              <div class="value">{{ personalCase.ipra_date ? formatDate(personalCase.ipra_date) : 'Не указана' }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Срок действия ИПРА</label>
              <div class="value">{{ personalCase.ipra_valid_to ? formatDate(personalCase.ipra_valid_to) : 'Не указан' }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="info-item">
              <label>Перечень рекомендованных ТСР (из ИПРА)</label>
              <div class="value">Не указан</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 5. Медицинские данные -->
      <el-card class="info-section" shadow="never">
        <template #header>
          <h3>Медицинские данные</h3>
        </template>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="info-item">
              <label>Диагноз (МКБ)</label>
              <div class="value">Не указан</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Первичный/вторичный случай</label>
              <div class="value">Первичный</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Срочность</label>
              <div class="value">
                <el-tag type="info">Обычный</el-tag>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <label>Направление врача</label>
              <div class="value">Не указано</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="info-item">
              <label>Примечания врача</label>
              <div class="value">{{ personalCase.notes || 'Не указаны' }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 6. Файлы и сканы -->
      <el-card class="info-section" shadow="never">
        <template #header>
          <h3>Файлы и сканы</h3>
        </template>
        <div class="files-section">
          <el-empty description="Файлы не загружены" />
        </div>
      </el-card>

      <!-- 7. История обращений -->
      <el-card class="info-section" shadow="never">
        <template #header>
          <h3>История обращений</h3>
        </template>
        <el-table :data="historyData" style="width: 100%">
          <el-table-column prop="date" label="Дата" width="160" />
          <el-table-column prop="type" label="Тип" />
          <el-table-column prop="status" label="Статус" />
          <el-table-column prop="comment" label="Комментарий" />
        </el-table>
        <div v-if="historyData.length === 0" class="empty-history">
          <el-empty description="История обращений пуста" />
        </div>
      </el-card>
    </div>

    <div v-else class="error-container">
      <el-empty description="Личное дело не найдено" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Plus } from '@element-plus/icons-vue'
import { usePersonalCasesStore } from '@/stores/personalCases'
import type { PersonalCase } from '@/api/personalCases'

const route = useRoute()
const router = useRouter()
const store = usePersonalCasesStore()

const loading = ref(false)
const personalCase = computed(() => store.getCurrentCase)
const historyData = ref([])

const goBack = () => {
  router.push('/personal-cases')
}

const handleEdit = () => {
  if (personalCase.value) {
    router.push(`/personal-cases/${personalCase.value.id}/edit`)
  }
}

const handleCreateOrder = () => {
  ElMessage.info('Функция создания заказа будет реализована позже')
}

const getFullName = (case_: PersonalCase | null) => {
  if (!case_) return ''
  const parts = [case_.last_name, case_.first_name, case_.middle_name].filter(Boolean)
  return parts.join(' ')
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}

const getDisabilityGroupLabel = (group: string | undefined) => {
  if (!group) return 'Не указана'
  const labels = {
    'I': 'I группа',
    'II': 'II группа', 
    'III': 'III группа',
    'CHILD': 'Ребёнок-инвалид',
    'NONE': 'Не установлена'
  }
  return labels[group as keyof typeof labels] || 'Не указана'
}

const getDisabilityGroupType = (group: string | undefined) => {
  if (!group) return 'info'
  const types = {
    'I': 'danger',
    'II': 'warning',
    'III': 'success',
    'CHILD': 'warning',
    'NONE': 'info'
  }
  return types[group as keyof typeof types] || 'info'
}

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('ID личного дела не найден')
    goBack()
    return
  }

  try {
    loading.value = true
    await store.fetchCaseById(id)
    
    if (!store.getCurrentCase) {
      ElMessage.error('Личное дело не найдено')
      goBack()
    }
  } catch (error) {
    ElMessage.error('Ошибка при загрузке личного дела')
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.personal-case-view-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f3f5f7;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1e2a3a;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.case-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-section {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.info-section :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbfd;
}

.info-section :deep(.el-card__body) {
  padding: 20px;
}

.info-section h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e2a3a;
}

.info-item {
  margin-bottom: 16px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item label {
  display: block;
  font-size: 13px;
  color: #6b778c;
  font-weight: 500;
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 14px;
  color: #1e2a3a;
  font-weight: 500;
}

.files-section {
  padding: 40px 0;
  text-align: center;
}

.empty-history {
  padding: 40px 0;
  text-align: center;
}

.loading-container {
  padding: 40px;
}

.error-container {
  padding: 40px;
  text-align: center;
}

:deep(.el-tag) {
  border-radius: 6px;
}

@media (max-width: 768px) {
  .personal-case-view-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
}
</style>
