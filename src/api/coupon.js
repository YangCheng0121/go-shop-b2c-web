import axios, { HEADERS } from './config'
import { getObjectKeyValueToString } from '@/utils/util'

/**
 * 兑换优惠券
 * @param code
 * @returns {Promise<*>}
 */
export function exchangeCoupon(code) {
  const url = '/coupon/exchange'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      code: code
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取优惠券列表
 * @param query
 * @param sortby
 * @param order
 * @param pageNumber
 * @param pageSize
 * @returns {Promise<*>}
 */
export function getCouponList({ query, sortby, order, pageNumber, pageSize }) {
  const url = '/coupon'

  return axios({
    url: url,
    method: 'GET',
    params: {
      query: getObjectKeyValueToString(query),
      sortby: sortby,
      order: order,
      pageNumber: pageNumber,
      pageSize: pageSize
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
