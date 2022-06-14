<template>
  <div
    :class="['create-form-outer', !options.showActions ? 'preview-set' : '']"
  >
    <div class="header">
      <my-header></my-header>
    </div>
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
            @addProblem="addTemplateProblem"
            :allowUnfold="true"
            :dataList="starProblems.map((s) => s.problem)"
          >
            <template v-slot:manage
              ><div class="star-problem-manage" @click="openDrawer">
                管理
              </div></template
            >
            <template v-slot:default>
              <div class="empty-data">
                暂无我的常用题, 立即<span
                  class="add-collect"
                  @click="addStarProblemPage = true"
                  >添加</span
                >
              </div>
            </template>
          </problem-list>
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
              :class="[
                'form-subTitle',
                subTitleCenter ? 'el-text-center' : '',
                !options.showActions ? 'hidBgst' : '',
              ]"
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
                :problemOptions="item.setting.options"
                @optionTitleChange="
                  (idx, newTitle) =>
                    (item.setting.options[idx].title = newTitle)
                "
                @delOptionTitle="item.setting.options.splice($event, 1)"
                @addOptionTitle="
                  item.setting.options.push({
                    title: '',
                    status: 1,
                  })
                "
                @radioOptionChange="item.result.value.title = $event"
                @checkboxOptionChange="
                  item.result.value = $event.map((tmp) => ({
                    id: tmp,
                    title: tmp,
                  }))
                "
                @addStarProblem="starProblem"
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
    <div class="drawer-outer">
      <ex-modal :title="'管理常用题'" :visible="drawer" @close="closeDrawer">
        <template v-if="!addStarProblemPage">
          <div class="add-star-text" @click="addStarProblemPage = true">
            +添加新的常用题
          </div>
          <el-scrollbar max-height="400px">
            <div
              v-for="item in starProblems"
              :key="item.id"
              class="star-problem-item"
            >
              <span class="star-item-title">{{ item.problem.title }}</span>
              <el-popconfirm
                confirm-button-text="删除"
                cancel-button-text="取消"
                confirmButtonType="danger"
                icon-color="#626AEF"
                title="确认删除该常用题?"
                @confirm="deleteStarProblem(item.id)"
              >
                <template #reference>
                  <span class="star-item-delete">删除</span>
                </template>
              </el-popconfirm>
            </div>
          </el-scrollbar>
        </template>
        <template v-else>
          <div class="add-star-container">
            <div class="template-list">
              <div class="add-header-title">选择题型</div>
              <el-button
                v-for="item in problemTypeList"
                :key="item"
                @click="choiceStarType(item.type)"
                >{{ item.title }}</el-button
              >
            </div>
            <div class="add-star-component">
              <component
                :is="
                  componentType(this.problems[this.problems.length - 1].type)
                "
                :problemNumber="this.problems.length - 1"
                :problemType="this.problems[this.problems.length - 1].type"
                :resultValue="
                  this.problems[this.problems.length - 1].result.value
                "
                @resultValueInput="
                  this.problems[this.problems.length - 1].result.value = $event
                "
                :timeDateFormat="
                  this.problems[this.problems.length - 1].setting.options[0]
                    .title
                "
                @timeDateFormatChange="
                  this.problems[
                    this.problems.length - 1
                  ].setting.options[0].title = $event
                "
                :problemOptions="
                  this.problems[this.problems.length - 1].setting.options
                "
                @optionTitleChange="
                  (idx, newTitle) =>
                    (this.problems[this.problems.length - 1].setting.options[
                      idx
                    ].title = newTitle)
                "
                @delOptionTitle="
                  this.problems[
                    this.problems.length - 1
                  ].setting.options.splice($event, 1)
                "
                @addOptionTitle="
                  this.problems[this.problems.length - 1].setting.options.push({
                    title: '',
                    status: 1,
                  })
                "
                @radioOptionChange="
                  this.problems[this.problems.length - 1].result.value.title =
                    $event
                "
                @checkboxOptionChange="
                  this.problems[this.problems.length - 1].result.value =
                    $event.map((tmp) => ({
                      id: tmp,
                      title: tmp,
                    }))
                "
                @addStarProblem="starProblem"
              >
              </component>
            </div>
            <div class="actions">
              <el-button @click="addStarProblemPage = false">取消</el-button>
              <el-button type="primary" @click="confirmAddStarProblem"
                >确认</el-button
              >
            </div>
          </div>
        </template>
      </ex-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage, ElScrollbar } from 'element-plus'
import MyHeader from '../components/MyHeader.vue'
import ProblemList from '../components/ProblemList.vue'
import {
  getProblemTypeList,
  getProblemBasicList,
  listStar,
  starProblem,
  cancelProblemStar,
  createForm,
} from '../services/api'
import {
  IProblemType,
  IProblem,
  ProblemType,
  IForm,
  IStarProblem,
} from '../types'
import InputProblem from '../components/InputProblem.vue'
import SelectProblem from '../components/SelectProblem.vue'
import ExModal from '../components/ExModal.vue'
import { problemInit, componentType, getUUID } from '../utils/commonUtils'

export default defineComponent({
  name: 'CreateForm',
  components: {
    ProblemList,
    InputProblem,
    SelectProblem,
    MyHeader,
    ExModal,
  },
  provide() {
    return {
      forefatherComponent: this,
      options: this.options,
    }
  },
  data() {
    return {
      addStarProblemPage: false,
      drawer: false,
      titlePlaceholder: '请输入表单标题',
      msgBoxClose: true,
      subTitleCenter: true,
      options: {
        showActions: true,
        showFooter: true,
      },
      problemTypeList: [] as IProblemType[],
      problemBasicList: [] as IProblem[],
      starProblems: [] as IStarProblem[],
      formId: getUUID(),
      status: 0,
      title: '',
      subTitle: '',
      problems: [] as IProblem[],
    }
  },
  methods: {
    // 创建表单中间 添加题目时抖动效果（移动滚动条）
    changeScrollHeight() {
      let scrollbarRef = this.$refs.scrollbarRef as InstanceType<
        typeof ElScrollbar
      >
      let createFormMiddleRef = this.$refs.createFormMiddleRef as HTMLDivElement
      setTimeout(() => {
        scrollbarRef.setScrollTop(Number(createFormMiddleRef.clientHeight))
      }, 500)
    },

    // 数据初始化 todo
    async init() {
      await Promise.all([
        this.getProblemTypes(),
        this.getProblemBasics(),
        this.getStarProblemList(),
      ])
      // 路由传递的form
      // todo: 修改默认值
      const res = this.$route.query.form
      if (res && typeof res === 'string') {
        const { id, status, title, subTitle, problems } = JSON.parse(res)
        this.formId = id
        this.status = status
        this.title = title
        this.subTitle = subTitle
        this.problems = problems.map((problem: IProblem) =>
          this.problemInit(problem)
        )
      }
    },
    async getProblemTypes() {
      const res = await getProblemTypeList()
      this.problemTypeList = res.data.problemTypes
    },
    async getProblemBasics() {
      const res = await getProblemBasicList()
      this.problemBasicList = res.data.basicProblems
    },
    async getStarProblemList() {
      const res = await listStar()
      this.starProblems = res.data.items
    },
    // 完成表单创建
    // if status ==  1, 删除localstorage的草稿信息
    // 创建
    async finishCreateForm() {
      let tipMsg = ''
      let flag = true
      if (this.problems.length === 0) {
        tipMsg = '请至少设置一个填选项'
        flag = false
      }
      // 校验problems
      if (
        this.problems.filter((problem: IProblem) => {
          // problem的title
          let titleFlag = problem.title.trim() === ''
          let optionFlag = false
          if (
            problem.type === ProblemType.singleSelect ||
            problem.type === ProblemType.multiSelect ||
            problem.type === ProblemType.pullSelect
          ) {
            optionFlag =
              problem.setting?.options.filter((p) => p.title.trim() === '')
                .length !== 0
          }
          // 找出title为空 或者存在option的title为空的个数
          return titleFlag || optionFlag
        }).length !== 0
      ) {
        tipMsg = '问题未填写完整'
        flag = false
      }
      // todo 跳转
      if (this.title.trim().length === 0) {
        tipMsg = '表单标题不能为空'
        flag = false
      }
      if (this.subTitle.trim().length === 0) {
        tipMsg = '表单描述不能为空'
        flag = false
      }
      // 校验失败
      if (!flag) {
        ElMessage({
          message: tipMsg,
          customClass: 'msg-box-form-title-success',
          duration: 1000,
          type: 'error',
        })
      } else {
        // 校验成功
        const res = await createForm(this.title, this.subTitle, this.problems)
        if (res.stat !== 'ok') {
          ElMessage({
            message: res.msg,
            customClass: 'msg-box-form-title-success',
            duration: 1000 * 2,
            type: 'error',
          })
        } else {
          // 判断是否是草稿
          if (this.status === 1) {
            const ustr = sessionStorage.getItem('user')
            if (ustr) {
              const { account } = JSON.parse(ustr)
              const dLstStr = localStorage.getItem(account + 'DraftList')
              let draftList = [] as IForm[]
              if (dLstStr) {
                draftList = JSON.parse(dLstStr)
              }
              // 找到当前草稿
              let idx = -1
              for (let i = 0; i < draftList.length; ++i) {
                if (draftList[i].id === this.formId) {
                  idx = i
                  break
                }
              }
              draftList.splice(idx, 1)
              localStorage.setItem(
                account + 'DraftList',
                JSON.stringify(draftList)
              )
            }
          }
          ElMessage({
            message: '创建成功',
            customClass: 'msg-box-form-title-success',
            duration: 1000 * 2,
            type: 'success',
          })
          // todo: 跳转
        }
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
      const ustr = sessionStorage.getItem('user')
      if (ustr) {
        const { account } = JSON.parse(ustr)
        const dLstStr = localStorage.getItem(account + 'DraftList')
        let draftList = [] as IForm[]
        if (dLstStr) {
          draftList = JSON.parse(dLstStr)
          console.log(draftList)
        }
        // 判断是否存在当前草稿
        let idx = -1
        for (let i = 0; i < draftList.length; ++i) {
          if (draftList[i].id === this.formId) {
            idx = i
            break
          }
        }
        if (idx === -1) {
          draftList.push({
            id: this.formId,
            ctime: Date.now(),
            utime: Date.now(),
            status: 1,
            author: account,
            isStar: false,
            title: this.title,
            subTitle: this.subTitle,
            problems: this.problems,
          })
        } else {
          draftList[idx].utime = Date.now()
          draftList[idx].title = this.title
          draftList[idx].subTitle = this.subTitle
          draftList[idx].problems = this.problems
        }
        localStorage.setItem(account + 'DraftList', JSON.stringify(draftList))
      }
      ElMessage({
        message: '草稿保存成功',
        customClass: 'msg-box-form-title-success',
        duration: 1000,
        type: 'success',
      })
    },
    problemInit: problemInit,
    componentType: componentType,
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
    tipMsg(limit: number) {
      console.log(limit)
    },
    async starProblem(idx: number) {
      await starProblem(this.problems[idx])
      await this.getStarProblemList()
      ElMessage({
        message: '添加成功',
        customClass: 'msg-box-form-title',
        duration: 1000 * 2,
        type: 'success',
      })
    },
    async deleteStarProblem(id: string) {
      await cancelProblemStar(id)
      await this.getStarProblemList()
    },
    openDrawer() {
      this.drawer = true
      this.options.showFooter = false
      this.problems.push(
        this.problemInit({
          title: '',
          type: ProblemType.singleSelect,
          required: false,
          isNew: false,
        })
      )
    },
    closeDrawer() {
      this.drawer = false
      this.options.showFooter = true
      this.addStarProblemPage = false
      this.problems.pop()
    },
    confirmAddStarProblem() {
      if (
        this.problems.filter((problem: IProblem) => {
          // problem的title
          let titleFlag = problem.title.trim() === ''
          let optionFlag = false
          if (
            problem.type === ProblemType.singleSelect ||
            problem.type === ProblemType.multiSelect ||
            problem.type === ProblemType.pullSelect
          ) {
            optionFlag =
              problem.setting?.options.filter((p) => p.title.trim() === '')
                .length !== 0
          }
          // 找出title为空 或者存在option的title为空的个数
          return titleFlag || optionFlag
        }).length === 0
      ) {
        this.addStarProblemPage = false
        this.starProblem(this.problems.length - 1)
      } else {
        ElMessage({
          message: '未填写完整',
          customClass: 'msg-box-form-title',
          duration: 1000 * 2,
          type: 'warning',
        })
      }
    },
    choiceStarType(type: ProblemType) {
      this.problems.pop()
      this.problems.push(
        this.problemInit({
          title: '',
          type: type,
          required: false,
          isNew: false,
        })
      )
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
    subTitle(newVal: string, oldVal: string) {
      if (newVal.length >= 300 && this.msgBoxClose) {
        ElMessage({
          message: '最多输入300个字',
          customClass: 'msg-box-form-title',
          duration: 1000 * 2,
          type: 'warning',
          onClose: () => (this.msgBoxClose = true),
        })
        this.msgBoxClose = false
      }
      if (newVal.length > 300) this.subTitle = oldVal
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
    z-index: 10;
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

  &:focus-within {
    box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);
    border: none;

    :deep(.el-textarea__inner) {
      border-bottom: 1px solid #1488ed;
    }

    .subTitle-actions {
      display: initial;
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
    display: none;

    img {
      cursor: pointer;
      margin-top: 15px;
      margin-right: 8px;

      &:focus {
        background-color: #f2f4f7;
      }
    }
  }
}

.hidBgst {
  box-shadow: none !important;
  .subTitle-actions {
    display: none !important;
  }

  :deep(.el-textarea__inner) {
    border-bottom: none !important;
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

.star-problem-manage {
  color: #1488ed;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.drawer-outer {
  .add-star-text {
    color: #1488ed;
    font-size: 14px;
    margin: 10px 0;
    cursor: pointer;
  }

  .star-problem-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    border: 1px solid #e2e6ed;

    .star-item-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      overflow: hidden;
      white-space: nowrap;
      word-break: keep-all;
      text-overflow: ellipsis;
      margin-left: 20px;
    }

    .star-item-delete {
      color: #1488ed;
      margin-right: 30px;
      cursor: pointer;
    }
  }
}

.add-star-container {
  .add-header-title {
    margin-top: 6px;
    font-weight: bold;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }

  .add-star-component {
    margin-top: 20px;
  }

  .template-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    gap: 10px;
  }

  .actions {
    position: absolute;
    right: 30px;
    bottom: 30px;
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
