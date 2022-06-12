<template>
  <el-config-provider :locale="locale">
    <!-- <div @click="clickRoot"> -->
    <router-view />
    <!-- </div> -->
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import './assets/css/base.css'
import './assets/css/icon.css'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import './assets/css/formanayse.css'
import store from '@/store/index'

export default defineComponent({
  data() {
    return {
      locale: zhCn,
    }
  },
  // methods: {
  //   clickRoot() {
  //     console.log('11111')
  //     store.commit('showAction', 1)
  //     console.log(store.getters.show)
  //   },
  // },
})
</script>
