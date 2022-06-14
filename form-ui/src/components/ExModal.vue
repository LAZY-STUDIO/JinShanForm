<template>
  <div
    @click="$emit('close')"
    :class="['bg-cover', visible ? 'bg-cover-visiable' : '']"
  ></div>
  <div :class="['modal-container', visible ? 'modal-container-visiable' : '']">
    <div class="modal-header">
      <div class="modal-title">{{ title }}</div>
      <i class="iconfont icon-times-o" @click="$emit('close')"></i>
    </div>
    <div class="modal-contents">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExModal',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  emits: ['open', 'close'],
})
</script>

<style scoped lang="less">
/* modal */
.modal-container {
  width: 850px;
  height: 600px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-425px, -300px) scale(0);
  background-color: #fff;
  z-index: 200;
  visibility: hidden;
  opacity: 0;
  /* 弹窗动画 */
  transition: all 0.5s ease-in-out;
}

.modal-container-visiable {
  transform: translate(-425px, -300px) scale(1);
  visibility: visible;
  opacity: 1;
}

.modal-header {
  font-size: 18px;
  color: #3d4757;
  text-align: left;
  line-height: 30px;
  padding: 15px 0;
  font-weight: 400;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f2f2f2;
}

.modal-header .iconfont {
  cursor: pointer;
  color: #969696;
}

/* slot部分 */
.modal-contents {
  flex: 1;
  padding: 15px;
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
  overflow-y: hidden;
}

.modal-footer {
  padding: 0px 15px;
  display: flex;
  justify-content: right;
}

.modal-footer > button {
  margin: 10px;
  margin-right: 0;
}

/* 背景遮罩图 */
.bg-cover {
  border: 1px solid red;
  background-color: #8c8c8c;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  visibility: hidden;
  /* 遮罩图动画。可见、透明度 */
  transition: all 0.5s;
}

.bg-cover-visiable {
  visibility: visible;
  opacity: 0.5;
}
</style>
