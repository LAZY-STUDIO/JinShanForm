<template>
  <div class="problem-container-outer">
    <div class="problem-titie-container">
      <span class="problem-number">{{ problemNumber + 1 }}.</span>
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
    <div class="problem-actions" v-if="showActions">
      <div class="allow-repeat">
        <input type="checkbox" name="reading" checked style="margin: 0" />
        <span style="font-">不允许重复</span>
        <el-tooltip
          popper-class="tooltip-box"
          effect="light"
          placement="bottom"
        >
          <template #content
            >勾选后不允许填写者提交和已有数据<br />重复的内容</template
          >
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
              <circle stroke="#C0C6CF" cx="8" cy="8" r="6.5"></circle>
              <path fill="#C0C6CF" d="M7 4h2v5H7zM7 10h2v2H7z"></path>
            </g></svg
        ></el-tooltip>
      </div>
      <div class="problem-buttons">
        <span class="problem-type">填空题</span>
        <div class="split-div"></div>
        <div @click="copy" class="copy-button">复制</div>
        <div class="split-div"></div>
        <div class="must-select">
          <el-checkbox label="必填" name="type" />
          <el-tooltip
            popper-class="tooltip-box"
            effect="light"
            placement="bottom"
          >
            <template #content
              ><div class="action-must-select" @click="mustSelect">
                设置所有题目为必填
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
          <img src="../assets/imgs/trash.svg" />
        </el-tooltip>
        <img src="../assets/imgs/operation.svg" class="operation-icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'ProblemBase',
  data() {
    return {
      title: this.forefatherComponent.problems[this.problemNumber].title,
      msgBoxClose: true,
    }
  },
  methods: {
    copy() {
      console.log('复制')
    },
    mustSelect() {
      console.log('设置')
    },
  },
  /**
   * todo: 根据pageFrom决定ProblemBase的状态
   * createForm： edit
   * showForm: input
   */
  inject: ['forefatherComponent', 'showActions'],
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
  },
  watch: {
    title(newVal: string, oldVal: string) {
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
  },
})
</script>

<style lang="less" scoped>
.problem-container-outer {
  position: relative;
  width: 100%;
  padding: 20px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: left;
}

.problem-titie-container {
  padding: 8px 0 5px 0;
  color: #3d4757;
  font-size: 14px;
  line-height: 18px;
  position: relative;

  .problem-number {
    position: absolute;
    top: 8px;
    z-index: 1;
  }

  :deep(.el-textarea__inner) {
    font-family: Arial;
    font-weight: bold;
    box-shadow: none;
    text-indent: 20px;
    line-height: inherit;
    height: 18px;
    padding: 0;
    border-radius: 0;
    overflow-y: hidden;
    color: #3d4757;

    &:focus {
      border-bottom: 1px solid #1488ed;
    }
  }

  :deep(.is-disabled .el-textarea__inner) {
    color: #3d4757;
    background-color: transparent;
    cursor: unset;
  }
}

.allow-repeat {
  display: flex;
  align-items: center;
  margin-top: 10px;

  span {
    font-size: 12px;
    color: #1488ed;
    margin: 0 8px;
  }
}

.problem-buttons {
  display: flex;
  justify-content: right;
  align-items: center;
  font-size: 12px;

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
    }

    :deep(.el-checkbox__inner) {
      margin: 8px;
    }
  }

  .operation-icon {
    margin-left: 15px;
    cursor: pointer;
  }
}
</style>
