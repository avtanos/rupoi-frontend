import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'PersonalFiles',
    component: () => import('@/views/PersonalFiles.vue'),
    meta: { requiresAuth: false }  // Отключаем проверку аутентификации
  },
  {
    path: '/personal-files/create',
    name: 'CreatePersonalFile',
    component: () => import('@/views/CreatePersonalFile.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/personal-files/:id',
    name: 'PersonalFileDetail',
    component: () => import('@/views/PersonalFileDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/orders/create',
    name: 'CreateOrder',
    component: () => import('@/views/CreateOrder.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('@/views/Invoices.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('@/views/Warehouse.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Отключаем проверку аутентификации для тестирования
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Для тестирования всегда разрешаем доступ
  if (to.meta.requiresAuth === false) {
    next()
  } else {
    // Если требуется аутентификация, но мы в тестовом режиме - разрешаем
    next()
  }
})

export default router
