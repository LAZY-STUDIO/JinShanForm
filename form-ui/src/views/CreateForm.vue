<template>
  <div class="create-form-outer" @click="itemBlur">
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
      <div class="create-form-middle">
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
            :class="[
              'form-subTitle',
              subTitleFocus ? 'item-focus' : '',
              subTitleCenter ? 'el-text-center' : '',
            ]"
            @click.stop
          >
            <el-input
              v-model="subTitle"
              :readonly="!options.showActions"
              :placeholder="'点击设置描述'"
              @focus="subTitleFocus = true"
            />
            <div v-show="subTitleFocus" class="subTitle-actions" ref="subTitle">
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
              :key="item"
              :problemNumber="index"
              :problemType="item.type"
              :is="componentType(item.type)"
            >
            </component>
          </div>
        </div>
      </div>
      <div class="create-form-right" v-show="options.showActions">
        <div class="right-wrap">
          <div class="preview" @click="options.showActions = false">预览</div>
          <div class="sava-draft" @click="saveDraft">保存草稿</div>
          <div class="finish-create" @click="finishCreateForm">完成创建</div>
        </div>
      </div>
    </div>
    <div class="bottom-actions" v-show="!options.showActions">
      <div class="preview" @click="options.showActions = true">继续编辑</div>
      <div class="finish-create" @click="finishCreateForm">完成创建</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
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
    // todo: 确定组件的blur样式，不仅仅是子标题
    itemBlur() {
      this.subTitleFocus = false
    },
    // 数据初始化 todo
    async init() {
      await this.userLogin()
      await Promise.all([this.getProblemTypes(), this.getProblemBasics()])
      // 路由传递的form
      const res = this.$route.query.form
      if (res && typeof res === 'string') {
        const { status, title, subTitle, problems } = JSON.parse(res)
        this.status = status
        this.title = title
        this.subTitle = subTitle
        this.problems = problems
      }
    },
    async userLogin() {
      await login('leibuyun', '123456')
    },
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
    addCommonProblem(problemType: IProblemType) {
      this.problems.push({
        title: '',
        type: problemType.type,
        required: false,
        isNew: false,
      })
    },
    addTemplateProblem(problem: IProblem) {
      this.problems.push(problem)
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
.create-form-outer {
  background-color: #f2f4f7;
  height: 100%;
  overflow: auto;
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
  margin-bottom: 20px;

  .middle-wrap {
    background-color: #fff;
    // height: 100%;
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
  .form-title();

  margin-top: 16px;
  padding: 12px 20px;

  :deep(.el-input__inner) {
    text-align: left;
    font-size: 14px;
    font-weight: normal;

    &::-webkit-input-placeholder {
      color: #aeb5c0;
    }

    &:hover {
      border-bottom: 1px solid #e8ebee;
    }
  }

  .subTitle-actions {
    margin-top: 15px;

    img {
      margin-left: 10px;
      cursor: pointer;

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
  :deep(.el-input__inner) {
    text-align: center;
  }
}

// 元素聚焦的时候
.item-focus {
  box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);

  :deep(.el-input__inner) {
    border-bottom: 1px solid #1488ed;
  }

  &:hover {
    border-bottom: none;
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
  margin: auto;
  display: flex;
  justify-content: center;
  gap: 30px;
  flex: 1;

  > div {
    cursor: pointer;
    width: 156px;
    height: 36px;
    line-height: 32px;
    text-align: center;
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

// tooltip
.tooltip-box {
  padding: 10px 20px !important;
  box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);
  color: #969696;
}

.action-must-select {
  width: 100%;

  &:hover {
    background-color: #f2f2f2;
  }
}
</style>
