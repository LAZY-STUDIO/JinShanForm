<template>
  <div class="created">
    <div class="formname">{{ listmsg.title }}</div>
    <div class="subtitle">{{ listmsg.subTitle }}</div>
    <component
      v-for="(item, index) in problems"
      :is="componentType(item.type)"
      :ref="'problem' + index"
      :key="item"
      :problemNumber="index"
      :problemType="item.type"
      :resultValue="item.result.value"
      @resultValueInput="item.result.value = $event"
      :timeDateFormat="item.setting.options[0].title"
      @timeDateFormatChange="item.setting.options[0].title = $event"
      :problemOptions="item.setting.options"
      @radioOptionChange="item.result.value.title = $event"
      @checkboxOptionChange="
        item.result.value = $event.map((tmp) => ({
          id: '',
          title: tmp,
        }))
      "
    >
    </component>
    <div class="submit">
      <div class="revise">提交</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Onelist, IProblems, ProblemType, IProblem } from '../types'
import { getFormById } from '../services/api'
import InputProblem from '../components/InputProblem.vue'
import SelectProblem from '../components/SelectProblem.vue'
export default defineComponent({
  name: 'CreatePro',
  props: {
    listmsg: { type: Object as PropType<IProblems>, required: true },
  },
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
      id: '',
      problems: [] as IProblem[],
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
    getFormById: async function () {
      this.id = '092bab9d-c0b2-48c1-a649-dff723440591'
      //String(this.$route.query.id)
      const res = await getFormById(this.id)
      console.log(this.listmsg.problems)
      // console.log('问题数组')
      this.problems = res.data.item.problems
      // console.log(this.problems)
    },
  },
  created() {
    this.getFormById()
  },
})
</script>
