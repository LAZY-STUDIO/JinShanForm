<template>
  <div
    :class="[
      'problem-container-outer',
      showActions ? '' : 'other-page-problem-container-outer',
    ]"
    tabindex="0"
  >
    <div class="problem-titie-container">
      <span class="problem-number">
        <span class="must-star" v-show="required">*</span>
        {{ problemNumber + 1 }}.</span
      >
      <el-input
        v-model="title"
        type="textarea"
        :disabled="!showActions"
        autosize
        resize="none"
        maxlength="500"
        placeholder="请输入问题"
      />
    </div>
    <slot></slot>
    <div class="hidden-wrap" v-if="showActions">
      <slot name="slot-actions"></slot>
      <div class="problem-buttons">
        <span class="problem-type">{{ problemTypeName }}</span>
        <div class="split-div"></div>
        <div @click="copy" class="copy-button">复制</div>
        <div class="split-div"></div>
        <div class="must-select">
          <el-checkbox label="必填" name="type" v-model="required" />
          <el-tooltip
            popper-class="tooltip-box"
            effect="light"
            placement="bottom"
          >
            <template #content
              ><div class="action-must-select" @click="mustSelect">
                {{ mustSelectText }}
              </div></template
            >
            <i class="iconfont icon-angle-down"></i>
          </el-tooltip>
        </div>
        <div class="split-div"></div>
        <el-tooltip
          popper-class="tooltip-box"
          content="删除"
          effect="light"
          placement="bottom"
        >
          <img
            src="../assets/imgs/trash.svg"
            @click="trash"
            style="cursor: pointer"
          />
        </el-tooltip>
        <img src="../assets/imgs/operation.svg" class="operation-icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { IProblemType, ProblemType } from '@/types'

export default defineComponent({
  // export default {
  name: 'ProblemBase',
  data() {
    return {
      title: this.forefatherComponent.problems[this.problemNumber].title,
      required: this.forefatherComponent.problems[this.problemNumber].required,
      msgBoxClose: true,
    }
  },
  computed: {
    showActions() {
      return this.options.showActions
    },
    mustSelectText() {
      return '设置所有题目为' + (this.required ? '必填' : '非必填') + '项'
    },
    problemTypeName() {
      const type = this.forefatherComponent.problems[this.problemNumber].type
      let res = ''
      switch (type) {
        case ProblemType.input:
          res = '填空题'
          break
        case ProblemType.singleSelect:
          res = '单选题'
          break
        case ProblemType.multiSelect:
          res = '多选题'
          break
        case ProblemType.pullSelect:
          res = '下拉题'
          break
        case ProblemType.score:
          res = '打分题'
          break
        case ProblemType.time:
          res = '时间题'
          break
        case ProblemType.date:
          res = '日期题'
          break
      }
      return res
    },
  },
  methods: {
    copy() {
      const problem = this.forefatherComponent.problems[this.problemNumber]
      this.forefatherComponent.problems.push(problem)
    },
    trash() {
      this.forefatherComponent.problems.splice(this.problemNumber, 1)
    },
    // 设置所有题目的required
    mustSelect() {
      this.forefatherComponent.problems = this.forefatherComponent.problems.map(
        (problem: IProblemType) => ({
          ...problem,
          required: this.required,
        })
      )
    },
  },
  /**
   * todo: 根据pageFrom决定ProblemBase的状态
   * createForm： edit
   * showForm: input
   */
  inject: ['forefatherComponent', 'options'],
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
  },
  watch: {
    // title(newVal: string, oldVal: string) {
    title(newVal: string) {
      if (newVal.length >= 500 && this.msgBoxClose) {
        ElMessage({
          message: '最多输入500个字',
          customClass: 'msg-box-form-title',
          duration: 1000 * 2,
          type: 'warning',
          onClose: () => (this.msgBoxClose = true),
        })
        this.msgBoxClose = false
        return
      }
      this.forefatherComponent.problems[this.problemNumber].title = newVal
    },
    required(newVal: boolean) {
      this.forefatherComponent.problems[this.problemNumber].required = newVal
    },
  },
  // }
})
</script>

<style lang="less" scoped>
.problem-container-outer {
  width: 100%;
  padding: 20px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: left;
  // border: 1px solid blue;

  // 题目聚焦时
  &:focus-within {
    box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);
    padding-bottom: 0;

    .hidden-wrap {
      display: initial;
    }
  }
}

.other-page-problem-container-outer {
  &:focus-within {
    box-shadow: none;
    padding-bottom: 40px;
  }

  .problem-titie-container:hover {
    border-bottom: none;
  }
}

.problem-titie-container {
  padding: 8px 0 5px 0;
  margin-bottom: 3px;
  color: #3d4757;
  font-size: 14px;
  line-height: 20px;
  position: relative;

  &:hover {
    border-bottom: 1px solid #e8ebee;
  }

  &:focus-within {
    border-bottom: 1px solid #1488ed;
  }

  .problem-number {
    position: absolute;
    top: 8px;
    z-index: 1;

    .must-star {
      position: absolute;
      top: 0;
      left: -8px;
      color: red;
    }
  }

  :deep(.el-textarea__inner) {
    font-family: Arial;
    font-weight: bold;
    box-shadow: none;
    text-indent: 20px;
    line-height: inherit;
    padding: 0;
    border-radius: 0;
    overflow-y: hidden;
    color: #3d4757;
  }

  :deep(.is-disabled .el-textarea__inner) {
    color: #3d4757;
    background-color: transparent;
    cursor: unset;
  }
}

.hidden-wrap {
  display: none;
}

// 操作栏
.problem-buttons {
  display: flex;
  justify-content: right;
  align-items: center;
  font-size: 12px;
  padding: 4px 0;

  .problem-type {
    color: #949aae;
    background-color: #edeff2;
    padding: 6px 8px;
  }

  .split-div {
    width: 1px;
    height: 12px;
    background: #e2e6ed;
    margin: 0 20px;
  }

  .copy-button {
    cursor: pointer;
    padding: 2px 5px;
    border: 1px solid #e2e6ed;
  }

  .must-select {
    color: #949aae;
    display: flex;
    align-items: center;

    :deep(.el-checkbox) {
      flex-direction: row-reverse;

      .el-checkbox__label {
        font-size: 12px;
        color: #949aae;
      }
    }

    :deep(.el-checkbox__inner) {
      margin: 8px;
    }

    .action-must-select {
      cursor: pointer;
    }
  }

  .operation-icon {
    margin-left: 15px;
    cursor: pointer;
  }
}

// tooltip
.tooltip-box {
  padding: 10px 20px !important;
  box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);
  color: #969696;
}

// 设置所有题目为必填项/非必填项
.action-must-select {
  width: 100%;
  font-size: 13px;
  text-align: center;
  height: 26px;
  line-height: 26px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;

  &:hover {
    background-color: #f2f2f2;
  }
}
</style>
