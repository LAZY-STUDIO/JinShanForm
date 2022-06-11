<template>
  <div class="main-box">
    <div class="side-box" v-if="!flag">
      <div class="side">
        <div class="count">
          <span>已填</span>
          <span
            ><i>{{ num }}</i
            >/{{ total }}</span
          >
        </div>
        <div class="progress">
          <el-progress :percentage="percent * 100" :show-text="false" />
        </div>
        <img src="../assets/imgs/返回.png" @click="openSide" />
      </div>
    </div>
    <div class="side-content" v-if="flag">
      <div class="menu-box">
        <div class="menu">
          <span>目录</span>
          <span
            ><i>{{ num }}</i
            >/{{ total }}</span
          >
        </div>
        <span><img src="../assets/imgs/返回2.png" @click="closeSide" /></span>
      </div>
      <div class="menu-content" v-for="(item, index) in problems" :key="item">
        <span>{{ index + 1 }}:{{ item.title }}</span>
        <span
          ><img src="../assets/imgs/勾选.png" v-if="item.result.value" />
          <img src="../assets/imgs/勾选1.png" v-if="!item.result.value"
        /></span>
      </div>
    </div>
    <div class="fill-form-container" @click="findChange" @keyup="findChange">
      <div class="title">{{ title }}</div>
      <div class="subTitle">{{ subTitle }}</div>
      <component
        v-for="(item, index) in problems"
        :key="item"
        :is="componentType(item.type)"
        :problemType="item.type"
        :problemNumber="index"
        :resultValue="item.result.value"
        @resultValueInput="item.result.value = $event"
        @dateFormatChange="item.setting.options[0].title = $event"
        :dateFormat="
          item.setting.options[0].title === ''
            ? 'YYYY/MM'
            : item.setting.options[0].title
        "
        @scoreChange="item.result.value = $event"
      >
      </component>
      <div class="btn">
        <el-button @click="saveEdit">保存草稿</el-button>
        <el-button @click="submitForm" type="primary">提交表单</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as request from '../services/api'
import InputProblem from '../components/InputProblem.vue'
import SelectProblem from '../components/SelectProblem.vue'
import { IProblem, ProblemType } from '../types'
import { json } from 'stream/consumers'

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
      num: 0,
      total: 0,
      percent: 0,
      flag: 0,
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
      this.id = String(this.$route.query.id)
      const res = await request.getFormById(this.id)
      // console.log('问题数组')
      this.title = res.data.item.title
      this.subTitle = res.data.item.subTitle
      if (
        localStorage.getItem('edit') &&
        localStorage.getItem('id') === this.id
      ) {
        this.problems = JSON.parse(localStorage.getItem('edit') || '[]')
      } else {
        this.problems = res.data.item.problems
      }
    },
    writeForm: async function () {
      console.log('打印问题')
      console.log(this.problems)
      // await request.writeForm(this.id, this.problems)
    },
    submitForm() {
      this.writeForm()
      alert('填写成功')
      this.$router.push('/')
    },
    findChange() {
      this.num = 0
      for (let k in this.problems) {
        if (this.problems[k].result?.value) {
          this.num++
        }
        this.total = parseInt(k) + 1
        this.percent = this.num / this.total
      }
    },
    saveEdit() {
      localStorage.setItem('edit', JSON.stringify(this.problems))
      localStorage.setItem('id', this.id)
    },
    openSide() {
      this.flag = 1
      console.log(this.flag)
    },
    closeSide() {
      this.flag = 0
      console.log(this.flag)
    },
  },
  created() {
    this.getFormById()
  },
})
</script>

<style scoped>
.main-box {
  margin: auto;
  display: flex;
  /* width: 900px; */
  justify-content: center;
}
.fill-form-container {
  /* position: relative; */
  width: 776px;
  background-color: #fff;
  /* margin: auto; */
  /* overflow: hidden; */
  padding: 50px 88px;
  min-height: calc(100vh - 150px);
}
.side-box {
  width: 50px;
  margin-right: 20px;
}
.side {
  position: absolute;
  display: flex;
  width: 48px;
  height: 209px;
  border-radius: 25px;
  /* left: -10%; */
  top: 50%;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.count {
  display: flex;
  flex-direction: column;
}
.side span {
  text-align: center;
  font-size: 12px;
  color: #949aae;
  height: 18px;
}
span i {
  font-style: normal;
  color: #409eff;
}
.side img {
  margin-top: 5px;
  width: 32px;
}
.progress {
  height: 103px;
  width: 30px;
}
.side .el-progress {
  margin-bottom: 15px;
  width: 103px;
  transform: rotate(90deg);
  transform-origin: left;
  margin-left: 15px;
}
.side-content {
  width: 240px;
  height: 753.6px;
  background-color: #fff;
  margin-right: 16px;
  padding: 20px 20px 72px;
}
.menu-box {
  width: 200px;
  margin: auto;
  border-bottom: 1px solid #e2e6ed;
  margin-bottom: 10px;
}
.menu {
  display: inline-block;
  width: 180px;
  /* height: 33px; */
  line-height: 33px;
  font-size: 12px;
  color: #949aae;
}
.side-content img {
  width: 16px;
}
.menu-content {
  width: 200px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.menu-content span {
  display: flex;
  align-items: center;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}
.btn {
  display: flex;
  justify-content: center;
  margin: 30px;
}
.title {
  text-align: center;
  font-size: 25px;
  font-weight: 500;
  margin-bottom: 10px;
}
.subTitle {
  text-align: center;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
}
@media screen and (max-width: 748px) {
  .main-box {
    width: 100%;
    flex-direction: column;
  }
  .fill-form-container {
    width: 100%;
    padding: 5% 9%;
  }
  .side-box {
    width: 100%;
    background-color: #fff;
  }
  .side {
    /* top: 0%;
    left: 15%; */
    position: relative;
    width: 70%;
    height: 58px;
    border-radius: 5px;
    background-color: #9e9e9e0d;
    margin: 5px auto;
    /* flex-direction: row; */
  }
  .count {
    flex-direction: row;
    margin-left: 15%;
  }
  .side .el-progress {
    transform: rotate(0deg);
    width: 70%;
    margin: 10px auto;
  }
}
</style>
