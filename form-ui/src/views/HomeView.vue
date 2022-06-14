<template style="overflow-y: hidden">
  <MyHeader>
    <template #left-img>
      <img src="../assets/imgs/logo.svg" />
    </template>
    <template #left-name> 金山表单 </template>
    <template #right></template>
  </MyHeader>
  <div class="home-list">
    <div class="left-list">
      <div class="new-btn" @click="newList">
        <img src="../assets/imgs/addnew.png" class="new-btn-img" />&nbsp;新建
      </div>
      <div
        :class="
          formList !== deleteForm
            ? 'list-btn first list-btn-active'
            : 'list-btn first'
        "
        @click="goList"
      >
        <img src="../assets/imgs/newList.svg" />
        表单列表
      </div>
      <div
        :class="
          formList === deleteForm ? 'list-btn list-btn-active' : 'list-btn'
        "
        @click="goBin"
      >
        <img src="../assets/imgs/bin.svg" />
        回收站
      </div>
    </div>
    <div class="right-list">
      <div :class="showOnlyStar ? 'star onlyStar' : 'star'" @click="onlyShow">
        <span :class="showOnlyStar ? 'fullStar' : ''">
          <i class="iconfont icon-star-empty" v-show="!showOnlyStar"></i>
          <i class="iconfont icon-star-full" v-show="showOnlyStar"></i>
        </span>
        仅展示星标
      </div>
      <div class="list-simple simple">
        <div>表单名称</div>
        <div>创建时间</div>
        <div>状态</div>
        <div class="dosth">操作</div>
      </div>
      <FormList
        v-for="form in currentForm"
        @click="showDetail(form.id)"
        :key="form.id"
        :form="form"
        :onStar="
          async () => {
            await formStar(form.id)
          }
        "
        :onCancelStar="
          async () => {
            await formCancelStar(form.id)
          }
        "
        :onDelete="
          async () => {
            await formDelete(form.id)
          }
        "
        :onStart="
          async () => {
            await formStart(form.id)
          }
        "
        :onEnd="
          async () => {
            await formEnd(form.id)
          }
        "
        :onReview="
          async () => {
            await formReview(form.id)
          }
        "
        :onMove="
          async () => {
            await formMove(form.id)
          }
        "
        :onChange="
          async () => {
            await formChange(form.id)
          }
        "
        :onShow="
          async () => {
            await showDetail(form.id)
          }
        "
      ></FormList>
      <div class="block">
        <el-pagination
          align="right"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="formList.length"
          layout="prev, pager, next,total"
          background
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MyHaeder from '../components/MyHeader.vue'
import { defineComponent } from 'vue'
import { IUser, IForm } from '../types'
import {
  getFormList,
  makeStar,
  cancelStar,
  getUserInfo,
  deleteForm,
  startForm,
  endForm,
} from '../services/api'
import FormList from '../components/FormList.vue'
import MyHeader from '../components/MyHeader.vue'
import { isBoolean } from '@vueuse/core'
export default defineComponent({
  data() {
    return {
      user: {} as IUser,
      formList: [] as IForm[],
      showOnlyStar: false,
      currentPage: 1, //当前页码
      pageSize: 3, //每页显示条数
      currentForm: [] as IForm[],
      noDeleteForm: [] as IForm[],
      deleteForm: [] as IForm[],
      drafts: [] as IForm[],
    }
  },
  components: {
    FormList,
    MyHeader,
  },
  methods: {
    async getUser() {
      const { data } = await getUserInfo()
      return data.user
    },
    async getList(account: string) {
      // let draft= account+'draftList'
      let dLstStr = localStorage.getItem(account + 'DraftList')
      let draftList = [] as IForm[]
      if (dLstStr) {
        draftList = JSON.parse(dLstStr)
      }
      console.log(draftList)
      this.drafts = draftList
      const { data } = await getFormList(account)
      // this.formList = data.items
      this.formList = [...draftList, ...data.items]
      this.currentForm = this.formList.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
      console.log(this.formList)
    },
    async fun() {
      this.user = await this.getUser()
      this.getList(this.user.account)
    },
    //开始收集表单
    async formStart(id: string) {
      await startForm(id)
      // this.fun()
      for (let i = 0; i < this.formList.length; i++) {
        if (this.formList[i].id === id) {
          this.formList[i].status = 3
        }
      }
    },
    //结束收集表单
    async formEnd(id: string) {
      await endForm(id)
      for (let i = 0; i < this.formList.length; i++) {
        if (this.formList[i].id === id) {
          this.formList[i].status = 4
        }
      }
    },
    //删除表单
    async formDelete(id: string) {
      console.log(this.formList)
      if (this.noDeleteForm) this.noDeleteForm = []
      for (let i = 0; i < this.formList.length; i++) {
        if (this.formList[i].id === id) {
          if (this.formList[i].status === 1) {
            this.formList[i].status = 15
          } else {
            this.formList[i].status = 5
          }
          this.deleteForm.push(this.formList[i])
        } else {
          this.noDeleteForm.push(this.formList[i])
        }
      }
      this.formList = this.noDeleteForm
      this.currentForm = this.noDeleteForm.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
      console.log(this.noDeleteForm)
    },
    //恢复表单
    async formReview(id: string) {
      for (let i = 0; i < this.deleteForm.length; i++) {
        if (this.deleteForm[i].id === id) {
          this.deleteForm[i].status = 2
          this.noDeleteForm.push(this.deleteForm[i])
          this.deleteForm.splice(i, 1)
          i--
        }
      }
      this.currentForm = this.deleteForm
    },
    //彻底删除
    async formMove(id: string) {
      await deleteForm(id)
      for (let i = 0; i < this.deleteForm.length; i++) {
        if (this.deleteForm[i].id === id) {
          if (this.deleteForm[i].status === 15) {
            console.log(111)
            let idx = -1
            for (let j = 0; j < this.drafts.length; j++) {
              if (this.drafts[j].id === id) {
                idx = j
                break
              }
            }
            this.drafts.splice(idx, 1)
            localStorage.setItem(
              this.user.account + 'DraftList',
              JSON.stringify(this.drafts)
            )
          }
          this.deleteForm.splice(i, 1)
          i--
        }
      }
      this.currentForm = this.deleteForm
    },
    //表单标星
    async formStar(id: string) {
      await makeStar(id)
      for (let i = 0; i < this.formList.length; i++) {
        if (this.formList[i].id === id) {
          this.formList[i].isStar = true
        }
      }
      // this.formList = this.noDeleteForm
      this.currentForm = this.formList.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    },
    //表单取消标星
    async formCancelStar(id: string) {
      await cancelStar(id)
      // this.fun()
      for (let i = 0; i < this.formList.length; i++) {
        if (this.formList[i].id === id) {
          this.formList[i].isStar = false
        }
      }
      // this.formList = this.noDeleteForm
      this.currentForm = this.formList.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    },
    onlyShow() {
      if (!this.showOnlyStar) {
        this.showOnlyStar = true
        this.noDeleteForm = []
        for (let i = 0; i < this.formList.length; i++) {
          this.noDeleteForm.push(this.formList[i])
          if (!this.formList[i].isStar) {
            this.formList.splice(i, 1)
            i--
          }
        }
        this.currentForm = this.formList.slice(0, 3)
        console.log(this.noDeleteForm)
      } else {
        this.showOnlyStar = false
        console.log(this.deleteForm)
        console.log(this.noDeleteForm)

        let flag = 1
        for (let i = 0; i < this.deleteForm.length; i++) {
          if (this.deleteForm[i].id == this.formList[0].id) {
            this.formList = this.deleteForm
            console.log(1)
            console.log(this.formList)
            flag = 0
            break
          }
        }
        if (flag) {
          this.formList = this.noDeleteForm
          console.log(this.formList)
        }
        this.currentForm = this.formList.slice(0, 3)
      }
    },
    formChange(id: string) {
      let idx = -1
      for (let j = 0; j < this.drafts.length; j++) {
        if (this.drafts[j].id === id) {
          idx = j
          break
        }
      }
      this.$router.push({
        name: 'CreateForm',
        query: {
          form: JSON.stringify(this.drafts[idx]),
        },
      })
    },
    //跳转到新建表单
    newList() {
      this.$router.push('/createForm')
    },
    //分页
    handleCurrentChange(val: number) {
      this.currentPage = val
      this.currentForm = this.formList.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      )
    },
    async showDetail(id: string) {
      this.$router.push({
        path: '/datanayse',
        query: {
          id: id,
        },
      })
    },
    goList() {
      console.log(this.deleteForm)
      if (this.deleteForm.length !== 0) {
        this.formList = this.noDeleteForm
        this.currentForm = this.formList.slice(0, 3)
      } else {
        console.log('1111')
        this.fun()
        console.log(this.formList)
        this.currentForm = this.formList.slice(0, 3)
      }
    },
    goBin() {
      this.formList = this.deleteForm
      this.currentForm = this.formList.slice(0, 3)
    },
  },
  created() {
    this.fun()
  },
})
</script>

<style scoped>
.home-list {
  display: flex;
  height: 100%;
}
.left-list {
  width: 200px;
  height: 100%-56px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px 16px;
  /* padding-top: 20px; */
  margin-top: 56px;
  border-right: 1px solid #e7e9eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.new-btn {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  background-color: #1488ed;
  cursor: pointer;
}
.new-btn-img {
  width: 16px;
}

.list-btn {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  color: #767c85;
  background-color: white;
  font-size: 12px;
  cursor: pointer;
}
.first {
  margin-top: 30px;
}
.list-btn-active {
  background-color: #f2f5fa;
}
.list-btn img {
  height: 16px;
  margin: auto 15px;
}
.right-list {
  position: relative;
  background-color: white;
  top: 56px;
  margin: 20px 20px;
  width: 78%;
  height: 420px;
  border: 1px solid #e7e9eb;
  font-size: 14px;
}
.star {
  position: absolute;
  top: 15px;
  right: 5%;
  color: #949aae;
  cursor: pointer;
}
.onlyStar {
  color: #1488ed;
}
.fullStar {
  color: #f8d61d;
}
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
.simple {
  margin: 50px auto 20px;
}
.list-simple div {
  width: 20%;
  text-align: center;
}
.list-simple .dosth {
  width: 40%;
  text-align: center;
}
.block {
  position: absolute;
  right: 5%;
}
</style>
