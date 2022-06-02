async function request<T>(method: string, url: string, data?: any) {
  const options: RequestInit = {
    method,
  }
  if (data) {
    options.headers = {
      'Content-Type': 'application/json; charset=utf-8',
    }
    options.body = JSON.stringify(data)
  }
  const res = await fetch(url, options)
  const json: T = await res.json()
  return json
}

export function get<T>(url: string) {
  return request<T>('GET', url)
}

export function post<T>(url: string, data?: any) {
  return request<T>('POST', url, data)
}
