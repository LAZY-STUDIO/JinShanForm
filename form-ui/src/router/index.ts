import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CreateForm from '../views/CreateForm.vue'
import FillForm from '../views/FillForm.vue'
import IndexPage from '../views/Index.vue'
import QR from '../views/Qrcode.vue'
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
  {
    path: '/datanayse',
    name: 'datanayse',
    component: () => import('../views/anayse.vue'),
    children: [
      {
        path: '/anayse',
        name: 'anayse',
        component: () => import('../views/datanayse.vue'),
      },
      {
        path: '/qr',
        name: 'qr',
        component: QR,
      },
      {
        path: '/anaypro',
        name: 'anaypro',
        component: import('../views/anayformques.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
