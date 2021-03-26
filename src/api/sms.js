import axios, { HEADERS } from './config'

/**
 * 获取短信
 * @param mobile
 * @returns {Promise<*>}
 */
export function getSms(mobile) {
  const url = '/sms'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      mobile: mobile
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
