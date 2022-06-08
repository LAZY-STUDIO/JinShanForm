<template>
  <div class="fill-form-container">
    <div class="title">{{ title }}</div>
    <div class="subTitle">{{ subTitle }}</div>
    <component
      v-for="(item, index) in problems"
      :key="item"
      :is="componentType(item.type)"
      :problemType="item.type"
      :problemNumber="index"
      @resultValueInput="resultValueInput"
      @dateValueInput="dateValueInput"
      @scoreChange="scoreChange"
      @problemNum="problemNum"
    >
    </component>
    <div class="btn">
      <el-button @click="submitForm">保存草稿</el-button>
      <el-button @click="submitForm">提交表单</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as request from '../services/api'
import InputProblem from '../components/InputProblem.vue'
import SelectProblem from '../components/SelectProblem.vue'
import { IProblem, ProblemType } from '../types'

export default defineComponent({
  name: 'FormWrite',
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
      title: '',
      subTitle: '',
      problems: [] as IProblem[],
      id: '',
      sendProblems: [] as IProblem[],
      qus1: '', //填空题
      qus2: '', //分数题
      qus3: '', //日期题
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
      this.id = this.$route.query.id
      const res = await request.getFormById(this.id)
      // console.log('问题数组')
      this.title = res.data.item.title
      this.subTitle = res.data.item.subTitle
      this.problems = res.data.item.problems
      this.sendProblems = res.data.item.problems
      // console.log(this.problems)
    },
    resultValueInput(val) {
      this.qus1 = val
      return val
    },
    scoreChange(val) {
      this.qus2 = val
      return val
    },
    dateValueInput(val) {
      this.qus3 = val
      return val
    },
    problemNum(val) {
      // console.log('序号发生变化了')
      // console.log(val)
      let resultdata = this.qus1 + this.qus2 + this.qus3
      this.sendProblems[val].result = { value: resultdata }
      if (this.sendProblems[val].type === 'score') {
        // delete this.sendProblems[val].setting
        this.sendProblems[val].result = { value: parseInt(resultdata) }
        // console.log(this.sendProblems[val].result)
      }
      // console.log('结果是')
      // console.log(this.sendProblems[val].result)
      this.qus1 = ''
      this.qus2 = ''
      this.qus3 = ''
    },
    writeForm: async function () {
      await request.writeForm(this.id, this.sendProblems)
    },
    submitForm() {
      // console.log('最终的problems')
      // console.log(this.sendProblems)
      this.writeForm()
      alert('填写成功')
      this.$router.push('/')
    },
  },
  created() {
    this.getFormById()
  },
})
</script>

<style scoped>
.fill-form-container {
  width: 70%;
  background-color: #fff;
  margin: auto;
  overflow: hidden;
}
.btn {
  display: flex;
  justify-content: center;
  margin: 30px;
}
/* .submit-btn {
  width: 100px;
  height: 50px;
  text-align: center;
  background-color: rgb(251, 229, 232);
  border: 1px solid rgb(254, 204, 212);
  line-height: 50px;
  border-radius: 10px;
  margin: 10px;
} */
.title {
  text-align: center;
  font-size: 25px;
  font-weight: 500;
  margin-top: 30px;
  margin-bottom: 10px;
}
.subTitle {
  text-align: center;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>
