<template>
  <div class="main-header">
    <div class="header-title">
      <span class="header-word-wps">WPS</span
      ><span class="header-word-center">个人中心</span>
    </div>
    <div class="topbar">
      <div class="logout" @click="logout">退出帐号</div>
    </div>
  </div>
  <div class="container">
    <div class="mainInfo">
      <div class="avatar">
        <img :src="user.avatar" class="img-circle" />
      </div>
      <div class="avatar-username">
        <p>{{ user.nickname }}</p>
      </div>
      <div class="avatar-userid-level">
        <span class="avatar-userid">ID: {{ user.id }}</span>
      </div>
    </div>
    <div class="box">
      <div class="describe">设置个人信息</div>
      <div class="set" @click="setflag">设置</div>
    </div>
    <div class="box">
      <div class="describe">设置密码</div>
      <div class="set" @click="setflagg">设置</div>
    </div>

    <!-- 模态弹窗 -->
    <div :class="visible ? 'modal modal-visible' : 'modal'">
      <div class="modal-mask" @click="handleCloseClick" />
      <div class="modal-box">
        <div class="modal-head">
          <span>{{ title }}</span>
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="close"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            class="modal-close"
            @click="handleCloseClick"
          >
            <path
              d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
            ></path>
          </svg>
        </div>
        <div class="modal-body">
          <div v-if="flag">
            <p class="input">
              <span>原密码: </span>
              <el-input
                v-model="oldPwd"
                placeholder="Please input"
                show-password
              />
            </p>
            <p class="input">
              <span>新密码: </span>
              <el-input
                v-model="newPwd"
                placeholder="Please input"
                show-password
              />
            </p>
            <p class="input">
              <span>确认密码: </span>
              <el-input
                v-model="confirmPwd"
                placeholder="Please input"
                show-password
              />
            </p>
          </div>
          <div v-if="!flag">
            <p class="input">
              <span>昵称: </span>
              <el-input v-model="nickname" placeholder="Please input" />
            </p>
            <p class="input">
              <span>头像路径: </span>
              <el-input v-model="avatarUrl" placeholder="Please input" />
            </p>
            <p class="input">
              <span>头像预览: </span>
              <el-avatar shape="square" :size="80" :src="avatarUrl" />
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <el-button @click="handleCloseClick" plain>取消</el-button>
          <el-button @click="setPwd" v-if="flag" plain>确认</el-button>
          <el-button @click="setUserInfo" v-if="!flag" plain>确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IUser } from '@/types'
import { ElMessage } from 'element-plus'
import { defineComponent } from 'vue'
import * as request from '../services/api'
export default defineComponent({
  name: 'PersonalCenter',
  data() {
    return {
      user: {} as IUser,
      input: '',
      visible: false,
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
      nickname: '',
      avatarUrl: '',
      flag: false,
      title: '',
    }
  },
  methods: {
    logout: async function () {
      const res = await request.logout()
      if (res.stat === 'ok') {
        ElMessage({
          message: '退出成功',
          customClass: 'msg-box-form-title-success',
          duration: 1000 * 2,
          type: 'success',
        })
        this.$router.push('/login')
      } else {
        ElMessage({
          message: res.msg,
          customClass: 'msg-box-form-title-success',
          duration: 1000 * 2,
          type: 'error',
        })
      }
    },
    getPersonalInfo: async function () {
      this.user = JSON.parse(sessionStorage.user)
      console.log(this.user)
    },
    handleCloseClick() {
      this.visible = false
    },
    handleOpenClick() {
      this.visible = true
    },
    setflag() {
      this.title = '修改个人信息'
      this.flag = false
      this.visible = true
    },
    setflagg() {
      this.title = '修改密码'
      this.flag = true
      this.visible = true
    },
    setPwd: async function () {
      this.handleCloseClick()
      if (this.oldPwd && this.newPwd && this.confirmPwd) {
        const res = await request.changePwd(
          this.oldPwd,
          this.newPwd,
          this.confirmPwd
        )
        if (res.stat === 'ok') {
          this.user.pwd = this.newPwd
          sessionStorage.setItem('user', JSON.stringify(this.user))
          ElMessage({
            message: '修改成功',
            customClass: 'msg-box-form-title-success',
            duration: 1000 * 2,
            type: 'success',
          })
          this.$router.push('/login')
        } else {
          ElMessage({
            message: res.msg,
            customClass: 'msg-box-form-title-success',
            duration: 1000 * 2,
            type: 'error',
          })
        }
      } else {
        ElMessage({
          message: '密码不能为空',
          customClass: 'msg-box-form-title-success',
          duration: 1000 * 2,
          type: 'error',
        })
      }
    },
    setUserInfo: async function () {
      this.handleCloseClick()
      if (this.nickname || this.avatarUrl) {
        const res = await request.setInfo(this.nickname, this.avatarUrl)
        if (res.stat === 'ok') {
          this.user.nickname = this.nickname
          this.user.avatar = this.avatarUrl
          sessionStorage.setItem('user', JSON.stringify(this.user))
          ElMessage({
            message: '修改成功',
            customClass: 'msg-box-form-title-success',
            duration: 1000 * 2,
            type: 'success',
          })
          this.getPersonalInfo()
        } else {
          ElMessage({
            message: res.msg,
            customClass: 'msg-box-form-title-success',
            duration: 1000 * 2,
            type: 'error',
          })
        }
      }
    },
  },
  created() {
    this.getPersonalInfo()
  },
})
</script>

<style src="../assets/css/style.css" scoped></style>
<style scoped>
.container {
  max-width: 910px;
  min-width: 650px;
  margin: auto;
}
.main-header {
  width: 100%;
  height: 94px;
  background: #fafafa;
  box-shadow: 0 1px 0 0 #dbdbdb;
  display: block;
}
.main-header .header-title {
  line-height: 46px;
}
.header-title {
  font-size: 14px;
  color: #484848;
  letter-spacing: 0;
  line-height: 14px;
  padding-left: 20px;
}
.avatar-username {
  font-weight: 700;
  font-size: 16px;
  color: #383838;
  letter-spacing: 0;
}
.topbar {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: #e7e9eb;
  /* max-width: 910px; */
  margin-right: auto;
  margin-left: auto;
}
.logout {
  padding: 0 20px;
  margin: 16px 0;
  font-size: 12px;
  color: #969696;
  cursor: pointer;
}
.mainInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0px;
  background: #fff url(//qn.cache.wpscdn.cn/s1/avatar-bg.7d147f4.png) no-repeat
    100% 100%;
}
/* .avatar-box {
  position: relative;
} */
/* .avatar-box .ifshow:hover {
  opacity: 0.5;
} */
.avatar,
.img-circle {
  width: 80px;
  height: 80px;
  border-radius: 40px;
}
/* .ifshow {
  position: absolute;
  left: 0;
  top: 0;
  background-color: black;
  opacity: 0;
  line-height: 80px;
  text-align: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}*/
.avatar-userid {
  color: #666;
  line-height: 16px;
  font-size: 12px;
}

.container .box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: #fff;
  border: 1px solid #e7e9eb;
  border-radius: 2px;
  margin-top: 12px;
  padding: 0 30px;
}

.describe,
.set {
  margin-top: 30px;
  margin-bottom: 30px;
  line-height: 32px;
}
.set {
  color: #2e68f8;
  cursor: pointer;
}

.input {
  display: flex;
}
.input span {
  width: 20%;
  line-height: 32px;
}
.input el-button {
  width: 80%;
}
.el-avatar {
  background-image: url(https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png);
  background-size: cover;
}
</style>
