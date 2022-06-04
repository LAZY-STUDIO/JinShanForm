<template>
  <div class="fill-form-container">
    <component
      v-for="(item, index) in problems"
      :key="item"
      :problemType="item.type"
      :problemNumber="index"
      :is="componentType(item.type)"
    >
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IProblem, ProblemType } from '../types'
import InputProblem from '../components/InputProblem.vue'
import SelectProblem from '../components/SelectProblem.vue'

export default defineComponent({
  name: 'PreviewForm',
  components: {
    InputProblem,
    SelectProblem,
  },
  provide() {
    return {
      forefatherComponent: this,
      options: this.options,
    }
  },
  data() {
    return {
      options: {
        showActions: false,
      },
      problems: [
        {
          title: '问题1',
          type: ProblemType.input,
          isNew: true,
          required: false,
          result: {
            value: '',
          },
        },
        {
          title: '问题2',
          type: ProblemType.input,
          isNew: true,
          required: false,
          result: {
            value: '',
          },
        },
      ] as IProblem[],
    }
  },
  methods: {
    // 判断动态使用的的组件名
    componentType(type: string) {
      if (
        type === ProblemType.input ||
        type === ProblemType.date ||
        type === ProblemType.time ||
        type === ProblemType.score
      )
        return 'InputProblem'
      else return 'SelectProblem'
    },
  },
})
</script>
