<template>
  <div id="bg">
    <div class="headerNavigtion">
      <MyHeader>
        <template #left-img>
          <img src="../assets/imgs/logo.svg" />
        </template>
        <template #left-name> 金山表单 </template>
        <template #right></template>
      </MyHeader>
    </div>
    <div class="fix-box"></div>
    <div class="main-box">
      <div class="side-box" v-if="!flag && !flagg">
        <div class="side">
          <div class="count">
            <span>已填</span>
            <span
              ><i>{{ num }}</i
              >/{{ total }}</span
            >
          </div>
          <div class="progress">
            <el-progress
              :percentage="percent * 100"
              :show-text="false"
              v-if="!isNaN(parseInt(percent * 100))"
            />
          </div>
          <img src="../assets/imgs/返回.png" @click="changeSide" />
        </div>
      </div>
      <div class="side-content" v-if="flag && !flagg">
        <div class="menu-box">
          <div class="menu">
            <span>目录</span>
            <span
              ><i>{{ num }}</i
              >/{{ total }}</span
            >
          </div>
          <span
            ><img src="../assets/imgs/返回2.png" @click="changeSide"
          /></span>
        </div>
        <div class="menu-content" v-for="(item, index) in problems" :key="item">
          <a :href="'#problem' + index">
            <span>{{ index + 1 }}:{{ item.title }}</span>
            <span
              ><img
                src="../assets/imgs/勾选.png"
                v-if="numArr.indexOf(index) >= 0" />
              <img
                src="../assets/imgs/勾选1.png"
                v-if="numArr.indexOf(index) < 0"
            /></span>
          </a>
        </div>
      </div>
      <div class="header-box" v-if="flagg">
        <div class="header">
          <div class="header-left">
            <div class="header-progress">
              <span
                >填写进度(<i>{{ this.num }}</i
                >/{{ this.total }})</span
              >
              <el-progress
                :percentage="percent * 100"
                :show-text="false"
                v-if="!isNaN(parseInt(percent * 100))"
              />
            </div>
          </div>
          <div class="header-detail">
            <i>|</i><span @click="changeHeader">详情</span>
          </div>
        </div>
      </div>
      <div class="header-content">
        <div class="mask" v-if="flagg && flaggg"></div>
        <div class="catalogue" :style="{ bottom: height + 'px' }">
          <div class="title-catalogue">
            <span>题目目录(共{{ total }}题)</span>
            <img src="../assets/imgs/下拉.png" @click="changeHeader" />
          </div>
          <div class="catalogue-box">
            <div class="menu">
              <span>已填</span>
              <span
                ><i>{{ num }}</i
                >/{{ total }}</span
              >
            </div>
          </div>
          <div
            class="menu-content"
            v-for="(item, index) in problems"
            :key="item"
          >
            <a :href="'#problem' + index" @click="changeHeader">
              <span>{{ index + 1 }}:{{ item.title }}</span>
              <span
                ><img
                  src="../assets/imgs/勾选.png"
                  v-if="numArr.indexOf(index) >= 0" />
                <img
                  src="../assets/imgs/勾选1.png"
                  v-if="numArr.indexOf(index) < 0"
              /></span>
            </a>
          </div>
        </div>
      </div>
      <div
        class="fill-form-container"
        @click="findChange"
        @keyup="findChange"
        @change="findChange"
      >
        <div class="title">{{ title }}</div>
        <div class="subTitle">{{ subTitle }}</div>
        <div class="share-form" @click="visiable = !visiable">
          <img
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5pyq5pW055CGLzA15YWx55So6LWE5rqQL+S6jOe7tOeggeaMiemSrjMycHg8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI1MCUiIHkxPSI1NC41MjIxMzM2JSIgeDI9IjgzLjQ3OTIzNDYlIiB5Mj0iOTkuMjI5MzkyMSUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzBENTlEMyIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDA3NUUzIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxwYXRoIGQ9Ik0xMS4wNjgzODU5LDAuMTA4MDQzNzUzIEwxMS4wNjgzODU5LDEwLjExNTk4MzggQzExLjA2ODM4NTksMTAuNjY4MjY4NSAxMC42MjA2NzA2LDExLjExNTk4MzggMTAuMDY4Mzg1OSwxMS4xMTU5ODM4IEwxLjA2NDEyNDE3LDExLjExNTk4MzggQzAuNTExODM5NDE3LDExLjExNTk4MzggMC4wNjQxMjQxNjY3LDEwLjY2ODI2ODUgMC4wNjQxMjQxNjY3LDEwLjExNTk4MzggTDAuMDY0LDQuOTcgTDQuODkyMDU3OTcsNS4xNTI2NjM3IEw3Ljk0NSwwLjEwOCBMMTEuMDY4Mzg1OSwwLjEwODA0Mzc1MyBaIiBpZD0icGF0aC0yIj48L3BhdGg+CiAgICAgICAgPGZpbHRlciB4PSItMi45JSIgeT0iLTMuOSUiIHdpZHRoPSIxMDUuOCUiIGhlaWdodD0iMTA3LjclIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItNCI+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuMTI1IiBpbj0iU291cmNlR3JhcGhpYyI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICA8L2ZpbHRlcj4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9Ijk2LjQwMTQ4OTQlIiB5MT0iMzQuNjI1NDM1OCUiIHgyPSIyNS4xNzU4NzA5JSIgeTI9IjYzLjIxOTE3MzYlIiBpZD0ibGluZWFyR3JhZGllbnQtNSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzNEIyRkYiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwODFGQyIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8cGF0aCBkPSJNMTMuNjMwODg1OSwwLjExMzEzMjIzNSBMOS40NjEyMjA0Miw2LjkzNzgzNjcyIEM5LjQwODQxOTI3LDcuMDI0MjU5MDYgOS4zMjU4MTIxNSw3LjA4MjE1NzA4IDkuMjM0MTk5ODYsNy4xMDU2MTczIEM5LjE5Njg4MTkyLDcuMTE4MjMwMzkgOS4xNTYzNDU5Niw3LjEyNTE4ODExIDkuMTE0MTg0OTQsNy4xMjUxODgxMSBMMS4xMTA1OTA5Miw3LjEyNTE4ODExIEMxLjA0MTU1NTMzLDcuMTI1MTg4MTEgMC45ODU1OTA5MjMsNy4wNjkyMjM3IDAuOTg1NTkwOTIzLDcuMDAwMTg4MTEgQzAuOTg1NTkwOTIzLDYuOTc5MTE3MzYgMC45OTA5MTczMjMsNi45NTgzODg1MSAxLjAwMTA3NTE1LDYuOTM5OTI3ODggTDIuNDQzMzIxNDEsNC4zMTg4MTc0NiBDMi41MDkyMzg0OCw0LjE5OTAyMTA0IDIuNjM1MTM0NTIsNC4xMjQ1OTgxNSAyLjc3MTg2ODczLDQuMTI0NTk4MTUgTDcuOTM4NTkwOTIsNC4xMjQxMzIyMyBMMTAuMTYwMDMyNiwwLjI5OTg0Mzk1OCBDMTAuMjI3MTM4MiwwLjE4NDI2Mjk4NyAxMC4zNTA2ODY2LDAuMTEzMTMyMjM1IDEwLjQ4NDMzNTgsMC4xMTMxMzIyMzUgTDEzLjYzMDg4NTksMC4xMTMxMzIyMzUgWiBNOC4yMTMyODMyNiwwLjEyMjY1Mzg5IEM4LjI4MjMxODg1LDAuMTIyNjUzODkgOC4zMzgyODMyNiwwLjE3ODYxODI5NiA4LjMzODI4MzI2LDAuMjQ3NjUzODkgQzguMzM4MjgzMjYsMC4yNzA0MjI5OSA4LjMzMjA2NDE3LDAuMjkyNzU5NjM4IDguMzIwMjk3MzQsMC4zMTIyNTI1NTIgTDYuODgyNjg3MjIsMi42OTM3OTU5OSBDNi44MTQ3OTg3OCwyLjgwNjI1OTkxIDYuNjkzMDEwNzksMi44NzUgNi41NjE2NDQ5OSwyLjg3NSBMMy42NTY5MDQ0MSwyLjg3NSBDMy41ODc4Njg4MSwyLjg3NSAzLjUzMTkwNDQxLDIuODE5MDM1NTkgMy41MzE5MDQ0MSwyLjc1IEMzLjUzMTkwNDQxLDIuNzI3NTcxMjQgMy41Mzc5MzkwOSwyLjcwNTU1NTYzIDMuNTQ5Mzc1NjUsMi42ODYyNjE3MyBMNC45NjAwMjg3LDAuMzA2NDM5MDkyIEM1LjAyNzU1OTczLDAuMTkyNTExODA1IDUuMTUwMTc2ODEsMC4xMjI2NTM4OSA1LjI4MjYxNDk3LDAuMTIyNjUzODkgTDguMjEzMjgzMjYsMC4xMjI2NTM4OSBaIiBpZD0icGF0aC02Ij48L3BhdGg+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI3Ny44OTgwNzM0JSIgeTE9IjE5LjE0NjAyMjYlIiB4Mj0iNTMuNTAyMjIxOSUiIHkyPSI3Ny40MjM4MDI5JSIgaWQ9ImxpbmVhckdyYWRpZW50LTgiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMTI3NUVDIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwQzk3RjciIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLmnKrmlbTnkIYvMDXlhbHnlKjotYTmupAv5LqM57u056CB5oyJ6ZKuMzJweCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHJlY3QgaWQ9IuefqeW9ouWkh+S7vS0yIiBzdHJva2U9IiM5NDlBQUUiIHN0cm9rZS13aWR0aD0iMiIgeD0iMiIgeT0iMTgiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgcng9IjIiPjwvcmVjdD4KICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTQiIHN0cm9rZT0iIzk0OUFBRSIgc3Ryb2tlLXdpZHRoPSIyIiB4PSIyIiB5PSIyIiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIj48L3JlY3Q+CiAgICAgICAgPHJlY3QgaWQ9IuefqeW9ouWkh+S7vS0xNiIgc3Ryb2tlPSIjOTQ5QUFFIiBzdHJva2Utd2lkdGg9IjIiIHg9IjE4IiB5PSIyIiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIj48L3JlY3Q+CiAgICAgICAgPHJlY3QgaWQ9IuefqeW9ouWkh+S7vS01IiBmaWxsPSIjOTQ5QUFFIiB4PSI1IiB5PSIyMSIgd2lkdGg9IjYiIGhlaWdodD0iNiI+PC9yZWN0PgogICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tMTUiIGZpbGw9IiM5NDlBQUUiIHg9IjUiIHk9IjUiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPjwvcmVjdD4KICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTE3IiBmaWxsPSIjOTQ5QUFFIiB4PSIyMSIgeT0iNSIgd2lkdGg9IjYiIGhlaWdodD0iNiI+PC9yZWN0PgogICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIGZpbGw9IiM5NDlBQUUiIHg9IjI5IiB5PSIyNSIgd2lkdGg9IjIiIGhlaWdodD0iNiI+PC9yZWN0PgogICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tMTEiIGZpbGw9IiM5NDlBQUUiIHg9IjIxIiB5PSIyMSIgd2lkdGg9IjIiIGhlaWdodD0iNiI+PC9yZWN0PgogICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tMTMiIGZpbGw9IiM5NDlBQUUiIHg9IjIyIiB5PSIxNyIgd2lkdGg9IjUiIGhlaWdodD0iMiI+PC9yZWN0PgogICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tMTQiIGZpbGw9IiM5NDlBQUUiIHg9IjE3IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iMiI+PC9yZWN0PgogICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tMTIiIGZpbGw9IiM5NDlBQUUiIHg9IjE3IiB5PSIyMSIgd2lkdGg9IjIiIGhlaWdodD0iNiI+PC9yZWN0PgogICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tMyIgZmlsbD0iIzk0OUFBRSIgeD0iMjUiIHk9IjI5IiB3aWR0aD0iNiIgaGVpZ2h0PSIyIj48L3JlY3Q+CiAgICAgICAgPHJlY3QgaWQ9IuefqeW9ouWkh+S7vS02IiBmaWxsPSIjOTQ5QUFFIiB4PSIxNyIgeT0iMjkiIHdpZHRoPSI2IiBoZWlnaHQ9IjIiPjwvcmVjdD4KICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTEwIiBmaWxsPSIjOTQ5QUFFIiB4PSIyOSIgeT0iMTciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjwvcmVjdD4KICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTciIGZpbGw9IiM5NDlBQUUiIHg9IjI1IiB5PSIyNSIgd2lkdGg9IjUiIGhlaWdodD0iMiI+PC9yZWN0PgogICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tOSIgZmlsbD0iIzk0OUFBRSIgeD0iMjUiIHk9IjIxIiB3aWR0aD0iNiIgaGVpZ2h0PSIyIj48L3JlY3Q+CiAgICAgICAgPGcgaWQ9IuWTgeeJjExPR08v6KGo5Y2VLy9MT0dP5Y+N55m9LzE2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgOS4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8cGF0aCBkPSJNMTQsLTEgTDEsLTEgQy0wLjEwNDU2OTUsLTEgLTEsLTAuMTA0NTY5NSAtMSwxIEwtMSwxNCBDLTEsMTUuMTA0NTY5NSAtMC4xMDQ1Njk1LDE2IDEsMTYgTDE0LDE2IEMxNS4xMDQ1Njk1LDE2IDE2LDE1LjEwNDU2OTUgMTYsMTQgTDE2LDEgQzE2LC0wLjEwNDU2OTUgMTUuMTA0NTY5NSwtMSAxNCwtMSBaIiBpZD0i6JKZ54mIIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgICAgIDxnIGlkPSLnvJbnu4QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCA4LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i6YeR5bGx6KGo5Y2VIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjM3NTAwMCwgMi44NzUwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMuWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi41NjI1MDAsIDAuMDA1MDg4KSI+CiAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMyIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTIiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSLlvaLnirbnu5PlkIgiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMSkiIHhsaW5rOmhyZWY9IiNwYXRoLTIiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS42NDQwMTg1LC0xLjg4MDA4ODQ4IEMxMS43ODIwODk3LC0xLjg4MDA4ODQ4IDExLjg5NDAxODUsLTEuNzY4MTU5NjcgMTEuODk0MDE4NSwtMS42MzAwODg0OCBDMTEuODk0MDE4NSwtMS41OTI4NDg4MSAxMS44ODU2OTksLTEuNTU2MDc5NTIgMTEuODY5NjY3OSwtMS41MjI0NjcwOSBMNy41NDA5OTA0OSw3LjU1Nzg5NTExIEM3LjQ4OTM3NDY0LDcuNzAzMjkxNDkgNy4zNTA1OTY1OSw3LjgwNzQxMTUyIDcuMTg3NSw3LjgwNzQxMTUyIEwtMC43NDE5Mzg3ODUsNy44MDc0MTE1MiBDLTAuODgwMDA5OTcyLDcuODA3NDExNTIgLTAuOTkxOTM4Nzg1LDcuNjk1NDgyNzEgLTAuOTkxOTM4Nzg1LDcuNTU3NDExNTIgQy0wLjk5MTkzODc4NSw3LjUyMjc1ODk1IC0wLjk4NDczNDgwNCw3LjQ4ODQ4NDc5IC0wLjk3MDc4NDA4OSw3LjQ1Njc2NDQ4IEwwLjEyMzM3MDIyLDQuOTY4OTQwOTYgQzAuMTgzMjQ0NjUxLDQuODMyODAyMDEgMC4zMTc5MTQ0MDIsNC43NDQ5MTE1MiAwLjQ2NjYzODE3Niw0Ljc0NDkxMTUyIEw1LjY0NTA2MTIyLDQuNzQzOTExNTIgTDguMzgyMTI2MTksMC4wNjc3MTU3MjkxIEw5LjI4NDg3NDU4LC0xLjU4Njk4NTE4IEM5LjM4MzQ1MDQ2LC0xLjc2NzY3MDc0IDkuNTcyODQxNCwtMS44ODAwODg0OCA5Ljc3ODY2NzcyLC0xLjg4MDA4ODQ4IEwxMS42NDQwMTg1LC0xLjg4MDA4ODQ4IFoiIGlkPSLlvaLnirbnu5PlkIjlpIfku70tMiIgZmlsbD0iIzBENkJFOCIgb3BhY2l0eT0iMC4xNjkxNTQ1NzYiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbXVsdGlwbHk7IiBmaWx0ZXI9InVybCgjZmlsdGVyLTQpIiBtYXNrPSJ1cmwoI21hc2stMykiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDxnIGlkPSLlvaLnirbnu5PlkIjlpIfku70tMyI+CiAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stNyIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTYiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSLlvaLnirbnu5PlkIjlpIfku70tMiIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC01KSIgeGxpbms6aHJlZj0iI3BhdGgtNiI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IuefqeW9oiIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC04KSIgbWFzaz0idXJsKCNtYXNrLTcpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjEwMDA3MiwgNS4zMDM3NzMpIHJvdGF0ZSgtMzMwLjAwMDAwMCkgdHJhbnNsYXRlKC00LjEwMDA3MiwgLTUuMzAzNzczKSAiIHBvaW50cz0iMS4zMjc4NDYzNyA0Ljc2NzA0MjY0IDYuNzkzMjIyOTIgMS42MTE2MDYwMiA2Ljg3MjI5NzM1IDUuOTIxODY1NSAxLjU0Nzg0NDE0IDguOTk1OTM5OTkiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
            alt="qrCode"
          />
          <CustomModal :visible="visiable" :title="'邀请填写'">
            <qrcode :id="id"></qrcode>
            <!-- <div class="download"> -->
            <el-button type="primary" @click="down()" class="saveCodeBtn"
              >保存二维码</el-button
            >
            <!-- <a class="link" ></a> -->
            <!-- </div> -->
            <div class="copylink">
              <el-input v-model="link" disabled class="inputBtn" />
              <el-button
                type="primary"
                @click="copyLink('write')"
                class="linkBtn"
                >复制链接</el-button
              >
            </div>
          </CustomModal>
        </div>
        <component
          v-for="(item, index) in problems"
          :id="'problem' + index"
          :key="item"
          :is="componentType(item.type)"
          :problemType="item.type"
          :problemNumber="index"
          :resultValue="item.result.value"
          @resultValueInput="item.result.value = $event"
          :timeDateFormat="item.setting.options[0].title"
          @timeDateFormatChange="item.setting.options[0].title = $event"
          :problemOptions="item.setting.options"
          @optionTitleChange="
            (idx, newTitle) => (item.setting.options[idx].title = newTitle)
          "
          @delOptionTitle="item.setting.options.splice($event, 1)"
          @addOptionTitle="
            item.setting.options.push({
              title: '',
              status: 1,
            })
          "
          @radioOptionChange="item.result.value.title = $event"
          @checkboxOptionChange="
            item.result.value = $event.map((tmp) => ({
              id: tmp,
              title: tmp,
            }))
          "
        >
        </component>
        <div class="btn">
          <el-button @click="saveEdit">保存草稿</el-button>
          <el-button @click="submitForm" type="primary">提交表单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as request from '../services/api'
import InputProblem from '../components/InputProblem.vue'
import SelectProblem from '../components/SelectProblem.vue'
import CustomModal from '../components/CustomModal.vue'
import qrcode from '../components/qrcode.vue'
import MyHeader from '@/components/MyHeader.vue'
import { IForm, IProblem, ProblemType } from '../types'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'FormWrite',
  components: {
    InputProblem,
    SelectProblem,
    MyHeader,
    CustomModal,
    qrcode,
  },
  provide() {
    return {
      forefatherComponent: this,
      options: this.options,
    }
  },
  data() {
    return {
      options: {
        showActions: false,
      },
      title: '',
      subTitle: '',
      problems: [] as IProblem[],
      id: '',
      num: 0,
      total: 0,
      percent: 0,
      flag: false,
      flagg: false,
      flaggg: false,
      visiable: false,
      status: 0,
      height: -500,
      numArr: [] as Array<number>,
    }
  },
  computed: {
    link() {
      return window.location.origin + '/write' + '?id=' + this.$route.query.id
    },
  },
  watch: {
    flagg: {
      handler(newVal, oldVal) {
        if (window.innerWidth <= 748) {
          this.flagg = true
        }
        this.changeFlag()
      },
      immediate: true,
    },
  },
  methods: {
    // 判断动态使用的的组件名
    componentType(type: string) {
      if (
        type === ProblemType.input ||
        type === ProblemType.date ||
        type === ProblemType.time ||
        type === ProblemType.score
      )
        return 'InputProblem'
      else return 'SelectProblem'
    },
    checkDraft() {
      const ustr = sessionStorage.getItem('user')
      if (ustr) {
        const { account } = JSON.parse(ustr)
        const editDLstStr = localStorage.getItem(account + 'editDraftList')
        let editDraftList = [] as IForm[]
        if (editDLstStr) {
          editDraftList = JSON.parse(editDLstStr)
        }
        // 找到当前草稿
        let idx = -1
        for (let i = 0; i < editDraftList.length; ++i) {
          if (editDraftList[i].id === this.id) {
            idx = i
            break
          }
        }
        return idx
      }
    },
    getFormById: async function () {
      this.id = String(this.$route.query.id)
      const res = await request.getFormById(this.id)
      this.title = res.data.item.title
      this.subTitle = res.data.item.subTitle
      // 判断是否是草稿
      const ustr = sessionStorage.getItem('user')
      if (ustr) {
        const { account } = JSON.parse(ustr)
        const editDLstStr = localStorage.getItem(account + 'editDraftList')
        let editDraftList = [] as IForm[]
        if (editDLstStr) {
          editDraftList = JSON.parse(editDLstStr)
        }
        // 找到当前表单填写草稿
        let idx = -1
        for (let i = 0; i < editDraftList.length; ++i) {
          if (editDraftList[i].id === this.id) {
            idx = i
            break
          }
        }
        if (idx >= 0) {
          this.problems = editDraftList[idx].problems
          this.status = editDraftList[idx].status
        } else {
          this.problems = res.data.item.problems
        }
      }
    },
    submitForm: async function () {
      const res = await request.writeForm(this.id, this.problems)
      if (res.stat === 'ok') {
        if (this.status === 1) {
          const ustr = sessionStorage.getItem('user')
          if (ustr) {
            const { account } = JSON.parse(ustr)
            const editDLstStr = localStorage.getItem(account + 'editDraftList')
            let editDraftList = [] as IForm[]
            if (editDLstStr) {
              editDraftList = JSON.parse(editDLstStr)
            }
            // 找到当前草稿
            let idx = -1
            for (let i = 0; i < editDraftList.length; ++i) {
              if (editDraftList[i].id === this.id) {
                idx = i
                break
              }
            }
            editDraftList.splice(idx, 1)
            localStorage.setItem(
              account + 'editDraftList',
              JSON.stringify(editDraftList)
            )
          }
        }
        ElMessage({
          message: '填写成功',
          customClass: 'msg-box-form-title-success',
          duration: 1000 * 2,
          type: 'success',
        })
        this.$router.push('/')
      } else {
        ElMessage({
          message: res.msg,
          customClass: 'msg-box-form-title-success',
          duration: 1000 * 2,
          type: 'error',
        })
      }
    },

    // 检验value
    findChange() {
      this.num = 0
      this.numArr = []
      for (let k in this.problems) {
        if (
          this.problems[k].type === 'score' &&
          Number(this.problems[k].result?.value) > -1
        ) {
          this.num++
          this.numArr.push(Number(k))
        } else if (this.problems[k].type === 'multiSelect') {
          let arr = String(this.problems[k].result?.value).split(',')
          // Boolean(arr[0])也可判断空数组
          if (JSON.stringify(arr) != '[""]') {
            this.num++
            this.numArr.push(Number(k))
          }
        } else if (
          this.problems[k].type === 'singleSelect' ||
          this.problems[k].type === 'pullSelect'
        ) {
          let data = Object(this.problems[k].result?.value)
          if (data.title) {
            this.num++
            this.numArr.push(Number(k))
          }
        } else if (
          this.problems[k].result?.value &&
          this.problems[k].type != 'score'
        ) {
          this.num++
          this.numArr.push(Number(k))
        }
        this.total = parseInt(k) + 1
      }
      this.percent = this.num / this.total
    },
    // 保存草稿
    saveEdit() {
      const ustr = sessionStorage.getItem('user')
      if (ustr) {
        const { account } = JSON.parse(ustr)
        const editDLstStr = localStorage.getItem(account + 'editDraftList')
        let editDraftList = [] as { id; status; problems }[]
        if (editDLstStr) {
          editDraftList = JSON.parse(editDLstStr)
        }
        // 找到当前草稿
        let idx = -1
        for (let i = 0; i < editDraftList.length; ++i) {
          if (editDraftList[i].id === this.id) {
            idx = i
            break
          }
        }
        if (idx === -1) {
          editDraftList.push({
            id: this.id,
            status: 1,
            problems: this.problems,
          })
        } else {
          editDraftList[idx].problems = this.problems
        }
        localStorage.setItem(
          account + 'editDraftList',
          JSON.stringify(editDraftList)
        )
      }
    },
    changeSide() {
      this.flag = !this.flag
    },
    changeHeader() {
      this.flaggg = !this.flaggg
      this.height = -500 - this.height
    },
    changeFlag() {
      addEventListener('resize', () => {
        let screenWidth = window.innerWidth
        let result = screenWidth - 748
        this.flagg = result <= 0 ? true : false
        return result
      })
    },
    // 表单分享
    copyLink(val: string) {
      let url = window.location.origin + '/' + val + '?id=' + this.id
      let inputNode = document.createElement('input')
      inputNode.value = url
      document.body.appendChild(inputNode)
      inputNode.select()
      document.execCommand('Copy')
      inputNode.className = 'oInput'
      inputNode.style.display = 'none'
      ElMessage({
        message: '复制成功',
        customClass: 'msg-box-form-title-success',
        duration: 1000 * 2,
        type: 'success',
      })
    },
    down() {
      let img = document.getElementById('vueqr') as HTMLImageElement
      let url = img!.src
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      a.href = url
      a.download = 'url' + '.png'
      a.dispatchEvent(event)
    },
  },
  created() {
    this.getFormById()
  },
  beforeUpdate() {
    this.findChange()
  },
})
</script>

<style scoped>
#bg {
  background-color: #f5f5f9;
  scroll-behavior: smooth;
  height: 1000px;
  overflow-y: scroll;
}
.headerNavigtion {
  height: 56px;
  position: fixed;
  z-index: 999;
  background: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.fix-box {
  height: 56px;
  margin-bottom: 20px;
}
.share-form {
  position: absolute;
  width: 36px;
  height: 36px;
  padding: 2px;
  top: 40px;
  right: 26px;
  z-index: 3;
}
.saveCodeBtn {
  display: block;
  margin: 10px auto;
}
.copylink {
  display: flex;
  margin: 30px 0px 10px 0px;
}
.inputBtn,
.linkBtn {
  height: 40px;
}

.qrcode {
  width: 200px;
  height: 236px;
  display: flex;
  flex-direction: column;
  margin-top: 0px;
}
#vueqr {
  width: 161px;
  margin: auto;
}

.main-box {
  margin: auto;
  display: flex;
  justify-content: center;
}
.fill-form-container {
  position: relative;
  width: 776px;
  background-color: #fff;
  padding: 50px 88px;
  min-height: calc(100vh - 150px);
}
.side-box {
  width: 50px;
  margin-right: 20px;
}
.side {
  position: absolute;
  display: flex;
  width: 48px;
  height: 209px;
  border-radius: 25px;
  /* left: -10%; */
  top: 50%;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.count {
  display: flex;
  flex-direction: column;
}
.side span {
  text-align: center;
  font-size: 12px;
  color: #949aae;
  height: 18px;
}
span i {
  font-style: normal;
  color: #409eff;
}
.side img {
  margin-top: 5px;
  width: 32px;
}
.progress {
  height: 103px;
  width: 30px;
}
.side .el-progress {
  margin-bottom: 15px;
  width: 103px;
  transform: rotate(90deg);
  transform-origin: left;
  margin-left: 15px;
}
.side-content {
  width: 240px;
  height: 753.6px;
  background-color: #fff;
  margin-right: 16px;
  padding: 20px 20px 72px;
}
.menu-box {
  width: 200px;
  margin: auto;
  border-bottom: 1px solid #e2e6ed;
  margin-bottom: 10px;
}
.menu {
  display: inline-block;
  width: 180px;
  line-height: 33px;
  font-size: 12px;
  color: #949aae;
}
.side-content img {
  width: 16px;
}
.menu-content {
  width: 200px;
  line-height: 35px;
}
.menu-content a {
  display: block;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.menu-content span {
  display: flex;
  align-items: center;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}
.btn {
  display: flex;
  justify-content: center;
  margin: 30px;
}
.title {
  text-align: center;
  font-size: 25px;
  font-weight: 500;
  margin-bottom: 10px;
}
.subTitle {
  text-align: center;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
}
.header-content {
  display: none;
}
@media screen and (max-width: 748px) {
  .headerNavigtion,
  .fix-box {
    display: none;
  }
  .main-box {
    width: 100%;
    flex-direction: column;
  }
  .fill-form-container {
    width: 100%;
    padding: 5% 9%;
  }
  :deep(.modal-box) {
    width: 60%;
  }
  :deep(.modal-head) {
    padding: 8px 12px;
  }
  :deep(.qrcode) {
    width: 60%;
    height: 66%;
  }
  :deep(.modal-body) {
    padding: 10px;
  }
  :deep(#vueqr) {
    margin: 0px 3%;
  }
  :deep(.inputBtn) {
    height: 25px;
  }
  :deep(.saveCodeBtn) {
    height: 25px;
  }
  :deep(.linkBtn) {
    height: 25px;
  }
  :deep(.copylink) {
    margin-top: 10px;
  }
  .header-box {
    width: 100%;
    height: 58px;
    background-color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
  .header {
    width: 70%;
    height: 58px;
    border-radius: 5px;
    background-color: #9e9e9e0d;
    margin: 5px auto;
    display: flex;
    justify-content: center;
  }
  .header-left {
    width: 70%;
  }
  .header-content {
    display: block;
  }
  .header-progress {
    margin: 10px auto;
  }
  .header-box .header-detail span {
    margin-left: 2%;
    color: #409eff;
  }
  .header-box .header-detail i {
    font-style: normal;
    margin-left: 10px;
    margin-right: 10px;
    color: #ccc;
  }
  .header-detail {
    width: 50px;
    line-height: 58px;
  }
  .catalogue {
    position: fixed;
    width: 100%;
    padding: 0px 15px;
    transition: bottom 0.5s;
    left: 0;
    border-radius: 10px;
    background-color: #fff;
    z-index: 3;
  }
  .mask {
    background-color: black;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .title-catalogue {
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
  .title-catalogue img {
    float: right;
    height: 20px;
    margin: 10px 0px;
  }
  .menu {
    color: black;
    font-weight: 600;
  }
  .menu-content {
    width: 100%;
    /* display: flex;
    justify-content: space-between;
    align-items: center; */
  }
  .menu-content span {
    line-height: 40px;
    color: black;
  }
  .btn {
    flex-direction: column;
    align-items: center;
  }
  .btn button {
    width: 296.68px;
    margin-bottom: 20px;
    margin-left: 0px;
  }
}
</style>
