<template>
  <div class="create-personal-case-page">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text>
        Назад к списку
      </el-button>
      <h1>Добавление личного дела</h1>
    </div>

    <div class="form-container">
      <!-- 1. Личные данные -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <h3>Личные данные</h3>
        </template>
        <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="ПИН *" prop="pin">
                <div class="pin-input-group">
                  <el-input v-model="form.pin" placeholder="Введите ПИН" />
                  <el-button type="info" size="small">Проверить ПИН</el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Фамилия *" prop="last_name">
                <el-input v-model="form.last_name" placeholder="Введите" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Имя *" prop="first_name">
                <el-input v-model="form.first_name" placeholder="Введите" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Отчество" prop="middle_name">
                <el-input v-model="form.middle_name" placeholder="Введите" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="Дата рождения *" prop="birth_date">
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
            <el-col :span="6">
              <el-form-item label="Пол *" prop="sex">
                <el-select v-model="form.sex" placeholder="Выберите" style="width: 100%">
                  <el-option label="Мужской" value="M" />
                  <el-option label="Женский" value="F" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Адрес регистрации *" prop="address_registration">
                <el-input 
                  v-model="form.address_registration" 
                  placeholder="Область, район, город/село, улица, дом, кв." 
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="Адрес проживания" prop="address_actual">
                <el-input 
                  v-model="form.address_actual" 
                  placeholder="Если отличается от регистрации" 
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 2. Документы -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <h3>Документы</h3>
        </template>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Тип документа *" prop="document_type">
              <el-select v-model="form.document_type" placeholder="Выберите" style="width: 100%">
                <el-option label="Паспорт" value="passport" />
                <el-option label="Свидетельство о рождении" value="birth_certificate" />
                <el-option label="Иной документ" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Серия" prop="document_series">
              <el-input v-model="form.document_series" placeholder="AA" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Номер *" prop="document_number">
              <el-input v-model="form.document_number" placeholder="0000000" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Кем выдан" prop="document_issued_by">
              <el-input v-model="form.document_issued_by" placeholder="Орган выдачи" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Дата выдачи" prop="document_issue_date">
              <el-date-picker
                v-model="form.document_issue_date"
                type="date"
                placeholder="Выберите дату"
                style="width: 100%"
                format="DD.MM.YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Срок действия" prop="document_expiry_date">
              <el-date-picker
                v-model="form.document_expiry_date"
                type="date"
                placeholder="Выберите дату"
                style="width: 100%"
                format="DD.MM.YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 3. Контакты и представители -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <h3>Контакты и представитель</h3>
        </template>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Телефон *" prop="phone">
              <el-input v-model="form.phone" placeholder="+996 ___ __ __ __" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" placeholder="user@example.com" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ФИО законного представителя" prop="representative_name">
              <el-input 
                v-model="form.representative_name" 
                placeholder="Если заявитель несовершеннолетний/недееспособный" 
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Документ представителя" prop="representative_document">
              <el-input v-model="form.representative_document" placeholder="Доверенность № ..." />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Телефон представителя" prop="representative_phone">
              <el-input v-model="form.representative_phone" placeholder="+996 ___ __ __ __" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 4. Инвалидность и ИПРА -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <h3>Инвалидность и ИПРА</h3>
        </template>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Группа инвалидности *" prop="disability_group">
              <el-select v-model="form.disability_group" placeholder="Выберите" style="width: 100%">
                <el-option label="Не установлена" value="NONE" />
                <el-option label="I группа" value="I" />
                <el-option label="II группа" value="II" />
                <el-option label="III группа" value="III" />
                <el-option label="Ребёнок-инвалид" value="CHILD" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="МСЭК №" prop="msek_number">
              <el-input v-model="form.msek_number" placeholder="Номер справки" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="ИПРА №" prop="ipra_number">
              <el-input v-model="form.ipra_number" placeholder="Номер ИПРА" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="Срок действия ИПРА" prop="ipra_valid_to">
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
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Перечень рекомендованных ТСР (из ИПРА)" prop="tsr_list">
              <el-input 
                v-model="form.tsr_list" 
                type="textarea" 
                :rows="3"
                placeholder="Например: протез бедра, ортопедическая обувь ..." 
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 5. Медицинские данные -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <h3>Медицинские данные</h3>
        </template>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Диагноз (МКБ)" prop="diagnosis">
              <el-input v-model="form.diagnosis" placeholder="Например, G82.2" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Первичный/вторичный случай *" prop="case_type">
              <el-select v-model="form.case_type" placeholder="Выберите" style="width: 100%">
                <el-option label="Первичный" value="primary" />
                <el-option label="Вторичный" value="secondary" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Срочность" prop="urgency">
              <el-select v-model="form.urgency" placeholder="Выберите" style="width: 100%">
                <el-option label="Обычный" value="normal" />
                <el-option label="Срочный" value="urgent" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Направление врача" prop="doctor_referral">
              <el-input v-model="form.doctor_referral" placeholder="№ и дата направления" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Примечания врача" prop="doctor_notes">
              <el-input 
                v-model="form.doctor_notes" 
                type="textarea" 
                :rows="3"
                placeholder="Осмотр, антропометрия, особые указания" 
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 6. Файлы и сканы -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <h3>Файлы и сканы</h3>
        </template>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Загрузить файлы" prop="files">
              <el-upload
                v-model:file-list="fileList"
                action="#"
                :auto-upload="false"
                multiple
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
              >
                <el-button type="primary">Выбрать файлы</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    Допустимые: PDF, JPG, PNG. Не более 10МБ на файл.
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Описание" prop="files_description">
              <el-input 
                v-model="form.files_description" 
                placeholder="Перечень загружаемых документов" 
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 7. История обращений -->
      <el-card class="form-section" shadow="never">
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

      <!-- Actions -->
      <el-card class="form-section" shadow="never">
        <div class="actions-container">
          <div class="actions-left">
            <el-button @click="handleSave" :loading="loading" size="large">
              Сохранить личное дело
            </el-button>
            <el-button type="primary" @click="handleSaveAndOpen" :loading="loading" size="large">
              Сохранить и открыть дело
            </el-button>
          </div>
          <div class="actions-right">
            <el-button @click="goBack" size="large">
              Отмена
            </el-button>
            <el-button type="success" @click="handleCreateOrder" :loading="loading" size="large">
              Создать заказ из дела
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules, type UploadFile } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { usePersonalCasesStore } from '@/stores/personalCases'
import type { PersonalCaseCreate } from '@/api/personalCases'

const router = useRouter()
const store = usePersonalCasesStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const fileList = ref<UploadFile[]>([])

// Расширенная форма с новыми полями
const form = reactive({
  // Личные данные
  pin: '',
  last_name: '',
  first_name: '',
  middle_name: '',
  birth_date: '',
  sex: '',
  address_registration: '',
  address_actual: '',
  
  // Документы
  document_type: '',
  document_series: '',
  document_number: '',
  document_issued_by: '',
  document_issue_date: '',
  document_expiry_date: '',
  
  // Контакты
  phone: '',
  email: '',
  representative_name: '',
  representative_document: '',
  representative_phone: '',
  
  // Инвалидность
  disability_group: 'NONE',
  msek_number: '',
  msek_date: '',
  ipra_number: '',
  ipra_date: '',
  ipra_valid_to: '',
  tsr_list: '',
  
  // Медицинские данные
  diagnosis: '',
  case_type: '',
  urgency: 'normal',
  doctor_referral: '',
  doctor_notes: '',
  
  // Файлы
  files_description: ''
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
  birth_date: [
    { required: true, message: 'Дата рождения обязательна', trigger: 'change' }
  ],
  sex: [
    { required: true, message: 'Выберите пол', trigger: 'change' }
  ],
  address_registration: [
    { required: true, message: 'Адрес регистрации обязателен', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Телефон обязателен', trigger: 'blur' }
  ],
  disability_group: [
    { required: true, message: 'Выберите группу инвалидности', trigger: 'change' }
  ],
  document_type: [
    { required: true, message: 'Выберите тип документа', trigger: 'change' }
  ],
  document_number: [
    { required: true, message: 'Номер документа обязателен', trigger: 'blur' }
  ],
  case_type: [
    { required: true, message: 'Выберите тип случая', trigger: 'change' }
  ]
}

const historyData = ref([])

const goBack = () => {
  router.push('/personal-cases')
}

const handleFileChange = (file: UploadFile) => {
  // Обработка загрузки файлов
  console.log('File changed:', file)
}

const handleFileRemove = (file: UploadFile) => {
  // Обработка удаления файлов
  console.log('File removed:', file)
}

const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // Преобразуем форму в формат API
    const personalCaseData: PersonalCaseCreate = {
      pin: form.pin,
      last_name: form.last_name,
      first_name: form.first_name,
      middle_name: form.middle_name,
      sex: form.sex as 'M' | 'F',
      birth_date: form.birth_date,
      address_registration: form.address_registration,
      address_actual: form.address_actual,
      phone: form.phone,
      email: form.email,
      disability_group: form.disability_group as 'I' | 'II' | 'III' | 'CHILD' | 'NONE',
      msek_number: form.msek_number,
      msek_date: form.msek_date,
      ipra_number: form.ipra_number,
      ipra_date: form.ipra_date,
      ipra_valid_to: form.ipra_valid_to,
      notes: form.doctor_notes
    }

    await store.createCase(personalCaseData)
    ElMessage.success('Личное дело успешно создано')
    router.push('/personal-cases')
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('Ошибка при создании личного дела')
    }
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSaveAndOpen = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const personalCaseData: PersonalCaseCreate = {
      pin: form.pin,
      last_name: form.last_name,
      first_name: form.first_name,
      middle_name: form.middle_name,
      sex: form.sex as 'M' | 'F',
      birth_date: form.birth_date,
      address_registration: form.address_registration,
      address_actual: form.address_actual,
      phone: form.phone,
      email: form.email,
      disability_group: form.disability_group as 'I' | 'II' | 'III' | 'CHILD' | 'NONE',
      msek_number: form.msek_number,
      msek_date: form.msek_date,
      ipra_number: form.ipra_number,
      ipra_date: form.ipra_date,
      ipra_valid_to: form.ipra_valid_to,
      notes: form.doctor_notes
    }

         const result = await store.createCase(personalCaseData)
     ElMessage.success('Личное дело успешно создано')
     router.push(`/personal-cases/${result.id}`)
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('Ошибка при создании личного дела')
    }
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCreateOrder = () => {
  ElMessage.info('Функция создания заказа будет реализована позже')
}
</script>

<style scoped>
.create-personal-case-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f3f5f7;
  min-height: 100vh;
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
  color: #1e2a3a;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-section {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.form-section :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbfd;
}

.form-section :deep(.el-card__body) {
  padding: 20px;
}

.form-section h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e2a3a;
}

.pin-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pin-input-group .el-input {
  flex: 1;
}

.empty-history {
  padding: 40px 0;
  text-align: center;
}

.actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.actions-left,
.actions-right {
  display: flex;
  gap: 12px;
}

:deep(.el-form-item__label) {
  font-size: 13px;
  color: #6b778c;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

:deep(.el-textarea__inner) {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 10px;
}

:deep(.el-date-editor) {
  border-radius: 10px;
}

:deep(.el-button) {
  border-radius: 10px;
  font-weight: 600;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload__tip) {
  font-size: 12px;
  color: #6b778c;
  margin-top: 8px;
}

@media (max-width: 1200px) {
  .actions-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .actions-left,
  .actions-right {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .create-personal-case-page {
    padding: 16px;
  }
  
  .actions-left,
  .actions-right {
    flex-direction: column;
  }
}
</style>
