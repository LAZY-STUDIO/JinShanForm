<template>
  <div class="title-wrap">
    <div class="title">{{ title }}</div>
    <i
      :class="['iconfont', showList ? 'icon-angle-up' : 'icon-angle-down']"
      v-if="allowUnfold && dataList.length !== 0"
      @click="showList = !showList"
    ></i>
  </div>
  <slot v-if="dataList.length === 0"></slot>
  <div class="data-list" v-show="showList">
    <div v-for="data in dataList" :key="data">
      <img :src="'../imgs/' + data.type + '.svg'" v-if="allowIcon" />
      {{ data.title }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProblemList',
  data() {
    return {
      showList: true as boolean,
    }
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    dataList: {
      type: Array,
      required: true,
    },
    allowUnfold: {
      type: Boolean,
      default: true,
    },
    allowIcon: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="less" scoped>
.title-wrap {
  display: flex;
  justify-content: space-between;

  .title {
    font-size: 14px;
    line-height: 20px;
    color: #3d4757;
    font-weight: 700;
    margin-bottom: 11px;
  }

  .iconfont {
    color: #767c85;
    cursor: pointer;
    transform: scale(0.6);
  }
}

.data-list {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 12px;
  margin-bottom: 16px;

  & > div {
    border: 1px solid #e7e9eb;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;

    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    &:hover {
      border: 1px solid #1488ed;
    }

    &:active {
      color: #1488ed;
    }
  }
}
</style>
