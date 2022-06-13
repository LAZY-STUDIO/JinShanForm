
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
<template>
  <MyHeader style="background-color: #fff">
    <template v-slot:left-img
      ><i class="iconfont icon-angle-left-o"></i
    ></template>
    <template v-slot:left-name>{{ data.title }}</template>
  </MyHeader>
  <div style="background-color: #f5f7fa">
    <header style="background-color: #fff">
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
    </header>
    <router-view :data1="data" :result1="result" :y="y" :key="$route.path" />
  </div>
</template>
<script lang="ts">
let test = 0
import { defineComponent } from 'vue'
import { list } from '../services/api'
import { Onelist, IProblems, GetIlist } from '../types'
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
      test++
      let { data } = await list('22be5695-807d-42a2-a427-5ed36748c0de')
      this.result = data.items
      this.data = data.info
      this.y = data.items.length
    },
  },
  created() {
    test = 0
    this.login()
    //this.$router.push('anayse')
  },
})
</script>
