import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CreateForm from '../views/CreateForm.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'CreateForm',
    component: CreateForm,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
