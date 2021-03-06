import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const app = createApp(App)
app.component('IconCalendar', Calendar)
app.use(store).use(router).use(ElementPlus).mount('#app')

router.beforeEach(function (to, from, next) {
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (token) {
      next()
    } else {
      ElMessage({
        message: '请先登录',
        duration: 2000,
        type: 'error',
        customClass: 'msg-box-form-title',
      })
      next('/login')
    }
  }
})
