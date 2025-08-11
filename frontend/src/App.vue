<template>
  <v-app>
    <!-- Боковая панель -->
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      width="260"
      class="sidebar"
    >
      <div class="sidebar-content">
        <!-- Логотип -->
        <div class="logo">
          <v-icon size="32" color="primary" class="logo-icon">mdi-account-group</v-icon>
          <span class="logo-text">АИС ЕССО</span>
        </div>

        <!-- Навигация -->
        <div class="nav-section">
          <div class="nav-title">Операции</div>
          <v-list class="nav-list">
            <v-list-item
              v-for="item in menuItems"
              :key="item.title"
              :to="item.path"
              :prepend-icon="item.icon"
              :title="item.title"
              class="nav-item"
              :class="{ 'nav-item-active': $route.path === item.path }"
            />
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Верхняя панель -->
    <v-app-bar
      app
      class="topbar"
      elevation="0"
    >
      <div class="topbar-content">
        <div class="breadcrumbs">
          <span class="breadcrumb-text">{{ currentPageTitle }}</span>
        </div>
        
        <div class="user-info">
          <span class="user-name" v-if="userStore.user">
            {{ userStore.user.first_name }} {{ userStore.user.last_name }}
          </span>
          <v-avatar size="28" color="white" class="user-avatar">
            <span class="avatar-text">
              {{ getUserInitials() }}
            </span>
          </v-avatar>
          <v-btn
            icon
            size="small"
            @click="handleLogout"
            class="logout-btn"
          >
            <v-icon size="18">mdi-logout</v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const drawer = ref(true)

// Меню в зависимости от роли пользователя
const menuItems = computed(() => {
  const items = [
    {
      title: 'Личные дела',
      path: '/',
      icon: 'mdi-folder-account',
      roles: ['registry', 'medical', 'admin']
    },
    {
      title: 'Заказы',
      path: '/orders',
      icon: 'mdi-clipboard-list',
      roles: ['medical', 'workshop', 'admin']
    },
    {
      title: 'Накладные',
      path: '/invoices',
      icon: 'mdi-file-document',
      roles: ['workshop', 'warehouse', 'admin']
    },
    {
      title: 'Склад / Выдача',
      path: '/warehouse',
      icon: 'mdi-warehouse',
      roles: ['warehouse', 'admin']
    },
    {
      title: 'Отчёты',
      path: '/reports',
      icon: 'mdi-chart-bar',
      roles: ['medical', 'workshop', 'warehouse', 'admin']
    },
    {
      title: 'Администрирование',
      path: '/admin',
      icon: 'mdi-cog',
      roles: ['admin']
    }
  ]

  // Фильтруем элементы меню по роли пользователя
  return items.filter(item => 
    item.roles.includes(userStore.userRole) || userStore.isAdmin
  )
})

// Текущий заголовок страницы
const currentPageTitle = computed(() => {
  const currentItem = menuItems.value.find(item => item.path === route.path)
  return currentItem ? currentItem.title : 'Главная'
})

const getUserInitials = () => {
  if (!userStore.user) return 'U'
  const firstName = userStore.user.first_name || ''
  const lastName = userStore.user.last_name || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  background: #ffffff !important;
  border-right: 1px solid #e2e8f0;
}

.sidebar-content {
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  font-weight: 700;
  color: #2f4b7c;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
}

.nav-section {
  margin-top: 8px;
}

.nav-title {
  color: #6b778c;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 8px 10px;
  font-weight: 500;
}

.nav-list {
  background: transparent !important;
  padding: 0 !important;
}

.nav-item {
  margin: 2px 0 !important;
  border-radius: 8px !important;
  color: #1e2a3a !important;
  cursor: pointer;
  user-select: none;
}

.nav-item:hover {
  background: #f1f4f8 !important;
}

.nav-item-active {
  background: #e9eef7 !important;
  color: #2f4b7c !important;
  font-weight: 600 !important;
}

.nav-item :deep(.v-list-item__prepend) {
  margin-right: 10px;
}

.nav-item :deep(.v-list-item__content) {
  padding: 10px 12px;
}

.topbar {
  background: #2f4b7c !important;
  color: white !important;
  height: 64px !important;
}

.topbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  width: 100%;
  height: 100%;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.breadcrumb-text {
  font-weight: 400;
  opacity: 0.9;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 14px;
  opacity: 0.9;
}

.user-avatar {
  background: white !important;
  color: #2f4b7c !important;
}

.avatar-text {
  font-weight: 700;
  font-size: 12px;
}

.logout-btn {
  color: white !important;
}

.main-content {
  background: #f3f5f7 !important;
  padding: 22px !important;
}

/* Глобальные стили */
:deep(.v-application) {
  background: #f3f5f7 !important;
}

:deep(.v-main) {
  background: #f3f5f7 !important;
}
</style>
