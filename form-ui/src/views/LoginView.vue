<template>
  <div class="login-main">
    <div class="head_c">
      <span class="login"></span>
    </div>
    <div class="login-wrapper">
      <div class="header">登录</div>
      <el-form :model="formData" :rules="rule" ref="form" class="demo-ruleForm">
        <el-form-item prop="account">
          <el-input
            type="text"
            v-model="formData.account"
            autocomplete="off"
            placeholder="用户名"
            class="form-same"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            type="password"
            v-model="formData.pwd"
            autocomplete="off"
            placeholder="密码"
            class="form-same"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="form-same btn" @click="loginSub()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <div class="msg">
        没有帐号？
        <a href="/register">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store/index'
import { login } from '../services/api'
import { getUserInfo } from '../services/api'
import { ElMessage } from 'element-plus'
export default defineComponent({
  data() {
    return {
      formData: {
        account: '',
        pwd: '',
      },
      rule: {
        account: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.-]+$/,
            message: '姓名不支持特殊字符',
            trigger: 'blur',
          },
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    async getUser() {
      const { data } = await getUserInfo()
      return data.user
    },
    async loginSub() {
      const res = await login(this.formData.account, this.formData.pwd)
      if (res.stat != 'ok') {
        ElMessage({
          message: res.msg,
          duration: 2000,
          type: 'error',
          customClass: 'msg-box-form-title',
        })
      } else {
        const user = await this.getUser()
        if (user.avatar === '') {
          user.avatar =
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp.qqan.com%2Fup%2F2020-6%2F2020061117234392390.jpg&refer=http%3A%2F%2Fp.qqan.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657875322&t=7af0ec2407cce8f44ff8e28224ee10f9'
        }
        store.commit('setUser', user)
        sessionStorage.setItem('token', 'Bearer xxxx')
        sessionStorage.setItem('user', JSON.stringify(user))
        this.$router.push({
          name: 'HomeView',
        })
      }
    },
  },
})
</script>

<style scoped>
.login-main {
  background-color: #f7f7f7;
  width: 100%;
  height: 100%;
}
.head_c {
  display: flex;
  height: 56px;
  width: 100%;
  margin: 0 auto;
  background-color: white;
  align-items: center;
}
.login {
  display: inline-block;
  margin-left: 64px;
  vertical-align: top;
  width: 88px;
  height: 22px;
  background-image: url(//ac.wpscdn.cn/account/libs/img/v1/logo.676137dd.png);
}
.login-wrapper {
  background-color: #fff;
  width: 450px;
  height: 360px;
  border-radius: 10px;
  padding: 0 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.header {
  font-size: 38px;
  color: #409eff;
  font-weight: bold;
  margin-left: 20px;
  letter-spacing: 20px;
  text-align: center;
  line-height: 110px;
}
.form-same {
  height: 40px;
  margin-bottom: 6px;
}
.btn {
  text-align: center;
  padding: 10px;
  width: 100%;
  color: #fff;
}
.msg {
  text-align: center;
}
a {
  text-decoration-line: none;
  color: #409eff;
}
</style>
