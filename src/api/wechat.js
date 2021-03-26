import axios from './config'

/**
 * 获取授权码
 */
export function getAuthorizedCode() {
  const url = '/wechat/authorized-code'
  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 授权登录
 * @param code
 */
export function authorizedLogin(code) {
  const url = '/wechat/authorized-login'

  return axios({
    url: url,
    method: 'GET',
    params: {
      code: code
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
