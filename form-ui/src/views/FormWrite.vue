<template>
  <div class="main-box">
    <div class="side-box" v-if="!flag && !flagg">
      <div class="side">
        <div class="count">
          <span>已填</span>
          <span
            ><i>{{ num }}</i
            >/{{ total }}</span
          >
        </div>
        <div class="progress">
          <el-progress
            :percentage="percent * 100"
            :show-text="false"
            v-if="!isNaN(parseInt(percent * 100))"
          />
        </div>
        <img src="../assets/imgs/返回.png" @click="changeSide" />
      </div>
    </div>
    <div class="side-content" v-if="flag && !flagg">
      <div class="menu-box">
        <div class="menu">
          <span>目录</span>
          <span
            ><i>{{ num }}</i
            >/{{ total }}</span
          >
        </div>
        <span><img src="../assets/imgs/返回2.png" @click="changeSide" /></span>
      </div>
      <div class="menu-content" v-for="(item, index) in problems" :key="item">
        <a :href="'#problem' + index">
          <span>{{ index + 1 }}:{{ item.title }}</span>
          <span
            ><img
              src="../assets/imgs/勾选.png"
              v-if="
                (item.result.value && item.type != 'score') ||
                (item.result.value > -1 && item.type === 'score')
              " />
            <img
              src="../assets/imgs/勾选1.png"
              v-if="
                !item.result.value ||
                (item.result.value === -1 && item.type === 'score')
              "
          /></span>
        </a>
      </div>
    </div>
    <div class="header-box" v-if="flagg">
      <div class="header">
        <div class="header-left">
          <div class="header-progress">
            <span
              >填写进度(<i>{{ this.num }}</i
              >/{{ this.total }})</span
            >
            <el-progress
              :percentage="percent * 100"
              :show-text="false"
              v-if="!isNaN(parseInt(percent * 100))"
            />
          </div>
        </div>
        <div class="header-detail">
          <i>|</i><span @click="changeHeader">详情</span>
        </div>
      </div>
    </div>
    <div class="header-content">
      <div class="mask" v-if="flagg && flaggg"></div>
      <div class="catalogue" :style="{ bottom: height + 'px' }">
        <div class="title-catalogue">
          <span>题目目录(共{{ total }}题)</span>
          <img src="../assets/imgs/下拉.png" @click="changeHeader" />
        </div>
        <div class="catalogue-box">
          <div class="menu">
            <span>已填</span>
            <span
              ><i>{{ num }}</i
              >/{{ total }}</span
            >
          </div>
        </div>
        <div class="menu-content" v-for="(item, index) in problems" :key="item">
          <a :href="'#problem' + index" @click="changeHeader">
            <span>{{ index + 1 }}:{{ item.title }}</span>
            <span
              ><img
                src="../assets/imgs/勾选.png"
                v-if="
                  (item.result.value && item.type != 'score') ||
                  (item.result.value > -1 && item.type === 'score')
                " />
              <img
                src="../assets/imgs/勾选1.png"
                v-if="
                  !item.result.value ||
                  (item.result.value === -1 && item.type === 'score')
                "
            /></span>
          </a>
        </div>
      </div>
    </div>
    <div class="fill-form-container" @click="findChange" @keyup="findChange">
      <div class="title">{{ title }}</div>
      <div class="subTitle">{{ subTitle }}</div>
      <component
        v-for="(item, index) in problems"
        :id="'problem' + index"
        :key="item"
        :is="componentType(item.type)"
        :problemType="item.type"
        :problemNumber="index"
        :resultValue="item.result.value"
        @resultValueInput="item.result.value = $event"
        :timeDateFormat="item.setting.options[0].title"
        @timeDateFormatChange="item.setting.options[0].title = $event"
        :problemOptions="item.setting.options"
        @optionTitleChange="
          (idx, newTitle) =>
            handleTitleChange(idx, newTitle, item.setting.options)
        "
        @delOptionTitle="delOptionTitle($event, item.setting.options)"
        @addOptionTitle="
          item.setting.options.push({
            title: '',
            status: 1,
          })
        "
        @radioOptionChange="item.result.value.title = $event"
        @checkboxOptionChange="
          item.result.value = $event.map((tmp) => ({
            id: '',
            title: tmp,
          }))
        "
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
      flag: false,
      flagg: false,
      flaggg: false,
      height: -500,
    }
  },
  watch: {
    flagg: {
      handler(newVal, oldVal) {
        if (window.innerWidth <= 748) {
          this.flagg = true
        }
        this.changeFlag()
      },
      immediate: true,
    },
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
      console.log('res')
      console.log(res)
      console.log('问题数组')
      this.title = res.data.item.title
      this.subTitle = res.data.item.subTitle
      if (
        localStorage.getItem('edit') &&
        localStorage.getItem('id') === this.id
      ) {
        this.problems = JSON.parse(localStorage.getItem('edit') || '[]')
      } else {
        this.problems = res.data.item.problems
        console.log(this.problems)
      }
    },
    writeForm: async function () {
      console.log('打印问题')
      console.log(this.problems)
      await request.writeForm(this.id, this.problems)
    },
    submitForm() {
      this.writeForm()
      alert('填写成功')
      this.$router.push('/')
    },
    findChange() {
      this.num = 0
      for (let k in this.problems) {
        if (
          this.problems[k].type === 'score' &&
          Number(this.problems[k].result?.value) > -1
        ) {
          this.num++
        } else if (this.problems[k].type === 'multiSelect') {
          let arr = String(this.problems[k].result?.value).split(',')
          console.log('arr.length')
          console.log(arr)
          console.log(arr.length) //1???
          if (arr.length) this.num++
        } else if (
          this.problems[k].type === 'singleSelect' ||
          this.problems[k].type === 'pullSelect'
        ) {
          let data = Object(this.problems[k].result?.value)
          if (data.title) this.num++
          // for (let item in data) {
          //   let selectFlag = 0
          //   if (data[item]) {
          //     selectFlag = 1
          //   }
          //   if (selectFlag) this.num++
          // }
        } else if (
          this.problems[k].result?.value &&
          this.problems[k].type != 'score'
        ) {
          this.num++
        }
        this.total = parseInt(k) + 1
      }
      this.percent = this.num / this.total
    },
    handleTitleChange(
      idx: number,
      newTitle: string,
      options: { title: string; status: 1 | 2 }[]
    ) {
      options[idx].title = newTitle
    },
    delOptionTitle(idx: number, options: []) {
      options.splice(idx, 1)
    },
    saveEdit() {
      localStorage.setItem('edit', JSON.stringify(this.problems))
      localStorage.setItem('id', this.id)
    },
    changeSide() {
      this.flag = !this.flag
      console.log(this.flag)
    },
    changeHeader() {
      this.flaggg = !this.flaggg
      this.height = -500 - this.height
    },
    changeFlag() {
      addEventListener('resize', () => {
        let screenWidth = window.innerWidth
        let result = screenWidth - 748
        this.flagg = result <= 0 ? true : false
        return result
      })
    },
  },
  created() {
    this.getFormById()
  },
  beforeUpdate() {
    this.findChange()
  },
})
</script>

<style scoped>
.main-box {
  margin: auto;
  display: flex;
  justify-content: center;
}
.fill-form-container {
  width: 776px;
  background-color: #fff;
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
}
.menu-content a {
  display: block;
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
.header-content {
  display: none;
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
  .header-box {
    width: 100%;
    height: 58px;
    background-color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
  .header {
    width: 70%;
    height: 58px;
    border-radius: 5px;
    background-color: #9e9e9e0d;
    margin: 5px auto;
    display: flex;
    justify-content: center;
  }
  .header-left {
    width: 70%;
  }
  .header-content {
    display: block;
  }
  .header-progress {
    margin: 10px auto;
  }
  .header-box .header-detail span {
    margin-left: 2%;
    color: #409eff;
  }
  .header-box .header-detail i {
    font-style: normal;
    margin-left: 10px;
    margin-right: 10px;
    color: #ccc;
  }
  .header-detail {
    width: 50px;
    line-height: 58px;
  }
  .catalogue {
    position: fixed;
    width: 100%;
    padding: 0px 15px;
    transition: bottom 0.5s;
    left: 0;
    border-radius: 10px;
    background-color: #fff;
    z-index: 3;
  }
  .mask {
    background-color: black;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .title-catalogue {
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
  .title-catalogue img {
    float: right;
    height: 20px;
    margin: 10px 0px;
  }
  .menu {
    color: black;
    font-weight: 600;
  }
  .menu-content {
    width: 100%;
    /* display: flex;
    justify-content: space-between;
    align-items: center; */
  }
  .menu-content span {
    line-height: 40px;
    color: black;
  }
  .btn {
    flex-direction: column;
    align-items: center;
  }
  .btn button {
    width: 296.68px;
    margin-bottom: 20px;
    margin-left: 0px;
  }
}
</style>
