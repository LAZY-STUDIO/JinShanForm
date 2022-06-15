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
      <div class="revise" @click="clicks()">提交</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IProblems1, ProblemType, IProblem } from '../types'
import InputProblem from '../components/InputProblem.vue'
import SelectProblem from '../components/SelectProblem.vue'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'CreatePro',
  props: {
    listmsg: { type: Object as PropType<IProblems1>, required: true },
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
      //this.id = '22be5695-807d-42a2-a427-5ed36748c0de'
      //String(this.$route.query.id)
      //const res = await getFormById(this.id)
      // console.log('问题数组')
      this.problems = this.listmsg.problems //res.data.item.problems
      // console.log(this.problems)
    },
    clicks() {
      ElMessage({
        message: '预览状态下不能提交',
        customClass: 'msg-box-form-title',
        duration: 1000 * 2,
        type: 'warning',
      })
    },
  },
  created() {
    this.getFormById()
  },
})
</script>
