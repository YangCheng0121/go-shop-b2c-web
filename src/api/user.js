import axios, { HEADERS } from './config'

/**
 * 验证码登录
 * @param mobile
 * @param sms
 * @returns {Promise<*>}
 */
export function login({ mobile, sms }) {
  const url = '/user/login'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      mobile: mobile,
      sms: sms
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 注销登录
 * @returns {Promise<*>}
 */
export function logout() {
  const url = '/user/logout'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST)
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
