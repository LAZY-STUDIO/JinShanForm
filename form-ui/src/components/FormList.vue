<template>
  <div class="list-simple">
    <div class="form-title">
      <span class="small-type">表单</span>
      <span class="small-title">{{ form.title }}</span>
    </div>
    <div>{{ formatMsToDate(form.ctime) }}</div>
    <div>{{ getStatus(form.status) }}</div>
    <div class="dosth">
      <div class="dosth-detail">
        <div
          :class="form.isStar ? 'form-star form-isstar' : 'form-star'"
          @click="showStar"
          @click.stop
        >
          <i class="iconfont icon-star-empty"></i>
        </div>
        <div class="btns">
          <el-button
            class="btn"
            type="warning"
            plain
            v-if="form.status === 2"
            @click="onStart"
            @click.stop
            >发布</el-button
          >
          <el-button
            class="btn"
            type="primary"
            plain
            v-if="form.status === 1"
            @click="onChange"
            @click.stop
            >编辑</el-button
          >
          <el-button
            class="btn"
            type="warning"
            plain
            v-if="form.status === 3"
            @click="goShare(form.id)"
            @click.stop
            >分享</el-button
          >
          <el-button
            class="btn"
            type="success"
            plain
            v-if="form.status === 3 || form.status === 4"
            @click="showDetails(form.id)"
            @click.stop
            >查看结果</el-button
          >
          <el-button
            class="btn"
            type="primary"
            plain
            v-if="form.status === 3"
            @click="onEnd"
            @click.stop
            >停止</el-button
          >
          <el-button
            class="btn"
            type="danger"
            plain
            @click="onDelete"
            @click.stop
            v-if="form.status !== 5 && form.status !== 15"
            >删除</el-button
          >
          <el-button
            class="btn"
            type="success"
            plain
            v-if="form.status === 5 || form.status === 15"
            @click="onReview"
            @click.stop
            >恢复</el-button
          >
          <el-button
            class="btn"
            type="danger"
            plain
            v-if="form.status === 5 || form.status === 15"
            @click="onMove"
            @click.stop
            >彻底删除</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IForm } from '../types'
export default defineComponent({
  props: {
    form: { type: Object as PropType<IForm>, required: true },
    onStar: { type: Function as PropType<() => void>, required: true },
    onCancelStar: { type: Function as PropType<() => void>, required: true },
    onDelete: { type: Function as PropType<() => void>, required: true },
    onStart: { type: Function as PropType<() => void>, required: true },
    onEnd: { type: Function as PropType<() => void>, required: true },
    onMove: { type: Function as PropType<() => void>, required: true },
    onReview: { type: Function as PropType<() => void>, required: true },
    onChange: { type: Function as PropType<() => void>, required: true },
  },
  methods: {
    //该方法用于给日期、时间补零
    addZero(num: string) {
      if (parseInt(num) < 10) {
        num = '0' + num
      }
      return num
    },
    //把毫秒数转化成具体日期   2021-06-04 00:00:00
    //参数 毫秒数
    formatMsToDate(ms: number) {
      if (ms) {
        var oDate = new Date(ms),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMin = oDate.getMinutes(),
          oTime =
            oYear +
            '年' +
            oMonth +
            '月' +
            oDay +
            '日' +
            this.addZero(oHour.toString()) +
            ':' +
            this.addZero(oMin.toString())
        return oTime
      } else {
        return ''
      }
    },
    getStatus(num: number) {
      if (num === 1) {
        return '草稿'
      } else if (num === 2) {
        return '未发布'
      } else if (num === 3) {
        return '收集中'
      } else if (num === 4) {
        return '已结束'
      } else if (num === 5 || num === 15) {
        return '已回收'
      }
    },
    showStar() {
      if (this.form.isStar) {
        console.log(1)
        this.onCancelStar()
      } else {
        console.log(2)
        this.onStar()
      }
    },
    goShare(id: string) {
      console.log(this.form.id)
      this.$router.push({
        path: '/datanayse/qr',
        query: {
          id: id,
        },
      })
    },
    showDetails(id: string) {
      this.$router.push({
        path: '/datanayse/anayse',
        query: {
          id: id,
        },
      })
    },
  },
})
</script>

<style scoped>
.list-simple {
  width: 90%;
  height: 50px;
  border: 1px solid #e7e9eb;
  margin: 20px auto;
  font-size: 14px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.list-simple div {
  width: 20%;
  text-align: center;
}
.form-title {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}
.small-type {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: inline-block;
  position: absolute;
  left: 11%;
  padding: 2px 6px;
  text-align: center;
  line-height: 12px;
  font-size: 12px;
  color: #767c85;
}
.form-title .small-title {
  width: 60%;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  left: 35%;
}
.list-simple .dosth {
  width: 40%;
  text-align: center;
}
.dosth-detail {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
}
.form-star {
  font-size: 16px;
}
.form-isstar {
  color: #f8d61d;
}

.dosth .btns {
  margin-left: 220%;
  display: flex;
  justify-content: center;
}
.btn {
  width: 50px;
  height: 20px;
  font-size: 12px;
}
</style>
