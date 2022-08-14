import { config } from './config'

const baseUrl = config.apiUrl

export const api = {
  get,
  post,
}

type Query = { [key: string]: string | number }

async function get<T = any>(path: string, query: Query = {}) {
  const params = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&')

  return callApi<T>(`${path}?${params}`, {
    method: 'get',
  })
}

async function post<T = any>(path: string, body = {}) {
  return callApi<T>(path, {
    method: 'post',
    body: JSON.stringify(body),
  })
}

async function callApi<T = any>(
  path: string,
  opts: RequestInit
): Promise<{ result: T | undefined; status: number; error?: string }> {
  const prefix = path.startsWith('/') ? '/api' : '/api'
  const res = await fetch(`${baseUrl}${prefix}${path}`, { credentials: 'include', ...opts, ...headers() })
  const json = await res.json()

  if (res.status === 401) {
    return { result: undefined, status: 401, error: 'Unauthorized' }
  }

  if (res.status >= 400) {
    return { result: undefined, status: res.status, error: json.message || res.statusText }
  }

  return { result: json, status: res.status, error: res.status >= 400 ? res.statusText : undefined }
}

function headers() {
  const headers: any = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  return { headers }
}
