import axios from 'axios'

const LOCAL_HOST_PORTS = [5000, 5001, 5002, 5003]
const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)

const defaultBaseUrl = import.meta.env.VITE_API_URL || (isLocalhost
  ? `http://localhost:${LOCAL_HOST_PORTS[0]}/api`
  : 'https://formulaos-rij9.onrender.com/api')

const api = axios.create({
  baseURL: defaultBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    const isLocalRetry = isLocalhost && !import.meta.env.VITE_API_URL && config && !error.response

    if (isLocalRetry) {
      const currentBase = config.baseURL || defaultBaseUrl
      let currentPort = LOCAL_HOST_PORTS[0]
      try {
        currentPort = Number(new URL(currentBase).port) || LOCAL_HOST_PORTS[0]
      } catch {
        currentPort = LOCAL_HOST_PORTS[0]
      }

      const currentIndex = LOCAL_HOST_PORTS.indexOf(currentPort)
      config.__retryCount = (config.__retryCount || 0) + 1
      const nextPortIndex = currentIndex + config.__retryCount
      
      if (nextPortIndex < LOCAL_HOST_PORTS.length) {
        const nextPort = LOCAL_HOST_PORTS[nextPortIndex]
        config.baseURL = `http://localhost:${nextPort}/api`
        return api.request(config)
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
