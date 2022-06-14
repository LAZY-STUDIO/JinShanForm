import { IProblem, ProblemType } from '../types'

// problem选项默认值
export function problemInit(problem: IProblem, flag = false) {
  const setting = {
    options: [{ title: '', status: 1 }] as {
      title: string
      status: 1 | 2
    }[],
  }
  const result = {
    value: '',
  } as {
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
  if (problem.type === ProblemType.input) {
    result.value = ''
  } else if (problem.type === ProblemType.score) {
    result.value = -1
  } else if (problem.type === ProblemType.date) {
    setting.options[0].title = 'YYYY/MM'
  } else if (problem.type === ProblemType.time) {
    setting.options[0].title = '时刻: 时-分(24小时制)'
  } else {
    setting.options.push({
      title: '',
      status: 1,
    })
    if (problem.type === ProblemType.multiSelect) {
      result.value = [] as { id: string; title: string }[]
    } else {
      result.value = {
        id: 'tmp',
        title: '',
      }
    }
  }
  if (!problem.setting) {
    problem.setting = setting
  }
  if (!problem.result) {
    problem.result = result
  }
  return !flag
    ? {
        setting,
        result,
        ...problem,
      }
    : {
        setting,
        ...problem,
        result,
      }
}

// 判断动态使用的的组件名
export function componentType(type: string) {
  if (
    type === ProblemType.input ||
    type === ProblemType.date ||
    type === ProblemType.time ||
    type === ProblemType.score
  )
    return 'InputProblem'
  else return 'SelectProblem'
}

export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
