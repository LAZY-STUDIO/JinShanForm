<template>
  <problem-base
    :problemNumber="problemNumber"
    :titleReadOnly="titleReadOnly"
    :problemTitle="problemTitle"
    :allowActions="allowActions"
    @problemTitleChange="$emit('problemTitleChange', $event)"
  >
    这是插槽--todo: 判断是创建表单、还是填写表单中的problem
  </problem-base>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProblemBase from './ProblemBase.vue'

export default defineComponent({
  name: 'InputProblem',
  components: {
    ProblemBase,
  },
  emits: ['problemTitleChange'],
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
    problemTitle: {
      type: String,
      default: '',
    },
    titleReadOnly: {
      type: Boolean,
      default: false,
    },
    allowActions: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
</style>
