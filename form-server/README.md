# 大作业服务端

该作业核心功能参考金山表单进行实现。

## 要求

前端样式、交互以及提示等内容参考金山表单进行实现。
相较于金山表单，功能做了较多删减，这里是原型图[https://modao.cc/app/ZlAsY7aErb1kbbQZFPMz5](https://modao.cc/app/ZlAsY7aErb1kbbQZFPMz5)。

## 运行

```bash
# 下载依赖
$ npm i
# 构建
$ npm run build
# 运行
$ npm run serve
```

## 功能模块

- 用户模块
注册、登录、退出、设置用户信息、获取用户信息、修改密码
- 表单模块
创建、填写、搜索、查看填写详情
- 问题模块
收藏、取消收藏、获取收藏列表

## 接口列表

### Auth

- 注册

```ts
URL: /api/auth/register
Method: POST
Body: {
  account: string
  pwd: string
  confirmPwd: string
}
```

- 登录

```ts
URL: /api/auth/login
Method: POST
Body: {
  account: string
  pwd: string
}
```

- 退出登录

```ts
URL: /api/auth/logout
Method: POST
```

### User

- 获取用户信息

```ts
URL: /api/user/getInfo
Method: GET
```

- 设置用户信息

```ts
URL: /api/user/setInfo
Method: POST
Body: {
  nickname: string
  avatar: string
}
```

- 修改密码

```ts
URL: /api/user/changePwd
Method: POST
Body: {
  oldPwd: string
  pwd: string
  confirmPwd: string
}
```

### Form

- 获取列表

```ts
URL: /api/form/list
Method: POST
Body: {
  offset?: number
  limit?: number
  isStar?: boolean
}
```

- 创建表单

```ts
URL: /api/form/create
Method: POST
Body: {
  title: string
  subTitle: string
  problems: {
    title: string
    type: "input" | "singleSelect" | "multiSelect"| "pullSelect" | "date" | "time" | "score"
    required: boolean
    isNew: boolean
    setting?: {
      options: {
        title: string
        status: 1 | 2
      }[]
    }
  }[]
}
```

- 获取表单

```ts
URL: /api/form/get
Method: POST
Body: {
  id: string
}
```

- 删除表单

```ts
URL: /api/form/delete
Method: POST
Body: {
  id: string
}
```

- 表单标星

```ts
URL: /api/form/star
Method: POST
Body: {
  id: string
}
```

- 表单取消标星

```ts
URL: /api/form/cancelStar
Method: POST
Body: {
  id: string
}
```

- 填写表单

```ts
URL: /api/form/input
Method: POST
Body: {
  formId: string
  problems: {
    id: string
    title: string
    type: "input" | "singleSelect" | "multiSelect"| "pullSelect" | "date" | "time" | "score"
    required: boolean
    setting?: {
      options: {
        title: string
        status: 1 | 2
      }[]
    }
    result?: {
      value: string | number | {
          id: string
          title: string
        } | {
          id: string
          title: string
        }[]
    }
  }[]
}
```

- 获取表单填写详情

```ts
URL: /api/form/formResult/:formId
Method: GET
```

- 获取表单单个填写详情

```ts
URL: /api/form/detail/:id
Method: POST
```

- 开始收集表单

```ts
URL: /api/form/start
Method: POST
Body: {
  id: string
}
```

- 结束收集表单

```ts
URL: /api/form/end
Method: POST
Body: {
  id: string
}
```

### Problem

- 获取基础题目类型

```ts
URL: /api/problem/listType
Method: GET
```

- 获取基础题目

```ts
URL: /api/problem/listBasic
Method: GET
```

- 获取收藏的题目

```ts
URL: /api/problem/listStar
Method: POST
```

- 收藏题目

```ts
URL: /api/problem/star
Method: POST
Body: {
  problem: {
    title: string
    type: "input" | "singleSelect" | "multiSelect"| "pullSelect" | "date" | "time" | "score"
    required: boolean
    setting?: {
      options: {
        title: string
        status: 1 | 2
      }[]
    } 
  }
}
```

- 取消收藏题目

```ts
URL: /api/problem/cancelStar
Method: POST
Body: {
  id: string
}
```

### tmp:

```
<template>
  <div class="problem-container-outer">
    <div class="problem-titie-container">
      <span class="problem-number">{{ problemNumber }}.</span>
      <el-input
        v-model="title"
        autosize
        type="textarea"
        placeholder="请输入问题"
      />
      <!-- <textarea
        :readonly="titleReadOnly"
        ref="textarea"
        :style="{ height: textAreaHeight }"
        placeholder="请输入问题"
        class="problem-title"
      ></textarea> -->
    </div>
    <slot></slot>
    <div class="problem-actions" v-if="allowActions">操作部分</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import calcTextareaHeight from '../assets/utils/calcTextareaHeight'

export default defineComponent({
  name: 'ProblemBase',
  data() {
    return {
      textAreaHeight: '',
      title: this.problemTitle,
    }
  },
  emits: ['problemTitleChange'],
  props: {
    problemNumber: {
      type: Number,
      required: true,
    },
    problemTitle: {
      type: String,
      default: '',
    },
    titleReadOnly: {
      type: Boolean,
      default: false,
    },
    allowActions: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    title(newVal, oldVal) {
      this.$emit('problemTitleChange', newVal)
    },
  },
})
</script>

<style lang="less" scoped>
.problem-container-outer {
  position: relative;
  width: 100%;
  padding: 20px 24px 40px;
}

.problem-titie-container {
  padding: 8px 0 5px 0;
  // border-bottom: 1px solid blue;
  color: #3d4757;
  font-size: 14px;
  line-height: 18px;
  position: relative;

  .problem-number {
    position: absolute;
    top: 8px;
    z-index: 1;
  }

  .problem-title {
    min-height: 18px;
    max-width: 100%;
    font-family: Arial;
    font-weight: bold;
    font-size: inherit;
    resize: none;
    border: none;
    outline: none;
    text-indent: 20px;
    width: 100%;
    padding-top: 0px;
  }
}
</style>

```

