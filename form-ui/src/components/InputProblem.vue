<template>
  <problem-base :problemNumber="problemNumber">
    <el-input
      v-model="input"
      :readonly="showActions"
      :placeholder="showActions ? '填写者回答区' : '请输入'"
      :class="['input-problem', showActions ? 'dashd-input' : '']"
    />
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
  data() {
    return {
      input: this.resultValue,
    }
  },
  inject: ['showActions'],
  // 答案输入事件
  emits: ['resultValueInput'],
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
    resultValue: {
      type: String,
      default: '',
    },
  },
  watch: {
    input(newVal: string) {
      this.$emit('resultValueInput', newVal)
    },
  },
})
</script>

<style lang="less" scoped>
.input-problem {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    border-bottom: 1px solid #e2e6ed;
  }
}

.input-problem:not(.dashd-input) {
  &:hover {
    border-bottom: 1px solid #1488ed;
  }
}

.dashd-input {
  :deep(.el-input__wrapper) {
    font-size: 12px;
    box-shadow: none;
    border-bottom: 1px dashed #e2e6ed;
  }
}
</style>
