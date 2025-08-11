<template>
  <div class="data-cards">
    <el-row :gutter="16">
      <el-col :span="6" v-for="card in cards" :key="card.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :class="card.color">
              <el-icon :size="24">
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ card.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  User, 
  Check, 
  Close, 
  Warning 
} from '@element-plus/icons-vue'

interface StatCard {
  title: string
  value: number
  icon: string
  color: string
}

interface Props {
  statistics: {
    total: number
    active: number
    closed: number
    urgent: number
  }
}

const props = defineProps<Props>()

const cards = computed<StatCard[]>(() => [
  {
    title: 'Всего дел',
    value: props.statistics.total,
    icon: 'User',
    color: 'primary'
  },
  {
    title: 'Активных',
    value: props.statistics.active,
    icon: 'Check',
    color: 'success'
  },
  {
    title: 'Закрытых',
    value: props.statistics.closed,
    icon: 'Close',
    color: 'info'
  },
  {
    title: 'Срочных',
    value: props.statistics.urgent,
    icon: 'Warning',
    color: 'warning'
  }
])
</script>

<style scoped>
.data-cards {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: white;
}

.stat-icon.primary {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
}

.stat-icon.success {
  background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
}

.stat-icon.info {
  background: linear-gradient(135deg, #909399 0%, #73767a 100%);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #e6a23c 0%, #cf9236 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-title {
  font-size: 14px;
  color: #606266;
  line-height: 1;
}
</style>
