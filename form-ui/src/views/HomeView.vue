<template>
  <div class="head_c">
    <div class="logo">
      <div class="logo-img">
        <img src="../assets/imgs/logo.svg" />
      </div>
      <h1 class="logo-title">金山表单</h1>
    </div>
    <div class="user" @click="show = !show" ref="s1">
      <div class="user-img">
        <img :src="userSrc" width="30px" />
      </div>
      <p class="user-title">{{ user.account }}</p>
    </div>
  </div>
  <div class="logout" v-show="show" ref="s2">
    <div>{{ user.account }}</div>
    <div @click="goPersonal">
      <a href="#">个人中心</a>
    </div>
    <div @click="logout">
      <a href="#">退出登录</a>
    </div>
  </div>
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
export default defineComponent({
  data() {
    return {
      user: {} as IUser,
      formList: [] as IForm[],
      userSrc: '',
      show: false,
      showOnlyStar: false,
    }
  },
  components: {
    FormList,
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
      if (this.user.avatar === '') {
        this.userSrc =
          'https://img2.baidu.com/it/u=3150609636,3981665520&fm=253&fmt=auto&app=138&f=JPEG?w=212&h=211'
      } else {
        this.userSrc = this.user.avatar
      }
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
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    goPersonal() {
      this.$router.push('/personal')
    },
  },
  created() {
    this.fun()
  },
  // mounted() {
  //   document.addEventListener(
  //     'click',
  //     (e) => {
  //       let s1: any = this.$refs.s1
  //       let s2: any = this.$refs.s2
  //       if (!s1.contains(e.target) && !s2.contains(e.target)) {
  //         this.show = false
  //       }
  //     },
  //     true
  //   )
  // },
})
</script>

<style scoped>
.head_c {
  display: flex;
  height: 56px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
  border-bottom: 1px solid #e7e9eb;
}
.logo {
  width: 110px;
  line-height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  vertical-align: middle;
}
.logo-title {
  font-size: 18px;
  font-weight: 500;
  color: #3c414b;
  margin: 0.67em 0;
}
.user {
  width: 100px;
  line-height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
}
.user-img {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
}
.user-img img {
  width: 30px;
}
.logout {
  position: absolute;
  right: 10px;
  z-index: 999999;
  width: 130px;
  background-color: white;
  padding: 0 15px;
  border: 1px solid #e7e9eb;
  text-align: center;
  font-size: 12px;
}
.logout div {
  height: 30px;
  line-height: 30px;
  margin: 8px;
}
.logout div:first-child {
  font-weight: bold;
  border-bottom: 1px solid #e7e9eb;
}
.logout div a {
  color: black;
}
.home-list {
  display: flex;
  height: 100%;
}
.left-list {
  /* width: 18%; */
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
</style>
