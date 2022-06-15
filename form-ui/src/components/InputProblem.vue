<template>
  <problem-base
    :problemNumber="problemNumber"
    @addStarProblem="$emit('addStarProblem', $event)"
  >
    <template v-slot:default>
      <template v-if="problemType === 'input'">
        <el-input
          v-model="input"
          :readonly="showActions"
          :placeholder="showActions ? '填写者回答区' : '请输入'"
          :class="['input-problem', showActions ? 'dashd-input' : '']"
        />
      </template>
      <template v-else-if="problemType === 'date'">
        <div v-if="showActions" class="dateformat-wrap">
          <div
            class="trigger-date-container"
            @click="showDateFormatMenu = !showDateFormatMenu"
            @blur="showDateFormatMenu = false"
            tabindex="0"
          >
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
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
            ><svg width="5" height="3" xmlns="http://www.w3.org/2000/svg">
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
        <div v-else class="datepicker-outer">
          <el-date-picker
            v-model="dateTmp"
            type="datetime"
            readonly
            :format="timeDateFormat"
            :value-format="timeDateFormat"
            prefix-icon="icon-calendar"
            placeholder="请输入"
            class="date-choice"
            :teleported="false"
          />
        </div>
      </template>
      <template v-else-if="problemType === 'time'">
        <div v-if="showActions" class="timeformat-wrap">
          {{ timeformatText }}
        </div>
        <template v-else>
          <div
            v-if="timeformatTmp === '时刻: 时-分(24小时制)'"
            class="hour-minute-outer"
            @focus="showHM = true"
            tabindex="0"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC3klEQVRYR8WXP2gTURzHv793pKWQqtCtOiiVtksHK4IOIgoOKvgHtYO4CDpVBwd7zSXXI73LpRcXETspuIhDVdSCOgiKOCiIdejSFIsO2q2gpKC23P3kJU1J2+T+lJbLmHvv9/v8/n3fe4SYfxSzf0QCGNTzexh8moGDBGwHuL0SAM0y8JOA9wR6NmKmvoQNLBTAQMY+B2ILjK5QhglFMGUKlvY4aL0vQMa8uWvx38JDBvaX4yT6AcZzCPFCkDfThK2z8v8F/G73WHTA806AcIqZd5TXAx8TzU0XLP3Gt0YgDQFSun3IYzxhcBuIZgXI6O3puN/X1+f6RTU2NqZMTM5c8sBZMLcTaE4QzuZN7V29fXUBpHOX8RrgBIjG25LKRVVVS0HprP3uOE7r3Lz7AMwnAVpUCEfrQawBqKR98ZOMXBDdbhap69kseVGcV9caBou/bv4Wg6/JTCSaE/tWl2MNgJrJfSjXnGi8RaTONHI+kMmxdFSw0r59JCH+ePmnMhOyJxwrfaA2mBWby90OfiRr3pZUuv3SHhZAOlsqx5TsCYDO107HSgA9NyVHTZC4MmKm7vmlPQqAtDOo5y977N0FoVgw091V28sAUmQ89ibkqO3t2b0zqNujAsjp+Dz59bscUUGitypWywCqbmeZeYhAo46lXQ1quqgA0p6ase8wuJ+Ihh1TM5a0ouJqQLffgPkwCeW4Mzz4alMAhkaOsee+BNHbgqkdWQGg6naRmTsVhbryWW16MwBSht3pulwkomnH1MqyXlOCXIkZyRZlW2s22z+/GQCGMZr84/4qEWHeMdOtGwLQCLSePlQBACoVLG3LhpQgCoBvCaI2YVCJ6n1XA5ow0hiuC8BvDKMKUVSAQCGqaEF4KY4KECjFZYAIh1EUgNCHUUUuwx3HYQEiHcfSaOwXEgkR65WsmtpYL6VViFiv5bVNFtvDZHWnx/Y0Czty61kX6m24HsNh9/wHp1gOP4ES3K0AAAAASUVORK5CYII="
            />
            <span>{{ timeHMText }}</span>
            <div class="hm-menu" v-show="showHM" @blur="showHM = false">
              <div class="hm-data">
                <el-scrollbar height="192px" ref="scrollbarTimeLeftRef">
                  <div class="hm-item">
                    <div
                      v-for="item in 24"
                      :key="item"
                      :class="hVal === item - 1 ? 'hm-selected-item' : ''"
                      @click.stop="changeTimeScrollHeightLeft(item)"
                    >
                      {{ timeItemText(String(item - 1)) }}
                    </div>
                  </div>
                </el-scrollbar>
                <el-scrollbar height="192px" ref="scrollbarTimeRightRef">
                  <div class="hm-item">
                    <div
                      v-for="item in 60"
                      :key="item"
                      :class="mVal === item - 1 ? 'hm-selected-item' : ''"
                      @click="changeTimeScrollHeightRight(item)"
                    >
                      {{ timeItemText(String(item - 1)) }}
                    </div>
                  </div>
                </el-scrollbar>
              </div>
              <div class="hm-action">
                <el-button type="primary" size="small" @click="sureHmTime"
                  >确定</el-button
                >
              </div>
            </div>
          </div>
          <div v-else class="hour-minute-second-outer">
            <input type="number" v-model="hVal" @change="watchHMSChange" /><span
              >时</span
            >
            <input type="number" v-model="mVal" @change="watchHMSChange" /><span
              >分</span
            >
            <input type="number" v-model="sVal" @change="watchHMSChange" /><span
              >秒</span
            >
          </div>
        </template>
      </template>
      <template v-else>
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
      </template>
    </template>
    <template v-slot:slot-actions>
      <template v-if="problemType === 'input'">
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
      </template>
      <template v-else-if="problemType === 'time'">
        <div class="timeformat-actions">
          <span style="margin-right: 15px">时间格式:</span>
          <el-select
            size="small"
            v-model="timeformatTmp"
            :teleported="false"
            @change="$emit('timeDateFormatChange', timeformatTmp)"
          >
            <el-option
              v-for="item in timeformatTexts"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </template>
    </template>
  </problem-base>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProblemBase from './ProblemBase.vue'
import { ElScrollbar } from 'element-plus'
import { ProblemType } from '@/types'

export default defineComponent({
  name: 'InputProblem',
  components: {
    ProblemBase,
  },
  mounted() {
    if (this.problemType === ProblemType.time) {
      //
      if (this.timeformatTmp === '时刻: 时-分(24小时制)') {
        if (this.resultValue !== '') {
          this.hVal = Number((this.resultValue as string).split(':')[0])
          this.mVal = Number((this.resultValue as string).split(':')[1])
          this.timeHMText =
            this.timeItemText(String(this.hVal)) +
            ':' +
            this.timeItemText(String(this.mVal))
        }
      } else {
        this.hVal = Number((this.resultValue as string).split(':')[0])
        this.mVal = Number((this.resultValue as string).split(':')[1])
        this.sVal = Number((this.resultValue as string).split(':')[2])
      }
    }
  },
  // todo: 数据校验
  data() {
    return {
      input: this.resultValue as string,
      // 分数题
      // score: -1,
      score: this.resultValue as number,
      mouseHoverIndex: -1,
      // 日期题
      dateformatTexts: ['年 月', '年 月 日', '年 月 日 时 分'],
      showDateFormatMenu: false,
      dateformatIndex: 0,
      dateTmp: this.resultValue as string,
      showCalendar: false,
      // 时间题
      timeformatTexts: ['时刻: 时-分(24小时制)', '时长: 时-分-秒'],
      timeformatTmp: this.timeDateFormat as string,
      timeHMText: '请输入',
      hVal: 0,
      mVal: 0,
      sVal: 0,
      showHM: false,
    }
  },
  computed: {
    showActions() {
      return this.options.showActions
    },
    resultScore() {
      return this.score > -1 ? (this.score + 1).toFixed(1) + '分' : ''
    },
    timeformatText() {
      return this.timeformatTmp === '时刻: 时-分(24小时制)'
        ? '时 分'
        : '时 分 秒'
    },
  },
  methods: {
    changeDateformat(index: number) {
      this.dateformatIndex = index
    },
    changeScore(index: number) {
      if (!this.showActions) {
        this.score = index
        this.$emit('resultValueInput', this.score + 1)
      }
    },
    timeItemText(item: string) {
      return item.padStart(2, '0')
    },
    sureHmTime() {
      const text =
        this.timeItemText(String(this.hVal)) +
        ':' +
        this.timeItemText(String(this.mVal))
      this.$emit('resultValueInput', text)
      this.timeHMText = text
      this.showHM = false
    },
    changeTimeScrollHeightLeft(val: number) {
      let oldVal = this.hVal
      this.hVal = val - 1
      let scrollbarRef = this.$refs.scrollbarTimeLeftRef as InstanceType<
        typeof ElScrollbar
      >
      if (oldVal > this.hVal) {
        let tmp = oldVal - 1
        let intval = setInterval(() => {
          scrollbarRef.setScrollTop(tmp * 32)
          tmp--
          if (tmp < this.hVal) {
            clearInterval(intval)
          }
        }, 50)
      } else {
        let tmp = oldVal + 1
        let intval = setInterval(() => {
          scrollbarRef.setScrollTop(tmp * 32)
          tmp++
          if (tmp > this.hVal) {
            clearInterval(intval)
          }
        }, 50)
      }
    },
    changeTimeScrollHeightRight(val: number) {
      let oldVal = this.mVal
      this.mVal = val - 1
      let scrollbarRef = this.$refs.scrollbarTimeRightRef as InstanceType<
        typeof ElScrollbar
      >
      // setTimeout(() => {
      //   scrollbarRef.setScrollTop(this.mVal * 32)
      // }, 500)
      if (oldVal > this.mVal) {
        let tmp = oldVal - 1
        let intval = setInterval(() => {
          scrollbarRef.setScrollTop(tmp * 32)
          tmp--
          if (tmp < this.mVal) {
            clearInterval(intval)
          }
        }, 50)
      } else {
        let tmp = oldVal + 1
        let intval = setInterval(() => {
          scrollbarRef.setScrollTop(tmp * 32)
          tmp++
          if (tmp > this.mVal) {
            clearInterval(intval)
          }
        }, 50)
      }
    },
    watchHMSChange() {
      if (this.timeformatTmp !== '时刻: 时-分(24小时制)') {
        const text = this.hVal + ':' + this.mVal + ':' + this.sVal
        this.$emit('resultValueInput', text)
      }
    },
  },
  inject: ['options'],
  // 答案输入事件
  emits: ['resultValueInput', 'timeDateFormatChange', 'addStarProblem'],
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
    resultValue: {
      type: [String, Number, Object],
    },
    problemType: {
      type: String,
    },
    timeDateFormat: {
      type: String,
    },
  },
  // todo: 添加时的效果
  watch: {
    input(newVal: string) {
      this.$emit('resultValueInput', newVal)
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
      this.$emit('timeDateFormatChange', format)
    },
    dateTmp(newVal: string) {
      this.$emit('resultValueInput', newVal)
    },
  },
})
</script>

<style lang="less" scoped>
.input-problem {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    border-bottom: 1px solid #e2e6ed;
    padding-left: 0;
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

  .el-only-child__content el-tooltip__trigger el-tooltip__trigger {
    height: 16px;
  }
}
// 分数题
.icon-stars-container {
  padding-top: 5px;

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
  margin: 5px 0;
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
    background-color: #fff;
    box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);
    padding: 4px;
    z-index: 20;

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

.datepicker-outer {
  position: relative;

  :deep(.el-popper.is-pure.is-light.el-picker__popper) {
    top: 0 !important;
    left: 30px !important;
  }

  :deep(.el-date-editor.el-input.date-choice) {
    width: 100% !important;
    border: none !important;

    .el-input__wrapper {
      border: none !important;
      box-shadow: none;
    }
  }

  :deep(.el-date-picker) {
    width: 250px !important;
  }

  :deep(.el-date-picker__header) {
    margin: 0 auto !important;
  }

  :deep(.el-picker-panel__content) {
    width: 230px !important;
    margin: 0 auto !important;
  }

  :deep(.el-date-table th) {
    padding: 0 !important;
  }

  :deep(.el-date-table td) {
    padding: 0 !important;
  }

  :deep(.el-date-picker__time-header) {
    display: none;
  }
}

// 时间题
.timeformat-wrap {
  padding: 6px;
  color: #949aae;
  white-space: pre;
  font-size: 12px;
  letter-spacing: 3px;
  border-bottom: 1px dotted #e2e6ed;
}

.timeformat-actions {
  .timeformat-wrap();
  padding: 6px 0 15px;
  margin-bottom: 1px solid #e7e9eb;

  :deep(.el-input__wrapper) {
    border: 1px solid #e7e9eb;
    box-shadow: none;
    border-radius: 0 !important;

    &:hover {
      box-shadow: none !important;
      background-color: #edeff2;
    }
  }

  :deep(.el-select .el-input.is-focus .el-input__wrapper) {
    box-shadow: none !important;
  }

  :deep(.el-select .el-input__wrapper.is-focus) {
    box-shadow: none !important;
  }

  :deep(.el-select-dropdown__item.selected) {
    color: normal;
    font-weight: normal;
  }

  :deep(.el-select-dropdown__item) {
    padding-right: 5px;
    padding-left: 15px;
    height: 30px;
    font-size: 12px;
    color: #3d4757;
    white-space: pre;
  }

  :deep(.el-select-dropdown__item) {
    &::before {
      content: '';
      margin: 0 10px;
      min-width: 0;
      color: #1488ed;
      font-weight: bold;
    }
  }

  :deep(.el-select-dropdown__item.selected) {
    &::before {
      content: '√';
      margin: 0 5px;
    }
  }
}

// 时 分
.hour-minute-outer {
  height: 24px;
  border-bottom: 1px solid #e8ebee;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;

  &:focus-within {
    .hm-menu {
      display: initial;
    }
  }

  &:hover {
    border-bottom: 1px solid #1488ed;
  }

  img {
    margin-right: 6px;
    width: 16px;
    height: 16px;
  }

  span {
    line-height: 24px;
    color: #3d4757;
    font-size: 14px;
  }
}

.hm-menu {
  display: none;
  position: absolute;
  top: 0;
  left: 20px;
  background-color: #fff;
  box-shadow: 0 4px 16px 0 rgb(192 198 207 / 50%);
  z-index: 20;

  .hm-data {
    display: flex;
  }

  .hm-action {
    display: flex;
    justify-content: right;
    border-top: 1px solid #e8e8e8;
    padding: 5px;
  }

  .hm-item {
    display: flex;
    width: 56px;
    flex-direction: column;
    padding: 0 0 160px;

    &:first-child {
      border-right: 1px solid #e8e8e8;
    }

    > div {
      padding: 0 0 0 12px;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;

      &:hover {
        background-color: #e6f7ff;
      }
    }

    .hm-selected-item {
      background-color: #f5f5f5;
      color: #2295ff;
    }
  }
}

// 时 分 秒
.hour-minute-second-outer {
  border-bottom: 1px solid #e8ebee;
  font-size: 14px;
  line-height: 20px;
  color: #949aae;

  &:hover {
    border-bottom: 1px solid #1488ed;
  }

  input {
    border: none;
    width: 30px;
    margin-right: 4px;
    text-align: right;
    outline: 0;
    color: #3d4757;
    font-size: inherit;

    // 去除右侧的操作栏
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none !important;
    }
  }
}
</style>
