<template>
  <div
    style="
      background-color: #f5f7fa;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      flex-direction: column;
    "
  >
    <MyHeader style="background-color: #fff">
      <template v-slot:left-img
        ><router-link to="/"
          ><i class="iconfont icon-angle-left-o"></i></router-link
      ></template>
      <template v-slot:left-name>{{ data.title }}</template>
    </MyHeader>
    <div
      style="
        background-color: #f5f7fa;
        flex: 1;
        display: flex;
        justify-content: center;
        flex-direction: column;
      "
    >
      <div style="background-color: #fff; display: block; padding-top: 60px">
        <div class="header-inner">
          <div
            class="tapoption"
            :class="{ tapclick: isclick1 }"
            @click="tapclick1"
          >
            数据统计&分析
          </div>
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
        style="flex: 1"
        :isok="isok"
      />
    </div>
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
      isok: 1,
    }
  },
  methods: {
    tapclick1() {
      if (this.isok == 0) {
        this.Alerts('表单还没有一份数据')
      } else {
        this.isclick1 = true
        this.isclick2 = false
        this.isclick3 = false
        this.$router.push('/datanayse/anayse')
      }
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
      if (this.y == 0) {
        this.$router.push('/datanayse/qr')
        this.isclick3 = true
        this.isclick2 = false
        this.isclick1 = false
        this.isok = 0
      }
    },
    Alerts(str) {
      var msgw, msgh, bordercolor
      msgw = 160 //提示窗口的宽度
      msgh = 40 //提示窗口的高度
      let titleheight = 25 //提示窗口标题高度
      bordercolor = '#F5F7FA' //提示窗口的边框颜色
      let titlecolor = 'red' //提示窗口的标题颜色
      var sWidth, sHeight
      //获取当前窗口尺寸
      sWidth = document.body.offsetWidth
      sHeight = document.body.offsetHeight
      //背景div
      var bgObj = document.createElement('div')
      bgObj.setAttribute('id', 'alertbgDiv')
      bgObj.style.position = 'absolute'
      bgObj.style.top = '0'
      bgObj.style.background = '#FFF'
      bgObj.style.filter =
        'progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75'
      //透明度
      bgObj.style.opacity = '0'
      bgObj.style.left = '0'
      bgObj.style.width = sWidth + 'px'
      bgObj.style.height = sHeight + 'px'
      bgObj.style.zIndex = '10000'
      bgObj.style.position = 'fixed'
      bgObj.style.animation = 'scaleDraw 0.7s'
      document.body.appendChild(bgObj)
      //创建提示窗口的div
      var msgObj = document.createElement('div')
      msgObj.setAttribute('id', 'alertmsgDiv')
      msgObj.setAttribute('align', 'center')
      msgObj.style.background = '#FFF'
      msgObj.style.border = '1.5px solid ' + bordercolor
      msgObj.style.boxShadow = ' 0px 0px 2px 1px #888888 '
      //div设置圆角
      msgObj.style.setProperty('border-radius', '5px 5px 5px 5px', 'important')
      msgObj.style.position = 'absolute'
      msgObj.style.left = '45%'
      msgObj.style.font =
        '12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif'
      //窗口距离左侧和顶端的距离
      msgObj.style.margin = '-300px auto'
      msgObj.style.padding = '-10px 0 0 0'
      //窗口被卷去的高+（屏幕可用工作区高/2）-150
      msgObj.style.top =
        document.body.scrollTop + window.screen.availHeight / 2 - 50 + 'px'
      msgObj.style.width = msgw + 'px'
      msgObj.style.height = msgh + 'px'
      msgObj.style.textAlign = 'center'
      //msgObj.style.lineHeight = '25px'
      msgObj.style.zIndex = '10001'
      msgObj.style.position = 'fixed'
      msgObj.style.animation = 'scaleDraw 0.7s'
      document.body.appendChild(msgObj)
      //提示信息
      var txt = document.createElement('p')
      txt.setAttribute('id', 'msgTxt')
      txt.style.margin = '10px 0'
      txt.innerHTML = str
      txt.style.color = 'red'
      document.getElementById('alertmsgDiv')!.appendChild(txt)
      //设置关闭时间
      window.setTimeout(() => {
        document.body.removeChild(document.getElementById('alertbgDiv')!)
        document.body.removeChild(document.getElementById('alertmsgDiv')!)
      }, 2000)
    },
  },
  created() {
    console.log(this.$route.query.id)
    console.log(this.$route.query.id)
    this.login()
    //this.$router.push('/datanayse/anayse')
  },
})
</script>
