<template>
  <div class="user-list">
    <span class="user-msg">
      原表单创建时间:{{ timestampToTime(listmsg.ctime) }}
    </span>
  </div>
  <div class="question">
    <div class="formname">{{ listmsg.title }}</div>
    <div class="subtitle">{{ listmsg.subTitle }}</div>
    <div class="ques-list" v-for="(rex, index) of data2.result" :key="rex.id">
      <div class="quesname">
        <span id="isrequired" v-if="rex.required">*</span>
        <span id="isrequired" v-else>&nbsp;</span>
        {{ index + 1 }}.{{ rex.title }}
      </div>
      <div
        class="quesvalue"
        style="color: #c0c6cf"
        v-if="!rex.result.value || rex.result.value.length == 0"
      >
        此题未填写
      </div>
      <div
        class="quesvalue"
        v-else-if="rex.type == 'date' || rex.type == 'time'"
      >
        {{ rex.result.value }}
      </div>
      <div class="quesvalue" v-else-if="rex.type == 'input'">
        {{ rex.result.value }}
      </div>
      <div
        class="quesvalue"
        v-else-if="rex.type == 'singleSelect' || rex.type == 'pullSelect'"
      >
        {{ rex.result.value.title }}
      </div>
      <div class="quesvalue" v-else-if="rex.type == 'multiSelect'">
        <div v-for="x in rex.result.value" :key="x" style="margin: 5px 0px">
          {{ x.title }}<br />
        </div>
      </div>
      <div class="quesvalue" v-else-if="rex.type == 'score'">
        <i
          class="iconfont icon-star"
          :style="{ color: rex.result.value >= 1 ? '#f8d61d' : '#c2c2c2' }"
        ></i>
        <i
          class="iconfont icon-star"
          :style="{ color: rex.result.value >= 2 ? '#f8d61d' : '#c2c2c2' }"
        ></i>
        <i
          class="iconfont icon-star"
          :style="{ color: rex.result.value >= 3 ? '#f8d61d' : '#c2c2c2' }"
        ></i>
        <i
          class="iconfont icon-star"
          :style="{ color: rex.result.value >= 4 ? '#f8d61d' : '#c2c2c2' }"
        ></i>
        <i
          class="iconfont icon-star"
          :style="{ color: rex.result.value >= 5 ? '#f8d61d' : '#c2c2c2' }"
        ></i>
        {{ rex.result.value }} 分
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Onelist, IProblems1 } from '../types'
export default defineComponent({
  name: 'QuesList',
  props: {
    data2: { type: Object as PropType<Onelist>, required: true },
    listmsg: { type: Object as PropType<IProblems1>, required: true },
  },
  data() {
    return {
      option: [''],
      x: 1,
      times: '',
    }
  },
  methods: {
    timestampToTime(timestamp: number) {
      var date = new Date(timestamp)
      var Y = date.getFullYear() + '-'
      var M = date.getMonth() + 1 + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    getmultresult(value: { id: string; title: string }[]) {
      let multresult = ''
      for (let i = 0; i < value.length; i++) {
        multresult += value[i].title + ' '
      }
      return multresult
    },
  },
})
</script>
