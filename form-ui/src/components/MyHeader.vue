<template>
  <div>
    <div class="head_c">
      <div class="logo">
        <div class="logo-img">
          <slot name="left-img"></slot>
        </div>
        <h1 class="logo-title">
          <slot name="left-name"></slot>
        </h1>
      </div>
      <slot name="right">
        <div class="user" tabindex="0">
          <div class="user-img">
            <img :src="userSrc" width="30px" />
          </div>
          <p class="user-title">{{ user.account }}</p>
          <div class="logout">
            <div>{{ user.account }}</div>
            <div @click="goPersonal">
              <a href="/personal">个人中心</a>
            </div>
            <div @click="goout">
              <a href="/login">退出登录</a>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IUser } from '../types'
import { getUserInfo, logout } from '../services/api'
// import store from '@/store/index'
export default defineComponent({
  data() {
    return {
      user: {} as IUser,
      // howshow: false,
      userSrc: '',
    }
  },
  methods: {
    async getUser() {
      const { data } = await getUserInfo()
      return data.user
    },
    async init() {
      this.user = await this.getUser()
      if (this.user.avatar === '') {
        this.userSrc =
          'https://img2.baidu.com/it/u=3150609636,3981665520&fm=253&fmt=auto&app=138&f=JPEG?w=212&h=211'
      } else {
        this.userSrc = this.user.avatar
      }
    },
    async goout() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
      await logout()
    },
    goPersonal() {
      this.$router.push('/personal')
    },
  },
  created() {
    this.init()
  },
  // computed: {
  //   monitor() {
  //     return store.getters.show
  //   },
  // },
  // watch: {
  //   monitor() {
  //     // console.log(newval)
  //     if (store.getters.show === 1) {
  //       this.howshow = false
  //     }
  //     console.log('okay')
  //     store.commit('showAction', 0)
  //   },
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
.user:focus-within .logout {
  display: initial;
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
  top: 56px;
  right: 10px;
  z-index: 999999;
  width: 130px;
  background-color: white;
  padding: 0 15px;
  border: 1px solid #e7e9eb;
  text-align: center;
  font-size: 12px;
  display: none;
}
/* .nologout {
  display: none;
} */
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
</style>
