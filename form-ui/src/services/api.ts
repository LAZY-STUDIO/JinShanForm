import * as request from './request'
import { IProblemType, IProblem, Getmsg } from '../types'

interface BaseRes {
  stat: string
  msg?: string
}

interface ProblemTypeListRes extends BaseRes {
  data: {
    problemTypes: IProblemType[]
  }
}

interface ProblemBasicListRes extends BaseRes {
  data: {
    basicProblems: IProblem[]
  }
}

interface CreateFormRes extends BaseRes {
  data: {
    id: string
  }
}

/**
 * 用户登录
 * @param account 用户名
 * @param pwd 密码
 * @returns 登录成功与否
 */
export function login(account: string, pwd: string) {
  return request.post<BaseRes>('/api/auth/login', { account, pwd })
}

/**
 * 获取基础题目类型
 */
export function getProblemTypeList() {
  return request.get<ProblemTypeListRes>('/api/problem/listType')
}

/**
 * 获取基础题目
 */
export function getProblemBasicList() {
  return request.get<ProblemBasicListRes>('/api/problem/listBasic')
}

/**
 * 创建表单
 * @param title
 * @param subTitle
 * @param problems
 * @returns
 */
export function createForm(
  title: string,
  subTitle: string,
  problems: IProblem[]
) {
  return request.post<CreateFormRes>('/api/form/create', {
    title,
    subTitle,
    problems,
  })
}

//获取表单填写详情
export function list(num: string) {
  return request.get<Getmsg>('/api/form/formResult/' + num)
}
