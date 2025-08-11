import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/personal-cases',
      name: 'personal-cases',
      component: () => import('../views/PersonalCases/List.vue')
    },
    {
      path: '/personal-cases/create',
      name: 'personal-cases-create',
      component: () => import('../views/PersonalCases/Create.vue')
    },
    {
      path: '/personal-cases/:id',
      name: 'personal-cases-view',
      component: () => import('../views/PersonalCases/View.vue')
    },
    {
      path: '/personal-cases/:id/edit',
      name: 'personal-cases-edit',
      component: () => import('../views/PersonalCases/Edit.vue')
    }
  ]
})

export default router
