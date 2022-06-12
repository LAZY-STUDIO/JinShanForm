<template>
  <div class="top">
    <h1 class="top-name">
      <i class="iconfont icon-angle-left-o"></i>
      {{ data.title }}
    </h1>
  </div>
  <header style="background-color: #fff">
    <div class="header-inner">
      <router-link to="/anayse"
        ><div
          class="tapoption"
          :class="{ tapclick: isclick1 }"
          @click="tapclick1"
        >
          数据统计&分析
        </div></router-link
      >
      <router-link to="/anaypro">
        <div
          class="tapoption"
          :class="{ tapclick: isclick2 }"
          @click="tapclick2"
        >
          表单问题
        </div></router-link
      >
      <router-link to="/qr">
        <div
          class="tapoption"
          :class="{ tapclick: isclick3 }"
          @click="tapclick3"
        >
          分享
        </div></router-link
      >
    </div>
  </header>
  <router-view :data1="data" :result1="result" :y="y" />
</template>
<script lang="ts">
let test = 0
import { defineComponent } from 'vue'
import { list } from '../services/api'
import { Onelist, IProblems, GetIlist } from '../types'
export default defineComponent({
  name: 'AnAyse',
  data() {
    return {
      isclick1: true,
      isclick2: false,
      isclick3: false,
      listname: '',
      result: [{}] as Onelist[],
      data: {} as IProblems,
      y: 0,
    }
  },
  methods: {
    tapclick1() {
      this.isclick1 = true
      this.isclick2 = false
      this.isclick3 = false
    },
    tapclick2() {
      this.isclick2 = true
      this.isclick1 = false
      this.isclick3 = false
    },
    tapclick3() {
      this.isclick3 = true
      this.isclick2 = false
      this.isclick1 = false
    },
    async login() {
      if (test == 0) {
        await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            account: 'leibuyun',
            pwd: '123456',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        test++
        let { data } = await list('350b3a52-9002-4954-bd98-b625c38cbe64')
        this.result = data.items
        this.data = data.info
        this.y = data.items.length
      }
    },
  },
  created() {
    test = 0
    this.login()
    this.$router.push('anayse')
  },
})
</script>
