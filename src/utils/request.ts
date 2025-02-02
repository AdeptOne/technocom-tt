import axios, { type AxiosInstance } from 'axios'
import { StatusCodes } from 'http-status-codes'
import camelcaseKeys from 'camelcase-keys'

function createService(path: string): AxiosInstance {
  const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL + `/${path}`,
    timeout: 5000,
    transformResponse: (data, headers) => {
      if (data && headers['content-type'].includes('application/json')) {
        return camelcaseKeys(JSON.parse(data), { deep: true })
      }

      return data
    },
  })

  service.interceptors.response.use(
    (response) => {
      return response.data
    },
    (err) => {
      if (err.status === StatusCodes.UNAUTHORIZED) {
        alert('Тут был бы редирект на страницу логина')
      }
    },
  )

  return service
}

export default createService
