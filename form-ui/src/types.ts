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
  isNew: boolean
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
