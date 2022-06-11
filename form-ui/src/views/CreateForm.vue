<template>
  <div
    :class="['create-form-outer', !options.showActions ? 'preview-set' : '']"
  >
    <div class="header">新建表单 {{ title }}</div>
    <div class="create-form-container">
      <div class="create-form-left-side" v-show="options.showActions">
        <div class="left-wrap">
          <problem-list
            :title="'添加题目'"
            @addProblem="addCommonProblem"
            :allowUnfold="false"
            :dataList="problemTypeList"
            :allowIcon="true"
          ></problem-list>
          <problem-list
            :title="'题目模板'"
            @addProblem="addTemplateProblem"
            :allowUnfold="true"
            :dataList="problemBasicList"
          ></problem-list>
          <problem-list
            :title="'我的常用题'"
            :allowUnfold="true"
            :dataList="tmpList"
            ><div class="empty-data">
              暂无我的常用题, 立即<span class="add-collect">添加</span>
            </div></problem-list
          >
        </div>
      </div>
      <el-scrollbar max-height="100vh" ref="scrollbarRef" always>
        <div class="create-form-middle" ref="createFormMiddleRef">
          <div class="middle-wrap">
            <div class="form-title">
              <el-input
                v-model="title"
                :placeholder="titlePlaceholder"
                :readonly="!options.showActions"
                @focus="titlePlaceholder = ''"
                @blur="titlePlaceholder = '请输入表单标题'"
              />
            </div>
            <div
              :class="['form-subTitle', subTitleCenter ? 'el-text-center' : '']"
              tabindex="0"
            >
              <el-input
                v-model="subTitle"
                type="textarea"
                autosize
                resize="none"
                :readonly="!options.showActions"
                :placeholder="'点击设置描述'"
              />
              <div class="subTitle-actions" ref="subTitle">
                <img
                  src="../assets/imgs/icon-text-left.png"
                  :style="{
                    'background-color': subTitleCenter ? '' : '#f2f4f7',
                  }"
                  @click="subTitleCenter = false"
                />
                <img
                  src="../assets/imgs/icon-text-center.png"
                  :style="{
                    'background-color': subTitleCenter ? '#f2f4f7' : '',
                  }"
                  @click="subTitleCenter = true"
                />
              </div>
            </div>
            <div class="problem-form-list">
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
              >
              </component>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="create-form-right" v-show="options.showActions">
        <div class="right-wrap">
          <div class="preview" @click="options.showActions = false">预览</div>
          <div class="sava-draft" @click="saveDraft">保存草稿</div>
          <div class="finish-create" @click="finishCreateForm">完成创建</div>
        </div>
      </div>
    </div>
    <div class="bottom-actions" v-show="!options.showActions">
      <div class="preview" @click="backToEdit">继续编辑</div>
      <div class="finish-create" @click="finishCreateForm">完成创建</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage, ElScrollbar } from 'element-plus'
import ProblemList from '../components/ProblemList.vue'
import {
  login,
  getProblemTypeList,
  getProblemBasicList,
  createForm,
} from '../services/api'
import { IProblemType, IProblem, ProblemType } from '../types'
import InputProblem from '../components/InputProblem.vue'
import SelectProblem from '../components/SelectProblem.vue'

export default defineComponent({
  name: 'CreateForm',
  components: {
    ProblemList,
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
      // 常用题
      tmpList: [],
      titlePlaceholder: '请输入表单标题',
      msgBoxClose: true,
      subTitleFocus: false,
      subTitleCenter: true,
      options: {
        showActions: true,
      },
      problemTypeList: [] as IProblemType[],
      problemBasicList: [] as IProblem[],
      status: 1,
      title: '',
      subTitle: '',
      problems: [] as IProblem[],
    }
  },
  methods: {
    changeScrollHeight() {
      let scrollbarRef = this.$refs.scrollbarRef as InstanceType<
        typeof ElScrollbar
      >
      let createFormMiddleRef = this.$refs.createFormMiddleRef as HTMLDivElement
      setTimeout(() => {
        scrollbarRef.setScrollTop(Number(createFormMiddleRef.clientHeight))
      }, 500)
    },
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
    // 数据初始化 todo
    async init() {
      // await this.userLogin()
      await Promise.all([this.getProblemTypes(), this.getProblemBasics()])
      // 路由传递的form
      // todo: 修改默认值
      const res = this.$route.query.form
      if (res && typeof res === 'string') {
        const { status, title, subTitle, problems } = JSON.parse(res)
        this.status = status
        this.title = title
        this.subTitle = subTitle
        this.problems = problems.map((problem: IProblem) =>
          this.problemInit(problem)
        )
      }
    },
    // async userLogin() {
    //   await login('leibuyun', '123456')
    // },
    async getProblemTypes() {
      const res = await getProblemTypeList()
      this.problemTypeList = res.data.problemTypes
    },
    async getProblemBasics() {
      const res = await getProblemBasicList()
      this.problemBasicList = res.data.basicProblems
    },
    // 完成表单创建
    // if status ==  1, 删除localstorage的草稿信息
    // 创建
    async finishCreateForm() {
      if (this.title.trim().length > 0 && this.subTitle.trim().length > 0) {
        // todo: 校验problems
        const res = await createForm(this.title, this.subTitle, this.problems)
        // 创建完成后删除草稿
        // localStorage.removeItem('form')
      }
    },
    backToEdit() {
      this.options.showActions = true
      this.problems = this.problems.map((problem: IProblem) =>
        this.problemInit(problem, true)
      )
    },
    // 将form保存至localstorage
    saveDraft() {
      // localStorage.setItem('problems', JSON.stringify(this.problems))
      ElMessage({
        message: '草稿保存成功',
        customClass: 'msg-box-form-title-success',
        duration: 1000,
        type: 'success',
        onClose: () => (this.msgBoxClose = true),
      })
    },
    problemInit(problem: IProblem, flag = false) {
      let setting = {
        options: [{ title: '', status: 1 }] as {
          title: string
          status: 1 | 2
        }[],
      }
      let result = {
        value: '',
      } as {
        value: string | number
      }
      if (problem.type === ProblemType.score) {
        result.value = -1
      } else if (problem.type === ProblemType.date) {
        setting.options[0].title = 'YYYY/MM'
      } else if (problem.type === ProblemType.time) {
        setting.options[0].title = '时刻: 时-分(24小时制)'
      }
      if (!problem.setting) {
        problem.setting = setting
      }
      return !flag
        ? {
            setting,
            result,
            ...problem,
          }
        : {
            setting,
            ...problem,
            result,
          }
    },
    addCommonProblem(problemType: IProblemType) {
      this.problems.push(
        this.problemInit({
          title: '',
          type: problemType.type,
          required: false,
          isNew: false,
        })
      )
      this.changeScrollHeight()
      // 题目聚焦
      this.$nextTick(() => {
        const problemId = 'problemBase' + (this.problems.length - 1)
        document.getElementById(problemId)?.focus()
      })
    },
    addTemplateProblem(problem: IProblem) {
      this.problems.push(this.problemInit(problem))
      this.changeScrollHeight()
      // 题目聚焦
      this.$nextTick(() => {
        const problemId = 'problemBase' + (this.problems.length - 1)
        document.getElementById(problemId)?.focus()
      })
    },
  },
  created() {
    this.init()
  },
  watch: {
    // 监听form标题的变化，不能超过30个字
    title(newVal: string, oldVal: string) {
      if (newVal.length >= 30 && this.msgBoxClose) {
        ElMessage({
          message: '最多输入30个字',
          customClass: 'msg-box-form-title',
          duration: 1000 * 2,
          type: 'warning',
          onClose: () => (this.msgBoxClose = true),
        })
        this.msgBoxClose = false
      }
      if (newVal.length > 30) this.title = oldVal
    },
  },
})
</script>
<style lang="less" scoped>
* {
  transition: margin-right 2s;
}

.create-form-outer {
  background-color: #f2f4f7;
  height: 100%;
  display: flex;
  flex-direction: column;

  // to delete
  .header {
    height: 56px;
    position: fixed;
    z-index: 999;
    background: #fff;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .create-form-container {
    flex: 1;
    padding-top: 72px;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }
}

.create-form-left-side {
  width: 212px;
  margin-right: 16px;
  margin-left: 10px;
  display: flex;

  .left-wrap {
    position: fixed;
    width: 212px;
    max-height: 620px;
    background-color: #fff;
    border: 1px solid #e7e9eb;
    border-radius: 2px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px 16px 0;

    // 设置滚动条的宽高
    &::-webkit-scrollbar {
      width: 6px;
      height: auto;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #bec2c9;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  .empty-data {
    font-size: 12px;
    text-align: center;
    margin-left: 7px;
    width: 100%;
  }

  .add-collect {
    color: #1488ed;
    cursor: pointer;
  }
}

.create-form-middle {
  width: 776px;
  // margin-bottom: 20px;

  .middle-wrap {
    background-color: #fff;
    // height: 100%;
    // margin-bottom: 30px;
    margin-bottom: 80px;
    padding: 50px 88px;
    min-height: calc(100vh - 150px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.form-title {
  width: 100%;

  :deep(.el-input__wrapper) {
    box-shadow: none;
  }

  :deep(.el-input__inner) {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    color: #3d4757;
    border: none;

    &::-webkit-input-placeholder {
      color: #3d4757;
    }
  }
}

.form-subTitle {
  width: 100%;
  margin-top: 28px;
  padding: 12px 20px;

  &:focus {
    box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);
    border: none;

    :deep(.el-textarea__inner) {
      border-bottom: 1px solid #1488ed;
    }
  }

  :deep(.el-textarea__inner) {
    text-align: left;
    box-shadow: none;
    overflow: hidden;
    border-radius: 0;
    color: #3d4757;
    padding: 8px 0 5px 0;

    &:hover {
      border-bottom: 1px solid #e8ebee;
    }
  }

  .subTitle-actions {
    margin-top: 15px;

    img {
      cursor: pointer;
      margin-right: 8px;
      visibility: hidden;

      &:focus {
        background-color: #f2f4f7;
      }
    }
  }
}

.problem-form-list {
  width: 100%;
}

.el-text-center {
  :deep(.el-textarea__inner) {
    text-align: center;
  }
}

.preview {
  grid-area: priview;
  background-color: #ffffff;
  border: 1px solid #e7e9eb;
  color: #3d4757;
  &:hover {
    background-color: #f9fafd;
  }
}

.finish-create {
  grid-area: create;
  background-color: #1488ed;
  border: none;
  color: #fff;
  &:hover {
    background-color: #2b94ee;
  }
}

.create-form-right {
  width: 290px;
  margin-left: 16px;
  margin-right: 10px;

  .right-wrap {
    position: fixed;
    width: 300px;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'priview draft'
      'create create';
    gap: 8px;
    text-align: center;
    font-size: 14px;

    div {
      cursor: pointer;
      height: 32px;
      border-radius: 2px;
      line-height: 32px;
    }

    .sava-draft {
      .preview();
      grid-area: draft;
    }
  }
}

.bottom-actions {
  width: 776px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  gap: 30px;

  > div {
    cursor: pointer;
    width: 156px;
    height: 36px;
    line-height: 32px;
    text-align: center;
  }
}

// 滚动条位置区别 默认 / 预览
.create-form-outer:not(.preview-set) {
  .create-form-container {
    :deep(.el-scrollbar) {
      position: initial !important;

      .el-scrollbar__bar.is-vertical {
        top: 76px;
      }
    }

    :deep(el-scrollbar__bar.is-vertical) {
      top: 76px;
    }
  }
}
</style>
<style lang="less">
// 修改弹出的消息框的样式，覆盖elmentui
// warning
.msg-box-form-title {
  top: 16px !important;
  background-color: #fff !important;
  min-width: 0 !important;
  box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%) !important;
  padding: 10px !important;

  .el-message-icon--warning {
    color: #2381ff !important;
  }

  .el-message__content {
    color: rgba(0, 0, 0, 0.65) !important;
  }
}

// success
.msg-box-form-title-success {
  .msg-box-form-title();
  .el-message-icon--warning {
    color: #00be77 !important;
  }
}
</style>
