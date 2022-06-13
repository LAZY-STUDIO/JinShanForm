<template>
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
      <div class="list-btn">表单列表</div>
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
        v-for="form in formList"
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
      ></FormList>
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
export default defineComponent({
  data() {
    return {
      user: {} as IUser,
      formList: [] as IForm[],
      showOnlyStar: false,
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
      const { data } = await getFormList(account)
      this.formList = data.items
      console.log(this.formList)
    },
    async fun() {
      this.user = await this.getUser()
      this.getList(this.user.account)
    },
    //删除表单
    async formDelete(id: string) {
      await deleteForm(id)
      this.fun()
    },
    //开始收集表单
    async formStart(id: string) {
      await startForm(id)
      this.fun()
    },
    //结束收集表单
    async formEnd(id: string) {
      await endForm(id)
      this.fun()
    },
    //表单标星
    async formStar(id: string) {
      await makeStar(id)
      this.fun()
    },
    //表单取消标星
    async formCancelStar(id: string) {
      await cancelStar(id)
      this.fun()
    },
    onlyShow() {
      if (!this.showOnlyStar) {
        this.showOnlyStar = true
        for (let i = 0; i < this.formList.length; i++) {
          if (!this.formList[i].isStar) {
            this.formList.splice(i, 1)
            i--
          }
        }
      } else {
        this.showOnlyStar = false
        this.fun()
      }
    },
    //跳转到新建表单
    newList() {
      this.$router.push('/createForm')
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
  min-width: 167px;
  max-width: 230px;
  height: 100%;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px 16px;
  border-right: 1px solid #e7e9eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}
.new-btn {
  width: 134px;
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
  margin-top: 40px;
  width: 167px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #767c85;
  background-color: #f2f5fa;
  cursor: pointer;
}
.right-list {
  position: relative;
  margin: 20px 20px;
  width: 78%;
  height: 78%;
  border: 1px solid #e7e9eb;
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
  font-size: 12px;
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
/* .dosth {
  display: flex;
  align-items: center;
} */
</style>
