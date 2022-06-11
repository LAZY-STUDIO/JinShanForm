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
      <div class="quesvalue" v-if="!rex.result.value">此题未填写</div>
      <div class="quesvalue" v-else-if="rex.type == 'date'">
        {{ rex.result.value }}
      </div>
      <div
        class="quesvalue"
        v-else-if="rex.type == 'input' || rex.type == 'time'"
      >
        {{ rex.result.value }}
      </div>
      <div
        class="quesvalue"
        v-else-if="rex.type == 'singleSelect' || rex.type == 'pullSelect'"
      >
        {{ rex.setting.options[Number(rex.result.value) - 1].title }}
      </div>
      <div class="quesvalue" v-else-if="rex.type == 'multiSelect'">
        {{ getmultresult(rex.result.value) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Onelist, IProblems } from '../types'
export default defineComponent({
  name: 'QuesList',
  props: {
    data2: { type: Object as PropType<Onelist>, required: true },
    listmsg: { type: Object as PropType<IProblems>, required: true },
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
