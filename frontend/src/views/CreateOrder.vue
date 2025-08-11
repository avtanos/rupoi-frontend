<template>
  <div class="create-order-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      Главная / Заказы / <strong>Создание заказа</strong>
    </div>

    <!-- Заголовок страницы -->
    <h1 class="page-title">Создание заказа</h1>

    <div class="grid">
      <!-- 1. Информация о пациенте -->
      <v-card class="form-card">
        <v-card-title>Информация о пациенте</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.patient_search"
                label="Поиск пациента"
                placeholder="ПИН или ФИО"
                variant="outlined"
                density="compact"
                prepend-icon="mdi-magnify"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                variant="outlined"
                @click="searchPatient"
                class="search-btn"
              >
                Найти пациента
              </v-btn>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                color="primary"
                @click="createNewPatient"
                class="create-patient-btn"
              >
                Создать нового пациента
              </v-btn>
            </v-col>
          </v-row>
          
          <!-- Информация о найденном пациенте -->
          <v-row v-if="selectedPatient">
            <v-col cols="12">
              <v-alert
                type="success"
                variant="tonal"
                class="patient-info"
              >
                <div class="patient-details">
                  <strong>{{ selectedPatient.last_name }} {{ selectedPatient.first_name }} {{ selectedPatient.middle_name }}</strong>
                  <br>
                  ПИН: {{ selectedPatient.pin }} | Группа инвалидности: {{ getDisabilityGroupLabel(selectedPatient.disability_group) }}
                  <br>
                  ИПРА: {{ selectedPatient.ipra_number }}
                </div>
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 2. Детали заказа -->
      <v-card class="form-card">
        <v-card-title>Детали заказа</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="form.order_type"
                label="Тип заказа *"
                :items="orderTypeOptions"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="form.product_name"
                label="Название изделия *"
                placeholder="Например: Протез бедра"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="form.priority"
                label="Приоритет *"
                :items="priorityOptions"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="form.estimated_completion"
                label="Дата завершения"
                type="date"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="form.notes"
                label="Примечания"
                placeholder="Дополнительная информация о заказе"
                variant="outlined"
                density="compact"
                rows="3"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="form.specifications"
                label="Технические требования"
                placeholder="Размеры, материалы, особые требования"
                variant="outlined"
                density="compact"
                rows="3"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 3. Медицинские показания -->
      <v-card class="form-card">
        <v-card-title>Медицинские показания</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.diagnosis"
                label="Диагноз (МКБ)"
                placeholder="Например, G82.2"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.doctor_name"
                label="Назначивший врач"
                placeholder="ФИО врача"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.department"
                label="Отделение"
                placeholder="Название отделения"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                v-model="form.medical_notes"
                label="Медицинские показания"
                placeholder="Осмотр, антропометрия, особые указания"
                variant="outlined"
                density="compact"
                rows="3"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 4. Стоимость и финансирование -->
      <v-card class="form-card">
        <v-card-title>Стоимость и финансирование</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="form.estimated_cost"
                label="Примерная стоимость"
                placeholder="0"
                type="number"
                variant="outlined"
                density="compact"
                prepend-icon="mdi-currency-kzt"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="form.funding_source"
                label="Источник финансирования"
                :items="fundingSourceOptions"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="form.contract_number"
                label="Номер договора"
                placeholder="№ договора"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="form.contract_date"
                label="Дата договора"
                type="date"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                v-model="form.funding_notes"
                label="Примечания по финансированию"
                placeholder="Дополнительная информация о финансировании"
                variant="outlined"
                density="compact"
                rows="2"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 5. Вложения -->
      <v-card class="form-card">
        <v-card-title>Вложения</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="form.attachments"
                label="Загрузить документы"
                multiple
                variant="outlined"
                density="compact"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon="mdi-file-upload"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.attachments_description"
                label="Описание документов"
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

      <!-- Actions -->
      <v-card class="form-card">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div class="actions-row">
                <div class="left-actions">
                  <v-btn
                    variant="outlined"
                    @click="saveOrder"
                    :loading="saving"
                    class="action-btn"
                  >
                    Сохранить заказ
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="saveAndOpenOrder"
                    :loading="saving"
                    class="action-btn"
                  >
                    Сохранить и открыть заказ
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
                    color="success"
                    @click="createInvoice"
                    :disabled="!form.id"
                    class="action-btn"
                  >
                    Создать накладную
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/plugins/axios'

const router = useRouter()
const route = useRoute()

// Состояние
const loading = ref(false)
const saving = ref(false)
const selectedPatient = ref(null)

// Форма
const form = reactive({
  // Пациент
  patient_search: '',
  patient_id: null,
  
  // Детали заказа
  order_type: '',
  product_name: '',
  priority: '',
  estimated_completion: '',
  notes: '',
  specifications: '',
  
  // Медицинские показания
  diagnosis: '',
  doctor_name: '',
  department: '',
  medical_notes: '',
  
  // Финансирование
  estimated_cost: '',
  funding_source: '',
  contract_number: '',
  contract_date: '',
  funding_notes: '',
  
  // Вложения
  attachments: [],
  attachments_description: ''
})

// Опции для селектов
const orderTypeOptions = [
  { title: 'Протез', value: 'prosthesis' },
  { title: 'Ортопедическая обувь', value: 'orthopedic_shoes' },
  { title: 'Инвалидная коляска', value: 'wheelchair' },
  { title: 'Трость', value: 'cane' },
  { title: 'Костыли', value: 'crutches' },
  { title: 'Другое', value: 'other' }
]

const priorityOptions = [
  { title: 'Низкий', value: 'low' },
  { title: 'Обычный', value: 'normal' },
  { title: 'Высокий', value: 'high' },
  { title: 'Срочный', value: 'urgent' }
]

const fundingSourceOptions = [
  { title: 'Государственный бюджет', value: 'state_budget' },
  { title: 'Местный бюджет', value: 'local_budget' },
  { title: 'Собственные средства', value: 'own_funds' },
  { title: 'Благотворительность', value: 'charity' },
  { title: 'Страхование', value: 'insurance' }
]

// Методы
const searchPatient = async () => {
  if (!form.patient_search) {
    alert('Введите ПИН или ФИО для поиска')
    return
  }
  
  loading.value = true
  try {
    // Здесь будет поиск пациента через API
    console.log('Поиск пациента:', form.patient_search)
    
    // Демо данные
    selectedPatient.value = {
      id: 1,
      pin: '1234567890123',
      last_name: 'Иванов',
      first_name: 'Иван',
      middle_name: 'Иванович',
      disability_group: '2',
      ipra_number: 'ИПРА №45 от 01.02.2025'
    }
    
    form.patient_id = selectedPatient.value.id
  } catch (error) {
    console.error('Ошибка поиска пациента:', error)
  } finally {
    loading.value = false
  }
}

const createNewPatient = () => {
  router.push('/personal-files/create')
}

const getDisabilityGroupLabel = (group) => {
  const labels = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    'child': 'Ребёнок-инвалид'
  }
  return labels[group] || group
}

const saveOrder = async () => {
  if (!selectedPatient.value) {
    alert('Сначала выберите пациента')
    return
  }
  
  saving.value = true
  try {
    const response = await api.post('/orders/', form)
    console.log('Заказ сохранен:', response.data)
    alert('Заказ успешно сохранен')
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    alert('Ошибка при сохранении заказа')
  } finally {
    saving.value = false
  }
}

const saveAndOpenOrder = async () => {
  if (!selectedPatient.value) {
    alert('Сначала выберите пациента')
    return
  }
  
  saving.value = true
  try {
    const response = await api.post('/orders/', form)
    console.log('Заказ сохранен и открыт:', response.data)
    router.push(`/orders/${response.data.id}`)
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    alert('Ошибка при сохранении заказа')
  } finally {
    saving.value = false
  }
}

const cancel = () => {
  router.push('/orders')
}

const createInvoice = () => {
  if (!form.id) {
    alert('Сначала сохраните заказ')
    return
  }
  router.push(`/invoices/create?order=${form.id}`)
}

// Проверяем, есть ли personal_file в URL
onMounted(() => {
  const personalFileId = route.query.personal_file
  if (personalFileId) {
    // Загружаем данные пациента
    console.log('Загружаем данные пациента:', personalFileId)
    // Здесь будет загрузка данных пациента
  }
})
</script>

<style scoped>
.create-order-page {
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

.search-btn,
.create-patient-btn {
  height: 40px;
  margin-top: 8px;
}

.patient-info {
  margin-top: 16px;
}

.patient-details {
  line-height: 1.5;
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
</style>
