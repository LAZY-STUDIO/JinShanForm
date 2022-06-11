<template>
  <problem-base :problemNumber="problemNumber">
    <template v-slot:default>
      <div v-if="showActions">可编辑</div>
      <template v-else>预览</template>
    </template>
    <template v-slot:slot-actions> 操作栏 </template>
  </problem-base>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ProblemBase from './ProblemBase.vue'

export default defineComponent({
  name: 'SelectProblem',
  components: {
    ProblemBase,
  },
  data() {
    return {
      radioTmp: this.resultValue as string,
    }
  },
  inject: ['options'],
  computed: {
    showActions() {
      return this.options.showActions
    },
  },
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
    problemType: {
      type: String,
    },
    problemOptions: {
      type: Object as PropType<
        {
          title: string
          status: 1 | 2
        }[]
      >,
      required: true,
    },
    resultValue: {
      type: [String, Number, Object],
    },
  },
})
</script>
