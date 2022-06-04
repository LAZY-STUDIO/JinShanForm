<template>
  <problem-base :problemNumber="problemNumber"> 选择题 </problem-base>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProblemBase from './ProblemBase.vue'

export default defineComponent({
  name: 'SelectProblem',
  components: {
    ProblemBase,
  },
})
</script>
