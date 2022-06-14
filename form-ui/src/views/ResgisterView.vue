<template>
  <div class="head_c">
    <span class="login"></span>
  </div>
  <div class="login-main">
    <div class="login-wrapper">
      <div class="header">注册</div>
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
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPwd">
          <el-input
            type="password"
            v-model="formData.confirmPwd"
            autocomplete="off"
            placeholder="确认密码"
            class="form-same"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="form-same btn" @click="registerSub"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
      <!-- <div class="form-wrapper">
        <el-input
          v-model="account"
          placeholder="用户名"
          clearable
          class="form-same"
        />
        <el-input
          v-model="pwd"
          placeholder="密码"
          clearable
          class="form-same"
        />
        <el-input
          v-model="confirmPwd"
          placeholder="确认密码"
          clearable
          class="form-same"
        />
        <el-button type="primary" class="form-same btn" @click="registerSub"
          >注册</el-button
        >
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { register } from '../services/api'
import { ElMessage } from 'element-plus'
export default defineComponent({
  data() {
    return {
      formData: {
        account: '',
        pwd: '',
        confirmPwd: '',
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
        confirmPwd: [
          { required: true, validator: this.validatePass2, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    validatePass2(rule: string, value: string, callback: any) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    async registerSub() {
      console.log('注册')
      const res = await register(
        this.formData.account,
        this.formData.pwd,
        this.formData.confirmPwd
      )
      console.log(res)
      if (res.stat != 'ok') {
        // alert(res.msg)
        ElMessage({
          message: res.msg,
          duration: 2000,
          type: 'error',
        })
      } else {
        ElMessage({
          message: '注册成功，为您跳转到登录页面',
          duration: 2000,
          type: 'success',
        })
        this.$router.push({
          name: 'LoginView',
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
  height: 380px;
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
