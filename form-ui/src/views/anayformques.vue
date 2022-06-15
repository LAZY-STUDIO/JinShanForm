<template>
  <div class="formcreate">
    <CreatePro :listmsg="data1"></CreatePro>
    <div class="jump">
      <div class="revise1" @click="towrite()">填写表单</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Onelist, IProblems1 } from '../types'
import CreatePro from '../components/AnayCreateProblems.vue'
let test = 0
export default defineComponent({
  name: 'AnayFormques',
  components: {
    CreatePro,
  },
  props: {
    result1: { type: Object as PropType<Onelist> },
    data1: { type: Object as PropType<IProblems1> },
    y: Number,
    ids: String,
  },
  methods: {
    towrite() {
      this.$router.push('/write' + '?id=' + this.ids)
    },
  },
})
</script>
