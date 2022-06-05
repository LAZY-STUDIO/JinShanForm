import * as request from './request'
import { IProblemType, IProblem, Getmsg, IForm, IUser } from '../types'

interface BaseRes {
  stat: string
  msg?: string
}

interface UserRes extends BaseRes {
  data: {
    user: IUser
  }
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

interface FormListRes extends BaseRes {
  data: {
    items: IForm[]
  }
}

/**
 * 用户注册
 * @param account 用户名
 * @param pwd 密码
 * @param confirmPwd 确认密码
 * @returns 登录成功与否
 */
export function register(account: string, pwd: string, confirmPwd: string) {
  return request.post<BaseRes>('/api/auth/register', {
    account,
    pwd,
    confirmPwd,
  })
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
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get<UserRes>('/api/user/getInfo')
}

/**
 * 获取表单列表
 */
export function getFormList(account: string) {
  return request.post<FormListRes>('/api/form/list', { account })
}

/**
 * 删除表单
 */
export function deleteForm(id: string) {
  return request.post<BaseRes>('/api/form/delete', { id })
}

/**
 * 开始收集表单
 */
export function startForm(id: string) {
  return request.post<BaseRes>('/api/form/start', { id })
}

/**
 * 结束收集表单
 */
export function endForm(id: string) {
  return request.post<BaseRes>('/api/form/end', { id })
}
/**
 * 表单标星
 */
export function makeStar(id: string) {
  return request.post<BaseRes>('/api/form/star', { id })
}

/**
 * 取消表单标星
 */
export function cancelStar(id: string) {
  return request.post<BaseRes>('/api/form/cancelStar', { id })
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
