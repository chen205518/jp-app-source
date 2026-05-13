import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CoursePage from '@/pages/CoursePage.vue'
import MyPage from '@/pages/MyPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/course',
    name: 'course',
    component: CoursePage,
  },
  {
    path: '/my',
    name: 'my',
    component: MyPage,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
