<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, Document, Tickets, Box, ArrowRight, Plus, 
  Search, Clock, Check, Warning, DataLine 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const currentTime = ref('')
const currentDate = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('ru-RU')
  currentDate.value = now.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goToPersonalCases = () => {
  router.push('/personal-cases')
}

const goToOrders = () => {
  ElMessage.info('Модуль "Заказы" будет реализован позже')
}

const goToInvoices = () => {
  ElMessage.info('Модуль "Накладные" будет реализован позже')
}

const goToWarehouse = () => {
  ElMessage.info('Модуль "Склад" будет реализован позже')
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>АИС «РУПОИ»</h1>
        <p>Автоматизированная информационная система Республиканского управления протезно-ортопедических изделий</p>
      </div>
    </div>

    <div class="modules-section">
      <h2>Основные модули системы</h2>
      <div class="modules-grid">
        <div class="module-card" @click="goToPersonalCases">
          <div class="module-icon">
            <el-icon :size="32">
              <User />
            </el-icon>
          </div>
          <div class="module-content">
            <h3>Личные дела</h3>
            <p>Управление личными делами пациентов, включая персональные данные, документы и медицинскую информацию</p>
            <div class="module-stats">
              <span class="stat-item">
                <el-icon><Document /></el-icon>
                <span>Всего дел: 1,247</span>
              </span>
              <span class="stat-item">
                <el-icon><Clock /></el-icon>
                <span>Активных: 89</span>
              </span>
            </div>
          </div>
          <div class="module-action">
            <el-button type="primary" size="large">
              Открыть модуль
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="module-card" @click="goToOrders">
          <div class="module-icon">
            <el-icon :size="32">
              <Document />
            </el-icon>
          </div>
          <div class="module-content">
            <h3>Заказы</h3>
            <p>Создание и управление заказами на протезно-ортопедические изделия и технические средства реабилитации</p>
            <div class="module-stats">
              <span class="stat-item">
                <el-icon><Clock /></el-icon>
                <span>В работе: 23</span>
              </span>
              <span class="stat-item">
                <el-icon><Check /></el-icon>
                <span>Готово: 156</span>
              </span>
            </div>
          </div>
          <div class="module-action">
            <el-button type="primary" size="large">
              Открыть модуль
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="module-card" @click="goToInvoices">
          <div class="module-icon">
            <el-icon :size="32">
              <Tickets />
            </el-icon>
          </div>
          <div class="module-content">
            <h3>Накладные</h3>
            <p>Управление накладными на передачу изделий со склада и контроль движения материальных ценностей</p>
            <div class="module-stats">
              <span class="stat-item">
                <el-icon><Box /></el-icon>
                <span>На выдаче: 12</span>
              </span>
              <span class="stat-item">
                <el-icon><Check /></el-icon>
                <span>Выдано: 89</span>
              </span>
            </div>
          </div>
          <div class="module-action">
            <el-button type="primary" size="large">
              Открыть модуль
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="module-card" @click="goToWarehouse">
          <div class="module-icon">
            <el-icon :size="32">
              <Box />
            </el-icon>
          </div>
          <div class="module-content">
            <h3>Склад / Выдача</h3>
            <p>Управление складскими остатками, прием и выдача изделий, контроль движения товарно-материальных ценностей</p>
            <div class="module-stats">
              <span class="stat-item">
                <el-icon><Box /></el-icon>
                <span>Остатки: 1,234</span>
              </span>
              <span class="stat-item">
                <el-icon><Warning /></el-icon>
                <span>Дефицит: 5</span>
              </span>
            </div>
          </div>
          <div class="module-action">
            <el-button type="primary" size="large">
              Открыть модуль
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions-section">
      <h2>Быстрые действия</h2>
      <div class="quick-actions-grid">
        <el-button type="primary" size="large" @click="goToPersonalCases">
          <el-icon><Plus /></el-icon>
          Создать личное дело
        </el-button>
        <el-button type="success" size="large" @click="goToOrders">
          <el-icon><Plus /></el-icon>
          Создать заказ
        </el-button>
        <el-button type="warning" size="large" @click="goToInvoices">
          <el-icon><Plus /></el-icon>
          Создать накладную
        </el-button>
        <el-button type="info" size="large" @click="goToWarehouse">
          <el-icon><Search /></el-icon>
          Поиск на складе
        </el-button>
      </div>
    </div>

    <div class="system-info-section">
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon">
            <el-icon :size="24">
              <User />
            </el-icon>
          </div>
          <div class="info-content">
            <h4>Пользователь</h4>
            <p>Айжана Сайрабаева</p>
            <span class="role">Администратор системы</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <el-icon :size="24">
              <Clock />
            </el-icon>
          </div>
          <div class="info-content">
            <h4>Время работы</h4>
            <p>{{ currentTime }}</p>
            <span class="status">Система активна</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <el-icon :size="24">
              <DataLine />
            </el-icon>
          </div>
          <div class="info-content">
            <h4>Статистика</h4>
            <p>{{ currentDate }}</p>
            <span class="status">Данные актуальны</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.hero-section {
  padding: 80px 24px;
  text-align: center;
  color: white;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-content p {
  font-size: 20px;
  margin: 0;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.modules-section {
  padding: 60px 24px;
  background: #f3f5f7;
}

.modules-section h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #1e2a3a;
  margin: 0 0 40px 0;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.module-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.module-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.module-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e2a3a;
  margin: 0 0 12px 0;
}

.module-content p {
  color: #6b778c;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.module-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b778c;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
}

.module-action {
  margin-top: auto;
}

.quick-actions-section {
  padding: 60px 24px;
  background: white;
}

.quick-actions-section h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #1e2a3a;
  margin: 0 0 40px 0;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.system-info-section {
  padding: 40px 24px;
  background: #f8fafc;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.info-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e2a3a;
  margin: 0 0 4px 0;
}

.info-content p {
  font-size: 14px;
  color: #6b778c;
  margin: 0 0 4px 0;
}

.info-content .role,
.info-content .status {
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }
  
  .hero-content p {
    font-size: 16px;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>
