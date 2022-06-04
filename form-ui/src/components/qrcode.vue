<template>
  <div class="qrcode">
    <div class="qrname">{{ listname }}</div>
    <VueQr
      id="vueqr"
      :text="targets"
      colorDark="#ECF0FA"
      colorLight="black"
      :size="200"
    ></VueQr>
    <div class="light">浏览器扫描二维码，填写内容</div>
  </div>
</template>
<script lang="ts">
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import { defineComponent, PropType } from 'vue'
import { list } from '../services/api'
export default defineComponent({
  name: 'QRcode',
  components: {
    VueQr,
  },
  data() {
    return {
      targets: 'http://localhost:8080/anayse',
      listname: '',
      times: '123',
    }
  },
  methods: {
    async getdata() {
      let { data } = await list('30f9a946-f3c1-4538-ab77-56e326b4c5c7')
      this.listname = data.info.title
    },
  },
  created() {
    this.getdata()
  },
})
</script>
