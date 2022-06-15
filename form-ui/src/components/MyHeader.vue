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
        <div
          class="user"
          tabindex="0"
          @click="howshow = !howshow"
          @blur="howshow = false"
        >
          <div class="user-img">
            <img :src="user.avatar" width="30px" />
          </div>
          <p class="user-title">{{ user.account }}</p>
          <div class="logout" v-show="howshow">
            <div>{{ user.account }}</div>
            <div @click="goPersonal" @click.stop>个人中心</div>
            <div @click="goout">退出登录</div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IUser } from '../types'
import { logout } from '../services/api'
export default defineComponent({
  data() {
    return {
      user: {} as IUser,
      howshow: false,
    }
  },
  methods: {
    async getUser() {
      let userStr = sessionStorage.getItem('user')
      let user = {} as IUser
      if (userStr) {
        user = JSON.parse(userStr)
      }
      return user
    },
    async init() {
      this.user = await this.getUser()
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
})
</script>

<style scoped>
.head_c {
  display: flex;
  position: fixed;
  height: 56px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
  margin-bottom: 56px;
  border-bottom: 1px solid #e7e9eb;
  background-color: white;
  clear: both;
  z-index: 9999;
}
.logo {
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
  /* width: 100px; */
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
  margin-right: 10px;
  border-radius: 15px;
  overflow: hidden;
}
.user-img img {
  width: 30px;
  height: 30px;
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
  box-shadow: 0 2px 12px 0 rgb(56 56 56 / 20%);
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
</style>
