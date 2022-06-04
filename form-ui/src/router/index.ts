import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CreateForm from '../views/CreateForm.vue'
import FillForm from '../views/FillForm.vue'
import IndexPage from '../views/Index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'IndexPage',
    component: IndexPage,
  },
  {
    path: '/createForm',
    name: 'CreateForm',
    component: CreateForm,
  },
  {
    path: '/fillForm',
    name: 'FillForm',
    component: FillForm,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
