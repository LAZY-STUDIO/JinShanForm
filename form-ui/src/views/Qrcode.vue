<template>
  <div class="qrcodes">
    <QRcode></QRcode>
    <div class="download"><a class="link" @click="down()">下载二维码</a></div>
    <div class="copy" @click="copyLink('datanayse')">复制链接</div>
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
  methods: {
    copyLink(val: string) {
      console.log(val, '复制链接')
      let url = window.location.origin + '/' + val
      let inputNode = document.createElement('input')
      inputNode.value = url
      document.body.appendChild(inputNode)
      inputNode.select()
      document.execCommand('Copy')
      inputNode.className = 'oInput'
      inputNode.style.display = 'none'
      alert('复制完成')
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
  },
})
</script>
