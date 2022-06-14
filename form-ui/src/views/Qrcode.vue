<template>
  <div class="qrcodes">
    <QRcode :id="ids" :isok="isok"></QRcode>
    <div class="download"><a class="link" @click="down()">下载二维码</a></div>
    <div class="copy" @click="copyLink('write')">复制链接</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QRcode from '../components/qrcode.vue'
export default defineComponent({
  name: 'QR',
  components: {
    QRcode,
  },
  props: { ids: String, isok: Number },
  methods: {
    copyLink(val: string) {
      console.log(val, '复制链接')
      let url = window.location.origin + '/' + val + '?id=' + this.ids
      let inputNode = document.createElement('input')
      inputNode.value = url
      document.body.appendChild(inputNode)
      inputNode.select()
      document.execCommand('Copy')
      inputNode.className = 'oInput'
      inputNode.style.display = 'none'
      this.Alerts('复制完成')
    },
    down() {
      let img = document.getElementById('vueqr') as HTMLImageElement
      let url = img!.src
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      a.href = url
      a.download = 'url' + '.png'
      a.dispatchEvent(event)
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
    if (this.isok == 0) {
      this.Alerts('表单还没有一份数据')
    }
  },
})
</script>
