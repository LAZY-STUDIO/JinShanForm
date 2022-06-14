<template>
  <MyHeader style="background-color: #fff">
    <template v-slot:left-img
      ><router-link to="/"
        ><i class="iconfont icon-angle-left-o"></i></router-link
    ></template>
    <template v-slot:left-name>{{ data.title }}</template>
  </MyHeader>
  <div style="background-color: #f5f7fa">
    <div style="background-color: #fff; display: block; padding-top: 60px">
      <div class="header-inner">
        <router-link to="/datanayse/anayse"
          ><div
            class="tapoption"
            :class="{ tapclick: isclick1 }"
            @click="tapclick1"
          >
            数据统计&分析
          </div></router-link
        >
        <router-link to="/datanayse/anaypro">
          <div
            class="tapoption"
            :class="{ tapclick: isclick2 }"
            @click="tapclick2"
          >
            表单问题
          </div></router-link
        >
        <router-link to="/datanayse/qr">
          <div
            class="tapoption"
            :class="{ tapclick: isclick3 }"
            @click="tapclick3"
          >
            分享
          </div></router-link
        >
      </div>
    </div>
    <router-view
      :data1="data"
      :result1="result"
      :y="y"
      :ids="id"
      :key="$route.path"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { list1 } from '../services/api'
import { Onelist, IProblems1, GetIlist1 } from '../types'
import MyHeader from '../components/MyHeader.vue'
export default defineComponent({
  name: 'AnAyse',
  components: { MyHeader },
  data() {
    return {
      isclick1: true,
      isclick2: false,
      isclick3: false,
      listname: '',
      result: [{}] as Onelist[],
      data: {} as IProblems1,
      y: 0,
      id: String(this.$route.query.id),
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
      let { data } = await list1(String(this.$route.query.id))
      this.result = data.items
      this.data = data.info
      this.y = data.items.length
    },
  },
  created() {
    console.log(this.$route.query.id)
    console.log(this.$route.query.id)
    this.login()
    this.$router.push('/datanayse/anayse')
  },
})
</script>
