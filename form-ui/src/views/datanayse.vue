<template>
  <div class="list-anayse">
    <div class="sum">共{{ y }}份数据表</div>
    <div class="switch">
      <div class="switch-up" @click="pageup()">
        <i class="iconfont icon-angle-left-o-thin"></i>
      </div>
      <div class="num">
        第
        <div id="num-list">{{ x + 1 }}</div>
        份
      </div>
      <div class="switch-down" @click="pagedown()">
        <i class="iconfont icon-angle-right-o-thin"></i>
      </div>
    </div>
    <div :key="x">
      <QuesList :data2="result1[x]" :listmsg="data1"></QuesList>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import QuesList from '../components/questionlist.vue'
import { Onelist, IProblems1 } from '../types'
export default defineComponent({
  name: 'DataAnayse',
  components: {
    QuesList,
  },
  props: {
    result1: { type: Object as PropType<Onelist> },
    data1: { type: Object as PropType<IProblems1> },
    y: Number,
  },
  data() {
    return {
      x: 0,
    }
  },
  methods: {
    pageup() {
      if (this.x! > 0) this.x--
    },
    pagedown() {
      if (this.x! < this.y! - 1) this.x++
    },
  },
  created() {
    this.x = 0
  },
})
</script>
