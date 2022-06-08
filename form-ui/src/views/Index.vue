<template>
  <div>首页</div>
  <button @click="fun1">新建表单</button>
  <button @click="fun2">编辑表单</button>
  <button @click="fun3">数据解析</button>
<<<<<<< HEAD
=======
  <button @click="fun4">表单填写</button>
  <button @click="fun5">个人中心</button>
>>>>>>> ed48d97 (表单填写和个人中心)
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      // todo: 从local storage中读取draftFormlist的信息，并进行合并
      // 删除时判断status的状态，如果是1，从localstorage中删除，否则，直接删除
      formList: [
        {
          status: 1,
          title: '表单标题1',
          subTitle: '表单描述1',
          problems: [
            {
              title: 'problem1Title',
              type: 'input',
              required: true,
              isNew: true,
              id: '13d2023b-77ca-41c4-bf92-476bf9f76d02',
            },
          ],
        },
        { status: 2, title: '表单标题2', subTitle: '表单描述1', problems: [] },
      ],
    }
  },
  methods: {
    fun1() {
      console.log('新建表单')
      this.$router.push({ name: 'CreateForm' })
    },
    fun2() {
      console.log('编辑表单')
      this.$router.push({
        name: 'CreateForm',
        query: {
          form: JSON.stringify(this.formList[0]),
        },
      })
    },
    fun3() {
      console.log('新建表单')
      this.$router.push({ name: 'datanayse' })
    },
<<<<<<< HEAD
=======
    fun4() {
      console.log('表单填写')
      this.$router.push('/write')
    },
    fun5() {
      console.log('个人中心')
      this.$router.push('/personal')
    },
>>>>>>> ed48d97 (表单填写和个人中心)
  },
  created() {
    console.log('读取draftFormList的信息')
  },
})
</script>
