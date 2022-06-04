<template>
  <problem-base :problemNumber="problemNumber">
    <el-input
      v-if="problemType === 'input'"
      v-model="input"
      :readonly="showActions"
      :placeholder="showActions ? '填写者回答区' : '请输入'"
      :class="['input-problem', showActions ? 'dashd-input' : '']"
    />
    <div v-else-if="problemType === 'date'">日期题</div>
    <div v-else-if="problemType === 'time'">时间题</div>
    <div v-else>打分题</div>
  </problem-base>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
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
  computed: {
    showActions() {
      return this.options.showActions
    },
  },
  // inject: ['showActions'],
  inject: ['options'],
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
    problemType: {
      type: String,
    },
  },
  // todo: 添加时的效果
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
