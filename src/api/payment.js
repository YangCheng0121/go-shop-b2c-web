import axios, { HEADERS } from './config'

/**
 * 支付
 * @param sn
 * @returns {Promise<unknown>}
 */
export function payment(sn) {
  const url = '/payment/payment'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      sn: sn,
      tradeType: 'JSAPI'
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
