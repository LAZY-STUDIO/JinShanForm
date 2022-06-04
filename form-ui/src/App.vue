<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import './assets/css/base.css'
import './assets/css/icon.css'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default defineComponent({
  data() {
    return {
      locale: zhCn,
    }
  },
})
</script>
