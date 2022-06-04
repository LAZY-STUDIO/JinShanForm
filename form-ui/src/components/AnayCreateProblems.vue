<template>
  <div class="created">
    <div class="formname">{{ listmsg.title }}</div>
    <div class="subtitle">{{ listmsg.subTitle }}</div>
    <div
      class="ques-list"
      v-for="(rex, index) of listmsg.problems"
      :key="rex.id"
    >
      <div class="quesname">
        <span id="isrequired" v-if="rex.required">*</span>
        {{ index + 1 }}.{{ rex.title }}
      </div>
      <div class="options" v-if="rex.type == 'input'">
        <input disabled="true" />
      </div>
      <div
        class="options"
        v-else-if="rex.type == 'singleSelect'"
        v-for="x in rex.setting.options"
        :key="x.id"
      >
        <input type="radio" name="radio" :value="x.title" disabled="true" />{{
          x.title
        }}
      </div>
      <div
        class="options"
        v-else-if="rex.type == 'multiSelect'"
        v-for="y in rex.setting.options"
        :key="y.id"
      >
        <input
          type="checkbox"
          name="checkbox"
          :value="y.title"
          disabled="true"
        />{{ y.title }}
      </div>
    </div>
    <div class="submit">
      <div class="revise">提交</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Onelist, IProblems } from '../types'
export default defineComponent({
  name: 'CreatePro',
  props: {
    listmsg: { type: Object as PropType<IProblems> },
  },
})
</script>
