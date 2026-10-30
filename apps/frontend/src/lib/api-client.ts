import { envConfig } from '@/config/env'

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options

    let url = `${envConfig.apiBaseUrl}${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }

    const defaultOptions: RequestInit = {
      ...restOptions,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    try {
      const response = await fetch(url, defaultOptions)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Network error occurred: ${response.status}`)
      }

      return (await response.json()) as T
    } catch (error) {
      console.error(`[API Client Error] Target: ${endpoint} ->`, error)
      throw error
    }
  },

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  },

  post<T>(endpoint: string, body: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) })
  },
}
