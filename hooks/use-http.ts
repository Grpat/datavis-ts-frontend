import { useState, useCallback } from 'react'

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export type UseHttpResult<T> = {
  isLoading: boolean
  error: string | null
  sendRequest: (requestConfig: RequestConfig, applyData: (data: T) => void) => void
}

type ApplyData<T> = (data: T) => void

const useHttp = <T>(): UseHttpResult<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const sendRequest = useCallback(async (requestConfig: RequestConfig, applyData: ApplyData<T>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method || 'GET',
        headers: requestConfig.headers || {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      })

      if (!response.ok) {
        throw new Error('Request failed!')
      }

      const data: T = await response.json()
      applyData(data)
    } catch (e) {
      setError((e as Error).message || 'Something went wrong!')
    }
    setIsLoading(false)
  }, [])

  return {
    isLoading,
    error,
    sendRequest,
  }
}

export default useHttp
