//用户信息
export interface IUser {
  id: string
  account: string
  pwd: string
  status: number
  ctime: number
  utime: number
  nickname: string
  avatar: string
}

// 题目类型
export enum ProblemType {
  input = 'input',
  singleSelect = 'singleSelect',
  multiSelect = 'multiSelect',
  pullSelect = 'pullSelect',
  date = 'date',
  time = 'time',
  score = 'score',
}

export interface IProblemType {
  title: string
  type: ProblemType
}

// 题目
export interface IProblem extends IProblemType {
  required: boolean
  isNew?: boolean
  id?: string
  setting?: {
    options: {
      title: string
      status: 1 | 2
    }[]
  }
  result?: {
    value:
      | string
      | number
      | {
          id: string
          title: string
        }
      | {
          id: string
          title: string
        }[]
  }
}

//未修改的获取题目
export interface GetIlist {
  info: IProblems
  items: Onelist[]
}
export interface Getmsg {
  data: GetIlist
  stat: boolean
}
export interface Onelist {
  id: string
  formAuthor: string
  formId: string
  result: Result[]
}
export interface Result {
  title: string
  type: string
  required: boolean
  setting: Option
  id: string
  result: Value
}
export interface Value {
  value?:
    | string
    | number
    | {
        id: string
        title: string
      }
    | {
        id: string
        title: string
      }[]
}
export interface IProblems {
  id: string
  ctime: number
  utime: number
  status: number
  author: string
  isStar: boolean
  title: string
  subTitle: string
  problems: Problem[]
}
export interface Problem {
  title: string
  type: string
  required: boolean
  isNew: boolean
  id: string
  setting?: Option
  result: Result[]
}
export interface Option {
  options: Choice[]
}
export interface Choice {
  title: string
  status: number
  id?: string
}

export interface IForm {
  id: string
  ctime: number
  utime: number
  status: number
  author: string
  isStar: boolean
  title: string
  subTitle: string
  problems: IProblem[]
}
