<template>
  <div class="create-personal-file-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      Главная / Личные дела / <strong>Добавление личного дела</strong>
    </div>

    <!-- Заголовок страницы -->
    <h1 class="page-title">Добавление личного дела</h1>

    <div class="grid">
      <!-- 1. Личные данные -->
      <v-card class="form-card">
        <v-card-title>Личные данные</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.pin"
                label="ПИН *"
                placeholder="Введите ПИН"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-btn
                variant="outlined"
                @click="checkPin"
                class="check-pin-btn"
              >
                Проверить ПИН
              </v-btn>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.last_name"
                label="Фамилия *"
                placeholder="Введите"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.first_name"
                label="Имя *"
                placeholder="Введите"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.middle_name"
                label="Отчество"
                placeholder="Введите"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.birth_date"
                label="Дата рождения *"
                type="date"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="form.gender"
                label="Пол *"
                :items="genderOptions"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.registration_address"
                label="Адрес регистрации *"
                placeholder="Область, район, город/село, улица, дом, кв."
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.residence_address"
                label="Адрес проживания"
                placeholder="Если отличается от регистрации"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 2. Документы -->
      <v-card class="form-card">
        <v-card-title>Документы</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <v-select
                v-model="form.document_type"
                label="Тип документа *"
                :items="documentTypeOptions"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.document_series"
                label="Серия"
                placeholder="AA"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.document_number"
                label="Номер *"
                placeholder="0000000"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.document_issued_by"
                label="Кем выдан"
                placeholder="Орган выдачи"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.document_issue_date"
                label="Дата выдачи"
                type="date"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.document_expiry_date"
                label="Срок действия"
                type="date"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 3. Контакты и представители -->
      <v-card class="form-card">
        <v-card-title>Контакты и представитель</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.phone"
                label="Телефон *"
                placeholder="+996 ___ __ __ __"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.email"
                label="Email"
                placeholder="user@example.com"
                type="email"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.representative_name"
                label="ФИО законного представителя"
                placeholder="Если заявитель несовершеннолетний/недееспособный"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.representative_document"
                label="Документ представителя"
                placeholder="Доверенность № ..."
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.representative_phone"
                label="Телефон представителя"
                placeholder="+996 ___ __ __ __"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 4. Инвалидность и ИПРА -->
      <v-card class="form-card">
        <v-card-title>Инвалидность и ИПРА</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <v-select
                v-model="form.disability_group"
                label="Группа инвалидности *"
                :items="disabilityGroupOptions"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.msek_number"
                label="МСЭК №"
                placeholder="Номер справки"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.msek_date"
                label="Дата МСЭК"
                type="date"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.ipra_number"
                label="ИПРА №"
                placeholder="Номер ИПРА"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.ipra_date"
                label="Дата ИПРА"
                type="date"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.ipra_expiry_date"
                label="Срок действия ИПРА"
                type="date"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                v-model="form.recommended_devices"
                label="Перечень рекомендованных ТСР (из ИПРА)"
                placeholder="Например: протез бедра, ортопедическая обувь ..."
                variant="outlined"
                density="compact"
                rows="3"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 5. Медицинские данные -->
      <v-card class="form-card">
        <v-card-title>Медицинские данные</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.diagnosis"
                label="Диагноз (МКБ)"
                placeholder="Например, G82.2"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="form.case_type"
                label="Первичный/вторичный случай *"
                :items="caseTypeOptions"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="form.urgency"
                label="Срочность"
                :items="urgencyOptions"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="form.doctor_referral"
                label="Направление врача"
                placeholder="№ и дата направления"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                v-model="form.doctor_notes"
                label="Примечания врача"
                placeholder="Осмотр, антропометрия, особые указания"
                variant="outlined"
                density="compact"
                rows="3"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 6. Файлы и сканы -->
      <v-card class="form-card">
        <v-card-title>Файлы и сканы</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="form.files"
                label="Загрузить файлы"
                multiple
                variant="outlined"
                density="compact"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon="mdi-file-upload"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.files_description"
                label="Описание"
                placeholder="Перечень загружаемых документов"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <v-alert
                type="info"
                variant="tonal"
                density="compact"
              >
                Допустимые: PDF, JPG, PNG. Не более 10МБ на файл.
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 7. История обращений -->
      <v-card class="form-card">
        <v-card-title>История обращений</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="historyHeaders"
            :items="historyItems"
            :loading="loading"
            class="history-table"
            hover
          >
            <template v-slot:no-data>
              <div class="text-center pa-4">
                <v-icon size="48" color="muted">mdi-history</v-icon>
                <p class="text-muted mt-2">История обращений пуста</p>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Actions -->
      <v-card class="form-card">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div class="actions-row">
                <div class="left-actions">
                  <v-btn
                    variant="outlined"
                    @click="savePersonalFile"
                    :loading="saving"
                    class="action-btn"
                  >
                    Сохранить личное дело
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="saveAndOpenPersonalFile"
                    :loading="saving"
                    class="action-btn"
                  >
                    Сохранить и открыть дело
                  </v-btn>
                </div>
                <div class="right-actions">
                  <v-btn
                    variant="outlined"
                    @click="cancel"
                    class="action-btn"
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="createOrderFromFile"
                    :disabled="!form.id"
                    class="action-btn"
                  >
                    Создать заказ из дела
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const router = useRouter()

// Состояние
const loading = ref(false)
const saving = ref(false)

// Форма
const form = reactive({
  // Личные данные
  pin: '',
  last_name: '',
  first_name: '',
  middle_name: '',
  birth_date: '',
  gender: '',
  registration_address: '',
  residence_address: '',
  
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
  disability_group: '',
  msek_number: '',
  msek_date: '',
  ipra_number: '',
  ipra_date: '',
  ipra_expiry_date: '',
  recommended_devices: '',
  
  // Медицинские данные
  diagnosis: '',
  case_type: '',
  urgency: '',
  doctor_referral: '',
  doctor_notes: '',
  
  // Файлы
  files: [],
  files_description: ''
})

// Опции для селектов
const genderOptions = [
  { title: 'Мужской', value: 'male' },
  { title: 'Женский', value: 'female' }
]

const documentTypeOptions = [
  { title: 'Паспорт', value: 'passport' },
  { title: 'Свидетельство о рождении', value: 'birth_certificate' },
  { title: 'Иной документ', value: 'other' }
]

const disabilityGroupOptions = [
  { title: 'Не установлена', value: 'none' },
  { title: 'I', value: '1' },
  { title: 'II', value: '2' },
  { title: 'III', value: '3' },
  { title: 'Ребёнок-инвалид', value: 'child' }
]

const caseTypeOptions = [
  { title: 'Первичный', value: 'primary' },
  { title: 'Вторичный', value: 'secondary' }
]

const urgencyOptions = [
  { title: 'Обычный', value: 'normal' },
  { title: 'Срочный', value: 'urgent' }
]

// Заголовки таблицы истории
const historyHeaders = [
  { title: 'Дата', key: 'date', sortable: true },
  { title: 'Тип', key: 'type', sortable: true },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Комментарий', key: 'comment', sortable: true }
]

const historyItems = ref([])

// Методы
const checkPin = async () => {
  if (!form.pin) {
    alert('Введите ПИН для проверки')
    return
  }
  
  loading.value = true
  try {
    // Здесь будет проверка ПИН через API
    console.log('Проверка ПИН:', form.pin)
    alert('ПИН проверен')
  } catch (error) {
    console.error('Ошибка проверки ПИН:', error)
  } finally {
    loading.value = false
  }
}

const savePersonalFile = async () => {
  saving.value = true
  try {
    const response = await api.post('/personal-files/', form)
    console.log('Личное дело сохранено:', response.data)
    alert('Личное дело успешно сохранено')
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    alert('Ошибка при сохранении личного дела')
  } finally {
    saving.value = false
  }
}

const saveAndOpenPersonalFile = async () => {
  saving.value = true
  try {
    const response = await api.post('/personal-files/', form)
    console.log('Личное дело сохранено и открыто:', response.data)
    router.push(`/personal-files/${response.data.id}`)
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    alert('Ошибка при сохранении личного дела')
  } finally {
    saving.value = false
  }
}

const cancel = () => {
  router.push('/')
}

const createOrderFromFile = () => {
  if (!form.id) {
    alert('Сначала сохраните личное дело')
    return
  }
  router.push(`/orders/create?personal_file=${form.id}`)
}
</script>

<style scoped>
.create-personal-file-page {
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

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 42, 58, 0.08);
}

.check-pin-btn {
  height: 40px;
  margin-top: 8px;
}

.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.left-actions,
.right-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  height: 40px;
}

.history-table {
  border-radius: 8px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .actions-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .left-actions,
  .right-actions {
    width: 100%;
    justify-content: center;
  }
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
</style>
