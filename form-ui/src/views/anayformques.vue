<template>
  <div class="formcreate">
    <CreatePro :listmsg="data1"></CreatePro>
    <div class="jump">
      <div class="revise">修改表单</div>
      <div class="fill">填写表单</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Onelist, IProblems } from '../types'
import CreatePro from '../components/AnayCreateProblems.vue'
let test = 0
export default defineComponent({
  name: 'AnayFormques',
  components: {
    CreatePro,
  },
  props: {
    result1: { type: Object as PropType<Onelist> },
    data1: { type: Object as PropType<IProblems> },
    y: Number,
  },
})
</script>
