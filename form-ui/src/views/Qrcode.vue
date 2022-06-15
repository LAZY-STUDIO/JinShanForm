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
import { ElMessage } from 'element-plus'
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
      //this.Alerts('复制完成')
      ElMessage({
        message: '复制成功',
        customClass: 'msg-box-form-title',
        duration: 1000 * 2,
        type: 'success',
      })
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
  created() {
    if (this.isok == 0) {
      ElMessage({
        message: '表单里还没有一份数据',
        customClass: 'msg-box-form-title',
        duration: 1000 * 2,
        type: 'warning',
      })
    }
  },
})
</script>
