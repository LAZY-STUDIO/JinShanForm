<template>
  <problem-base
    :problemNumber="problemNumber"
    @addStarProblem="$emit('addStarProblem', $event)"
  >
    <template v-slot:default>
      <template v-if="showActions">
        <div class="group-outer">
          <div
            v-for="(item, index) in problemOptions"
            :key="item"
            class="option-item"
          >
            <img
              v-if="problemType === 'singleSelect'"
              class="pre-btn"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB7UlEQVRIS72WsYsTQRTGv2+dbHWBFKmChXBwau8/IYLeCaZQG8klYUcRLE7sxE68QhCZIYmLjVpEuDsF9Z+wVw8OLOSqFMG7JsmaJxN2JUbN5sC5Lfe9+X4z35t5M8Scr9PpnByNRpdIXhCRZQCVNH2f5J6IvCsUCm/q9fq3f8nwb4E4jivD4fABgBsicmLeJEj+APA8DMP7tVptfzb3D4Ax5iLJFyJSJDkSkR0AO0qpj6VSaSLQ7/crSZKcA7BKclVECiQPROS61vrtNOQ3gLX2tog8BhCQ3A6CYKPZbO7NW0Gr1Voej8ebIrIGYEzyThRFT7IxvwBu5gC208A9rfXmPOHZmDFmA8DD9P9atpIJIPX8s7MFwN2jimewFPLI2RWG4RlXkwnAWtsRkXVnSxRFl48y89lca+2Ws4vksyiK6nRbMUmSr86/IAjO5nmeB09r8snVUSl1isaYmwCeAnitta7mCSwSN8Z0AVwBcIvW2vcich7ANa31q0UE8nKMMVcBvCT5wa3gC4AVpdTpRqOxmzd4kXi73V5JksTp7jrAAYClcrlcrFarh4sI5OV0u92lXq/ndA+9AOI4Lg4Gg+8ZwK9Fx1Fkv9vU+0Hz3iqOpdk5iNd2nR0crxfOVE/3d2VmEK+X/nSf+R/Plp/fkmnyJLuhTAAAAABJRU5ErkJggg=="
            />
            <img
              v-else-if="problemType === 'multiSelect'"
              class="pre-btn"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAuklEQVRIS2NkYGBgmD17tsyfP3+6GBgYHP7//y8JEiMXMDIyPmdgYDjAwsJSlpqa+oQRavjF////C5FrKDZ9jIyM71hYWPQZp0+fvuz///+RjIyM21lYWNJAtlJiEdTBs/7//+/JyMi4HGTBM1CwsLKyylJqOMxhIEt+//79GBRcjNOmTfsPksjKymKkxOXoemHmjlqAM1RHg4hgghsNotEgIhgCBBWMpiLig4jmFQ7Nq0yaV/q0brYAANwr3C8Aije5AAAAAElFTkSuQmCC"
            />
            <span v-else class="pre-idx">{{ index + 1 }}.</span>
            <el-input
              :placeholder="'选项' + (index + 1)"
              @change="titleChange(index)"
              v-model="titleOptionList[index]"
              class="radio-input-text"
              type="textarea"
              autosize
              resize="none"
              maxlength="200"
            />
            <div class="option-placeholder"></div>
            <img
              v-show="showActions"
              @click="delOptionTitle(index)"
              class="del-btn hidden-wrap"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABPklEQVRYR2NkGGDAOMD2M4w6YDQEcIbAjh3HhL7//TWFnZEp38vL7jU5iXXbtkOiP///m8jJzJbj4WH1DpsZOB2wfuuBZf8ZGCIZGBmucjAwOZLqCJDlPxj+7Wf4z6DNyMCwPNDbIYokByAbQKojSNGLNxGSYhDMd6TqIZgLSDEQrPb/v30MDAw6xIYaQQeAfEaMI8ixHGQ2UQ4g5AhyLSfJAbgcARInNdiRcwPRIYArkTH8Z/gPi3NuZlYnd3frV6SUGSQ7ACMkIOF4lRzLSY4ClFCApXaoA8gprMhyAHqOADvqP4M2sdkOPXpIigL01A4K9r9///6HFbnkOIJoB2CzHJbgiCkncCVMohyAz3Jyi2CYPoIOIMZyShwxeCsjSuKVFL2Dt0Ey4E0yUspzStQSzAWUGE6M3lEHjIYAACRXOzA6b0pKAAAAAElFTkSuQmCC"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="problemType === 'pullSelect'">
          <el-select
            class="pull-select"
            v-model="radioTmp.title"
            filterable
            placeholder="填写者选择区"
            @change="$emit('radioOptionChange', $event)"
          >
            <el-option
              v-for="(item, idx) in problemOptions"
              :key="item.title"
              :label="item.title === '' ? '选项' + (idx + 1) : item.title"
              :value="item.title === '' ? '选项' + (idx + 1) : item.title"
            />
          </el-select>
        </template>
        <template v-else>
          <div class="choice-group-outer">
            <template v-if="problemType === 'singleSelect'">
              <el-radio-group
                v-model="radioTmp.title"
                @change="$emit('radioOptionChange', $event)"
              >
                <el-radio
                  v-for="(item, idx) in problemOptions"
                  :label="item.title === '' ? '选项' + (idx + 1) : item.title"
                  :key="item"
                />
              </el-radio-group>
            </template>
            <template v-else>
              <el-checkbox-group
                v-model="checkboxTmp"
                @change="$emit('checkboxOptionChange', checkboxTmp)"
              >
                <el-checkbox
                  v-for="(item, idx) in problemOptions"
                  :key="item"
                  :label="item.title === '' ? '选项' + (idx + 1) : item.title"
                />
              </el-checkbox-group>
            </template>
          </div>
        </template>
      </template>
    </template>
    <template v-slot:slot-actions>
      <div class="option-actions">
        <div @click="addOptionTitle">+ 选项</div>
        <!-- <span class="split"></span>
        <div>批量编辑</div>
        <span class="split"></span>
        <div>添加"其他"项</div>
        <span class="split"></span>
        <div>设置选项名额</div>
        <span class="split"></span>
        <div>设置题目关联</div> -->
      </div>
    </template>
  </problem-base>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ProblemBase from './ProblemBase.vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'SelectProblem',
  mounted() {
    console.log(this.resultValue)
  },
  components: {
    ProblemBase,
  },
  data() {
    return {
      radioTmp: this.resultValue as {
        id: string
        title: string
      },
      checkboxTmp: [],
      titleOptionList: this.problemOptions.map(
        (item) => item.title
      ) as string[],
    }
  },
  inject: ['options'],
  methods: {
    titleChange(index: number) {
      // 校验是否有重复的
      let flag = true
      for (let i = 0; i < this.titleOptionList.length; ++i) {
        if (
          i !== index &&
          this.titleOptionList[i] === this.titleOptionList[index]
        ) {
          flag = false
          break
        }
      }
      if (!flag) {
        this.titleOptionList[index] = ''
        ElMessage({
          message: '选项不可重复',
          customClass: 'msg-box-form-title',
          duration: 1000 * 2,
          type: 'error',
        })
      }
      this.$emit('optionTitleChange', index, this.titleOptionList[index])
    },
    delOptionTitle(index: number) {
      if (this.titleOptionList.length > 1) {
        this.$emit('delOptionTitle', index)
        this.titleOptionList.splice(index, 1)
      } else {
        ElMessage({
          message: '至少设置一个选项',
          customClass: 'msg-box-form-title',
          duration: 1000 * 2,
          type: 'warning',
        })
      }
    },
    addOptionTitle() {
      this.$emit('addOptionTitle')
      this.titleOptionList.push('')
    },
  },
  computed: {
    showActions() {
      return this.options.showActions
    },
  },
  emits: [
    'optionTitleChange',
    'delOptionTitle',
    'addOptionTitle',
    'radioOptionChange',
    'checkboxOptionChange',
    'addStarProblem',
  ],
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
    problemType: {
      type: String,
    },
    problemOptions: {
      type: Object as PropType<
        {
          title: string
          status: 1 | 2
        }[]
      >,
      required: true,
    },
    resultValue: {
      type: [String, Number, Object],
    },
  },
})
</script>

<style lang="less" scoped>
// 编辑页面的选项
.group-outer {
  .option-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .pre-btn {
      cursor: initial;
      width: 12px;
      height: 12px;
    }

    .pre-idx {
      font-size: 14px;
    }

    .radio-input-text {
      width: 380px;
      margin-left: 10px;
    }

    .option-placeholder {
      flex: 1;
    }

    .del-btn {
      cursor: pointer;
      width: 12px;
      height: 12px;
      margin-right: 25px;
    }

    :deep(.el-textarea__inner) {
      box-shadow: none;
      border-radius: 0;
      overflow: hidden;
      color: #3d4757;
      font-weight: bold;
      font-size: 12px;

      &:hover {
        border-bottom: 1px solid #e8ebee;
      }

      &:focus {
        border-bottom: 1px solid #1488ed;
      }
    }

    :deep(.el-textarea__inner) {
      padding-left: 0;
    }
  }
}

.option-actions {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 12px;
  color: #1488ed;
  white-space: nowrap;

  .split {
    margin: 0 12px;
    background-color: #e7e9eb;
    width: 1px;
    height: 14px;
  }

  > div {
    cursor: pointer;

    &:hover {
      color: #439ff0;
    }
  }
}

.choice-group-outer > div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  align-items: start;

  :deep(.el-radio) {
    display: initial;
    height: initial;
    min-height: 35px;
  }

  label {
    font-size: 14px;
    color: #3d4757;
    word-break: break-all;
    white-space: normal;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background-color: #fff;
  }

  :deep(.el-radio__inner::after) {
    background-color: #1488ed;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner::after) {
    transform: translate(-50%, -50%) scale(1.5);
  }

  :deep(.el-radio__input.is-checked + .el-radio__label) {
    color: inherit;
  }
}

li.el-select-dropdown__item {
  font-size: 14px;
  color: #535252;
  font-weight: normal;

  &::before {
    content: '';
    margin-right: 15px;
  }
}

li.el-select-dropdown__item.selected::before {
  content: '√';
  color: #1488ed;
  margin-right: 5px;
}
</style>
