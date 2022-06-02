import * as request from './request'
import { IProblemType, IProblem } from '../types'

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
