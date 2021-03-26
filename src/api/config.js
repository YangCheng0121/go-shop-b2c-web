import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { BASE_URL } from '@/config/axios.config'
import { Toast } from 'vant'

import NProgress from 'nprogress' // progress bar

export const ERR_ERROR = 0
export const ERR_OK = 1
export const UNAUTHORIZED = 401
export const SERVER_ERROR = 500

export const HEADERS = {
  POST: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  PUT: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  FromData: {
    'Content-Type': 'multipart/form-data'
  }
}

function creatAxios() {
  const instance = axios.create({
    baseURL: BASE_URL
  })

  // 允许携带 cookie
  instance.defaults.withCredentials = true

  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    NProgress.start() // start progress bar
    const {
      headers,
      data
    } = config
    if (headers['Content-Type'] === HEADERS.POST['Content-Type']) {
      // 把一个参数对象格式化为一个字符串
      config.data = qs.stringify(data)
    } else if (headers['Content-Type'] === 'multipart/form-data') {
      config.data = data
    } else {
      headers['Content-Type'] = 'application/json'
    }
    config.headers = headers
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const data = response.data
    if (data.err_code === ERR_ERROR) {
      Toast(data.data)
    }
    if (data.err_code === UNAUTHORIZED) {
      store.dispatch('Logout').then(() => {
        store.dispatch('GetAuthorizedCode')
      })
      return response
    }
    NProgress.done()
    return response
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  })

  return instance
}

const Axios = creatAxios()

export default Axios
