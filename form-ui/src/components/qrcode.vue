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
import { list1 } from '../services/api'
export default defineComponent({
  name: 'QRcode',
  components: {
    VueQr,
  },
  props: { id: String },
  data() {
    return {
      targets: window.location.origin + '/write?id=' + this.id,
      listname: '',
      times: '123',
    }
  },
  methods: {
    async getdata() {
      let { data } = await list1(this.id!)
      this.listname = data.info.title
    },
  },
  created() {
    this.getdata()
  },
})
</script>
