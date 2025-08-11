<template>
  <div class="edit-personal-case-page">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text>
        Назад к списку
      </el-button>
      <h1>Редактирование личного дела</h1>
    </div>

    <el-card class="form-card" shadow="never">
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="180px" 
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <!-- Основная информация -->
        <div class="form-section">
          <h3>Основная информация</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="ПИН" prop="pin">
                <el-input v-model="form.pin" placeholder="Введите ПИН" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Фамилия" prop="last_name">
                <el-input v-model="form.last_name" placeholder="Введите фамилию" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Имя" prop="first_name">
                <el-input v-model="form.first_name" placeholder="Введите имя" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Отчество" prop="middle_name">
                <el-input v-model="form.middle_name" placeholder="Введите отчество" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Пол" prop="sex">
                <el-select v-model="form.sex" placeholder="Выберите пол" style="width: 100%">
                  <el-option label="Мужской" value="M" />
                  <el-option label="Женский" value="F" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Дата рождения" prop="birth_date">
                <el-date-picker
                  v-model="form.birth_date"
                  type="date"
                  placeholder="Выберите дату"
                  style="width: 100%"
                  format="DD.MM.YYYY"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- Контактная информация -->
        <div class="form-section">
          <h3>Контактная информация</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Адрес регистрации" prop="address_registration">
                <el-input 
                  v-model="form.address_registration" 
                  type="textarea" 
                  :rows="3"
                  placeholder="Введите адрес регистрации" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Адрес фактического проживания" prop="address_actual">
                <el-input 
                  v-model="form.address_actual" 
                  type="textarea" 
                  :rows="3"
                  placeholder="Введите адрес фактического проживания" 
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Телефон" prop="phone">
                <el-input v-model="form.phone" placeholder="Введите номер телефона" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Email" prop="email">
                <el-input v-model="form.email" placeholder="Введите email" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- Информация об инвалидности -->
        <div class="form-section">
          <h3>Информация об инвалидности</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Группа инвалидности" prop="disability_group">
                <el-select v-model="form.disability_group" placeholder="Выберите группу" style="width: 100%">
                  <el-option label="I группа" value="I" />
                  <el-option label="II группа" value="II" />
                  <el-option label="III группа" value="III" />
                  <el-option label="Ребенок-инвалид" value="CHILD" />
                  <el-option label="Нет инвалидности" value="NONE" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Номер МСЭК" prop="msek_number">
                <el-input v-model="form.msek_number" placeholder="Введите номер МСЭК" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Дата МСЭК" prop="msek_date">
                <el-date-picker
                  v-model="form.msek_date"
                  type="date"
                  placeholder="Выберите дату"
                  style="width: 100%"
                  format="DD.MM.YYYY"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Номер ИПРА" prop="ipra_number">
                <el-input v-model="form.ipra_number" placeholder="Введите номер ИПРА" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Дата ИПРА" prop="ipra_date">
                <el-date-picker
                  v-model="form.ipra_date"
                  type="date"
                  placeholder="Выберите дату"
                  style="width: 100%"
                  format="DD.MM.YYYY"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="ИПРА действует до" prop="ipra_valid_to">
                <el-date-picker
                  v-model="form.ipra_valid_to"
                  type="date"
                  placeholder="Выберите дату"
                  style="width: 100%"
                  format="DD.MM.YYYY"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- Дополнительная информация -->
        <div class="form-section">
          <h3>Дополнительная информация</h3>
          <el-form-item label="Примечания" prop="notes">
            <el-input 
              v-model="form.notes" 
              type="textarea" 
              :rows="4"
              placeholder="Введите дополнительные примечания" 
            />
          </el-form-item>
        </div>

        <!-- Действия -->
        <div class="form-actions">
          <el-button @click="goBack" size="large">
            Отмена
          </el-button>
          <el-button 
            type="primary" 
            size="large" 
            :loading="loading"
            @click="handleSubmit"
          >
            Сохранить изменения
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { usePersonalCasesStore } from '@/stores/personalCases'
import type { PersonalCaseUpdate } from '@/api/personalCases'

const route = useRoute()
const router = useRouter()
const store = usePersonalCasesStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<PersonalCaseUpdate>({
  pin: '',
  last_name: '',
  first_name: '',
  middle_name: '',
  sex: 'M',
  birth_date: '',
  address_registration: '',
  address_actual: '',
  phone: '',
  email: '',
  disability_group: 'NONE',
  msek_number: '',
  msek_date: '',
  ipra_number: '',
  ipra_date: '',
  ipra_valid_to: '',
  notes: ''
})

const rules: FormRules = {
  pin: [
    { required: true, message: 'ПИН обязателен', trigger: 'blur' },
    { min: 14, max: 14, message: 'ПИН должен содержать 14 символов', trigger: 'blur' }
  ],
  last_name: [
    { required: true, message: 'Фамилия обязательна', trigger: 'blur' }
  ],
  first_name: [
    { required: true, message: 'Имя обязательно', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: 'Выберите пол', trigger: 'change' }
  ],
  birth_date: [
    { required: true, message: 'Дата рождения обязательна', trigger: 'change' }
  ],
  address_registration: [
    { required: true, message: 'Адрес регистрации обязателен', trigger: 'blur' }
  ],
  disability_group: [
    { required: true, message: 'Выберите группу инвалидности', trigger: 'change' }
  ]
}

const goBack = () => {
  router.push('/personal-cases')
}

const loadPersonalCase = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('ID личного дела не найден')
    goBack()
    return
  }

  try {
    loading.value = true
    await store.fetchCaseById(id)
    const personalCase = store.getCurrentCase
    
    if (!personalCase) {
      ElMessage.error('Личное дело не найдено')
      goBack()
      return
    }

    // Заполняем форму данными
    Object.assign(form, {
      pin: personalCase.pin,
      last_name: personalCase.last_name,
      first_name: personalCase.first_name,
      middle_name: personalCase.middle_name || '',
      sex: personalCase.sex,
      birth_date: personalCase.birth_date,
      address_registration: personalCase.address_registration,
      address_actual: personalCase.address_actual || '',
      phone: personalCase.phone || '',
      email: personalCase.email || '',
      disability_group: personalCase.disability_group,
      msek_number: personalCase.msek_number || '',
      msek_date: personalCase.msek_date || '',
      ipra_number: personalCase.ipra_number || '',
      ipra_date: personalCase.ipra_date || '',
      ipra_valid_to: personalCase.ipra_valid_to || '',
      notes: personalCase.notes || ''
    })
  } catch (error) {
    ElMessage.error('Ошибка при загрузке личного дела')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const id = route.params.id as string
    await store.updateCase(id, form)
    
    ElMessage.success('Личное дело успешно обновлено')
    router.push(`/personal-cases/${id}`)
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('Ошибка при обновлении личного дела')
    }
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPersonalCase()
})
</script>

<style scoped>
.edit-personal-case-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.form-card {
  margin-bottom: 24px;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-date-editor) {
  border-radius: 6px;
}
</style>
