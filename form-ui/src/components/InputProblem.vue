<template>
  <problem-base :problemNumber="problemNumber">
    <template v-if="problemType === 'input'">
      <el-input
        v-model="input"
        :readonly="showActions"
        :placeholder="showActions ? '填写者回答区' : '请输入'"
        :class="['input-problem', showActions ? 'dashd-input' : '']"
      />
      <div class="allow-repeat" v-show="showActions">
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
    </template>

    <template v-else-if="problemType === 'date'">
      <div v-if="showActions" class="dateformat-wrap">
        <div
          class="trigger-date-container"
          @click="showDateFormatMenu = !showDateFormatMenu"
        >
          <svg
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            class="date-img_3JSYa"
          >
            <g fill="none" fill-rule="nonzero">
              <path
                d="M6 1v1h3V1h1v1h2a2 2 0 012 2v3h-1V6H2v7a1 1 0 001 1h3v1H3a2 2 0 01-2-2V4a2 2 0 012-2h2V1h1zm0 10v1H4v-1h2zm0-3v1H4V8h2zM4.999 3H3a1 1 0 00-1 1v1h11V4a1 1 0 00-1-1h-2v1H9V3H5.999L6 4H5l-.001-1z"
                fill="#1488ED"
              ></path>
              <g stroke="#1488ED">
                <path
                  d="M11.578 7.503l.348.68 1.953.62.56.939-.39.525a.743.743 0 00-.134.507h0l.53 1.505-.56.937-.715-.063a.748.748 0 00-.485.128 2.92 2.92 0 01-.479.267.74.74 0 00-.395.394h0l-.232.558h-1.127l-.233-.562a.737.737 0 00-.395-.39 2.928 2.928 0 01-.497-.266.75.75 0 00-.49-.13h0l-.71.064-.555-.942.382-.541a.743.743 0 00.125-.497h0l-.525-1.513.562-.94.712.064a.743.743 0 00.486-.127h0l1.089-1.19 1.175-.027z"
                ></path>
                <path
                  d="M11 10h0a1 1 0 101 1s0 0 0 0h0a1 1 0 00-1-1s0 0 0 0h0z"
                ></path>
              </g>
            </g></svg
          ><svg
            width="5"
            height="3"
            xmlns="http://www.w3.org/2000/svg"
            class="arrow-icon_2irI9"
          >
            <path d="M2.5 3L5 0H0z" fill="#767C85" fill-rule="evenodd"></path>
          </svg>
          <div class="date-menu" v-show="showDateFormatMenu">
            <div
              v-for="(item, index) in dateformatTexts"
              :key="item"
              @click="changeDateformat(index)"
            >
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <g
                  :fill="dateformatIndex === index ? '#1488ED' : '#fff'"
                  fill-rule="evenodd"
                >
                  <path
                    d="M3.219 8.222l1.414-1.414 4.243 4.242-1.414 1.415z"
                  ></path>
                  <path
                    d="M6.166 10.932l6.364-6.364 1.414 1.414-6.364 6.364z"
                  ></path>
                </g>
              </svg>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
        <span>{{ dateformatTexts[dateformatIndex] }}</span>
      </div>
      <div v-else>
        <el-date-picker
          v-model="dateTmp"
          type="datetime"
          :format="dateFormat"
          :value-format="dateFormat"
          prefix-icon="icon-calendar"
          placeholder="请输入"
          class="date-choice"
        />
      </div>
    </template>
    <div v-else-if="problemType === 'time'">时间题</div>
    <div v-else>
      <div class="icon-stars-container">
        <i
          class="iconfont icon-star"
          v-for="(item, index) in 5"
          :key="item"
          :style="{
            color:
              (!showActions && index <= mouseHoverIndex) || index <= score
                ? '#f8d61d'
                : '#c2c2c2',
          }"
          @mouseenter="mouseHoverIndex = index"
          @mouseleave="mouseHoverIndex = -1"
          @click="changeScore(index)"
        ></i>
        <span>{{ resultScore }}</span>
      </div>
    </div>
  </problem-base>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ProblemBase from './ProblemBase.vue'

export default defineComponent({
  name: 'InputProblem',
  components: {
    ProblemBase,
  },
  data() {
    return {
      input: this.resultValue,
      // 分数题
      score: -1,
      mouseHoverIndex: -1,
      // 日期题
      dateformatTexts: ['年 月', '年 月 日', '年 月 日 时 分'],
      showDateFormatMenu: false,
      dateformatIndex: 0,
      dateTmp: new Date(),
      showCalendar: false,
    }
  },
  computed: {
    showActions() {
      return this.options.showActions
    },
    resultScore() {
      return this.score > -1 ? (this.score + 1).toFixed(1) + '分' : ''
    },
  },
  methods: {
    changeDateformat(index: number) {
      this.dateformatIndex = index
    },
    changeScore(index: number) {
      if (!this.showActions) {
        this.score = index
        this.$emit('scoreChange', this.score + 1)
        this.$emit('problemNum', this.problemNumber)
      }
    },
    selectDate(val: string) {
      const tmp: any = this.$refs.calendar
      tmp.value.selectDate(val)
    },
  },
  // inject: ['showActions'],
  inject: ['options'],
  // 答案输入事件
  emits: [
    'resultValueInput',
    'scoreChange',
    'dateFormatChange',
    'dateValueInput',
    'dateChange',
    'problemNum',
  ],
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
    resultValue: {
      type: String,
      default: '',
    },
    problemType: {
      type: String,
    },
    dateFormat: {
      type: String,
      default: 'YYYY/MM',
    },
  },
  // todo: 添加时的效果
  watch: {
    input(newVal: string) {
      this.$emit('resultValueInput', newVal)
      this.$emit('problemNum', this.problemNumber)
    },
    dateformatIndex(newVal: number) {
      let format = 'YYYY/MM'
      switch (newVal) {
        case 0:
          format = 'YYYY/MM'
          break
        case 1:
          format = 'YYYY/MM/DD'
          break
        case 2:
          format = 'YYYY/MM/DD HH:mm'
          break
      }
      this.$emit('dateFormatChange', format)
      this.$emit('problemNum', this.problemNumber)
    },
    dateTmp(newVal: string) {
      this.$emit('dateValueInput', newVal)
      this.$emit('problemNum', this.problemNumber)
    },
  },
})
</script>

<style lang="less" scoped>
.input-problem {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    border-bottom: 1px solid #e2e6ed;
  }
}

.input-problem:not(.dashd-input) {
  &:hover {
    border-bottom: 1px solid #1488ed;
  }
}

.dashd-input {
  :deep(.el-input__wrapper) {
    font-size: 12px;
    box-shadow: none;
    border-bottom: 1px dashed #e2e6ed;
  }
}
// 填空题
.allow-repeat {
  display: flex;
  align-items: center;
  height: 40px;

  span {
    font-size: 12px;
    color: #1488ed;
    margin: 0 8px;
  }
}
// 分数题
.icon-stars-container {
  .iconfont {
    margin-right: 10px;
    cursor: pointer;
  }
}

// 日期题
.dateformat-wrap {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #aeb5c0;
  letter-spacing: 6px;
  gap: 30px;
  border-bottom: 1px dashed #e2e6ed;
}

.trigger-date-container {
  display: flex;
  align-items: center;
  height: 27px;
  gap: 5px;
  position: relative;
  cursor: pointer;

  .date-menu {
    position: absolute;
    top: 27px;
    box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);
    padding: 4px;

    > div {
      padding-left: 10px;
      height: 30px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;

      &:hover {
        background-color: #fafafa;
      }

      span {
        font-size: 12px;
        color: #3d4757;
        letter-spacing: 6px;
        white-space: pre;
      }
    }
  }
}

.date-fix-container {
  position: relative;
  cursor: pointer;

  > img {
    position: absolute;
    top: 7px;
    z-index: 3;
    width: 16px;
    height: 16px;
  }

  :deep(.el-input__wrapper) {
    background-color: transparent !important;
    box-shadow: none !important;
  }

  :deep(.el-input__inner) {
    text-indent: 15px;
    cursor: pointer !important;
  }
}

:deep(.el-date-editor.el-input.date-choice) {
  width: 100% !important;
  border: none !important;

  .el-input__wrapper {
    border: none !important;
    box-shadow: none;
  }
}
</style>
